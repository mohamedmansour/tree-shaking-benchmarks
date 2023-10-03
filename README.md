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
| name | size bun | size esbuild | size webpack | duration bun | duration esbuild | duration webpack |
| --- | --- | --- | --- | --- | --- | ---
| dynamic | 1.11 KB | 0.26 KB | 5.54 KB | 3.001 ms | 20.926 ms | 415.204 ms |
| lit-element | 24.00 KB | 25.74 KB | 27.45 KB | 8.252 ms | 42.883 ms | 1628.428 ms |
| lit-material | 63.41 KB | 69.13 KB | 86.97 KB | 13.455 ms | 45.595 ms | 2652.559 ms |
| fast-element | 60.95 KB | 81.77 KB | 83.75 KB | 18.209 ms | 36.057 ms | 1598.785 ms |
| fast-fluent | 213.74 KB | 235.03 KB | 265.29 KB | 29.057 ms | 56.669 ms | 3876.024 ms |
| react | 907.57 KB | 982.53 KB | 213.66 KB | 68.827 ms | 134.911 ms | 2191.706 ms |
| react-fluent | 1075.16 KB | 1155.29 KB | 362.25 KB | 198.722 ms | 403.232 ms | 8304.037 ms |
| react-fluent-hydration | 1075.17 KB | 1155.28 KB | 362.24 KB | 288.047 ms | 414.445 ms | 9302.264 ms |
