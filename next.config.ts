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
      // Force sitemap and robots to non-www if hit via www
      {
        source: '/sitemap.xml',
        destination: 'https://naveengaur.com/sitemap.xml',
        permanent: true,
      },
      {
        source: '/robots.txt',
        destination: 'https://naveengaur.com/robots.txt',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
