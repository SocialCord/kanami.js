export class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username || 'Unknown';
    this.avatar = data.avatar || null;
    this.bot = data.bot || false;
    this.system = data.system || false;
    this.status = data.status || 'offline';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
    this._client = data.client;
  }



  async send(content, options = {}) {
    const channel = await this._client.users.createDM(this.id);
    return channel.send(content, options);
  }

  async fetch() {
    const data = await this._client.rest.getUser(this.id);
    Object.assign(this, data);
    return this;
  }

  async setAvatar(avatar) {
    const res = await this._client.rest.updateUser({ avatar });
    this.avatar = res.avatar;
    return this;
  }

  async setUsername(username) {
    const res = await this._client.rest.updateUser({ username });
    this.username = res.username;
    return this;
  }

  async fetchFlags() {
    const data = await this._client.rest.getUserFlags(this.id);
    this.flags = data.flags;
    return this.flags;
  }


  toString() {
    return `<@${this.id}>`;
  }

}