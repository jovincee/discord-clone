import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
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
