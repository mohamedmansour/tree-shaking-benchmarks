# Tree Shaking Benchmarks

<!-- TOC -->
- [Using Bun](#using-bun)
  - [One time setup if using Bun](#one-time-setup-if-using-bun)
  - [How to run using Bun](#how-to-run-using-bun)
- [Using NodeJS](#using-nodejs)
  - [One time setup if using NodeJS](#one-time-setup-if-using-nodejs)
  - [How to run using NodeJS](#how-to-run-using-nodejs)
- [Arguments to Infra Runner](#arguments-to-infra-runner)
- [Latest results](#latest-results)
<!-- /TOC -->


The purpose of this repo is to compare different Web Framework / Library tree-shaking abilities, build time speed, and bundle size by importing a single `Button` component. 


## Using Bun
### One time setup if using Bun
1. Setup bun: Open WSL or unix, run `curl -fsSL https://bun.sh/install | bash`
2. Install dependencies: `bun install`
### How to run using Bun
Just type `bun infra/infra.ts bun:build`


## Using NodeJS
### One time setup if using NodeJS
1. Set up pnpm: Open powershell, run `iwr https://get.pnpm.io/install.ps1 -useb | iex`
2. Open a new terminal/restart vscode to ensure the newly stalled pnpm is on the path
3. Install dependencies: cd to your browser-vnext folder: run `pnpm intall`
4. Compile the infra: cd to your browser-vnext folder:run `pnpm infra-tsc`

### How to run using NodeJS
- Any time you modify the infra: `pnpm infra-tsc`
- Building the bundles:
    - `pnpm build`: to run all the bundlers for all the web frameworks.
    - `pnpm esbuild`, or `pnpm webpack` or `pnpm swc` it will output info to terminal
- To Start dev server: `pnpm start` (uses esbuild server for now, open for change)

## Arguments to Infra Runner
-  You can pass `--minify` to see minified results.
-  You can pass `--webui <name>` to filter down an a specific webui.

## Latest results
TBA
