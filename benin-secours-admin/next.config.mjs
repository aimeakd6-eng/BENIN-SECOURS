/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppression de output: 'export' pour le mode dev pour éviter les conflits
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
