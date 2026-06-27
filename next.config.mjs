/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.xhuma.cc" }],
        destination: "https://xhuma.cc/:path*",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
