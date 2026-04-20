import { io } from 'socket.io-client'
import EventEmitter from 'eventemitter3'
import { Message } from '../structures/Message.js'
import { Channel } from '../structures/Channel.js'
import { Guild } from '../structures/Guild.js'
import { GuildMember } from '../structures/GuildMember.js'
import { User } from '../structures/User.js'
import { Role } from '../structures/Role.js'

export class WebSocketManager extends EventEmitter {
  constructor(client) {
    super()
    this.client = client
    this.socket = null
    this.connected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 10
    this.reconnectDelay = 1000
    this.heartbeatInterval = null
  }

  async connect(token) {
    const wsURL = this.client.options.wsURL
    return new Promise((resolve, reject) => {
      const attemptConnection = () => {
        this.socket = io(wsURL, {
          transports: ['websocket', 'polling'],
          auth: { token },
          reconnection: false, // управляем сами
        })

        this.socket.on('connect', async () => {
          console.log('[Kanami.JS] [DEBUG / Socket] Успешно подключено')
          this.reconnectAttempts = 0
          this.connected = true
          this.startHeartbeat()

          try {
            const response = await this.client.rest.request('POST', '/user', {
              payload: this.client.token,
              type: 2,
              bot: true
            })

            if (response.status !== 200 || !response.data) {
              throw new Error('Failed to get bot data')
            }

            this.client.user = new this.client.structures.User({
              ...response.data,
              client: this.client
            })

            const guildsList = await this.client.rest.getUserGuilds()
            console.log(`[Kanami.JS] [DEBUG / Socket] Загружено ${guildsList.length} гильдий`)

            const fetchPromises = []
            for (const guildData of guildsList) {
              const guild = new this.client.structures.Guild(guildData, this.client)
              this.client.guilds.cache.set(guild.id, guild)
              fetchPromises.push(
                this.client.guilds.fetch(guild.id, { force: true })
                  .catch(err => console.error(`[Kanami.JS] [DEBUG / Socket] Ошибка загрузки гильдии ${guild.id}:`, err.message, `Просьба при необходимости сообщить разработчику`))
              )
            }

            await Promise.allSettled(fetchPromises)
            console.log('[Kanami.JS] [DEBUG / Socket] Все гильдии и их данные загружены в кеш')

            this.client.friends = response.data.friends
            this.client.badges = response.data.badges
            this.emit('ready')
            resolve()
          } catch (error) {
            reject(error)
          }
        })

        this.socket.on('disconnect', (reason) => {
          this.connected = false
          this.stopHeartbeat()
          this.client.emit('disconnect', reason)
          this.scheduleReconnect()
        })

        this.socket.on('connect_error', (error) => {
          console.error('[Kanami.JS] [DEBUG / Socket] Ошибка подключения сокета:', error)
          this.scheduleReconnect()
          if (this.reconnectAttempts === 0) reject(error)
        })


        this.setupEventHandlers()

      }
      attemptConnection()
    })
  }


  setupEventHandlers() {
    this.socket.on('interaction://dispatch', (data) => this.emit('interaction://dispatch', data))

    this.socket.on('message://send', (data) => {
      // Кешируем автора
      if (data.author && !this.client.users.cache.has(data.authorId)) {
        const user = new this.client.structures.User({
          ...data.author,
          client: this.client
        })
        this.client.users.cache.set(user.id, user)
      }
      const message = new Message(data, this.client)
      this.client.emit('messageCreate', message)
    })


    this.socket.on('message://edit', (data) => {
      const oldMsg = this.client.channels.cache.get(data.channelId)?.messages?.cache?.get(data.id)
      if (data.author && !this.client.users.cache.has(data.authorId)) {
        const user = new this.client.structures.User({
          ...data.author,
          client: this.client
        })
        this.client.users.cache.set(user.id, user)
      }
      const newMsg = new Message(data, this.client)
      this.client.emit('messageUpdate', oldMsg, newMsg)
    })


    this.socket.on('message://delete', (data) => {
      const msg = new Message({ id: data.messageId, channelId: data.channelId }, this.client)
      this.client.emit('messageDelete', msg)
    })


    this.socket.on('guild://channels/create', (data) => {
      const channel = new Channel(data.channel, this.client)
      this.client.channels.cache.set(channel.id, channel)
      this.client.emit('channelCreate', channel)
    })


    this.socket.on('guild://channels/delete', (data) => {
      const channel = this.client.channels.cache.get(data.channel.id)
      if (channel) this.client.channels.cache.delete(data.channel.id)
      this.client.emit('channelDelete', channel)
    })


    this.socket.on('guild://channels/update', (data) => {
      const old = this.client.channels.cache.get(data.channel.id)
      const updated = new Channel({ ...old, ...data.channel }, this.client)
      this.client.channels.cache.set(updated.id, updated)
      this.client.emit('channelUpdate', old, updated)
    })


    this.socket.on('guild://member-join', (data) => {
      const member = new GuildMember(data, this.client)
      this.client.emit('guildMemberAdd', member)
    })


    this.socket.on('guild://member-leave', (data) => {
      const member = new GuildMember(data, this.client)
      this.client.emit('guildMemberRemove', member)
    })


    this.socket.on('guild://roles/members', (data) => {
      const guild = this.client.guilds.cache.get(data.guildId)
      if (guild) {
        const member = guild.members.cache.get(data.userId)
        if (member) {
          member.roles = data.userRoles
          this.client.emit('guildMemberUpdate', member, member)
        }
      }
    })


    this.socket.on('typing://update', (data) => {
      const channel = this.client.channels.cache.get(data.channelId)
      const user = this.client.users.cache.get(data.userId)
      if (channel && user) this.client.emit('typingStart', channel, user)
    })


    this.socket.on('typing://stop', (data) => {
      const channel = this.client.channels.cache.get(data.channelId)
      const user = this.client.users.cache.get(data.userId)
      if (channel && user) this.client.emit('typingStop', channel, user)
    })


    this.socket.on('message://reaction-update', (data) => {
      const channel = this.client.channels.cache.get(data.channelId)
      if (channel && channel.messages) {
        const msg = channel.messages.cache.get(data.messageId)
        if (msg) {
          this.client.emit('messageReactionAdd', data, new User(data.user, this.client))
        }
      }
    })


    this.socket.on('voice://voice-update', (data) => this.client.emit('voiceStateUpdate', data, data))

    this.socket.on('voice://voice-leave', (data) => this.client.emit('voiceStateUpdate', data, data))

    this.socket.onAny((event, ...args) => {
      this.client.emit('raw', { event, args })
    })

  }

  startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.connected) {
        this.socket.emit('ping')
      }
    }, 30000)
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[Kanami.JS] [DEBUG / Socket] Максимальное количество попыток переподключения достигнуто')
      return
    }
    const delay = Math.min(30000, this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts))
    this.reconnectAttempts++
    setTimeout(() => {
      if (!this.connected) {
        console.log(`[Kanami.JS] [DEBUG / Socket] Переподключение.. Попытка #${this.reconnectAttempts}`)
        this.connect(this.client.token).catch(err => console.error('[DEBUG / SOCKET] Ошибка переподключения:', err))
      }
    }, delay)
  }

  // СООБЩЕНИЯ
  sendMessage(channelId, content, options = {}, callback) {
    if (typeof content === 'object' && content !== null && !options.channelId) {
      const params = content
      channelId = params.channelId
      content = params.content
      options = params
    }

    const payload = {
      channelId,
      content: '',
      guildId: options.guildId || null,
      authorId: this.client.user.id,
      attachments: options.attachments || [],
      mentions: options.mentions || [],
      type: options.type || 0,
    }

    if (typeof content === 'string') {
      payload.content = content
    } else if (content && typeof content === 'object') {
      if (content.embeds) options.embeds = content.embeds
      if (content.components) options.components = content.components
      if (content.content) payload.content = content.content
    } else if (options.content) {
      payload.content = options.content
    }

    if (options.embeds && Array.isArray(options.embeds)) {
      payload.embeds = options.embeds.map(e => e.toJSON ? e.toJSON() : e)
    } else if (options.embed) {
      payload.embeds = [options.embed.toJSON ? options.embed.toJSON() : options.embed]
    }

    if (options.components && Array.isArray(options.components)) {
      payload.components = options.components.map(comp => comp.toJSON ? comp.toJSON() : comp)
    }

    if (options.replyTo) {
      payload.replied = { messageId: options.replyTo }
    }

    const event = options.isDM ? 'messages://send/dm' : 'messages://send'
    console.log("[Kanami.JS] [DEBUG / MESSAGE SEND]", JSON.stringify(payload, null, 2))
    this.socket.emit(event, payload, (response) => {
      if (response && response.error) {
        callback?.(new Error(response.message), null)
      } else {
        callback?.(null, response)
      }
    })
  }

  editMessage(channelId, messageId, content, options = {}, callback) {
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    if (content && typeof content === 'object') {
      if (content.embeds) options.embeds = content.embeds
      if (content.components) options.components = content.components
      if (content.content) options.content = content.content
    }

    const payload = {
      messageId,
      channelId,
      content: options.content || '',
      authorId: this.client.user.id
    }

    if (options.embeds && Array.isArray(options.embeds)) {
      payload.embeds = options.embeds.map(e => e.toJSON ? e.toJSON() : e)
    }
    if (options.components && Array.isArray(options.components)) {
      payload.components = options.components.map(comp => comp.toJSON ? comp.toJSON() : comp)
    }

    console.log("[Kanami.JS] [DEBUG / MESSAGE EDIT]", payload)
    this.socket.emit('messages://edit', payload, (response) => {
      if (response && response.error) {
        callback?.(new Error(response.error))
      } else {
        callback?.(null, response)
      }
    })
  }

  deleteMessage(channelId, messageId, callback) {
    this.socket.emit('messages://delete', { message: { id: messageId, channelId } }, (response) => {
      if (response && response.error) callback?.(new Error(response.error))
      else callback?.(null)
    })
  }

  pinMessage(channelId, messageId, callback) {
    this.socket.emit('messages://pinned', { message: { id: messageId, channelId }, userId: this.client.user.id }, callback)
  }

  unpinMessage(channelId, messageId, callback) {
    this.socket.emit('messages://unpinned', { message: { id: messageId, channelId }, userId: this.client.user.id }, callback)
  }

  addReaction(channelId, messageId, emojiId, callback) {
    this.socket.emit('messages://reaction-add', { message: { id: messageId, channelId }, emoji: { id: emojiId }, userId: this.client.user.id }, callback)
  }

  removeReaction(channelId, messageId, emojiId, callback) {
    this.socket.emit('messages://reaction-remove', { message: { id: messageId, channelId }, emoji: { id: emojiId }, userId: this.client.user.id }, callback)
  }

  // ВОЙСЫ
  getVoiceToken(channelId, guildId) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('WebSocket not connected'))
        return
      }
      this.socket.emit('voice://get-token', {
        userId: this.client.user?.id,
        channelId: channelId,
        username: this.client.user?.username,
        guildId: guildId,
        isScreenShare: false,
      }, (response) => {
        if (response && response.error) {
          reject(new Error(response.error))
        } else if (response && response.success && response.token) {
          resolve({
            token: response.token,
            serverUrl: response.serverUrl || 'wss://live.shizue.top'
          })
        } else {
          reject(new Error('Invalid token response'))
        }
      })
    })
  }

  // PROMISE на всякий случай, Дабы поток не тормозил
  sendMessagePromise(channelId, content, options) {
    return new Promise((resolve, reject) => {
      this.sendMessage(channelId, content, options, (err, res) => err ? reject(err) : resolve(res))
    })
  }
  editMessagePromise(channelId, messageId, content, options) {
    return new Promise((resolve, reject) => {
      this.editMessage(channelId, messageId, content, options, (err, res) => err ? reject(err) : resolve(res))
    })
  }
  deleteMessagePromise(channelId, messageId) {
    return new Promise((resolve, reject) => {
      this.deleteMessage(channelId, messageId, (err) => err ? reject(err) : resolve())
    })
  }
  pinMessagePromise(channelId, messageId) {
    return new Promise((resolve, reject) => {
      this.pinMessage(channelId, messageId, (err) => err ? reject(err) : resolve())
    })
  }
  unpinMessagePromise(channelId, messageId) {
    return new Promise((resolve, reject) => {
      this.unpinMessage(channelId, messageId, (err) => err ? reject(err) : resolve())
    })
  }
  addReactionPromise(channelId, messageId, emojiId) {
    return new Promise((resolve, reject) => {
      this.addReaction(channelId, messageId, emojiId, (err) => err ? reject(err) : resolve())
    })
  }
  removeReactionPromise(channelId, messageId, emojiId) {
    return new Promise((resolve, reject) => {
      this.removeReaction(channelId, messageId, emojiId, (err) => err ? reject(err) : resolve())
    })
  }


  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.connected = false
  }
}