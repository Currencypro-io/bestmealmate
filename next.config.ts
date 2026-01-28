import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.svgrepo.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagservices.com https://adservice.google.com https://www.google-analytics.com https://tpc.googlesyndication.com https://*.adtrafficquality.google https://js.stripe.com",
              "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://*.adtrafficquality.google https://js.stripe.com https://hooks.stripe.com",
              "img-src 'self' data: https: blob:",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com https://*.adtrafficquality.google https://*.doubleclick.net https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.anthropic.com",
              "media-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
