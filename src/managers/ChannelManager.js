import { Collection } from '../structures/Collection.js'
import { Channel } from '../structures/Channel.js'

export class ChannelManager {
  constructor(client) {
    this.client = client
    this.cache = new Collection()
  }

  async fetch(id, options = { cache: true, force: false }) {
    if (!options.force && this.cache.has(id)) return this.cache.get(id)
    const data = await this.client.rest.request('GET', `/channels/${id}`)
    const channel = new Channel(data, this.client)
    if (options.cache) this.cache.set(id, channel)
    return channel
  }

  addChannel(data) {
    const channel = new Channel(data, this.client)
    this.cache.set(channel.id, channel)
    return channel
  }

  async create(guildId, data) {
    const res = await this.client.rest.createChannel(guildId, data)
    const channel = new Channel(res.channel, this.client)
    this.cache.set(channel.id, channel)
    return channel
  }
}