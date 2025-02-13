// vite.config.ts
import path from "path";
import { defineConfig } from "file:///C:/Users/neohe/Desktop/zibsolx/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/neohe/Desktop/zibsolx/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///C:/Users/neohe/Desktop/zibsolx/node_modules/vite-plugin-pwa/dist/index.js";
import tsconfigPaths from "file:///C:/Users/neohe/Desktop/zibsolx/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\neohe\\Desktop\\zibsolx";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["logo.png"],
      manifest: {
        name: "ZibFin Trading",
        short_name: "ZibFin",
        description: "India's Most User-Friendly Crypto Trading Platform",
        theme_color: "#ffffff",
        start_url: "/",
        scope: "/",
        display: "standalone",
        icons: [
          {
            src: "logo.png",
            sizes: "192x192",
            type: "image/png"
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60
                // 5 minutes
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: "module"
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020"
    }
  },
  build: {
    sourcemap: true,
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "wallet-vendor": [
            "@solana/web3.js",
            "@solana/wallet-adapter-react",
            "@solana/wallet-adapter-react-ui",
            "@solana/wallet-adapter-phantom"
          ],
          vendor: ["react-router-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-toast"],
          solana: ["@solana/spl-token"]
        }
      },
      external: ["buffer"]
    }
  },
  define: {
    "process.env": {},
    "global": {}
  },
  base: process.env.NODE_ENV === "development" ? "/" : process.env.VITE_BASE_PATH || "/",
  server: {
    port: 3001,
    host: true,
    strictPort: true,
    proxy: {
      "/api/jupiter": {
        target: "https://price.jup.ag",
        changeOrigin: true,
        secure: false,
        rewrite: (path2) => path2.replace(/^\/api\/jupiter/, "/v4"),
        headers: {
          "Origin": "https://price.jup.ag",
          "Referer": "https://price.jup.ag"
        }
      },
      "/api/birdeye": {
        target: "https://public-api.birdeye.so",
        changeOrigin: true,
        secure: false,
        rewrite: (path2) => path2.replace(/^\/api\/birdeye/, "/v2"),
        headers: {
          "Origin": "https://public-api.birdeye.so",
          "Referer": "https://public-api.birdeye.so",
          "X-API-KEY": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || ""
        }
      },
      "/api/dexscreener": {
        target: "https://api.dexscreener.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path2) => path2.replace(/^\/api\/dexscreener/, "/latest/dex"),
        headers: {
          "Origin": "https://api.dexscreener.com",
          "Referer": "https://api.dexscreener.com"
        }
      },
      "/api": {
        target: "https://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      }
    },
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-API-KEY"]
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-KEY",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxuZW9oZVxcXFxEZXNrdG9wXFxcXHppYnNvbHhcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG5lb2hlXFxcXERlc2t0b3BcXFxcemlic29seFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbmVvaGUvRGVza3RvcC96aWJzb2x4L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICB0c2NvbmZpZ1BhdGhzKCksXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6ICdwcm9tcHQnLFxuICAgICAgaW5jbHVkZUFzc2V0czogWydsb2dvLnBuZyddLFxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogJ1ppYkZpbiBUcmFkaW5nJyxcbiAgICAgICAgc2hvcnRfbmFtZTogJ1ppYkZpbicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGlhJ3MgTW9zdCBVc2VyLUZyaWVuZGx5IENyeXB0byBUcmFkaW5nIFBsYXRmb3JtXCIsXG4gICAgICAgIHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIHN0YXJ0X3VybDogJy8nLFxuICAgICAgICBzY29wZTogJy8nLFxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnbG9nby5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHdvcmtib3g6IHtcbiAgICAgICAgY2xlYW51cE91dGRhdGVkQ2FjaGVzOiB0cnVlLFxuICAgICAgICBza2lwV2FpdGluZzogdHJ1ZSxcbiAgICAgICAgY2xpZW50c0NsYWltOiB0cnVlLFxuICAgICAgICBydW50aW1lQ2FjaGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvYXBpXFwuL2ksXG4gICAgICAgICAgICBoYW5kbGVyOiAnTmV0d29ya0ZpcnN0JyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiAnYXBpLWNhY2hlJyxcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDUwLFxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDUgKiA2MCAvLyA1IG1pbnV0ZXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIGRldk9wdGlvbnM6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgdHlwZTogJ21vZHVsZSdcbiAgICAgIH1cbiAgICB9KVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICB0YXJnZXQ6ICdlczIwMjAnLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIHRhcmdldDogJ2VzMjAyMCcsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICAgICd3YWxsZXQtdmVuZG9yJzogW1xuICAgICAgICAgICAgJ0Bzb2xhbmEvd2ViMy5qcycsXG4gICAgICAgICAgICAnQHNvbGFuYS93YWxsZXQtYWRhcHRlci1yZWFjdCcsXG4gICAgICAgICAgICAnQHNvbGFuYS93YWxsZXQtYWRhcHRlci1yZWFjdC11aScsXG4gICAgICAgICAgICAnQHNvbGFuYS93YWxsZXQtYWRhcHRlci1waGFudG9tJ1xuICAgICAgICAgIF0sXG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICB1aTogWydAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJywgJ0ByYWRpeC11aS9yZWFjdC10b2FzdCddLFxuICAgICAgICAgIHNvbGFuYTogWydAc29sYW5hL3NwbC10b2tlbiddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGV4dGVybmFsOiBbJ2J1ZmZlciddLFxuICAgIH0sXG4gIH0sXG4gIGRlZmluZToge1xuICAgICdwcm9jZXNzLmVudic6IHt9LFxuICAgICdnbG9iYWwnOiB7fSxcbiAgfSxcbiAgYmFzZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIiA/IFwiL1wiIDogcHJvY2Vzcy5lbnYuVklURV9CQVNFX1BBVEggfHwgXCIvXCIsXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDEsXG4gICAgaG9zdDogdHJ1ZSxcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaS9qdXBpdGVyJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwczovL3ByaWNlLmp1cC5hZycsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaVxcL2p1cGl0ZXIvLCAnL3Y0JyksXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnT3JpZ2luJzogJ2h0dHBzOi8vcHJpY2UuanVwLmFnJyxcbiAgICAgICAgICAnUmVmZXJlcic6ICdodHRwczovL3ByaWNlLmp1cC5hZydcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICcvYXBpL2JpcmRleWUnOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vcHVibGljLWFwaS5iaXJkZXllLnNvJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpXFwvYmlyZGV5ZS8sICcvdjInKSxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdPcmlnaW4nOiAnaHR0cHM6Ly9wdWJsaWMtYXBpLmJpcmRleWUuc28nLFxuICAgICAgICAgICdSZWZlcmVyJzogJ2h0dHBzOi8vcHVibGljLWFwaS5iaXJkZXllLnNvJyxcbiAgICAgICAgICAnWC1BUEktS0VZJzogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQklSREVZRV9BUElfS0VZIHx8ICcnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnL2FwaS9kZXhzY3JlZW5lcic6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9hcGkuZGV4c2NyZWVuZXIuY29tJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpXFwvZGV4c2NyZWVuZXIvLCAnL2xhdGVzdC9kZXgnKSxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdPcmlnaW4nOiAnaHR0cHM6Ly9hcGkuZGV4c2NyZWVuZXIuY29tJyxcbiAgICAgICAgICAnUmVmZXJlcic6ICdodHRwczovL2FwaS5kZXhzY3JlZW5lci5jb20nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKVxuICAgICAgfVxuICAgIH0sXG4gICAgY29yczoge1xuICAgICAgb3JpZ2luOiAnKicsXG4gICAgICBtZXRob2RzOiBbJ0dFVCcsICdQT1NUJywgJ1BVVCcsICdERUxFVEUnLCAnT1BUSU9OUyddLFxuICAgICAgYWxsb3dlZEhlYWRlcnM6IFsnQ29udGVudC1UeXBlJywgJ0F1dGhvcml6YXRpb24nLCAnWC1BUEktS0VZJ10sXG4gICAgfSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycsXG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24sIFgtQVBJLUtFWScsXG4gICAgICAnQ3Jvc3MtT3JpZ2luLU9wZW5lci1Qb2xpY3knOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgJ0Nyb3NzLU9yaWdpbi1FbWJlZGRlci1Qb2xpY3knOiAncmVxdWlyZS1jb3JwJyxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNSLE9BQU8sVUFBVTtBQUN2UyxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sbUJBQW1CO0FBSjFCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxJQUNkLFFBQVE7QUFBQSxNQUNOLGNBQWM7QUFBQSxNQUNkLGVBQWUsQ0FBQyxVQUFVO0FBQUEsTUFDMUIsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLFFBQ2IsV0FBVztBQUFBLFFBQ1gsT0FBTztBQUFBLFFBQ1AsU0FBUztBQUFBLFFBQ1QsT0FBTztBQUFBLFVBQ0w7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQLHVCQUF1QjtBQUFBLFFBQ3ZCLGFBQWE7QUFBQSxRQUNiLGNBQWM7QUFBQSxRQUNkLGdCQUFnQjtBQUFBLFVBQ2Q7QUFBQSxZQUNFLFlBQVk7QUFBQSxZQUNaLFNBQVM7QUFBQSxZQUNULFNBQVM7QUFBQSxjQUNQLFdBQVc7QUFBQSxjQUNYLFlBQVk7QUFBQSxnQkFDVixZQUFZO0FBQUEsZ0JBQ1osZUFBZSxJQUFJO0FBQUE7QUFBQSxjQUNyQjtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFlBQVk7QUFBQSxRQUNWLFNBQVM7QUFBQSxRQUNULE1BQU07QUFBQSxNQUNSO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFD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
