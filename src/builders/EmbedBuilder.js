export class EmbedBuilder {
    constructor() {
        this.data = {
            title: null,
            description: null,
            color: null,
            fields: [],
            thumbnail: null,
            footer: null,
            timestamp: null,
            image: null,
            author: null,
            url: null
        }
    }

    setTitle(title) {
        this.data.title = title
        return this
    }

    setDescription(description) {
        this.data.description = description
        return this
    }

    setColor(color) {
        // ТОЛЬКО (0xRRGGBB) или строка #RRGGBB
        if (typeof color === 'string' && color.startsWith('#')) {
            this.data.color = parseInt(color.slice(1), 16)
        } else if (typeof color === 'number') {
            this.data.color = color
        }
        return this
    }

    setURL(url) {
        this.data.url = url
        return this
    }

    addField(name, value, inline = false) {
        this.data.fields.push({ name, value, inline })
        return this
    }

    setThumbnail(url) {
        this.data.thumbnail = { url }
        return this
    }

    setImage(url) {
        this.data.image = { url }
        return this
    }

    setFooter(text, iconURL = null) {
        this.data.footer = { text, icon_url: iconURL }
        return this
    }

    setTimestamp(timestamp = new Date()) {
        // дата или исо
        if (timestamp instanceof Date) {
            this.data.timestamp = timestamp.toISOString()
        } else if (typeof timestamp === 'string') {
            this.data.timestamp = timestamp
        } else {
            this.data.timestamp = new Date().toISOString()
        }
        return this
    }

    setAuthor(name, iconURL = null, url = null) {
        this.data.author = { name, icon_url: iconURL, url }
        return this
    }

    toJSON() {
        const result = {}
        for (const [key, value] of Object.entries(this.data)) {
            if (value !== null && value !== undefined) {
                if (key === 'fields' && value.length === 0) continue
                result[key] = value
            }
        }
        return result
    }
}