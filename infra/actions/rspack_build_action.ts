import path from 'node:path'
import rspack from "@rspack/core";
import webpack from 'webpack'

import { DIST_DIR } from '../config.js'
import { copyFolder, getFileNameWithoutExtension } from '../utils/file_utils.js'
import { StatResult, Stats } from '../utils/stats_utils.js'
import { ActionOptions } from './base_action.js'
import { WebpackBaseAction } from './webpack_base_action.js';


class RspackBuildAction extends WebpackBaseAction {
  public getActionName(): string {
    return 'rspack'
  }

  public async build(entryPoints: Record<string, string>, name: string): Promise<StatResult> {
    copyFolder(`webuis/${name}`, `dist/rspack/${name}`, ['.ts', '.tsx', '.d.ts', '.js'])
    return new Promise((resolve, reject) => {
      try {
        const config: rspack.Configuration  = {
          mode: "production",
          devtool: 'hidden-source-map',
          resolve: {
            extensions: ['.js', '.ts', '.tsx'],
            extensionAlias: {
              '.js': ['.ts', '.js', '.tsx'],
            }
          },
          experiments: {
            outputModule: true
          },
          optimization: {
            minimize: this.minify
          },
          output: {
            path: path.join(DIST_DIR, 'rspack', name),
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
                      tsconfig: './tsconfig.json',
                      target: 'esnext',
                      format: 'esm'
                    }
                  }
                ]
              },
            ],
          },
          entry: entryPoints
        };

        const stats = new Stats(name, this.getActionName());
        rspack.rspack(config, (err, metadata) => this.printStats(name, err || undefined, metadata as unknown as webpack.Stats , stats, resolve, reject))
      } catch (err) {
        reject(err)
      }
    })
  }
}

export default function (options: ActionOptions): Promise<Array<StatResult>> {
  const action = new RspackBuildAction(options)
  return action.run()
}
