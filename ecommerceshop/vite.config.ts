import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    server: {
        host: '0.0.0.0',
        port: Number(process.env.PORT) || 5173,
        proxy: {
            // Proxy API requests to backend during development
            '/api': {
                target: 'http://localhost:5001',
                changeOrigin: true,
                secure: false,
            },
            '/health': {
                target: 'http://localhost:5001',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})
