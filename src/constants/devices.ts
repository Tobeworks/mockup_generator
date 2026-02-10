export interface DeviceViewport {
  width: number
  height: number
}

export interface Device {
  name: string
  viewport: DeviceViewport
}

export interface DeviceCategory {
  mobile: Device[]
  tablet: Device[]
  desktop: Device[]
}

export const DEVICES: DeviceCategory = {
  mobile: [
    {
      name: 'iPhone SE (1st Gen) / iPhone 5/5s',
      viewport: { width: 320, height: 568 }
    },
    {
      name: 'iPhone 4 / 4s',
      viewport: { width: 320, height: 480 }
    },
    {
      name: 'Samsung Galaxy S5 / S6 / S7',
      viewport: { width: 360, height: 640 }
    },
    {
      name: 'Generic Android (Old/Budget)',
      viewport: { width: 360, height: 640 }
    },
    {
      name: 'iPhone 6 / 7 / 8 / SE (2nd & 3rd Gen)',
      viewport: { width: 375, height: 667 }
    },
    {
      name: 'iPhone X / XS / 11 Pro',
      viewport: { width: 375, height: 812 }
    },
    {
      name: 'Samsung Galaxy S8 / S9 / S10',
      viewport: { width: 360, height: 740 }
    },
    {
      name: 'Generic Android (Modern/Tall)',
      viewport: { width: 360, height: 800 }
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      viewport: { width: 384, height: 824 }
    },
    {
      name: 'iPhone 12 / 13 / 14 / 15 / 16',
      viewport: { width: 390, height: 844 }
    },
    {
      name: 'iPhone 16 Pro',
      viewport: { width: 402, height: 874 }
    },
    {
      name: 'Google Pixel 7 / 8 / 9 Pro',
      viewport: { width: 412, height: 915 }
    },
    {
      name: 'iPhone 6/7/8 Plus',
      viewport: { width: 414, height: 736 }
    },
    {
      name: 'iPhone 11 / XR',
      viewport: { width: 414, height: 896 }
    },
    {
      name: 'iPhone 12/13 Pro Max',
      viewport: { width: 428, height: 926 }
    },
    {
      name: 'iPhone 14/15/16 Plus & Pro Max',
      viewport: { width: 430, height: 932 }
    }
  ],
  tablet: [
    {
      name: 'Nexus 7 (2013)',
      viewport: { width: 600, height: 960 }
    },
    {
      name: 'Samsung Galaxy Tab Active',
      viewport: { width: 800, height: 1280 }
    },
    {
      name: 'iPad Mini (All Generations)',
      viewport: { width: 744, height: 1133 }
    },
    {
      name: 'iPad (1st - 9th Gen) / iPad Air (1/2)',
      viewport: { width: 768, height: 1024 }
    },
    {
      name: 'iPad Air (4th/5th Gen) / iPad Pro 11"',
      viewport: { width: 820, height: 1180 }
    },
    {
      name: 'iPad Pro 11" (M4)',
      viewport: { width: 834, height: 1210 }
    },
    {
      name: 'Samsung Galaxy Tab S9 Ultra',
      viewport: { width: 924, height: 1480 }
    },
    {
      name: 'iPad Pro 12.9" (Old & New) / 13"',
      viewport: { width: 1024, height: 1366 }
    }
  ],
  desktop: [
    {
      name: 'Old Monitor (4:3)',
      viewport: { width: 1024, height: 768 }
    },
    {
      name: 'Legacy Laptop / Projector',
      viewport: { width: 1280, height: 800 }
    },
    {
      name: 'Budget Laptop (15.6")',
      viewport: { width: 1366, height: 768 }
    },
    {
      name: 'MacBook Air 13" (Intel/M1/M2)',
      viewport: { width: 1440, height: 900 }
    },
    {
      name: 'MacBook Pro 14"',
      viewport: { width: 1512, height: 982 }
    },
    {
      name: 'Standard Monitor (FHD)',
      viewport: { width: 1920, height: 1080 }
    },
    {
      name: 'Ultrawide Monitor (WFHD)',
      viewport: { width: 2560, height: 1080 }
    },
    {
      name: 'QHD Monitor / 27" iMac',
      viewport: { width: 2560, height: 1440 }
    },
    {
      name: '4K Monitor (Native/Unscaled)',
      viewport: { width: 3840, height: 2160 }
    }
  ]
}
