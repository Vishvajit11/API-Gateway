import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const staticOutput = fileURLToPath(
  new URL('../api-management-service/src/main/resources/static', import.meta.url),
)

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: staticOutput,
    emptyOutDir: true,
  },
})
