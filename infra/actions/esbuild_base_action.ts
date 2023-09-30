import * as esbuild from 'esbuild'
import { ActionOptions, BaseAction } from './base_action.js'

export abstract class EsbuildBaseAction extends BaseAction {
  options: esbuild.BuildOptions

  constructor(options: ActionOptions) {
    super(options)
    this.options = {
      bundle: true,
      splitting: true,
      outdir: 'dist/esbuild/',
      format: 'esm',
      minify: true,
      target: 'esnext',
      sourcemap: true,
      tsconfig: 'tsconfig.json',
      metafile: true
    }
  }
}
