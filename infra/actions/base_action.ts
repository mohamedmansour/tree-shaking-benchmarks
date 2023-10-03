import { ENTRY_POINTS } from '../config.js'
import { StatInfo, StatResult } from '../utils/stats_utils.js'

export type ActionOptions = Record<string, string | boolean | number>

export abstract class BaseAction {
  webui?: string
  minify?: boolean
  iterations: number

  constructor(options: ActionOptions) {
    this.webui = options['webui'] as string
    this.minify = options['minify'] as boolean || false
    this.iterations = options['iterations'] as number || 1
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
  
  public async run(): Promise<Array<StatResult>> {
    const runners: Array<Array<StatResult>> = []
    for (let i = 0; i < this.iterations; i++) {
      runners.push(await this.runOnce())
    }
    
    const runnerResults = runners
    const results: Array<StatResult> = runnerResults.reduce((acc: Array<StatResult>, value: Array<StatResult>) => {
      value.forEach((statResult: StatResult, index: number) => {
        if (acc.length <= index) {
          acc.push(statResult)
          return
        }

        acc[index].durationInMilliseconds = (acc[index].durationInMilliseconds + statResult.durationInMilliseconds) / 2
        acc[index].totalSizeInKilobytes = (acc[index].totalSizeInKilobytes + statResult.totalSizeInKilobytes) / 2
        acc[index].stats.forEach((stat: StatInfo, statIndex: number) => {
          acc[index].stats[statIndex].size = (acc[index].stats[statIndex].size + stat.size) / 2
        })
      })
      return acc
    }, []);

    return results
  }

  private runOnce(): Promise<Array<StatResult>> {
    return new Promise((resolve) => {
      const entryPoints = this.getEntryPoints()
      const runners = []
      for (const entryPoint in entryPoints) {
        runners.push(this.build({ [entryPoint]: entryPoints[entryPoint] }, `${this.getActionName()}-${entryPoint}`))
      }
      resolve(Promise.all(runners))
    })
  }

  abstract getActionName(): string
  abstract build(entryPoints: Record<string, string>, name: string): Promise<StatResult>
}