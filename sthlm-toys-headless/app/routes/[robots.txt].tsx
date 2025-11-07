import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {parseGid} from '@shopify/hydrogen';

/**
 * Shopify Hydrogen robots.txt - Google Merchant Center Compliant (2025)
 * 
 * CRITICAL: Google bots must access cart/checkout for price verification
 * Reference: https://support.google.com/merchants/answer/6353276
 */

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const {shop} = await context.storefront.query(ROBOTS_QUERY);

  const shopId = parseGid(shop.id).id;
  const body = robotsTxtData({url: url.origin, shopId});

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}

function robotsTxtData({url, shopId}: {shopId?: string; url?: string}) {
  const sitemapUrl = url ? `${url}/sitemap.xml` : undefined;

  return `
# Google Merchant Center Compliance (2025)
# These bots MUST access cart/checkout for price verification

User-agent: Googlebot
Disallow: /admin/
Allow: /

User-agent: Googlebot-Image
Disallow: /admin/
Allow: /

User-agent: Storebot-Google
Disallow: /admin/
Allow: /

# General bot restrictions (all other crawlers)
User-agent: *
${generalDisallowRules({sitemapUrl, shopId})}

# Google Ads Bot - Explicit allow rules for checkout verification
User-agent: adsbot-google
Disallow: /admin/
Allow: /checkouts/
Allow: /checkout
Allow: /carts
Allow: /orders
${shopId ? `Allow: /${shopId}/checkouts` : ''}
${shopId ? `Allow: /${shopId}/orders` : ''}
Allow: /*?*oseid=*
Allow: /*preview_theme_id*
Allow: /*preview_script_id*
${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}

# Block aggressive/malicious crawlers
User-agent: Nutch
Disallow: /

# SEO tool crawlers - Rate limited
User-agent: AhrefsBot
Crawl-delay: 10
${generalDisallowRules({sitemapUrl, shopId})}

User-agent: AhrefsSiteAudit
Crawl-delay: 10
${generalDisallowRules({sitemapUrl, shopId})}

User-agent: MJ12bot
Crawl-Delay: 10

User-agent: Pinterest
Crawl-delay: 1
`.trim();
}

/**
 * Standard Shopify disallow rules for non-Google bots
 * Prevents crawling of private/duplicate content
 */
function generalDisallowRules({
  shopId,
  sitemapUrl,
}: {
  shopId?: string;
  sitemapUrl?: string;
}) {
  return `Disallow: /admin
Disallow: /cart
Disallow: /orders
Disallow: /checkouts/
Disallow: /checkout
${shopId ? `Disallow: /${shopId}/checkouts` : ''}
${shopId ? `Disallow: /${shopId}/orders` : ''}
Disallow: /carts
Disallow: /account
Disallow: /collections/*sort_by*
Disallow: /*/collections/*sort_by*
Disallow: /collections/*+*
Disallow: /collections/*%2B*
Disallow: /collections/*%2b*
Disallow: /*/collections/*+*
Disallow: /*/collections/*%2B*
Disallow: /*/collections/*%2b*
Disallow: */collections/*filter*&*filter*
Disallow: /blogs/*+*
Disallow: /blogs/*%2B*
Disallow: /blogs/*%2b*
Disallow: /*/blogs/*+*
Disallow: /*/blogs/*%2B*
Disallow: /*/blogs/*%2b*
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*
Disallow: /policies/
Disallow: /*/*?*ls=*&ls=*
Disallow: /*/*?*ls%3D*%3Fls%3D*
Disallow: /*/*?*ls%3d*%3fls%3d*
Disallow: /search
Allow: /search/
Disallow: /search/?*
Disallow: /apple-app-site-association
Disallow: /.well-known/shopify/monorail
${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}`;
}

const ROBOTS_QUERY = `#graphql
  query StoreRobots($country: CountryCode, $language: LanguageCode)
   @inContext(country: $country, language: $language) {
    shop {
      id
    }
  }
` as const;