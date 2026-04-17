

//Описание для js файла WebSocketManager, дабы не ругался
import EventEmitter from 'eventemitter3';
import { Client } from '../client.ts'

export class WebSocketManager extends EventEmitter {
  constructor(client: Client)
  socket: any
  connected: boolean
  connect(token: string): Promise<void>
  disconnect(): void

  sendMessage(
    channelId: string,
    content: string | any,
    options: any,
    callback: (err: Error | null, result?: any) => void
  ): void
  sendMessagePromise(channelId: string, content: string | any, options?: any): Promise<any>

  editMessage(
    channelId: string,
    messageId: string,
    content: string | any,
    options: any,
    callback: (err: Error | null, result?: any) => void
  ): void
  editMessagePromise(channelId: string, messageId: string, content: string | any, options?: any): Promise<any>

  deleteMessage(channelId: string, messageId: string, callback: (err: Error | null) => void): void
  deleteMessagePromise(channelId: string, messageId: string): Promise<void>

  pinMessage(channelId: string, messageId: string, callback: (err: Error | null) => void): void
  pinMessagePromise(channelId: string, messageId: string): Promise<void>

  unpinMessage(channelId: string, messageId: string, callback: (err: Error | null) => void): void
  unpinMessagePromise(channelId: string, messageId: string): Promise<void>

  addReaction(channelId: string, messageId: string, emojiId: string, callback: (err: Error | null) => void): void
  addReactionPromise(channelId: string, messageId: string, emojiId: string): Promise<void>

  removeReaction(channelId: string, messageId: string, emojiId: string, callback: (err: Error | null) => void): void
  removeReactionPromise(channelId: string, messageId: string, emojiId: string): Promise<void>

  getVoiceToken(channelId: string, guildId: string): Promise<{ token: string; serverUrl: string }>

  //на всякий случай
  on(event: 'ready', listener: () => void): this;
  on(event: 'disconnect', listener: (reason: string) => void): this
  on(event: 'interaction://dispatch', listener: (data: any) => void): this
}