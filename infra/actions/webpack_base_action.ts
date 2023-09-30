import webpack from 'webpack'
import path from 'node:path'

import { ActionOptions, BaseAction } from './base_action.js'
import { Stats } from '../utils/stats_utils.js'

export abstract class WebpackBaseAction extends BaseAction {
  config: webpack.Configuration

  constructor(options: ActionOptions) {
    super(options)
    this.config = {
      mode: "production",
      devtool: 'hidden-source-map',
      resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        extensionAlias: {
          '.js': ['.ts', '.js'],
        }
      },
      experiments: {
        outputModule: true,
        topLevelAwait: true
      },
      output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFormat: 'module',
        chunkLoading: 'import',
        environment: {
          module: true,
          dynamicImport: true,
          dynamicImportInWorker: true,
          destructuring: true,
          bigIntLiteral: true
        },
        library: {
          type: 'module'
        },
      },
      module: {
        rules: [
          {
            test: /\.[jt]sx?$/,
            use: [
              {
                loader: 'esbuild-loader',
                options: {
                  target: 'esnext',
                  format: 'esm',
                  tsconfig: 'tsconfig.json',
                }
              }
            ]
          },
        ],
      }
    }
  }

  printStats(name: string, err: Error | undefined, webpackstats: webpack.Stats | undefined, startTime: number, resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void) {
    if (err || webpackstats?.hasErrors()) {
      reject(err || webpackstats?.compilation.errors)
    } else if (webpackstats) {
      const duarationInSeconds = (performance.now() - startTime) / 1000

      const buildStats = webpackstats.toJson({
        assets: true,
      })

      const stats = new Stats(name, duarationInSeconds)
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
