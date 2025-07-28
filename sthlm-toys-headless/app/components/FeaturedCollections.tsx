import { Link } from "react-router";
import { Image } from "@shopify/hydrogen";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface FeaturedCollection {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  image?: {
    id: string;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
}

interface FeaturedCollectionsProps {
  collections?: FeaturedCollection[];
}

// Fallback featured collections with Swedish content
const fallbackCollections: (FeaturedCollection & {
  backgroundColor: string;
  isNew?: boolean;
})[] = [
  {
    id: "fallback-1",
    title: "Rainbow High My Fashion Style Dolls",
    description: "Style That Pops!",
    handle: "rainbow-high-dolls",
    backgroundColor: "#B83D9E", // Purple/magenta
    isNew: true,
    image: {
      id: "fallback-img-1",
      url: "https://images.unsplash.com/photo-1572351721488-3ea5e12e36b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      altText: "Rainbow High Fashion Dolls",
      width: 800,
      height: 600,
    },
  },
  {
    id: "fallback-2",
    title: "WWE SummerSlam Elite Action Figures",
    description: "Wrestling Champions Collection",
    handle: "wwe-action-figures",
    backgroundColor: "#C41E3A", // Red
    isNew: true,
    image: {
      id: "fallback-img-2",
      url: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      altText: "WWE Action Figures",
      width: 800,
      height: 600,
    },
  },
  {
    id: "fallback-3",
    title: "Wicked Toys",
    description: "Step into Glinda's world of style & sparkle!",
    handle: "wicked-toys",
    backgroundColor: "#228B22", // Green
    isNew: true,
    image: {
      id: "fallback-img-3",
      url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      altText: "Wicked Toys Collection",
      width: 800,
      height: 600,
    },
  },
];

// Collection background colors (you can customize these or use metafields)
const collectionColors: Record<string, string> = {
  "rainbow-high-dolls": "#B83D9E",
  "wwe-action-figures": "#C41E3A",
  "wicked-toys": "#228B22",
  // Add more collection handles and their colors here
};

export function FeaturedCollections({ collections }: FeaturedCollectionsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use Shopify collections if available, otherwise fallback
  const displayCollections =
    collections && collections.length > 0
      ? collections.map((collection, index) => ({
          ...collection,
          backgroundColor: collectionColors[collection.handle] || "#6B7280", // Default gray
          isNew: index < 3, // Mark first 3 as new, you can customize this logic
        }))
      : fallbackCollections;

  const itemsPerPage = 3;
  const maxIndex = Math.max(
    0,
    Math.ceil(displayCollections.length / itemsPerPage) - 1
  );

  const visibleCollections = displayCollections.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const goToPrevious = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : maxIndex);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex < maxIndex ? currentIndex + 1 : 0);
  };

  const showNavigation = displayCollections.length > itemsPerPage;

  return (
    <section className="w-full bg-white">
      {/* Container matching header width */}
      <div
        className="mx-auto relative"
        style={{
          width: "1272px",
          maxWidth: "100%",
          paddingLeft: "12px",
          paddingRight: "12px",
          paddingTop: "64px",
          paddingBottom: "64px",
        }}
      >
        {/* Collections Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{
            gap: "24px",
          }}
        >
          {visibleCollections.map((collection) => (
            <div
              key={collection.id}
              className="group relative overflow-hidden rounded-lg"
              style={{
                borderRadius: "12px",
                height: "520px",
              }}
            >
              {/* NEW Badge */}
              {collection.isNew && (
                <div
                  className="absolute top-4 left-4 z-20 bg-white text-black font-bold px-3 py-1 rounded"
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    fontFamily:
                      "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  }}
                >
                  NEW
                </div>
              )}

              <Link
                to={`/collections/${collection.handle}`}
                className="block h-full"
              >
                {/* Image Section (Top 60%) */}
                <div
                  className="relative overflow-hidden"
                  style={{ height: "312px" }} // 60% of 520px
                >
                  {collection.image && (
                    <Image
                      data={collection.image}
                      alt={collection.image.altText || collection.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Content Section (Bottom 40%) */}
                <div
                  className="flex flex-col justify-between p-6 text-white"
                  style={{
                    height: "208px", // 40% of 520px
                    backgroundColor: collection.backgroundColor,
                    padding: "32px 24px",
                  }}
                >
                  <div>
                    {/* Title */}
                    <h3
                      className="font-bold text-white mb-3"
                      style={{
                        fontSize: "24px",
                        fontWeight: 700,
                        lineHeight: "28.8px",
                        fontFamily:
                          "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        marginBottom: "12px",
                      }}
                    >
                      {collection.title}
                    </h3>

                    {/* Description */}
                    {collection.description && (
                      <p
                        className="text-white mb-6"
                        style={{
                          fontSize: "16px",
                          fontWeight: 400,
                          lineHeight: "21.6px",
                          fontFamily:
                            "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                          marginBottom: "24px",
                        }}
                      >
                        {collection.description}
                      </p>
                    )}
                  </div>

                  {/* Shop Now Button */}
                  <button
                    className="self-start border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors duration-200 rounded-full px-6 py-2"
                    style={{
                      fontSize: "16px",
                      fontWeight: 500,
                      fontFamily:
                        "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                      paddingLeft: "32px",
                      paddingRight: "32px",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                    }}
                  >
                    Shop Now
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {showNavigation && (
          <>
            {/* Previous Arrow */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 z-10"
              style={{
                marginLeft: "-20px",
                width: "48px",
                height: "48px",
              }}
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </button>

            {/* Next Arrow */}
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 z-10"
              style={{
                marginRight: "-20px",
                width: "48px",
                height: "48px",
              }}
            >
              <ChevronRight size={24} className="text-gray-600" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
