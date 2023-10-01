# Tree Shaking Benchmarks

The purpose of this repo is to compare different Web Framework / Library tree-shaking abilities, build time speed, and bundle size by importing a single `Button` component. 

## One time setup
1. Set up pnpm: Open powershell, run `iwr https://get.pnpm.io/install.ps1 -useb | iex`
2. Open a new terminal/restart vscode to ensure the newly stalled pnpm is on the path
3. Install dependencies: cd to your browser-vnext folder: run `pnpm intall`
4. Compile the infra: cd to your browser-vnext folder:run `pnpm infra-tsc`

## How to run using Bun
Just type `bun infra/infra.ts bun:build`

## How to run using NodeJS
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
