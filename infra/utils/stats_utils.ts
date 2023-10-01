interface StatInfo {
  path: string
  size: number
}
export class Stats {
  private data: StatInfo[] = []
  private totalSize = 0
  private startTime: number = 0
  private durationInSeconds: number | undefined
  private visited = new Set<string>()

  constructor(private name: string) {
    this.startTime = performance.now()
  }

  add(path: string, size: number) {
    if (this.has(path)) {
      return
    }
    this.visited.add(path)
    this.data.push({ path, size })
    this.totalSize += size
  }

  has(path: string): boolean {
    return this.visited.has(path)
  }

  done() {
    this.durationInSeconds = (performance.now() - this.startTime) / 1000
  }

  print() {
    if (!this.durationInSeconds) {
      this.done()
    }

    console.log(`Built ${this.name} (${this.formatFileSize(this.totalSize)}) in ${this.durationInSeconds!.toFixed(3)}s`)
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
