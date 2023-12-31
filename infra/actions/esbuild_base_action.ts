import * as esbuild from 'esbuild'
import { ActionOptions, BaseAction } from './base_action.js'

export abstract class EsbuildBaseAction extends BaseAction {
  config: esbuild.BuildOptions

  constructor(options: ActionOptions) {
    super(options)
    this.config = {
      bundle: true,
      splitting: true,
      outdir: 'dist/esbuild/',
      format: 'esm',
      chunkNames: '[name]',
      minify: this.minify,
      minifyIdentifiers: this.minify,
      minifySyntax: this.minify,
      minifyWhitespace: this.minify,
      target: 'esnext',
      sourcemap: 'external',
      tsconfig: 'tsconfig.json',
      metafile: true
    }
  }
}
