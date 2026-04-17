import { permissions } from '../utils/permissions.js'

export class Permissions {
  constructor(bitfield) {
    this.bitfield = BigInt(bitfield || 0)
  }

  has(permission) {
    const bit = typeof permission === 'string' ? permissions[permission] : permission
    if (!bit) return false
    if ((this.bitfield & permissions.ADMINISTRATOR) !== 0n) return true
    return (this.bitfield & bit) === bit
  }

  add(...perms) {
    for (const perm of perms) {
      const bit = typeof perm === 'string' ? permissions[perm] : perm
      if (bit) this.bitfield |= bit
    }
    return this
  }

  remove(...perms) {
    for (const perm of perms) {
      const bit = typeof perm === 'string' ? permissions[perm] : perm
      if (bit) this.bitfield &= ~bit
    }
    return this
  }

  toArray() {
    const arr = []
    for (const [name, bit] of Object.entries(permissions)) {
      if (this.has(bit)) arr.push(name)
    }
    return arr
  }

  serialize() {
    const obj = {}
    for (const [name, bit] of Object.entries(permissions)) {
      obj[name] = this.has(bit)
    }
    return obj
  }

  valueOf() {
    return this.bitfield
  }

  toString() {
    return String(this.bitfield)
  }
}