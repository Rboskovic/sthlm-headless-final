// ✅ OFFICIAL: Component using Shopify's accepted card brands

interface PaymentIconsProps {
  acceptedCardBrands: string[];
}

export function PaymentIcons({ acceptedCardBrands }: PaymentIconsProps) {
  if (!acceptedCardBrands?.length) return null;

  return (
    <div className="payment-icons">
      <h3 className="text-white text-lg font-semibold mb-4 text-center">
        Our payment methods
      </h3>
      
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {acceptedCardBrands.map((brand) => (
          <PaymentIcon key={brand} brand={brand} />
        ))}
      </div>
    </div>
  );
}

function PaymentIcon({ brand }: { brand: string }) {
  // Convert brand names to match Shopify's icon naming
  const iconName = brand.toLowerCase().replace(' ', '_');
  
  // Official Shopify CDN for payment icons
  const iconUrl = `https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/${iconName}-4c372e8d.svg`;

  return (
    <div className="bg-white rounded-lg p-2 h-12 min-w-16 flex items-center justify-center shadow-sm">
      <img
        src={iconUrl}
        alt={`${brand} payment accepted`}
        className="h-6 w-auto object-contain"
        onError={(e) => {
          // Hide broken images
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}