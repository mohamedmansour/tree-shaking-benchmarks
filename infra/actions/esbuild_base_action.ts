import * as esbuild from 'esbuild'

import { ENTRY_POINTS } from '../config.js'

export abstract class EsbuildBaseAction {
    options: esbuild.BuildOptions

    constructor() {
        this.options  = {
            entryPoints: ENTRY_POINTS,
            bundle: true,
            // splitting: true,
            outdir: 'dist/esbuild',
            format: 'esm',
            minify: true,
            // There are side-effects in FAST libraries since we are doing bare imports.
            ignoreAnnotations: true,
            target: 'esnext',
            sourcemap: true,
            tsconfig: 'tsconfig.json',
            metafile: true
        }
    }

    abstract run(): Promise<void>
}
