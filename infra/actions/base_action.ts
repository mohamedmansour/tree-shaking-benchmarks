import * as esbuild from 'esbuild'
import { entryPoints } from '../config.js'
export abstract class BaseAction {
    options: esbuild.BuildOptions

    constructor() {
        this.options  = {
            entryPoints,
            bundle: true,
            // splitting: true,
            outdir: 'www/scripts',
            format: 'esm',
            // minify: true,
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
