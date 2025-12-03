/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Output standalone pour Docker (image ultra-légère)
  // Génère .next/standalone avec uniquement les fichiers nécessaires
  output: 'standalone',
  
  // Optimisation des images
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
