import * as esbuild from 'esbuild'

export abstract class EsbuildBaseAction {
    options: esbuild.BuildOptions

    constructor() {
        this.options  = {
            bundle: true,
            // splitting: true,
            outdir: 'dist/esbuild',
            format: 'esm',
            minify: true,
            target: 'esnext',
            sourcemap: true,
            tsconfig: 'tsconfig.json',
            metafile: true
        }
    }

    abstract run(): Promise<void>
}
