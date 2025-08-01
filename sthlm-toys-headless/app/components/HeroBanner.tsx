import {Link} from 'react-router';
import heroImage from '~/assets/hero3.png';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  mobileBackgroundImage?: string; // New prop for mobile-specific image
  overlayColor?: string;
}

export function HeroBanner({
  title = 'Bygg, skapa & föreställ dig',
  subtitle = 'Upptäck oändliga möjligheter med vår fantastiska LEGO-kollektion',
  buttonText = 'Handla nu',
  buttonLink = '/collections/lego',
  backgroundImage = heroImage,
  mobileBackgroundImage, // This will be your uploaded Shopify image URL
  overlayColor = 'transparent',
}: HeroBannerProps) {
  return (
    <section
      className="relative w-screen -mx-4 sm:-mx-6 lg:-mx-8"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        marginTop: 0,
        marginBottom: 0,
        width: '100vw',
        maxWidth: 'none',
      }}
    >
      {/* Mobile Hero Banner */}
      <div
        className="block lg:hidden relative aspect-[375/244] w-full"
        style={{
          backgroundImage: `url(${mobileBackgroundImage || backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#FFD42B', // LEGO yellow background
        }}
      >
        {/* Content - Moved higher up to avoid blocking plants/toys */}
        <div
          className="absolute inset-0 flex items-center justify-center text-center px-4"
          style={{paddingBottom: '60px'}}
        >
          {/* Title - Bold and centered like "FUN-TASTIC NEW!" */}
          <h1
            className="text-white font-black text-4xl leading-tight"
            style={{
              fontFamily:
                "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              fontSize: 'clamp(28px, 8vw, 48px)',
              fontWeight: 900,
              lineHeight: '1.1',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* CTA Button - Outside banner, styled like other category CTAs */}
      <div
        className="block lg:hidden flex justify-center"
        style={{marginTop: '16px', marginBottom: '24px'}}
      >
        <Link
          to={buttonLink}
          style={{
            display: 'inline-block',
            backgroundColor: '#1976D2',
            color: 'white',
            fontSize: '16px',
            fontWeight: 500,
            padding: '12px 32px',
            borderRadius: '24px',
            textDecoration: 'none',
            fontFamily:
              "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1565C0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1976D2';
          }}
        >
          {buttonText}
        </Link>
      </div>

      {/* Desktop Hero Banner - Keep existing layout */}
      <div
        className="hidden lg:block relative aspect-[64/21] xl:aspect-[219/71] bg-no-repeat w-full"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center right',
          backgroundColor: '#FFD42B',
        }}
      >
        {/* Optional Light Overlay for Text Readability */}
        {overlayColor !== 'transparent' && (
          <div
            className="absolute inset-0"
            style={{
              background: overlayColor,
            }}
          />
        )}

        {/* Content Container - aligned with header logo (existing desktop layout) */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div
            className="mx-auto flex items-center"
            style={{
              width: '1272px',
              paddingLeft: '12px',
              paddingRight: '12px',
            }}
          >
            <div className="flex flex-col gap-5 max-w-[580px]">
              {/* Text Content - aligned with header */}
              <div
                className="flex flex-col gap-4 text-left"
                style={{color: '#333333', overflowWrap: 'anywhere'}}
              >
                {/* Title */}
                <div className="text-6xl font-bold leading-tight">
                  <h3
                    style={{
                      fontFamily:
                        "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                      textShadow: '1px 1px 2px rgba(255,255,255,0.3)',
                    }}
                  >
                    {title}
                  </h3>
                </div>

                {/* Subtitle */}
                <div
                  className="text-xl leading-relaxed"
                  style={{
                    fontFamily:
                      "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                    textShadow: '1px 1px 1px rgba(255,255,255,0.2)',
                  }}
                >
                  {subtitle}
                </div>
              </div>

              {/* Button - left aligned with text */}
              <Link
                to={buttonLink}
                className="cursor-pointer flex justify-start pointer-events-auto"
              >
                <button
                  className="bg-white border-2 border-gray-300 hover:bg-gray-100 active:bg-gray-200 text-gray-900 flex items-center justify-center rounded-full gap-2 min-h-[48px] font-medium px-6"
                  style={{
                    fontFamily:
                      "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                    fontSize: '16px',
                    fontWeight: 500,
                    paddingLeft: '24px',
                    paddingRight: '24px',
                  }}
                >
                  {buttonText}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
