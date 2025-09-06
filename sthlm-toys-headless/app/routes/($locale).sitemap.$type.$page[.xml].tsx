import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSitemap} from '@shopify/hydrogen';

export async function loader({
  request,
  params,
  context: {storefront},
}: LoaderFunctionArgs) {
  const response = await getSitemap({
    storefront,
    request,
    params,
    locales: ['SV-SE'], // Swedish locale
    getLink: ({type, baseUrl, handle, locale}) => {
      // Simplified - no locale in URL since you're single-language
      return `${baseUrl}/${type}/${handle}`;
    },
    // Add publication filtering for products
    ...(params.type === 'products' && {
      query: {
        // Filter products by your STHLM-TOYS-HEADLESS publication
        publishedOnPublication: 'gid://shopify/Publication/290034581883'
      }
    })
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}