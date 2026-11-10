import { defineConfig } from 'vitest/config'

// Tests of the app, all reference solutions and all starting points.
// The starting points are on describe.skip and count as skipped until you remove .skip.
export default defineConfig({
  test: {
    include: ['app/test/**/*.test.ts', 'exercises/*/{start,solution}/test/**/*.test.ts'],
  },
})
