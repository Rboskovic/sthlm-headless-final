import { Analytics, getPaginationVariables } from '@shopify/hydrogen';
import { TopCategories } from '~/components/TopCategories';
import { ShopByBrand } from '~/components/ShopByBrand';
import { ShopByCharacter } from '~/components/ShopByCharacter';
import { ShopByDiscount } from '~/components/ShopByDiscount';
import { CategorySEOSection } from '~/components/CategorySEOSection';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { ProductItem } from '~/components/ProductItem';
import type { Collection } from '@shopify/hydrogen/storefront-api-types';

interface CategoryLevel1Props {
  categoryType: 'toys' | 'brands' | 'characters' | 'discounts';
  title: string;
  description?: string;
  categoriesData?: any[] | null;
  productsData?: any | null;
  seoTitle?: string;
  seoContent?: string;
  analyticsData?: {
    id: string;
    handle: string;
  };
}

export function CategoryLevel1({
  categoryType,
  title,
  description,
  categoriesData,
  productsData,
  seoTitle,
  seoContent,
  analyticsData,
}: CategoryLevel1Props) {

  const renderCategorySection = () => {
    switch (categoryType) {
      case 'toys':
        return <TopCategories collections={categoriesData} variant="collection" />;
      case 'brands':
        return <ShopByBrand brands={categoriesData} variant="collection" />;
      case 'characters':
        return <ShopByCharacter characters={categoriesData} variant="collection" />;
      case 'discounts':
        return <ShopByDiscount discounts={categoriesData} variant="collection" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Cards Section at Top */}
      {renderCategorySection()}

      {/* Page Header */}
      <div className="bg-white py-8">
        <div className="mx-auto text-center" style={{ width: '1272px', maxWidth: '100%', paddingLeft: '12px', paddingRight: '12px' }}>
          <h1 className="text-gray-900 font-bold mb-4" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', fontFamily: "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif" }}>
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '16px', lineHeight: '24px', fontFamily: "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif" }}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Products Section */}
      {productsData && (
        <div className="bg-white py-8">
          <div className="mx-auto" style={{ width: '1272px', maxWidth: '100%', paddingLeft: '12px', paddingRight: '12px' }}>
            <PaginatedResourceSection
              connection={productsData}
              resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6"
            >
              {({ node: product, index }) => (
                <div key={product.id} className="group relative">
                  <ProductItem
                    product={product}
                    loading={index < 8 ? "eager" : undefined}
                  />
                </div>
              )}
            </PaginatedResourceSection>
          </div>
        </div>
      )}

      {/* SEO Section */}
      <CategorySEOSection title={seoTitle} content={seoContent} />
      
      {/* Analytics */}
      {analyticsData && <Analytics.CollectionView data={{ collection: analyticsData }} />}
    </div>
  );
}
