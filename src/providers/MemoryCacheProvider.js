import { CacheProvider } from './CacheProvider.js'
import { Collection } from '../structures/Collection.js'


//тоже может пригодиться на всякий случай (захуярить сюда кластеры потом, имба)
export class MemoryCacheProvider extends CacheProvider {
  constructor() {
    super()
    /** @type {Collection<any, any>} */
    this.cache = new Collection()
  }

  async get(key) {
    return this.cache.get(key)
  }

  async set(key, value) {
    this.cache.set(key, value)
  }

  async has(key) {
    return this.cache.has(key)
  }

  async delete(key) {
    return this.cache.delete(key)
  }

  async clear() {
    this.cache.clear()
  }

  async size() {
    return this.cache.size
  }

  async entries() {
    return this.cache.entries()
  }
}