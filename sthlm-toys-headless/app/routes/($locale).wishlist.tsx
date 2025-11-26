// FILE: app/routes/($locale).wishlist.tsx
// ✅ UPDATED: Now uses POPULAR_COLLECTIONS_QUERY instead of MOBILE_MENU_COLLECTIONS_QUERY

import { type MetaFunction, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from 'react-router';
import { useSessionWishlist } from '~/hooks/useSessionWishlist';
import { ProductItem } from '~/components/ProductItem';
import { WishlistHeader } from '~/components/WishlistHeader';
import { WishlistEmpty } from '~/components/WishlistEmpty';
import { POPULAR_COLLECTIONS_QUERY } from '~/lib/fragments';
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

// ✅ NEW: Helper to extract collections from metaobject
function extractPopularCollections(metaobjects: any): any[] {
  if (!metaobjects?.nodes?.[0]?.fields) return [];
  
  const fields = metaobjects.nodes[0].fields;
  const collectionsField = fields.find((f: any) => f.key === 'kolekcija');
  
  if (!collectionsField?.references?.nodes) return [];
  
  return collectionsField.references.nodes;
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;

  // ✅ UPDATED: Load collections from popular_collections metaobject
  const popularCollectionsData = await storefront.query(POPULAR_COLLECTIONS_QUERY, {
    cache: storefront.CacheLong(),
  });

  // ✅ NEW: Extract collections from metaobject
  const popularCollections = extractPopularCollections(
    popularCollectionsData?.popularCollections
  );

  return {
    popularCollections,
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

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item, index) => {
          // Transform WishlistItem to match ProductItem expectations
          const transformedProduct = {
            ...item,
            featuredImage: item.featuredImage ? {
              url: item.featuredImage.url,
              altText: item.featuredImage.altText || undefined,
              id: '',
              width: 300,
              height: 300,
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