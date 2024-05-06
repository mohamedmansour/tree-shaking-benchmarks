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
        const config: webpack.Configuration = {
          ...this.config,
          entry: entryPoints,
          output: {
            ...this.config.output,
            path: path.join(DIST_DIR, 'rspack', name),
          }
        }

        // Bug where we cannot format esm for react fluent apps.
        if (!this.canFormatESM(Object.keys(entryPoints)[0])) {
          config!.module!.rules!.forEach((rule: any) => {
              rule.use.forEach((use: any) => {
                use.options.format = undefined;
              });
          });
        }

        const stats = new Stats(name, this.getActionName());
        rspack.rspack(config as rspack.Configuration, (err, metadata) => this.printStats(name, err || null, metadata as unknown as webpack.Stats , stats, resolve, reject))
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
