import fs from 'node:fs'
import path from 'node:path'
import { rolldown } from 'rolldown'
import jsshaker from 'rollup-plugin-jsshaker'

import { DIST_DIR } from '../config.js'
import { ActionOptions, BaseAction } from './base_action.js'
import { copyFolder, getFileNameWithoutExtension, getFileSizeInBytes } from '../utils/file_utils.js'
import { StatResult, Stats } from '../utils/stats_utils.js'

class RolldownJsshakerBuildAction extends BaseAction {
  public getActionName(): string {
    return 'rolldown-jsshaker'
  }

  public async build(entryPoints: Record<string, string>, name: string): Promise<StatResult> {
    const stats = new Stats(name, this.getActionName())
    const outputDir = path.join(DIST_DIR, 'rolldown-jsshaker', name)

    try {
      const bundle = await rolldown({
        input: entryPoints,
        resolve: {
          extensions: ['.js', '.ts', '.tsx', '.jsx']
        },
        platform: 'browser',
        plugins: [
          jsshaker() as any
        ]
      })

      const output = await bundle.generate({
        dir: outputDir,
        format: 'es',
        sourcemap: true,
        minify: this.minify,
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js'
      })

      await bundle.write({
        dir: outputDir,
        format: 'es',
        sourcemap: true,
        minify: this.minify,
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js'
      })

      await bundle.close()
      stats.done()

      // Copy static files
      copyFolder(`webuis/${name}`, `dist/rolldown-jsshaker/${name}`, ['.ts', '.tsx', '.d.ts', '.js'])

      // Collect stats from output
      for (const chunk of output.output) {
        if (chunk.type === 'chunk') {
          const fileName = chunk.fileName
          const filePath = path.join(outputDir, fileName)
          const size = getFileSizeInBytes(filePath)
          const isEntry = chunk.isEntry || false
          stats.add(fileName, size, isEntry && getFileNameWithoutExtension(fileName) === name)
        }
      }

      return stats.data
    } catch (error) {
      console.error('Rolldown+jsshaker build error:', error)
      throw error
    }
  }
}

export default function (options: ActionOptions): Promise<Array<StatResult>> {
  const action = new RolldownJsshakerBuildAction(options)
  return action.run()
}
