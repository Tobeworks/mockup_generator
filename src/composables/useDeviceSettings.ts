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

// Singleton pattern - shared state across all instances
let sharedDimensions: DeviceDimensions | null = null
let sharedDeviceSelection: DeviceSelection | null = null

export function useDeviceSettings() {
  const STORAGE_KEY = 'mockup_generator_device_dimensions'
  const STORAGE_DEVICE_KEY = 'mockup_generator_device_selection'

  const defaultDimensions: DeviceDimensions = {
    mobile: { width: 390, height: 844 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
  }

  // Load from storage once and share across all instances
  if (!sharedDimensions) {
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
          sharedDimensions = parsed as DeviceDimensions
        }
      }
    } catch (e) {
      console.error('Fehler beim Laden der Device-Settings:', e)
    }
    sharedDimensions = sharedDimensions || { ...defaultDimensions }
  }

  if (!sharedDeviceSelection) {
    try {
      const stored = localStorage.getItem(STORAGE_DEVICE_KEY)
      if (stored) {
        sharedDeviceSelection = JSON.parse(stored) as DeviceSelection
      }
    } catch (e) {
      console.error('Fehler beim Laden der Device-Auswahl:', e)
    }
  }

  const dimensions = ref<DeviceDimensions>(sharedDimensions!)
  const deviceSelection = ref<DeviceSelection | null>(sharedDeviceSelection)

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
    // Update shared state
    sharedDimensions = { ...newDimensions }
    // Update local refs
    dimensions.value = sharedDimensions
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedDimensions))
    } catch (e) {
      console.error('Fehler beim Speichern der Device-Settings:', e)
    }
  }

  function updateMobile(width: number, height: number) {
    sharedDimensions = {
      ...sharedDimensions!,
      mobile: { width, height },
    }
    dimensions.value = sharedDimensions
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedDimensions))
    } catch (e) {
      console.error('Fehler beim Speichern der Device-Settings:', e)
    }
  }

  function updateTablet(width: number, height: number) {
    sharedDimensions = {
      ...sharedDimensions!,
      tablet: { width, height },
    }
    dimensions.value = sharedDimensions
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedDimensions))
    } catch (e) {
      console.error('Fehler beim Speichern der Device-Settings:', e)
    }
  }

  function updateDesktop(width: number, height: number) {
    sharedDimensions = {
      ...sharedDimensions!,
      desktop: { width, height },
    }
    dimensions.value = sharedDimensions
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedDimensions))
    } catch (e) {
      console.error('Fehler beim Speichern der Device-Settings:', e)
    }
  }

  function setDevice(category: 'mobile' | 'tablet' | 'desktop', deviceName: string) {
    const devices = DEVICES[category]
    const device = devices.find(d => d.name === deviceName)
    if (device) {
      // Update shared state
      sharedDimensions = {
        ...sharedDimensions!,
        [category]: device.viewport,
      }
      sharedDeviceSelection = { category, deviceName }
      // Update local refs
      dimensions.value = sharedDimensions
      deviceSelection.value = sharedDeviceSelection
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedDimensions))
        localStorage.setItem(STORAGE_DEVICE_KEY, JSON.stringify(sharedDeviceSelection))
      } catch (e) {
        console.error('Fehler beim Speichern der Device-Settings:', e)
      }
    }
  }

  function resetToDefaults() {
    sharedDimensions = { ...defaultDimensions }
    sharedDeviceSelection = null
    dimensions.value = sharedDimensions
    deviceSelection.value = sharedDeviceSelection
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedDimensions))
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
