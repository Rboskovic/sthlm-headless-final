// app/components/Header/MobileMenuFullscreen.tsx - Fixed with better image import and larger sizes
import {Suspense, useState} from 'react';
import {Link, Await} from 'react-router';
import {
  X,
  ChevronRight,
  ShoppingBag,
  Baby,
  Shirt,
  Gamepad2,
  Package,
  Heart,
  HelpCircle,
  LogIn, // Better login icon
} from 'lucide-react';
import {Image} from '@shopify/hydrogen';
import {WishlistsLink} from '../WishlistsLink'; // ✅ ONLY ADDITION
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

interface MobileMenuFullscreenProps {
  isOpen: boolean;
  onClose: () => void;
  shop: any;
  isLoggedIn: Promise<boolean>;
  popularCollections?: Collection[];
}

export function MobileMenuFullscreen({
  isOpen,
  onClose,
  shop,
  isLoggedIn,
  popularCollections = [],
}: MobileMenuFullscreenProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Full-screen menu */}
      <div className="fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out overflow-y-auto">
        {/* Header with logo and close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex-1">
            <MobileLogo shop={shop} />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Stäng meny"
          >
            <X size={24} />
          </button>
        </div>

        {/* User greeting section */}
        <div className="border-b border-gray-100">
          <Suspense fallback={<UserGreetingFallback />}>
            <Await resolve={isLoggedIn}>
              {(isLoggedIn) => <UserGreeting isLoggedIn={isLoggedIn} />}
            </Await>
          </Suspense>
        </div>

        {/* Main navigation */}
        <div className="py-4">
          <MainNavigation onClose={onClose} />
        </div>

        {/* Popular section */}
        <div className="px-4 py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Populära</h3>
          <PopularGrid collections={popularCollections} onClose={onClose} />
        </div>

        {/* Bottom links */}
        <div className="mt-auto border-t border-gray-100 px-4 py-4">
          <BottomLinks onClose={onClose} isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </div>
  );
}

function MobileLogo({shop}: {shop: any}) {
  const logoUrl = shop?.brand?.logo?.image?.url;
  const shopName = shop?.name || 'STHLM TOYS & GAMES';

  if (logoUrl) {
    return (
      <Link to="/" className="block">
        <Image
          data={{
            url: logoUrl,
            altText: `${shopName} logo`,
            width: 120,
            height: 40,
          }}
          sizes="120px"
          className="h-10 w-auto object-contain"
        />
      </Link>
    );
  }

  // Fallback text logo matching your brand
  return (
    <Link to="/" className="block">
      <div className="text-red-600 font-black text-xl leading-tight">
        STHLM
        <br />
        TOYS &<br />
        GAMES
      </div>
    </Link>
  );
}

function UserGreetingFallback() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-blue-100 rounded-full animate-pulse"></div>
        <span className="text-gray-400">Laddar...</span>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </div>
  );
}

function UserGreeting({isLoggedIn}: {isLoggedIn: boolean}) {
  // TODO: Get actual customer name from customer account query
  const customerName = 'Vale'; // This should come from customer data

  if (isLoggedIn) {
    return (
      <Link
        to="/account"
        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {customerName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-gray-900 font-medium">Hi, {customerName}</span>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </Link>
    );
  }

  return (
    <Link
      to="/account/login"
      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        {/* Improved login icon */}
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <LogIn size={14} className="text-white" />
        </div>
        <span className="text-gray-900 font-medium">Logga in</span>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </Link>
  );
}

function MainNavigation({onClose}: {onClose: () => void}) {
  const mainNavItems = [
    {
      id: 'toys',
      title: 'Leksaker',
      icon: ShoppingBag,
      color: 'bg-red-500',
      href: '/collections', // Will lead to all categories later
    },
    {
      id: 'shop-by-age',
      title: 'Handla efter ålder',
      icon: Baby,
      color: 'bg-blue-500',
      href: '/collections/age', // Will be specific results later
    },
    {
      id: 'shop-by-brand',
      title: 'Handla efter märke',
      icon: Shirt,
      color: 'bg-green-500',
      href: '/collections/brands', // Will be specific results later
    },
    {
      id: 'shop-by-character',
      title: 'Handla efter karaktär',
      icon: Gamepad2,
      color: 'bg-orange-500',
      href: '/collections/characters', // Will be specific results later
    },
  ];

  return (
    <div className="space-y-1">
      {mainNavItems.map((item) => (
        <Link
          key={item.id}
          to={item.href}
          onClick={onClose}
          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}
            >
              <item.icon size={18} className="text-white" />
            </div>
            <span className="text-gray-900 font-medium">{item.title}</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </Link>
      ))}
    </div>
  );
}

function PopularGrid({
  collections,
  onClose,
}: {
  collections: Collection[];
  onClose: () => void;
}) {
  // Debug logging to see what we're getting from Shopify
  console.log('PopularGrid - Collections received:', collections?.length || 0);
  console.log('PopularGrid - Collections data:', collections);
  if (collections?.length > 0) {
    console.log('PopularGrid - First collection sample:', collections[0]);
  }

  // Filter collections with mobile_menu_featured metafield and limit to 9 (updated from 8)
  const getMetafieldValue = (metafields: any, key: string): string | null => {
    if (!metafields || !Array.isArray(metafields)) return null;
    const metafield = metafields.find((field: any) => field?.key === key);
    return metafield?.value ? metafield.value : null;
  };

  const isTrueValue = (value: string | null): boolean => {
    if (!value) return false;
    const normalizedValue = value.toLowerCase().trim();
    return (
      normalizedValue === 'true' ||
      normalizedValue === '1' ||
      normalizedValue === 'yes'
    );
  };

  const featuredCollections =
    collections
      ?.filter((collection) => {
        const featuredValue = getMetafieldValue(
          collection.metafields,
          'mobile_menu_featured',
        );
        const hasImage = collection.image?.url;

        console.log(`Collection: ${collection.title}`, {
          featuredValue,
          hasImage,
          imageUrl: collection.image?.url,
          metafields: collection.metafields,
        });

        return isTrueValue(featuredValue);
      })
      ?.slice(0, 9) || []; // Updated from 8 to 9 items for 3x3 grid

  console.log(
    'PopularGrid - Featured collections:',
    featuredCollections.length,
  );

  // Fallback data with 9 items for perfect 3x3 grid
  const fallbackItems = [
    {id: 'deals', title: 'Erbjudanden', image: null, handle: 'deals'},
    {id: 'new', title: 'Nytt & Populärt', image: null, handle: 'new'},
    {id: 'all-toys', title: 'Alla Leksaker', image: null, handle: 'all-toys'},
    {id: 'lego', title: 'LEGO', image: null, handle: 'lego'},
    {id: 'minecraft', title: 'Minecraft', image: null, handle: 'minecraft'},
    {id: 'sonic', title: 'Sonic', image: null, handle: 'sonic'},
    {id: 'spiderman', title: 'Spiderman', image: null, handle: 'spiderman'},
    {id: 'disney', title: 'Disney', image: null, handle: 'disney'},
    {id: 'outdoor', title: 'Utomhus', image: null, handle: 'outdoor'}, // Added 9th item
  ];

  const displayItems =
    featuredCollections.length > 0 ? featuredCollections : fallbackItems;

  console.log(
    'PopularGrid - Display items:',
    displayItems.length,
    displayItems,
  );

  return (
    <div className="grid grid-cols-3 gap-4 mobile-menu-popular-grid">
      {displayItems.map((item) => (
        <Link
          key={item.id}
          to={`/collections/${item.handle}`}
          onClick={onClose}
          className="flex flex-col items-center mobile-menu-popular-item"
        >
          <div
            className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden"
            style={{
              width: '5rem', // Increased from 4rem to 5rem
              height: '5rem', // Increased from 4rem to 5rem
              backgroundColor: item.image?.url ? 'transparent' : '#f3f4f6',
            }}
          >
            {item.image?.url ? (
              <Image
                data={{
                  url: item.image.url,
                  altText: item.image.altText || item.title,
                  width: 80, // Increased from 64 to 80
                  height: 80, // Increased from 64 to 80
                }}
                sizes="80px" // Increased from 64px to 80px
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div
                className="w-full h-full rounded-xl flex items-center justify-center text-gray-500"
                style={{
                  backgroundColor: '#e5e7eb',
                  fontSize: '2rem', // Increased icon size
                }}
              >
                📦
              </div>
            )}
          </div>
          <span
            className="text-xs font-medium text-gray-700 text-center mt-2 mobile-popular-text"
            style={{
              fontSize: '0.75rem',
              lineHeight: '1rem',
              maxWidth: '5rem', // Increased from 4rem to 5rem
              wordWrap: 'break-word',
              hyphens: 'auto',
            }}
          >
            {item.title}
          </span>
        </Link>
      ))}
    </div>
  );
}

// ✅ ONLY CHANGE: Added isLoggedIn prop and smart wishlist handling
function BottomLinks({
  onClose,
  isLoggedIn,
}: {
  onClose: () => void;
  isLoggedIn: Promise<boolean>;
}) {
  const bottomLinks = [
    {
      id: 'orders',
      title: 'Mina beställningar',
      icon: Package,
      href: '/account/orders',
      color: 'text-blue-600',
    },
    {
      id: 'help',
      title: 'Hjälp',
      icon: HelpCircle,
      href: '/hjalp',
      color: 'text-blue-600',
    },
  ];

  return (
    <div className="space-y-1">
      {/* Orders and Help - unchanged */}
      {bottomLinks.map((link) => (
        <Link
          key={link.id}
          to={link.href}
          onClick={onClose}
          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <link.icon size={20} className={link.color} />
          <span className="text-gray-900 font-medium">{link.title}</span>
        </Link>
      ))}

      {/* ✅ ONLY CHANGE: Smart Wishlist Link */}
      <WishlistsLink
        isLoggedIn={isLoggedIn}
        onClose={onClose}
        variant="nav-item"
        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Heart size={20} className="text-blue-600" />
        <span className="text-gray-900 font-medium">Önskelista</span>
      </WishlistsLink>
    </div>
  );
}
