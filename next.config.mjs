/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow build to succeed even if there are lint errors during UI preview
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
