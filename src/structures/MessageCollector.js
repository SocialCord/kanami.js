import { EventEmitter } from 'events'

export class MessageCollector extends EventEmitter {
  constructor(channel, filter, options = {}) {
    super()
    this.channel = channel
    this.filter = filter
    this.options = { time: 60000, max: 0, ...options }
    this.collected = []
    this.ended = false
    this._client = channel._client

    this._handleMessage = (message) => {
      if (this.ended) return
      if (message.channelId !== this.channel.id) return
      if (!this.filter(message)) return

      this.collected.push(message)
      this.emit('collect', message)

      if (this.options.max && this.collected.length >= this.options.max) {
        this.stop('max')
      }
    }

    this._client.on('messageCreate', this._handleMessage)

    if (this.options.time) {
      this.timeout = setTimeout(() => this.stop('time'), this.options.time)
    }
  }

  stop(reason = 'user') {
    if (this.ended) return
    this.ended = true
    this._client.off('messageCreate', this._handleMessage)
    if (this.timeout) clearTimeout(this.timeout)
    this.emit('end', this.collected, reason)
  }
}