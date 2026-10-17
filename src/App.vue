<script setup lang="ts">
import { computed, ref } from 'vue'
import { bendingMoment, deflection } from './physics/analytical'
import type { Beam, Load, Support } from './physics/types'

// Inputs the user can change
const support = ref<Support>('simply-supported')
const L = ref(4) //span, m
const P = ref(10) // load, KN

// Fixed for now: steel, 0.1 m x 0.1 m square section
const E = 210e9 // Pa
const I = 8.333e-6 // m^4

// Where the load sits and where the maximum values occur
const loadAt = computed(() => (support.value === 'cantilever' ? L.value : L.value / 2))
const momentAt = computed(() => (support.value === 'cantilever' ? 0 : L.value / 2))

const beam = computed<Beam>(() => ({ support: support.value, L: L.value, E, I }))
const load = computed<Load>(() => ({ kind: 'point', P: P.value * 1000, a: loadAt.value }))

const valid = computed(() => L.value > 0 && P.value > 0)
const maxDeflection = computed(() => deflection(beam.value, load.value, loadAt.value) * 1000) //mm
const maxMoment =  computed(() => Math.abs(bendingMoment(beam.value, load.value, momentAt.value)) / 1000) // kNm

</script>

<template>
  <main>
  <h1>Beam deflection calculator</h1>

  <label>
    Support
    <select v-model="support">
      <option value="simply-supported">Simply supported (load at mid-span)</option>
      <option value="cantilever">Cantilever (load at the tip)</option>
    </select>
  </label>

  <label>
    Span (m)
    <input v-model.number="L" type="number" min="0.1" step="0.1" />
  </label>

  <label>
    Load (kN)
    <input v-model.number="P" type="number" min="0" step="0.5" />
  </label>

  <section v-if="valid">
    <p>Maximum deflection: <strong>{{ maxDeflection.toFixed(2) }} mm</strong></p>
    <p>Maximum bending moment: <strong>{{ maxMoment.toFixed(2) }} kNm</strong></p>
  </section>
  <p v-else>Enter a span and a load greater than 0.</p>
</main>
</template>

<style scoped>
main {
  max-width: 480px;
  margin: 40px auto;
  display: grid;
  gap: 16px;
  text-align: left;
}
label {
  display: grid;
  gap: 4px;
}
</style>
