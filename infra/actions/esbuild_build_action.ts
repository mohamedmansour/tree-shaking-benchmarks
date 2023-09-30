import fs from 'node:fs'
import path from 'node:path'

import * as esbuild from 'esbuild'

import { DIST_DIR } from '../config.js'
import { EsbuildBaseAction } from './esbuild_base_action.js'
import { copyFolder } from '../utils/file_utils.js'
import { ActionOptions } from './base_action.js'
import { Stats } from '../utils/stats_utils.js'

class EsbuildBuildAction extends EsbuildBaseAction {
    async run(): Promise<void> {
        const entryPoints = this.getEntryPoints()
        for (const entryPoint in entryPoints) {
            await this.build({ [entryPoint]: entryPoints[entryPoint] }, `esbuild-${entryPoint}`)
        }
    }

    private async build(entryPoints: Record<string, string>, name: string): Promise<void> {
        const results = await esbuild.build({
            ...this.options,
            entryPoints
        })
        const esbuildDirectory = path.join(DIST_DIR, 'esbuild')
        fs.mkdirSync(esbuildDirectory, { recursive: true })
        fs.writeFileSync(path.join(esbuildDirectory, `${name}.meta.json`), JSON.stringify(results.metafile, null, 2))

        copyFolder('www/esbuild', 'dist/esbuild')

        const found = new Set<string>()
        const stats = new Stats(name)
        
        for (const output in results.metafile?.outputs) {
            const file = results.metafile?.outputs[output]
            if (file.entryPoint) {
                const normalizedOutput = path.normalize(output.replace(this.options.outdir as string, ''))
                if (found.has(normalizedOutput)) {
                    continue
                }
                found.add(normalizedOutput)
                stats.add(normalizedOutput, file.bytes)

                file.imports.forEach((imported) => {
                    const normalizedImport = path.normalize(imported.path.replace(this.options.outdir as string, ''))
                    if (found.has(normalizedImport)) {
                        return
                    }
                    found.add(normalizedImport)
                    if (imported.path.search('node_modules') === -1) {
                        const size = this.getFileSizeInBytes(imported.path)
                        stats.add(normalizedImport, size)
                    }
                })
            }
        }

        stats.print()
    }

    private getFileSizeInBytes(path: string): number {
        const stats = fs.statSync(path)
        const fileSizeInBytes = stats.size
        return fileSizeInBytes
    }
}

export default function(options: ActionOptions): Promise<void> {
    const action = new EsbuildBuildAction(options)
    return action.run()
}