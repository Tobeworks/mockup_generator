<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, ChevronRight, RefreshCw } from 'lucide-vue-next'
import { useDeviceSettings, type DeviceDimensions, type DeviceOption } from '../composables/useDeviceSettings'

const emit = defineEmits<{
  close: []
}>()

const { dimensions, deviceOptions, setDevice, resetToDefaults } = useDeviceSettings()

const tempDimensions = ref<DeviceDimensions>({ ...dimensions.value })

// Current device options for each category
const currentMobileDevice = computed(() => {
  const dim = dimensions.value.mobile
  return deviceOptions.value.find(d => d.category === 'mobile' && d.width === dim.width && d.height === dim.height)
})

const currentTabletDevice = computed(() => {
  const dim = dimensions.value.tablet
  return deviceOptions.value.find(d => d.category === 'tablet' && d.width === dim.width && d.height === dim.height)
})

const currentDesktopDevice = computed(() => {
  const dim = dimensions.value.desktop
  return deviceOptions.value.find(d => d.category === 'desktop' && d.width === dim.width && d.height === dim.height)
})

function handleMobileChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const deviceName = target.value
  if (deviceName) {
    setDevice('mobile', deviceName)
    // Update temp dimensions for custom input fields
    const device = deviceOptions.value.find(d => d.category === 'mobile' && d.name === deviceName)
    if (device) {
      tempDimensions.value.mobile = { width: device.width, height: device.height }
    }
  }
}

function handleTabletChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const deviceName = target.value
  if (deviceName) {
    setDevice('tablet', deviceName)
    // Update temp dimensions for custom input fields
    const device = deviceOptions.value.find(d => d.category === 'tablet' && d.name === deviceName)
    if (device) {
      tempDimensions.value.tablet = { width: device.width, height: device.height }
    }
  }
}

function handleDesktopChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const deviceName = target.value
  if (deviceName) {
    setDevice('desktop', deviceName)
    // Update temp dimensions for custom input fields
    const device = deviceOptions.value.find(d => d.category === 'desktop' && d.name === deviceName)
    if (device) {
      tempDimensions.value.desktop = { width: device.width, height: device.height }
    }
  }
}

function handleSave() {
  updateDimensions(tempDimensions.value)
  emit('close')
}

function handleReset() {
  resetToDefaults()
  tempDimensions.value = { ...dimensions.value }
}

function close() {
  emit('close')
}

function updateDimensions(newDimensions: DeviceDimensions) {
  dimensions.value = newDimensions
  try {
    localStorage.setItem('mockup_generator_device_dimensions', JSON.stringify(newDimensions))
  } catch (e) {
    console.error('Fehler beim Speichern der Device-Settings:', e)
  }
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
          <X class="h-5 w-5" :size="20" />
        </button>
      </div>

      <!-- Content -->
      <div class="space-y-6 px-6 py-6">
        <!-- Device Selection -->
        <div class="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <h3 class="text-sm font-medium text-zinc-200">Gerät auswählen</h3>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <!-- Mobile -->
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-zinc-500">Mobile</label>
              <div class="relative">
                <select
                  :value="currentMobileDevice?.name || ''"
                  @change="handleMobileChange"
                  class="w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                >
                  <option value="" disabled>Wähle ein Gerät...</option>
                  <option v-for="device in deviceOptions.filter(d => d.category === 'mobile')" :key="device.name" :value="device.name">
                    {{ device.name }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronRight class="h-4 w-4 text-zinc-500 rotate-90" :size="16" />
                </div>
              </div>
              <div v-if="currentMobileDevice" class="text-[10px] text-zinc-600">
                {{ currentMobileDevice.width }} × {{ currentMobileDevice.height }}
              </div>
            </div>

            <!-- Tablet -->
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-zinc-500">Tablet</label>
              <div class="relative">
                <select
                  :value="currentTabletDevice?.name || ''"
                  @change="handleTabletChange"
                  class="w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                >
                  <option value="" disabled>Wähle ein Gerät...</option>
                  <option v-for="device in deviceOptions.filter(d => d.category === 'tablet')" :key="device.name" :value="device.name">
                    {{ device.name }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronRight class="h-4 w-4 text-zinc-500 rotate-90" :size="16" />
                </div>
              </div>
              <div v-if="currentTabletDevice" class="text-[10px] text-zinc-600">
                {{ currentTabletDevice.width }} × {{ currentTabletDevice.height }}
              </div>
            </div>

            <!-- Desktop -->
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-zinc-500">Desktop</label>
              <div class="relative">
                <select
                  :value="currentDesktopDevice?.name || ''"
                  @change="handleDesktopChange"
                  class="w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                >
                  <option value="" disabled>Wähle ein Gerät...</option>
                  <option v-for="device in deviceOptions.filter(d => d.category === 'desktop')" :key="device.name" :value="device.name">
                    {{ device.name }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronRight class="h-4 w-4 text-zinc-500 rotate-90" :size="16" />
                </div>
              </div>
              <div v-if="currentDesktopDevice" class="text-[10px] text-zinc-600">
                {{ currentDesktopDevice.width }} × {{ currentDesktopDevice.height }}
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Dimensions (Advanced) -->
        <div class="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <div class="flex items-center gap-2">
            <span class="text-xl">📏</span>
            <h3 class="text-sm font-medium text-zinc-200">Benutzerdefinierte Abmessungen</h3>
          </div>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <!-- Mobile -->
            <div class="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900/30 p-3">
              <div class="flex items-center gap-2">
                <span class="text-sm">📱</span>
                <label class="text-xs font-medium text-zinc-400">Mobile</label>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="space-y-1">
                  <label class="text-[10px] font-medium text-zinc-500">Breite</label>
                  <input
                    v-model.number="tempDimensions.mobile.width"
                    type="number"
                    min="320"
                    max="2000"
                    class="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-medium text-zinc-500">Höhe</label>
                  <input
                    v-model.number="tempDimensions.mobile.height"
                    type="number"
                    min="200"
                    max="3000"
                    class="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </div>
              </div>
            </div>

            <!-- Tablet -->
            <div class="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900/30 p-3">
              <div class="flex items-center gap-2">
                <span class="text-sm">📋</span>
                <label class="text-xs font-medium text-zinc-400">Tablet</label>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="space-y-1">
                  <label class="text-[10px] font-medium text-zinc-500">Breite</label>
                  <input
                    v-model.number="tempDimensions.tablet.width"
                    type="number"
                    min="600"
                    max="2000"
                    class="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-medium text-zinc-500">Höhe</label>
                  <input
                    v-model.number="tempDimensions.tablet.height"
                    type="number"
                    min="400"
                    max="3000"
                    class="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </div>
              </div>
            </div>

            <!-- Desktop -->
            <div class="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900/30 p-3">
              <div class="flex items-center gap-2">
                <span class="text-sm">🖥️</span>
                <label class="text-xs font-medium text-zinc-400">Desktop</label>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="space-y-1">
                  <label class="text-[10px] font-medium text-zinc-500">Breite</label>
                  <input
                    v-model.number="tempDimensions.desktop.width"
                    type="number"
                    min="1024"
                    max="4000"
                    class="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-medium text-zinc-500">Höhe</label>
                  <input
                    v-model.number="tempDimensions.desktop.height"
                    type="number"
                    min="600"
                    max="3000"
                    class="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </div>
              </div>
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
          <RefreshCw class="h-4 w-4" :size="16" />
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
