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
        outputModule: true
      },
      optimization: {
          minimize: this.minify
      },
      output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFormat: 'module',
        chunkLoading: 'import',
        module: true,
        clean: false  // Dont' clean since this is being managed in infra.
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
                  format: 'esm'
                }
              }
            ]
          },
        ],
      }
    }
  }

  canFormatESM(entryPoint: string): boolean {
    return !['react-fluent', 'react-fluent-hydration'].includes(entryPoint)
  }

  printStats(name: string, err: Error | undefined, metadata: webpack.Stats | undefined, stats: Stats, resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void) {
    if (err || metadata?.hasErrors()) {
      reject(err || metadata?.compilation.errors)
    } else if (metadata) {
      stats.done()
      
      const buildStats = metadata.toJson({
        assets: true,
      })

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
