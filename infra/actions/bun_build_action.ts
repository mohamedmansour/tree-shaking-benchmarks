import fs, { statSync } from 'node:fs'
import path from 'node:path'

import * as esbuild from 'esbuild'

import { DIST_DIR } from '../config.js'
import { EsbuildBaseAction } from './esbuild_base_action.js'
import { copyFolder, getFileSizeInBytes } from '../utils/file_utils.js'
import { ActionOptions, BaseAction } from './base_action.js'
import { Stats } from '../utils/stats_utils.js'

class BunBuildAction extends BaseAction {
  async run(): Promise<void> {
    const entryPoints = this.getEntryPoints()
    for (const entryPoint in entryPoints) {
      await this.build({ [entryPoint]: entryPoints[entryPoint] }, `bun-${entryPoint}`)
    }
  }

  private async build(entryPoints: Record<string, string>, name: string): Promise<void> {
    const startTime = performance.now()
    const entryPoint = Object.values(entryPoints)[0]
    const webuiName = path.dirname(entryPoint)
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
    
    const duarationInSeconds = (performance.now() - startTime) / 1000
    const stats = new Stats(name, duarationInSeconds)
    response.outputs.forEach((output) => {
      if (output.kind !== 'sourcemap') {
        stats.add(output.path, getFileSizeInBytes(output.path))
      }
    })
    stats.print()
  }
}

export default function (options: ActionOptions): Promise<void> {
  const action = new BunBuildAction(options)
  return action.run()
}
