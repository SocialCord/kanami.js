export class TextInputBuilder {
  constructor() {
    this.data = {
      type: 4, //инпут
      custom_id: null,
      style: 1, // 1 - short, 2 - paragraph
      label: null,
      min_length: null,
      max_length: null,
      required: true,
      value: null,
      placeholder: null
    }
  }

  setCustomId(customId) {
    this.data.custom_id = customId
    return this
  }

  setLabel(label) {
    this.data.label = label
    return this
  }

  setStyle(style) {
    this.data.style = style
    return this
  }

  setPlaceholder(placeholder) {
    this.data.placeholder = placeholder
    return this
  }

  setMinLength(min) {
    this.data.min_length = min
    return this
  }

  setMaxLength(max) {
    this.data.max_length = max
    return this
  }

  setRequired(required = true) {
    this.data.required = required
    return this
  }

  setValue(value) {
    this.data.value = value
    return this
  }

  toJSON() {
    return this.data
  }
}