import * as esbuild from 'esbuild'

import { EsbuildBaseAction } from './esbuild_base_action.js'
import { copyFolder } from '../utils/file_utils.js'
import { ActionOptions } from './base_action.js'

class EsbuildServeAction extends EsbuildBaseAction {
  async run(): Promise<void> {
    // Build the app.
    const esbuildOptions: esbuild.BuildOptions = {
      ...this.config,
      entryPoints: this.getEntryPoints()
    }
    const context = await esbuild.context(esbuildOptions)

    copyFolder('www', 'dist')

    // Add Live Reloading.
    await context.watch()

    // Start webserver on random port.
    const { host, port } = await context.serve({
      servedir: 'dist',
      onRequest: (args) => this.onEsbuildRequest(args)
    })

    console.log(`[  ready] http://${host}:${port}/`)
  }

  private onEsbuildRequest(args: esbuild.ServeOnRequestArgs) {
    console.log(`[esbuild] ${args.path}`)
  }
}

export default function (options: ActionOptions): Promise<void> {
  const action = new EsbuildServeAction(options)
  return action.run()
}
