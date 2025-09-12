// FILE: app/components/HeroBanner.tsx
// ✅ LEGO-STYLE: Full-width background with constrained content

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
 * HeroBanner Component - LEGO Style
 * ✅ FIXED: Full-width background, constrained content
 * ✅ CONSISTENT: Same container width as other components
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
    <div className="hero-banner">
      {/* ✅ MOBILE: Full-width edge-to-edge background */}
      <div
        className="block lg:hidden relative"
        style={{
          aspectRatio: '375 / 244',
          backgroundColor: backgroundColor,
          backgroundImage: mobileBackgroundImage
            ? `url(${mobileBackgroundImage})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          /* ✅ EDGE-TO-EDGE: Same technique as desktop */
          width: '100vw',
          marginLeft: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {/* Mobile Text Overlay - Uses design system container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container text-center">
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
      </div>

      {/* Mobile CTA Button - Uses container for consistency */}
      <div
        className="block lg:hidden text-center py-4"
        style={{
          width: '100vw',
          marginLeft: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="container">
          <ShopLinkButton
            to={buttonLink}
            variant="cta"
            size="lg"
            className="rounded-full"
            style={{
              backgroundColor: '#2563eb', /* Blue background */
              color: 'white',              /* White text */
              border: 'none',
              fontSize: '16px',
              fontWeight: 600,
              paddingLeft: '32px',
              paddingRight: '32px',
              paddingTop: '12px',
              paddingBottom: '12px',
              transition: 'background-color 0.2s ease',
            }}
          >
            {buttonText}
          </ShopLinkButton>
        </div>
      </div>

      {/* ✅ DESKTOP: LEGO-style full-width background with constrained content */}
      <div
        className="hidden lg:block relative w-full"
        style={{
          backgroundColor: backgroundColor,
          minHeight: '440px',
          /* ✅ FULL-WIDTH: Background goes edge-to-edge */
          width: '100vw',
          marginLeft: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {/* ✅ CONSTRAINED CONTENT: Uses design system container for consistency */}
        <div className="container flex items-center relative h-full" style={{ minHeight: '440px' }}>
          
          {/* ✅ Left Content - Text and CTA */}
          <div
            className="flex-1 z-10"
            style={{
              maxWidth: '50%',
              paddingTop: '40px',
              paddingBottom: '40px',
              paddingRight: '32px',
            }}
          >
            {/* Title - Matching LEGO typography */}
            <h1
              className="mb-4"
              style={{
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
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

            {/* Subtitle */}
            <p
              className="mb-8"
              style={{
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
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

            {/* CTA Button */}
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

          {/* ✅ Right Image - Properly contained */}
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