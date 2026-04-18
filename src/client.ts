//Для всех тех кто сюда полез, скажу сразу на будущее. Данный пакет является не первым, но и довольно трудоемким по реализации для меня. Полностью проект SocialCord делается мной (masero) соответственно данный пакет я делаю тоже сам. Тут могут быть недочеты и ошибки, так что если таковые есть, отправляйте пуш на гите с изменениями, всем спасибо. 


import EventEmitter from 'eventemitter3'
import { RESTManager } from './rest/RESTManager.js'
import { WebSocketManager } from './ws/WebSocketManager.js'
import { UserManager } from './managers/UserManager.js'
import { ChannelManager } from './managers/ChannelManager.js'
import { GuildManager } from './managers/GuildManager.js'
import { RoleManager } from './managers/RoleManager.js'
import { EmojiManager } from './managers/EmojiManager.js'
import { User } from './structures/User.js'
import { Channel } from './structures/Channel.js'
import { Message } from './structures/Message.js'
import { Guild } from './structures/Guild.js'
import { GuildMember } from './structures/GuildMember.js'
import { Role } from './structures/Role.js'
import { Collection } from './structures/Collection.js'
//import { VoiceManager } from './voice/VoiceManager.js'
import { Interaction, InteractionCollector, InteractionCollectorOptions } from './types/Interaction.js'
import type { CacheProvider } from './providers/CacheProvider.js'
import { MemoryCacheProvider } from './providers/MemoryCacheProvider.js'
import { Logger } from './utils/Logger.js'

export interface ClientOptions {
  intents?: number
  baseURL?: string
  wsURL?: string
  cacheProvider?: CacheProvider<any, any>
  restProvider?: any
  reconnectAttempts?: number
  reconnectDelay?: number
}

export interface ClientEvents {
  ready: []
  messageCreate: [message: Message]
  messageUpdate: [oldMessage: Message, newMessage: Message]
  messageDelete: [message: Message]
  channelCreate: [channel: Channel]
  channelUpdate: [oldChannel: Channel, newChannel: Channel]
  channelDelete: [channel: Channel]
  guildCreate: [guild: Guild]
  guildUpdate: [oldGuild: Guild, newGuild: Guild]
  guildDelete: [guild: Guild]
  guildMemberAdd: [member: GuildMember]
  guildMemberRemove: [member: GuildMember]
  guildMemberUpdate: [oldMember: GuildMember, newMember: GuildMember]
  roleCreate: [role: Role]
  roleUpdate: [oldRole: Role, newRole: Role]
  roleDelete: [role: Role]
  userUpdate: [oldUser: User, newUser: User]
  voiceStateUpdate: [oldState: any, newState: any]
  typingStart: [channel: Channel, user: User]
  typingStop: [channel: Channel, user: User]
  messageReactionAdd: [reaction: any, user: User]
  messageReactionRemove: [reaction: any, user: User]
  interactionCreate: [interaction: Interaction]
  collect: [interaction: Interaction]
  end: [collected: Interaction[]]
  disconnect: [reason: string]
  error: [error: Error]
  raw: [data: { event: string; args: any[] }]
}

interface ResolvedClientOptions {
  intents: number
  baseURL: string
  wsURL: string
  cacheProvider: CacheProvider<any, any>
  restProvider?: any
  reconnectAttempts: number
  reconnectDelay: number
}


export class Client extends EventEmitter<ClientEvents> {
  public options: ResolvedClientOptions
  public token: string | null
  public user: User | null
  public rest: RESTManager
  public ws: WebSocketManager
  public users: UserManager
  public channels: ChannelManager
  public guilds: GuildManager
  public roles: RoleManager
  public emojis: EmojiManager
  //public voice: VoiceManager
  public cacheProvider: CacheProvider<any, any>
  public logger: Logger
  public structures: {
    User: typeof User
    Channel: typeof Channel
    Message: typeof Message
    Guild: typeof Guild
    GuildMember: typeof GuildMember
    Role: typeof Role
    Collection: typeof Collection
  }
  private interactionHandlers: Map<string, (interaction: Interaction) => void> = new Map()

  constructor(options: ClientOptions = {}) {
    super()
    this.options = {
      intents: 513,
      baseURL: 'http://cdn.shizue.top/v1',
      wsURL: 'https://ws.shizue.top',
      reconnectAttempts: 10,
      reconnectDelay: 1000,
      cacheProvider: new MemoryCacheProvider(),
      ...options
    }
    this.token = null
    this.user = null
    this.cacheProvider = this.options.cacheProvider
    this.logger = new Logger('Client')
    this.rest = new RESTManager(this)
    this.ws = new WebSocketManager(this)
    this.users = new UserManager(this)
    this.channels = new ChannelManager(this)
    this.guilds = new GuildManager(this)
    this.roles = new RoleManager(this)
    this.emojis = new EmojiManager(this)
    //this.voice = new VoiceManager(this)
    this.structures = { User, Channel, Message, Guild, GuildMember, Role, Collection }
    this.setupInteractionHandler()
    this.setupGlobalErrorHandler()
  }

  private setupGlobalErrorHandler(): void {
    process.on('unhandledRejection', (reason) => {
      this.emit('error', reason as Error)
    })
    this.on('error', (error) => {
      console.error('[Client Error]', error)
    })
  }

  public async login(token: string): Promise<User | null> {
    this.token = token
    this.rest.setToken(token)
    await this.ws.connect(token)
    this.emit('ready')
    return this.user
  }

  public async getGuilds(): Promise<Collection<string, Guild>> {
    return this.guilds.fetchUserGuilds()
  }

  public async createMessage(channelId: string, content: string): Promise<any> {
    const channel = await this.channels.fetch(channelId)
    return channel.send(content)
  }

  public destroy(): void {
    this.ws.disconnect()
    this.removeAllListeners()
  }

  private setupInteractionHandler(): void {
    this.ws.on('interaction://dispatch', async (data: any) => {
      let interactionType: 2 | 3
      if (data.type === 'button_click') interactionType = 2
      else if (data.type === 'select_change') interactionType = 3
      else interactionType = data.type
      const customId = data.customId || data.component?.custom_id
      const interaction: Interaction = {
        id: data.id || Date.now().toString(),
        type: interactionType,
        customId: customId,
        values: data.values || [],
        user: data.user,
        guildId: data.guildId,
        channelId: data.channelId,
        messageId: data.messageId,
        component: data.component,
        reply: async (content: string | any, options: any = {}) => {
          return new Promise((resolve, reject) => {
            this.ws.sendMessage(interaction.channelId, content, {
              ...options,
              guildId: interaction.guildId
            }, (err: any, result: any) => {
              if (err) reject(err)
              else resolve(result)
            })
          })
        },
        update: async (content: string | any, options: any = {}) => {
          return new Promise((resolve, reject) => {
            this.ws.editMessage(interaction.channelId, interaction.messageId, content, options, (err: any, result: any) => {
              if (err) reject(err)
              else resolve(result)
            })
          })
        },
        deferReply: async () => console.log('[Interaction] deferReply called'), //Эти методы реализованы под будущее
        deferUpdate: async () => console.log('[Interaction] deferUpdate called')
      }
      const handler = this.interactionHandlers.get(interaction.customId)
      if (handler) {
        try {
          await handler(interaction)
        } catch (error) {
          this.emit('error', error as Error)
        }
      }
      this.emit('interactionCreate', interaction)
    })
  }

  public onInteraction(customId: string, handler: (interaction: Interaction) => void, timeout?: number): void {
    this.interactionHandlers.set(customId, handler)
    if (timeout) {
      setTimeout(() => {
        if (this.interactionHandlers.get(customId) === handler) this.interactionHandlers.delete(customId)
      }, timeout)
    }
  }

  public createInteractionCollector(message: Message, filter: (interaction: Interaction) => boolean, { time = 60000 }: InteractionCollectorOptions = {}): InteractionCollector {
    let ended = false
    const collected: Interaction[] = []
    const handler = (interaction: Interaction) => {
      if (ended) return
      if (interaction.messageId === message.id && filter(interaction)) {
        collected.push(interaction)
        this.emit('collect', interaction)
      }
    }
    this.on('interactionCreate', handler)
    const timeout = setTimeout(() => {
      if (!ended) {
        ended = true
        this.off('interactionCreate', handler)
        this.emit('end', collected)
      }
    }, time)
    return {
      on: (event: 'collect' | 'end', callback: (data: any) => void) => this.on(event as any, callback),
      off: (event: 'collect' | 'end', callback: (data: any) => void) => this.off(event as any, callback),
      stop: () => {
        if (!ended) {
          ended = true
          clearTimeout(timeout)
          this.off('interactionCreate', handler)
          this.emit('end', collected)
        }
      }
    }
  }
}