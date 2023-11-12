import path from 'node:path'

const distURLdir = path.dirname(path.dirname(new URL(import.meta.url).pathname))
  .replace(/^\/([a-z]):\//i, '$1:/') // convert Windows path to drive letter format

export const IS_TYPESCRIPT_ENV = path.extname(import.meta.url) === '.ts'
export const DIST_DIR = IS_TYPESCRIPT_ENV ? path.resolve(distURLdir, 'dist') : distURLdir
export const ROOT_DIR = path.resolve(DIST_DIR, '..')
export const NODE_MODULE_DIR = path.resolve(ROOT_DIR, 'node_modules')
export const WEBUIS_DIR = path.resolve(ROOT_DIR, 'webuis')
