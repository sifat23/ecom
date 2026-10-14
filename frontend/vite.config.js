import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],

    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,

        // Proxy API calls straight to the api container in dev.
        // (In production, nginx handles /api and /uploads.)
        proxy: {
            '/api':     { target: 'http://api:3000', changeOrigin: true },
            '/uploads': { target: 'http://api:3000', changeOrigin: true },
        },

        // Needed for reliable file-watching inside Docker on macOS/Windows.
        watch: { usePolling: true, interval: 300 },
    },

    build: {
        outDir: 'dist',
        sourcemap: false,
    },
});