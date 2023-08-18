import * as esbuild from 'esbuild'
import { BaseAction } from "./base_action.js";
import fs from 'node:fs'
import path from 'node:path'
import { DIST_DIR } from '../config.js';

class BuildAction extends BaseAction {
    async run(): Promise<void> {
        const results = await esbuild.build(this.options)
        fs.mkdirSync(DIST_DIR, { recursive: true })
        fs.writeFileSync(path.join(DIST_DIR, 'meta.json'), JSON.stringify(results.metafile, null, 2))

        for (const output in results.metafile?.outputs) {
            const file = results.metafile?.outputs[output]
            if (file.entryPoint) {
                console.log(`Built ${output} from ${file.entryPoint} (${this.getFileSize(output)})`)
                file.imports.forEach((imported) => {
                    console.log(`  ${imported.path} (${this.getFileSize(imported.path)})`)
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
    const action = new BuildAction()
    return action.run()
}