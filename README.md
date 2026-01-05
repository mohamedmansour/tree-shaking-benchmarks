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


The purpose of this repo is to compare different Web Framework / Library tree-shaking abilities, build time speed, and bundle size by importing a single `Button` component.  Supports esbuild, bun, rspack, and webpack.


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
| name | size bun | size esbuild | size webpack | size rspack | duration bun | duration esbuild | duration webpack | duration rspack |
| --- | --- | --- | --- | --- | --- | --- | --- | ---
| dynamic | 0.22 KB | 0.10 KB | 5.63 KB | 4.47 KB | 10.293 ms | 23.895 ms | 228.827 ms | 46.922 ms |
| lit-element | 54.08 KB | 22.80 KB | 25.43 KB | 26.65 KB | 11.543 ms | 25.924 ms | 166.951 ms | 47.928 ms |
| lit-material | 101.21 KB | 69.41 KB | 89.16 KB | 91.97 KB | 14.524 ms | 35.689 ms | 186.225 ms | 47.779 ms |
| fast-element | 88.29 KB | 114.36 KB | 116.94 KB | 117.92 KB | 11.750 ms | 19.386 ms | 165.574 ms | 46.821 ms |
| fast-fluent | 122.03 KB | 184.26 KB | 241.13 KB | 243.30 KB | 19.583 ms | 44.424 ms | 343.019 ms | 84.892 ms |
| react | 940.43 KB | 1045.19 KB | 516.92 KB | 516.39 KB | 42.010 ms | 61.485 ms | 278.239 ms | 83.877 ms |
| react-fluent | 1132.26 KB | 1244.91 KB | 673.04 KB | 696.92 KB | 509.384 ms | 1202.444 ms | 4351.574 ms | 598.786 ms |
| react-fluent-hydration | 1132.28 KB | 1244.91 KB | 673.03 KB | 696.89 KB | 286.703 ms | 1139.087 ms | 4358.897 ms | 587.044 ms |
