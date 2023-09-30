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
        copyFolder('www/webpack', 'dist/webpack')
        return new Promise((resolve, reject) => {
          try {
            webpack({
              mode: "production",
              devtool: 'hidden-source-map',
              resolve: {
                extensions: ['.js', '.ts', '.tsx'],
                extensionAlias: {
                  '.js': ['.ts', '.js'],
                }
              },
              entry: entryPoints,
              output: {
                path: path.join(DIST_DIR, 'webpack'),
                publicPath: '/dist/',
                filename: '[name].js',
                chunkFilename: '[name].chunk.js',
                trustedTypes: true,
              },
              module: {
                rules: [
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
                    use: [ MiniCssExtractPlugin.loader, 'css-loader' ],
                  },
                  {
                    test: /\.[jt]sx?$/,
                    loader: 'esbuild-loader',
                    options: {
                      // tsconfig: 'tsconfig.json',
                    }
                  },
                ],
              },
              experiments: {
                topLevelAwait: true,
              },
              plugins: [
                new MiniCssExtractPlugin(), new GriffelCSSExtractionPlugin()
              ],
            }, (err, stats) => this.printStats(name, err, stats, resolve, reject))
          } catch(err) {
            reject(err)
          }
        })
    }
}

export default function(options: ActionOptions): Promise<void> {
    const action = new WebpackComplexBuildAction(options)
    return action.run()
}