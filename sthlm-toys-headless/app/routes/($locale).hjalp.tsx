import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {HelpPage} from '~/components/HelpPage';

export const meta: MetaFunction = () => {
  return [{title: 'Hjälp & Support | STHLM Toys & Games'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  try {
    // Fetch FAQ data and shop contact information
    const [pageData, shopData] = await Promise.all([
      storefront.query(HELP_PAGE_QUERY),
      storefront.query(SHOP_CONTACT_QUERY),
    ]);

    return {
      helpPage: pageData.page,
      contactInfo: shopData.shop,
    };
  } catch (error) {
    console.error('Error loading help page:', error);
    return {
      helpPage: null,
      contactInfo: null,
    };
  }
}

export default function Help() {
  const data = useLoaderData<typeof loader>();

  return <HelpPage helpPage={data.helpPage} contactInfo={data.contactInfo} />;
}

// Query to fetch help page content with FAQ metafields
const HELP_PAGE_QUERY = `#graphql
  query HelpPage($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    page(handle: "hjalp") {
      id
      title
      body
      handle
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

// Query to fetch shop contact information
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
