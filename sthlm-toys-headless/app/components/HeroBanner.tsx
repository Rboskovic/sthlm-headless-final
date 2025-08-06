import {ShopLinkButton} from '~/components/ui/ShopButton';
// FILE: app/components/HeroBanner.tsx
// ✅ SHOPIFY STANDARD: Updated to use ShopButton consistently

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
      {/* Mobile Hero Banner */}
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
        {/* Mobile Content */}
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

      {/* Mobile CTA Button - ✅ FIXED: Using ShopButton */}
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

      {/* Desktop Hero Banner */}
      <div
        className="hidden lg:block relative w-full"
        style={{
          aspectRatio: '219 / 71',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center right',
          backgroundColor: '#FFD42B',
        }}
      >
        {/* Desktop Content */}
        <div className="absolute inset-0 flex items-center">
          <div 
            className="mx-auto w-full flex items-center"
            style={{
              maxWidth: '1272px',
              paddingLeft: '12px',
              paddingRight: '12px',
            }}
          >
            <div className="max-w-2xl">
              {/* Title */}
              <h1 
                className="mb-4 text-gray-900"
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: 'clamp(48px, 5vw, 72px)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </h1>

              {/* Subtitle */}
              <p 
                className="mb-6 text-gray-800"
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '20px',
                  lineHeight: 1.5,
                }}
              >
                {subtitle}
              </p>

              {/* Desktop CTA Button - ✅ FIXED: Using ShopButton */}
              <ShopLinkButton 
                to={buttonLink} 
                variant="hero" 
                size="lg"
                className="rounded-full"
              >
                {buttonText}
              </ShopLinkButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}