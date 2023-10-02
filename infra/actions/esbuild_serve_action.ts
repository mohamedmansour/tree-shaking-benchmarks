import * as esbuild from 'esbuild'

import { EsbuildBaseAction } from './esbuild_base_action.js'
import { copyFolder } from '../utils/file_utils.js'
import { ActionOptions } from './base_action.js'
import { StatResult, Stats } from '../utils/stats_utils.js'

class EsbuildServeAction extends EsbuildBaseAction {
  getActionName(): string {
    return 'esbuild-serve'
  }
  
  override async run(): Promise<Array<StatResult>> {
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
    
    return []
  }

  build(_entryPoints: Record<string, string>, _name: string): Promise<StatResult> {
    throw new Error('Method not implemented.')
  }

  private onEsbuildRequest(args: esbuild.ServeOnRequestArgs) {
    console.log(`[esbuild] ${args.path}`)
  }
}

export default function (options: ActionOptions): Promise<Array<StatResult>> {
  const action = new EsbuildServeAction(options)
  return action.run()
}
