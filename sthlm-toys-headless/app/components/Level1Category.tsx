import { Analytics } from "@shopify/hydrogen";
import { TopCategories } from "~/components/TopCategories";
import { ShopByBrand } from "~/components/ShopByBrand";
import { ShopByCharacter } from "~/components/ShopByCharacter";
import { ShopByDiscount } from "~/components/ShopByDiscount";
import { CategorySEOSection } from "~/components/CategorySEOSection";
import type { Collection } from "@shopify/hydrogen/storefront-api-types";

interface UnifiedLevel1CategoryProps {
  // Category type determines which component to show at top
  categoryType: "toys" | "brands" | "characters" | "discounts";

  // Page data
  title: string;
  description?: string;

  // Category cards data (eventually from mega menu)
  categoriesData?: Collection[] | null;

  // SEO content
  seoTitle?: string;
  seoContent?: string;

  // Analytics data
  analyticsData?: {
    id: string;
    handle: string;
  };
}

export function UnifiedLevel1Category({
  categoryType,
  title,
  description,
  categoriesData,
  seoTitle,
  seoContent,
  analyticsData,
}: UnifiedLevel1CategoryProps) {
  // Render the appropriate category component at top
  const renderCategorySection = () => {
    switch (categoryType) {
      case "toys":
        return <TopCategories collections={categoriesData} />;
      case "brands":
        return <ShopByBrand brands={categoriesData} />;
      case "characters":
        return <ShopByCharacter characters={categoriesData} />;
      case "discounts":
        return <ShopByDiscount discounts={categoriesData} />;
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
        <div
          className="mx-auto text-center"
          style={{
            width: "1272px",
            maxWidth: "100%",
            paddingLeft: "12px",
            paddingRight: "12px",
          }}
        >
          <h1
            className="text-gray-900 font-bold mb-4"
            style={{
              fontSize: "28px",
              fontWeight: 700,
              lineHeight: "36px",
              fontFamily:
                "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              className="text-gray-600 max-w-2xl mx-auto"
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                fontFamily:
                  "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Note: Products handled by Shopify Search & Discovery app */}
      <div className="bg-white py-8">
        <div
          className="mx-auto text-center"
          style={{
            width: "1272px",
            maxWidth: "100%",
            paddingLeft: "12px",
            paddingRight: "12px",
          }}
        >
          <p className="text-gray-600 text-lg">
            Produkter och filter kommer att hanteras av Shopify Search &
            Discovery app
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Denna sektion kommer att visa alla {title.toLowerCase()} produkter
            med filter
          </p>
        </div>
      </div>

      {/* SEO Section */}
      <CategorySEOSection title={seoTitle} content={seoContent} />

      {/* Analytics */}
      {analyticsData && (
        <Analytics.CollectionView data={{ collection: analyticsData }} />
      )}
    </div>
  );
}
