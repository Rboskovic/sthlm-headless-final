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

const COLLECTIONS_COUNT_QUERY = `#graphql
  query CollectionsCount {
    collections(first: 250) {
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
    // Get counts for products and collections
    const [productsResponse, collectionsResponse] = await Promise.all([
      storefront.query(PRODUCTS_COUNT_QUERY),
      storefront.query(COLLECTIONS_COUNT_QUERY)
    ]);

    // Calculate total items and pages needed
    const itemsPerPage = 250;
    
    // Count products (fetch all to get accurate count)
    let totalProducts = 0;
    let hasNextProducts = true;
    let cursor = null;
    
    while (hasNextProducts) {
      const response = await storefront.query(`#graphql
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

    // Count collections (usually fewer, so simpler approach)
    const totalCollections = collectionsResponse.collections.edges.length;
    
    // Calculate pages needed
    const productPages = Math.ceil(totalProducts / itemsPerPage);
    const collectionPages = Math.max(1, Math.ceil(totalCollections / itemsPerPage));

    // Generate sitemap index XML
    let sitemapEntries = '';
    
    // Add product sitemaps
    for (let i = 1; i <= productPages; i++) {
      sitemapEntries += `  <sitemap>
    <loc>${baseUrl}/sitemap/products/${i}.xml</loc>
  </sitemap>\n`;
    }
    
    // Add collection sitemaps
    for (let i = 1; i <= collectionPages; i++) {
      sitemapEntries += `  <sitemap>
    <loc>${baseUrl}/sitemap/collections/${i}.xml</loc>
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
    
    // Fallback sitemap index with basic structure
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${url.protocol}//${url.host}/sitemap/products/1.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${url.protocol}//${url.host}/sitemap/collections/1.xml</loc>
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