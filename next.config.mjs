/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Sanity-hosted image assets
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Unsplash placeholder imagery (BRAND_KIT.md § Placeholder Imagery).
      // Note: photo files are served from images.unsplash.com / plus.unsplash.com,
      // not the bare unsplash.com marketing domain.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
