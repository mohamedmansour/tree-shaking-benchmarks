import path from 'node:path'

export const ENTRY_POINTS: Record<string, string> = {
    'lit-element': './webuis/lit-element/app.ts',
    'lit-material': './webuis/lit-material/app.ts',
    'fast-element': './webuis/fast-element/app.ts',
    'fast-fluent': './webuis/fast-fluent/app.ts',
    'react': './webuis/react/app.tsx',
}

export const SPECIAL_ENTRY_POINTS: Record<string, string> = {
    'fast-fluent-aliased': './webuis/fast-fluent-aliased/app.ts',
}
export const SPECIAL_ALIASES: Record<string, string> = {
    '@fluentui/web-components': '@fluentui/web-components-v3',
    '@microsoft/fast-element': '@microsoft/fast-element-v3',
    '@microsoft/fast-foundation': '@microsoft/fast-foundation-v3',
    '@microsoft/fast-web-utilities': '@microsoft/fast-web-utilities-v3',
}

export const DIST_DIR = path.dirname(path.dirname(new URL(import.meta.url).pathname)).substring(1)

export const NODE_MODULE_DIR = path.join(DIST_DIR, '../node_modules')