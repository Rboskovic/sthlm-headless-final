// FILE: app/components/SimpleCampaignBanner.tsx
// ✅ PURPOSE: Full-width campaign banner for promotional content (Black Friday, seasonal campaigns, etc.)
// ✅ METAOBJECT: Uses 'campaign_banner' metaobject type
// ✅ CLIENT-FRIENDLY: Easy to update - just upload image and set link
// ✅ PERFORMANCE: Optimized with responsive images and proper preloading

import {Link} from 'react-router';

interface SimpleCampaignBannerProps {
  metaobject?: any; // Metaobject data from Shopify
  // ✅ FALLBACK: Direct props for testing/fallback
  bannerImage?: string;
  mobileImage?: string;
  linkUrl?: string;
  showCtaButton?: boolean;
  ctaText?: string;
  ctaPosition?: 'left' | 'center' | 'right';
}

export function SimpleCampaignBanner({
  metaobject,
  bannerImage: propBannerImage,
  mobileImage: propMobileImage,
  linkUrl: propLinkUrl,
  showCtaButton: propShowCtaButton = false,
  ctaText: propCtaText = 'SHOP NOW',
  ctaPosition: propCtaPosition = 'right',
}: SimpleCampaignBannerProps) {
  // ✅ EXTRACT: Helper to get field value from metaobject
  const getFieldValue = (fields: any[], key: string): any => {
    const field = fields?.find((f: any) => f.key === key);
    return field?.reference || field?.value || null;
  };

  // ✅ METAOBJECT DATA: Extract from metaobject if available
  let bannerData = {
    desktopImage: propBannerImage || '',
    mobileImage: propMobileImage || '',
    linkUrl: propLinkUrl || '/collections/all',
    showCtaButton: propShowCtaButton,
    ctaText: propCtaText,
    ctaPosition: propCtaPosition,
  };

  // ✅ OVERRIDE: If metaobject exists, use its data
  if (metaobject?.fields) {
    const fields = metaobject.fields;
    
    const desktopImageRef = getFieldValue(fields, 'custom_desktop_slika');
    const mobileImageRef = getFieldValue(fields, 'custom_mobile_slika');
    const collectionRef = getFieldValue(fields, 'custom_kolekcija'); // Collection reference
    const showButtonValue = getFieldValue(fields, 'custom_show_cta_button');
    const ctaTextValue = getFieldValue(fields, 'custom_cta_text');
    const ctaPositionValue = getFieldValue(fields, 'custom_cta_position');

    // ✅ COLLECTION: Extract collection handle and build URL
    const collectionHandle = collectionRef?.handle || null;
    const collectionUrl = collectionHandle ? `/collections/${collectionHandle}` : bannerData.linkUrl;

    bannerData = {
      desktopImage: desktopImageRef?.image?.url || bannerData.desktopImage,
      mobileImage: mobileImageRef?.image?.url || desktopImageRef?.image?.url || bannerData.mobileImage,
      linkUrl: collectionUrl,
      showCtaButton: showButtonValue === 'true' || showButtonValue === true || bannerData.showCtaButton,
      ctaText: ctaTextValue || bannerData.ctaText,
      ctaPosition: ctaPositionValue || bannerData.ctaPosition,
    };
  }

  // ✅ VALIDATION: Don't render if no image
  if (!bannerData.desktopImage) {
    console.warn('SimpleCampaignBanner: No banner image provided');
    return null;
  }

  // ✅ PERFORMANCE: Generate responsive image URLs with WebP format
  const getOptimizedImageUrl = (url: string, width: number): string => {
    if (!url || !url.includes('cdn.shopify.com')) return url;
    const base = url.split('?')[0];
    return `${base}?width=${width}&format=webp`;
  };

  // ✅ RESPONSIVE: Generate srcset for mobile
  const mobileImageBase = bannerData.mobileImage?.split('?')[0] || bannerData.desktopImage.split('?')[0];
  const mobileSrcSet = [
    `${mobileImageBase}?width=640&format=webp 640w`,
    `${mobileImageBase}?width=768&format=webp 768w`,
    `${mobileImageBase}?width=1024&format=webp 1024w`,
  ].join(', ');

  // ✅ RESPONSIVE: Generate srcset for desktop
  const desktopImageBase = bannerData.desktopImage.split('?')[0];
  const desktopSrcSet = [
    `${desktopImageBase}?width=1200&format=webp 1200w`,
    `${desktopImageBase}?width=1600&format=webp 1600w`,
    `${desktopImageBase}?width=2600&format=webp 2600w`,
  ].join(', ');

  // ✅ CTA POSITION: Calculate button alignment classes
  const getCtaPositionClasses = () => {
    switch (bannerData.ctaPosition) {
      case 'left':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'right':
      default:
        return 'justify-end';
    }
  };

  // ✅ WRAPPER: Entire banner is clickable
  const BannerContent = () => (
    <>
      {/* ✅ PRELOAD: Critical image for LCP optimization */}
      <link
        rel="preload"
        as="image"
        href={getOptimizedImageUrl(bannerData.mobileImage || bannerData.desktopImage, 768)}
        media="(max-width: 1023px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={getOptimizedImageUrl(bannerData.desktopImage, 1600)}
        media="(min-width: 1024px)"
        fetchPriority="high"
      />

      {/* ✅ MOBILE VERSION */}
      <div
        className="block lg:hidden relative overflow-hidden"
        style={{
          width: '100vw',
          marginLeft: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <img
          src={getOptimizedImageUrl(bannerData.mobileImage || bannerData.desktopImage, 768)}
          srcSet={mobileSrcSet}
          sizes="100vw"
          alt="Campaign Banner"
          width="768"
          height="400"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="w-full h-auto"
          style={{
            display: 'block',
          }}
        />

        {/* ✅ MOBILE CTA OVERLAY */}
        {bannerData.showCtaButton && (
          <div 
            className={`absolute bottom-0 left-0 right-0 p-6 flex ${getCtaPositionClasses()}`}
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
            }}
          >
            <button
              className="bg-yellow-400 text-black font-bold rounded-full transition-transform hover:scale-105 active:scale-95"
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {bannerData.ctaText}
            </button>
          </div>
        )}
      </div>

      {/* ✅ DESKTOP VERSION */}
      <div
        className="hidden lg:block relative overflow-hidden"
        style={{
          width: '100vw',
          marginLeft: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <img
          src={getOptimizedImageUrl(bannerData.desktopImage, 1600)}
          srcSet={desktopSrcSet}
          sizes="100vw"
          alt="Campaign Banner"
          width="2600"
          height="650"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="w-full h-auto"
          style={{
            display: 'block',
          }}
        />

        {/* ✅ DESKTOP CTA OVERLAY */}
        {bannerData.showCtaButton && (
          <div className="absolute inset-0">
            <div 
              className={`container h-full flex items-center ${getCtaPositionClasses()}`}
              style={{
                paddingBottom: '40px',
              }}
            >
              <button
                className="bg-yellow-400 text-black font-bold rounded-full transition-transform hover:scale-105 active:scale-95"
                style={{
                  padding: '16px 48px',
                  fontSize: '18px',
                  fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {bannerData.ctaText} →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );

  // ✅ RENDER: Wrap in Link if URL provided
  if (bannerData.linkUrl) {
    return (
      <Link 
        to={bannerData.linkUrl}
        className="block group"
        style={{
          cursor: 'pointer',
        }}
      >
        <BannerContent />
      </Link>
    );
  }

  return <BannerContent />;
}