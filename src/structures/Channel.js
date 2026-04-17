import { hasChannelPermissionForUser, permissions } from '../utils/permissions.js'
import { Message } from './Message.js'
import {MessageCollector} from '../structures/MessageCollector.js'

export class Channel {
  constructor(data, client) {
    this.id = data.id
    this.type = data.type ?? 0
    this.name = data.name ?? null
    this.topic = data.description ?? null
    this.guildId = data.guildId ?? null
    this.position = data.position ?? 0
    this.lastMessageId = data.lastMessageId ?? null
    this.rateLimitPerUser = data.rateLimitPerUser ?? 0
    this.nsfw = data.nsfw ?? false
    this.categoryId = data.categoryId ?? null
    this.permissionOverwrites = data.permissionsOverrides ?? { roles: [], users: [] }
    this.messages = new (client.structures.Collection)() // кеш сообщений
    this._client = client
  }

  async send(content, options = {}) {
    return new Promise((resolve, reject) => {
      this._client.ws.sendMessage(this.id, content, options, async (err, result) => {
        if (err) reject(err)
        else {
          const msg = new Message({ ...result, channelId: this.id, guildId: this.guildId }, this._client)
          this.messages.set(msg.id, msg)
          resolve(msg)
        }
      })
    })
  }

  async edit(channelData) {
    const res = await this._client.rest.updateChannel(this.guildId, this.id, channelData)
    Object.assign(this, res.channel)
    return this
  }

  async delete() {
    await this._client.rest.deleteChannel(this.guildId, this.id)
    this._client.channels.cache.delete(this.id)
  }

  async fetchMessages(limit = 50, before = null) {
    const params = { limit }
    if (before) params.before = before
    const data = await this._client.rest.getChannelHistory(this.guildId, this.id, params)
    const messages = data.history.map(msg => new Message(msg, this._client))
    for (const msg of messages) this.messages.set(msg.id, msg)
    return messages
  }

  async pinMessage(messageId) {
    return this._client.rest.pinMessage(this.id, messageId)
  }

  async unpinMessage(messageId) {
    return this._client.rest.unpinMessage(this.id, messageId)
  }

  async addReaction(messageId, emojiId) {
    return this._client.rest.addReaction(this.id, messageId, emojiId)
  }

  async removeReaction(messageId, emojiId) {
    return this._client.rest.removeReaction(this.id, messageId, emojiId)
  }


  permissionsFor(member) {
    if (member.guildId !== this.guildId) throw new Error('Member not in same guild')
    const guild = this._client.guilds.cache.get(this.guildId)
    if (!guild) return { has: () => false, bitfield: 0n }

    if (member.id === guild.ownerId) {
      return {
        has: () => true,
        bitfield: 8n 
      }
    }

    const bitfield = hasChannelPermissionForUser(
      member.id,
      member.roles,
      this.permissionOverwrites,
      undefined,
      guild.roles,
      guild.ownerId
    )

    const bitfieldBig = BigInt(bitfield)
    const isAdmin = (bitfieldBig & 8n) !== 0n

    return {
      has: (perm) => {
        const permBit = typeof perm === 'string' ? permissions[perm] : BigInt(perm)
        if (!permBit) return false
        if (isAdmin) return true
        return (bitfieldBig & permBit) !== 0n
      },
      bitfield: bitfieldBig
    }
  }



  async sendTyping() {
    this._client.ws.socket?.emit('typing://start', {
      channelId: this.id,
      userId: this._client.user.id,
      guildId: this.guildId
    })
  }

  async bulkDelete(messages) {
    const ids = messages.map(m => typeof m === 'string' ? m : m.id)
    return this._client.rest.bulkDeleteMessages(this.guildId, this.id, { messages: ids })
  }

  createMessageCollector(filter, options = {}) {
    return new MessageCollector(this, filter, options)
  }

  async fetchInvites() {
    return this._client.rest.getChannelInvites(this.guildId, this.id)
  }

  async createInvite(options = {}) {
    return this._client.rest.createInvite(this.guildId, this.id, options)
  }


  toString() {
    return `<#${this.id}>`
  }

  isText() { return this.type === 0 }
  isVoice() { return this.type === 1 }
  isCategory() { return this.type === 2 }
}