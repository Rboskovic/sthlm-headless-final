import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useState, useRef, useEffect, useCallback} from 'react';
import type {SquareBannersMobileProps} from './types';
import {defaultColors} from './types';

export function SquareBannersMobile({
  title,
  items,
  linkPrefix,
}: SquareBannersMobileProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // This function calculates and updates the scroll progress state.
  // It's wrapped in useCallback to prevent it from being recreated on every render.
  const updateScrollProgress = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const {scrollLeft, scrollWidth, clientWidth} = scrollContainer;
    const maxScroll = scrollWidth - clientWidth;

    // Avoid division by zero and calculate progress as a percentage.
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    setScrollProgress(progress);
  }, []); // No dependencies, as it only uses the ref.

  // This effect sets up the listeners to update the progress bar.
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // The direct child of the scroll container is the content we need to observe.
    const scrollContent = scrollContainer.firstElementChild;
    if (!scrollContent) return;

    // A ResizeObserver is more reliable than a MutationObserver for this use case.
    // It specifically watches for size changes, which is exactly what happens when
    // images load and expand the container's width.
    const resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to ensure the update happens after the browser
      // has finished its layout and paint cycles.
      requestAnimationFrame(updateScrollProgress);
    });

    // Observe both the container and its content for maximum reliability.
    resizeObserver.observe(scrollContainer);
    resizeObserver.observe(scrollContent);

    // Listen for the scroll event itself for real-time updates as the user drags.
    scrollContainer.addEventListener('scroll', updateScrollProgress, {
      passive: true,
    });

    // Perform an initial calculation when the component mounts.
    requestAnimationFrame(updateScrollProgress);

    // Cleanup: It's crucial to remove listeners and observers when the component
    // unmounts to prevent memory leaks.
    return () => {
      scrollContainer.removeEventListener('scroll', updateScrollProgress);
      resizeObserver.disconnect();
    };
  }, [items, updateScrollProgress]); // Rerun if the items or the callback changes.

  return (
    <div className="block md:hidden">
      {/* Mobile Title */}
      <h2
        className="text-black font-semibold text-center mb-6"
        style={{
          fontFamily:
            '"Buenos Aires", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif',
          fontSize: '30px',
          fontWeight: 600,
          lineHeight: 'normal',
          color: 'rgb(33, 36, 39)',
          margin: '0px 0px 24px 0px',
          padding: '0px',
          height: '36px',
          textAlign: 'center',
        }}
      >
        {title}
      </h2>

      {/* Mobile Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto mb-4 pb-2 mobile-scroll"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none', // For Firefox
          msOverflowStyle: 'none', // For IE
          paddingLeft: '16px',
          WebkitOverflowScrolling: 'touch', // For smooth scrolling on iOS
        }}
      >
        {/* Hide scrollbar for Webkit browsers (Chrome, Safari) */}
        <style>
          {`
            .mobile-scroll::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        <div
          className="flex space-x-2"
          style={{
            paddingRight: '16px',
            width: 'max-content',
          }}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              to={`${linkPrefix}${item.handle}`}
              className="group flex-shrink-0"
              style={{scrollSnapAlign: 'start'}}
              draggable="false"
            >
              <div
                className="relative overflow-hidden group-hover:shadow-lg transition-shadow duration-200"
                style={{
                  width: '128px',
                  height: '128px',
                  borderRadius: '12px',
                }}
              >
                {item.image?.url ? (
                  <Image
                    data={item.image}
                    alt={item.image.altText || item.title}
                    className="w-full h-full object-cover"
                    sizes="128px"
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
                        fontSize: '14px',
                        fontWeight: 700,
                        lineHeight: '18px',
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
      <div className="mb-6 px-4">
        <div
          className="w-full bg-gray-200 rounded-full"
          style={{height: '4px'}}
        >
          <div
            className="bg-blue-600 rounded-full"
            style={{
              width: `${scrollProgress}%`,
              height: '4px',
              backgroundColor: '#1976D2',
              // Use a short transition on width for a smoother feel.
              transition: 'width 0.05s linear',
            }}
          />
        </div>
      </div>

      {/* Mobile Shop All Button */}
      <div className="flex justify-center">
        <Link
          to={`${linkPrefix}all`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-200"
          style={{
            fontSize: '16px',
            fontWeight: 500,
            fontFamily:
              "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
            textDecoration: 'none',
          }}
        >
          Shop All {title.replace('Shop By ', '')}
        </Link>
      </div>
    </div>
  );
}
