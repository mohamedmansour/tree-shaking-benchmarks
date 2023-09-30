import { Command, Option } from 'commander'
import fs from 'node:fs'

import EsbuildServeAction from './actions/esbuild_serve_action.js'
import EsbuildBuildAction from './actions/esbuild_build_action.js'
import WebpackComplexBuildAction from './actions/webpack_complex_build_action.js'
import WebpackBuildAction from './actions/webpack_build_action.js'
import { ActionOptions } from './actions/base_action.js'
import { WEBUIS_DIR } from './config.js'

const program = new Command()

function run(o: ActionOptions, func: (o: ActionOptions) => Promise<void>, exit: boolean = true): Promise<void> {
  return func(o)
    .catch(e => {
      console.error(e)
      process.exit(1)
    })
}

program
  .name('Web Performance Infra')
  .description('CLI to build and serve.')
  .version('0.0.1')
program.command('esbuild:serve').action(async (o) => await run(o, EsbuildServeAction))
program.command('esbuild:build').action(async (o) => await run(o, EsbuildBuildAction))
program.command('webpack:build').action(async (o) => await run(o, WebpackBuildAction))
program.command('webpackcomplex:build').action(async (o) => await run(o, WebpackComplexBuildAction))
program.command('all:build').action(async (o) => {
  await run(o, EsbuildBuildAction, false)
  await run(o, WebpackBuildAction, false)
  await run(o, WebpackComplexBuildAction, false)
  process.exit(0)
})

const availableWebUIs = fs.readdirSync(WEBUIS_DIR)
program.commands.forEach(cmd => {
  cmd.addOption(new Option('--webui <name>', 'webui name').choices(availableWebUIs))
})

program.parse(process.argv)
