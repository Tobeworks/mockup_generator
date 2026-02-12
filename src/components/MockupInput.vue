<script setup lang="ts">
import { ref } from 'vue'
import { Camera, Sparkles, Settings, Globe, Loader2 } from 'lucide-vue-next'
import type { GeneratorMode } from '../composables/useGeneratorApi'
import { useDeviceSettings } from '../composables/useDeviceSettings'

const emit = defineEmits<{
  submit: [mode: GeneratorMode, url: string, vision: string, deviceDimensions?: { mobile: { width: number; height: number }; tablet: { width: number; height: number }; desktop: { width: number; height: number } }]
  'open-settings': []
}>()

defineProps<{
  isLoading: boolean
  loadingMessage: string
  elapsedSeconds: number
}>()

const mode = ref<GeneratorMode>('screenshots')
const url = ref('')
const vision = ref('')

const { dimensions } = useDeviceSettings()

function handleSubmit() {
  if (!url.value.trim()) return
  emit('submit', mode.value, url.value.trim(), vision.value.trim(), dimensions.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-full space-y-6">
    <!-- Mode Tabs -->
    <div class="flex rounded-lg border border-border-primary bg-background-secondary p-1">
      <button
        type="button"
        :class="[
          'flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200',
          mode === 'screenshots'
            ? 'bg-background-primary text-text-primary shadow-sm'
            : 'text-text-secondary hover:text-text-primary',
        ]"
        :disabled="isLoading"
        @click="mode = 'screenshots'"
      >
        <span class="flex items-center justify-center gap-2">
          <Camera class="h-4 w-4" :size="16" />
          Screenshots
        </span>
      </button>
      <button
        type="button"
        :class="[
          'flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200',
          mode === 'mockups'
            ? 'bg-background-primary text-text-primary shadow-sm'
            : 'text-text-secondary hover:text-text-primary',
        ]"
        :disabled="isLoading"
        @click="mode = 'mockups'"
      >
        <span class="flex items-center justify-center gap-2">
          <Sparkles class="h-4 w-4" :size="16" />
          AI Mockups
        </span>
      </button>
    </div>

    <!-- Mode Description -->
    <div class="rounded-lg bg-background-secondary px-4 py-3">
      <p v-if="mode === 'screenshots'" class="text-xs text-text-secondary">
        <span class="font-medium text-text-primary">Schnell (~5s)</span> — Echte Webseiten-Screenshots mit Selenium für Mobile, Tablet und Desktop.
      </p>
      <p v-else class="text-xs text-text-secondary">
        <span class="font-medium text-text-primary">KI-generiert (~60s)</span> — Realistische Device-Mockups mit iPhone, iPad und MacBook Rahmen via Gemini AI.
      </p>
    </div>

    <!-- Settings Button -->
    <button
      type="button"
      @click="$emit('open-settings')"
      class="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-text-secondary transition-all hover:bg-background-secondary hover:text-text-primary"
    >
      <Settings class="h-4 w-4" :size="16" />
      Abmessungen anpassen
    </button>
    <!-- URL Input -->
    <div class="space-y-2">
      <label for="url" class="block text-sm font-medium text-text-secondary">
        Webseite URL
      </label>
      <div class="relative">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <Globe class="h-4 w-4 text-text-secondary" :size="16" />
        </div>
        <input
          id="url"
          v-model="url"
          type="url"
          required
          :disabled="isLoading"
          placeholder="https://my-startup.com"
          class="w-full rounded-lg border border-border-primary bg-background-secondary py-3 pl-10 pr-4 text-sm text-text-primary placeholder-text-secondary transition-colors duration-200 focus:border-border-secondary focus:outline-none focus:ring-1 focus:ring-border-secondary disabled:opacity-50"
        />
      </div>
    </div>

    <!-- Vision Textarea (nur bei Mockups) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="mode === 'mockups'" class="space-y-2">
        <label for="vision" class="block text-sm font-medium text-text-secondary">
          Deine Vision
          <span class="ml-1 text-xs font-normal text-text-tertiary">optional</span>
        </label>
        <textarea
          id="vision"
          v-model="vision"
          :disabled="isLoading"
          rows="3"
          placeholder="Minimalistisches Design mit blauen Akzenten, klare Typografie..."
          class="w-full resize-none rounded-lg border border-border-primary bg-background-secondary px-4 py-3 text-sm text-text-primary placeholder-text-secondary transition-colors duration-200 focus:border-border-secondary focus:outline-none focus:ring-1 focus:ring-border-secondary disabled:opacity-50"
        />
      </div>
    </Transition>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="isLoading || !url.trim()"
      class="group relative w-full cursor-pointer rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
      :class="[
        mode === 'screenshots'
          ? 'bg-background-primary text-text-primary hover:bg-background-secondary'
          : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500',
      ]"
    >
      <span :class="{ 'opacity-0': isLoading }" class="flex items-center justify-center gap-2">
        <!-- Screenshots Icon -->
        <Camera v-if="mode === 'screenshots'" class="h-4 w-4" :size="16" />
        <!-- Mockups Icon -->
        <Sparkles v-else class="h-4 w-4" :size="16" />
        {{ mode === 'screenshots' ? 'Screenshots erstellen' : 'Mockups generieren' }}
      </span>

      <!-- Loading Spinner -->
      <span v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
        <Loader2 class="h-5 w-5 animate-spin" :class="mode === 'screenshots' ? 'text-text-primary' : 'text-white'" :size="20" />
      </span>
    </button>



    <!-- Loading Status -->
    <div v-if="isLoading" class="space-y-3">
      <p class="text-center text-xs text-text-secondary animate-pulse">
        {{ loadingMessage }}
      </p>
      <!-- Progress bar -->
      <div class="h-1 overflow-hidden rounded-full bg-background-secondary">
        <div
          class="h-full rounded-full transition-all duration-1000 ease-linear"
          :class="mode === 'screenshots' ? 'bg-text-secondary' : 'bg-violet-500'"
          :style="{
            width: mode === 'screenshots'
              ? `${Math.min(95, elapsedSeconds * 15)}%`
              : `${Math.min(95, elapsedSeconds * 1.5)}%`,
          }"
        />
      </div>
    </div>
  </form>
</template>
