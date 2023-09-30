interface StatInfo {
    path: string
    size: number
}
export class Stats {
    private data: StatInfo[] = []
    private totalSize = 0

    constructor(private name: string, private durationInSeconds: number) {}

    add(path: string, size: number) {
        this.data.push({ path, size })
        this.totalSize += size
    }
    
    print() {
        console.log(`Built ${this.name} (${this.formatFileSize(this.totalSize)}) in ${this.durationInSeconds.toFixed(2)}s`)
        if (this.data.length > 1) {
            for (const stat of this.data) {
                console.log(`  ${stat.path} (${this.formatFileSize(stat.size)})`)
            }
        }
    }

    private formatFileSize(bytes: number): string {
        const fileSizeInKB = bytes / 1024
        return `${fileSizeInKB.toFixed(2)} KB`
    }
}