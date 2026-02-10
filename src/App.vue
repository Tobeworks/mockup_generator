<script setup lang="ts">
import { ref } from 'vue'
import MockupInput from './components/MockupInput.vue'
import MockupGrid from './components/MockupGrid.vue'
import SettingsModal from './components/SettingsModal.vue'
import { useGeneratorApi } from './composables/useGeneratorApi'
import { useDeviceSettings } from './composables/useDeviceSettings'
import type { GeneratorMode } from './composables/useGeneratorApi'

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
  generate(mode, url, vision, deviceDimensions)
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
        <div
          class="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs text-zinc-400"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Selenium + Gemini AI
        </div>
        <h1
          class="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl"
        >
          Screenshot &amp; Mockup Generator
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
              <svg
                class="mt-0.5 h-5 w-5 shrink-0 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
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
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
                />
              </svg>
              Neuen Auftrag starten
            </button>
          </div>
        </section>
      </Transition>

      <!-- Footer -->
      <footer class="mt-20 text-center text-xs text-zinc-600">
        <p>Gebaut mit Vue, Tailwind &amp; Gemini AI</p>
      </footer>

      <!-- Settings Modal -->
      <SettingsModal v-if="isSettingsOpen" @close="closeSettings" />
    </main>
  </div>
</template>
