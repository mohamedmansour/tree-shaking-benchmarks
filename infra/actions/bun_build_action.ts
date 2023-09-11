import { ENTRY_POINTS } from '../config.js'
import { copyFolder } from '../utils/file_utils.js';
import { formatFileSize } from '../utils/format_utils.js';
import fs from 'node:fs';
class BunBuildAction {
    async run(): Promise<void> {
        await this.build(ENTRY_POINTS)
    }

    private async build(entryPoints: Record<string, string>): Promise<void> {
        copyFolder('www/bun', 'dist/bun')
        return new Promise((resolve, reject) => {
            Bun.build({
                entrypoints: Object.values(entryPoints),
                outdir: 'dist/bun',
            }).then((e) => {
                e.outputs.forEach((o) => {
                    const stats = fs.statSync(o.path);
                    console.log(`Built ${o.path} (${formatFileSize(stats.size)})`);
                });
            });
        });
    }
}

export default function(): Promise<void> {
    const action = new BunBuildAction();
    return action.run();
}
