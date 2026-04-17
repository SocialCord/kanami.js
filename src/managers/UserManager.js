import { Collection } from '../structures/Collection.ts'
import { User } from '../structures/User.js'

export class UserManager {
  constructor(client) {
    this.client = client
    this.cache = new Collection()
  }

  async fetch(id, options = { cache: true, force: false }) {
    if (!options.force && this.cache.has(id)) return this.cache.get(id)
    const path = id === '@me' ? '/user/@me' : `/user/${id}`
    const data = await this.client.rest.request('GET', path)
    const user = new User({ ...data, client: this.client })
    if (options.cache) this.cache.set(user.id, user)
    return user
  }

  addUser(data) {
    const user = new User({ ...data, client: this.client })
    this.cache.set(user.id, user)
    return user
  }

  async createDM(userId) {
    const channel = await this.client.rest.createDM(userId)
    return this.client.channels.addChannel(channel)
  }
}