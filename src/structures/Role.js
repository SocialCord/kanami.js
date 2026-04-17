export class Role {
  constructor(data, client) {
    this.id = data.id
    this.name = data.name
    this.color = data.color
    this.permissions = data.permissions
    this.position = data.position
    this.hoist = data.hoist || false
    this.mentionable = data.mentionable || false
    this.managed = data.managed || false
    this.guildId = data.guildId 
    this._client = client
  }

  async edit(data) {
    const guild = await this._client.guilds.fetch(this.guildId)
    const roleIndex = guild.roles?.findIndex(r => r.id === this.id)
    if (roleIndex === -1) throw new Error('Role not found in guild')
    const updatedRole = { ...this, ...data }
    guild.roles[roleIndex] = updatedRole
    await this._client.rest.updateGuild(guild.id, { roles: guild.roles })
    Object.assign(this, updatedRole)
    return this
  }

  async setName(name) {
    return this.edit({ name })
  }

  async setColor(color) {
    const resolved = require('../utils/Util.js').Util.resolveColor(color) //пока оставим так.... 
    return this.edit({ color: resolved })
  }

  async setPermissions(permissions) {
    const perms = typeof permissions === 'bigint' ? permissions : BigInt(permissions)
    return this.edit({ permissions: perms.toString() })
  }

  async setHoist(hoist = true) {
    return this.edit({ hoist })
  }

  async setMentionable(mentionable = true) {
    return this.edit({ mentionable })
  }

 

  async delete() {
    await this._client.rest.deleteRole(this.guildId, this.id)
    this._client.roles.cache.delete(this.id)
    if (this._client.guilds.cache.get(this.guildId)?.roles.cache) {
      this._client.guilds.cache.get(this.guildId).roles.cache.delete(this.id)
    }
  }

  toString() {
    return `<@&${this.id}>`
  }
}