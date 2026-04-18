import { Collection } from './Collection.js'
import { Channel } from './Channel.js'
import { GuildMember } from './GuildMember.js'
import { Role } from './Role.js'
import { RoleManager } from '../managers/RoleManager.js'

export class Guild {
  constructor(data, client) {
    this.id = data.id
    this.name = data.name
    this.icon = data.icon
    this.banner = data.banner
    this.description = data.description
    this.ownerId = data.ownerId
    this.createdAt = data.createdTimestamp ? new Date(data.createdTimestamp) : new Date()
    this.roles = new RoleManager(client, this)

    //TODO: перенести во внутрь менеджера что бы если force собрал инфу
    if (data.roles) {
      for (const role of data.roles) {
        this.roles._add(role)
      }
    }

    this.emojis = new Collection()
    if (data.emojis) {
      for (const emoji of data.emojis) {
        this.emojis.set(emoji.id, emoji)
      }
    }
    this.members = new Collection()
    this.channels = new Collection()
    this._client = client
  }

  get me() {
    return this.members.cache.get(this._client.user.id)
  }

  async fetch() {
    const data = await this._client.rest.getGuild(this.id)
    const guildData = data.info
    this.name = guildData.name
    this.icon = guildData.icon
    this.banner = guildData.banner
    this.description = guildData.description
    this.ownerId = guildData.ownerId

    if (guildData.roles) {
      this.roles.cache.clear()
      for (const role of guildData.roles) {
        this.roles._add(role)
      }
    }

    if (guildData.emojis) {
      this.emojis.clear()
      for (const emoji of guildData.emojis) {
        this.emojis.set(emoji.id, emoji)
      }
    }

    if (guildData.categories) {
      this.channels.clear()
      for (const category of guildData.categories) {
        const catChannel = new Channel({ ...category, type: 2 }, this._client)
        this.channels.set(catChannel.id, catChannel)
        this._client.channels.cache.set(catChannel.id, catChannel)
        for (const channel of category.channels || []) {
          const ch = new Channel({ ...channel, guildId: this.id }, this._client)
          this.channels.set(ch.id, ch)
          this._client.channels.cache.set(ch.id, ch)
        }
      }
    }
    return this
  }

  async fetchChannels() {
    await this.fetch() //апдейт всех this.channels (тяжелая залупа, переделать)
    return this.channels
  }

  async fetchMembers() {
    const data = await this._client.rest.getGuildUsers(this.id)
    this.members.clear()
    for (const user of data.online) {
      const member = new GuildMember({ ...user, guildId: this.id }, this._client)
      this.members.set(member.id, member)
    }
    for (const user of data.offline) {
      const member = new GuildMember({ ...user, guildId: this.id }, this._client)
      this.members.set(member.id, member)
    }
    return this.members
  }

  async fetchMember(userId) {
    const data = await this._client.rest.getGuildMember(this.id, userId)
    const member = new GuildMember({ ...data, guildId: this.id }, this._client)
    this.members.set(member.id, member)
    return member
  }

  async createChannel(name, type = 0, options = {}) {
    const res = await this._client.rest.createChannel(this.id, { name, type, ...options })
    const channel = new Channel(res.channel, this._client)
    this.channels.set(channel.id, channel)
    return channel
  }

  async deleteChannel(channelId) {
    await this._client.rest.deleteChannel(this.id, channelId)
    this.channels.delete(channelId)
  }

  async update(data) {
    await this._client.rest.updateGuild(this.id, data)
    await this.fetch()
  }

  async leave() {
    await this._client.rest.request('DELETE', `/user/@me/guilds/${this.id}`) //TODO: переделать нахуй
    this._client.guilds.cache.delete(this.id)
  }

  async fetchBans() {
    return this._client.rest.getGuildBans(this.id)
  }

  async ban(userId, reason, expires) {
    return this._client.rest.banUser(this.id, userId, reason, expires)
  }

  async unban(userId) {
    return this._client.rest.unbanUser(this.id, userId)
  }

  async kick(userId, reason) {
    return this._client.rest.kickUser(this.id, userId, reason)
  }

  async fetchAuditLogs(query = {}) {
    return this._client.rest.getAuditLogs(this.id, query)
  }

  async createInvite(channelId, options) {
    return this._client.rest.createInvite(this.id, channelId, options)
  }

  async createRole(options) {
    return this.roles.create(options)
  }


  async fetchInvites() {
    return this._client.rest.getGuildInvites(this.id)
  }

  async fetchVanityURL() {
    return this._client.rest.getVanityURL(this.id)
  }

  async createEmoji(name, image, options = {}) {
    const res = await this._client.rest.createEmoji(this.id, { name, image, ...options })
    this.emojis.set(res.id, res)
    return res
  }

  async deleteEmoji(emojiId) {
    await this._client.rest.deleteEmoji(this.id, emojiId)
    this.emojis.delete(emojiId)
  }

  async fetchEmojis() {
    const data = await this._client.rest.getGuildEmojis(this.id)
    this.emojis.clear()
    for (const emoji of data) this.emojis.set(emoji.id, emoji)
    return this.emojis
  }


  toString() {
    return this.name
  }
}