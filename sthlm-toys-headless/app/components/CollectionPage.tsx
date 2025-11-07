import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { Analytics } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { ProductItem } from '~/components/ProductItem';
import { ChevronRight, Home, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import type { Collection, Product } from '@shopify/hydrogen/storefront-api-types';

interface CollectionPageProps {
  collection: Collection;
  products: any;
  totalProductCount: number;
  filteredTotalCount?: number; // ✅ NEW: Actual filtered total count
  appliedFilters?: any;
  sortKey?: string;
}

export function CollectionPage({
  collection,
  products,
  totalProductCount,
  filteredTotalCount,
  appliedFilters = {},
  sortKey = 'BEST_SELLING'
}: CollectionPageProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ FIXED: Use actual filtered total count from API
  const hasActiveFilters = Array.from(searchParams.keys()).some(key => 
    !['sort_by', '_routes'].includes(key)
  );
  
  // Use the filtered total count from the API, or fall back to total
  const displayProductCount = hasActiveFilters && filteredTotalCount !== undefined 
    ? filteredTotalCount 
    : totalProductCount;

  // ✅ SWEDISH: Product count text function
  const getProductCountText = (count: number, hasFilters: boolean, total: number) => {
    const productText = count === 1 ? 'produkt' : 'produkter';
    
    if (hasFilters && filteredTotalCount !== undefined) {
      return (
        <>
          <span className="text-lg font-medium">
            {count} {productText}
          </span>
          <span className="text-sm text-gray-500 ml-2">
            (filtrerade från {total})
          </span>
        </>
      );
    }
    
    return (
      <span className="text-lg font-medium">
        {count} {productText}
      </span>
    );
  };

  // Sort options in Swedish
  const sortOptions = [
    { label: 'Bäst säljande', value: 'BEST_SELLING' },
    { label: 'Alfabetisk: A-Ö', value: 'TITLE' },
    { label: 'Alfabetisk: Ö-A', value: 'TITLE_REVERSE' },
    { label: 'Pris: Låg till hög', value: 'PRICE' },
    { label: 'Pris: Hög till låg', value: 'PRICE_REVERSE' },
    { label: 'Datum: Nyast först', value: 'CREATED_REVERSE' },
    { label: 'Datum: Äldst först', value: 'CREATED' },
  ];

  // ✅ CLEAN: Extract filters from Shopify API response
  const shopifyFilters = products?.filters || [];
  
  // ✅ CLEAN: Find specific filters by ID/label
  const themesFilter = shopifyFilters.find((filter: any) => 
    filter.id?.includes('themes') || filter.label?.toLowerCase().includes('themes')
  );
  
  const ageGroupFilter = shopifyFilters.find((filter: any) => 
    filter.id?.includes('age_group') || filter.label?.toLowerCase().includes('age')
  );
  
  const pieceCountFilter = shopifyFilters.find((filter: any) => 
    filter.id?.includes('piece_count') || filter.label?.toLowerCase().includes('piece')
  );
  
  const priceFilter = shopifyFilters.find((filter: any) => 
    filter.type === 'PRICE_RANGE' || filter.label?.toLowerCase().includes('price')
  );
  
  const availabilityFilter = shopifyFilters.find((filter: any) => 
    filter.type === 'BOOLEAN' && filter.label?.toLowerCase().includes('availability')
  );

  // ✅ CLEAN: Custom price ranges with calculated counts
  const calculatePriceCounts = () => {
    const counts = {
      under_220: 0,
      '220_550': 0,
      '500_1000': 0,
      over_1100: 0,
    };

    products?.nodes?.forEach((product: any) => {
      const price = parseFloat(product.selectedOrFirstAvailableVariant?.price?.amount || '0');
      
      if (price < 220) counts.under_220++;
      else if (price >= 220 && price <= 550) counts['220_550']++;
      else if (price >= 500 && price <= 1000) counts['500_1000']++;
      else if (price >= 1100) counts.over_1100++;
    });

    return counts;
  };

  const priceCounts = calculatePriceCounts();

  const customPriceRanges = [
    { value: 'under_220', label: 'Under 220 kr', active: searchParams.get('price_range') === 'under_220', count: priceCounts.under_220 },
    { value: '220_550', label: '220 till 550 kr', active: searchParams.get('price_range') === '220_550', count: priceCounts['220_550'] },
    { value: '500_1000', label: '500kr till 1000 kr', active: searchParams.get('price_range') === '500_1000', count: priceCounts['500_1000'] },
    { value: 'over_1100', label: 'Över 1100 kr', active: searchParams.get('price_range') === 'over_1100', count: priceCounts.over_1100 },
  ];

  // ✅ CLEAN: Age group label mapping
  const ageGroupMapping: Record<string, string> = {
    '1+': '1+ år',
    '2+': '2+ år', 
    '4+': '4+ år',
    '6+': '6+ år',
    '8+': '8+ år',
    '10+': '10+ år',
    '12+': '12+ år',
    '13+': '13+ år',
    '16+': '16+ år',
    '18+': '18+ år',
    '4-99': '4-99 år',
    '0-3': '0-3 år',
  };

  // ✅ CLEAN: Helper functions with loading feedback
  const updateSearchParams = (updates: Record<string, string | null>) => {
    setIsLoading(true);
    
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });
    
    navigate(`?${newSearchParams.toString()}`, { replace: true });
    
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleSortChange = (newSortKey: string) => {
    updateSearchParams({ sort_by: newSortKey });
  };

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    if (checked) {
      updateSearchParams({ [filterType]: value });
    } else {
      updateSearchParams({ [filterType]: null });
    }
  };

  const clearAllFilters = () => {
    updateSearchParams({
      themes: null,
      age_group: null,
      piece_count: null,
      price_range: null,
      available: null,
    });
  };

  const isFilterActive = (filterType: string, value: string): boolean => {
    return searchParams.get(filterType) === value;
  };

  // Calculate active filter count
  const activeFilterCount = Array.from(searchParams.keys()).filter(key => 
    !['sort_by', '_routes'].includes(key)
  ).length;

  return (
    <>
      {/* ✅ FIXED: Simplified responsive styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        
        .filter-transition {
          transition: all 0.2s ease-in-out;
        }
        .filter-transition:hover {
          background-color: #f8fafc;
          transform: translateX(2px);
        }
        .filter-loading {
          opacity: 0.6;
          pointer-events: none;
        }
        .products-transition {
          transition: opacity 0.3s ease-in-out;
        }
        .loading-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .loading-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
      
      <div className="w-full bg-gray-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700 flex items-center">
              <Home size={16} className="mr-1" />
              Hem
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">{collection.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 flex items-center justify-center space-x-2 text-gray-700 font-medium"
          >
            <SlidersHorizontal size={20} />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg sticky top-6" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
                {activeFilterCount > 0 && (
                  <div className="p-4 border-b border-gray-200">
                    <button
                      onClick={clearAllFilters}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Rensa alla ({activeFilterCount})
                    </button>
                  </div>
                )}

                {/* ✅ MODERN: Scrollable Filter Content with loading state */}
                <div 
                  className={`overflow-y-auto p-4 space-y-4 custom-scrollbar ${isLoading ? 'filter-loading' : ''}`}
                  style={{ maxHeight: 'calc(100vh - 6rem)' }}
                >

                {/* ✅ CLEAN: Themes Filter (limited to 5, compact spacing) */}
                {themesFilter && themesFilter.values?.length > 0 && (
                  <div className="border-b border-gray-200 pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Teman</span>
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                      {themesFilter.values.map((option: any) => (
                        <label key={option.id} className="flex items-center space-x-2 filter-transition p-1 rounded cursor-pointer">
                          <input
                            type="radio"
                            name="themes"
                            className="border-gray-300 text-blue-600 transition-colors"
                            checked={isFilterActive('themes', option.label)}
                            onChange={(e) => handleFilterChange('themes', option.label, e.target.checked)}
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                          <span className="text-sm text-gray-400 ml-auto">({option.count})</span>
                        </label>
                      ))}
                      {/* Clear option */}
                      <label className="flex items-center space-x-2 filter-transition p-1 rounded cursor-pointer">
                        <input
                          type="radio"
                          name="themes"
                          className="border-gray-300 text-blue-600 transition-colors"
                          checked={!searchParams.get('themes')}
                          onChange={() => updateSearchParams({ themes: null })}
                        />
                        <span className="text-sm text-gray-700">Alla teman</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* ✅ CLEAN: Age Group Filter (compact spacing) */}
                {ageGroupFilter && ageGroupFilter.values?.length > 0 && (
                  <div className="border-b border-gray-200 pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Ålder</span>
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      {ageGroupFilter.values.map((option: any) => (
                        <label key={option.id} className="flex items-center space-x-2 filter-transition p-1 rounded cursor-pointer">
                          <input
                            type="radio"
                            name="age_group"
                            className="border-gray-300 text-blue-600 transition-colors"
                            checked={isFilterActive('age_group', option.label)}
                            onChange={(e) => handleFilterChange('age_group', option.label, e.target.checked)}
                          />
                          <span className="text-sm text-gray-700">
                            {ageGroupMapping[option.label] || `${option.label} år`}
                          </span>
                          <span className="text-sm text-gray-400 ml-auto">({option.count})</span>
                        </label>
                      ))}
                      {/* Clear option */}
                      <label className="flex items-center space-x-2 filter-transition p-1 rounded cursor-pointer">
                        <input
                          type="radio"
                          name="age_group"
                          className="border-gray-300 text-blue-600 transition-colors"
                          checked={!searchParams.get('age_group')}
                          onChange={() => updateSearchParams({ age_group: null })}
                        />
                        <span className="text-sm text-gray-700">Alla åldrar</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* ✅ CLEAN: Piece Count Filter (compact spacing) */}
                {pieceCountFilter && pieceCountFilter.values?.length > 0 && (
                  <div className="border-b border-gray-200 pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Antal bitar</span>
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      {pieceCountFilter.values.map((option: any) => (
                        <label key={option.id} className="flex items-center space-x-2 filter-transition p-1 rounded cursor-pointer">
                          <input
                            type="radio"
                            name="piece_count"
                            className="border-gray-300 text-blue-600 transition-colors"
                            checked={isFilterActive('piece_count', option.label)}
                            onChange={(e) => handleFilterChange('piece_count', option.label, e.target.checked)}
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                          <span className="text-sm text-gray-400 ml-auto">({option.count})</span>
                        </label>
                      ))}
                      {/* Clear option */}
                      <label className="flex items-center space-x-2 filter-transition p-1 rounded cursor-pointer">
                        <input
                          type="radio"
                          name="piece_count"
                          className="border-gray-300 text-blue-600 transition-colors"
                          checked={!searchParams.get('piece_count')}
                          onChange={() => updateSearchParams({ piece_count: null })}
                        />
                        <span className="text-sm text-gray-700">Alla storlekar</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* ✅ CLEAN: Custom Price Range Filter with counts (compact spacing) */}
                <div className="border-b border-gray-200 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Pris</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    {customPriceRanges.map((range) => (
                      <label key={range.value} className="flex items-center space-x-2 filter-transition p-1 rounded cursor-pointer">
                        <input
                          type="radio"
                          name="price_range"
                          className="border-gray-300 text-blue-600 transition-colors"
                          checked={range.active}
                          onChange={(e) => handleFilterChange('price_range', range.value, e.target.checked)}
                        />
                        <span className="text-sm text-gray-700">{range.label}</span>
                        <span className="text-sm text-gray-400 ml-auto">({range.count})</span>
                      </label>
                    ))}
                    {/* Clear option */}
                    <label className="flex items-center space-x-2 filter-transition p-1 rounded cursor-pointer">
                      <input
                        type="radio"
                        name="price_range"
                        className="border-gray-300 text-blue-600 transition-colors"
                        checked={!searchParams.get('price_range')}
                        onChange={() => updateSearchParams({ price_range: null })}
                      />
                      <span className="text-sm text-gray-700">Alla priser</span>
                    </label>
                  </div>
                </div>

                {/* ✅ CLEAN: Availability Filter (compact spacing) */}
                {availabilityFilter && availabilityFilter.values?.length > 0 && (
                  <div className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Tillgänglighet</span>
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      {availabilityFilter.values.map((option: any) => (
                        <label key={option.id} className="flex items-center space-x-2 filter-transition p-1 rounded cursor-pointer">
                          <input
                            type="radio"
                            name="available"
                            className="border-gray-300 text-blue-600 transition-colors"
                            checked={isFilterActive('available', option.id.includes('true') ? 'true' : 'false')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleFilterChange('available', option.id.includes('true') ? 'true' : 'false', true);
                              }
                            }}
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                          <span className="text-sm text-gray-400 ml-auto">({option.count})</span>
                        </label>
                      ))}
                      {/* Clear option */}
                      <label className="flex items-center space-x-2 filter-transition p-1 rounded cursor-pointer">
                        <input
                          type="radio"
                          name="available"
                          className="border-gray-300 text-blue-600 transition-colors"
                          checked={!searchParams.get('available')}
                          onChange={() => updateSearchParams({ available: null })}
                        />
                        <span className="text-sm text-gray-700">Alla produkter</span>
                      </label>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* Desktop Products Area */}
            <div className="flex-1">
              {/* Products Header with Loading Indicator */}
              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* ✅ FIXED: Show actual filtered count in Swedish */}
                    {getProductCountText(displayProductCount, hasActiveFilters, totalProductCount)}
                    {/* ✅ NEW: Loading indicator */}
                    {isLoading && (
                      <div className="flex items-center space-x-2 text-blue-600 ml-4">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full loading-spin"></div>
                        <span className="text-sm">Filtrerar...</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select 
                      className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={sortKey}
                      onChange={(e) => handleSortChange(e.target.value)}
                      disabled={isLoading}
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          Sortera: {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ✅ FIXED: Desktop Products Grid - 3 columns like ToysRUs */}
              <div className={`bg-white rounded-lg p-6 products-transition ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                <PaginatedResourceSection
                  connection={products}
                  resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {({ node: product, index }: { node: Product; index: number }) => (
                    <div key={product.id} className="h-full">
                      <ProductItem
                        product={product}
                        loading={index < 6 ? "eager" : undefined}
                      />
                    </div>
                  )}
                </PaginatedResourceSection>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ FIXED: Mobile Products Grid - 1 column on mobile, 2 on tablet */}
        <div className="lg:hidden">
          {/* Mobile Products Header */}
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* ✅ FIXED: Show actual filtered count on mobile too in Swedish */}
                {getProductCountText(displayProductCount, hasActiveFilters, totalProductCount)}
                {/* Loading indicator for mobile */}
                {isLoading && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full loading-spin"></div>
                    <span className="text-sm">Filtrerar...</span>
                  </div>
                )}
              </div>
              
              {/* Mobile Sort Dropdown */}
              <div className="relative">
                <select 
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={sortKey}
                  onChange={(e) => handleSortChange(e.target.value)}
                  disabled={isLoading}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={`products-transition ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
            <PaginatedResourceSection
              connection={products}
              resourcesClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {({ node: product, index }: { node: Product; index: number }) => (
                <div key={product.id} className="h-full">
                  <ProductItem
                    product={product}
                    loading={index < 4 ? "eager" : undefined}
                  />
                </div>
              )}
            </PaginatedResourceSection>
          </div>
        </div>
      </div>

      {/* ✅ FIXED: Complete Mobile Filters with Swedish translations */}
      {mobileFiltersOpen && (
        <>
          {/* ✅ FIXED: Transparent overlay */}
          <div 
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            onClick={() => setMobileFiltersOpen(false)}
          />
          
          {/* ✅ FIXED: Sidebar with complete filter functionality */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white flex flex-col shadow-2xl z-50 lg:hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-medium text-gray-900">Filter</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* ✅ FIXED: Complete mobile filters content with Swedish translations */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              
              {/* ✅ MOBILE: Themes Filter */}
              {themesFilter && themesFilter.values?.length > 0 && (
                <div className="border-b border-gray-200 pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">Teman</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {themesFilter.values.map((option: any) => (
                      <label key={option.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="themes_mobile"
                          className="border-gray-300 text-blue-600"
                          checked={isFilterActive('themes', option.label)}
                          onChange={(e) => handleFilterChange('themes', option.label, e.target.checked)}
                        />
                        <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                        <span className="text-sm text-gray-400">({option.count})</span>
                      </label>
                    ))}
                    {/* Clear option */}
                    <label className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="themes_mobile"
                        className="border-gray-300 text-blue-600"
                        checked={!searchParams.get('themes')}
                        onChange={() => updateSearchParams({ themes: null })}
                      />
                      <span className="text-sm text-gray-700">Alla teman</span>
                    </label>
                  </div>
                </div>
              )}

              {/* ✅ MOBILE: Age Group Filter */}
              {ageGroupFilter && ageGroupFilter.values?.length > 0 && (
                <div className="border-b border-gray-200 pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">Ålder</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    {ageGroupFilter.values.map((option: any) => (
                      <label key={option.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="age_group_mobile"
                          className="border-gray-300 text-blue-600"
                          checked={isFilterActive('age_group', option.label)}
                          onChange={(e) => handleFilterChange('age_group', option.label, e.target.checked)}
                        />
                        <span className="text-sm text-gray-700 flex-1">
                          {ageGroupMapping[option.label] || `${option.label} år`}
                        </span>
                        <span className="text-sm text-gray-400">({option.count})</span>
                      </label>
                    ))}
                    {/* Clear option */}
                    <label className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="age_group_mobile"
                        className="border-gray-300 text-blue-600"
                        checked={!searchParams.get('age_group')}
                        onChange={() => updateSearchParams({ age_group: null })}
                      />
                      <span className="text-sm text-gray-700">Alla åldrar</span>
                    </label>
                  </div>
                </div>
              )}

              {/* ✅ MOBILE: Piece Count Filter */}
              {pieceCountFilter && pieceCountFilter.values?.length > 0 && (
                <div className="border-b border-gray-200 pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">Antal bitar</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    {pieceCountFilter.values.map((option: any) => (
                      <label key={option.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="piece_count_mobile"
                          className="border-gray-300 text-blue-600"
                          checked={isFilterActive('piece_count', option.label)}
                          onChange={(e) => handleFilterChange('piece_count', option.label, e.target.checked)}
                        />
                        <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                        <span className="text-sm text-gray-400">({option.count})</span>
                      </label>
                    ))}
                    {/* Clear option */}
                    <label className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="piece_count_mobile"
                        className="border-gray-300 text-blue-600"
                        checked={!searchParams.get('piece_count')}
                        onChange={() => updateSearchParams({ piece_count: null })}
                      />
                      <span className="text-sm text-gray-700">Alla storlekar</span>
                    </label>
                  </div>
                </div>
              )}

              {/* ✅ MOBILE: Price Range Filter */}
              <div className="border-b border-gray-200 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">Pris</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
                <div className="space-y-2">
                  {customPriceRanges.map((range) => (
                    <label key={range.value} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="price_range_mobile"
                        className="border-gray-300 text-blue-600"
                        checked={range.active}
                        onChange={(e) => handleFilterChange('price_range', range.value, e.target.checked)}
                      />
                      <span className="text-sm text-gray-700 flex-1">{range.label}</span>
                      <span className="text-sm text-gray-400">({range.count})</span>
                    </label>
                  ))}
                  {/* Clear option */}
                  <label className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="price_range_mobile"
                      className="border-gray-300 text-blue-600"
                      checked={!searchParams.get('price_range')}
                      onChange={() => updateSearchParams({ price_range: null })}
                    />
                    <span className="text-sm text-gray-700">Alla priser</span>
                  </label>
                </div>
              </div>

              {/* ✅ MOBILE: Availability Filter */}
              {availabilityFilter && availabilityFilter.values?.length > 0 && (
                <div className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">Tillgänglighet</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    {availabilityFilter.values.map((option: any) => (
                      <label key={option.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="available_mobile"
                          className="border-gray-300 text-blue-600"
                          checked={isFilterActive('available', option.id.includes('true') ? 'true' : 'false')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange('available', option.id.includes('true') ? 'true' : 'false', true);
                            }
                          }}
                        />
                        <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                        <span className="text-sm text-gray-400">({option.count})</span>
                      </label>
                    ))}
                    {/* Clear option */}
                    <label className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="available_mobile"
                        className="border-gray-300 text-blue-600"
                        checked={!searchParams.get('available')}
                        onChange={() => updateSearchParams({ available: null })}
                      />
                      <span className="text-sm text-gray-700">Alla produkter</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    clearAllFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Rensa alla
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Tillämpa
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Analyticss */}
      <Analytics.CollectionView data={{ collection: { id: collection.id, handle: collection.handle } }} />
      </div>
    </>
  );
}