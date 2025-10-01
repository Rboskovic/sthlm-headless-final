import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useState, useRef} from 'react';
import type {CollectionFragment} from 'storefrontapi.generated';

// Character colors matching the theme
const characterColors: Record<string, string> = {
  'pokemon': '#FFDE00',
  'disney-princess': '#FF69B4',
  'marvel-heroes': '#ED1D24',
  'star-wars': '#FFE81F',
  'frozen': '#87CEEB',
  'toy-story': '#FFD700',
  'spider-man': '#DC143C',
  'batman': '#000000',
  'peppa-pig': '#FF69B4',
  'paw-patrol': '#4169E1',
  'default': '#6B7280',
};

// Fallback static characters for testing
const fallbackCharacters = [
  {
    id: 'char-1',
    title: 'Pokemon',
    handle: 'pokemon',
    image: {url: '', altText: 'Pokemon'},
    backgroundColor: characterColors['pokemon'],
  },
  {
    id: 'char-2',
    title: 'Disney Princess',
    handle: 'disney-princess',
    image: {url: '', altText: 'Disney Princess'},
    backgroundColor: characterColors['disney-princess'],
  },
  {
    id: 'char-3',
    title: 'Marvel Heroes',
    handle: 'marvel-heroes',
    image: {url: '', altText: 'Marvel Heroes'},
    backgroundColor: characterColors['marvel-heroes'],
  },
  {
    id: 'char-4',
    title: 'Star Wars',
    handle: 'star-wars',
    image: {url: '', altText: 'Star Wars'},
    backgroundColor: characterColors['star-wars'],
  },
  {
    id: 'char-5',
    title: 'Frozen',
    handle: 'frozen',
    image: {url: '', altText: 'Frozen'},
    backgroundColor: characterColors['frozen'],
  },
  {
    id: 'char-6',
    title: 'Toy Story',
    handle: 'toy-story',
    image: {url: '', altText: 'Toy Story'},
    backgroundColor: characterColors['toy-story'],
  },
];

interface CharacterWithColor extends CollectionFragment {
  backgroundColor?: string;
}

interface ShopByCharacterProps {
  characters: CollectionFragment[];
}

export function ShopByCharacter({characters}: ShopByCharacterProps) {
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  
  // ✅ FIXED: Improved drag detection with threshold
  const [isDragging, setIsDragging] = useState(false);
  const [hasActuallyDragged, setHasActuallyDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Drag threshold in pixels - only disable pointer events after this distance
  const DRAG_THRESHOLD = 10;

  // Helper function to extract metafield values
  const getMetafieldValue = (
    metafields: Array<{key: string; value: string; namespace: string}> | null,
    key: string,
  ): string | null => {
    if (!metafields) return null;
    const metafield = metafields.find((m) => m && m.key === key);
    return metafield ? metafield.value : null;
  };

  // Helper function to check if a value represents "true"
  const isTrueValue = (value: string | null): boolean => {
    if (!value) return false;
    const normalizedValue = value.toLowerCase().trim();
    return (
      normalizedValue === 'true' ||
      normalizedValue === '1' ||
      normalizedValue === 'yes'
    );
  };

  // Filter featured characters from Shopify data
  const featuredCharacters =
    characters && characters.length > 0
      ? characters.filter((character) => {
          const featuredCharacterValue =
            getMetafieldValue(character.metafields, 'featured-character') ||
            getMetafieldValue(character.metafields, 'featured_character');
          const isFeatured = isTrueValue(featuredCharacterValue);
          return isFeatured && character.image?.url;
        })
      : [];

  // Use Shopify characters or fallback
  const displayCharacters: CharacterWithColor[] =
    featuredCharacters.length > 0 ? featuredCharacters : fallbackCharacters;

  // Desktop: Show only first 6 characters (no scrolling/pagination)
  const visibleCharacters = displayCharacters.slice(0, 6);

  // ✅ FIXED: Improved mouse drag handlers with threshold
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mobileScrollRef.current) return;
    setIsDragging(true);
    setHasActuallyDragged(false); // Reset the actual drag flag
    setStartX(e.pageX - mobileScrollRef.current.offsetLeft);
    setScrollLeft(mobileScrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mobileScrollRef.current) return;
    e.preventDefault();
    
    const x = e.pageX - mobileScrollRef.current.offsetLeft;
    const dragDistance = Math.abs(x - startX);
    
    // Only set hasActuallyDragged after threshold is exceeded
    if (dragDistance > DRAG_THRESHOLD) {
      setHasActuallyDragged(true);
      const walk = (x - startX) * 2; // Scroll speed multiplier
      mobileScrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    setHasActuallyDragged(false);
  };

  return (
    <section className="w-full bg-white">
      <div
        className="mx-auto relative"
        style={{
          width: '1272px',
          maxWidth: '100%',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '32px',
          paddingBottom: '16px',
        }}
      >
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Header with centered title and right-aligned Shop All link */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1"></div>
            <div className="flex-1 flex justify-center">
              <h2
                className="text-black font-semibold"
                style={{
                  fontSize: '36px',
                  fontWeight: 600,
                  lineHeight: '42px',
                  fontFamily:
                    "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  color: 'rgb(33, 36, 39)',
                  textAlign: 'center',
                }}
              >
                Handla efter karaktär
              </h2>
            </div>
            <div className="flex-1 flex justify-end">
              <Link
                to="/collections/characters"
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                style={{
                  fontSize: '18px',
                  fontWeight: 500,
                  fontFamily:
                    "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  color: '#3B82F6',
                  textDecoration: 'none',
                  alignSelf: 'center',
                }}
              >
                Handla alla karaktärer
              </Link>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="grid grid-cols-6 gap-6">
            {visibleCharacters.map((character) => (
              <Link
                key={character.id}
                to={`/collections/${character.handle}`}
                className="group text-center"
              >
                <div
                  className="relative overflow-hidden group-hover:shadow-lg transition-shadow duration-200 mb-4"
                  style={{
                    width: '192px',
                    height: '192px',
                    borderRadius: '12px',
                  }}
                >
                  {character.image?.url ? (
                    <Image
                      data={character.image}
                      alt={character.image.altText || character.title}
                      className="w-full h-full object-cover"
                      sizes="192px"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          character.backgroundColor ||
                          characterColors[character.handle] ||
                          '#6B7280',
                      }}
                    >
                      <span
                        className="text-white font-bold text-center px-2"
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          lineHeight: '24px',
                          fontFamily:
                            "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        }}
                      >
                        {character.title}
                      </span>
                    </div>
                  )}
                </div>
                <h3
                  className="text-black font-medium group-hover:text-blue-600 transition-colors duration-200"
                  style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    fontFamily:
                      "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                    textAlign: 'center',
                  }}
                >
                  {character.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Mobile Title */}
          <h2
            className="text-black font-semibold text-center mb-6"
            style={{
              fontSize: '24px',
              fontWeight: 600,
              lineHeight: '28px',
              fontFamily:
                "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              color: 'rgb(33, 36, 39)',
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            Handla efter karaktär
          </h2>

          {/* Mobile Horizontal Scroll Container */}
          <div
            ref={mobileScrollRef}
            className="overflow-x-auto mb-6 pb-2"
            style={{
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
          >
            <style>
              {`
                .mobile-character-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            <div
              className="flex space-x-2 mobile-character-scroll"
              style={{
                paddingLeft: '12px',
                paddingRight: '0px',
                width: 'max-content',
              }}
            >
              {displayCharacters.map((character) => (
                <Link
                  key={character.id}
                  to={`/collections/${character.handle}`}
                  className="group flex-shrink-0"
                  style={{
                    scrollSnapAlign: 'start',
                    // ✅ FIXED: Only disable pointer events when actually dragging
                    pointerEvents: hasActuallyDragged ? 'none' : 'auto',
                  }}
                >
                  <div
                    className="relative overflow-hidden group-hover:shadow-lg transition-shadow duration-200"
                    style={{
                      width: '144px',
                      height: '144px',
                      borderRadius: '12px',
                    }}
                  >
                    {character.image?.url ? (
                      <Image
                        data={character.image}
                        alt={character.image.altText || character.title}
                        className="w-full h-full object-cover"
                        sizes="144px"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            character.backgroundColor ||
                            characterColors[character.handle] ||
                            '#6B7280',
                        }}
                      >
                        <span
                          className="text-white font-bold text-center px-2"
                          style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            lineHeight: '19px',
                            fontFamily:
                              "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                          }}
                        >
                          {character.title}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Character Name - Mobile */}
                  <div className="mt-2 text-center px-1">
                    <h3
                      className="text-black font-medium group-hover:text-blue-600 transition-colors duration-200"
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        lineHeight: '16.2px',
                        fontFamily:
                          "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        wordWrap: 'break-word',
                        hyphens: 'auto',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        maxWidth: '144px',
                      }}
                    >
                      {character.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Shop All Characters Button - Slightly bigger with proper spacing */}
          <div className="flex justify-center">
            <Link
              to="/collections/characters"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-full transition-colors duration-200"
              style={{
                fontSize: '16px',
                fontWeight: 500,
                fontFamily:
                  "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                color: 'white',
              }}
            >
              Handla alla karaktärer
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}