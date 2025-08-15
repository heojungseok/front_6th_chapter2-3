import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/front_6th_chapter2-3/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@app": "/src/app",
      "@pages": "/src/pages",
      "@widgets": "/src/widgets",
      "@features": "/src/features",
      "@entities": "/src/entities",
      "@shared": "/src/shared",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://dummyjson.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
}))
