import { Command, Option } from 'commander'
import fs from 'node:fs'

import { ActionOptions } from './actions/base_action.js'
import { WEBUIS_DIR } from './config.js'

const program = new Command()

async function run(o: ActionOptions, action_clazz: string) {
  return import(action_clazz)
    .then(module => module.default(o))
    .catch(e => {
      console.error(e)
      process.exit(1)
    })
}

program
  .name('Web Performance Infra')
  .description('CLI to build and serve.')
  .version('0.0.1')
program.command('esbuild:serve').action(async (o) => await run(o, './actions/esbuild_serve_action.js'))
program.command('esbuild:build').action(async (o) => await run(o, './actions/esbuild_build_action.js'))
program.command('webpack:build').action(async (o) => await run(o, './actions/webpack_build_action.js'))
program.command('webpackcomplex:build').action(async (o) => await run(o, './actions/webpack_complex_build_action.js'))
program.command('all:build').action(async (o) => {
  await run(o, './actions/esbuild_serve_action.js')
  await run(o, './actions/esbuild_build_action.js')
  // await run(o, WebpackComplexBuildAction, false)
  process.exit(0)
})

const availableWebUIs = fs.readdirSync(WEBUIS_DIR)
program.commands.forEach(cmd => {
  cmd.addOption(new Option('--webui <name>', 'webui name').choices(availableWebUIs))
  cmd.addOption(new Option('--minify', 'minify the output').default(false));
})

program.parse(process.argv)
