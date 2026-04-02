const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // Service worker will cache assets efficiently and provide offline page support.
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Edge runtime optimization
  experimental: {
    // missing-suspense-with-csr-bailout allows Client components to not block server rendering entirely
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = withPWA(nextConfig);
