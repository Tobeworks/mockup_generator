<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DeviceImages, GeneratorMode } from '../composables/useGeneratorApi'
import ImageLightbox from './ImageLightbox.vue'

const props = defineProps<{
  images: DeviceImages
  mode: GeneratorMode
}>()

const loadedImages = ref<Set<string>>(new Set())
const lightboxIndex = ref<number | null>(null)

function onImageLoad(device: string) {
  loadedImages.value.add(device)
}

const devices = [
  {
    key: 'mobile' as const,
    label: 'Mobile',
    sublabel: { screenshots: '390 × 844', mockups: 'iPhone 14 Pro' },
    icon: '📱',
    aspectClass: 'aspect-[9/16]',
  },
  {
    key: 'tablet' as const,
    label: 'Tablet',
    sublabel: { screenshots: '768 × 1024', mockups: 'iPad Pro' },
    icon: '📋',
    aspectClass: 'aspect-[3/4]',
  },
  {
    key: 'desktop' as const,
    label: 'Desktop',
    sublabel: { screenshots: '1920 × 1080', mockups: 'MacBook Pro' },
    icon: '🖥️',
    aspectClass: 'aspect-[16/9]',
  },
]

function openLightbox(index: number) {
  lightboxIndex.value = index
}

function closeLightbox() {
  lightboxIndex.value = null
}

function prevImage() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value - 1 + devices.length) % devices.length
}

function nextImage() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value + 1) % devices.length
}

const currentDevice = computed(() => {
  if (lightboxIndex.value === null) return null
  return devices[lightboxIndex.value]
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
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>

            <!-- Download Button -->
            <a
              :href="images[device.key]"
              :download="`${mode === 'screenshots' ? 'screenshot' : 'mockup'}_${device.key}.png`"
              class="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
              title="Herunterladen"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
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
            <svg
              class="h-8 w-8 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
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
      @close="closeLightbox"
      @prev="prevImage"
      @next="nextImage"
    />
  </div>
</template>
