import { redirect, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import {
  useLoaderData,
  type MetaFunction,
  Link,
  useSearchParams,
  useNavigation,
} from "react-router";
import { getPaginationVariables, Analytics } from "@shopify/hydrogen";
import { PaginatedResourceSection } from "~/components/PaginatedResourceSection";
// import {redirectIfHandleIsLocalized} from '~/lib/redirect'; // Disabled during debugging
import { ProductItem } from "~/components/ProductItem";
import { useState, useMemo } from "react";
import { ChevronRight, SlidersHorizontal, Search, Heart } from "lucide-react";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.collection.title ?? ""} | STHLM Toys & Games` }];
};

export async function loader({ context, params, request }: LoaderFunctionArgs) {
  // Fetch below-the-fold data without blocking TTFB
  const deferredData = loadDeferredData({ context });
  // Fetch above-the-fold data
  const criticalData = await loadCriticalData({ context, params, request });
  return { ...deferredData, ...criticalData };
}

async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw redirect("/collections");
  }

  // Parse URL
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Build filters
  const filters: any[] = [];
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    filters.push({
      price: {
        min: minPrice ? parseFloat(minPrice) : undefined,
        max: maxPrice ? parseFloat(maxPrice) : undefined,
      },
    });
  }
  searchParams
    .getAll("vendor")
    .forEach((v) => filters.push({ productVendor: v }));
  searchParams.getAll("tag").forEach((t) => filters.push({ productTag: t }));
  searchParams
    .getAll("productType")
    .forEach((t) => filters.push({ productType: t }));
  const availability = searchParams.get("availability");
  if (availability) filters.push({ available: availability === "true" });

  // Sorting
  const sortKey = searchParams.get("sortKey") || "BEST_SELLING";
  const reverse = searchParams.get("reverse") === "true";

  // Pagination
  const pagination = getPaginationVariables(request, { pageBy: 12 });

  // Locale
  const country = storefront.i18n?.country;
  const language = storefront.i18n?.language;

  // Query
  let collection: any = null;
  try {
    const result = await storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        country,
        language,
        filters: filters.length ? filters : undefined,
        sortKey,
        reverse,
        ...pagination,
      },
    });
    collection = result.collection;
    console.log(
      "→ request handle:",
      handle,
      "→ API handle:",
      collection?.handle
    );
  } catch (error) {
    console.error("GraphQL error loading collection:", error);
  }

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, { status: 404 });
  }

  // redirectIfHandleIsLocalized(request, {handle, data: collection}); // re-enable after debug

  return {
    collection,
    appliedFilters: {
      minPrice,
      maxPrice,
      brands: searchParams.getAll("vendor"),
      tags: searchParams.getAll("tag"),
      types: searchParams.getAll("productType"),
      availability,
      sortKey,
      reverse,
    },
  };
}

function loadDeferredData({ context }: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const { collection, appliedFilters } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Translations
  const t = {
    filters: "Filter",
    category: "Kategori",
    age: "Ålder",
    price: "Pris",
    brand: "Märke",
    availability: "Tillgänglighet",
    inStock: "I lager",
    outOfStock: "Slut i lager",
    sortBy: "Sortera efter",
    bestsellers: "Bästsäljare",
    priceLowest: "Pris: Lägst till högst",
    priceHighest: "Pris: Högst till lägst",
    newest: "Nyast",
    products: "Produkter",
    showMore: "Visa mer",
    searchCategory: "Sök kategori",
    searchBrand: "Sök märke",
    loading: "Laddar produkter...",
  };

  // Sort options
  const sortOptions = [
    { value: "BEST_SELLING|false", label: t.bestsellers },
    { value: "PRICE|false", label: t.priceLowest },
    { value: "PRICE|true", label: t.priceHighest },
    { value: "CREATED_AT|true", label: t.newest },
  ];
  const handleSortChange = (v: string) => {
    const [key, rev] = v.split("|");
    const p = new URLSearchParams(searchParams);
    p.set("sortKey", key);
    p.set("reverse", rev);
    setSearchParams(p);
  };

  // Filter change
  const handleFilterChange = (
    type: string,
    value: string,
    checked: boolean
  ) => {
    const p = new URLSearchParams(searchParams);
    if (checked) p.append(type, value);
    else {
      const all = p.getAll(type).filter((v) => v !== value);
      p.delete(type);
      all.forEach((v) => p.append(type, v));
    }
    setSearchParams(p);
  };

  const apiFilters = collection.products.filters || [];

  // Categories
  const categories = useMemo(() => {
    const f = apiFilters.find(
      (f) =>
        f.id.includes("product_type") ||
        f.label.toLowerCase().includes("kategori")
    );
    if (f)
      return f.values.map((v) => ({
        label: v.label,
        value: v.label,
        count: v.count,
      }));
    return [
      { label: "LEGO", value: "lego", count: 245 },
      {
        label: "Action Figures & Playsets",
        value: "action-figures-playsets",
        count: 189,
      },
      { label: "Dolls", value: "dolls", count: 156 },
    ];
  }, [apiFilters]);

  // Age groups
  const ageGroups = [
    { label: "0 - 6 månader", value: "0-6-months", count: 4 },
    { label: "6 - 18 månader", value: "6-18-months", count: 6 },
    { label: "18 - 36 månader", value: "18-36-months", count: 16 },
    { label: "3 - 5 år", value: "3-5-years", count: 962 },
    { label: "6 - 8 år", value: "6-8-years", count: 76 },
  ];

  // Price ranges
  const priceRanges = useMemo(() => {
    const f = apiFilters.find((f) => f.id.includes("price"));
    if (f)
      return f.values.map((v) => ({
        label: v.label,
        min: JSON.parse(v.input)?.price?.min,
        max: JSON.parse(v.input)?.price?.max,
        count: v.count,
      }));
    return [
      { label: "SEK 0 - SEK 99", min: 0, max: 99, count: 563 },
      { label: "SEK 100 - SEK 199", min: 100, max: 199, count: 606 },
      { label: "SEK 200 - SEK 499", min: 200, max: 499, count: 331 },
      { label: "SEK 500 - SEK 699", min: 500, max: 699, count: 37 },
      { label: "SEK 700 - SEK 999", min: 700, max: 999, count: 13 },
    ];
  }, [apiFilters]);

  // Brands
  const brands = useMemo(() => {
    const f = apiFilters.find((f) => f.id.includes("vendor"));
    if (f)
      return f.values.map((v) => ({
        label: v.label,
        value: v.label,
        count: v.count,
      }));
    return [
      { label: "Adopt Me", value: "adopt-me", count: 14 },
      { label: "Aquabeads", value: "aquabeads", count: 1 },
      { label: "Avatar", value: "avatar", count: 20 },
      { label: "Batman", value: "batman", count: 32 },
      { label: "DC", value: "dc", count: 25 },
    ];
  }, [apiFilters]);

  // Product count
  const totalProducts = collection.products.nodes.length;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Blue banner */}
      <div className="bg-gradient-to-b from-blue-500 to-blue-600 h-3"></div>
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-blue-600 hover:underline">
              Toys
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-600">{collection.title}</span>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {collection.title}
          </h1>
          {/* Mobile controls */}
          <div className="flex items-center justify-between lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg"
            >
              <SlidersHorizontal size={20} />
              <span>{t.filters}</span>
            </button>
            <select
              value={`${appliedFilters.sortKey}|${appliedFilters.reverse}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {/* Desktop controls */}
          <div className="hidden lg:flex items-center justify-between">
            <p className="text-gray-600">
              {totalProducts} {t.products}
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{t.sortBy}</span>
              <select
                value={`${appliedFilters.sortKey}|${appliedFilters.reverse}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t.filters}
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <FilterSection
                  title={t.category}
                  searchPlaceholder={t.searchCategory}
                >
                  {categories.map((c) => (
                    <FilterOption
                      key={c.value}
                      label={c.label}
                      count={c.count}
                      checked={appliedFilters.types.includes(c.value)}
                      onChange={(chk) =>
                        handleFilterChange("productType", c.value, chk)
                      }
                    />
                  ))}
                </FilterSection>
                <FilterSection title={t.age}>
                  {ageGroups.map((a) => (
                    <FilterOption
                      key={a.value}
                      label={a.label}
                      count={a.count}
                      checked={appliedFilters.tags.includes(a.value)}
                      onChange={(chk) =>
                        handleFilterChange("tag", a.value, chk)
                      }
                    />
                  ))}
                </FilterSection>
                <FilterSection title={t.price}>
                  {priceRanges.map((r) => (
                    <FilterOption
                      key={r.label}
                      label={r.label}
                      count={r.count}
                      checked={
                        appliedFilters.minPrice === String(r.min) &&
                        appliedFilters.maxPrice === String(r.max)
                      }
                      onChange={(chk) => {
                        const p = new URLSearchParams(searchParams);
                        chk
                          ? (p.set("minPrice", String(r.min)),
                            p.set("maxPrice", String(r.max)))
                          : (p.delete("minPrice"), p.delete("maxPrice"));
                        setSearchParams(p);
                      }}
                    />
                  ))}
                </FilterSection>
                <FilterSection
                  title={t.brand}
                  searchPlaceholder={t.searchBrand}
                >
                  {brands.map((b) => (
                    <FilterOption
                      key={b.value}
                      label={b.label}
                      count={b.count}
                      checked={appliedFilters.brands.includes(b.value)}
                      onChange={(chk) =>
                        handleFilterChange("vendor", b.value, chk)
                      }
                    />
                  ))}
                </FilterSection>
              </div>
            </div>
          </div>
          {/* Mobile overlay */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
              <div className="bg-white w-full max-w-sm h-full overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t.filters}
                  </h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <span className="text-xl text-gray-500">×</span>
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <FilterSection
                    title={t.category}
                    searchPlaceholder={t.searchCategory}
                  >
                    {categories.map((c) => (
                      <FilterOption
                        key={c.value}
                        label={c.label}
                        count={c.count}
                        checked={appliedFilters.types.includes(c.value)}
                        onChange={(chk) => {
                          handleFilterChange("productType", c.value, chk);
                          if (chk) setShowMobileFilters(false);
                        }}
                      />
                    ))}
                  </FilterSection>
                  <FilterSection title={t.age}>
                    {ageGroups.map((a) => (
                      <FilterOption
                        key={a.value}
                        label={a.label}
                        count={a.count}
                        checked={appliedFilters.tags.includes(a.value)}
                        onChange={(chk) =>
                          handleFilterChange("tag", a.value, chk)
                        }
                      />
                    ))}
                  </FilterSection>
                  <FilterSection title={t.price}>
                    {priceRanges.map((r) => (
                      <FilterOption
                        key={r.label}
                        label={r.label}
                        count={r.count}
                        checked={
                          appliedFilters.minPrice === String(r.min) &&
                          appliedFilters.maxPrice === String(r.max)
                        }
                        onChange={(chk) => {
                          const p = new URLSearchParams(searchParams);
                          chk
                            ? (p.set("minPrice", String(r.min)),
                              p.set("maxPrice", String(r.max)))
                            : (p.delete("minPrice"), p.delete("maxPrice"));
                          setSearchParams(p);
                          setShowMobileFilters(false);
                        }}
                      />
                    ))}
                  </FilterSection>
                  <FilterSection
                    title={t.brand}
                    searchPlaceholder={t.searchBrand}
                  >
                    {brands.map((b) => (
                      <FilterOption
                        key={b.value}
                        label={b.label}
                        count={b.count}
                        checked={appliedFilters.brands.includes(b.value)}
                        onChange={(chk) => {
                          handleFilterChange("vendor", b.value, chk);
                          if (chk) setShowMobileFilters(false);
                        }}
                      />
                    ))}
                  </FilterSection>
                </div>
              </div>
            </div>
          )}
          {/* Products grid */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                {navigation.state === "loading" ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                    <p className="mt-2 text-gray-600">{t.loading}</p>
                  </div>
                ) : (
                  <PaginatedResourceSection
                    connection={collection.products}
                    resourcesClassName="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                  >
                    {({ node: product, index }) => (
                      <div key={product.id} className="group relative">
                        <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all hover:scale-110">
                          <Heart
                            size={18}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          />
                        </button>
                        <ProductItem
                          product={product}
                          loading={index < 6 ? "eager" : undefined}
                        />
                      </div>
                    )}
                  </PaginatedResourceSection>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Analytics.CollectionView
        data={{ collection: { id: collection.id, handle: collection.handle } }}
      />
    </div>
  );
}

function FilterSection({
  title,
  children,
  searchPlaceholder,
}: {
  title: string;
  children: React.ReactNode;
  searchPlaceholder?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-4"
      >
        <span>{title}</span>
        <ChevronRight
          size={16}
          className={`transform transition-transform ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </button>
      {isExpanded && (
        <div className="space-y-3">
          {searchPlaceholder && (
            <div className="relative mb-4">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <Search
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
            </div>
          )}
          <div className="space-y-2">{children}</div>
        </div>
      )}
    </div>
  );
}

function FilterOption({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700 group-hover:text-gray-900">
          {label}
        </span>
      </div>
      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full min-w-[24px] text-center">
        {count}
      </span>
    </label>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 { amount currencyCode }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage { id altText url width height }
    priceRange { minVariantPrice {...MoneyProductItem} maxVariantPrice {...MoneyProductItem} }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        nodes { ...ProductItem }
        pageInfo { hasPreviousPage hasNextPage endCursor startCursor }
        filters { id label type values { id label count input } }
      }
    }
  }
`;
