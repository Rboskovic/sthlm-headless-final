import {Link} from 'react-router';

interface AgeGroup {
  id: string;
  ageRange: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
  handle: string; // Shopify collection handle
}

interface ShopByAgeProps {
  title?: string;
}

// Age groups matching the screenshot with Swedish translations
const ageGroups: AgeGroup[] = [
  {
    id: '0-18-months',
    ageRange: '0–18',
    subtitle: 'MÅNADER',
    backgroundColor: '#B8E6E1', // Light cyan
    textColor: '#2C5F5D', // Dark teal
    handle: 'age-0-18-months', // You'll create this collection in Shopify
  },
  {
    id: '18-36-months',
    ageRange: '18–36',
    subtitle: 'MÅNADER',
    backgroundColor: '#C8B5E8', // Light purple
    textColor: '#6B4C93', // Dark purple
    handle: 'age-18-36-months',
  },
  {
    id: '3-5-years',
    ageRange: '3–5',
    subtitle: 'ÅR',
    backgroundColor: '#A8E6CF', // Light mint green
    textColor: '#2D5A41', // Dark green
    handle: 'age-3-5-years',
  },
  {
    id: '6-8-years',
    ageRange: '6–8',
    subtitle: 'ÅR',
    backgroundColor: '#F5C99B', // Light orange/peach
    textColor: '#B8651B', // Dark orange
    handle: 'age-6-8-years',
  },
  {
    id: '9-11-years',
    ageRange: '9–11',
    subtitle: 'ÅR',
    backgroundColor: '#A8C8EC', // Light blue
    textColor: '#2B5A87', // Dark blue
    handle: 'age-9-11-years',
  },
  {
    id: 'big-kids',
    ageRange: 'STÖRRE',
    subtitle: 'BARN',
    backgroundColor: '#F5B2C4', // Light pink
    textColor: '#B8527A', // Dark pink
    handle: 'age-big-kids',
  },
];

export function ShopByAge({title = 'Handla efter ålder'}: ShopByAgeProps) {
  return (
    <section className="w-full bg-white">
      {/* Container matching header width */}
      <div
        className="mx-auto"
        style={{
          width: '1272px',
          maxWidth: '100%',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '8px',
          paddingBottom: '8px',
        }}
      >
        {/* Section Title */}
        <h2
          className="text-black font-medium mb-8 text-center"
          style={{
            fontSize: '30px',
            fontWeight: 700,
            lineHeight: '36px',
            marginBottom: '48px',
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
          {ageGroups.map((ageGroup) => (
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
                  className="font-semibold"
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
