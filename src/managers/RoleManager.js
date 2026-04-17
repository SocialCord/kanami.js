import { Collection } from '../structures/Collection.ts'
import { Role } from '../structures/Role.js'

export class RoleManager {
  constructor(client, guild) {
    this.client = client
    this.guild = guild
    this.cache = new Collection()
  }


  _add(data) {
    const role = new Role({ ...data, guildId: this.guild.id }, this.client)
    this.cache.set(role.id, role)
    return role
  }

  async fetch(id, options = { cache: true, force: false }) {
    //TODO: ПЕРЕНЕСТИ НА ОТДЕЛЬНЫЙ ЭНДПОИНТ
    if (!options.force && this.cache.has(id)) return this.cache.get(id)
    await this.guild.fetch()
    return this.cache.get(id)
  }

  async create(options) {
    const { name, color, permissions, hoist, mentionable } = options
    const res = await this.client.rest.createRole(this.guild.id, {
      name, color, permissions, hoist, mentionable
    })
    const role = this._add(res.role)
    return role
  }

  async edit(roleId, data) {
    const res = await this.client.rest.editRole(this.guild.id, roleId, data)
    const role = this._add(res.role)
    return role
  }

  async delete(roleId) {
    await this.client.rest.deleteRole(this.guild.id, roleId)
    this.cache.delete(roleId)
  }
}