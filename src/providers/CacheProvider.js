/**
 * @template K, V
 */
export class CacheProvider {
  /**
   * @param {K} key
   * @returns {Promise<V | undefined>}
   */
  async get(key) {
    throw new Error('Not implemented')
  }

  /**
   * @param {K} key
   * @param {V} value
   * @returns {Promise<void>}
   */
  async set(key, value) {
    throw new Error('Not implemented')
  }

  /**
   * @param {K} key
   * @returns {Promise<boolean>}
   */
  async has(key) {
    throw new Error('Not implemented')
  }

  /**
   * @param {K} key
   * @returns {Promise<boolean>}
   */
  async delete(key) {
    throw new Error('Not implemented')
  }

  /**
   * @returns {Promise<void>}
   */
  async clear() {
    throw new Error('Not implemented')
  }

  /**
   * @returns {Promise<number>}
   */
  async size() {
    throw new Error('Not implemented')
  }

  /**
   * @returns {Promise<Iterable<[K, V]>>}
   */
  async entries() {
    throw new Error('Not implemented')
  }
}