// app/components/SearchResultsPredictive.tsx - Enhanced with Better Styling and Functionality
import {Link, useFetcher, type Fetcher} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import React, {useRef, useEffect} from 'react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
  type PredictiveSearchReturn,
} from '~/lib/search';
import {useAside} from './Aside';

type PredictiveSearchItems = PredictiveSearchReturn['result']['items'];

type UsePredictiveSearchReturn = {
  term: React.MutableRefObject<string>;
  total: number;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  items: PredictiveSearchItems;
  fetcher: Fetcher<PredictiveSearchReturn>;
};

type SearchResultsPredictiveArgs = Pick<
  UsePredictiveSearchReturn,
  'term' | 'total' | 'inputRef' | 'items'
> & {
  state: Fetcher['state'];
  closeSearch: () => void;
};

type PartialPredictiveSearchResult<
  ItemType extends keyof PredictiveSearchItems,
  ExtraProps extends keyof SearchResultsPredictiveArgs = 'term' | 'closeSearch',
> = Pick<PredictiveSearchItems, ItemType> &
  Pick<SearchResultsPredictiveArgs, ExtraProps>;

type SearchResultsPredictiveProps = {
  children: (args: SearchResultsPredictiveArgs) => React.ReactNode;
};

/**
 * Component that renders predictive search results
 */
export function SearchResultsPredictive({
  children,
}: SearchResultsPredictiveProps) {
  const aside = useAside();
  const {term, inputRef, fetcher, total, items} = usePredictiveSearch();

  /*
   * Utility that resets the search input
   */
  function resetInput() {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.value = '';
    }
  }

  /**
   * Utility that resets the search input and closes the search aside
   */
  function closeSearch() {
    resetInput();
    aside.close();
  }

  return children({
    items,
    closeSearch,
    inputRef,
    state: fetcher.state,
    term,
    total,
  });
}

SearchResultsPredictive.Articles = SearchResultsPredictiveArticles;
SearchResultsPredictive.Collections = SearchResultsPredictiveCollections;
SearchResultsPredictive.Pages = SearchResultsPredictivePages;
SearchResultsPredictive.Products = SearchResultsPredictiveProducts;
SearchResultsPredictive.Queries = SearchResultsPredictiveQueries;
SearchResultsPredictive.Empty = SearchResultsPredictiveEmpty;

function SearchResultsPredictiveArticles({
  term,
  articles,
  closeSearch,
}: PartialPredictiveSearchResult<'articles'>) {
  if (!articles.length) return null;

  return (
    <div className="predictive-search-result mb-6" key="articles">
      <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Artiklar</h5>
      <ul className="space-y-2">
        {articles.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.blog.handle}/${article.handle}`,
            trackingParams: article.trackingParameters,
            term: term.current ?? '',
          });

          return (
            <li className="predictive-search-result-item" key={article.id}>
              <Link 
                onClick={closeSearch} 
                to={articleUrl}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {article.image?.url && (
                  <div className="w-12 h-12 flex-shrink-0">
                    <Image
                      alt={article.image.altText ?? ''}
                      src={article.image.url}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900 line-clamp-1">{article.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveCollections({
  term,
  collections,
  closeSearch,
}: PartialPredictiveSearchResult<'collections'>) {
  if (!collections.length) return null;

  return (
    <div className="predictive-search-result mb-6" key="collections">
      <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Categories</h5>
      <ul className="space-y-2">
        {collections.map((collection) => {
          const collectionUrl = urlWithTrackingParams({
            baseUrl: `/collections/${collection.handle}`,
            trackingParams: collection.trackingParameters,
            term: term.current,
          });

          return (
            <li className="predictive-search-result-item" key={collection.id}>
              <Link 
                onClick={closeSearch} 
                to={collectionUrl}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {collection.image?.url && (
                  <div className="w-12 h-12 flex-shrink-0">
                    <Image
                      alt={collection.image.altText ?? ''}
                      src={collection.image.url}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900 line-clamp-1">{collection.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictivePages({
  term,
  pages,
  closeSearch,
}: PartialPredictiveSearchResult<'pages'>) {
  if (!pages.length) return null;

  return (
    <div className="predictive-search-result mb-6" key="pages">
      <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Pages</h5>
      <ul className="space-y-2">
        {pages.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term: term.current,
          });

          return (
            <li className="predictive-search-result-item" key={page.id}>
              <Link 
                onClick={closeSearch} 
                to={pageUrl}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900 line-clamp-1">{page.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveProducts({
  term,
  products,
  closeSearch,
}: PartialPredictiveSearchResult<'products'>) {
  if (!products.length) return null;

  return (
    <div className="predictive-search-result mb-6" key="products">
      <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Products</h5>
      <ul className="space-y-2">
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });

          const price = product?.selectedOrFirstAvailableVariant?.price;
          const image = product?.selectedOrFirstAvailableVariant?.image;
          
          return (
            <li className="predictive-search-result-item" key={product.id}>
              <Link 
                to={productUrl} 
                onClick={closeSearch}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {image && (
                  <div className="w-12 h-12 flex-shrink-0">
                    <Image
                      alt={image.altText ?? ''}
                      src={image.url}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {price && (
                        <Money data={price} className="text-sm text-gray-600" />
                      )}
                      {product.vendor && (
                        <span className="text-xs text-gray-500">by {product.vendor}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveQueries({
  queries,
  queriesDatalistId,
}: PartialPredictiveSearchResult<'queries', never> & {
  queriesDatalistId?: string;
}) {
  if (!queries.length) return null;

  // If we have a datalist ID, render as datalist for autocomplete
  if (queriesDatalistId) {
    return (
      <datalist id={queriesDatalistId}>
        {queries.map((suggestion) => {
          if (!suggestion) return null;
          return <option key={suggestion.text} value={suggestion.text} />;
        })}
      </datalist>
    );
  }

  // Otherwise render as visible suggestions
  return (
    <div className="predictive-search-result mb-6" key="queries">
      <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Förslag</h5>
      <ul className="space-y-1">
        {queries.map((suggestion) => {
          if (!suggestion) return null;

          return (
            <li key={suggestion.text} className="predictive-search-result-item">
              <button
                className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-700"
                onClick={() => {
                  // Update search input with suggestion
                  const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
                  if (searchInput) {
                    searchInput.value = suggestion.text;
                    searchInput.focus();
                  }
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: suggestion.styledText || suggestion.text }} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveEmpty({
  term,
}: {
  term: React.MutableRefObject<string>;
}) {
  if (!term.current) {
    return null;
  }

  return (
    <div className="p-4 text-center">
      <p className="text-sm text-gray-600">
        Inga resultat för <strong>"{term.current}"</strong>
      </p>
    </div>
  );
}

/**
 * Hook that returns the predictive search results and fetcher and input ref.
 * @example
 * '''ts
 * const { items, total, inputRef, term, fetcher } = usePredictiveSearch();
 * '''
 **/
function usePredictiveSearch(): UsePredictiveSearchReturn {
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const term = useRef<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (fetcher?.state === 'loading') {
    term.current = String(fetcher.formData?.get('q') || '');
  }

  // capture the search input element as a ref
  useEffect(() => {
    if (!inputRef.current) {
      inputRef.current = document.querySelector('input[type="search"]');
    }
  }, []);

  const {items, total} =
    fetcher?.data?.result ?? getEmptyPredictiveSearchResult();

  return {items, total, inputRef, term, fetcher};
}