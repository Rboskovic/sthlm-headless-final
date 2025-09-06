import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

const PRODUCTS_SITEMAP_QUERY = `#graphql
  query ProductsSitemap($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          handle
          updatedAt
          publishedOnPublication(publicationId: "gid://shopify/Publication/290034581883")
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
  const url = new URL(request.url);
  const page = params.page ? parseInt(params.page) : 1;
  const productsPerPage = 250;
  
  let allProducts: any[] = [];
  let hasNextPage = true;
  let cursor = null;
  
  try {
    // Fetch all products and filter by publication
    while (hasNextPage) {
      const response = await storefront.query(PRODUCTS_SITEMAP_QUERY, {
        variables: {
          first: productsPerPage,
          after: cursor,
        },
      });
      
      // Filter only products published to your STHLM-TOYS-HEADLESS publication
      const publishedProducts = response.products.edges
        .filter((edge: any) => edge.node.publishedOnPublication === true)
        .map((edge: any) => edge.node);
      
      allProducts = [...allProducts, ...publishedProducts];
      
      hasNextPage = response.products.pageInfo.hasNextPage;
      cursor = response.products.pageInfo.endCursor;
    }
    
    // Calculate pagination for this sitemap page
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = allProducts.slice(startIndex, endIndex);
    
    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageProducts
  .map((product) => {
    const lastmod = new Date(product.updatedAt).toISOString().split('T')[0];
    return `  <url>
    <loc>https://www.klosslabbet.se/products/${product.handle}</loc>
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
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
    
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // Return empty sitemap on error
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
    
    return new Response(emptySitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Shorter cache on error
      },
    });
  }
}
