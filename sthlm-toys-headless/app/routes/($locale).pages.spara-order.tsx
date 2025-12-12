// FILE: app/routes/($locale).pages.spara-order.tsx
// ✅ Order tracking page with DB Schenker integration

import {useState} from 'react';
import {Package, Search, ExternalLink} from 'lucide-react';

export const meta = () => {
  return [
    {title: 'Spåra Din Order | Klosslabbet'},
    {
      name: 'description',
      content:
        'Spåra din beställning från Klosslabbet med DB Schenker. Ange ditt spårningsnummer för att se var ditt paket är.',
    },
  ];
};

// ✅ SHOPIFY URLs
const SHOP_ID = '90088112507';
const SHOPIFY_ACCOUNT_URL = `https://shopify.com/${SHOP_ID}/account`;

// ✅ DB Schenker tracking URL pattern
const DB_SCHENKER_BASE_URL = 'https://www.dbschenker.com/app/tracking-public/';

export default function TrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState('');

  const validateAndRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedNumber = trackingNumber.trim();

    // Validation: Check if empty
    if (!trimmedNumber) {
      setError('Vänligen ange ett spårningsnummer');
      return;
    }

    // Build DB Schenker URL - no format validation, DB Schenker handles it
    const trackingUrl = `${DB_SCHENKER_BASE_URL}?refNumber=${trimmedNumber}&language_region=sv-SE_SE&uiMode=details-se`;

    // Redirect to DB Schenker
    window.location.href = trackingUrl;
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '672px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '48px',
          }}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Package className="w-8 h-8 text-blue-600" />
          </div>

          <h1
            className="text-5xl font-bold text-gray-900 mb-4 tracking-tight"
            style={{textAlign: 'center'}}
          >
            Spåra Din Order
          </h1>
          <p
            className="text-xl text-gray-600 leading-relaxed"
            style={{textAlign: 'center', maxWidth: '640px', margin: '0 auto'}}
          >
            Hitta ditt spårningsnummer i orderbekräftelsen via e-post. Klicka på
            spårningslänken direkt, eller ange ditt spårningsnummer här för att
            kontrollera din försändelse med DB Schenker.
          </p>
          <p
            className="text-sm text-gray-500 mt-3"
            style={{textAlign: 'center', maxWidth: '640px', margin: '12px auto 0'}}
          >
            <em>
              Observera: Spårningsinformation via e-post skickas endast om du
              godkände marknadsföring vid kassan.
            </em>
          </p>
        </div>

        {/* Main Card - Centered */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <form onSubmit={validateAndRedirect} className="space-y-6">
            {/* Input Field */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <label
                htmlFor="trackingNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ textAlign: 'center' }}
              >
                Spårningsnummer <span className="text-red-500">*</span>
              </label>
              <div className="relative" style={{ width: '100%', maxWidth: '400px' }}>
                <input
                  type="text"
                  id="trackingNumber"
                  name="trackingNumber"
                  value={trackingNumber}
                  onChange={(e) => {
                    setTrackingNumber(e.target.value);
                    setError('');
                  }}
                  className={`w-full px-4 py-3 border ${
                    error ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center`}
                  required
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-2 flex items-start justify-center">
                  <svg
                    className="h-5 w-5 text-red-500 mt-0.5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                style={{ width: '100%', maxWidth: '400px' }}
              >
                <ExternalLink className="w-5 h-5" />
                <span>Spåra Försändelse</span>
              </button>
            </div>
          </form>

          {/* Account Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Har du redan ett konto?{' '}
              <a
                href={SHOPIFY_ACCOUNT_URL}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Kolla här
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}