import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',

value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://revista-cientifica-by-winxx0102.onrender.com https://citlayiapryuepjhdofv.supabase.co;frame-src 'self' https://citlayiapryuepjhdofv.supabase.co;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;