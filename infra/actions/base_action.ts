import { ENTRY_POINTS } from '../config.js'
import { StatResult } from '../utils/stats_utils.js'

export type ActionOptions = Record<string, string | boolean>

export abstract class BaseAction {
  webui?: string
  minify?: boolean

  constructor(options: ActionOptions) {
    this.webui = options['webui'] as string
    this.minify = options['minify'] as boolean || false
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
  
  public run() {
    const entryPoints = this.getEntryPoints()
    const runners = []
    for (const entryPoint in entryPoints) {
      runners.push(this.build({ [entryPoint]: entryPoints[entryPoint] }, `${this.getActionName()}-${entryPoint}`))
    }
    return Promise.all(runners)
  }

  abstract getActionName(): string
  abstract build(entryPoints: Record<string, string>, name: string): Promise<StatResult>
}