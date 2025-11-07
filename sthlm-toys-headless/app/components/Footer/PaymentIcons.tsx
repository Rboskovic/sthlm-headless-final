// FILE: app/components/Footer/PaymentIcons.tsx
// ✅ UPDATED: White backgrounds for PayPal, Google Pay, Apple Pay

export function PaymentIcons() {
  // Your 8 accepted payment methods with background requirement flags
  const paymentMethods = [
    {
      name: 'Visa',
      url: 'https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/visa.sxIq5Dot.svg',
      needsWhiteBackground: false
    },
    {
      name: 'Mastercard', 
      url: 'https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/mastercard.1c4_lyMp.svg',
      needsWhiteBackground: false
    },
    {
      name: 'Maestro',
      url: 'https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/maestro.ByfUQi1c.svg',
      needsWhiteBackground: false
    },
    {
      name: 'American Express',
      url: 'https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/amex.Csr7hRoy.svg',
      needsWhiteBackground: false
    },
    {
      name: 'Paypal',
      url: 'https://cdn.shopify.com/s/files/1/0900/8811/2507/files/paypal-icon.svg?v=1756983873',
      needsWhiteBackground: true // ✅ PayPal needs white background
    },
    {
      name: 'Klarna',
      url: 'https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/klarna-pay-later.BYbG9Au4.svg',
      needsWhiteBackground: false
    },
    {
      name: 'Google Pay',
      url: 'https://cdn.shopify.com/s/files/1/0900/8811/2507/files/Google-Pay--Streamline-Svg-Logos.svg?v=1756984022',
      needsWhiteBackground: true // ✅ Google Pay needs white background
    },
    {
      name: 'Apple Pay',
      url: 'https://cdn.shopify.com/s/files/1/0900/8811/2507/files/Apple-Pay--Streamline-Svg-Logos.svg?v=1756984019',
      needsWhiteBackground: true // ✅ Apple Pay needs white background
    }
  ];

  return (
    <div className="payment-methods-section">
      <h3 className="text-white text-lg font-semibold mb-4">
        Våra betalningsmetoder
      </h3>
      
      <div className="flex items-center gap-2 flex-wrap">
        {paymentMethods.map((method) => (
          <div key={method.name} className="h-8 min-w-12 flex items-center justify-center">
            <div
              className={`flex items-center justify-center ${
                method.needsWhiteBackground 
                  ? 'bg-white rounded-sm px-1' 
                  : ''
              }`}
              style={{
                // Ensure proper sizing for icons with white backgrounds
                minWidth: method.needsWhiteBackground ? '32px' : 'auto',
                height: method.needsWhiteBackground ? '24px' : 'auto',
              }}
            >
              <img
                src={method.url}
                alt={`${method.name} betalning accepteras`}
                title={`Betala med ${method.name}`}
                className="h-6 w-auto object-contain max-w-12"
                loading="lazy"
                style={{
                  // Slightly smaller icons when they have white backgrounds to fit better
                  height: method.needsWhiteBackground ? '20px' : '24px',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">
        Vi accepterar betalning med: Visa, Mastercard, American Express, Maestro, PayPal, Klarna, Google Pay, Apple Pay
      </span>
    </div>
  );
}