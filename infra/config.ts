import path from 'node:path'

export const ENTRY_POINTS: Record<string, string> = {
  'dynamic': './webuis/dynamic/test.ts',
  'lit-element': './webuis/lit-element/app.ts',
  'lit-material': './webuis/lit-material/app.ts',
  'fast-element': './webuis/fast-element/app.ts',
  'fast-fluent': './webuis/fast-fluent/app.ts',
  'react': './webuis/react/app.tsx',
  'react-fluent': './webuis/react-fluent/app.tsx',
  'react-fluent-hydration': './webuis/react-fluent-hydration/app.tsx',
}

const distURLdir = path.dirname(path.dirname(new URL(import.meta.url).pathname))
  .replace(/^\/([a-z]):\//i, '$1:/') // convert Windows path to drive letter format

const isTypeScriptEnv = path.extname(import.meta.url) === '.ts'

export const DIST_DIR = isTypeScriptEnv ? path.resolve(distURLdir, 'dist') : distURLdir
export const ROOT_DIR = path.resolve(DIST_DIR, '..')
export const NODE_MODULE_DIR = path.resolve(ROOT_DIR, 'node_modules')
export const WWW_DIR = path.resolve(ROOT_DIR, 'www')
export const WEBUIS_DIR = path.resolve(ROOT_DIR, 'webuis')
