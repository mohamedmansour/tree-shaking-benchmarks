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
      minify: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
      target: 'esnext',
      sourcemap: true,
      tsconfig: 'tsconfig.json',
      metafile: true
    }
  }
}
