import { ref, computed } from 'vue'
import axios, { AxiosError } from 'axios'

const BASE_URL = 'http://localhost:5001/api'

export type GeneratorMode = 'screenshots' | 'mockups'

export interface DeviceDimensions {
  mobile: { width: number; height: number }
  tablet: { width: number; height: number }
  desktop: { width: number; height: number }
}

export interface DeviceImages {
  mobile: string
  tablet: string
  desktop: string
}

export interface ApiResponse {
  status: number
  screenshots?: DeviceImages
  mockups?: DeviceImages
  error?: string
}

export function urlToFilenamePrefix(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, '').replace(/[^a-zA-Z0-9.-]/g, '_')
  } catch {
    return url.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9.-]/g, '_')
  }
}

export function useGeneratorApi() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const result = ref<DeviceImages | null>(null)
  const activeMode = ref<GeneratorMode>('screenshots')
  const requestedUrl = ref('')
  const elapsedSeconds = ref(0)

  let timer: ReturnType<typeof setInterval> | null = null

  function startTimer() {
    elapsedSeconds.value = 0
    timer = setInterval(() => {
      elapsedSeconds.value++
    }, 1000)
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const loadingMessage = computed(() => {
    if (!isLoading.value) return ''
    const secs = elapsedSeconds.value
    if (activeMode.value === 'screenshots') {
      if (secs < 3) return 'Starte Selenium Browser...'
      if (secs < 8) return 'Lade Webseite und erstelle Screenshots...'
      return `Dauert etwas länger... (${secs}s)`
    } else {
      if (secs < 5) return 'Erstelle Screenshots der Webseite...'
      if (secs < 20) return 'Sende an Gemini AI zur Mockup-Generierung...'
      if (secs < 45) return 'KI generiert Device-Mockups... Bitte Geduld.'
      return `Fast fertig... (${secs}s)`
    }
  })

  async function generate(
    mode: GeneratorMode,
    url: string,
    userInstruction?: string,
    deviceDimensions?: DeviceDimensions,
  ) {
    isLoading.value = true
    error.value = null
    result.value = null
    activeMode.value = mode
    requestedUrl.value = url

    startTimer()

    try {
      const endpoint = `${BASE_URL}/${mode}`

      const payload: { url: string; user_instruction?: string; mobile_width?: number; mobile_height?: number; tablet_width?: number; tablet_height?: number; desktop_width?: number; desktop_height?: number } = { url }
      if (mode === 'mockups' && userInstruction?.trim()) {
        payload.user_instruction = userInstruction.trim()
      }
      if (deviceDimensions) {
        payload.mobile_width = deviceDimensions.mobile.width
        payload.mobile_height = deviceDimensions.mobile.height
        payload.tablet_width = deviceDimensions.tablet.width
        payload.tablet_height = deviceDimensions.tablet.height
        payload.desktop_width = deviceDimensions.desktop.width
        payload.desktop_height = deviceDimensions.desktop.height
      }

      console.log(`[Generator] ${mode.toUpperCase()} Request →`, endpoint, payload)

      const timeout = mode === 'screenshots' ? 60_000 : 300_000

      const { data } = await axios.post<ApiResponse>(endpoint, payload, {
        timeout,
        headers: { 'Content-Type': 'application/json' },
      })

      console.log(`[Generator] Response:`, {
        status: data.status,
        hasData: !!(data.screenshots || data.mockups),
        error: data.error,
      })

      const images = mode === 'screenshots' ? data.screenshots : data.mockups

      if (data.status === 1 && images) {
        result.value = images
      } else {
        error.value =
          data.error ||
          `Server antwortete mit Status ${data.status}, aber ohne Bilder.`
      }
    } catch (err) {
      console.error(`[Generator] Fehler:`, err)

      if (err instanceof AxiosError) {
        if (err.code === 'ECONNABORTED') {
          error.value =
            mode === 'screenshots'
              ? 'Screenshot-Generierung hat zu lange gedauert (>60s). Ist die URL erreichbar?'
              : 'Mockup-Generierung hat zu lange gedauert (>5 Min). Versuche es erneut.'
        } else if (err.code === 'ERR_NETWORK' || !err.response) {
          error.value =
            'Keine Verbindung zum Server. Läuft das Backend auf Port 5001?'
        } else if (err.response?.status === 429) {
          error.value =
            'Zu viele Anfragen – die KI braucht eine Pause. Versuche es gleich noch mal.'
        } else if (err.response?.status === 500) {
          const serverMsg = err.response?.data?.error
          error.value = serverMsg
            ? `Server-Fehler: ${serverMsg}`
            : 'Interner Server-Fehler. Check die Backend-Logs.'
        } else if (err.response?.status === 400) {
          error.value =
            err.response?.data?.error || 'Ungültige Eingabe. Prüfe die URL.'
        } else {
          error.value =
            err.response?.data?.error ||
            `HTTP ${err.response?.status}: ${err.message}`
        }
      } else if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Ein unerwarteter Fehler ist aufgetreten.'
      }
    } finally {
      stopTimer()
      isLoading.value = false
    }
  }

  function reset() {
    stopTimer()
    isLoading.value = false
    error.value = null
    result.value = null
    requestedUrl.value = ''
    elapsedSeconds.value = 0
  }

  return {
    isLoading,
    error,
    result,
    activeMode,
    requestedUrl,
    elapsedSeconds,
    loadingMessage,
    generate,
    reset,
  }
}
