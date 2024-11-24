exports.handler = async (event, context) => {
    const sitemap = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://lopezmarquezabogados.com/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>https://lopezmarquezabogados.com/about.html</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>https://lopezmarquezabogados.com/contact.html</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>https://lopezmarquezabogados.com/servicios.html</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.7</priority>
      </url>
    </urlset>
    `;
  
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml",
      },
      body: sitemap,
    };
  };
  