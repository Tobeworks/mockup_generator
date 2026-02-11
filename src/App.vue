<script setup lang="ts">
import { ref } from 'vue'
import { AlertCircle, RefreshCw } from 'lucide-vue-next'
import MockupInput from './components/MockupInput.vue'
import MockupGrid from './components/MockupGrid.vue'
import SettingsModal from './components/SettingsModal.vue'
import { useGeneratorApi } from './composables/useGeneratorApi'
import { useDeviceSettings } from './composables/useDeviceSettings'
import type { GeneratorMode } from './composables/useGeneratorApi'
import logoUrl from './assets/logo.png'

const {
  isLoading,
  error,
  result,
  activeMode,
  requestedUrl,
  elapsedSeconds,
  loadingMessage,
  generate,
  reset,
} = useGeneratorApi()

const { dimensions } = useDeviceSettings()

const isSettingsOpen = ref(false)

function handleSubmit(mode: GeneratorMode, url: string, vision: string, deviceDimensions?: { mobile: { width: number; height: number }; tablet: { width: number; height: number }; desktop: { width: number; height: number } }) {
  // Use provided deviceDimensions or fall back to current dimensions
  const dims = deviceDimensions || dimensions.value
  generate(mode, url, vision, dims)
}

function openSettings() {
  isSettingsOpen.value = true
}

function closeSettings() {
  isSettingsOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-zinc-925 font-sans">
    <!-- Subtle grid background -->
    <div
      class="pointer-events-none fixed inset-0 opacity-[0.03]"
      style="
        background-image: linear-gradient(
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px
          );
        background-size: 60px 60px;
      "
    />

    <!-- Main Content -->
    <main class="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Header -->
      <header class="mb-12 text-center">
        <img
          :src="logoUrl"
          alt="Mockup Generator Logo"
          class="mx-auto mb-6 h-16 w-auto"
        />
        <div
          class="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs text-zinc-400"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Selenium + Gemini AI
        </div>
        <h1
          class="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl"
        >
          Screenshot & Mockup Generator
        </h1>
        <p class="mx-auto mt-3 max-w-xl text-base text-zinc-500">
          Erstelle echte Webseiten-Screenshots oder KI-generierte Device-Mockups für Mobile, Tablet und Desktop.
        </p>
      </header>

      <!-- Input Section -->
      <section v-if="!result" class="mx-auto max-w-lg">
        <div
          class="rounded-2xl border border-zinc-800/50 bg-zinc-900/20 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8"
        >
          <MockupInput
            :is-loading="isLoading"
            :loading-message="loadingMessage"
            :elapsed-seconds="elapsedSeconds"
            @submit="handleSubmit"
            @open-settings="openSettings"
          />
        </div>

        <!-- Error Message -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-2 opacity-0"
        >
          <div
            v-if="error"
            class="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4"
          >
            <div class="flex items-start gap-3">
              <AlertCircle class="mt-0.5 h-5 w-5 shrink-0 text-red-400" :size="20" />
              <p class="text-sm text-red-300/90">{{ error }}</p>
            </div>
          </div>
        </Transition>
      </section>

      <!-- Results Section -->
      <Transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="transform translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
      >
        <section v-if="result" class="space-y-8">
          <MockupGrid :images="result" :mode="activeMode" :source-url="requestedUrl" :device-dimensions="dimensions" />

          <!-- Back Button -->
          <div class="flex justify-center pt-4">
            <button
              @click="reset()"
              class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-5 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:border-zinc-700 hover:text-zinc-200"
            >
              <RefreshCw class="h-4 w-4" :size="16" />
              Neuen Auftrag starten
            </button>
          </div>
        </section>
      </Transition>

      <!-- Footer -->
      <footer class="mt-20 text-center text-xs text-zinc-600">
        <p>build by Tobeworks</p>
      </footer>

      <!-- Settings Modal -->
      <SettingsModal v-if="isSettingsOpen" @close="closeSettings" />
    </main>
  </div>
</template>
