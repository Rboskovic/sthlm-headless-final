// FILE: app/components/ShopByAge.tsx
// ✅ FIXED: Reduced top padding to minimize gap from hero banner

import {Link} from 'react-router';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

interface ShopByAgeProps {
  title?: string;
  ageGroups?: Collection[];
}

interface AgeGroup {
  id: string;
  title: string;
  ageRange: string;
  subtitle: string;
  handle: string;
  backgroundColor: string;
  textColor: string;
}

/**
 * ShopByAge Component
 * ✅ FIXED: Reduced top padding for better spacing from hero banner
 */
export function ShopByAge({
  title = 'Handla efter ålder',
  ageGroups = [],
}: ShopByAgeProps) {
  // Default age groups configuration
  const defaultAgeGroups: AgeGroup[] = [
    {
      id: '1',
      title: 'Ålder 1½+',
      ageRange: 'ÅLDER 1½+',
      subtitle: 'KREATIVITET',
      handle: 'age-1-5-plus',
      backgroundColor: '#87CEEB',
      textColor: '#000000',
    },
    {
      id: '2', 
      title: 'Ålder 4+',
      ageRange: 'ÅLDER 4+',
      subtitle: 'FANTASI',
      handle: 'age-4-plus',
      backgroundColor: '#FF6B6B',
      textColor: '#FFFFFF',
    },
    {
      id: '3',
      title: 'Ålder 6+',
      ageRange: 'ÅLDER 6+', 
      subtitle: 'ÄVENTYR',
      handle: 'age-6-plus',
      backgroundColor: '#4ECDC4',
      textColor: '#000000',
    },
    {
      id: '4',
      title: 'Ålder 9+',
      ageRange: 'ÅLDER 9+',
      subtitle: 'UTMANING',
      handle: 'age-9-plus',
      backgroundColor: '#FFD93D',
      textColor: '#000000',
    },
    {
      id: '5',
      title: 'Ålder 13+',
      ageRange: 'ÅLDER 13+',
      subtitle: 'KOMPLEXITET',
      handle: 'age-13-plus',
      backgroundColor: '#FF8ED4',
      textColor: '#000000',
    },
    {
      id: '6',
      title: 'Vuxna',
      ageRange: 'VUXNA',
      subtitle: 'PASSION',
      handle: 'age-adults',
      backgroundColor: '#95A5A6',
      textColor: '#FFFFFF',
    },
  ];

  return (
    <section className="w-full bg-white">
      {/* ✅ FIXED: Reduced top padding from 64px to 32px */}
      <div
        className="mx-auto"
        style={{
          width: '1272px',
          maxWidth: '100%',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '32px', // ✅ REDUCED: From 64px to 32px
          paddingBottom: '64px',
        }}
      >
        {/* Section Title - STANDARDIZED STYLING */}
        <h2
          className="text-black font-medium mb-6"
          style={{
            fontSize: '24px',
            fontWeight: 500,
            lineHeight: '32.4px',
            marginBottom: '24px',
            fontFamily:
              "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
            color: 'rgb(32, 34, 35)',
          }}
        >
          {title}
        </h2>

        {/* Age Groups Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          style={{
            gap: '24px',
            justifyItems: 'center',
          }}
        >
          {defaultAgeGroups.map((ageGroup) => (
            <Link
              key={ageGroup.id}
              to={`/collections/${ageGroup.handle}`}
              className="group flex flex-col items-center"
            >
              {/* Circular Age Button */}
              <div
                className="flex flex-col items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                style={{
                  width: '180px',
                  height: '180px',
                  backgroundColor: ageGroup.backgroundColor,
                  marginBottom: '16px',
                }}
              >
                {/* Age Range */}
                <div
                  className="font-bold"
                  style={{
                    fontSize: '36px',
                    fontWeight: 700,
                    lineHeight: '43.2px',
                    color: ageGroup.textColor,
                    fontFamily:
                      "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                    marginBottom: '4px',
                  }}
                >
                  {ageGroup.ageRange}
                </div>

                {/* Subtitle */}
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    lineHeight: '19.2px',
                    color: ageGroup.textColor,
                    fontFamily:
                      "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                    letterSpacing: '0.5px',
                  }}
                >
                  {ageGroup.subtitle}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}