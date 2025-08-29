import { defineConfig } from 'vite';

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
  // Add environment variable handling
  define: {
    'process.env': {}
  }
});