import { ref, computed } from 'vue'
import { DEVICES } from '../constants/devices'

export interface DeviceDimensions {
  mobile: { width: number; height: number }
  tablet: { width: number; height: number }
  desktop: { width: number; height: number }
}

export interface DeviceSelection {
  category: 'mobile' | 'tablet' | 'desktop'
  deviceName: string
}

export interface DeviceOption {
  category: 'mobile' | 'tablet' | 'desktop'
  name: string
  width: number
  height: number
}

export function useDeviceSettings() {
  const STORAGE_KEY = 'mockup_generator_device_dimensions'
  const STORAGE_DEVICE_KEY = 'mockup_generator_device_selection'

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

  function loadDeviceSelection(): DeviceSelection | null {
    try {
      const stored = localStorage.getItem(STORAGE_DEVICE_KEY)
      if (stored) {
        return JSON.parse(stored) as DeviceSelection
      }
    } catch (e) {
      console.error('Fehler beim Laden der Device-Auswahl:', e)
    }
    return null
  }

  const dimensions = ref<DeviceDimensions>(loadFromStorage())
  const deviceSelection = ref<DeviceSelection | null>(loadDeviceSelection())

  const mobileDimensions = computed(() => dimensions.value.mobile)
  const tabletDimensions = computed(() => dimensions.value.tablet)
  const desktopDimensions = computed(() => dimensions.value.desktop)

  // Get all devices as options
  const deviceOptions = computed(() => {
    const options: DeviceOption[] = []

    DEVICES.mobile.forEach(d => options.push({ category: 'mobile', name: d.name, width: d.viewport.width, height: d.viewport.height }))
    DEVICES.tablet.forEach(d => options.push({ category: 'tablet', name: d.name, width: d.viewport.width, height: d.viewport.height }))
    DEVICES.desktop.forEach(d => options.push({ category: 'desktop', name: d.name, width: d.viewport.width, height: d.viewport.height }))

    return options
  })

  // Get current device name for display
  const currentDeviceName = computed(() => {
    if (!deviceSelection.value) return null
    const devices = DEVICES[deviceSelection.value.category]
    const dim = dimensions.value[deviceSelection.value.category]
    return devices.find(d => d.viewport.width === dim.width && d.viewport.height === dim.height)?.name || null
  })

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

  function setDevice(category: 'mobile' | 'tablet' | 'desktop', deviceName: string) {
    const devices = DEVICES[category]
    const device = devices.find(d => d.name === deviceName)
    if (device) {
      dimensions.value = {
        ...dimensions.value,
        [category]: device.viewport,
      }
      deviceSelection.value = { category, deviceName }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dimensions.value))
        localStorage.setItem(STORAGE_DEVICE_KEY, JSON.stringify(deviceSelection.value))
      } catch (e) {
        console.error('Fehler beim Speichern der Device-Settings:', e)
      }
    }
  }

  function resetToDefaults() {
    dimensions.value = defaultDimensions
    deviceSelection.value = null
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDimensions))
      localStorage.removeItem(STORAGE_DEVICE_KEY)
    } catch (e) {
      console.error('Fehler beim Zurücksetzen der Device-Settings:', e)
    }
  }

  return {
    dimensions,
    deviceSelection,
    mobileDimensions,
    tabletDimensions,
    desktopDimensions,
    deviceOptions,
    currentDeviceName,
    updateDimensions,
    updateMobile,
    updateTablet,
    updateDesktop,
    setDevice,
    resetToDefaults,
  }
}
