// FILE: app/routes/($locale).sitemap.$type.$page[.xml].tsx
// ✅ SEO OPTIMIZED: Updated handler for new sitemap structure

import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

const STOREFRONT_PRODUCTS_QUERY = `#graphql
  query StorefrontProductsSitemap($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          handle
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const STOREFRONT_COLLECTIONS_QUERY = `#graphql
  query StorefrontCollectionsSitemap($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      edges {
        node {
          id
          handle
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export async function loader({
  request,
  params,
  context: {storefront},
}: LoaderFunctionArgs) {
  const type = params.type || 'products';
  const page = params.page ? parseInt(params.page) : 1;
  const itemsPerPage = 250;
  
  // ✅ NEW: Handle homepage sitemap (when type=homepage and page=1)
  if (type === 'homepage' && page === 1) {
    const homepageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.klosslabbet.se/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(homepageSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // ✅ NEW: Handle static pages sitemap (when type=static-pages and page=1)
  if (type === 'static-pages' && page === 1) {
    const staticPages = [
      {
        handle: 'themes',
        lastmod: new Date().toISOString().split('T')[0],
        priority: '0.8',
        changefreq: 'weekly'
      },
      {
        handle: 'handla-efter-pris',
        lastmod: new Date().toISOString().split('T')[0], 
        priority: '0.8',
        changefreq: 'weekly'
      },
      {
        handle: 'ages',
        lastmod: new Date().toISOString().split('T')[0],
        priority: '0.8', 
        changefreq: 'weekly'
      },
      {
        handle: 'search',
        lastmod: new Date().toISOString().split('T')[0],
        priority: '0.6',
        changefreq: 'daily'
      },
      {
        handle: 'pages/hjalp',
        lastmod: new Date().toISOString().split('T')[0],
        priority: '0.5',
        changefreq: 'monthly'
      }
    ];

    const staticPagesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map((page) => {
    return `  <url>
    <loc>https://www.klosslabbet.se/${page.handle}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

    return new Response(staticPagesSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // ✅ UPDATED: Handle collections sitemap with priority collections
  if (type === 'collections' && page === 1) {
    let allCollections: any[] = [];
    let hasNextPage = true;
    let cursor = null;
    
    // ✅ HIGH PRIORITY COLLECTIONS
    const highPriorityCollections = [
      'lego-prylar',
      'alla-erbjudanden', 
      'for-vuxna-experter',
      'for-de-yngsta',
      'film-tv-spel'
    ];
    
    // Fetch all collections
    while (hasNextPage) {
      const response: any = await storefront.query(STOREFRONT_COLLECTIONS_QUERY, {
        variables: {
          first: itemsPerPage,
          after: cursor,
        },
      });
      
      const collections = response.collections.edges.map((edge: any) => edge.node);
      allCollections = [...allCollections, ...collections];
      
      hasNextPage = response.collections.pageInfo.hasNextPage;
      cursor = response.collections.pageInfo.endCursor;
    }
    
    const collectionsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allCollections
  .map((collection) => {
    const lastmod = new Date(collection.updatedAt).toISOString().split('T')[0];
    // ✅ DYNAMIC PRIORITY: Higher for important collections
    const priority = highPriorityCollections.includes(collection.handle) ? '0.9' : '0.7';
    
    return `  <url>
    <loc>https://www.klosslabbet.se/collections/${collection.handle}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

    return new Response(collectionsSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
  
  // ✅ EXISTING: Handle products sitemap (paginated)
  if (type === 'products') {
    let allProducts: any[] = [];
    let hasNextPage = true;
    let cursor = null;
    
    // Fetch all products
    while (hasNextPage) {
      const response: any = await storefront.query(STOREFRONT_PRODUCTS_QUERY, {
        variables: {
          first: itemsPerPage,
          after: cursor,
        },
      });
      
      const products = response.products.edges.map((edge: any) => edge.node);
      allProducts = [...allProducts, ...products];
      
      hasNextPage = response.products.pageInfo.hasNextPage;
      cursor = response.products.pageInfo.endCursor;
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = allProducts.slice(startIndex, endIndex);
    
    const productsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageProducts
  .map((product) => {
    const lastmod = new Date(product.updatedAt).toISOString().split('T')[0];
    return `  <url>
    <loc>https://www.klosslabbet.se/products/${product.handle}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

    return new Response(productsSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // ✅ FALLBACK: Return empty sitemap for unknown types
  const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
  
  return new Response(emptySitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}