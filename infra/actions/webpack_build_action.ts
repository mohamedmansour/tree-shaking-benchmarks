import path from 'node:path'

import webpack from 'webpack'

import { DIST_DIR, ENTRY_POINTS, SPECIAL_ALIASES, SPECIAL_ENTRY_POINTS } from '../config.js'
import { formatFileSize } from '../utils/format_utils.js'

class WebpackBuildAction {
    async run(): Promise<void> {
        await this.build(ENTRY_POINTS, /*useAlias=*/false)
        await this.build(SPECIAL_ENTRY_POINTS, /*useAlias=*/true)
    }

    private async build(entryPoints: Record<string, string>, useAliases: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            webpack({
                mode: "production",
                devtool: 'hidden-source-map',
                resolve: {
                  extensions: ['.js', '.ts', '.tsx'],
                  alias: useAliases ? SPECIAL_ALIASES : {},
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
                    
                    for (const asset of buildStats.assets || []) {
                        console.log(`Built ${path.join('dist/webpack/', asset.name)} (${formatFileSize(asset.size)})`)
                    }
                    resolve()
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