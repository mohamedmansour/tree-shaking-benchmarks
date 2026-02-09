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


The purpose of this repo is to compare different Web Framework / Library tree-shaking abilities, build time speed, and bundle size by importing a single `Button` component.  Supports esbuild, bun, rspack, webpack, rolldown, and rolldown+jsshaker.


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
-  `--iterations <num>` the number of iterations to avg.

## Latest results
| name | size bun | size esbuild | size webpack | size rspack | size rolldown | size rolldown-jsshaker | duration bun | duration esbuild | duration webpack | duration rspack | duration rolldown | duration rolldown-jsshaker |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dynamic | 0.21 KB | 0.10 KB | 5.63 KB | 4.47 KB | 0.16 KB | 0.16 KB | 1.803 ms | 6.519 ms | 143.077 ms | 20.710 ms | 20.160 ms | 7.737 ms |
| lit-element | 54.08 KB | 22.80 KB | 25.43 KB | 26.65 KB | 21.11 KB | 20.40 KB | 3.466 ms | 9.475 ms | 61.717 ms | 15.342 ms | 5.889 ms | 12.688 ms |
| lit-material | 101.21 KB | 69.41 KB | 89.16 KB | 91.97 KB | 76.36 KB | 72.77 KB | 4.085 ms | 11.557 ms | 91.373 ms | 20.730 ms | 6.865 ms | 19.302 ms |
| fast-element | 89.35 KB | 114.36 KB | 116.94 KB | 117.92 KB | 105.69 KB | 78.59 KB | 3.865 ms | 7.082 ms | 84.036 ms | 29.349 ms | 8.281 ms | 20.517 ms |
| fast-fluent | 153.05 KB | 184.39 KB | 241.26 KB | 243.43 KB | 187.72 KB | 150.81 KB | 5.992 ms | 11.937 ms | 160.753 ms | 34.590 ms | 10.877 ms | 34.430 ms |
| react | 940.67 KB | 1045.19 KB | 516.92 KB | 516.39 KB | 854.55 KB | 800.96 KB | 28.741 ms | 40.280 ms | 148.423 ms | 64.802 ms | 79.837 ms | 5003.248 ms |
| react-fluent | 1134.15 KB | 1246.42 KB | 674.16 KB | 698.04 KB | 1050.81 KB | 949.76 KB | 90.710 ms | 228.894 ms | 1885.361 ms | 375.551 ms | 159.538 ms | 5205.392 ms |
| react-fluent-hydration | 1134.16 KB | 1246.42 KB | 674.16 KB | 698.01 KB | 1050.84 KB | 949.70 KB | 69.337 ms | 215.627 ms | 1751.268 ms | 361.966 ms | 165.952 ms | 5132.274 ms |
