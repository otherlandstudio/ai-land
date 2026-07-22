import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    // Скріншоти майже не змінюються, а Supabase Storage віддає `no-cache`,
    // через що браузер перезавантажував кожну картинку при кожному переході.
    // Кешуємо оптимізовані зображення на 31 день (і на сервері, і в браузері).
    minimumCacheTTL: 2678400,
    // Стеля розміру: скріншоти не потребують 2K/4K навіть на retina. Стеля 1200px —
    // hero (показ ~830px) завантажить w=1200 замість w=3840 (у рази менший файл).
    deviceSizes: [640, 750, 828, 1080, 1200],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'api.microlink.io',
      },
      {
        protocol: 'https',
        hostname: '*.microlink.io',
      },
    ],
  },
};

export default withPayload(nextConfig);
