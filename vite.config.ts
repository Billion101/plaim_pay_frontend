import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0', // This tells Vite to listen on all local IP addresses
        port: 5173,      // You can specify a port (default is 5173)
        allowedHosts: [
            'phoudthasone.com'
        ]
    }
})