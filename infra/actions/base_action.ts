import { ENTRY_POINTS } from '../config.js'

export type ActionOptions = Record<string, string | boolean>

export abstract class BaseAction {
    webui?: string

    constructor(options: ActionOptions) {
        this.webui = options['webui'] as string
    }

    getEntryPoints(): Record<string, string> {
        if (!this.webui) {
            return ENTRY_POINTS
        }
        
        if (!ENTRY_POINTS[this.webui]) {
            throw new Error(`Unknown webui: ${this.webui}`)
        }

        return {
            [this.webui]: ENTRY_POINTS[this.webui]
        }
    }

    abstract run(): Promise<void>
}