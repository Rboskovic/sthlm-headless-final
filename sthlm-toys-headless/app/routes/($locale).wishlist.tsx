// FILE: app/routes/($locale).wishlist.tsx
// ✅ FIXED: Load collections data for WishlistEmpty like cart and mobile menu do
// ✅ FIXED: Removed duplicate query, now imports from fragments.ts
// ✅ FIXED: TypeScript type issues

import { type MetaFunction, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from 'react-router';
import { useSessionWishlist } from '~/hooks/useSessionWishlist';
import { ProductItem } from '~/components/ProductItem';
import { WishlistHeader } from '~/components/WishlistHeader';
import { WishlistEmpty } from '~/components/WishlistEmpty';
import { MOBILE_MENU_COLLECTIONS_QUERY } from '~/lib/fragments';
import { getCanonicalUrlForPath } from '~/lib/canonical';

export const meta: MetaFunction = () => [
  { title: 'Min Önskelista | Klosslabbet' },
  { name: 'description', content: 'Dina sparade favoritprodukter' },
  {
    tagName: 'link',
    rel: 'canonical',
    href: getCanonicalUrlForPath('/wishlist'),
  },
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
    copyShareLink,
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
    // ✅ FIXED: Type assertion for collections data
    return <WishlistEmpty popularCollections={popularCollections as any} />;
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
        {wishlistItems.map((item, index) => {
          // ✅ FIXED: Transform WishlistItem to match ProductItem expectations
          const transformedProduct = {
            ...item,
            featuredImage: item.featuredImage ? {
              url: item.featuredImage.url,
              altText: item.featuredImage.altText || undefined, // Convert null to undefined
              id: '', // WishlistItem doesn't have id, provide default
              width: 300, // WishlistItem doesn't have width, provide default
              height: 300, // WishlistItem doesn't have height, provide default
            } : null,
          };

          return (
            <ProductItem
              key={`${item.id}-${item.variantId || 'default'}-${index}`}
              product={transformedProduct as any}
              loading="lazy"
            />
          );
        })}
      </div>
    </div>
  );
}