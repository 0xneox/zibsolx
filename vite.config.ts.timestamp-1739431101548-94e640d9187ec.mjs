// vite.config.ts
import { defineConfig } from "file:///C:/Users/neohe/Desktop/zibsolx/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/neohe/Desktop/zibsolx/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import { VitePWA } from "file:///C:/Users/neohe/Desktop/zibsolx/node_modules/vite-plugin-pwa/dist/index.js";
import tsconfigPaths from "file:///C:/Users/neohe/Desktop/zibsolx/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\neohe\\Desktop\\zibsolx";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Zibsolx - Meme Coin Trading",
        short_name: "Zibsolx",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@jup-ag/common": path.resolve(__vite_injected_original_dirname, "./src/lib/jupiter-common.ts"),
      "rpc-websockets": path.resolve(__vite_injected_original_dirname, "./src/lib/rpc-websocket-browser.ts"),
      "@solana/spl-token": path.resolve(__vite_injected_original_dirname, "./src/lib/spl-token-compat.ts"),
      "process": "process/browser",
      "stream": "stream-browserify",
      "zlib": "browserify-zlib",
      "util": "util",
      "buffer": "buffer",
      "ws": path.resolve(__vite_injected_original_dirname, "./src/lib/websocket-browser.ts")
    }
  },
  define: {
    "process.env": {},
    "global": "globalThis"
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
      define: {
        global: "globalThis"
      },
      supported: {
        bigint: true
      }
    },
    include: [
      "@jup-ag/core",
      "@solana/web3.js",
      "buffer",
      "events",
      "process"
    ],
    exclude: ["@jup-ag/common"]
  },
  build: {
    target: "es2020",
    sourcemap: true,
    commonjsOptions: {
      include: [/@jup-ag\/.*/, /node_modules/]
    },
    rollupOptions: {
      external: ["ws"],
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "solana-wallet": [
            "@solana/wallet-adapter-base",
            "@solana/wallet-adapter-react",
            "@solana/wallet-adapter-react-ui",
            "@solana/wallet-adapter-phantom"
          ],
          "solana-web3": ["@solana/web3.js"],
          "jupiter": ["@jup-ag/core"],
          vendor: ["react-router-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-toast"]
        }
      }
    }
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
        target: "http://localhost:3001",
        changeOrigin: true,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxuZW9oZVxcXFxEZXNrdG9wXFxcXHppYnNvbHhcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG5lb2hlXFxcXERlc2t0b3BcXFxcemlic29seFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbmVvaGUvRGVza3RvcC96aWJzb2x4L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgdHNjb25maWdQYXRocygpLFxuICAgIFZpdGVQV0Eoe1xuICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbJ2Zhdmljb24uaWNvJywgJ3JvYm90cy50eHQnLCAnYXBwbGUtdG91Y2gtaWNvbi5wbmcnXSxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdaaWJzb2x4IC0gTWVtZSBDb2luIFRyYWRpbmcnLFxuICAgICAgICBzaG9ydF9uYW1lOiAnWmlic29seCcsXG4gICAgICAgIHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL2FuZHJvaWQtY2hyb21lLTE5MngxOTIucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL2FuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgICdAanVwLWFnL2NvbW1vbic6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9saWIvanVwaXRlci1jb21tb24udHMnKSxcbiAgICAgICdycGMtd2Vic29ja2V0cyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9saWIvcnBjLXdlYnNvY2tldC1icm93c2VyLnRzJyksXG4gICAgICAnQHNvbGFuYS9zcGwtdG9rZW4nOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvbGliL3NwbC10b2tlbi1jb21wYXQudHMnKSxcbiAgICAgICdwcm9jZXNzJzogJ3Byb2Nlc3MvYnJvd3NlcicsXG4gICAgICAnc3RyZWFtJzogJ3N0cmVhbS1icm93c2VyaWZ5JyxcbiAgICAgICd6bGliJzogJ2Jyb3dzZXJpZnktemxpYicsXG4gICAgICAndXRpbCc6ICd1dGlsJyxcbiAgICAgICdidWZmZXInOiAnYnVmZmVyJyxcbiAgICAgICd3cyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9saWIvd2Vic29ja2V0LWJyb3dzZXIudHMnKVxuICAgIH1cbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgJ3Byb2Nlc3MuZW52Jzoge30sXG4gICAgJ2dsb2JhbCc6ICdnbG9iYWxUaGlzJ1xuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgdGFyZ2V0OiAnZXMyMDIwJyxcbiAgICAgIGRlZmluZToge1xuICAgICAgICBnbG9iYWw6ICdnbG9iYWxUaGlzJ1xuICAgICAgfSxcbiAgICAgIHN1cHBvcnRlZDoge1xuICAgICAgICBiaWdpbnQ6IHRydWVcbiAgICAgIH1cbiAgICB9LFxuICAgIGluY2x1ZGU6IFtcbiAgICAgICdAanVwLWFnL2NvcmUnLFxuICAgICAgJ0Bzb2xhbmEvd2ViMy5qcycsXG4gICAgICAnYnVmZmVyJyxcbiAgICAgICdldmVudHMnLFxuICAgICAgJ3Byb2Nlc3MnXG4gICAgXSxcbiAgICBleGNsdWRlOiBbJ0BqdXAtYWcvY29tbW9uJ11cbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdlczIwMjAnLFxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICBjb21tb25qc09wdGlvbnM6IHtcbiAgICAgIGluY2x1ZGU6IFsvQGp1cC1hZ1xcLy4qLywgL25vZGVfbW9kdWxlcy9dXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWyd3cyddLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICAgICdzb2xhbmEtd2FsbGV0JzogW1xuICAgICAgICAgICAgJ0Bzb2xhbmEvd2FsbGV0LWFkYXB0ZXItYmFzZScsXG4gICAgICAgICAgICAnQHNvbGFuYS93YWxsZXQtYWRhcHRlci1yZWFjdCcsXG4gICAgICAgICAgICAnQHNvbGFuYS93YWxsZXQtYWRhcHRlci1yZWFjdC11aScsXG4gICAgICAgICAgICAnQHNvbGFuYS93YWxsZXQtYWRhcHRlci1waGFudG9tJ1xuICAgICAgICAgIF0sXG4gICAgICAgICAgJ3NvbGFuYS13ZWIzJzogWydAc29sYW5hL3dlYjMuanMnXSxcbiAgICAgICAgICAnanVwaXRlcic6IFsnQGp1cC1hZy9jb3JlJ10sXG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICB1aTogWydAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJywgJ0ByYWRpeC11aS9yZWFjdC10b2FzdCddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGJhc2U6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCIgPyBcIi9cIiA6IHByb2Nlc3MuZW52LlZJVEVfQkFTRV9QQVRIIHx8IFwiL1wiLFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAxLFxuICAgIGhvc3Q6IHRydWUsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGkvanVwaXRlcic6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9wcmljZS5qdXAuYWcnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGlcXC9qdXBpdGVyLywgJy92NCcpLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ09yaWdpbic6ICdodHRwczovL3ByaWNlLmp1cC5hZycsXG4gICAgICAgICAgJ1JlZmVyZXInOiAnaHR0cHM6Ly9wcmljZS5qdXAuYWcnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnL2FwaS9iaXJkZXllJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwczovL3B1YmxpYy1hcGkuYmlyZGV5ZS5zbycsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaVxcL2JpcmRleWUvLCAnL3YyJyksXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnT3JpZ2luJzogJ2h0dHBzOi8vcHVibGljLWFwaS5iaXJkZXllLnNvJyxcbiAgICAgICAgICAnUmVmZXJlcic6ICdodHRwczovL3B1YmxpYy1hcGkuYmlyZGV5ZS5zbycsXG4gICAgICAgICAgJ1gtQVBJLUtFWSc6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0JJUkRFWUVfQVBJX0tFWSB8fCAnJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJy9hcGkvZGV4c2NyZWVuZXInOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vYXBpLmRleHNjcmVlbmVyLmNvbScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaVxcL2RleHNjcmVlbmVyLywgJy9sYXRlc3QvZGV4JyksXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnT3JpZ2luJzogJ2h0dHBzOi8vYXBpLmRleHNjcmVlbmVyLmNvbScsXG4gICAgICAgICAgJ1JlZmVyZXInOiAnaHR0cHM6Ly9hcGkuZGV4c2NyZWVuZXIuY29tJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKVxuICAgICAgfVxuICAgIH0sXG4gICAgY29yczoge1xuICAgICAgb3JpZ2luOiAnKicsXG4gICAgICBtZXRob2RzOiBbJ0dFVCcsICdQT1NUJywgJ1BVVCcsICdERUxFVEUnLCAnT1BUSU9OUyddLFxuICAgICAgYWxsb3dlZEhlYWRlcnM6IFsnQ29udGVudC1UeXBlJywgJ0F1dGhvcml6YXRpb24nLCAnWC1BUEktS0VZJ10sXG4gICAgfSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycsXG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24sIFgtQVBJLUtFWScsXG4gICAgICAnQ3Jvc3MtT3JpZ2luLU9wZW5lci1Qb2xpY3knOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgJ0Nyb3NzLU9yaWdpbi1FbWJlZGRlci1Qb2xpY3knOiAncmVxdWlyZS1jb3JwJyxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNSLFNBQVMsb0JBQW9CO0FBQ25ULE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sbUJBQW1CO0FBSjFCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxJQUNkLFFBQVE7QUFBQSxNQUNOLGNBQWM7QUFBQSxNQUNkLGVBQWUsQ0FBQyxlQUFlLGNBQWMsc0JBQXNCO0FBQUEsTUFDbkUsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsT0FBTztBQUFBLFVBQ0w7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtB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
