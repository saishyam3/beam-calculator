// Units (SI): lengths in m, forces in N, distributed load in N/m, moments in N*m, angles in rad
// Young's modulus E in Pa, second moment of area I in m^4.
// Loads act downwards; deflection is positive downwards.
// Bending moment is positive when the beam sags.

export type Support = 'cantilever' | 'simply-supported'

export type Load =
  | { kind: 'point'; P: number; a: number } // force P at distance a from the left end
  | { kind: 'udl'; q: number } // uniform load over the whole span

export interface Beam {
  support: Support
  L: number // span
  E: number // Young's modulus
  I: number // second moment of area
}
