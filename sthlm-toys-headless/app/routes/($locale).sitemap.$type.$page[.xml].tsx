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
  
  let allItems: any[] = [];
  let hasNextPage = true;
  let cursor = null;
  let query: string;
  let urlPrefix: string;
  
  // Determine query and URL prefix based on type
  switch (type) {
    case 'collections':
      query = STOREFRONT_COLLECTIONS_QUERY;
      urlPrefix = 'collections';
      break;
    case 'pages':
    case 'blogs':
      // Return empty sitemap for unsupported types
      const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
      return new Response(emptySitemap, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    case 'products':
    default:
      query = STOREFRONT_PRODUCTS_QUERY;
      urlPrefix = 'products';
      break;
  }
  
  try {
    // Fetch all items with pagination
    while (hasNextPage) {
      const response = await storefront.query(query, {
        variables: {
          first: itemsPerPage,
          after: cursor,
        },
      });
      
      const dataKey = type === 'collections' ? 'collections' : 'products';
      const items = response[dataKey].edges.map((edge: any) => edge.node);
      allItems = [...allItems, ...items];
      
      hasNextPage = response[dataKey].pageInfo.hasNextPage;
      cursor = response[dataKey].pageInfo.endCursor;
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = allItems.slice(startIndex, endIndex);
    
    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageItems
  .map((item) => {
    const lastmod = new Date(item.updatedAt).toISOString().split('T')[0];
    return `  <url>
    <loc>https://www.klosslabbet.se/${urlPrefix}/${item.handle}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
    
  } catch (error) {
    console.error(`Sitemap generation error for ${type}:`, error);
    
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
}