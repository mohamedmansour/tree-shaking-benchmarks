const { config } = require("@swc/core/spack")

module.exports = config({
  entry: {
    "lit-element": __dirname + '/webuis/lit-element/app.ts',
    "lit-material": __dirname + '/webuis/lit-material/app.ts',
    "fast-element": __dirname + '/webuis/fast-element/app.ts',
    "fast-fluent": __dirname + '/webuis/fast-fluent/app.ts',
    // "react": __dirname + '/webuis/react/app.tsx',
  },
  output: {
    path: __dirname + "/dist/swc",
    name: "[name].js",
  }
})