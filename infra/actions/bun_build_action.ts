import path from 'node:path'
import { getFileSizeInBytes } from '../utils/file_utils.js'
import { ActionOptions, BaseAction } from './base_action.js'
import { StatResult, Stats } from '../utils/stats_utils.js'
import { WEBUIS_DIR } from '../config.js'

class BunBuildAction extends BaseAction {
  public getActionName(): string {
    return 'bun'
  }

  public async build(entryPoints: Record<string, string>, name: string): Promise<StatResult> {
    const entryPoint = Object.values(entryPoints)[0]
    const webuiName = path.dirname(entryPoint)
    const stats = new Stats(name, this.getActionName())
    
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

    return stats.data
  }
}

export default function (options: ActionOptions): Promise<Array<StatResult>> {
  const action = new BunBuildAction(options)
  return action.run()
}
