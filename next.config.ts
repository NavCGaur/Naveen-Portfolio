import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/about-us',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog/how-to-exclude-yourself-from-google-analytics',
        destination: '/blog/how-to-go-incognito-and-stop-google-analytics-tracking',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
