/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Agrega aquí otras variables de entorno VITE_ que uses
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    env?: { // Hacemos 'env' opcional
      VITE_API_BASE_URL: string;
      [key: string]: string; // Para permitir otras variables VITE_
    };
  }
}
