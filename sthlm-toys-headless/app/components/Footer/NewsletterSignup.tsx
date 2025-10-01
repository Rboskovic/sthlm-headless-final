import {useState} from 'react';
import {Link} from 'react-router';

interface NewsletterSignupProps {
  isMobile?: boolean;
}

export function NewsletterSignup({isMobile = false}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Shopify Customer API or newsletter service
    console.log('Newsletter signup:', email);
    setEmail(''); // Clear form on success
  };

  return (
    <div className={`${isMobile ? 'text-left' : ''}`}>
      <h4 className="text-white font-bold text-lg mb-4">
        Registrera dig för kul!
      </h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input - Keep as is */}
        <input
          type="email"
          placeholder="Ange e-postadress"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 text-gray-700 placeholder-gray-400 border-0 focus:outline-none focus:ring-0"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: 'inherit',
            boxShadow: 'none',
            border: 'none',
          }}
          required
        />
        
        {/* Privacy Text - Before button */}
        <p className="text-white text-xs leading-relaxed mb-6">
          Genom att registrera dig för vårt nyhetsbrev godkänner du våra{' '}
          <Link
            to="/pages/kopvillkor"
            className="text-white underline hover:text-yellow-300"
            style={{color: 'white', textDecoration: 'underline'}}
          >
            villkor
          </Link>{' '}
          och vår{' '}
          <Link
            to="/pages/integritetspolicy"
            className="text-white underline hover:text-yellow-300"
            style={{color: 'white', textDecoration: 'underline'}}
          >
            integritetspolicy
          </Link>
          .
        </p>

        <button
          type="submit"
          className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors mt-3"
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#2563eb',
          }}
        >
          Registrera dig
        </button>
      </form>
    </div>
  );
}