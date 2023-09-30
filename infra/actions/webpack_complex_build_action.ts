import path from 'node:path'
import webpack from 'webpack'

import { DIST_DIR } from '../config.js'
import { GriffelCSSExtractionPlugin } from '@griffel/webpack-extraction-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { copyFolder } from '../utils/file_utils.js'
import { WebpackBaseAction } from './webpack_base_action.js'
import { ActionOptions } from './base_action.js'

class WebpackComplexBuildAction extends WebpackBaseAction {
  async run(): Promise<void> {
    const entryPoints = this.getEntryPoints()
    for (const entryPoint in entryPoints) {
      await this.build({ [entryPoint]: entryPoints[entryPoint] }, `webpack-complex-${entryPoint}`)
    }
  }

  private async build(entryPoints: Record<string, string>, name: string): Promise<void> {
    copyFolder('www/webpack', 'dist/webpack-complex')
    return new Promise((resolve, reject) => {
      try {
        const startTime = performance.now()
        const config: webpack.Configuration = {
          ...this.config,
          entry: entryPoints,
          output: {
            ...this.config.output,
            path: path.join(DIST_DIR, 'webpack-complex'),
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
        webpack(config, (err, stats) => this.printStats(name, err, stats, startTime, resolve, reject))
      } catch (err) {
        reject(err)
      }
    })
  }
}

export default function (options: ActionOptions): Promise<void> {
  const action = new WebpackComplexBuildAction(options)
  return action.run()
}