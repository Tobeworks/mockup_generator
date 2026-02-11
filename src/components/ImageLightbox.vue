<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Download, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-vue-next'

const props = defineProps<{
  src: string
  alt: string
  label: string
  sublabel: string
  downloadFilename: string
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
              :download="downloadFilename"
              class="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              title="Herunterladen"
            >
              <Download class="h-5 w-5" :size="20" />
            </a>
            <!-- Close -->
            <button
              @click="$emit('close')"
              class="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              title="Schließen (Esc)"
            >
              <X class="h-5 w-5" :size="20" />
            </button>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button
          @click.stop="$emit('prev')"
          class="absolute left-3 z-10 rounded-full bg-zinc-900/70 p-2.5 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-100 sm:left-6"
          title="Vorheriges (←)"
        >
          <ChevronLeft class="h-5 w-5" :size="20" />
        </button>

        <button
          @click.stop="$emit('next')"
          class="absolute right-3 z-10 rounded-full bg-zinc-900/70 p-2.5 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-100 sm:right-6"
          title="Nächstes (→)"
        >
          <ChevronRight class="h-5 w-5" :size="20" />
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
            <Loader2 class="h-8 w-8 animate-spin text-zinc-500" :size="32" />
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
