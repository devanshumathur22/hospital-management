import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://hospital-management-one-ruby.vercel.app/api/:path*",
      },
    ]
  },
}

export default nextConfig