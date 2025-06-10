const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && (window as any).env?.VITE_API_BASE_URL) {
    return (window as any).env.VITE_API_BASE_URL;
  }
  return import.meta.env.VITE_API_BASE_URL;
};

export const API_BASE_URL = getApiBaseUrl();
