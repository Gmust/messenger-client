/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
    remotePatterns: [{
      protocol: 'http',
      hostname: 'localhost',
      port: '8080',
      pathname: '/userimages/**'
    }]
  },
  async rewrites() {
    return [
      {
        source: '/auth/login',
        destination: 'http://localhost:8080/auth/google/login'
      }
    ];
  }

};

module.exports = nextConfig;
