import { defineConfig } from 'vitest/config'

// Tests der App, aller Lösungen und aller Startpunkte.
// Die Startpunkte stehen auf describe.skip und zählen als skipped, bis du .skip entfernst.
export default defineConfig({
  test: {
    include: ['app/test/**/*.test.ts', 'exercises/*/{start,solution}/test/**/*.test.ts'],
  },
})
