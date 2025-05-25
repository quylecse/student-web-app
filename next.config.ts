import type { NextConfig } from "next";

//CORS (Cross-Origin Resource Sharing) - Fehler behandeln
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Alle Anfragen an /api/ gefolgt von einem beliebigen Pfad
        destination: 'https://student-service.hinderks.digital/:path*', // Werden an das Backend-API weitergeleitet (Proxy)
      },
    ];
  },
};

export default nextConfig;