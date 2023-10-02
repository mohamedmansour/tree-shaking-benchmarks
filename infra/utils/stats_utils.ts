
import { table } from './console_utils.js';

export interface StatInfo {
  path: string
  size: number
}

export interface StatResult {
  name: string
  stats: StatInfo[]
  totalSizeInKilobytes: number
  durationInMilliseconds: number
}

export class Stats {
  private _data: StatInfo[] = []
  private _totalSizeInKilobytes = 0
  private _startTimeInMilliseconds: number = 0
  private _durationInMilliseconds: number | undefined
  private _visited = new Set<string>()

  constructor(private name: string) {
    this._startTimeInMilliseconds = performance.now()
  }

  add(path: string, size: number) {
    if (this.has(path)) {
      return
    }
    this._visited.add(path)
    this._data.push({ path, size })
    this._totalSizeInKilobytes += size
  }

  has(path: string): boolean {
    return this._visited.has(path)
  }

  done() {
    this._durationInMilliseconds = (performance.now() - this._startTimeInMilliseconds)
  }

  get data(): StatResult {
    if (!this._durationInMilliseconds) {
      console.error('Stats not done yet, call done() first')
      this.done()
    }

    return {
      name: this.name,
      stats: this._data,
      totalSizeInKilobytes: this._totalSizeInKilobytes,
      durationInMilliseconds: this._durationInMilliseconds!
    }
  }
}

export function formatFileSize(bytes: number): string {
  const fileSizeInKB = bytes / 1024
  return `${fileSizeInKB.toFixed(2)} KB`
}

export function printStat(stats: Array<StatResult>) {
  table(stats.map(s => ({
    name: s.name,
    size: formatFileSize(s.totalSizeInKilobytes),
    duration: `${s.durationInMilliseconds.toFixed(3)}ms`,
    files: s.stats.length
  })))
}

export function printAggregateStats(stats: Array<Array<StatResult>>) {
  stats.forEach(s => printStat(s))
}