// FILE: app/routes/($locale).themes.tsx
// ✅ UPDATED: Uses themes metaobject for dynamic content management

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {THEMES_PAGE_QUERY} from '~/lib/fragments';
import {ThemesGrid} from '~/components/ThemesGrid';
import {getCanonicalUrlForPath} from '~/lib/canonical';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const title = data?.metaobject?.naslov || 'LEGO® Teman';
  const description = data?.metaobject?.podnaslov || 'Upptäck LEGO® set efter tema';
  
  return [
    {title: `${title} | Klosslabbet`},
    {name: 'description', content: description},
    {tagName: 'link', rel: 'canonical', href: getCanonicalUrlForPath('/themes')},
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  const data = await storefront.query(THEMES_PAGE_QUERY, {
    cache: storefront.CacheLong(),
  });

  // Extract metaobject data
  const metaobject = data?.themesPage?.nodes?.[0];
  const fields = metaobject?.fields || [];
  
  const naslov = fields.find((f: any) => f.key === 'naslov')?.value || 'Upptäck LEGO® set efter tema';
  const podnaslov = fields.find((f: any) => f.key === 'podnaslov')?.value || '';
  const seoOpis = fields.find((f: any) => f.key === 'seo_opis')?.value || '';
  const kolekcije = fields.find((f: any) => f.key === 'kolekcije')?.references?.nodes || [];

  return {
    metaobject: {
      naslov,
      podnaslov,
      seoOpis,
    },
    collections: kolekcije,
  };
}

export default function ThemesPage() {
  const {metaobject, collections} = useLoaderData<typeof loader>();

  return (
    <div className="themes-page">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header - Dynamic from metaobject */}
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-6">
          {metaobject.naslov}
        </h1>
        
        {/* SEO Intro - Dynamic from metaobject */}
        {metaobject.podnaslov && (
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-gray-600 text-lg leading-relaxed">
              {metaobject.podnaslov}
            </p>
          </div>
        )}

        {/* Themes Grid - Dynamic collections from metaobject */}
        <ThemesGrid collections={collections} />

        {/* SEO Outro - Dynamic from metaobject */}
        {metaobject.seoOpis && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>{metaobject.seoOpis}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}