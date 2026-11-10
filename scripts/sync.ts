// Distributes the given manifests (Namespace, Postgres) from app/k8s into every exercise
// that has a shop-api.yaml, and generates the tests in the starting point from the tests of the reference solution.
// Each exercise stays self-contained that way: cd exercises/<nr>/start && kubectl apply -f .
// Usage:  npm run sync             copy
//         npm run sync -- --check  only check whether all copies are current
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'

const root = join(import.meta.dirname, '..')
const given = ['00-namespace.yaml', 'postgres.yaml']
const check = process.argv.includes('--check')

const dirs = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== 'test')
    .flatMap((entry) => [join(dir, entry.name), ...dirs(join(dir, entry.name))])

let stale = 0
const write = (file: string, content: string) => {
  if (check) {
    if (!existsSync(file) || readFileSync(file, 'utf8') !== content) {
      console.error(`veraltet: ${relative(root, file)}`)
      stale++
    }
  } else {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, content)
  }
}

const exercises = join(root, 'exercises')
const targets = dirs(exercises).filter((dir) => existsSync(join(dir, 'shop-api.yaml')))
for (const target of targets) {
  for (const file of given) {
    // An exercise that deliberately changes a given file marks it in the first line.
    const existing = join(target, file)
    if (existsSync(existing) && readFileSync(existing, 'utf8').startsWith('# Angepasst')) continue
    write(existing, readFileSync(join(root, 'app', 'k8s', file), 'utf8'))
  }
}

// The tests in the starting point are the tests of the reference solution, only with describe.skip.
for (const exercise of readdirSync(exercises)) {
  const tests = join(exercises, exercise, 'solution', 'test')
  if (!existsSync(tests)) continue
  for (const file of readdirSync(tests)) {
    const skipped = readFileSync(join(tests, file), 'utf8').replace(
      /^describe\(/m,
      '// Remove .skip when you start the exercise.\ndescribe.skip(',
    )
    write(join(exercises, exercise, 'start', 'test', file), skipped)
  }
}

if (check && stale > 0) {
  console.error(`${stale} Kopien weichen ab. Führe npm run sync aus.`)
  process.exit(1)
}
console.log(`${targets.length} Manifest-Ordner ${check ? 'geprüft' : 'aktualisiert'}`)
