import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSitemap} from '@shopify/hydrogen';

export async function loader({
  request,
  params,
  context: {storefront},
}: LoaderFunctionArgs) {
  // Your STHLM-TOYS-HEADLESS publication ID
  const publicationId = 'gid://shopify/Publication/290034581883';
  
  const response = await getSitemap({
    storefront,
    request,
    params,
    locales: ['SV-SE'],
    getLink: ({type, baseUrl, handle, locale}) => {
      return `${baseUrl}/${type}/${handle}`;
    },
    // Custom query variables for products
    queryVariables: params.type === 'products' ? {
      publicationId: publicationId
    } : undefined,
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}