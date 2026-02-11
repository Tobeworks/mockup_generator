<script setup lang="ts">
import { ref, computed } from 'vue'
import { Maximize2, Download } from 'lucide-vue-next'
import type { DeviceImages, GeneratorMode } from '../composables/useGeneratorApi'
import { urlToFilenamePrefix } from '../composables/useGeneratorApi'
import ImageLightbox from './ImageLightbox.vue'

import { useDeviceSettings } from '../composables/useDeviceSettings'

import type { DeviceDimensions } from '../composables/useDeviceSettings'

const props = defineProps<{
  images: DeviceImages
  mode: GeneratorMode
  sourceUrl: string
  deviceDimensions?: DeviceDimensions
}>()

const { dimensions: storedDimensions } = useDeviceSettings()

// Use passed dimensions or fall back to stored dimensions
const dimensions = computed(() => props.deviceDimensions || storedDimensions.value)

function buildFilename(deviceKey: string): string {
  const prefix = urlToFilenamePrefix(props.sourceUrl)
  const type = props.mode === 'screenshots' ? 'screenshot' : 'mockup'
  return `${prefix}_${type}_${deviceKey}.png`
}

const loadedImages = ref<Set<string>>(new Set())
const lightboxIndex = ref<number | null>(null)

function onImageLoad(device: string) {
  loadedImages.value.add(device)
}

const devices = computed(() => [
  {
    key: 'mobile' as const,
    label: 'Mobile',
    sublabel: { screenshots: `${dimensions.value.mobile.width} × ${dimensions.value.mobile.height}`, mockups: 'iPhone 14 Pro' },
    icon: '📱',
    aspectClass: 'aspect-[9/16]',
  },
  {
    key: 'tablet' as const,
    label: 'Tablet',
    sublabel: { screenshots: `${dimensions.value.tablet.width} × ${dimensions.value.tablet.height}`, mockups: 'iPad Pro' },
    icon: '📋',
    aspectClass: 'aspect-[3/4]',
  },
  {
    key: 'desktop' as const,
    label: 'Desktop',
    sublabel: { screenshots: `${dimensions.value.desktop.width} × ${dimensions.value.desktop.height}`, mockups: 'MacBook Pro' },
    icon: '🖥️',
    aspectClass: 'aspect-[16/9]',
  },
])

function openLightbox(index: number) {
  lightboxIndex.value = index
}

function closeLightbox() {
  lightboxIndex.value = null
}

function prevImage() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value - 1 + devices.value.length) % devices.value.length
}

function nextImage() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value + 1) % devices.value.length
}

const currentDevice = computed(() => {
  if (lightboxIndex.value === null) return null
  return devices.value[lightboxIndex.value]
})
</script>

<template>
  <div class="w-full space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-zinc-100">
        {{ mode === 'screenshots' ? 'Screenshots' : 'AI Mockups' }}
      </h2>
      <span
        class="rounded-full px-3 py-1 text-xs font-medium"
        :class="
          mode === 'screenshots'
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'bg-violet-500/10 text-violet-400'
        "
      >
        {{ mode === 'screenshots' ? '3 Screenshots' : '3 Mockups' }}
      </span>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(device, index) in devices"
        :key="device.key"
        class="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 transition-colors duration-200 hover:border-zinc-700"
      >
        <!-- Card Header -->
        <div class="flex items-center justify-between border-b border-zinc-800/50 px-4 py-3">
          <div class="flex items-center gap-2">
            <span class="text-sm">{{ device.icon }}</span>
            <div>
              <span class="text-sm font-medium text-zinc-300">{{ device.label }}</span>
              <span class="ml-2 text-xs text-zinc-600">{{ device.sublabel[mode] }}</span>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <!-- Expand / Lightbox Button -->
            <button
              @click="openLightbox(index)"
              class="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
              title="Vergrößern"
            >
              <Maximize2 class="h-4 w-4" :size="16" />
            </button>

            <!-- Download Button -->
            <a
              :href="images[device.key]"
              :download="buildFilename(device.key)"
              class="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
              title="Herunterladen"
            >
              <Download class="h-4 w-4" :size="16" />
            </a>
          </div>
        </div>

        <!-- Image Container (clickable for lightbox) -->
        <div
          class="relative cursor-pointer bg-zinc-950 p-3 transition-opacity hover:opacity-90"
          @click="openLightbox(index)"
        >
          <!-- Skeleton Loader -->
          <div
            v-if="!loadedImages.has(device.key)"
            :class="device.aspectClass"
            class="w-full animate-pulse rounded-lg bg-zinc-800/50"
          />

          <!-- Actual Image -->
          <img
            :src="images[device.key]"
            :alt="`${device.label} ${mode === 'screenshots' ? 'Screenshot' : 'Mockup'}`"
            :class="[
              device.aspectClass,
              loadedImages.has(device.key) ? 'opacity-100' : 'absolute inset-0 opacity-0',
            ]"
            class="w-full rounded-lg object-cover transition-opacity duration-500"
            @load="onImageLoad(device.key)"
          />

          <!-- Hover overlay -->
          <div class="absolute inset-3 flex items-center justify-center rounded-lg bg-black/0 transition-colors duration-200 group-hover:bg-black/20">
            <Maximize2
              class="h-8 w-8 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-70"
              :size="32"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <ImageLightbox
      v-if="lightboxIndex !== null && currentDevice"
      :src="images[currentDevice.key]"
      :alt="`${currentDevice.label} ${mode === 'screenshots' ? 'Screenshot' : 'Mockup'}`"
      :label="currentDevice.label"
      :sublabel="currentDevice.sublabel[mode]"
      :download-filename="buildFilename(currentDevice.key)"
      @close="closeLightbox"
      @prev="prevImage"
      @next="nextImage"
    />
  </div>
</template>
