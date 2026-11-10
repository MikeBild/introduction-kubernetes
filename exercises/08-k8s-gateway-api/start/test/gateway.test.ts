import { describe, expect, it } from 'vitest'
import { find, lazy, manifests } from '../../../../scripts/lib/manifests.ts'

const objects = lazy(() => manifests(`${import.meta.dirname}/..`))
const gatewayClass = lazy(() => find(objects, 'GatewayClass', 'envoy'))
const gateway = lazy(() => find(objects, 'Gateway', 'werkstatt'))
const route = lazy(() => find(objects, 'HTTPRoute', 'shop-api'))

// Remove .skip when you start the exercise.
describe.skip('08 Gateway API', () => {
  it('uses the stable API gateway.networking.k8s.io/v1', () => {
    for (const obj of [gatewayClass, gateway, route]) expect(obj.apiVersion).toBe('gateway.networking.k8s.io/v1')
  })

  it('binds the GatewayClass to Envoy Gateway', () => {
    expect(gatewayClass.spec.controllerName).toBe('gateway.envoyproxy.io/gatewayclass-controller')
  })

  it('opens an HTTP listener on port 80 only for routes from its own namespace', () => {
    expect(gateway.spec.gatewayClassName).toBe('envoy')
    expect(gateway.spec.listeners).toEqual([
      { name: 'http', protocol: 'HTTP', port: 80, allowedRoutes: { namespaces: { from: 'Same' } } },
    ])
  })

  it('routes /api to the Service shop-api and removes the prefix', () => {
    const [rule] = route.spec.rules
    expect(route.spec.parentRefs).toEqual([{ name: 'werkstatt' }])
    expect(rule.matches).toEqual([{ path: { type: 'PathPrefix', value: '/api' } }])
    expect(rule.filters[0].urlRewrite.path).toEqual({ type: 'ReplacePrefixMatch', replacePrefixMatch: '/' })
    expect(rule.backendRefs).toEqual([{ name: 'shop-api', port: 80 }])
  })

  it('does without Ingress', () => {
    expect(objects.some((obj) => obj.kind === 'Ingress')).toBe(false)
  })
})
