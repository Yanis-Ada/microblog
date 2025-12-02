/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimisation des images (si vous ajoutez des avatars plus tard)
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
