import { Command, Option } from 'commander'
import fs from 'node:fs'

import { ActionOptions } from './actions/base_action.js'
import { IS_TYPESCRIPT_ENV, WEBUIS_DIR } from './config.js'

const program = new Command()

async function run(o: ActionOptions, action_clazz: string, skip_exit: boolean = false) {
  const start = performance.now()
  let errorOccurred = false;
  try {
    await import(action_clazz).then(module => module.default(o));
  } catch (e) {
    console.error(e);
    errorOccurred = true;
  } finally {
    const end = performance.now();
    console.log(`Done in ${(end - start).toFixed(2)}ms`);
    if (!skip_exit) {
      process.exit(errorOccurred ? 1 : 0);
    }
  }
}

program
  .name('Web Performance Infra')
  .description('CLI to build and serve.')
  .version('0.0.1')
program.command('esbuild:serve').action(async (o) => await run(o, './actions/esbuild_serve_action.js'))
program.command('esbuild:build').action(async (o) => await run(o, './actions/esbuild_build_action.js'))
program.command('webpack:build').action(async (o) => await run(o, './actions/webpack_build_action.js'))
program.command('bun:build').action(async (o) => await run(o, './actions/bun_build_action.js'))
program.command('webpackcomplex:build').action(async (o) => await run(o, './actions/webpack_complex_build_action.js'))
program.command('all:build').action(async (o) => {
  await run(o, './actions/esbuild_build_action.js', /*skip_exit=*/true)
  await run(o, './actions/webpack_build_action.js', /*skip_exit=*/true)
  if (IS_TYPESCRIPT_ENV) {
    await run(o, './actions/bun_build_action.js', /*skip_exit=*/true)
  }
  // await run(o, WebpackComplexBuildAction, false)
  process.exit(0)
})

const availableWebUIs = fs.readdirSync(WEBUIS_DIR)
program.commands.forEach(cmd => {
  cmd.addOption(new Option('--webui <name>', 'webui name').choices(availableWebUIs))
  cmd.addOption(new Option('--minify', 'minify the output').default(false));
})

program.parse(process.argv)
