import path from 'node:path';

import webpack from 'webpack';

import { DIST_DIR, ENTRY_POINTS } from '../config.js'
import { formatFileSize } from '../utils/format_utils.js'
import { GriffelCSSExtractionPlugin } from '@griffel/webpack-extraction-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { copyFolder } from '../utils/file_utils.js';

class WebpackBuildAction {
    async run(): Promise<void> {
        await this.build(ENTRY_POINTS)
    }

    private async build(entryPoints: Record<string, string>): Promise<void> {
        copyFolder('www/webpack', 'dist/webpack')
        return new Promise((resolve, reject) => {
            webpack({
              mode: "production",
              devtool: 'hidden-source-map',
              resolve: {
                extensions: ['.js', '.ts', '.tsx']
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
            }, (err, stats) => {
              if (err || stats?.hasErrors()) {
                  reject(err || stats?.compilation.errors);
              } else if (stats) {
                const buildStats = stats.toJson({
                  assets: true,
                });
                
                for (const asset of buildStats.assets || []) {
                  console.log(`Built ${path.join('dist/webpack/', asset.name)} (${formatFileSize(asset.size)})`);
                }
                resolve();
              } else {
                reject('No stats object!');
              }
            })
        })
    }
}

export default function(): Promise<void> {
    const action = new WebpackBuildAction();
    return action.run();
}