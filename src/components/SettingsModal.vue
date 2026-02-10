<script setup lang="ts">
import { ref } from 'vue'
import { useDeviceSettings, type DeviceDimensions } from '../composables/useDeviceSettings'

const emit = defineEmits<{
  close: []
}>()

const { dimensions, updateDimensions, resetToDefaults } = useDeviceSettings()

const tempDimensions = ref<DeviceDimensions>({ ...dimensions.value })

function handleSave() {
  updateDimensions(tempDimensions.value)
  emit('close')
}

function handleReset() {
  resetToDefaults()
  tempDimensions.value = { ...dimensions.value }
}

function close() {
  // Reset temp values to current dimensions
  tempDimensions.value = { ...dimensions.value }
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      @click="close"
    />

    <!-- Modal -->
    <div
      class="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <h2 class="text-lg font-semibold text-zinc-100">Device Abmessungen</h2>
        <button
          @click="close"
          class="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="space-y-6 px-6 py-6">
        <!-- Mobile Settings -->
        <div class="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <div class="flex items-center gap-2">
            <span class="text-xl">📱</span>
            <h3 class="text-sm font-medium text-zinc-200">Mobile</h3>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-zinc-500">Breite (px)</label>
              <input
                v-model.number="tempDimensions.mobile.width"
                type="number"
                min="320"
                max="2000"
                class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-zinc-500">Höhe (px)</label>
              <input
                v-model.number="tempDimensions.mobile.height"
                type="number"
                min="200"
                max="3000"
                class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
            </div>
          </div>
        </div>

        <!-- Tablet Settings -->
        <div class="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <div class="flex items-center gap-2">
            <span class="text-xl">📋</span>
            <h3 class="text-sm font-medium text-zinc-200">Tablet</h3>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-zinc-500">Breite (px)</label>
              <input
                v-model.number="tempDimensions.tablet.width"
                type="number"
                min="600"
                max="2000"
                class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-zinc-500">Höhe (px)</label>
              <input
                v-model.number="tempDimensions.tablet.height"
                type="number"
                min="400"
                max="3000"
                class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
            </div>
          </div>
        </div>

        <!-- Desktop Settings -->
        <div class="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <div class="flex items-center gap-2">
            <span class="text-xl">🖥️</span>
            <h3 class="text-sm font-medium text-zinc-200">Desktop</h3>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-zinc-500">Breite (px)</label>
              <input
                v-model.number="tempDimensions.desktop.width"
                type="number"
                min="1024"
                max="4000"
                class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-zinc-500">Höhe (px)</label>
              <input
                v-model.number="tempDimensions.desktop.height"
                type="number"
                min="600"
                max="3000"
                class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
            </div>
          </div>
        </div>

        <!-- Current Values Display -->
        <div class="rounded-lg bg-zinc-800/30 px-4 py-3">
          <p class="text-xs text-zinc-500">
            Aktuelle Werte im LocalStorage gespeichert und werden für zukünftige Generierungen
            verwendet.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between border-t border-zinc-800 px-6 py-4">
        <button
          @click="handleReset"
          class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
          </svg>
          Standardwerte
        </button>
        <div class="flex gap-3">
          <button
            @click="close"
            class="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            Abbrechen
          </button>
          <button
            @click="handleSave"
            class="rounded-lg bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-white"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
