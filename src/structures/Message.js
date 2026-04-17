import { User } from './User.js'
import { EmbedBuilder } from '../builders/EmbedBuilder.js'

export class Message {
  constructor(data, client) {
    this.id = data.id
    this.content = data.content || ''
    this.author = data.author ? new User({ ...data.author, client }) : null
    this.channelId = data.channelId
    this.guildId = data.guildId || null
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date()
    this.editedAt = data.editedAt ? new Date(data.editedAt) : null
    this.attachments = data.attachments || []
    this.embeds = data.embeds || []
    this.mentions = (data.mentions || []).map(m => new User({ ...m, client }))
    this.pinned = data.pinned || false
    this.type = data.type || 0
    this.reactions = data.reactions || []
    this.repliedMessage = data.replied ? data.replied : null
    this._client = client
  }

  _normalizePayload(content, options = {}) {
    const payload = { ...options }
    if (typeof content === 'object' && content !== null) {
      if (content instanceof EmbedBuilder) payload.embeds = [content.toJSON()]
      else if (Array.isArray(content)) payload.embeds = content.map(item => item instanceof EmbedBuilder ? item.toJSON() : item)
      else if (content.embeds || content.title || content.description || content.fields) payload.embeds = [content]
      else payload.content = String(content)
    } else if (content !== undefined && content !== null) payload.content = String(content)
    if (options.components) payload.components = options.components.map(comp => comp.toJSON ? comp.toJSON() : comp)
    return payload
  }


  get channel() {
    return this._client.channels.cache.get(this.channelId)
  }

  get guild() {
    if (!this.guildId) return null
    return this._client.guilds.cache.get(this.guildId)
  }

  async reply(content, options = {}) {
    if (typeof content === 'object' && content !== null && !options.channelId) {
      options = { ...content, ...options }
      content = options.content || ''
    }
    return new Promise((resolve, reject) => {
      this._client.ws.sendMessage(this.channelId, content, {
        guildId: this.guildId,
        replyTo: this.id,
        ...options
      }, (err, result) => {
        if (err) reject(err)
        else {
          const msg = new Message({ ...result, channelId: this.channelId, guildId: this.guildId }, this._client)
          resolve(msg)
        }
      })
    })
  }

  async edit(content, options = {}) {
    return new Promise((resolve, reject) => {
      const payload = this._normalizePayload(content, options)
      this._client.ws.editMessage(this.channelId, this.id, payload, (err, result) => {
        if (err) reject(err)
        else {
          Object.assign(this, result)
          resolve(this)
        }
      })
    })
  }

  async delete() {
    return new Promise((resolve, reject) => {
      this._client.ws.deleteMessage(this.channelId, this.id, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  async pin() {
    return new Promise((resolve, reject) => {
      this._client.ws.pinMessage(this.channelId, this.id, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  async unpin() {
    return new Promise((resolve, reject) => {
      this._client.ws.unpinMessage(this.channelId, this.id, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  async addReaction(emojiId) {
    return this._client.ws.addReaction(this.channelId, this.id, emojiId)
  }

  async removeReaction(emojiId) {
    return this._client.ws.removeReaction(this.channelId, this.id, emojiId)
  }


  async awaitMessageComponent(filter, { time = 60000 } = {}) {
    return new Promise((resolve, reject) => {
      const handler = (interaction) => {
        if (interaction.messageId === this.id && (!filter || filter(interaction))) {
          this._client.off('interactionCreate', handler)
          clearTimeout(timeout)
          resolve(interaction)
        }
      }
      this._client.on('interactionCreate', handler)
      const timeout = setTimeout(() => {
        this._client.off('interactionCreate', handler)
        reject(new Error('Await component timeout'))
      }, time)
    })
  }

  async awaitReactions(filter, { time = 60000, max = 1 } = {}) {
    return new Promise((resolve, reject) => {
      const collected = []
      const handler = (reaction, user) => {
        if (reaction.messageId === this.id && (!filter || filter(reaction, user))) {
          collected.push({ reaction, user })
          if (collected.length >= max) {
            this._client.off('messageReactionAdd', handler)
            clearTimeout(timeout)
            resolve(collected)
          }
        }
      }
      this._client.on('messageReactionAdd', handler)
      const timeout = setTimeout(() => {
        this._client.off('messageReactionAdd', handler)
        reject(new Error('Await reactions timeout'))
      }, time)
    })
  }

  toString() {
    return this.content
  }
}