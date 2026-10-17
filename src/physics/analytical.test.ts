import { describe, it, expect } from 'vitest'
import { bendingMoment, deflection } from './analytical'
import type { Beam, Load } from './types'

const E = 210e9 // steel, Pa
const I = 8.333e-6 // m^4, rectangular section 0.2m x 0.3m
const L = 4 // m

// relative difference between two numbers
const rel = (a: number, b: number) => Math.abs(a - b) / Math.abs(b)

describe('closed-form beam formulas', () => {
  it('cantilever with tip load: δ = PL³/3EI and M = -PL at the wall', () => {
    const beam: Beam = { support: 'cantilever', L, E, I }
    const load: Load = { kind: 'point', P: 1000, a: L }
    expect(rel(deflection(beam, load, L), (load.P * L ** 3) / (3 * E * I))).toBeLessThan(1e-12)
    expect(bendingMoment(beam, load, 0)).toBeCloseTo(-load.P * L)
  })

  it('cantilever with uniform load: δ = qL⁴/8EI', () => {
    const beam: Beam = { support: 'cantilever', L, E, I }
    const q = 2e3
    expect(rel(deflection(beam, { kind: 'udl', q }, L), (q * L ** 4) / (8 * E * I))).toBeLessThan(
      1e-12,
    )
  })

  it('simply-supported, central load: δ = PL³/48EI and M = PL/4', () => {
    const beam: Beam = { support: 'simply-supported', L, E, I }
    const load: Load = { kind: 'point', P: 10e3, a: L / 2 }
    expect(rel(deflection(beam, load, L / 2), (load.P * L ** 3) / (48 * E * I))).toBeLessThan(1e-12)
    expect(bendingMoment(beam, load, L / 2)).toBeCloseTo((load.P * L) / 4)
  })

  it('simply-supported, uniform load: δ = 5qL⁴/384EI and M = qL²/8', () => {
    const beam: Beam = { support: 'simply-supported', L, E, I }
    const q = 2e3
    expect(
      rel(deflection(beam, { kind: 'udl', q }, L / 2), (5 * q * L ** 4) / (384 * E * I)),
    ).toBeLessThan(1e-12)
    expect(bendingMoment(beam, { kind: 'udl', q }, L / 2)).toBeCloseTo((q * L ** 2) / 8)
  })

  it('simply-supported: zero deflection at supports, continuous under the load', () => {
    const beam: Beam = { support: 'simply-supported', L, E, I }
    const load: Load = { kind: 'point', P: 5e3, a: 1.3 }
    expect(deflection(beam, load, 0)).toBeCloseTo(0, 12)
    expect(deflection(beam, load, L)).toBeCloseTo(0, 12)
    const left = deflection(beam, load, load.a - 1e-9)
    const right = deflection(beam, load, load.a + 1e-9)
    expect(rel(left, right)).toBeLessThan(1e-6)
  })
})
