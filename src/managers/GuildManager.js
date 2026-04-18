import { Collection } from '../structures/Collection.js'
import { Guild } from '../structures/Guild.js'

export class GuildManager {
  constructor(client) {
    this.client = client
    this.cache = new Collection()
  }

  async fetch(id, options = { cache: true, force: false }) {
    if (!options.force && this.cache.has(id)) return this.cache.get(id)
    const data = await this.client.rest.getGuild(id)
    const guild = new Guild(data.info, this.client)
    if (options.cache) this.cache.set(id, guild)
    return guild
  }

  async fetchUserGuilds() {
    const data = await this.client.rest.getUserGuilds()
    const guilds = new Collection()
    for (const guildData of data) {
      const guild = new Guild(guildData, this.client)
      guilds.set(guild.id, guild)
      if (!this.cache.has(guild.id)) this.cache.set(guild.id, guild)
    }
    return guilds
  }

  addGuild(data) {
    const guild = new Guild(data, this.client)
    this.cache.set(guild.id, guild)
    return guild
  }

  async create(name, icon) {
    const res = await this.client.rest.createGuild(name, icon)
    const guild = new Guild(res, this.client)
    this.cache.set(guild.id, guild)
    return guild
  }

  async delete(guildId) {
    await this.client.rest.deleteGuild(guildId)
    this.cache.delete(guildId)
  }
}