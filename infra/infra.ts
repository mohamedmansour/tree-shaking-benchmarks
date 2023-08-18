import EsbuildBuildAction from './actions/esbuild_build_action.js'
import EsbuildServeAction from './actions/esbuild_serve_action.js'

import { Command } from 'commander'

const program = new Command()
program
    .name('Web Performance Infra')
    .description('CLI to build and serve.')
    .version('0.0.1')
program.command('esbuild:build').action(async () => await EsbuildBuildAction())
program.command('esbuild:serve').action(async () => await EsbuildServeAction())

program.parse()