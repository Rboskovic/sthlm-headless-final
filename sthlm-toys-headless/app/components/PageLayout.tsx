// app/components/PageLayout.tsx - Enhanced with customer data for header dropdown + FIXED SearchAside
import {Await, Link, useRouteLoaderData} from 'react-router';
import {Suspense, useId} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CustomerFragment} from 'customer-accountapi.generated';
import {Aside} from '~/components/Aside';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<any>;
  header: any;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
  popularCollections?: Collection[];
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
  popularCollections = [],
}: PageLayoutProps) {
  // ✅ ENHANCED: Get customer data from account route when available
  const accountData = useRouteLoaderData<{customer: CustomerFragment}>('routes/($locale).account');
  const customer = accountData?.customer || null;

  return (
    <Aside.Provider>
      <CartAside cart={cart} popularCollections={popularCollections} />
      <SearchAside />
      {/* Mobile menu is now handled by Header component directly */}
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
          popularCollections={popularCollections}
          customer={customer} // ✅ ENHANCED: Pass customer data to header
        />
      )}
      <main>{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

function CartAside({cart, popularCollections}: {
  cart: PageLayoutProps['cart'];
  popularCollections?: Collection[];
}) {
  return (
    <Aside type="cart" heading="KUNDVAGN">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" popularCollections={popularCollections} />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  // ✅ FIXED: Proper SearchAside implementation from working code
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SÖK">
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Sök"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
                className="w-full p-2 border border-gray-300 rounded"
              />
              &nbsp;
              <button
                onClick={goToSearch}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sök
              </button>
            </>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div className="p-4 text-gray-600">Loading...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <div className="space-y-4">
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                    className="block p-2 text-blue-600 hover:text-blue-800"
                  >
                    <p>
                      View all results for <q>{term.current}</q>
                      &nbsp; →
                    </p>
                  </Link>
                ) : null}
              </div>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}