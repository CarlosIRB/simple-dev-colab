import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para desarrollo en Docker
  experimental: {
    // Habilitar hot reload en contenedores
    esmExternals: false,
  },
  // Configuración para desarrollo
  ...(process.env.NODE_ENV === 'development' && {
    // Asegurar que Next.js detecte cambios en archivos
    onDemandEntries: {
      // Tiempo en ms que una página se mantiene en memoria
      maxInactiveAge: 25 * 1000,
      // Número de páginas que se mantienen simultáneamente
      pagesBufferLength: 2,
    },
  }),
};

export default nextConfig;
