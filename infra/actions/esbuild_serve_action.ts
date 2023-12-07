import * as esbuild from 'esbuild'

import { EsbuildBaseAction } from './esbuild_base_action.js'
import { deleteFolderRecursive, symlinkDirRecursive } from '../utils/file_utils.js'
import { ActionOptions } from './base_action.js'
import { StatResult } from '../utils/stats_utils.js'

class EsbuildServeAction extends EsbuildBaseAction {
  getActionName(): string {
    return 'esbuild-serve'
  }
  
  override async run(): Promise<Array<StatResult>> {
    if (!this.webui) {
      throw new Error('--webui is undefined')
    }
    console.info(`[loading] ${this.webui}`);
    
    deleteFolderRecursive('dist/serve');

    // Build the app.
    const esbuildOptions: esbuild.BuildOptions = {
      ...this.config,
      entryPoints: this.getEntryPoints(),
      outdir: 'dist/serve/'
    }
    
    const hotReloadingEnabled = process.env.ENABLE_HOT_RELOADING === 'true';
    if (hotReloadingEnabled) {
      esbuildOptions.banner = { js: '(() => new EventSource(\'/esbuild\').onmessage = () => location.reload())();' }
    }
    
    console.info(`[    env] hot reloading ${hotReloadingEnabled ? 'enabled' : 'disabled'}`);

    const context = await esbuild.context(esbuildOptions)

    symlinkDirRecursive(`webuis/${this.webui}`, 'dist/serve', ['.ts', '.tsx', '.d.ts', '.js'])

    // Copy the public folder.
    symlinkDirRecursive(`public/${this.webui}`, 'dist/serve')

    // Add Live Reloading.
    await context.watch()

    // Start webserver on random port.
    const { host, port } = await context.serve({
      servedir: 'dist/serve',
      onRequest: (args) => this.onEsbuildRequest(args)
    })

    console.log(`[  ready] http://localhost:${port}/`)
    
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
