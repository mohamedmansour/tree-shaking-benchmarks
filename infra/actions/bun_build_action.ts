import path from 'node:path'
import { getFileSizeInBytes } from '../utils/file_utils.js'
import { ActionOptions, BaseAction } from './base_action.js'
import { Stats } from '../utils/stats_utils.js'
import { WEBUIS_DIR } from '../config.js'

class BunBuildAction extends BaseAction {
  async run(): Promise<void> {
    const entryPoints = this.getEntryPoints()
    for (const entryPoint in entryPoints) {
      await this.build({ [entryPoint]: entryPoints[entryPoint] }, `bun-${entryPoint}`)
    }
  }

  private async build(entryPoints: Record<string, string>, name: string): Promise<void> {
    const entryPoint = Object.values(entryPoints)[0]
    const webuiName = path.dirname(entryPoint)
    const stats = new Stats(name)
    
    const response = await Bun.build({
      entrypoints: [entryPoint],
      minify: {
        identifiers: this.minify,
        syntax:  this.minify,
        whitespace:  this.minify
      },
      naming: {
        asset: `[dir]/${webuiName}-[name].[ext]`,
        chunk: `[dir]/${webuiName}-[name].[ext]`,
        entry: `[dir]/${webuiName}-[name].[ext]`,
      },
      sourcemap: 'external',
      target: 'browser',
      format: 'esm',
      outdir: 'dist/bun/',
      splitting: true,
    })

    stats.done()

    response.outputs.forEach((output) => {
      if (output.kind !== 'sourcemap') {
        stats.add(path.basename(output.path, WEBUIS_DIR), getFileSizeInBytes(output.path))
      }
    })
    stats.print()
  }
}

export default function (options: ActionOptions): Promise<void> {
  const action = new BunBuildAction(options)
  return action.run()
}
