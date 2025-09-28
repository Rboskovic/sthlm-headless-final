// FILE: app/components/LoginModal.tsx
// ✅ FIXED: Login modal that properly handles authentication and doesn't show inappropriately

import {useState, useEffect} from 'react';
import {X, User, Heart, Package} from 'lucide-react';
import {Link} from 'react-router';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: 'wishlist' | 'account' | 'checkout' | 'general';
  redirectAfterLogin?: string;
}

export function LoginModal({
  isOpen,
  onClose,
  context = 'general',
  redirectAfterLogin,
}: LoginModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isVisible) return null;

  // Context-specific content
  const getContextContent = () => {
    switch (context) {
      case 'wishlist':
        return {
          icon: <Heart size={48} className="text-pink-500 mb-4" />,
          title: 'Spara dina favoritprodukter',
          description: 'Logga in för att skapa och hantera din personliga önskelista.',
          benefits: [
            'Spara produkter för senare',
            'Få notiser när produkter kommer i lager',
            'Dela din önskelista med andra'
          ]
        };
      case 'checkout':
        return {
          icon: <Package size={48} className="text-blue-500 mb-4" />,
          title: 'Slutför ditt köp',
          description: 'Logga in för att spara dina uppgifter och spåra din order.',
          benefits: [
            'Snabbare kassa nästa gång',
            'Spåra dina beställningar',
            'Orderhistorik och kvitton'
          ]
        };
      case 'account':
        return {
          icon: <User size={48} className="text-purple-500 mb-4" />,
          title: 'Mitt Klosslabbet konto',
          description: 'Logga in för att komma åt ditt konto och alla funktioner.',
          benefits: [
            'Se orderhistorik',
            'Hantera adresser',
            'Kontoställningar'
          ]
        };
      default:
        return {
          icon: <User size={48} className="text-blue-500 mb-4" />,
          title: 'Välkommen tillbaka',
          description: 'Logga in för att komma åt alla funktioner.',
          benefits: [
            'Personlig önskelista',
            'Orderhistorik',
            'Snabbare kassa'
          ]
        };
    }
  };

  const contextContent = getContextContent();

  const getLoginUrl = () => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const redirectTo = redirectAfterLogin || currentPath;
    return `/account/login?redirect=${encodeURIComponent(redirectTo)}`;
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`
          absolute inset-0 bg-black
          transition-opacity duration-300 ease-out
          ${isOpen ? 'opacity-50' : 'opacity-0'}
        `}
        onClick={onClose}
      />

      {/* Modal Container - Mobile first, then desktop */}
      <div className="relative h-full flex items-end lg:items-center justify-center p-4">
        {/* Modal Content */}
        <div
          className={`
            w-full max-w-md bg-white rounded-t-2xl lg:rounded-2xl shadow-xl
            transform transition-all duration-300 ease-out
            ${isOpen 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-full lg:translate-y-0 opacity-0 scale-95'
            }
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Logga in
            </h2>
            <button
              onClick={onClose}
              className="p-2 -m-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Stäng modal"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            {/* Context Icon */}
            <div className="flex justify-center mb-4">
              {contextContent.icon}
            </div>

            {/* Title and Description */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {contextContent.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {contextContent.description}
            </p>

            {/* Benefits */}
            <div className="mb-8">
              <ul className="text-left space-y-2">
                {contextContent.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Login Button */}
            <Link
              to={getLoginUrl()}
              onClick={onClose}
              className="
                w-full inline-flex items-center justify-center
                px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
                hover:bg-blue-700 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
            >
              <User size={20} className="mr-2" />
              Logga in med Shop
            </Link>

            {/* Footer */}
            <p className="mt-4 text-xs text-gray-500">
              Genom att logga in godkänner du våra{' '}
              <Link to="/pages/kopvillkor" className="text-blue-600 hover:underline">
                användarvillkor
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}