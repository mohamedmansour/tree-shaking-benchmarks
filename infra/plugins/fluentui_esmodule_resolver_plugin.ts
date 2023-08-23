import * as esbuild from 'esbuild'
import path from 'node:path'

/**
 * This plugin is to make sure FluentUI packages are rewritten to support ESModules.
 */
export const FluentUIEsmoduleResolverplugin: esbuild.Plugin = {
    name: 'base-resolver-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /^(@microsoft\/fast-(element|foundation)|@fluentui\/web-components)/}, async (resolveArgs: esbuild.OnResolveArgs) => {
   
        // Rewrite the package name to replace the non-v3 package with the v3 package.
        let packageName = resolveArgs.path.replace(/^(@microsoft\/fast-(?:element|foundation)|@fluentui\/web-components)(?!-v3)/, '$1-v3')

        // Do not resolve the same resolution again.
        if (packageName !== resolveArgs.path) {
          // Resolve the packageName to the full absolute path.
          const result = await build.resolve(packageName, {
            kind: 'import-statement',
            resolveDir: path.dirname(resolveArgs.importer)
          })

          if (result.errors.length > 0) {
            return { errors: result.errors }
          }

          // Must not be external since we are mutating the node_modules resolution.
          return { path: result.path, external: false }
        }
        
        return null;
      })
    },
  }
  