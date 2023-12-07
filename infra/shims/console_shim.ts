import { Console } from 'console'
import { Transform } from 'stream'

const ts = new Transform({ transform(chunk, _, cb) { cb(null, chunk) } })
const logger = new Console({ stdout: ts })

/**
 * Bun doesn't have console.table, so do this instead which works.
 * @see https://github.com/oven-sh/bun/issues/802
 * @see https://stackoverflow.com/a/67859384
 */
function table(input: any) {
  logger.table(input)
  const table = (ts.read() || '').toString()
  let result = ''
  for (let row of table.split(/[\r\n]+/)) {
    // Remove the index, by shifting everything to the left.
    let r = row.replace(/[^┬]*┬/, '┌')
    r = r.replace(/^├─*┼/, '├')
    r = r.replace(/│[^│]*/, '')
    r = r.replace(/^└─*┴/, '└')
    r = r.replace(/'/g, ' ')
    result += `${r}\n`
  }
  console.log(result);
}

console.table = table

export {}