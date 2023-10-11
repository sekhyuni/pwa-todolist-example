/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');
// const isProduction = process.env.NODE_ENV === 'production';

const config = {
  // original next config
};

const nextConfig = withPWA({
  dest: 'public',
  // disable: !isProduction,
})(config);

module.exports = nextConfig;
