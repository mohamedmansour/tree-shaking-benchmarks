import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { DIST_DIR, ROOT_DIR } from '../config.js'
import { StatInfo, StatResult } from '../utils/stats_utils.js'
import { copyFolder, deleteFolderRecursive } from '../utils/file_utils.js'

const packageJson = JSON.parse(readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'))

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
    const entryPoints = packageJson.entryPoints as Record<string, string>
    if (!this.webui) {
      return entryPoints
    }

    if (!entryPoints[this.webui]) {
      throw new Error(`Unknown webui: ${this.webui}`)
    }

    return {
      [this.webui]: entryPoints[this.webui]
    }
  }
  
  public async run(): Promise<Array<StatResult>> {
    const distFolderPath = path.join(DIST_DIR, this.getActionName());
    deleteFolderRecursive(distFolderPath);

    const runners: Array<Array<StatResult>> = []
    for (let i = 0; i < this.iterations; i++) {
      runners.push(await this.runOnce())
    }
    
    // Capture Results.
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

    // Write the base html file.
    writeFileSync(path.join(distFolderPath, 'index.html'), this.generateIndexHtml(this.getEntryPoints()));

    // Copy the public folder.
    copyFolder('public', path.join(distFolderPath))

    return results
  }

  private runOnce(): Promise<Array<StatResult>> {
    return new Promise(async (resolve) => {
      const entryPoints = this.getEntryPoints()
      const runners = []
      for (const entryPoint in entryPoints) {
        runners.push(await this.build({ [entryPoint]: entryPoints[entryPoint] }, entryPoint))
      }
      resolve(Promise.all(runners))
    })
  }

  protected generateIndexHtml(entryPoints: Record<string, string>): string {
    let html = '<html><body><h1>Apps</h1>'
    html += '<ul>'
    for (const entryPoint in entryPoints) {
      html += `<li><a href="${entryPoint}/index.html">${entryPoint}</a> (<a href="${entryPoint}/meta.json">metadata</a>)</li>`
    }
    html += '</ul></body></html>'
    return html
  }

  abstract getActionName(): string
  abstract build(entryPoints: Record<string, string>, name: string): Promise<StatResult>
}
