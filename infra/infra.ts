import BuildAction from './actions/build_action.js'
import ServeAction from './actions/serve_action.js'

import { Command } from 'commander'

const program = new Command()
program
    .name('Microsoft Edge WebUI Infra')
    .description('CLI to build and serve the Microsoft Edge WebUI.')
    .version('0.0.1')
program.command('build').action(async () => await BuildAction())
program.command('serve').action(async () => await ServeAction())

program.parse()