import {  permissions } from '../utils/permissions.js'
import { User } from './User.js'
import { Permissions } from '../structures/Permissions.js'

export class GuildMember {
  constructor(data, client) {
    this.id = data.id
    this.guildId = data.guildId
    this.user = new User({ id: data.id, username: data.username, avatar: data.avatar, client })
    this.nick = data.nickname ?? null //задаток на будущие никнеймы сервера
    this.joinedAt = data.joinedTimestamp ? new Date(data.joinedTimestamp) : new Date()
    this.roles = data.roles || []
    this._permissions = null
    this.owner = data.owner || false
    this._client = client
  }

  get displayName() {
    return this.nick || this.user.username
  }

  get permissions() {
    if (this._permissions !== null) return this._permissions
    const guild = this._client.guilds.cache.get(this.guildId)
    if (!guild) return 0n
    let perms = 0n
    for (const roleId of this.roles) {
      const role = guild.roles.cache.get(roleId)
      if (role) perms |= BigInt(role.permissions)
    }
    if (this.owner) perms |= 8n
    this._permissions = perms
    return perms
  }

  has(permission) {
    const permBit = typeof permission === 'string'
      ? permissions[permission]
      : BigInt(permission)
    if (!permBit) return false
    const perms = BigInt(this.permissions)
    // Администратор имеет всё
    if ((perms & 8n) !== 0n) return true
    return (perms & permBit) !== 0n
  }

  permissionsIn(channel) {
    if (!channel || !channel.guildId) {
      throw new Error('Invalid channel object. Did you pass a Channel instance?')
    }
    if (channel.guildId !== this.guildId) {
      throw new Error('Channel not in same guild')
    }
    return channel.permissionsFor(this)
  }

  async addRole(roleId) {
    await this._client.rest.addRole(this.guildId, this.id, roleId)
    if (!this.roles.includes(roleId)) this.roles.push(roleId)
    this._permissions = null
  }

  async removeRole(roleId) {
    await this._client.rest.removeRole(this.guildId, this.id, roleId)
    this.roles = this.roles.filter(r => r !== roleId)
    this._permissions = null
  }

  async kick(reason) {
    await this._client.rest.kickUser(this.guildId, this.id, reason)
  }

  async ban(reason, expires) {
    await this._client.rest.banUser(this.guildId, this.id, reason, expires)
  }

  async fetch() {
    const data = await this._client.rest.getGuildMember(this.guildId, this.id)
    Object.assign(this, data)
    this._permissions = null
    return this
  }


  async setNickname(nick) { //аналошично задаток 
    await this._client.rest.setNickname(this.guildId, this.id, { nickname: nick })
    this.nick = nick
    return this
  }


  get permissionsObject() {
    return new Permissions(this.permissions)
  }

  toString() {
    return `<@${this.id}>`
  }
}