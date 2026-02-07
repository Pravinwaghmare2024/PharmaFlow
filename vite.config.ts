
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Use esbuild for dropping console/debugger instead of terser to avoid extra dependencies
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    rollupOptions: {
      output: {
        // Automatically splits every node_module into its own separate JS file
        manualChunks(id) {
          if (id && typeof id === 'string' && id.includes('node_modules')) {
            // Returns the name of the package (e.g., 'recharts', '@google/genai')
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
        // Ensures clean filenames for the generated chunks
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Increase the warning limit slightly for enterprise-grade apps
    chunkSizeWarningLimit: 1000,
    // esbuild is the default and faster minifier that comes bundled with Vite
    minify: 'esbuild',
  },
});
