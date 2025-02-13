/// <reference types="vite/client" />

interface Window {
  global: Window;
  Buffer: typeof Buffer;
  process: NodeJS.Process;
}

declare module 'process' {
  global {
    namespace NodeJS {
      interface Process {
        browser: boolean;
      }
    }
  }
}
