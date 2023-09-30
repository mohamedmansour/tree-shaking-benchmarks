import path from 'node:path'
import fs from 'node:fs'

export function copyFolder(sourceFolder: string, destinationFolder: string): void {
    fs.mkdirSync(destinationFolder, { recursive: true })
    const files = fs.readdirSync(sourceFolder)
    for (const file of files) {
        const sourceFilePath = path.join(sourceFolder, file)
        const destinationFilePath = path.join(destinationFolder, file)
        if (fs.statSync(sourceFilePath).isDirectory()) {
            copyFolder(sourceFilePath, destinationFilePath)
        } else {
            fs.copyFileSync(sourceFilePath, destinationFilePath)
        }
    }
}
