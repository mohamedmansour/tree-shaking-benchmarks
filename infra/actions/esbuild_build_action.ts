import fs from 'node:fs'
import path from 'node:path'

import * as esbuild from 'esbuild'

import { DIST_DIR } from '../config.js'
import { EsbuildBaseAction } from './esbuild_base_action.js'
import { copyFolder, getFileSizeInBytes } from '../utils/file_utils.js'
import { ActionOptions } from './base_action.js'
import { Stats, StatResult } from '../utils/stats_utils.js'

class EsbuildBuildAction extends EsbuildBaseAction {
  public getActionName(): string {
    return 'esbuild'
  }

  public async build(entryPoints: Record<string, string>, name: string): Promise<StatResult> {
    const stats = new Stats(name)
    const results = await esbuild.build({
      ...this.config,
      entryPoints
    })
    stats.done()

    const esbuildDirectory = path.join(DIST_DIR, 'esbuild')
    fs.mkdirSync(esbuildDirectory, { recursive: true })
    fs.writeFileSync(path.join(esbuildDirectory, `${name}.meta.json`), JSON.stringify(results.metafile, null, 2))

    copyFolder('www/esbuild', 'dist/esbuild')

    for (const output in results.metafile?.outputs) {
      const file = results.metafile?.outputs[output]
      if (file.entryPoint) {
        const normalizedOutput = path.normalize(output.replace(this.config.outdir as string, ''))
        stats.add(normalizedOutput, file.bytes)

        file.imports.forEach((imported) => {
          const normalizedImport = path.normalize(imported.path.replace(this.config.outdir as string, ''))
          if (imported.path.search('node_modules') === -1) {
            stats.add(normalizedImport, getFileSizeInBytes(imported.path))
          }
        })
      }
    }

    return stats.data
  }
}

export default function (options: ActionOptions): Promise<Array<StatResult>> {
  const action = new EsbuildBuildAction(options)
  return action.run()
}
