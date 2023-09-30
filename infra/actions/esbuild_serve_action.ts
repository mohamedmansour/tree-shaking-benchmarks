import fs from 'node:fs'
import http from 'node:http'
import { URL } from 'node:url'

import * as esbuild from 'esbuild'

import { EsbuildBaseAction } from './esbuild_base_action.js'
import { copyFolder } from '../utils/file_utils.js'
import { ActionOptions } from './base_action.js'

class EsbuildServeAction extends EsbuildBaseAction {
    handlerMap: Map<string, (req: http.IncomingMessage, res: http.ServerResponse) => void> = new Map()

    constructor(options: ActionOptions) {
        super(options)
        this.handlerMap.set('/api', (req, res) => this.handleApi(req, res))
    }
    
    async run(): Promise<void> {
        // Build the app.
        const esbuildOptions: esbuild.BuildOptions = {
            ...this.options,
            entryPoints: this.getEntryPoints()
        }
        const context = await esbuild.context(esbuildOptions)

        copyFolder('www', 'dist')
        
        // Add Live Reloading.
        await context.watch()

        // Start webserver on random port.
        const { host, port } = await context.serve({
            servedir: 'dist',
            onRequest: (args) => this.onEsbuildRequest(args)
        })

        // Then start a proxy server on port 3000.
        http.createServer((req, res) => this.onServerCreated(host, port, req, res)).listen(3000)

        console.log(`[  ready] http://localhost:3000/`)
    }

    private onServerCreated(host: string,
                            port: number,
                            req: http.IncomingMessage,
                            res: http.ServerResponse) {
        const options = {
            hostname: host,
            port: port,
            path: req.url,
            method: req.method,
            headers: req.headers,
        }
        
        if (req.url) {
            const reqUrl = new URL(req.url, "http://localhost").pathname
            const customUrlHandler = this.handlerMap.get(reqUrl)
            if (customUrlHandler) {
                console.log(`[ custom] ${reqUrl}`)
                customUrlHandler(req, res)
                return
            }
        }

        // Forward each incoming request to esbuild
        const proxyReq = http.request(options, proxyRes => this.onEsbuildResponse(res, proxyRes))

        // Forward the body of the request to esbuild
        req.pipe(proxyReq, { end: true })
    }

    private onEsbuildRequest(args: esbuild.ServeOnRequestArgs) {
        console.log(`[esbuild] ${args.path}`)
    }

    private onEsbuildResponse(res: http.ServerResponse, proxyRes: http.IncomingMessage) {
        // If esbuild returns "not found", send a custom 404 page
        if (proxyRes.statusCode === 404) {
            this.handle404(res)
            return
        }

        // Otherwise, forward the response from esbuild to the client
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers)
        
        proxyRes.pipe(res, { end: true })
    }

    private handle404(res: http.ServerResponse) {
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end('<h1>404</h1>')
    }

    private handleApi(req: http.IncomingMessage, res: http.ServerResponse) {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify({ status: 'ok' }))
        res.end()
    }
    
    private deleteFolder(path: string): void {
      if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true })
      }
    }
}

export default function(options: ActionOptions): Promise<void> {
    const action = new EsbuildServeAction(options)
    return action.run()
}
