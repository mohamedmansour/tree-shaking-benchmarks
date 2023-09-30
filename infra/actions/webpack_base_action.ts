import webpack from 'webpack'

import { ActionOptions, BaseAction } from './base_action.js'
import { Stats } from '../utils/stats_utils.js'

export abstract class WebpackBaseAction extends BaseAction {

    constructor(options: ActionOptions) {
        super(options)
    }

    printStats(name: string, err: Error | undefined, webpackstats: webpack.Stats | undefined, resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void) {
        if (err || webpackstats?.hasErrors()) {
            reject(err || webpackstats?.compilation.errors)
        } else if (webpackstats) {
          const buildStats = webpackstats.toJson({
            assets: true,
          })
          
          const stats = new Stats(name)
          for (const asset of buildStats.assets || []) {
            stats.add(asset.name, asset.size)
          }

          stats.print()
          resolve()
        } else {
          reject('No stats object!')
        }
    }
}
