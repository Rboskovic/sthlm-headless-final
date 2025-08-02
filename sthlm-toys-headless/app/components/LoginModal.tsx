// FILE: app/components/LoginModal.tsx
// ✅ FIXED: Desktop modal shows + mobile styling improvements

import {useState, useEffect} from 'react';
import {X} from 'lucide-react';
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
  const getModalTitle = () => {
    switch (context) {
      case 'wishlist':
        return 'Add to wishlist';
      case 'checkout':
        return 'Sign in to continue';
      case 'account':
        return 'Your STHLM Toys account';
      default:
        return 'Sign in';
    }
  };

  const getModalDescription = () => {
    switch (context) {
      case 'wishlist':
        return 'Please sign in to create and share your wishlist.';
      case 'checkout':
        return 'Sign in to complete your order and track your purchases.';
      case 'account':
        return 'Access your account to view orders, wishlist, and more.';
      default:
        return 'Sign in to your account to access all features.';
    }
  };

  const getLoginRedirectUrl = () => {
    if (redirectAfterLogin)
      return `/account/login?redirect=${encodeURIComponent(redirectAfterLogin)}`;
    if (context === 'wishlist')
      return '/account/login?redirect=/account/wishlist';
    return '/account/login';
  };

  const getRegisterRedirectUrl = () => {
    if (redirectAfterLogin)
      return `/account/register?redirect=${encodeURIComponent(redirectAfterLogin)}`;
    if (context === 'wishlist')
      return '/account/register?redirect=/account/wishlist';
    return '/account/register';
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

      {/* Mobile Modal - slides from bottom */}
      <div
        className={`
          absolute left-0 right-0 bottom-0
          bg-white shadow-xl rounded-t-2xl
          max-h-[80vh] 
          transform transition-all duration-300 ease-out
          lg:hidden
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{
          fontFamily:
            "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
        }}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {getModalTitle()}
          </h2>
          <button
            onClick={onClose}
            className="
              w-8 h-8 flex items-center justify-center
              text-gray-400 hover:text-gray-600 hover:bg-gray-100
              rounded-full transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Content */}
        <div className="p-6 overflow-y-auto">
          {/* ✅ FIXED: Added padding to description text */}
          <p className="text-gray-600 mb-6 text-center px-4">
            {getModalDescription()}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* ✅ FIXED: White Sign In Button */}
            <Link
              to={getLoginRedirectUrl()}
              className="
                w-full block text-center
                bg-white hover:bg-gray-50
                text-blue-600 font-medium
                py-3 px-6 rounded-lg
                border-2 border-blue-600
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
              onClick={onClose}
            >
              Sign in
            </Link>

            {/* Social Login Options */}
            <div className="space-y-2">
              <button
                className="
                  w-full flex items-center justify-center
                  bg-blue-600 hover:bg-blue-700
                  text-white font-medium
                  py-3 px-6 rounded-lg
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                "
                onClick={() => {
                  console.log('Facebook login clicked');
                  onClose();
                }}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </button>

              <button
                className="
                  w-full flex items-center justify-center
                  bg-white hover:bg-gray-50
                  text-gray-900 font-medium
                  py-3 px-6 rounded-lg
                  border-2 border-gray-300
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                "
                onClick={() => {
                  console.log('Google login clicked');
                  onClose();
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Create Account Button */}
            <Link
              to={getRegisterRedirectUrl()}
              className="
                w-full block text-center
                bg-blue-600 hover:bg-blue-700
                text-white font-medium
                py-3 px-6 rounded-lg
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
              onClick={onClose}
            >
              Create an account
            </Link>
          </div>

          {/* Legal Terms */}
          <div className="mt-6 text-xs text-gray-500 text-center">
            By clicking sign in or continuing, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 hover:underline">
              Terms & Conditions
            </Link>{' '}
            and our{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ FIXED: Desktop Modal - separate element, slides from right */}
      <div
        className={`
          hidden lg:block
          absolute top-0 right-0 bottom-0 
          w-96 max-w-md
          bg-white shadow-xl rounded-l-2xl
          transform transition-all duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{
          fontFamily:
            "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
        }}
      >
        {/* Desktop Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {getModalTitle()}
          </h2>
          <button
            onClick={onClose}
            className="
              w-8 h-8 flex items-center justify-center
              text-gray-400 hover:text-gray-600 hover:bg-gray-100
              rounded-full transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Desktop Content */}
        <div className="p-6 overflow-y-auto h-full">
          {/* Description */}
          <p className="text-gray-600 mb-6 text-center">
            {getModalDescription()}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Sign In Button */}
            <Link
              to={getLoginRedirectUrl()}
              className="
                w-full block text-center
                bg-blue-600 hover:bg-blue-700
                text-white font-medium
                py-3 px-6 rounded-lg
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
              onClick={onClose}
            >
              Sign in
            </Link>

            {/* Social Login Options */}
            <div className="space-y-2">
              <button
                className="
                  w-full flex items-center justify-center
                  bg-blue-600 hover:bg-blue-700
                  text-white font-medium
                  py-3 px-6 rounded-lg
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                "
                onClick={() => {
                  console.log('Facebook login clicked');
                  onClose();
                }}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </button>

              <button
                className="
                  w-full flex items-center justify-center
                  bg-white hover:bg-gray-50
                  text-gray-900 font-medium
                  py-3 px-6 rounded-lg
                  border-2 border-gray-300
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                "
                onClick={() => {
                  console.log('Google login clicked');
                  onClose();
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Create Account Button */}
            <Link
              to={getRegisterRedirectUrl()}
              className="
                w-full block text-center
                bg-white hover:bg-gray-50
                text-blue-600 font-medium
                py-3 px-6 rounded-lg
                border-2 border-blue-600
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
              onClick={onClose}
            >
              Create an account
            </Link>
          </div>

          {/* Legal Terms */}
          <div className="mt-6 text-xs text-gray-500 text-center">
            By clicking sign in or continuing, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 hover:underline">
              Terms & Conditions
            </Link>{' '}
            and our{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ SHOPIFY STANDARDS: Export types for TypeScript
export type {LoginModalProps};
