import path from 'node:path'
import webpack from 'webpack'

import { DIST_DIR } from '../config.js'
import { copyFolder } from '../utils/file_utils.js'
import { StatResult, Stats } from '../utils/stats_utils.js'
import { WebpackBaseAction } from './webpack_base_action.js'
import { ActionOptions } from './base_action.js'

class WebpackBuildAction extends WebpackBaseAction {
  public getActionName(): string {
    return 'webpack'
  }

  public async build(entryPoints: Record<string, string>, name: string): Promise<StatResult> {
    copyFolder('www/webpack', 'dist/webpack')
    return new Promise((resolve, reject) => {
      try {
        const config: webpack.Configuration = {
          ...this.config,
          entry: entryPoints,
          output: {
            ...this.config.output,
            path: path.join(DIST_DIR, 'webpack'),
          }
        }

        // Bug where we cannot format esm for react fluent apps.
        if (!this.canFormatESM(Object.keys(entryPoints)[0])) {
          config!.module!.rules!.forEach((rule: any) => {
              rule.use.forEach((use: any) => {
                use.options.format = undefined;
              });
          });
        }

        const stats = new Stats(name)
        webpack(config, (err, metadata) => this.printStats(name, err, metadata, stats, resolve, reject))
      } catch (err) {
        reject(err)
      }
    })
  }
}

export default function (options: ActionOptions): Promise<Array<StatResult>> {
  const action = new WebpackBuildAction(options)
  return action.run()
}
