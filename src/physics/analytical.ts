import type { Beam, Load } from './types'

export function deflection(beam: Beam, load: Load, x: number): number {
  const { L, E, I } = beam
  const EI = E * I

  if (beam.support === 'cantilever') {
    if (load.kind === 'point') {
      const { P, a } = load
      return x <= a
        ? ((P * x ** 2) / (6 * EI)) * (3 * a - x)
        : ((P * a ** 2) / (6 * EI)) * (3 * x - a)
    }
    const { q } = load
    return ((q * x ** 2) / (24 * EI)) * (6 * L ** 2 - 4 * L * x + x ** 2)
  }

  // simply-supported
  if (load.kind === 'point') {
    const { P, a } = load
    const b = L - a
    if (x <= a) {
      return ((P * b * x) / (6 * L * EI)) * (L ** 2 - b ** 2 - x ** 2)
    }
    const xr = L - x
    return ((P * a * xr) / (6 * L * EI)) * (L ** 2 - a ** 2 - xr ** 2)
  }
  const { q } = load
  return (q * x * (L * L * L - 2 * L * x * x + x * x * x)) / (24 * EI)
}

export function bendingMoment(beam: Beam, load: Load, x: number): number {
  const { L } = beam

  if (beam.support === 'cantilever') {
    if (load.kind === 'point') {
      const { P, a } = load
      return x <= a ? -P * (a - x) : 0
    }
    const { q } = load
    return (-q * (L - x) ** 2) / 2
  }
  // simply-supported
  if (load.kind === 'point') {
    const { P, a } = load
    const b = L - a
    if (x <= a) {
      return (P * b * x) / L
    }
    return (P * a * (L - x)) / L
  }
  const { q } = load
  return (q * x * (L - x)) / 2
}
