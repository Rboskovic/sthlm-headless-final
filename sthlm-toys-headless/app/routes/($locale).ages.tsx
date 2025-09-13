// FILE: app/routes/($locale).ages.tsx
// ✅ FIXED: Proper titles, descriptions, smaller banner, TypeScript errors fixed

import {type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from 'react-router';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

export const meta: MetaFunction = () => {
  return [
    {title: 'LEGO® Sets efter ålder och gåvor för alla åldrar - Klosslabbet'},
    {name: 'description', content: 'Vi har LEGO® sets perfekt för barn och vuxna i alla åldrar. Från småbarn till tonåringar, det finns gott om att upptäcka med vårt breda sortiment av intressen och budgetar.'},
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  try {
    console.log('🔍 Startar ages loader...');
    
    const ageCollectionsData = await storefront.query(AGE_COLLECTIONS_QUERY);
    
    console.log('📦 Rå collections response:', JSON.stringify(ageCollectionsData, null, 2));

    const allCollections = ageCollectionsData?.collections?.nodes || [];
    console.log(`📊 Hittade ${allCollections.length} totala collections`);

    // Filter collections that have BOTH age_collection=true AND age_lifestyle_image
    const filteredAgeCollections = allCollections.filter((collection: Collection) => {
      const getMetafieldValue = (key: string) => {
        const metafield = collection.metafields?.find(field => 
          field?.key === key && (field.namespace === 'custom' || field.namespace === 'app')
        );
        return metafield?.value || null;
      };

      const isAgeCollection = getMetafieldValue('age_collection') === 'true';
      const lifestyleImageValue = getMetafieldValue('age_lifestyle_image');
      
      console.log(`🎯 Collection "${collection.title}": age_collection=${isAgeCollection}, lifestyle_image=${lifestyleImageValue}`);
      
      return isAgeCollection && lifestyleImageValue;
    }).sort((a: Collection, b: Collection) => {
      // ✅ FIXED: Sort by sort_order (underscore, not hyphen)
      const getSortOrder = (collection: Collection) => {
        const sortOrderField = collection.metafields?.find(field => 
          field?.key === 'sort_order' && (field.namespace === 'custom' || field.namespace === 'app')
        );
        return sortOrderField?.value ? parseInt(sortOrderField.value) : 999;
      };
      
      return getSortOrder(a) - getSortOrder(b);
    });

    console.log(`✅ Filtrerat till ${filteredAgeCollections.length} ålderssamlingar`);

    return {
      ageCollections: filteredAgeCollections,
    };
  } catch (error) {
    console.error('❌ Fel vid laddning av åldersidan:', error);
    return {
      ageCollections: [],
    };
  }
}

export default function AgesPage() {
  const {ageCollections} = useLoaderData<typeof loader>();

  return (
    <div className="bg-white">
      {/* ✅ FIXED: Smaller hero section height */}
      <div className="container py-6">
        <div className="bg-black text-white py-6 px-6 rounded-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-white">
            LEGO® Sets efter ålder och gåvor för alla åldrar
          </h1>
        </div>
      </div>

      {/* ✅ Description Section - Translated to Swedish */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-700 text-lg leading-relaxed">
            Vi har LEGO® sets perfekt för <Link to="/collections/barn" className="text-blue-600 hover:underline">barn</Link> och{' '}
            <Link to="/collections/vuxna" className="text-blue-600 hover:underline">vuxna</Link> i alla åldrar. Från{' '}
            <Link to="/collections/småbarn" className="text-blue-600 hover:underline">småbarn</Link> till{' '}
            <Link to="/collections/tonåringar" className="text-blue-600 hover:underline">tonåringar</Link>, det finns gott om att upptäcka med vårt breda sortiment av{' '}
            <Link to="/collections/intressen" className="text-blue-600 hover:underline">intressen</Link> och{' '}
            <Link to="/collections/budgetar" className="text-blue-600 hover:underline">budgetar</Link>. Hitta ditt nästa LEGO-tillskott till din LEGO-kollektion eller välj den bästa{' '}
            <Link to="/collections/födelsedag" className="text-blue-600 hover:underline">födelsedags</Link>- eller{' '}
            <Link to="/collections/helgdag" className="text-blue-600 hover:underline">helgdagspresenten</Link> för din vän, kollega eller familj.
          </p>
        </div>
      </div>

      {/* ✅ Age Grid - Production ready */}
      <div className="container pb-16">
        {ageCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ageCollections.map((collection: Collection) => (
              <AgeCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              Ålderssamlingar kommer snart! Kontrollera att kollektioner har både age_collection=true och age_lifestyle_image inställda.
            </p>
          </div>
        )}
      </div>

      {/* ✅ Phase 2: Blog placeholder - Swedish translation */}
      <div className="bg-gray-50 py-16">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lektips för olika åldrar</h2>
          <p className="text-gray-600 mb-8">Här kommer vi snart visa artiklar och tips för olika åldersgrupper.</p>
          <Link 
            to="/blogs" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se alla bloggar →
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Age Card Component - Fixed titles and descriptions
 */
function AgeCard({collection}: {collection: Collection}) {
  // Extract metafield values with proper namespace checking
  const getMetafieldValue = (key: string) => {
    const metafield = collection.metafields?.find(field => 
      field?.key === key && (field.namespace === 'custom' || field.namespace === 'app')
    );
    return metafield?.value || null;
  };

  // ✅ FIXED: Use collection title directly (no extraction)
  const displayTitle = collection.title;
  const lifestyleImageValue = getMetafieldValue('age_lifestyle_image');

  // ✅ FIXED: TypeScript errors - properly type the parsed JSON
  interface ShopifyImageData {
    url?: string;
    src?: string;
    alt?: string;
  }

  let lifestyleImageUrl = null;
  
  if (lifestyleImageValue) {
    try {
      // ✅ FIXED: Type assertion for parsed JSON
      const parsed = JSON.parse(lifestyleImageValue) as ShopifyImageData;
      lifestyleImageUrl = parsed.url || parsed.src || lifestyleImageValue;
    } catch {
      // If not JSON, use as direct URL
      lifestyleImageUrl = lifestyleImageValue;
    }
  }

  return (
    <Link to={`/collections/${collection.handle}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Lifestyle Image */}
        <div className="relative w-full bg-gray-100" style={{ aspectRatio: '420/200' }}>
          {lifestyleImageUrl ? (
            <img
              src={lifestyleImageUrl}
              alt={collection.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              width={420}
              height={200}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <div className="text-white text-2xl font-bold">{displayTitle}</div>
            </div>
          )}
        </div>

        {/* Content - Swedish with better layout for descriptions */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{displayTitle}</h3>
          
          {/* ✅ FIXED: Always show description if available */}
          {collection.description && (
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {collection.description}
            </p>
          )}
          
          <div className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
            Handla nu →
          </div>
        </div>
      </div>
    </Link>
  );
}

// ✅ FIXED: Enhanced GraphQL Query with proper image metafield handling
const AGE_COLLECTIONS_QUERY = `#graphql
  query AgeCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 50, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        description
        metafields(identifiers: [
          {namespace: "custom", key: "age_collection"},
          {namespace: "app", key: "age_collection"},
          {namespace: "custom", key: "age_lifestyle_image"},
          {namespace: "app", key: "age_lifestyle_image"},
          {namespace: "custom", key: "sort_order"},
          {namespace: "app", key: "sort_order"}
        ]) {
          key
          value
          namespace
        }
      }
    }
  }
` as const;