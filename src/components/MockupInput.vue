<script setup lang="ts">
import { ref } from 'vue'
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
    <div class="flex rounded-lg border border-zinc-800 bg-zinc-900/50 p-1">
      <button
        type="button"
        :class="[
          'flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200',
          mode === 'screenshots'
            ? 'bg-zinc-100 text-zinc-900 shadow-sm'
            : 'text-zinc-400 hover:text-zinc-200',
        ]"
        :disabled="isLoading"
        @click="mode = 'screenshots'"
      >
        <span class="flex items-center justify-center gap-2">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
          </svg>
          Screenshots
        </span>
      </button>
      <button
        type="button"
        :class="[
          'flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200',
          mode === 'mockups'
            ? 'bg-zinc-100 text-zinc-900 shadow-sm'
            : 'text-zinc-400 hover:text-zinc-200',
        ]"
        :disabled="isLoading"
        @click="mode = 'mockups'"
      >
        <span class="flex items-center justify-center gap-2">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
          </svg>
          AI Mockups
        </span>
      </button>
    </div>

    <!-- Mode Description -->
    <div class="rounded-lg bg-zinc-800/30 px-4 py-3">
      <p v-if="mode === 'screenshots'" class="text-xs text-zinc-500">
        <span class="font-medium text-zinc-400">Schnell (~5s)</span> — Echte Webseiten-Screenshots mit Selenium für Mobile, Tablet und Desktop.
      </p>
      <p v-else class="text-xs text-zinc-500">
        <span class="font-medium text-zinc-400">KI-generiert (~60s)</span> — Realistische Device-Mockups mit iPhone, iPad und MacBook Rahmen via Gemini AI.
      </p>
    </div>

    <!-- URL Input -->
    <div class="space-y-2">
      <label for="url" class="block text-sm font-medium text-zinc-400">
        Webseite URL
      </label>
      <div class="relative">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <svg class="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.467.73-3.56" />
          </svg>
        </div>
        <input
          id="url"
          v-model="url"
          type="url"
          required
          :disabled="isLoading"
          placeholder="https://my-startup.com"
          class="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-3 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 transition-colors duration-200 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 disabled:opacity-50"
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
        <label for="vision" class="block text-sm font-medium text-zinc-400">
          Deine Vision
          <span class="ml-1 text-xs font-normal text-zinc-600">optional</span>
        </label>
        <textarea
          id="vision"
          v-model="vision"
          :disabled="isLoading"
          rows="3"
          placeholder="Minimalistisches Design mit blauen Akzenten, klare Typografie..."
          class="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 transition-colors duration-200 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 disabled:opacity-50"
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
          ? 'bg-zinc-100 text-zinc-900 hover:bg-white'
          : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500',
      ]"
    >
      <span :class="{ 'opacity-0': isLoading }" class="flex items-center justify-center gap-2">
        <!-- Screenshots Icon -->
        <svg v-if="mode === 'screenshots'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
        </svg>
        <!-- Mockups Icon -->
        <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
        </svg>
        {{ mode === 'screenshots' ? 'Screenshots erstellen' : 'Mockups generieren' }}
      </span>

      <!-- Loading Spinner -->
      <span v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
        <svg class="h-5 w-5 animate-spin" :class="mode === 'screenshots' ? 'text-zinc-900' : 'text-white'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </span>
    </button>

    <!-- Settings Button -->
    <button
      type="button"
      @click="$emit('open-settings')"
      class="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-zinc-500 transition-all hover:bg-zinc-800 hover:text-zinc-300"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
      Abmessungen anpassen
    </button>

    <!-- Loading Status -->
    <div v-if="isLoading" class="space-y-3">
      <p class="text-center text-xs text-zinc-500 animate-pulse">
        {{ loadingMessage }}
      </p>
      <!-- Progress bar -->
      <div class="h-1 overflow-hidden rounded-full bg-zinc-800">
        <div
          class="h-full rounded-full transition-all duration-1000 ease-linear"
          :class="mode === 'screenshots' ? 'bg-zinc-400' : 'bg-violet-500'"
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
