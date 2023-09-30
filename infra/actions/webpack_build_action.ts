import path from 'node:path'
import webpack from 'webpack'

import { DIST_DIR } from '../config.js'
import { copyFolder } from '../utils/file_utils.js'
import { WebpackBaseAction } from './webpack_base_action.js'
import { ActionOptions } from './base_action.js'

class WebpackBuildAction extends WebpackBaseAction {
  async run(): Promise<void> {
    const entryPoints = this.getEntryPoints()
    for (const entryPoint in entryPoints) {
      await this.build({ [entryPoint]: entryPoints[entryPoint] }, `webpack-${entryPoint}`)
    }
  }

  private async build(entryPoints: Record<string, string>, name: string): Promise<void> {
    copyFolder('www/webpack', 'dist/webpack')
    return new Promise((resolve, reject) => {
      try {
        const startTime = performance.now()
        const config: webpack.Configuration = {
          ...this.config,
          entry: entryPoints,
          output: {
            ...this.config.output,
            path: path.join(DIST_DIR, 'webpack'),
          }
        }
        webpack(config, (err, stats) => this.printStats(name, err, stats, startTime, resolve, reject))
      } catch (err) {
        reject(err)
      }
    })
  }
}

export default function (options: ActionOptions): Promise<void> {
  const action = new WebpackBuildAction(options)
  return action.run()
}
