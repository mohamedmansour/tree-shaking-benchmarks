import path from 'node:path'

import webpack, { StatsAsset } from 'webpack'

import { DIST_DIR, ENTRY_POINTS, SPECIAL_ENTRY_POINTS } from '../config.js'
import { formatFileSize } from '../utils/format_utils.js'

class WebpackBuildAction {
    async run(): Promise<void> {
        const stats = await this.build()
        for (const asset of stats) {
            console.log(`Built ${path.join('dist/webpack/', asset.name)} (${formatFileSize(asset.size)})`)
        }
    }

    private async build(): Promise<StatsAsset[]> {
        return new Promise((resolve, reject) => {
            webpack({
                mode: "production",
                devtool: 'hidden-source-map',
                resolve: {
                  extensions: ['.js', '.ts', '.tsx'],
                },
                entry: {...ENTRY_POINTS, ...SPECIAL_ENTRY_POINTS},
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
                }
            }, (err, stats) => {
                if (err || stats?.hasErrors()) {
                    reject(err || stats?.compilation.errors)
                } else if (stats) {
                    const buildStats = stats.toJson({
                        assets: true,
                    })
                    resolve(buildStats.assets || [])
                } else {
                    reject('No stats object!')
                }
            })
        })
    }
}

export default function(): Promise<void> {
    const action = new WebpackBuildAction()
    return action.run()
}