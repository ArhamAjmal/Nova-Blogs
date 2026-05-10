// app/sitemap.xml/route.js
/*A sitemap is a special .xml file that lists all the important pages of your blog site (like /blog/abc, /about, etc.) so that Google, Bing, and other search engines can discover and crawl them properly.
With a sitemap:
You tell search engines what URLs exist and when they were last updated
You speed up indexing (showing your blogs in Google faster)
You improve your site’s visibility and trust
*/
import BlogModel from '@/app/lib/model';
import dbConnect from '@/app/lib/connect';

export async function GET() {
  try {
    const baseUrl = 'http://localhost:3000';//change this to your orignal domaiun, then create robot.txt,then afte deploying appsubmit your sitemap to google+ you can also validate your sitemap 

    await dbConnect();

    const blogs = await BlogModel.find({ status: "published" }).select('slug updatedAt');

   const blogUrls = blogs.map((blog) => {
  const lastMod = blog.updatedAt || blog.createdAt || Date.now();
  return `
    <url>
      <loc>${baseUrl}/blog/${blog.slug}</loc>
      <lastmod>${new Date(lastMod).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `;
}).join('');

    const staticUrls = ['/', '/home', '/about', '/categories'].map((path) => `
      <url>
        <loc>${baseUrl}${path}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>
    `).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticUrls}
      ${blogUrls}
    </urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });

  } catch (error) {
    console.error('[SITEMAP ERROR]', error); // ✅ see error in terminal
    return new Response('Internal Server Error', { status: 500 });
  }
}
