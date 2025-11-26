import {useState} from 'react';
import {Link} from 'react-router';

interface NewsletterSignupProps {
  isMobile?: boolean;
}

interface NewsletterResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

export function NewsletterSignup({isMobile = false}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json() as NewsletterResponse;

      if (response.ok && data.success) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Något gick fel. Försök igen.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Något gick fel. Försök igen.');
    }
  };

  return (
    <div className={`${isMobile ? 'text-left' : ''}`}>
      <h4 className="text-white font-bold text-lg mb-4">
        Registrera dig för kul!
      </h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Ange e-postadress"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'submitting'}
          className="w-full px-4 py-3 text-gray-700 placeholder-gray-400 border-0 focus:outline-none focus:ring-0 disabled:opacity-50"
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
          disabled={status === 'submitting'}
          className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#2563eb',
          }}
        >
          {status === 'submitting' ? 'Registrerar...' : 'Registrera dig'}
        </button>

        {status === 'success' && (
          <p className="text-white text-sm bg-green-600/20 p-3 rounded-lg">
            ✓ Tack för din prenumeration!
          </p>
        )}
        
        {status === 'error' && (
          <p className="text-white text-sm bg-red-600/20 p-3 rounded-lg">
            ✗ {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}