// FILE: app/components/Footer/PaymentIcons.tsx
// ✅ HARDCODED: All 5 payment methods, Swedish text, no white backgrounds

export function PaymentIcons() {
  // Hardcoded - your 5 accepted payment methods with working Shopify URLs
  const paymentMethods = [
    {
      name: 'Visa',
      url: 'https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/visa.sxIq5Dot.svg'
    },
    {
      name: 'Mastercard', 
      url: 'https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/mastercard.1c4_lyMp.svg'
    },
    {
      name: 'American Express',
      url: 'https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/amex.Csr7hRoy.svg'
    },
    {
      name: 'Maestro',
      url: 'https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/maestro.ByfUQi1c.svg'
    },
    {
      name: 'Klarna',
      url: 'https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/klarna-pay-later.BYbG9Au4.svg'
    }
  ];

  return (
    <div className="payment-methods-section">
      <h3 className="text-white text-lg font-semibold mb-4">
        Våra betalningsmetoder
      </h3>
      
      <div className="flex items-center gap-3 flex-wrap">
        {paymentMethods.map((method) => (
          <div key={method.name} className="h-8 min-w-12 flex items-center justify-center">
            <img
              src={method.url}
              alt={`${method.name} betalning accepteras`}
              title={`Betala med ${method.name}`}
              className="h-6 w-auto object-contain max-w-12"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <span className="sr-only">
        Vi accepterar betalning med: Visa, Mastercard, American Express, Maestro, Klarna
      </span>
    </div>
  );
}