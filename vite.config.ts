import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        target: 'es2020',
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',
        cssMinify: true,
        reportCompressedSize: true,
        chunkSizeWarningLimit: 1000,
        // Optimize for Cloudflare Pages
        assetsInlineLimit: 4096, // Inline small assets as base64
        emptyOutDir: true,
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.tsx'),
          },
          output: {
            manualChunks: (id) => {
              // Core React libraries
              if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                return 'vendor-react';
              }
              
              // D3 visualization library
              if (id.includes('node_modules/d3')) {
                return 'vendor-d3';
              }
              
              // Group visualizations by category for better caching
              if (id.includes('/visualizations/')) {
                if (id.includes('DynamicEquilibriumViz') || 
                    id.includes('AboutViz') || 
                    id.includes('WhatIsHomodynamicsViz') ||
                    id.includes('IntroductionLifeViz') ||
                    id.includes('IntroductionMergeViz') ||
                    id.includes('IntroductionFeedbackViz')) {
                  return 'viz-core';
                }
                
                if (id.includes('PlatosCaveViz') || 
                    id.includes('TripartiteSoulViz') || 
                    id.includes('ShadowsViz') || 
                    id.includes('AscentViz') ||
                    id.includes('ReasonViz') ||
                    id.includes('SpiritViz') ||
                    id.includes('AppetiteViz')) {
                  return 'viz-philosophy';
                }
                
                if (id.includes('FourNobleTruthsViz') || 
                    id.includes('EightfoldPathViz') || 
                    id.includes('DukkhaViz') || 
                    id.includes('SamudayaViz') ||
                    id.includes('NirodhaViz') ||
                    id.includes('MaggaViz') ||
                    id.includes('WisdomPillarViz') ||
                    id.includes('EthicalConductPillarViz') ||
                    id.includes('MentalDisciplinePillarViz')) {
                  return 'viz-buddhism';
                }
                
                if (id.includes('PurusarthasViz') || 
                    id.includes('PranaQiViz') || 
                    id.includes('DharmaViz') || 
                    id.includes('ArthaViz') ||
                    id.includes('KamaViz') ||
                    id.includes('MokshaViz') ||
                    id.includes('PranaBreathViz') ||
                    id.includes('QiLifeForceViz') ||
                    id.includes('PranaTypesViz')) {
                  return 'viz-vedic';
                }
                
                if (id.includes('SystemsTheoryLensViz') || 
                    id.includes('ThermodynamicsViz') || 
                    id.includes('InformationTheoryViz') || 
                    id.includes('ComplexAdaptiveSystemsViz') ||
                    id.includes('NeuromodulationViz') ||
                    id.includes('EnergyDomainViz') ||
                    id.includes('SpaceDomainViz') ||
                    id.includes('TimeDomainViz')) {
                  return 'viz-systems';
                }
                
                // Other visualizations
                return 'viz-other';
              }
              
              // Other node_modules
              if (id.includes('node_modules')) {
                return 'vendor-other';
              }
            },
            // Optimize asset naming
            assetFileNames: (assetInfo) => {
              if (!assetInfo.names || assetInfo.names.length === 0) {
                return `assets/[name]-[hash][extname]`;
              }
              const name = assetInfo.names[0];
              const info = name.split('.');
              const ext = info[info.length - 1];
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
                return `assets/images/[name]-[hash][extname]`;
              }
              if (/woff2?|eot|ttf|otf/i.test(ext)) {
                return `assets/fonts/[name]-[hash][extname]`;
              }
              return `assets/[name]-[hash][extname]`;
            },
            chunkFileNames: 'assets/js/[name]-[hash].js',
            entryFileNames: 'assets/js/[name]-[hash].js',
          }
        },
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
            passes: 2, // Multiple passes for better compression
            unsafe_arrows: true,
            unsafe_methods: true,
            unsafe_proto: true,
          },
          mangle: {
            safari10: true,
            properties: {
              regex: /^_/,
            },
          },
          format: {
            comments: false,
          },
        },
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'd3'],
        exclude: ['@vite/client', '@vite/env']
      },
      esbuild: {
        drop: ['console', 'debugger'],
        legalComments: 'none',
      },
      css: {
        devSourcemap: false
      },
      plugins: mode === 'production' ? [
        visualizer({
          filename: 'dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
        }),
        // Gzip compression for better performance on Cloudflare Pages
        viteCompression({
          algorithm: 'gzip',
          ext: '.gz',
          threshold: 1024,
          deleteOriginFile: false,
        }),
        // Brotli compression for modern browsers
        viteCompression({
          algorithm: 'brotliCompress',
          ext: '.br',
          threshold: 1024,
          deleteOriginFile: false,
        })
      ] : []
    };
});
