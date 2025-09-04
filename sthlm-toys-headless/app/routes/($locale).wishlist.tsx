// app/routes/($locale).wishlist.tsx
// ✅ FIXED: Load collections data for WishlistEmpty like cart and mobile menu do

import { type MetaFunction, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from 'react-router';
import { useSessionWishlist } from '~/hooks/useSessionWishlist';
import { ProductItem } from '~/components/ProductItem';
import { WishlistHeader } from '~/components/WishlistHeader';
import { WishlistEmpty } from '~/components/WishlistEmpty';

export const meta: MetaFunction = () => [
  { title: 'Min Önskelista | STHLM Toys & Games' },
  { name: 'description', content: 'Dina sparade favoritprodukter' }
];

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;

  // ✅ ADDED: Load collections data like cart and mobile menu do
  const { collections } = await storefront.query(MOBILE_MENU_COLLECTIONS_QUERY, {
    variables: {
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return {
    popularCollections: collections.nodes,
  };
}

export default function WishlistPage() {
  const { popularCollections } = useLoaderData<typeof loader>();
  const {
    wishlistItems,
    isLoading,
    wishlistCount,
    clearWishlist,
    createShareableLink,
    shareWishlist,
    copyShareLink
  } = useSessionWishlist();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (wishlistCount === 0) {
    // ✅ FIXED: Pass collections data to WishlistEmpty
    return <WishlistEmpty popularCollections={popularCollections} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <WishlistHeader 
        count={wishlistCount}
        onClear={clearWishlist}
        onShare={shareWishlist}
        onCopyLink={copyShareLink}
        createShareableLink={createShareableLink}
      />
      
      {/* ✅ Use ProductItem instead of custom grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item, index) => (
          <ProductItem
            key={`${item.id}-${item.variantId || 'default'}-${index}`}
            product={item}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

// ✅ ADDED: Same collections query used by cart and mobile menu
const MOBILE_MENU_COLLECTIONS_QUERY = `#graphql
  query MobileMenuCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 75, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        image {
          id
          url
          altText
          width
          height
        }
        metafields(identifiers: [
          {namespace: "custom", key: "mobile_menu_featured"},
          {namespace: "custom", key: "mobile_menu_image"}
        ]) {
          key
          value
          namespace
        }
      }
    }
  }
` as const;