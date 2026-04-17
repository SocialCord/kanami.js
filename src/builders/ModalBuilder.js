import { ActionRowBuilder } from './ActionRowBuilder.js'


//Не трогать пока норм модалки не сделаем
export class ModalBuilder {
  constructor() {
    this.data = {
      title: null,
      custom_id: null,
      components: []
    }
  }

  setCustomId(customId) {
    this.data.custom_id = customId
    return this
  }

  setTitle(title) {
    this.data.title = title
    return this
  }

  addComponents(...components) {
    const rows = components.filter(c => c.type === 1) 
    this.data.components.push(...rows.map(r => r.toJSON()))
    return this
  }

  toJSON() {
    return this.data
  }
}