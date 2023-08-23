import fs from 'node:fs'
import path from 'node:path'

import * as esbuild from 'esbuild'

import { DIST_DIR, ENTRY_POINTS, SPECIAL_ENTRY_POINTS } from '../config.js';
import { formatFileSize } from '../utils/format_utils.js';
import { EsbuildBaseAction } from "./esbuild_base_action.js";
import { FluentUIEsmoduleResolverplugin } from '../plugins/fluentui_esmodule_resolver_plugin.js';

class EsbuildBuildAction extends EsbuildBaseAction {
    async run(): Promise<void> {
        await this.build(ENTRY_POINTS, true);
        await this.build(SPECIAL_ENTRY_POINTS, true);
    }

    private async build(entryPoints: Record<string, string>, usePlugin: boolean): Promise<void> {
        const results = await esbuild.build({
            ...this.options,
            entryPoints,
            plugins: usePlugin ? [FluentUIEsmoduleResolverplugin] : undefined
        })
        const esbuildDirectory = path.join(DIST_DIR, 'esbuild')
        fs.mkdirSync(esbuildDirectory, { recursive: true })
        fs.writeFileSync(path.join(esbuildDirectory, usePlugin ? 'plugin-meta.json' : 'meta.json'), JSON.stringify(results.metafile, null, 2))

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