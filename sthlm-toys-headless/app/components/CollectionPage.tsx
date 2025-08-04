import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { Analytics } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { ProductItem } from '~/components/ProductItem';
import { ChevronRight, Home, ChevronDown, SlidersHorizontal, X, Plus } from 'lucide-react';
import type { Collection, Product } from '@shopify/hydrogen/storefront-api-types';

interface CollectionPageProps {
  collection: Collection;
  products: any;
  relatedCollections?: any[];
  appliedFilters?: any;
  sortKey?: string;
}

export function CollectionPage({
  collection,
  products,
  relatedCollections = [],
  appliedFilters = {},
  sortKey = 'BEST_SELLING'
}: CollectionPageProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Product count
  const totalProducts = products?.nodes?.length || 0;

  // Sort options
  const sortOptions = [
    { label: 'Best selling', value: 'BEST_SELLING' },
    { label: 'Alphabetically, A-Z', value: 'TITLE' },
    { label: 'Alphabetically, Z-A', value: 'TITLE_REVERSE' },
    { label: 'Price, low to high', value: 'PRICE' },
    { label: 'Price, high to low', value: 'PRICE_REVERSE' },
    { label: 'Date, new to old', value: 'CREATED_REVERSE' },
    { label: 'Date, old to new', value: 'CREATED' },
  ];

  const currentSortLabel = sortOptions.find(option => option.value === sortKey)?.label || 'Best selling';

  // Use ACTUAL Shopify filters from the API response
  const shopifyFilters = products?.filters || [];

  // Extract automatic Brand and Character filters from products
  const extractedBrands = new Set<string>();
  const extractedCharacters = new Set<string>();
  
  products?.nodes?.forEach((product: any) => {
    // Add vendor as brand
    if (product.vendor) {
      extractedBrands.add(product.vendor);
    }
    
    // Extract characters from tags
    product.tags?.forEach((tag: string) => {
      const lowerTag = tag.toLowerCase();
      // Common character indicators
      if (lowerTag.includes('peppa pig') || lowerTag.includes('peppa-pig')) {
        extractedCharacters.add('Peppa Pig');
      }
      if (lowerTag.includes('pokemon') || lowerTag.includes('pokémon')) {
        extractedCharacters.add('Pokemon');
      }
      if (lowerTag.includes('disney')) {
        extractedCharacters.add('Disney');
      }
      if (lowerTag.includes('marvel')) {
        extractedCharacters.add('Marvel');
      }
      if (lowerTag.includes('star wars') || lowerTag.includes('starwars')) {
        extractedCharacters.add('Star Wars');
      }
      if (lowerTag.includes('minecraft')) {
        extractedCharacters.add('Minecraft');
      }
      if (lowerTag.includes('sonic')) {
        extractedCharacters.add('Sonic');
      }
      if (lowerTag.includes('batman')) {
        extractedCharacters.add('Batman');
      }
      if (lowerTag.includes('spiderman') || lowerTag.includes('spider-man')) {
        extractedCharacters.add('Spider-Man');
      }
    });
  });

  // Handle sort change
  const handleSortChange = (newSortKey: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('sort_by', newSortKey);
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  // Handle filter change - removed price filter
  const handleFilterChange = (filter: any, value: any, checked: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    let paramName = '';
    if (filter.id.includes('filter.v.vendor')) {
      paramName = 'vendor';
    } else if (filter.id.includes('filter.v.availability')) {
      paramName = 'available';
    } else if (filter.id.includes('filter.p.product_type')) {
      paramName = 'product_type';
    } else if (filter.id.includes('filter.p.tag')) {
      paramName = 'tag';
    }
    
    if (paramName && checked) {
      newSearchParams.append(paramName, value.input || value.label);
    } else if (paramName) {
      const currentValues = newSearchParams.getAll(paramName);
      newSearchParams.delete(paramName);
      currentValues.forEach(val => {
        if (val !== (value.input || value.label)) {
          newSearchParams.append(paramName, val);
        }
      });
    }
    
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  // Handle brand filter
  const handleBrandFilter = (brand: string, checked: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const currentBrands = newSearchParams.getAll('vendor');
    
    if (checked) {
      newSearchParams.append('vendor', brand);
    } else {
      newSearchParams.delete('vendor');
      currentBrands.forEach(val => {
        if (val !== brand) {
          newSearchParams.append('vendor', val);
        }
      });
    }
    
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  // Handle character filter
  const handleCharacterFilter = (character: string, checked: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const currentTags = newSearchParams.getAll('tag');
    
    if (checked) {
      newSearchParams.append('tag', character);
    } else {
      newSearchParams.delete('tag');
      currentTags.forEach(val => {
        if (val !== character) {
          newSearchParams.append('tag', val);
        }
      });
    }
    
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  // Check if filter value is active
  const isFilterValueActive = (filter: any, value: any) => {
    let paramName = '';
    if (filter.id.includes('filter.v.vendor')) {
      paramName = 'vendor';
    } else if (filter.id.includes('filter.v.availability')) {
      paramName = 'available';
    } else if (filter.id.includes('filter.p.product_type')) {
      paramName = 'product_type';
    } else if (filter.id.includes('filter.p.tag')) {
      paramName = 'tag';
    }
    
    const activeValues = searchParams.getAll(paramName);
    return activeValues.includes(value.input || value.label);
  };

  // Handle subcollection filter
  const handleSubcollectionFilter = (subcollectionHandle: string, checked: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const currentSubcollections = newSearchParams.getAll('subcollection');
    
    if (checked) {
      newSearchParams.append('subcollection', subcollectionHandle);
    } else {
      newSearchParams.delete('subcollection');
      currentSubcollections.forEach(val => {
        if (val !== subcollectionHandle) {
          newSearchParams.append('subcollection', val);
        }
      });
    }
    
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  const isSubcollectionActive = (handle: string) => {
    return searchParams.getAll('subcollection').includes(handle);
  };

  const isBrandActive = (brand: string) => {
    return searchParams.getAll('vendor').includes(brand);
  };

  const isCharacterActive = (character: string) => {
    return searchParams.getAll('tag').includes(character);
  };

  // Clear all filters
  const clearAllFilters = () => {
    navigate(window.location.pathname, { replace: true });
    setMobileFiltersOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div 
          className="mx-auto"
          style={{
            width: '1272px',
            maxWidth: '100%',
            paddingLeft: '12px',
            paddingRight: '12px',
          }}
        >
          <div className="flex items-center py-4 space-x-2 text-sm">
            <Link 
              to="/" 
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
            >
              <Home size={16} className="mr-1" />
              Home
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">{collection.title}</span>
          </div>
        </div>
      </nav>

      <div 
        className="mx-auto py-6"
        style={{
          width: '1272px',
          maxWidth: '100%',
          paddingLeft: '12px',
          paddingRight: '12px',
        }}
      >
        {/* Mobile Controls */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium bg-white hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={16} />
              <span>Filter and sort</span>
            </button>
            
            <span className="text-sm text-gray-600">{totalProducts} products</span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            <div className="w-72 flex-shrink-0">
              <div className="bg-white rounded-lg p-6 sticky top-6">
                <h3 className="font-bold text-lg mb-4">Filter:</h3>
                
                {/* Subcollections Filter */}
                {relatedCollections.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                      Collections
                      <ChevronDown size={16} />
                    </h4>
                    <div className="space-y-2">
                      {relatedCollections.map((subcol: any) => (
                        <label key={subcol.handle} className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-blue-600 mr-3"
                            checked={isSubcollectionActive(subcol.handle)}
                            onChange={(e) => handleSubcollectionFilter(subcol.handle, e.target.checked)}
                          />
                          <span className="text-sm text-gray-700">{subcol.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Automatic Brand Filter */}
                {extractedBrands.size > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                      Brand
                      <ChevronDown size={16} />
                    </h4>
                    <div className="space-y-2">
                      {Array.from(extractedBrands).map((brand) => (
                        <label key={brand} className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-blue-600 mr-3"
                            checked={isBrandActive(brand)}
                            onChange={(e) => handleBrandFilter(brand, e.target.checked)}
                          />
                          <span className="text-sm text-gray-700">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Automatic Character Filter */}
                {extractedCharacters.size > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                      Characters
                      <ChevronDown size={16} />
                    </h4>
                    <div className="space-y-2">
                      {Array.from(extractedCharacters).map((character) => (
                        <label key={character} className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-blue-600 mr-3"
                            checked={isCharacterActive(character)}
                            onChange={(e) => handleCharacterFilter(character, e.target.checked)}
                          />
                          <span className="text-sm text-gray-700">{character}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Native Shopify Filters (excluding price) */}
                {shopifyFilters.map((filter: any) => {
                  if (!filter.values || filter.values.length === 0) return null;
                  if (filter.id.includes('filter.v.price')) return null; // Skip price filter
                  
                  return (
                    <div key={filter.id} className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                        {filter.label}
                        <ChevronDown size={16} />
                      </h4>
                      <div className="space-y-2">
                        {filter.values.slice(0, 10).map((value: any) => (
                          <label key={value.id} className="flex items-center">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-blue-600 mr-3"
                              checked={isFilterValueActive(filter, value)}
                              onChange={(e) => handleFilterChange(filter, value, e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">{value.label}</span>
                            <span className="text-sm text-gray-400 ml-auto">({value.count})</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Products Area */}
            <div className="flex-1">
              {/* Products Header */}
              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">{totalProducts} products</span>
                  
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select 
                      className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={sortKey}
                      onChange={(e) => handleSortChange(e.target.value)}
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          Sort by: {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="bg-white rounded-lg p-6">
                <PaginatedResourceSection
                  connection={products}
                  resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {({ node: product, index }: { node: Product; index: number }) => (
                    <div key={product.id}>
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

        {/* Mobile Products Grid - PIXEL PERFECT SINGLE COLUMN */}
        <div className="lg:hidden">
          <PaginatedResourceSection
            connection={products}
            resourcesClassName="space-y-4"
          >
            {({ node: product, index }: { node: Product; index: number }) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden border border-gray-200">
                <ProductItem
                  product={product}
                  loading={index < 4 ? "eager" : undefined}
                />
              </div>
            )}
          </PaginatedResourceSection>
        </div>
      </div>

      {/* Mobile Filter Modal - EXACT MATCH TO SCREENSHOT */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          
          {/* Modal */}
          <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl h-[85vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-medium text-gray-900">Filter and sort</h3>
              <span className="text-sm text-gray-500">{totalProducts} products</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Sort By */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Sort by:</span>
                  <select 
                    className="text-gray-600 text-sm border-none focus:outline-none bg-transparent"
                    value={sortKey}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>

              {/* Filter Sections */}
              <div className="p-4 space-y-4">
                {/* Category/Collections */}
                {relatedCollections.length > 0 && (
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">Category</span>
                      <Plus size={16} className="text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      {relatedCollections.map((subcol: any) => (
                        <label key={subcol.handle} className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-blue-600 mr-3"
                            checked={isSubcollectionActive(subcol.handle)}
                            onChange={(e) => {
                              handleSubcollectionFilter(subcol.handle, e.target.checked);
                            }}
                          />
                          <span className="text-sm text-gray-700">{subcol.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Age */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Age</span>
                    <Plus size={16} className="text-gray-400" />
                  </div>
                </div>

                {/* Brand */}
                {extractedBrands.size > 0 && (
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">Brand</span>
                      <Plus size={16} className="text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      {Array.from(extractedBrands).map((brand) => (
                        <label key={brand} className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-blue-600 mr-3"
                            checked={isBrandActive(brand)}
                            onChange={(e) => {
                              handleBrandFilter(brand, e.target.checked);
                            }}
                          />
                          <span className="text-sm text-gray-700">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Characters */}
                {extractedCharacters.size > 0 && (
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">Characters</span>
                      <Plus size={16} className="text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      {Array.from(extractedCharacters).map((character) => (
                        <label key={character} className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-blue-600 mr-3"
                            checked={isCharacterActive(character)}
                            onChange={(e) => {
                              handleCharacterFilter(character, e.target.checked);
                            }}
                          />
                          <span className="text-sm text-gray-700">{character}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Availability</span>
                    <Plus size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Remove all
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics */}
      <Analytics.CollectionView data={{ collection: { id: collection.id, handle: collection.handle } }} />
    </div>
  );
}