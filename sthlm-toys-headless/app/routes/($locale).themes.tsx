// FILE: app/routes/($locale).themes.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Themes Page for LEGO® collections

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import {THEMES_COLLECTIONS_QUERY} from '~/lib/fragments';
import {ThemesGrid} from '~/components/ThemesGrid';
import {getCanonicalUrlForPath} from '~/lib/canonical';

export const meta: MetaFunction = () => {
  return [
    {title: 'LEGO® Teman | Klosslabbet'},
    {
      name: 'description',
      content: 'Upptäck LEGO® set efter tema - från Star Wars™ och Harry Potter™ till Technic, City, Marvel och mycket mer. Hitta det perfekta LEGO® setet för alla åldrar.',
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: getCanonicalUrlForPath('/themes'),
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

/**
 * Load critical data for themes page
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(THEMES_COLLECTIONS_QUERY, {
      variables: {},
    }),
  ]);

  return {collections: collections?.nodes || []};
}

/**
 * Load deferred data
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function ThemesPage() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="themes-page">
      {/* Page Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-6">
          Upptäck LEGO® set efter tema
        </h1>
        
        {/* SEO Intro */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-gray-600 text-lg leading-relaxed">
            Upptäck LEGO® set efter tema – från Star Wars™ och Harry Potter™ till Technic, City, Marvel och mycket mer. Hitta det perfekta LEGO® setet för alla åldrar, intressen och byggare.
          </p>
        </div>

        {/* Themes Grid */}
        <ThemesGrid collections={collections} />

        {/* SEO Outro */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              Utforska världen av LEGO® set efter tema och handla från ett av de bredaste utbuden online. 
              Oavsett om du är en ung byggare, en förälder som letar efter den perfekta presenten, 
              eller en vuxen samlare som söker avancerade modeller – LEGO® har något för alla.
            </p>
            <p>
              Populära teman som LEGO® Star Wars™, LEGO® Harry Potter™, LEGO® Marvel Super Heroes, LEGO® Ninjago 
              och LEGO® Technic väcker berättelser och kreativitet till liv, medan tidlösa kollektioner 
              som LEGO® City, LEGO® Creator och LEGO® Classic fortsätter att inspirera fantasin i generationer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}