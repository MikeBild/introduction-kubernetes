// Verteilt die gegebenen Manifeste (Namespace, Postgres) aus app/k8s in jede Übung,
// die eine shop-api.yaml hat, und erzeugt die Tests im Startpunkt aus den Tests der Lösung.
// Jede Übung bleibt so eigenständig: cd exercises/<nr>/start && kubectl apply -f .
// Aufruf: npm run sync             kopieren
//         npm run sync -- --check  nur prüfen, ob alle Kopien aktuell sind
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
    // Eine Übung, die eine gegebene Datei bewusst ändert, markiert sie in der ersten Zeile.
    const existing = join(target, file)
    if (existsSync(existing) && readFileSync(existing, 'utf8').startsWith('# Angepasst')) continue
    write(existing, readFileSync(join(root, 'app', 'k8s', file), 'utf8'))
  }
}

// Die Tests im Startpunkt sind die Tests der Lösung, nur mit describe.skip.
for (const exercise of readdirSync(exercises)) {
  const tests = join(exercises, exercise, 'solution', 'test')
  if (!existsSync(tests)) continue
  for (const file of readdirSync(tests)) {
    const skipped = readFileSync(join(tests, file), 'utf8').replace(
      /^describe\(/m,
      '// Entferne .skip, wenn du loslegst.\ndescribe.skip(',
    )
    write(join(exercises, exercise, 'start', 'test', file), skipped)
  }
}

if (check && stale > 0) {
  console.error(`${stale} Kopien weichen ab. Führe npm run sync aus.`)
  process.exit(1)
}
console.log(`${targets.length} Manifest-Ordner ${check ? 'geprüft' : 'aktualisiert'}`)
