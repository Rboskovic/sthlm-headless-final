// FILE: app/components/HeroBanner.tsx
// ✅ METAOBJECTS: Now supports metaobject data with fallback to props
// ✅ PERFORMANCE OPTIMIZED: Added explicit dimensions for LCP fix
// ✅ PRESERVES: All existing functionality with backward compatibility

import {ShopLinkButton} from '~/components/ui/ShopButton';

interface HeroBannerProps {
  metaobject?: any; // Metaobject data from Shopify
  // ✅ FALLBACK: Keep original props for backward compatibility
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  mobileBackgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function HeroBanner({
  metaobject,
  title: propTitle,
  subtitle: propSubtitle,
  buttonText: propButtonText,
  buttonLink: propButtonLink,
  backgroundImage: propBackgroundImage,
  mobileBackgroundImage: propMobileBackgroundImage,
  backgroundColor: propBackgroundColor,
  textColor: propTextColor,
}: HeroBannerProps) {
  // ✅ EXTRACT: Helper to get field value from metaobject
  const getFieldValue = (fields: any[], key: string): any => {
    const field = fields?.find((f: any) => f.key === key);
    // For reference types (images, colors), return the reference object
    return field?.reference || field?.value || null;
  };

  // ✅ METAOBJECT DATA: Extract from metaobject if available
  let heroData = {
    title: propTitle || 'Bygg, skapa & föreställ dig',
    subtitle: propSubtitle || 'Upptäck oändliga möjligheter med vår fantastiska LEGO-kollektion',
    buttonText: propButtonText || 'Handla nu',
    buttonLink: propButtonLink || '/collections/lego',
    desktopImage: propBackgroundImage || 'https://cdn.shopify.com/s/files/1/0900/8811/2507/files/hero.destkop.png?v=1754500700',
    mobileImage: propMobileBackgroundImage || 'https://cdn.shopify.com/s/files/1/0900/8811/2507/files/hero-mobile2.png?v=1753985948',
    backgroundColor: propBackgroundColor || '#FFD42B',
    textColor: propTextColor || '#1F2937',
  };

  // ✅ OVERRIDE: If metaobject exists, use its data
  if (metaobject?.fields) {
    const fields = metaobject.fields;
    
    // Text fields (simple values)
    const naslov = getFieldValue(fields, 'naslov');
    const podnaslov = getFieldValue(fields, 'podnaslov');
    const ctaText = getFieldValue(fields, 'cta_text');
    const ctaLink = getFieldValue(fields, 'cta_link');
    
    // Image fields (references)
    const desktopImageRef = getFieldValue(fields, 'destkop_slika'); // Note the typo in field name
    const mobileImageRef = getFieldValue(fields, 'mobile_slika');
    
    // Color fields (values - hex strings)
    const backgroundColorValue = getFieldValue(fields, 'boja_pozadine');
    const textColorValue = getFieldValue(fields, 'boja_teksta');

    heroData = {
      title: naslov || heroData.title,
      subtitle: podnaslov || heroData.subtitle,
      buttonText: ctaText || heroData.buttonText,
      buttonLink: ctaLink || heroData.buttonLink,
      desktopImage: desktopImageRef?.image?.url || heroData.desktopImage,
      mobileImage: mobileImageRef?.image?.url || heroData.mobileImage,
      backgroundColor: backgroundColorValue || heroData.backgroundColor,
      textColor: textColorValue || heroData.textColor,
    };
  }

  // ✅ PERFORMANCE: Generate responsive image URLs with WebP format
  const getOptimizedImageUrl = (url: string, width: number): string => {
    if (!url) return url;
    const base = url.split('?')[0];
    return `${base}?width=${width}&format=webp`;
  };

  // ✅ RESPONSIVE: Generate srcset for mobile (multiple sizes)
  const mobileImageBase = heroData.mobileImage.split('?')[0];
  const mobileSrcSet = [
    `${mobileImageBase}?width=375&format=webp 375w`,
    `${mobileImageBase}?width=425&format=webp 425w`,
    `${mobileImageBase}?width=640&format=webp 640w`,
  ].join(', ');

  // ✅ RESPONSIVE: Generate srcset for desktop (multiple sizes)
  const desktopImageBase = heroData.desktopImage.split('?')[0];
  const desktopSrcSet = [
    `${desktopImageBase}?width=600&format=webp 600w`,
    `${desktopImageBase}?width=700&format=webp 700w`,
    `${desktopImageBase}?width=800&format=webp 800w`,
  ].join(', ');

  return (
    <>
      {/* ✅ PRELOAD CRITICAL IMAGES FOR LCP */}
      <link
        rel="preload"
        as="image"
        href={getOptimizedImageUrl(heroData.mobileImage, 425)}
        media="(max-width: 1023px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={getOptimizedImageUrl(heroData.desktopImage, 700)}
        media="(min-width: 1024px)"
        fetchPriority="high"
      />

      <div className="hero-banner">
        {/* ✅ MOBILE VERSION - Fixed with explicit dimensions */}
        <div
          className="block lg:hidden relative overflow-hidden"
          style={{
            aspectRatio: '375 / 244',
            backgroundColor: heroData.backgroundColor,
            width: '100vw',
            marginLeft: '50%',
            transform: 'translateX(-50%)',
            minHeight: '244px',
          }}
        >
          {/* Background Image - Responsive with srcset */}
          {heroData.mobileImage && (
            <img
              src={getOptimizedImageUrl(heroData.mobileImage, 425)}
              srcSet={mobileSrcSet}
              sizes="100vw"
              alt=""
              width="425"
              height="277"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          )}

          {/* Mobile Text Overlay */}
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
                {heroData.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Mobile CTA Button */}
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
              to={heroData.buttonLink}
              variant="cta"
              size="lg"
              className="rounded-full"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
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
              {heroData.buttonText}
            </ShopLinkButton>
          </div>
        </div>

        {/* ✅ DESKTOP VERSION - Fixed with explicit dimensions */}
        <div
          className="hidden lg:block relative w-full"
          style={{
            backgroundColor: heroData.backgroundColor,
            minHeight: '440px',
            width: '100vw',
            marginLeft: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="container flex items-center relative h-full" style={{ minHeight: '440px' }}>
            
            {/* Left Content - Text and CTA */}
            <div
              className="flex-1 z-10"
              style={{
                maxWidth: '40%',
                paddingTop: '40px',
                paddingBottom: '40px',
                paddingRight: '32px',
              }}
            >
              <h1
                className="mb-4"
                style={{
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: '52px',
                  fontWeight: 800,
                  lineHeight: '1.1',
                  letterSpacing: '-0.015em',
                  color: heroData.textColor,
                  marginBottom: '16px',
                }}
              >
                {heroData.title}
              </h1>

              <p
                className="mb-8"
                style={{
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: '18px',
                  fontWeight: 400,
                  lineHeight: '1.4',
                  color: heroData.textColor,
                  maxWidth: '420px',
                  marginBottom: '32px',
                }}
              >
                {heroData.subtitle}
              </p>

              <ShopLinkButton
                to={heroData.buttonLink}
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
                {heroData.buttonText}
              </ShopLinkButton>
            </div>

            {/* Right Image - Responsive with srcset */}
            <div
              className="flex-1 flex justify-end items-center"
              style={{
                maxWidth: '60%',
                height: '440px',
                paddingLeft: '20px',
                backgroundColor: heroData.backgroundColor,
              }}
            >
              {heroData.desktopImage ? (
                <img
                  src={getOptimizedImageUrl(heroData.desktopImage, 700)}
                  srcSet={desktopSrcSet}
                  sizes="(min-width: 1024px) 600px, 100vw"
                  alt={heroData.title}
                  width="600"
                  height="440"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '600px',
                    objectFit: 'contain',
                    objectPosition: 'center',
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
                    color: heroData.textColor,
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
    </>
  );
}