import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    // Скріншоти майже не змінюються, а Supabase Storage віддає `no-cache`,
    // через що браузер перезавантажував кожну картинку при кожному переході.
    // Кешуємо оптимізовані зображення на 31 день (і на сервері, і в браузері).
    minimumCacheTTL: 2678400,
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
