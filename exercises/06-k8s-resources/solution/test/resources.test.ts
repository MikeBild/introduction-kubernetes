import { describe, expect, it } from 'vitest'
import { container, find, lazy, manifests } from '../../../../scripts/lib/manifests.ts'

const api = lazy(() => container(find(manifests(`${import.meta.dirname}/..`), 'Deployment', 'shop-api')))
const requests = lazy(() => api.resources.requests)
const limits = lazy(() => api.resources.limits)

describe('06 Resources', () => {
  it('reserves CPU and memory via requests', () => {
    expect(requests).toEqual({ cpu: '100m', memory: '512Mi' })
  })

  it('limits memory to the request', () => {
    expect(limits.memory).toBe(requests.memory)
  })

  it('sets no CPU limit', () => {
    expect(limits.cpu).toBeUndefined()
  })

  it('leaves the Node.js heap enough room (at least 512Mi)', () => {
    expect(Number.parseInt(limits.memory)).toBeGreaterThanOrEqual(512)
  })
})
