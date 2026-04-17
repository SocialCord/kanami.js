export class ActionRowBuilder {
    constructor() {
        this.components = []
    }

    addComponents(...components) {
        this.components.push(...components)
        return this
    }

    toJSON() {
        return {
            type: 1, 
            components: this.components.map(c => c.toJSON ? c.toJSON() : c)
        }
    }
}