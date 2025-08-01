import {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

interface SquareBannerItem {
  id: string;
  title: string;
  handle: string;
  backgroundColor?: string;
  image?: {
    url: string;
    altText?: string | null;
  } | null;
}

interface SquareBannersProps {
  title: string;
  items: SquareBannerItem[];
  linkPrefix: string;
}

const defaultColors: Record<string, string> = {
  'toys-r-us': '#4CAF50',
  barbie: '#E91E63',
  lego: '#FFC107',
  disney: '#1976D2',
  'fisher-price': '#00BCD4',
  crayola: '#FFC107',
  minecraft: '#4CAF50',
  sonic: '#2196F3',
};

export function SquareBanners({title, items, linkPrefix}: SquareBannersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartScroll, setDragStartScroll] = useState(0);

  // Calculate total pages
  const itemsPerPage =
    typeof window !== 'undefined' ? (window.innerWidth < 768 ? 2.5 : 6) : 6;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Scroll to specific page
  const goToPage = (pageIndex: number) => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const scrollPosition = containerWidth * pageIndex;

    containerRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });

    setCurrentIndex(pageIndex);
  };

  // Handle scroll events to update progress
  const handleScroll = () => {
    if (!containerRef.current) return;

    const {scrollLeft, scrollWidth, clientWidth} = containerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const newProgress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;

    setProgress(newProgress);

    // Update current page index
    const pageWidth = clientWidth;
    const newIndex = Math.round(scrollLeft / pageWidth);

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  // Initialize scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, {passive: true});

    // Trigger initial calculation
    setTimeout(() => {
      handleScroll();
    }, 100);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [items]);

  // Desktop drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartScroll(containerRef.current.scrollLeft);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const deltaX = e.clientX - dragStartX;
    containerRef.current.scrollLeft = dragStartScroll - deltaX;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragStartScroll(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const deltaX = e.touches[0].clientX - dragStartX;
    containerRef.current.scrollLeft = dragStartScroll - deltaX;
  };

  return (
    <section className="w-full bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-4">
          <h2 className="text-3xl font-bold font-buenos-aires text-gray-900">
            {title}
          </h2>
          <Link
            to={`${linkPrefix}all`}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Shop All {title.replace('Shop By ', '')}
          </Link>
        </div>

        {/* Desktop Arrows */}
        <div className="hidden md:flex items-center justify-between mb-4">
          <button
            onClick={() => goToPage(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            aria-label="Previous brands"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={() => goToPage(Math.min(totalPages - 1, currentIndex + 1))}
            disabled={currentIndex === totalPages - 1}
            className={`p-2 rounded-full ${currentIndex === totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            aria-label="Next brands"
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
        </div>

        {/* Carousel Container */}
        <div
          ref={containerRef}
          className="overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-pan-x"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <div
            className="flex space-x-4 md:space-x-8 pb-4"
            style={{minWidth: `${totalPages * 100}%`}}
          >
            {items.map((item) => (
              <Link
                key={item.id}
                to={`${linkPrefix}${item.handle}`}
                className="group flex-shrink-0 snap-start"
                style={{
                  width: `calc(${100 / itemsPerPage}% - 1rem)`,
                  minWidth: '120px',
                }}
              >
                <div
                  className="relative overflow-hidden group-hover:shadow-lg transition-all duration-200"
                  style={{
                    aspectRatio: '1/1',
                    borderRadius: '12px',
                  }}
                >
                  {item.image?.url ? (
                    <Image
                      data={{
                        url: item.image.url,
                        altText: item.image.altText || '',
                      }}
                      alt={item.image.altText || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="(min-width: 768px) 180px, 40vw"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          item.backgroundColor ||
                          defaultColors[item.handle] ||
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
                            "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        }}
                      >
                        {item.title}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 flex flex-col items-center">
          <div className="flex space-x-2 mb-4">
            {Array.from({length: totalPages}).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          <div className="w-full max-w-md bg-gray-200 rounded-full h-1.5 mb-4">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{width: `${progress}%`}}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
