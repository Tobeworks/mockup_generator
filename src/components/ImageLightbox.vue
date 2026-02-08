<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  src: string
  alt: string
  label: string
  sublabel: string
}>()

const emit = defineEmits<{
  close: []
  prev: []
  next: []
}>()

const isZoomed = ref(false)
const imageLoaded = ref(false)

function toggleZoom() {
  isZoomed.value = !isZoomed.value
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  } else if (e.key === 'ArrowLeft') {
    emit('prev')
  } else if (e.key === 'ArrowRight') {
    emit('next')
  }
}

function handleBackdropClick(e: MouseEvent) {
  if ((e.target as HTMLElement).dataset.backdrop) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

watch(
  () => props.src,
  () => {
    imageLoaded.value = false
    isZoomed.value = false
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="fixed inset-0 z-50 flex items-center justify-center"
        data-backdrop
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/90 backdrop-blur-sm" data-backdrop />

        <!-- Top Bar -->
        <div class="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-4 sm:px-6">
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-zinc-200">{{ label }}</span>
            <span class="text-xs text-zinc-500">{{ sublabel }}</span>
          </div>
          <div class="flex items-center gap-2">
            <!-- Download -->
            <a
              :href="src"
              :download="`${alt}.png`"
              class="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              title="Herunterladen"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </a>
            <!-- Close -->
            <button
              @click="$emit('close')"
              class="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              title="Schließen (Esc)"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button
          @click.stop="$emit('prev')"
          class="absolute left-3 z-10 rounded-full bg-zinc-900/70 p-2.5 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-100 sm:left-6"
          title="Vorheriges (←)"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        <button
          @click.stop="$emit('next')"
          class="absolute right-3 z-10 rounded-full bg-zinc-900/70 p-2.5 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-100 sm:right-6"
          title="Nächstes (→)"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        <!-- Image Container -->
        <div
          class="relative z-10 flex max-h-[85vh] max-w-[90vw] items-center justify-center"
          @click.stop
        >
          <!-- Loading skeleton -->
          <div
            v-if="!imageLoaded"
            class="flex h-64 w-64 items-center justify-center"
          >
            <svg class="h-8 w-8 animate-spin text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>

          <img
            :src="src"
            :alt="alt"
            :class="[
              imageLoaded ? 'opacity-100' : 'opacity-0',
              isZoomed ? 'max-h-none max-w-none cursor-zoom-out' : 'max-h-[85vh] max-w-[90vw] cursor-zoom-in',
            ]"
            class="rounded-lg object-contain shadow-2xl shadow-black/50 transition-all duration-300"
            @load="imageLoaded = true"
            @click="toggleZoom"
          />
        </div>

        <!-- Bottom hint -->
        <div class="absolute bottom-4 left-0 right-0 text-center">
          <span class="text-xs text-zinc-600">
            Esc schließen · ← → navigieren · Klick zum Zoomen
          </span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
