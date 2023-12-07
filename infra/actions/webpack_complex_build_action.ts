import path from 'node:path'
import webpack from 'webpack'

import { DIST_DIR } from '../config.js'
import { GriffelCSSExtractionPlugin } from '@griffel/webpack-extraction-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { copyFolder } from '../utils/file_utils.js'
import { WebpackBaseAction } from './webpack_base_action.js'
import { ActionOptions } from './base_action.js'
import { Stats, StatResult } from '../utils/stats_utils.js'

class WebpackComplexBuildAction extends WebpackBaseAction {
  public getActionName(): string {
    return 'webpackcomplex'
  }

  public async build(entryPoints: Record<string, string>, name: string): Promise<StatResult> {
    copyFolder(`webuis/${name}`, `dist/webpackcomplex/${name}`, ['.ts', '.tsx', '.d.ts', '.js'])
    return new Promise((resolve, reject) => {
      try {
        const config: webpack.Configuration = {
          ...this.config,
          entry: entryPoints,
          output: {
            ...this.config.output,
            path: path.join(DIST_DIR, 'webpack-complex', name),
          },
          plugins: [
            new MiniCssExtractPlugin(), new GriffelCSSExtractionPlugin()
          ],
          module: {
            ...this.config.module,
            rules: [
              ...this.config.module!.rules!,
              {
                test: /\.(js|ts|tsx)$/,
                use: {
                  loader: GriffelCSSExtractionPlugin.loader,
                },
              },
              {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: '@griffel/webpack-loader',
                  options: {
                    babelOptions: {
                      presets: ['@babel/preset-typescript'],
                    },
                  },
                },
              },
              {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
              },
            ]
          }
        }
        const stats = new Stats(name, this.getActionName())
        webpack(config, (err, metadata) => this.printStats(name, err, metadata, stats, resolve, reject))
      } catch (err) {
        reject(err)
      }
    })
  }
}

export default function (options: ActionOptions): Promise<Array<StatResult>> {
  const action = new WebpackComplexBuildAction(options)
  return action.run()
}
