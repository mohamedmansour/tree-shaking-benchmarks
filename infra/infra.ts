import EsbuildServeAction from './actions/esbuild_serve_action.js';
import EsbuildBuildAction from './actions/esbuild_build_action.js';
import WebpackBuildAction from './actions/webpack_build_action.js';
import BunBuildAction from './actions/bun_build_action.js';

import { Command } from 'commander';

const program = new Command();

program
    .name('Web Performance Infra')
    .description('CLI to build and serve.')
    .version('0.0.1');
program.command('esbuild:serve').action(async () => await EsbuildServeAction());
program.command('esbuild:build').action(async () => await EsbuildBuildAction());
program.command('webpack:build').action(async () => await WebpackBuildAction());
program.command('bun:build').action(async () => await BunBuildAction());

program.parse();
