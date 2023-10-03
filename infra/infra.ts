import { Command, Option } from 'commander'
import fs from 'node:fs'

import { ActionOptions } from './actions/base_action.js'
import { IS_TYPESCRIPT_ENV, WEBUIS_DIR } from './config.js'
import { StatResult, printAggregateStats, printStat } from './utils/stats_utils.js'

import './shims/console_shim.js'

const program = new Command()

async function run(o: ActionOptions, action_clazz: string) {
  return await import(action_clazz).then(module => module.default(o));
}

async function measure(func: () => Promise<void>) {
  const start = performance.now()
  let errorOccurred = false;
  try {
    await func()
  } catch (e) {
    errorOccurred = true;
    throw e
  } finally {
    const end = performance.now();
    console.log(`Total runtime in ${(end - start).toFixed(3)}ms\n`);
    process.exit(errorOccurred ? 1 : 0);
  }
}

async function print(o: ActionOptions, action_clazz: string) {
  measure(async () => {
    printStat(await run(o, action_clazz))
  })
}

program
  .name('Web Performance Infra')
  .description('CLI to build and serve.')
  .version('0.0.1')
program.command('esbuild:serve').action(async (o) => await print(o, './actions/esbuild_serve_action.js'))
program.command('esbuild:build').action(async (o) => await print(o, './actions/esbuild_build_action.js'))
program.command('webpack:build').action(async (o) => await print(o, './actions/webpack_build_action.js'))
program.command('bun:build').action(async (o) => await print(o, './actions/bun_build_action.js'))
program.command('webpackcomplex:build').action(async (o) => await print(o, './actions/webpack_complex_build_action.js'))
program.command('all:build').action(async (o) => {
  measure(async () => {
    const results: Array<Array<StatResult>> = []
    if (IS_TYPESCRIPT_ENV) {
      results.push(await run(o, './actions/bun_build_action.js'))
    }
    results.push(await run(o, './actions/esbuild_build_action.js'))
    results.push(await run(o, './actions/webpack_build_action.js'))
    printAggregateStats(results)
  })
})

const availableWebUIs = fs.readdirSync(WEBUIS_DIR)
program.commands.forEach(cmd => {
  cmd.addOption(new Option('--webui <name>', 'webui name').choices(availableWebUIs))
  cmd.addOption(new Option('--minify', 'minify the output').default(false));
})

program.parse(process.argv)
