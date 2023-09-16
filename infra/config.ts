import path from 'node:path';
import os from 'node:os';

export const ENTRY_POINTS: Record<string, string> = {
    'lit-element': './webuis/lit-element/app.ts',
    'lit-material': './webuis/lit-material/app.ts',
    'fast-element': './webuis/fast-element/app.ts',
    'fast-fluent': './webuis/fast-fluent/app.ts',
    'react': './webuis/react/app.tsx',
    'react-fluent': './webuis/react-fluent/app.tsx',
    'react-fluent-hydration': './webuis/react-fluent-hydration/app.tsx',
};


let distURLdir = 
  path.dirname(path.dirname(new URL(import.meta.url).pathname));

if(os.platform() !== 'linux') {
  distURLdir = distURLdir.substring(1);
}

export const DIST_DIR = distURLdir;

export const NODE_MODULE_DIR = path.join(DIST_DIR, '../node_modules');