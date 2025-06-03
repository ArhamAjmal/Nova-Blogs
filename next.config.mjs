import createMDX from '@next/mdx'
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile MDXEditor to avoid runtime issues
  transpilePackages: ['@mdxeditor/editor'],
  // Enable modern JavaScript features
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  images: {//for next image using cloudinary
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}
 
const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.(md|mdx)$/,
})

 
// Merge MDX config with Next.js config
export default withMDX(nextConfig)

///Before:
///@type {import('next').NextConfig} 
//const nextConfig = {};

//export default nextConfig;

 