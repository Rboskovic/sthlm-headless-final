// FILE: app/components/HeroBanner.tsx
// ✅ FIXED: Desktop banner to match Smyths style with contained image and proper proportions

import {ShopLinkButton} from '~/components/ui/ShopButton';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  mobileBackgroundImage?: string;
  overlayColor?: string;
}

export function HeroBanner({
  title = 'Bygg, skapa & föreställ dig',
  subtitle = 'Upptäck oändliga möjligheter med vår fantastiska LEGO-kollektion',
  buttonText = 'Handla nu',
  buttonLink = '/collections/lego',
  backgroundImage = 'https://cdn.shopify.com/s/files/1/0900/8811/2507/files/hero3.png?v=1753985948',
  mobileBackgroundImage = 'https://cdn.shopify.com/s/files/1/0900/8811/2507/files/hero-mobile2.png?v=1753985948',
  overlayColor = 'transparent',
}: HeroBannerProps) {
  return (
    <div className="hero-banner w-full">
      {/* Mobile Hero Banner - No changes needed, working well */}
      <div
        className="block lg:hidden relative w-full"
        style={{
          aspectRatio: '375 / 244',
          backgroundImage: `url(${mobileBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#FFD42B',
        }}
      >
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

      {/* Desktop Hero Banner - ✅ FIXED: Smyths style with contained image and proper proportions */}
      <div
        className="hidden lg:block relative w-full"
        style={{
          // ✅ FIXED: Full width yellow background like Smyths
          backgroundColor: '#FFD42B',
          minHeight: '400px', // Fixed height instead of aspect ratio
        }}
      >
        {/* ✅ FIXED: Contained content area matching other components */}
        <div 
          className="mx-auto flex items-center relative"
          style={{
            maxWidth: '1272px', // Same as other components
            paddingLeft: '12px',
            paddingRight: '12px',
            minHeight: '400px',
          }}
        >
          {/* Left Content */}
          <div className="flex-1 z-10" style={{maxWidth: '50%'}}>
            {/* Title - ✅ FIXED: Same font as mobile, smaller size like Smyths */}
            <h1 
              className="mb-4 text-gray-900"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif', // Same as mobile
                fontSize: '48px', // ✅ FIXED: Much smaller than before (was clamp(48px, 5vw, 72px))
                fontWeight: 700, // ✅ FIXED: Less bold than mobile (mobile is 900)
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            <p 
              className="mb-8 text-gray-800"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '18px', // ✅ FIXED: Smaller subtitle
                lineHeight: 1.5,
                maxWidth: '400px', // Limit width for better readability
              }}
            >
              {subtitle}
            </p>

            {/* Desktop CTA Button - ✅ FIXED: Dark button like Smyths */}
            <ShopLinkButton 
              to={buttonLink} 
              variant="secondary" 
              size="lg"
              style={{
                backgroundColor: '#1a1a1a', // Dark like Smyths
                color: 'white',
                borderRadius: '25px', // More rounded like Smyths
                paddingLeft: '32px',
                paddingRight: '32px',
                paddingTop: '12px',
                paddingBottom: '12px',
                fontSize: '16px',
                fontWeight: 600,
              }}
              className="hover:bg-gray-800 transition-colors duration-200"
            >
              {buttonText}
            </ShopLinkButton>
          </div>

          {/* Right Image - ✅ FIXED: Contained within component width like Smyths */}
          <div 
            className="flex-1 flex justify-end items-center"
            style={{
              maxWidth: '50%',
              height: '400px',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '350px',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'contain', // ✅ FIXED: Contained not cover
                backgroundPosition: 'center right',
                backgroundRepeat: 'no-repeat',
                maxWidth: '500px', // Limit max size
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}