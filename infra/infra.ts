import { Command, Option } from 'commander'
import fs from 'node:fs'

import EsbuildServeAction from './actions/esbuild_serve_action.js'
import EsbuildBuildAction from './actions/esbuild_build_action.js'
import WebpackComplexBuildAction from './actions/webpack_complex_build_action.js'
import WebpackBuildAction from './actions/webpack_build_action.js'
import { ActionOptions } from './actions/base_action.js'
import { WEBUIS_DIR } from './config.js'

const program = new Command()

function run(func: (options: ActionOptions) => Promise<void>, exit: boolean = true) {
    return (options: Record<string, boolean>) => {
        func(options)
            .then(() => exit && process.exit(0))
            .catch(e => {
                console.error(e)
                process.exit(1)
            })
    }
}

program
    .name('Web Performance Infra')
    .description('CLI to build and serve.')
    .version('0.0.1')
program.command('esbuild:serve').action(run(EsbuildServeAction))
program.command('esbuild:build').action(run(EsbuildBuildAction))
program.command('webpack:build').action(run(WebpackBuildAction))
program.command('webpackcomplex:build').action(run(WebpackComplexBuildAction))
program.command('all:build').action((options) => {
    run(EsbuildBuildAction, false)(options)
    run(WebpackBuildAction, false)(options)
    run(WebpackComplexBuildAction, false)(options)
})

const availableWebUIs = fs.readdirSync(WEBUIS_DIR)
program.commands.forEach(cmd => {
    cmd.addOption(new Option('--webui <name>', 'webui name').choices(availableWebUIs))
})

program.parse(process.argv)
