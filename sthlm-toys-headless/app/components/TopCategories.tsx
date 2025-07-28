import { Link } from "react-router";
import { Image } from "@shopify/hydrogen";

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
}

interface TopCategoriesProps {
  collections?: Collection[];
  title?: string;
}

// Fallback categories if no Shopify collections available
const fallbackCategories: Collection[] = [
  {
    id: "fallback-1",
    title: "Action Figures & Playsets",
    handle: "action-figures-playsets",
    image: {
      id: "fallback-img-1",
      url: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      altText: "Action Figures & Playsets",
      width: 500,
      height: 500,
    },
  },
  {
    id: "fallback-2",
    title: "LEGO & Bricks",
    handle: "lego-bricks",
    image: {
      id: "fallback-img-2",
      url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      altText: "LEGO & Bricks",
      width: 500,
      height: 500,
    },
  },
  {
    id: "fallback-3",
    title: "Games, Puzzles & Books",
    handle: "games-puzzles-books",
    image: {
      id: "fallback-img-3",
      url: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      altText: "Games, Puzzles & Books",
      width: 500,
      height: 500,
    },
  },
  {
    id: "fallback-4",
    title: "Arts, Crafts & Music",
    handle: "arts-crafts-music",
    image: {
      id: "fallback-img-4",
      url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      altText: "Arts, Crafts & Music",
      width: 500,
      height: 500,
    },
  },
  {
    id: "fallback-5",
    title: "Baby Room",
    handle: "baby-room",
    image: {
      id: "fallback-img-5",
      url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      altText: "Baby Room",
      width: 500,
      height: 500,
    },
  },
  {
    id: "fallback-6",
    title: "Outdoor",
    handle: "outdoor",
    image: {
      id: "fallback-img-6",
      url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      altText: "Outdoor",
      width: 500,
      height: 500,
    },
  },
];

export function TopCategories({
  collections,
  title = "Top categories",
}: TopCategoriesProps) {
  // Debug: Log what we're getting from Shopify
  console.log("TopCategories received collections:", collections);
  console.log("First collection with details:", collections?.[0]);

  // Use Shopify collections if available, otherwise fallback
  let categoriesToShow = fallbackCategories;

  if (collections && collections.length > 0) {
    // Use first 6 collections that have images
    const collectionsWithImages = collections.filter(
      (collection) => collection.image
    );
    if (collectionsWithImages.length > 0) {
      categoriesToShow = collectionsWithImages.slice(0, 6);
    }
  }

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-8">
          <h2
            className="text-2xl lg:text-3xl font-bold text-gray-900"
            style={{
              fontFamily:
                "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
            }}
          >
            {title}
          </h2>
        </div>

        {/* Debug Info - Disabled since collections are working */}
        {false && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
            <h3 className="font-bold">Debug Info:</h3>
            <p>Collections received: {collections ? collections.length : 0}</p>
            <p>
              Using:{" "}
              {categoriesToShow === fallbackCategories
                ? "Fallback data"
                : "Shopify data"}
            </p>
            {collections && collections.length > 0 && (
              <details className="mt-2">
                <summary>Collection handles from Shopify:</summary>
                <ul className="list-disc list-inside">
                  {collections.map((col) => (
                    <li key={col.id}>
                      {col.title} (handle: {col.handle})
                      {col.image ? " ✅ Has image" : " ❌ No image"}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categoriesToShow.map((category) => (
            <Link
              key={category.id}
              to={`/collections/${category.handle}`}
              className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Category Image - Using Shopify's optimized Image component */}
              <div className="aspect-square overflow-hidden bg-gray-100">
                {category.image ? (
                  <Image
                    data={category.image}
                    sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
              </div>

              {/* Category Title */}
              <div className="p-3 lg:p-4">
                <h3
                  className="text-sm lg:text-base font-medium text-gray-900 text-center leading-tight group-hover:text-blue-600 transition-colors duration-200"
                  style={{
                    fontFamily:
                      "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  }}
                >
                  {category.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
