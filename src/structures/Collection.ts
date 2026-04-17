export class Collection<K, V> extends Map<K, V> {
  constructor(entries?: readonly (readonly [K, V])[] | null) {
    super(entries)
  }

  find(fn: (value: V, key: K) => boolean): V | undefined {
    for (const [key, val] of this) {
      if (fn(val, key)) return val
    }
    return undefined
  }

  filter(fn: (value: V, key: K) => boolean): Collection<K, V> {
    const results = new Collection<K, V>()
    for (const [key, val] of this) {
      if (fn(val, key)) results.set(key, val)
    }
    return results
  }

  map<T>(fn: (value: V, key: K) => T): T[] {
    const arr: T[] = []
    for (const [key, val] of this) {
      arr.push(fn(val, key))
    }
    return arr
  }

  some(fn: (value: V, key: K) => boolean): boolean {
    for (const [key, val] of this) {
      if (fn(val, key)) return true
    }
    return false
  }

  every(fn: (value: V, key: K) => boolean): boolean {
    for (const [key, val] of this) {
      if (!fn(val, key)) return false
    }
    return true
  }

  first(): V | undefined {
    return this.values().next().value
  }

  last(): V | undefined {
    let last: V | undefined
    for (const val of this.values()) last = val
    return last
  }

  random(): V | undefined {
    const arr = this.toArray()
    return arr[Math.floor(Math.random() * arr.length)]
  }

  reduce<T>(fn: (acc: T, value: V, key: K) => T, initialValue: T): T {
    let acc = initialValue
    for (const [key, val] of this) {
      acc = fn(acc, val, key)
    }
    return acc
  }

  partition(fn: (value: V, key: K) => boolean): [Collection<K, V>, Collection<K, V>] {
    const truthy = new Collection<K, V>()
    const falsy = new Collection<K, V>()
    for (const [key, val] of this) {
      if (fn(val, key)) truthy.set(key, val)
      else falsy.set(key, val)
    }
    return [truthy, falsy]
  }

  sort(compareFn?: (a: V, b: V) => number): this {
    const entries = [...this.entries()]
    entries.sort((a, b) => compareFn?.(a[1], b[1]) ?? 0)
    this.clear()
    for (const [k, v] of entries) this.set(k, v)
    return this
  }

  toArray(): V[] {
    return Array.from(this.values())
  }

  toJSON(): Record<string, V> {
    const obj: Record<string, V> = {}
    for (const [k, v] of this) obj[String(k)] = v
    return obj
  }

  static from<K, V>(iterable: Iterable<[K, V]>): Collection<K, V> {
    const entries = [...iterable] 
    return new Collection(entries)
  }
}