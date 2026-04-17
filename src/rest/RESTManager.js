import { fetch } from 'undici'

//для всех кто сюда полез, сюда не стоит лезть........ глазкам будет больно мб


export class RESTManager {
  constructor(client) {
    this.client = client
    this.baseURL = client.options.baseURL
    this.token = null
  }

  setToken(token) {
    this.token = token
  }

  async request(method, path, body = null, params = null) {
    let url = `${this.baseURL}${path}`
    if (params) {
      const query = new URLSearchParams(params).toString()
      url += `?${query}`
    }
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Social.JS (https://social.shizue.top)'
    }
    if (this.token) headers['Authorization'] = this.token
    const options = { method, headers }
    if (body) options.body = JSON.stringify(body)
    const response = await fetch(url, options)
    const data = await response.json()
    if (!response.ok) throw new Error(`[API ERROR]: ${response.status} - ${data.message || JSON.stringify(data)}`)
    return data
  }

  // СЕРВЕРА
  async getGuild(guildId) {
    return this.request('GET', `/guild/${guildId}`)
  }
  async getGuildUsers(guildId) {
    return this.request('GET', `/guild/${guildId}/users`)
  }
  async getGuildMember(guildId, userId) {
    return this.request('GET', `/guild/${guildId}/user/${userId}`)
  }
  async createGuild(name, icon) {
    return this.request('POST', '/user/guilds', { name, icon })
  }
  async deleteGuild(guildId) {
    return this.request('DELETE', `/user/guilds/${guildId}`)
  }
  async updateGuild(guildId, data) {
    return this.request('POST', `/guild/${guildId}/save`, data)
  }
  async getGuildBans(guildId) {
    return this.request('GET', `/guild/${guildId}/bans`)
  }
  async banUser(guildId, userId, reason, expires = null) {
    return this.request('POST', `/guild/${guildId}/action/${userId}/ban`, { reason, expires })
  }
  async unbanUser(guildId, userId) {
    return this.request('DELETE', `/guild/${guildId}/action/${userId}/unban`)
  }
  async kickUser(guildId, userId, reason) {
    return this.request('POST', `/guild/${guildId}/action/${userId}/kick`, { reason })
  }
  async getAuditLogs(guildId, query) {
    return this.request('GET', `/guild/${guildId}/audit-logs`, null, query)
  }
  async setNickname(guildId, userId, data) {
    return this.request('PATCH', `/guild/${guildId}/members/${userId}/nick`, data)
  }


  // КАНАЛЫ
  async getChannel(channelId) {
    return this.request('GET', `/channels/${channelId}`)
  }
  async createChannel(guildId, data) {
    return this.request('POST', `/guild/${guildId}/channels`, data)
  }
  async deleteChannel(guildId, channelId) {
    return this.request('DELETE', `/guild/${guildId}/channels`, { channelId })
  }
  async updateChannel(guildId, channelId, data) {
    return this.request('POST', `/guild/${guildId}/channels/${channelId}/save`, data)
  }
  async reorderCategories(guildId, categoryId, newPosition) {
    return this.request('POST', `/guild/${guildId}/category/reorder`, { categoryId, newPosition })
  }
  async reorderChannels(guildId, categoryId, channels) {
    return this.request('POST', `/guild/${guildId}/channel/reorder`, { categoryId, channels })
  }
  async moveChannel(guildId, sourceCategoryId, targetCategoryId, movedChannelId, sourceChannels, targetChannels) {
    return this.request('POST', `/guild/${guildId}/channel/move`, { sourceCategoryId, targetCategoryId, movedChannelId, sourceChannels, targetChannels })
  }

  // СООБЩЕНИЯ
  async getChannelHistory(guildId, channelId, params) {
    return this.request('GET', `/guild/${guildId}/channels/${channelId}/history`, null, params)
  }
  async sendMessage(channelId, content, options) {
    return this.client.ws.sendMessagePromise(channelId, content, options)
  }
  async editMessage(channelId, messageId, content, options) {
    return this.client.ws.editMessagePromise(channelId, messageId, content, options)
  }
  async deleteMessage(channelId, messageId) {
    return this.client.ws.deleteMessagePromise(channelId, messageId)
  }

  async bulkDeleteMessages(guildId, channelId, data) {
    return this.request('POST', `/guild/${guildId}/channels/${channelId}/bulk-delete`, data)
  }

  async pinMessage(channelId, messageId) {
    return this.client.ws.pinMessagePromise(channelId, messageId)
  }
  async unpinMessage(channelId, messageId) {
    return this.client.ws.unpinMessagePromise(channelId, messageId)
  }
  async addReaction(channelId, messageId, emojiId) {
    return this.client.ws.addReactionPromise(channelId, messageId, emojiId)
  }
  async removeReaction(channelId, messageId, emojiId) {
    return this.client.ws.removeReactionPromise(channelId, messageId, emojiId)
  }


  // ИНВАЙТЫ
  async getInvite(inviteCode) {
    return this.request('GET', `/guild/invites/${inviteCode}`)
  }
  async createInvite(guildId, channelId, options = {}) {
    return this.request('POST', `/guild/${guildId}/invites`, { create: true, channelId, ...options })
  }
  async joinGuild(inviteCode, userId) {
    return this.request('POST', '/guild/invites/adduser', { invite: inviteCode, userId })
  }

  async getGuildInvites(guildId) {
    return this.request('GET', `/guild/${guildId}/invites`)
  }

  async getChannelInvites(guildId, channelId) {
    return this.request('GET', `/guild/${guildId}/channels/${channelId}/invites`)
  }

  async getVanityURL(guildId) {
    return this.request('GET', `/guild/${guildId}/vanity-url`)
  }

  // ЭМОДЗИ
  async getGuildEmojis(guildId) {
    return this.request('GET', `/guild/${guildId}/emojis`)
  }

  async createEmoji(guildId, data) {
    return this.request('POST', `/guilds/${guildId}/emojis`, data)
  }

  async deleteEmoji(guildId, emojiId) {
    return this.request('DELETE', `/guilds/${guildId}/emojis/${emojiId}`)
  }

  //  РОЛИ
  async addRole(guildId, userId, roleId) {
    return this.request('POST', `/guild/${guildId}/users/${userId}/roles`, { roleId })
  }
  async removeRole(guildId, userId, roleId) {
    return this.request('DELETE', `/guild/${guildId}/users/${userId}/roles`, { roleId })
  }
  async createRole(guildId, data) {
    return this.request('POST', `/guild/${guildId}/roles`, data)
  }
  async editRole(guildId, roleId, data) {
    return this.request('PATCH', `/guild/${guildId}/roles/${roleId}`, data)
  }
  async deleteRole(guildId, roleId) {
    return this.request('DELETE', `/guild/${guildId}/roles/${roleId}`)
  }

  // ПОЛЬЗОВАТЕЛИ
  async getUser(userId) {
    return this.request('GET', `/users/${userId}`)
  }
  async getSelf() {
    return this.request('GET', '/users/@me')
  }
  async updateSelf(data) {
    return this.request('PATCH', '/users/@me', data)
  }
  async getUserGuilds() {
    return this.request('GET', '/user/guilds')
  }
  async createDM(userId) {
    return this.request('POST', `/users/${userId}/dm`)
  }

  async getUserFlags(userId) {
    return this.request('GET', `/users/${userId}/flags`)
  }







}

