import { Link } from "react-router";
import heroImage from "~/assets/hero3.png";

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  overlayColor?: string;
}

export function HeroBanner({
  title = "Build, Create & Imagine",
  subtitle = "Discover endless possibilities with our amazing LEGO collection",
  buttonText = "Shop Now",
  buttonLink = "/collections/lego",
  backgroundImage = heroImage,
  overlayColor = "transparent", // No overlay needed for transparent PNG
}: HeroBannerProps) {
  return (
    <section
      className="relative w-screen -mx-4 sm:-mx-6 lg:-mx-8"
      style={{
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        marginTop: 0,
        marginBottom: 0,
        width: "100vw",
        maxWidth: "none",
      }}
    >
      {/* Full-width banner with Smyths aspect ratios */}
      <div
        className="relative block aspect-[375/244] sm:aspect-[640/323] md:aspect-[768/387] lg:aspect-[64/21] xl:aspect-[219/71] bg-no-repeat w-full"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "contain",
          backgroundPosition: "center right",
          backgroundColor: "#FFD42B",
          marginTop: 0,
          paddingTop: 0,
        }}
      >
        {/* Optional Light Overlay for Text Readability - removed for transparent PNG */}
        {overlayColor !== "transparent" && (
          <div
            className="absolute inset-0"
            style={{
              background: overlayColor,
            }}
          />
        )}

        {/* Content Container - aligned with header logo */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div
            className="mx-auto flex items-center"
            style={{
              width: "1272px",
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
          >
            <div className="flex flex-col gap-5 sm:gap-4 md:gap-5 max-w-[300px] md:max-w-[360px] lg:max-w-[460px] xl:max-w-[580px]">
              {/* Text Content - aligned with header */}
              <div
                className="flex flex-col gap-3 sm:gap-4 text-left"
                style={{ color: "#333333", overflowWrap: "anywhere" }}
              >
                {/* Title - one size smaller on XL */}
                <div className="text-4xl sm:text-5xl md:text-6xl xl:text-6xl font-bold leading-tight">
                  <h3
                    style={{
                      fontFamily:
                        "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                      textShadow: "1px 1px 2px rgba(255,255,255,0.3)",
                    }}
                  >
                    {title}
                  </h3>
                </div>

                {/* Subtitle - using Smyths text sizing */}
                <div
                  className="text-lg md:text-xl lg:text-xl leading-relaxed"
                  style={{
                    fontFamily:
                      "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                    textShadow: "1px 1px 1px rgba(255,255,255,0.2)",
                  }}
                >
                  {subtitle}
                </div>
              </div>

              {/* Button - left aligned with text */}
              <Link
                to={buttonLink}
                className="cursor-pointer flex justify-start"
                role="link"
                tabIndex={0}
              >
                <button
                  className="enabled:active:shadow-inner focus-visible:shadow-blue bg-white border-2 border-gray-300 hover:bg-gray-100 active:bg-gray-200 text-gray-900 flex items-center justify-center rounded-full gap-2 min-h-[42px] font-medium focus-visible:outline-none hover:text-gray-900 px-6 leading-[1.2] min-h-[48px] pointer-events-auto"
                  style={{
                    fontFamily:
                      "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                    fontSize: "16px",
                    fontWeight: 500,
                    lineHeight: "19.2px",
                    paddingLeft: "24px",
                    paddingRight: "24px",
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
