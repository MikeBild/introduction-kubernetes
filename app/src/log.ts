// Eine JSON-Zeile pro Ereignis nach stdout – den Transport übernimmt die Plattform.
type Level = 'debug' | 'info' | 'warn' | 'error'

export const log = (level: Level, msg: string, fields: Record<string, unknown> = {}): void => {
  const line = JSON.stringify({ time: new Date().toISOString(), level, msg, ...fields })
  if (level === 'error') console.error(line)
  else console.log(line)
}
