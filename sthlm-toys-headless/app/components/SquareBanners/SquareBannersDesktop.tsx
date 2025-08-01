import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useState, useRef, useCallback, useEffect} from 'react';
import type {SquareBannersDesktopProps} from './types';
import {defaultColors} from './types';

export function SquareBannersDesktop({
  title,
  items,
  linkPrefix,
}: SquareBannersDesktopProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);

  // This function checks the scroll position to enable/disable the nav buttons.
  const checkScrollPosition = useCallback(() => {
    const el = carouselRef.current;
    if (el) {
      const {scrollLeft, scrollWidth, clientWidth} = el;
      setCanGoPrev(scrollLeft > 0);
      setCanGoNext(scrollLeft < scrollWidth - clientWidth - 1); // -1 for precision
    }
  }, []);

  // Set up the scroll listener and initial check.
  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollPosition, {passive: true});
      checkScrollPosition(); // Initial check
      return () => el.removeEventListener('scroll', checkScrollPosition);
    }
  }, [items, checkScrollPosition]);

  // --- NAVIGATION LOGIC using scrollLeft ---
  const goToNext = useCallback(() => {
    const el = carouselRef.current;
    if (el) {
      const scrollAmount = el.offsetWidth;
      el.scrollBy({left: scrollAmount, behavior: 'smooth'});
    }
  }, []);

  const goToPrevious = useCallback(() => {
    const el = carouselRef.current;
    if (el) {
      const scrollAmount = el.offsetWidth;
      el.scrollBy({left: -scrollAmount, behavior: 'smooth'});
    }
  }, []);

  // --- Drag-to-scroll logic ---
  const dragState = useRef({isDown: false, startX: 0, scrollLeft: 0});

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (el) {
      dragState.current = {
        isDown: true,
        startX: e.pageX - el.offsetLeft,
        scrollLeft: el.scrollLeft,
      };
      el.style.cursor = 'grabbing';
    }
  };

  const handleMouseLeave = () => {
    dragState.current.isDown = false;
    if (carouselRef.current) carouselRef.current.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    dragState.current.isDown = false;
    if (carouselRef.current) carouselRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragState.current.isDown) return;
    e.preventDefault();
    const el = carouselRef.current;
    if (el) {
      const x = e.pageX - el.offsetLeft;
      const walk = (x - dragState.current.startX) * 2; // scroll-fast
      el.scrollLeft = dragState.current.scrollLeft - walk;
    }
  };

  return (
    <div className="hidden md:block">
      <div className="flex items-center justify-between mb-6 px-4">
        <h2
          className="text-black font-medium"
          style={{
            fontFamily: '"Buenos Aires", sans-serif',
            fontSize: '30px',
            fontWeight: 600,
          }}
        >
          {title}
        </h2>
        <Link
          to={`${linkPrefix}all`}
          className="text-blue-600 hover:text-blue-800 font-medium"
          style={{
            fontSize: '16px',
            fontWeight: 500,
            fontFamily: '"UniformRnd", sans-serif',
          }}
        >
          Shop All {title.replace('Shop By ', '')}
        </Link>
      </div>

      <div className="relative">
        {/* Left Arrow */}
        {canGoPrev && (
          <button
            onClick={goToPrevious}
            aria-label="Previous page"
            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-6 bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-all z-20"
          >
            <svg
              className="w-6 h-6 text-gray-700 pointer-events-none"
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
        )}

        {/* The Scrollable Container (Viewport) */}
        <div
          ref={carouselRef}
          className="overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar"
          style={{cursor: 'grab'}}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <style>
            {`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}
          </style>
          <div className="flex">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-1/6 snap-start px-2"
              >
                <Link
                  to={`${linkPrefix}${item.handle}`}
                  className="group block"
                  draggable="false"
                >
                  <div
                    className="relative overflow-hidden group-hover:shadow-xl transition-shadow rounded-xl"
                    style={{width: '100%', paddingTop: '100%'}}
                  >
                    <div className="absolute top-0 left-0 w-full h-full">
                      {item.image?.url ? (
                        <Image
                          data={item.image}
                          alt={item.image.altText || item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          sizes="180px"
                          loading="lazy"
                          draggable="false"
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
                              fontFamily: '"UniformRnd", sans-serif',
                            }}
                          >
                            {item.title}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        {canGoNext && (
          <button
            onClick={goToNext}
            aria-label="Next page"
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-6 bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-all z-20"
          >
            <svg
              className="w-6 h-6 text-gray-700 pointer-events-none"
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
  );
}
