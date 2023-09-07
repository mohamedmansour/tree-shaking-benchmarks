import fs from 'node:fs'
import path from 'node:path'

import * as esbuild from 'esbuild'

import { DIST_DIR, ENTRY_POINTS } from '../config.js'
import { formatFileSize } from '../utils/format_utils.js'
import { EsbuildBaseAction } from "./esbuild_base_action.js"
import { copyFolder } from '../utils/file_utils.js'

class EsbuildBuildAction extends EsbuildBaseAction {
    async run(): Promise<void> {
        await this.build(ENTRY_POINTS, 'meta.json')
    }

    private async build(entryPoints: Record<string, string>, metaFileName: string): Promise<void> {
        const results = await esbuild.build({
            ...this.options,
            entryPoints
        })
        const esbuildDirectory = path.join(DIST_DIR, 'esbuild')
        fs.mkdirSync(esbuildDirectory, { recursive: true })
        fs.writeFileSync(path.join(esbuildDirectory, metaFileName), JSON.stringify(results.metafile, null, 2))

        copyFolder('www/esbuild', 'dist/esbuild')

        for (const output in results.metafile?.outputs) {
            const file = results.metafile?.outputs[output]
            if (file.entryPoint) {
                console.log(`Built ${output} (${formatFileSize(file.bytes)})`)
                file.imports.forEach((imported) => {
                    // Since we are rewriting the imports to make FluentUI ESModules compliant, don't print out the node_modules imports.
                    if (imported.path.search('node_modules') === -1) {
                        console.log(`  ${imported.path} (${this.getFileSize(imported.path)})`)
                    }
                })
            }
        }
    }

    private getFileSize(path: string): string {
        const stats = fs.statSync(path)
        const fileSizeInBytes = stats.size
        const fileSizeInKB = fileSizeInBytes / 1024
        return `${fileSizeInKB.toFixed(2)} KB`
    }
}

export default function(): Promise<void> {
    const action = new EsbuildBuildAction()
    return action.run()
}