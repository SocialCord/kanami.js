export interface CacheProvider<K = any, V = any> {
  get(key: K): Promise<V | undefined>
  set(key: K, value: V): Promise<void>
  has(key: K): Promise<boolean>
  delete(key: K): Promise<boolean>
  clear(): Promise<void>
  size(): Promise<number>
  entries(): Promise<Iterable<[K, V]>>
}

export class MemoryCacheProvider<K = any, V = any> implements CacheProvider<K, V> {
  cache: Map<K, V>
  get(key: K): Promise<V | undefined>
  set(key: K, value: V): Promise<void>
  has(key: K): Promise<boolean>
  delete(key: K): Promise<boolean>
  clear(): Promise<void>
  size(): Promise<number>
  entries(): Promise<Iterable<[K, V]>>
}