import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

interface Collection {
  id: string;
  title: string;
  handle: string;
  image?: {
    id: string;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  metafields?: Array<{
    key: string;
    value: string;
  }> | null;
}

interface TopCategoriesProps {
  collections?: Collection[];
  title?: string;
}

// Enhanced fallback categories matching Swedish names from Shopify admin
const fallbackCategories: Collection[] = [
  {
    id: 'fallback-1',
    title: 'Förskola & Elektronik',
    handle: 'preschool-electronics',
    image: {
      id: 'fallback-img-1',
      url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      altText: 'Förskola & Elektronik',
      width: 500,
      height: 500,
    },
  },
  {
    id: 'fallback-2',
    title: 'Konst, Pyssel & Musik',
    handle: 'arts-crafts-music',
    image: {
      id: 'fallback-img-2',
      url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      altText: 'Konst, Pyssel & Musik',
      width: 500,
      height: 500,
    },
  },
  {
    id: 'fallback-3',
    title: 'Spel, Pusssel & Böcker',
    handle: 'games-puzzles-books',
    image: {
      id: 'fallback-img-3',
      url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      altText: 'Spel, Pusssel & Böcker',
      width: 500,
      height: 500,
    },
  },
  {
    id: 'fallback-4',
    title: 'Mode & Dockor',
    handle: 'fashion-dolls',
    image: {
      id: 'fallback-img-4',
      url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      altText: 'Mode & Dockor',
      width: 500,
      height: 500,
    },
  },
  {
    id: 'fallback-5',
    title: 'Konstruktion & Bilar',
    handle: 'construction-cars',
    image: {
      id: 'fallback-img-5',
      url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      altText: 'Konstruktion & Bilar',
      width: 500,
      height: 500,
    },
  },
  {
    id: 'fallback-6',
    title: 'Actionfigurer och lekset',
    handle: 'action-figures-toys',
    image: {
      id: 'fallback-img-6',
      url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      altText: 'Actionfigurer och lekset',
      width: 500,
      height: 500,
    },
  },
];

// Helper function to check if collection is marked as top category
function isTopCategory(collection: Collection): boolean {
  if (!collection.metafields || !Array.isArray(collection.metafields))
    return false;

  return collection.metafields.some(
    (metafield) =>
      metafield && // Check if metafield is not null
      metafield.key && // Check if key exists
      (metafield.key === 'top_category' ||
        metafield.key === 'featured_category') &&
      (metafield.value === 'true' || metafield.value === '1'),
  );
}

export function TopCategories({
  collections,
  title = 'Populära kategorier',
}: TopCategoriesProps) {
  console.log('TopCategories received collections:', collections);

  // Filter collections by metafield first
  const metafieldFilteredCollections = collections?.filter(isTopCategory) || [];
  console.log('Metafield filtered collections:', metafieldFilteredCollections);

  // Then filter by images
  const collectionsWithImages = metafieldFilteredCollections.filter(
    (collection) => collection.image?.url,
  );
  console.log(
    'Collections with images after metafield filter:',
    collectionsWithImages,
  );

  // Fallback logic:
  // 1. Use metafield + image filtered collections if available
  // 2. If no metafield collections, use any collections with images (old behavior)
  // 3. If still none, use fallback categories
  let displayCategories: Collection[] = [];

  if (collectionsWithImages.length > 0) {
    // We have collections marked with metafields and images - use these
    displayCategories = collectionsWithImages;
    console.log(
      'Using metafield filtered collections:',
      displayCategories.length,
    );
  } else if (collections?.filter((c) => c.image?.url).length > 0) {
    // No metafield collections, but we have some collections with images - use those
    displayCategories = collections.filter((c) => c.image?.url);
    console.log(
      'Using any collections with images (no metafields set):',
      displayCategories.length,
    );
  } else {
    // No collections with images at all - use fallback
    displayCategories = fallbackCategories;
    console.log('Using fallback categories');
  }

  // Determine if we need a slider (more than 6 categories)
  const needsSlider = displayCategories.length > 6;
  const showCategories = needsSlider
    ? displayCategories.slice(0, 6)
    : displayCategories;

  console.log('Final display categories:', showCategories);
  console.log('Needs slider:', needsSlider);

  return (
    <section className="w-full">
      {/* Container matching header width */}
      <div
        className="mx-auto"
        style={{
          width: '1272px',
          maxWidth: '100%',
          paddingLeft: '12px',
          paddingRight: '12px',
        }}
      >
        {/* Title */}
        <h2
          className="text-black font-medium mb-6"
          style={{
            fontSize: '24px',
            fontWeight: 500,
            lineHeight: '32.4px',
            marginBottom: '24px',
            fontFamily:
              "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
          }}
        >
          {title}
        </h2>

        {/* Categories Grid - Single row layout for up to 6 categories */}
        <div className="relative">
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            style={{
              gap: '16px',
            }}
          >
            {showCategories.map((category) => (
              <Link
                key={category.id}
                to={`/collections/${category.handle}`}
                className="group flex flex-col items-start"
              >
                {/* Image Container */}
                <div
                  className="w-full rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-shadow duration-200"
                  style={{
                    aspectRatio: '1/1',
                    borderRadius: '12px',
                  }}
                >
                  {category.image && (
                    <Image
                      data={category.image}
                      alt={category.image.altText || category.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                      loading="eager"
                    />
                  )}
                </div>

                {/* Category Title */}
                <h3
                  className="text-black font-medium text-center w-full group-hover:text-blue-600 transition-colors duration-200"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: '21.6px',
                    fontFamily:
                      "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  }}
                >
                  {category.title}
                </h3>
              </Link>
            ))}
          </div>

          {/* Slider Button - Show if more than 6 categories */}
          {needsSlider && (
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200 z-10"
              style={{
                marginRight: '-20px',
                width: '40px',
                height: '40px',
              }}
              onClick={() => {
                // TODO: Implement slider functionality
                console.log('Slider clicked - implement carousel');
              }}
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
