import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useState, useRef} from 'react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

interface ShopByCharacterProps {
  characters?: Collection[] | null;
}

interface CharacterWithColor extends Collection {
  backgroundColor?: string;
}

// Character color mapping for fallbacks (matching popular characters)
const characterColors: Record<string, string> = {
  'mickey-mouse': '#E91E63',
  frozen: '#1976D2',
  'spider-man': '#FF1744',
  batman: '#424242',
  princess: '#E91E63',
  cars: '#F44336',
  'peppa-pig': '#E91E63',
  'paw-patrol': '#2196F3',
};

// Fallback characters (popular toy characters)
const fallbackCharacters: CharacterWithColor[] = [
  {
    id: 'mickey-mouse',
    title: 'Mickey Mouse',
    handle: 'mickey-mouse',
    backgroundColor: '#E91E63',
    image: null,
  },
  {
    id: 'frozen',
    title: 'Frozen',
    handle: 'frozen',
    backgroundColor: '#1976D2',
    image: null,
  },
  {
    id: 'spider-man',
    title: 'Spider-Man',
    handle: 'spider-man',
    backgroundColor: '#FF1744',
    image: null,
  },
  {
    id: 'batman',
    title: 'Batman',
    handle: 'batman',
    backgroundColor: '#424242',
    image: null,
  },
  {
    id: 'princess',
    title: 'Princess',
    handle: 'princess',
    backgroundColor: '#E91E63',
    image: null,
  },
  {
    id: 'paw-patrol',
    title: 'Paw Patrol',
    handle: 'paw-patrol',
    backgroundColor: '#2196F3',
    image: null,
  },
];

export function ShopByCharacter({characters}: ShopByCharacterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  // Helper function to get metafield value
  const getMetafieldValue = (metafields: any, key: string): string | null => {
    if (!metafields || !Array.isArray(metafields)) return null;
    const metafield = metafields.find((field: any) => field?.key === key);
    return metafield?.value ? metafield.value : null;
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

  // Mouse drag handlers for mobile scroll container
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mobileScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - mobileScrollRef.current.offsetLeft);
    setScrollLeft(mobileScrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mobileScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - mobileScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    mobileScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="w-full bg-white">
      {/* Container matching Smyths layout */}
      <div
        className="mx-auto relative"
        style={{
          width: '1272px',
          maxWidth: '100%',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '64px',
          paddingBottom: '32px',
        }}
      >
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Header with centered title and right-aligned Shop All link */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1"></div>
            <div className="flex-1 flex justify-center">
              <h2
                style={{
                  fontFamily:
                    'Buenos Aires, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif',
                  fontSize: '35px',
                  fontStyle: 'normal',
                  fontVariant: 'normal',
                  fontWeight: 600,
                  letterSpacing: 'normal',
                  lineHeight: 'normal',
                  textDecoration: 'none solid rgb(33, 36, 39)',
                  textAlign: 'center',
                  textIndent: '0px',
                  textTransform: 'none',
                  verticalAlign: 'baseline',
                  whiteSpace: 'normal',
                  wordSpacing: '0px',
                  color: 'rgb(33, 36, 39)',
                  border: '0px none rgb(33, 36, 39)',
                  margin: '0px',
                  padding: '0px',
                }}
              >
                Handla efter karaktär
              </h2>
            </div>

            <div className="flex-1 flex justify-end items-center">
              <Link
                to="/collections/characters"
                style={{
                  fontFamily:
                    'Buenos Aires, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontVariant: 'normal',
                  fontWeight: 600,
                  letterSpacing: 'normal',
                  lineHeight: 'normal',
                  textDecoration: 'underline solid rgb(0, 78, 188)',
                  textAlign: 'right',
                  textIndent: '0px',
                  textTransform: 'none',
                  verticalAlign: 'baseline',
                  whiteSpace: 'normal',
                  wordSpacing: '0px',
                  color: 'rgb(0, 78, 188)',
                  border: '0px none rgb(0, 78, 188)',
                  margin: '0px',
                  padding: '0px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="hover:opacity-80"
              >
                Handla alla karaktärer
              </Link>
            </div>
          </div>

          {/* Desktop Characters Grid - No Navigation */}
          <div className="relative">
            <div className="grid grid-cols-6 gap-4 justify-center">
              {visibleCharacters.map((character) => (
                <Link
                  key={character.id}
                  to={`/collections/${character.handle}`}
                  className="group block"
                >
                  <div
                    className="relative overflow-hidden group-hover:shadow-lg transition-shadow duration-200"
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '12px',
                    }}
                  >
                    {character.image?.url ? (
                      <Image
                        data={character.image}
                        alt={character.image.altText || character.title}
                        style={{
                          height: '200px',
                          width: '200px',
                          overflow: 'clip',
                          cursor: 'pointer',
                          boxSizing: 'content-box',
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="200px"
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
                  {/* Character Name - Desktop */}
                  <div className="mt-3 text-center">
                    <h3
                      className="text-black font-medium group-hover:text-blue-600 transition-colors duration-200"
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '18.9px',
                        fontFamily:
                          "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        wordWrap: 'break-word',
                        hyphens: 'auto',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        maxWidth: '200px',
                      }}
                    >
                      {character.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Mobile Title */}
          <h2
            className="text-black font-semibold text-center mb-8"
            style={{
              fontSize: '30px',
              fontWeight: 600,
              lineHeight: 'normal',
              fontFamily:
                "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
            }}
          >
            Handla efter karaktär
          </h2>

          {/* Mobile Horizontal Scroll - Left padding, right edge-to-edge */}
          <div
            ref={mobileScrollRef}
            className="overflow-x-auto mb-8 pb-2 -ml-3"
            style={{
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
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
                    pointerEvents: isDragging ? 'none' : 'auto',
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
