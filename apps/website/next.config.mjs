/** @type {import("next").NextConfig} */
const config = {
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,
  transpilePackages: ["@neoai/ui", "@neoai/tailwind", "next-mdx-remote"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    inlineCss: true,
  },
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/en/(.*)",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default config;
