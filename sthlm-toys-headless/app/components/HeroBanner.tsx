// FILE: app/components/HeroBanner.tsx
// ✅ FIXED: Simplified to work with direct props from metafields

import {ShopLinkButton} from '~/components/ui/ShopButton';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  mobileBackgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * HeroBanner Component
 * ✅ FIXED: Works directly with props from metafields
 * ✅ FIXED: Pixel-perfect match of Smyths Toys hero banner
 */
export function HeroBanner({
  title = 'Bygg, skapa & föreställ dig',
  subtitle = 'Upptäck oändliga möjligheter med vår fantastiska LEGO-kollektion',
  buttonText = 'Handla nu',
  buttonLink = '/collections/lego',
  backgroundImage = 'https://cdn.shopify.com/s/files/1/0900/8811/2507/files/hero.destkop.png?v=1754500700',
  mobileBackgroundImage = 'https://cdn.shopify.com/s/files/1/0900/8811/2507/files/hero-mobile2.png?v=1753985948',
  backgroundColor = '#FFD42B',
  textColor = '#1F2937',
}: HeroBannerProps) {
  return (
    <div className="hero-banner w-full">
      {/* ✅ MOBILE: Background image loading */}
      <div
        className="block lg:hidden relative w-full"
        style={{
          aspectRatio: '375 / 244',
          backgroundColor: backgroundColor,
          backgroundImage: mobileBackgroundImage
            ? `url(${mobileBackgroundImage})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Mobile Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <h1
            className="text-white font-black"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 'clamp(28px, 8vw, 48px)',
              fontWeight: 900,
              lineHeight: '1.1',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              paddingBottom: '60px',
            }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Mobile CTA Button */}
      <div className="block lg:hidden text-center py-4">
        <ShopLinkButton
          to={buttonLink}
          variant="cta"
          size="lg"
          className="rounded-full"
        >
          {buttonText}
        </ShopLinkButton>
      </div>

      {/* ✅ DESKTOP: Pixel-perfect match of Smyths Toys hero banner */}
      <div
        className="hidden lg:block relative w-full"
        style={{
          backgroundColor: backgroundColor,
          minHeight: '440px',
        }}
      >
        {/* ✅ FIXED: Contained content area with proper max-width */}
        <div
          className="mx-auto flex items-center relative h-full"
          style={{
            maxWidth: '1272px',
            paddingLeft: '16px',
            paddingRight: '16px',
            minHeight: '440px',
          }}
        >
          {/* ✅ FIXED: Left Content - Text and CTA with more padding */}
          <div
            className="flex-1 z-10 pr-8"
            style={{
              maxWidth: '50%',
              paddingTop: '40px',
              paddingBottom: '40px',
              paddingLeft: '32px', // More padding from left edge
            }}
          >
            {/* ✅ FIXED: Title - Matching Smyths typography exactly */}
            <h1
              className="mb-4"
              style={{
                fontFamily:
                  'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '52px',
                fontWeight: 800,
                lineHeight: '1.1',
                letterSpacing: '-0.015em',
                color: textColor,
                marginBottom: '16px',
              }}
            >
              {title}
            </h1>

            {/* ✅ FIXED: Subtitle - Matching Smyths typography */}
            <p
              className="mb-8"
              style={{
                fontFamily:
                  'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '18px',
                fontWeight: 400,
                lineHeight: '1.4',
                color: textColor,
                maxWidth: '420px',
                marginBottom: '32px',
              }}
            >
              {subtitle}
            </p>

            {/* ✅ FIXED: CTA Button - Exact match to Smyths style */}
            <ShopLinkButton
              to={buttonLink}
              variant="secondary"
              size="lg"
              style={{
                backgroundColor: '#1a1a1a',
                color: 'white',
                borderRadius: '24px',
                paddingLeft: '36px',
                paddingRight: '36px',
                paddingTop: '14px',
                paddingBottom: '14px',
                fontSize: '16px',
                fontWeight: 600,
                border: 'none',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'background-color 0.2s ease',
              }}
              className="hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
            >
              {buttonText}
            </ShopLinkButton>
          </div>

          {/* ✅ FIXED: Right Image - Properly contained and loaded */}
          <div
            className="flex-1 flex justify-end items-center"
            style={{
              maxWidth: '50%',
              height: '440px',
              paddingLeft: '20px',
            }}
          >
            {backgroundImage ? (
              <div
                style={{
                  width: '100%',
                  height: '380px',
                  maxWidth: '520px',
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center right',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            ) : (
              // ✅ FALLBACK: Show placeholder if no image provided
              <div
                style={{
                  width: '100%',
                  height: '380px',
                  maxWidth: '520px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: textColor,
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Hero Image
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
