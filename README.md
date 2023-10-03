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
Just type `bun run infra bun:build`


## Using NodeJS
### One time setup if using NodeJS
1. Set up pnpm: Open powershell, run `iwr https://get.pnpm.io/install.ps1 -useb | iex`
2. Open a new terminal/restart vscode to ensure the newly stalled pnpm is on the path
3. Install dependencies: cd to your browser-vnext folder: run `pnpm intall`

### How to run using NodeJS
Just type `npm run infra-node esbuild:build`

## Arguments to Infra Runner
-  `--minify` to see minified results.
-  `--webui <name>` to filter down an a specific webui.
-  `--markdown` to print markdown.

## Latest results
| name | size bun | size esbuild | duration bun | duration esbuild | files bun | files esbuild |
| --- | --- | --- | --- | --- | --- | ---
| dynamic | 1.11 KB | 0.26 KB | 3.742 ms | 19.865 ms | 3 | 2 |
| lit-element | 24.00 KB | 25.74 KB | 10.479 ms | 37.414 ms | 1 | 1 |
| lit-material | 63.41 KB | 69.13 KB | 16.460 ms | 44.947 ms | 1 | 1 |
| fast-element | 60.95 KB | 81.77 KB | 20.341 ms | 30.388 ms | 1 | 1 |
| fast-fluent | 213.74 KB | 235.03 KB | 31.827 ms | 51.956 ms | 1 | 1 |
| react | 907.57 KB | 982.53 KB | 73.199 ms | 122.457 ms | 1 | 1 |
| react-fluent | 1075.17 KB | 1155.29 KB | 202.621 ms | 413.537 ms | 1 | 1 |
| react-fluent-hydration | 1075.15 KB | 1155.28 KB | 285.868 ms | 402.532 ms | 1 | 1 |