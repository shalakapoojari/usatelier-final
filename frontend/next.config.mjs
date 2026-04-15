/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'standalone',

  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options',         value: 'DENY' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'geolocation=(), microphone=(), camera=()' },
          { key: 'X-XSS-Protection',         value: '0' },
        ],
      },
    ]
  },

  async rewrites() {
    const isProd = process.env.NODE_ENV === 'production';
    const destination = isProd
      ? 'https://api.usatelier.in/api/:path*'
      : 'http://127.0.0.1:5000/api/:path*';
    return [
      {
        source: '/api/:path*',
        destination
      }
    ]
  }
}

export default nextConfig
