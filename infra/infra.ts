import { Command, Option } from 'commander'
import fs from 'node:fs'

import { ActionOptions } from './actions/base_action.js'
import { IS_TYPESCRIPT_ENV, WEBUIS_DIR } from './config.js'
import { StatResult, printAggregateStats, printMarkdownStats, printStat } from './utils/stats_utils.js'

import './shims/console_shim.js'

const program = new Command()

async function run(o: ActionOptions, action_clazz: string) {
  return await import(action_clazz).then(module => module.default(o))
}

async function measure(func: () => Promise<void>) {
  const start = performance.now()
  let errorOccurred = false
  try {
    await func()
  } catch (e) {
    errorOccurred = true;
    console.error(e)
  } finally {
    const end = performance.now()
    console.log(`Total runtime in ${(end - start).toFixed(3)} ms\n`)
    process.exit(errorOccurred ? 1 : 0)
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
program.addHelpCommand()
program.command('esbuild:serve').description('run test server').action(async (o) => await print(o, './actions/esbuild_serve_action.js'))
program.command('esbuild:build').description('esbuild runner').action(async (o) => await print(o, './actions/esbuild_build_action.js'))
program.command('webpack:build').description('webpack runner').action(async (o) => await print(o, './actions/webpack_build_action.js'))
program.command('bun:build').description('bun runner').action(async (o) => await print(o, './actions/bun_build_action.js'))
program.command('webpackcomplex:build').description('webpack custom').action(async (o) => await print(o, './actions/webpack_complex_build_action.js'))
program.command('all:build').description('run all at once aggregate view').action(async (o) => {
  measure(async () => {
    const results: Array<Array<StatResult>> = []
    if (IS_TYPESCRIPT_ENV) {
      results.push(await run(o, './actions/bun_build_action.js'))
    }
    results.push(await run(o, './actions/esbuild_build_action.js'))
    results.push(await run(o, './actions/webpack_build_action.js'))

    if (o['markdown'] as boolean) {
      printMarkdownStats(results)
    } else {
      printAggregateStats(results)
    }
  })
})

program.commands.forEach(cmd => {
  cmd.addOption(new Option('--webui <name>', 'webui name').choices(fs.readdirSync(WEBUIS_DIR)))
  cmd.addOption(new Option('--minify', 'minify the output').default(false))
  cmd.addOption(new Option('--markdown', 'markdown the output').default(false))
  cmd.addOption(new Option('--iterations <num>', 'number of iterations to run').preset(1).argParser(parseInt))
})

if (process.argv.length < 3)
  program.help()

program.parse(process.argv)
