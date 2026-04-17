//АНАЛОГИЧНО МОДАЛКЕ НЕ ТРОГАТЬ


export class StringSelectMenuBuilder {
    constructor() {
        this.data = {
            type: 3, //меню
            custom_id: null,
            options: [],
            placeholder: null,
            min_values: 1,
            max_values: 1,
            disabled: false
        }
    }

    setCustomId(customId) {
        this.data.custom_id = customId
        return this
    }

    setPlaceholder(placeholder) {
        this.data.placeholder = placeholder
        return this
    }

    addOptions(...options) {
        this.data.options.push(...options.map(opt => ({
            label: opt.label,
            value: opt.value,
            description: opt.description || null,
            emoji: opt.emoji || null,
            default: opt.default || false
        })))
        return this
    }

    setMinValues(min) {
        this.data.min_values = min
        return this
    }

    setMaxValues(max) {
        this.data.max_values = max
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