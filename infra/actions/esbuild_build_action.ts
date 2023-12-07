import fs from 'node:fs'
import path from 'node:path'

import * as esbuild from 'esbuild'

import { DIST_DIR } from '../config.js'
import { EsbuildBaseAction } from './esbuild_base_action.js'
import { copyFolder, getFileNameWithoutExtension, getFileSizeInBytes } from '../utils/file_utils.js'
import { ActionOptions } from './base_action.js'
import { Stats, StatResult } from '../utils/stats_utils.js'

class EsbuildBuildAction extends EsbuildBaseAction {
  public getActionName(): string {
    return 'esbuild'
  }

  public async build(entryPoints: Record<string, string>, name: string): Promise<StatResult> {
    const stats = new Stats(name, this.getActionName())
    const results = await esbuild.build({
      ...this.config,
      outdir: `${this.config.outdir}/${name}`,
      entryPoints
    })
    stats.done()

    const esbuildDirectory = path.join(DIST_DIR, 'esbuild')
    fs.mkdirSync( `${esbuildDirectory}/${name}`, { recursive: true })
    fs.writeFileSync(path.join(esbuildDirectory, `${name}/meta.json`), JSON.stringify(results.metafile, null, 2))

    copyFolder(`webuis/${name}`, `dist/esbuild/${name}`, ['.ts', '.tsx', '.d.ts', '.js'])

    for (const output in results.metafile?.outputs) {
      const file = results.metafile?.outputs[output]
      if (file.entryPoint) {
        const normalizedOutput = path.normalize(output.replace(this.config.outdir as string, ''))
        stats.add(normalizedOutput, file.bytes, getFileNameWithoutExtension(file.entryPoint) === name)

        file.imports.forEach((imported) => {
          const normalizedImport = path.normalize(imported.path.replace(this.config.outdir as string, ''))
          if (imported.path.search('node_modules') === -1) {
            stats.add(normalizedImport, getFileSizeInBytes(imported.path), getFileNameWithoutExtension(normalizedImport) === name)
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
