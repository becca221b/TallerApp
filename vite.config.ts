/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // o 'jsdom' si probás código del navegador
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
