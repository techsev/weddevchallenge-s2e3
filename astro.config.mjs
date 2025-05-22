// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: 'https://techsev.github.io/',
  base: '/weddevchallenge-s2e3/',

  vite: {
    plugins: [tailwindcss()]
  }
})
