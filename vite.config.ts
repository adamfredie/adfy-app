import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react"

export default defineConfig({
  publicDir: 'src/public',
  server: {
    allowedHosts: true,
    cors: true,
    proxy: {
      // Proxy Supabase requests to avoid CORS issues
      '/supabase': {
        target: 'https://ecnekqzeaybcbpvujmku.supabase.co',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/supabase/, '')
      }
    }
  },
  plugins:[react()],
  // Add environment variable handling
  define: {
    'process.env': {}
  }
});