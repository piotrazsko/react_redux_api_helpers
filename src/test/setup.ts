import { vi } from 'vitest'

// Mock console.warn to avoid warnings during tests
global.console.warn = vi.fn()
global.console.error = vi.fn()

// Setup DOM environment
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
  },
  writable: true,
})
