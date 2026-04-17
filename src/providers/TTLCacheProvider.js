import { MemoryCacheProvider } from './MemoryCacheProvider.js'


//удобная залупа может кому то пригодиться всё же 
export class TTLCacheProvider extends MemoryCacheProvider {
  constructor(ttl = 60000) {
    super()
    this.ttl = ttl
    this.timeouts = new Map()
  }

  async set(key, value, ttl = this.ttl) {
    await super.set(key, value)
    if (this.timeouts.has(key)) clearTimeout(this.timeouts.get(key))
    const timeout = setTimeout(() => {
      this.delete(key)
      this.timeouts.delete(key)
    }, ttl)
    this.timeouts.set(key, timeout)
  }

  async delete(key) {
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key))
      this.timeouts.delete(key)
    }
    return super.delete(key)
  }

  async clear() {
    for (const timeout of this.timeouts.values()) clearTimeout(timeout)
    this.timeouts.clear()
    return super.clear()
  }
}