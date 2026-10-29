import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseAllDocuments } from 'yaml'

// Kleine Helfer für die Tests der Übungen: Manifeste lesen und Objekte finden.
// Die Typen bleiben bewusst locker, die Tests prüfen Felder einzeln.
export type K8sObject = { apiVersion: string; kind: string; metadata: { name: string; namespace?: string; labels?: Record<string, string> }; [key: string]: any }

// Wertet erst beim ersten Zugriff aus. So bricht ein Startpunkt mit unfertigen Manifesten
// nicht schon beim Laden der Tests ab, solange die Tests auf describe.skip stehen.
export const lazy = <T extends object>(load: () => T): T => {
  let value: T | undefined
  const get = () => (value ??= load())
  return new Proxy({} as T, {
    get: (_, key) => Reflect.get(get(), key),
    has: (_, key) => Reflect.has(get(), key),
    ownKeys: () => Reflect.ownKeys(get()),
    getOwnPropertyDescriptor: (_, key) => Reflect.getOwnPropertyDescriptor(get(), key),
  })
}

export const read =(dir: string, file: string): string => {
  const path = join(dir, file)
  if (!existsSync(path)) throw new Error(`${file} fehlt in ${dir}`)
  return readFileSync(path, 'utf8')
}

export const parse = (text: string): K8sObject[] =>
  parseAllDocuments(text)
    .map((doc) => doc.toJS() as K8sObject | null)
    .filter((obj): obj is K8sObject => obj !== null)

// Alle Manifeste eines Ordners, so wie kubectl apply -f . sie liest.
export const manifests = (dir: string): K8sObject[] =>
  readdirSync(dir)
    .filter((file) => /\.ya?ml$/.test(file) && file !== 'kustomization.yaml')
    .sort()
    .flatMap((file) => parse(read(dir, file)))

// Manifeste, wie Kustomize sie für einen Ordner rendert (kubectl kustomize).
export const kustomize = (dir: string): K8sObject[] =>
  parse(execFileSync('kubectl', ['kustomize', dir], { encoding: 'utf8' }))

export const find = (objects: K8sObject[], kind: string, name: string): K8sObject => {
  const found = objects.find((obj) => obj.kind === kind && obj.metadata.name === name)
  if (!found) throw new Error(`${kind}/${name} fehlt`)
  return found
}

export const container = (deployment: K8sObject, name = 'api') => {
  const found = deployment.spec.template.spec.containers.find((c: { name: string }) => c.name === name)
  if (!found) throw new Error(`Container ${name} fehlt in ${deployment.metadata.name}`)
  return found
}

// Shell-Skript ohne Kommentare und mit zusammengezogenen Zeilenfortsetzungen.
export const script = (dir: string, file: string): string =>
  read(dir, file)
    .replace(/\\\r?\n/g, ' ')
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith('#'))
    .join('\n')
