import { ref, computed } from 'vue'

export interface DeviceDimensions {
  mobile: { width: number; height: number }
  tablet: { width: number; height: number }
  desktop: { width: number; height: number }
}

const STORAGE_KEY = 'mockup_generator_device_dimensions'

const defaultDimensions: DeviceDimensions = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
}

function loadFromStorage(): DeviceDimensions {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Validate structure
      if (
        parsed &&
        typeof parsed.mobile === 'object' &&
        typeof parsed.tablet === 'object' &&
        typeof parsed.desktop === 'object'
      ) {
        return parsed as DeviceDimensions
      }
    }
  } catch (e) {
    console.error('Fehler beim Laden der Device-Settings:', e)
  }
  return defaultDimensions
}

export function useDeviceSettings() {
  const dimensions = ref<DeviceDimensions>(loadFromStorage())

  const mobileDimensions = computed(() => dimensions.value.mobile)
  const tabletDimensions = computed(() => dimensions.value.tablet)
  const desktopDimensions = computed(() => dimensions.value.desktop)

  function updateDimensions(newDimensions: DeviceDimensions) {
    dimensions.value = newDimensions
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDimensions))
    } catch (e) {
      console.error('Fehler beim Speichern der Device-Settings:', e)
    }
  }

  function updateMobile(width: number, height: number) {
    dimensions.value = {
      ...dimensions.value,
      mobile: { width, height },
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dimensions.value))
    } catch (e) {
      console.error('Fehler beim Speichern der Device-Settings:', e)
    }
  }

  function updateTablet(width: number, height: number) {
    dimensions.value = {
      ...dimensions.value,
      tablet: { width, height },
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dimensions.value))
    } catch (e) {
      console.error('Fehler beim Speichern der Device-Settings:', e)
    }
  }

  function updateDesktop(width: number, height: number) {
    dimensions.value = {
      ...dimensions.value,
      desktop: { width, height },
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dimensions.value))
    } catch (e) {
      console.error('Fehler beim Speichern der Device-Settings:', e)
    }
  }

  function resetToDefaults() {
    dimensions.value = defaultDimensions
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDimensions))
    } catch (e) {
      console.error('Fehler beim Zurücksetzen der Device-Settings:', e)
    }
  }

  return {
    dimensions,
    mobileDimensions,
    tabletDimensions,
    desktopDimensions,
    updateDimensions,
    updateMobile,
    updateTablet,
    updateDesktop,
    resetToDefaults,
  }
}
