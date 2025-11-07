// FILE: app/routes/($locale).[sitemap.xml].tsx
// ✅ SEO OPTIMIZED: New sitemap structure following best practices

import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

const PRODUCTS_COUNT_QUERY = `#graphql
  query ProductsCount {
    products(first: 250) {
      edges {
        node {
          id
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  
  try {
    // Count total products for pagination
    let totalProducts = 0;
    let hasNextProducts = true;
    let cursor = null;
    const itemsPerPage = 250;
    
    while (hasNextProducts) {
      const response: any = await storefront.query(`#graphql
        query ProductsPagination($first: Int!, $after: String) {
          products(first: $first, after: $after) {
            edges {
              node {
                id
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `, {
        variables: {
          first: itemsPerPage,
          after: cursor,
        },
      });
      
      totalProducts += response.products.edges.length;
      hasNextProducts = response.products.pageInfo.hasNextPage;
      cursor = response.products.pageInfo.endCursor;
    }

    // Calculate pages needed
    const productPages = Math.ceil(totalProducts / itemsPerPage);

    // ✅ NEW: SEO-optimized sitemap structure
    let sitemapEntries = '';
    
    // 1. Homepage sitemap (highest priority)
    sitemapEntries += `  <sitemap>
    <loc>${baseUrl}/sitemap/homepage/1.xml</loc>
  </sitemap>\n`;
    
    // 2. Static pages sitemap (shopping pages)
    sitemapEntries += `  <sitemap>
    <loc>${baseUrl}/sitemap/static-pages/1.xml</loc>
  </sitemap>\n`;
    
    // 3. Collections sitemap (all collections in one file)
    sitemapEntries += `  <sitemap>
    <loc>${baseUrl}/sitemap/collections/1.xml</loc>
  </sitemap>\n`;
    
    // 4. Product sitemaps (paginated)
    for (let i = 1; i <= productPages; i++) {
      sitemapEntries += `  <sitemap>
    <loc>${baseUrl}/sitemap/products/${i}.xml</loc>
  </sitemap>\n`;
    }

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}</sitemapindex>`;

    return new Response(sitemapIndex, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': `max-age=${60 * 60 * 24}`,
      },
    });
    
  } catch (error) {
    console.error('Sitemap index generation error:', error);
    
    // ✅ IMPROVED: Fallback sitemap with all sections
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${url.protocol}//${url.host}/sitemap/homepage/1.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${url.protocol}//${url.host}/sitemap/static-pages/1.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${url.protocol}//${url.host}/sitemap/collections/1.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${url.protocol}//${url.host}/sitemap/products/1.xml</loc>
  </sitemap>
</sitemapindex>`;
    
    return new Response(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': `max-age=${60 * 60 * 24}`,
      },
    });
  }
}