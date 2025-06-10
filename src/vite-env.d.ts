/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Agrega aquí otras variables de entorno VITE_ que uses
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Extender la interfaz Window globalmente
declare global {
  interface Window {
    env: {
      VITE_API_BASE_URL: string;
      [key: string]: string; // Para permitir otras variables VITE_
    } | undefined; // Hacer que 'env' sea opcional en tiempo de ejecución
  }
}
