import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {HelpPage} from '~/components/HelpPage';
import {getCanonicalUrlForPath} from '~/lib/canonical';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Klosslabbet | ${data?.page.title ?? ''}`},
    {
      name: 'description',
      content: data?.page.seo?.description || data?.page.title || 'Klosslabbet - information och hjälp',
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: getCanonicalUrlForPath(`/pages/${data?.page.handle}`),
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const isHelpPage = params.handle === 'hjalp';

  if (isHelpPage) {
    // Special handling for help page - fetch extra data
    const [{page}, {shop}] = await Promise.all([
      context.storefront.query(HELP_PAGE_QUERY, {
        variables: {
          handle: params.handle,
        },
      }),
      context.storefront.query(SHOP_CONTACT_QUERY),
    ]);

    if (!page) {
      throw new Response('Not Found', {status: 404});
    }

    redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

    return {
      page,
      contactInfo: shop,
    };
  } else {
    // Regular page handling
    const [{page}] = await Promise.all([
      context.storefront.query(PAGE_QUERY, {
        variables: {
          handle: params.handle,
        },
      }),
    ]);

    if (!page) {
      throw new Response('Not Found', {status: 404});
    }

    redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

    return {
      page,
    };
  }
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Page() {
  const data = useLoaderData<typeof loader>();
  const {page} = data;

  // Special rendering for help page
  if (page.handle === 'hjalp') {
    return (
      <HelpPage 
        helpPage={page} 
        contactInfo={data.contactInfo}
      />
    );
  }

  // Default page rendering
  return (
    <div className="page">
      <main dangerouslySetInnerHTML={{__html: page.body}} />
    </div>
  );
}

// Regular page query
const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;

// Help page query with metafields
const HELP_PAGE_QUERY = `#graphql
  query HelpPage(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
      metafields(identifiers: [
        {namespace: "custom", key: "faq_items"}
      ]) {
        key
        value
        type
      }
    }
  }
` as const;

// Shop contact query for help page
const SHOP_CONTACT_QUERY = `#graphql
  query ShopContact($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      id
      name
      metafields(identifiers: [
        {namespace: "custom", key: "support_email"},
        {namespace: "custom", key: "support_phone"}
      ]) {
        key
        value
      }
    }
  }
` as const;