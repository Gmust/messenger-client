/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
    remotePatterns: [{
      protocol: 'http',
      hostname: 'localhost',
      port: '8080',
      pathname: '/userimages/**'
    }, {
      protocol: 'http',
      hostname: 'localhost',
      port: '8080',
      pathname: '/chatfiles/**'
    }]
  },

};

module.exports = nextConfig;
