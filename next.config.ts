import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  /* config options here */
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate" : "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    })

    return config
  },
  images: {
    /**
     * Set a remote pattern for images for https protocol and ALL hostnames
     */
    remotePatterns: [
      {
        protocol: "https",                  
        hostname: "**",
       
      },

    ],
    
    
  }
  
};

export default nextConfig;
