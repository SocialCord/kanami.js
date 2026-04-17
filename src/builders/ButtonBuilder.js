export class ButtonBuilder {
    constructor() {
        this.data = {
            type: 2, // тут на всякий по умолчанию button
            style: 1, // primary
            label: null,
            emoji: null,
            custom_id: null,
            url: null,
            disabled: false
        }
    }

    setLabel(label) {
        this.data.label = label
        return this
    }

    setStyle(style) {
        // 1 - primary, 2 - secondary (grey), 3 - success (green), 4 - danger (red), 5 - link
        this.data.style = style
        return this
    }

    setCustomId(customId) {
        this.data.custom_id = customId
        return this
    }

    setURL(url) {
        this.data.url = url
        this.data.style = 5
        return this
    }

    setEmoji(emoji) {
        this.data.emoji = typeof emoji === 'string' ? { name: emoji } : emoji
        return this
    }

    setDisabled(disabled = true) {
        this.data.disabled = disabled
        return this
    }

    toJSON() {
        return this.data
    }
}