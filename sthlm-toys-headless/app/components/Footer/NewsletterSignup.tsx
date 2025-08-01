import {useState} from 'react';

interface NewsletterSignupProps {
  isMobile?: boolean;
}

export function NewsletterSignup({isMobile = false}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to newsletter service
    setEmail(''); // Clear form on success
  };

  return (
    <div className={`${isMobile ? 'text-center' : ''}`}>
      <h3 className="text-white text-xl font-bold mb-2">
        Registrera dig för kul!
      </h3>
      <p className="text-white text-sm mb-4 leading-relaxed">
        Få exklusiva uppdateringar om nya leksaker, lekidéer och recensioner!
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Ange e-postadress"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-medium"
          style={{
            borderRadius: '12px',
            fontSize: '16px',
            fontFamily: 'inherit',
            border: 'none',
            boxShadow: 'none',
          }}
          required
        />
        <button
          type="submit"
          className="w-full text-black font-bold py-3 px-6 transition-colors border-2 border-white rounded-lg hover:opacity-90"
          style={{
            backgroundColor: 'rgba(255,212,43,1)',
          }}
        >
          Registrera dig
        </button>
      </form>

      <p className="text-white text-xs mt-3 leading-relaxed">
        Genom att registrera dig för vårt nyhetsbrev godkänner du våra{' '}
        <a
          href="/terms"
          className="text-white underline hover:text-yellow-300"
          style={{color: 'white', textDecoration: 'underline'}}
        >
          villkor
        </a>{' '}
        &{' '}
        <a
          href="/privacy"
          className="text-white underline hover:text-yellow-300"
          style={{color: 'white', textDecoration: 'underline'}}
        >
          integritetspolicy
        </a>
        .
      </p>
    </div>
  );
}
