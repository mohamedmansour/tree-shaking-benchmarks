// Copyright (C) Microsoft Corporation. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const path = require('path')
const assert = require('assert').strict

module.exports = (env, args) => {
  const cwdPath = path.resolve(process.cwd())
  const mode = process.env.NODE_ENV || (env && env.NODE_ENV) || 'production'
  const targetOS = process.env.TARGET_OS || (env && env.TARGET_OS) || ''
  const outputPathRoot = process.env.gn_target_gen_dir ? process.env.gn_target_gen_dir : cwdPath
  return {
    mode: "production",
    devtool: mode === 'production' ? 'hidden-source-map' : 'inline-source-map',
    resolve: {
      extensions: ['.js', '.ts'],
    },
    entry: {
        'lit-element': './webuis/lit-element/app.ts',
        'lit-material': './webuis/lit-material/app.ts',
        'fast-element': './webuis/fast-element/app.ts',
        'fast-fluent': './webuis/fast-fluent/app.ts',
        'react': './webuis/react/app.tsx',
    },
    output: {
      path: path.resolve(outputPathRoot, 'dist/webpack'),
      publicPath: '/dist/',
      filename: '[name].js',
      chunkFilename: '[name].chunk.js',
      trustedTypes: true,
    },
    module: {
      rules: [
        {
            test: /\.[jt]sx?$/,
            loader: 'esbuild-loader',
            options: {
                // tsconfig: 'tsconfig.json',
            }
        },
      ],
    },
    experiments: {
      topLevelAwait: true,
    },
  }
}
