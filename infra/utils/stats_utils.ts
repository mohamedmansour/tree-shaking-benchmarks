
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

export function printStat(stats: Array<StatResult>) {
  console.table(stats.map(s => ({
    name: s.name,
    size: formatFileSize(s.totalSizeInKilobytes),
    duration: `${s.durationInMilliseconds.toFixed(3)} ms`,
    files: s.stats.length
  })))
}

export function printAggregateStats(allstats: Array<Array<StatResult>>) {
  const tableData = mergeStats(allstats)
  console.table(tableData)
}

export function printMarkdownStats(allstats: Array<Array<StatResult>>) {
  const tableData = mergeStats(allstats)
  const tableHeaders = Object.keys(tableData[0])
  const tableRows = tableData.map((row: any) => `| ${Object.values(row).join(' | ')} |`)
  const markdownTable = `| ${tableHeaders.join(' | ')} |\n| ${tableHeaders.map(() => '---').join(' | ')}\n${tableRows.join('\n')}`
  console.log(markdownTable)
}

function formatFileSize(bytes: number): string {
  const fileSizeInKB = bytes / 1024
  return `${fileSizeInKB.toFixed(2)} KB`
}

function mergeStats(allstats: Array<Array<StatResult>>) {
  const foundGroups = new Set<string>()

  // Generate the table data by joining all the stats in the same category.
  const tableData = allstats.reduce((acc: Array<any>, curr: StatResult[], index: number) => {
    curr.forEach((s: StatResult) => {
      // Save the group name so we can generate the available columns later.
      const groupName = s.name.split('-')[0]
      foundGroups.add(groupName)

      // Find the row in the table data. Needed to merge the stats.
      const name = s.name.replace(`${groupName}-`, '')
      let foundIndex = acc.findIndex((a: StatResult) => {
        return a.name === name;
      })
      
      if (foundIndex === -1) { // If not found, add a new row.
        acc.push({
          name: name,
          ['size ' + groupName]: formatFileSize(s.totalSizeInKilobytes),
          ['duration ' + groupName]: `${s.durationInMilliseconds.toFixed(3)} ms`,
        })
      } else { // If found, merge the stats.
        acc[foundIndex]['size ' + groupName] = formatFileSize(s.totalSizeInKilobytes);
        acc[foundIndex]['duration ' + groupName] = `${s.durationInMilliseconds.toFixed(3)} ms`
      }
    });
    return acc
  }, [])

  // Generate the available columns based on the property order.
  const propertyOrder = ['size', 'duration']
  let availableColumns = ['name']
  propertyOrder.forEach((prop: string) => {
    foundGroups.forEach((groupName: string) => {
      availableColumns.push(prop + ' ' + groupName)
    })
  })

  // Sort the table based on the available order.
  tableData.forEach((row: any, idx: number) => {
    const sortedRow: any = {}
    availableColumns.forEach((prop: string) => {
      sortedRow[prop] = row[prop]
    })
    tableData[idx] = sortedRow
  })
  
  return tableData
}
