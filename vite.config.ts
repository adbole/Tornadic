import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [
        react(), 
        svgr(), 
        tsConfigPaths(),
        VitePWA({
            registerType: "prompt",
            workbox: {
                globPatterns: ['**/*.{js,css,html,png,svg}'],
                cleanupOutdatedCaches: true
            },
            manifest: {
                short_name: "Tornadic",
                name: "Tornadic",
                id: "Tornadic",
                description: "A weather app providing weather information at a glance.",
                icons: [
                    {
                        src: "resources/svgs/tornadic-mask.svg",
                        type: "image/svg+xml",
                        sizes: "any",
                        purpose: "any"
                    },
                    {
                        src: "resources/images/icons/apple-touch-icon.png",
                        type: "image/png",
                        sizes: "192x192",
                        purpose: "maskable"
                    },
                    {
                        src: "resources/images/icons/icon512.png",
                        type: "image/png",
                        sizes: "512x512",
                        purpose: "maskable"
                    }
                ],
                start_url: ".",
                display: "standalone",
                theme_color: "#191B1F",
                background_color: "#191B1F"
            }
        })
    ],
  };
});