import { Collection } from '../structures/Collection.ts'

export class EmojiManager {
  constructor(client) {
    this.client = client
    this.cache = new Collection()
  }

  addEmoji(guildId, emojiData) {
    this.cache.set(emojiData.id, emojiData)
    return emojiData
  }

  async fetch(guildId, emojiId) {
    const guild = await this.client.guilds.fetch(guildId)
    const emoji = guild.emojis.cache.get(emojiId)
    if (emoji) return emoji
    await guild.fetch()
    return guild.emojis.cache.get(emojiId)
  }
}