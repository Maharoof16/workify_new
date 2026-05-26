import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/v1/:path*`,
      },
    ];
  },
  async headers() {
  return [
    {
      source: "/v1/:path*",
      headers: [
        { key: "X-Forwarded-For", value: ":req-header-x-forwarded-host" },
        { key: "X-Real-IP", value: ":req-header-x-real-ip" },
      ],
    },
  ];
},
};

export default nextConfig;
