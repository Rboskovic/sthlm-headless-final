// app/components/Header/MobileMenuFullscreen.tsx
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
} from 'lucide-react';
import {Image} from '@shopify/hydrogen';
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular</h3>
          <PopularGrid collections={popularCollections} onClose={onClose} />
        </div>

        {/* Bottom links */}
        <div className="mt-auto border-t border-gray-100 px-4 py-4">
          <BottomLinks onClose={onClose} />
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
        <span className="text-gray-400">Loading...</span>
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
        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">?</span>
        </div>
        <span className="text-gray-900 font-medium">Log in</span>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </Link>
  );
}

function MainNavigation({onClose}: {onClose: () => void}) {
  const mainNavItems = [
    {
      id: 'toys',
      title: 'Toys',
      icon: ShoppingBag,
      color: 'bg-red-500',
      href: '/collections', // Will lead to all categories later
    },
    {
      id: 'shop-by-age',
      title: 'Shop by age',
      icon: Baby,
      color: 'bg-blue-500',
      href: '/collections/age', // Will be specific results later
    },
    {
      id: 'shop-by-brand',
      title: 'Shop by brand',
      icon: Shirt,
      color: 'bg-green-500',
      href: '/collections/brands', // Will be specific results later
    },
    {
      id: 'shop-by-character',
      title: 'Shop by character',
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
  // Filter collections with mobile_menu_featured metafield and limit to 8
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

  const featuredCollections = collections
    .filter((collection) => {
      const featuredValue = getMetafieldValue(
        collection.metafields,
        'mobile_menu_featured',
      );
      return isTrueValue(featuredValue) && collection.image?.url;
    })
    .slice(0, 8); // Limit to 8 items

  // Fallback data if no collections available
  const fallbackItems = [
    {id: 'deals', title: 'Deals', image: null, handle: 'deals'},
    {id: 'new', title: 'New & Trending', image: null, handle: 'new'},
    {id: 'all-toys', title: 'All Toys', image: null, handle: 'all-toys'},
    {id: 'lego', title: 'LEGO', image: null, handle: 'lego'},
    {id: 'minecraft', title: 'Minecraft', image: null, handle: 'minecraft'},
    {id: 'sonic', title: 'Sonic', image: null, handle: 'sonic'},
    {id: 'spiderman', title: 'Spiderman', image: null, handle: 'spiderman'},
    {id: 'disney', title: 'Disney', image: null, handle: 'disney'},
  ];

  const displayItems =
    featuredCollections.length > 0 ? featuredCollections : fallbackItems;

  return (
    <div className="grid grid-cols-4 gap-4">
      {displayItems.map((item) => (
        <Link
          key={item.id}
          to={`/collections/${item.handle}`}
          onClick={onClose}
          className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {item.image?.url ? (
              <Image
                data={{
                  url: item.image.url,
                  altText: item.image.altText || item.title,
                  width: 64,
                  height: 64,
                }}
                sizes="64px"
                className="w-full h-full object-cover"
              />
            ) : (
              <Package size={24} className="text-gray-400" />
            )}
          </div>
          <span className="text-xs font-medium text-gray-900 text-center leading-tight">
            {item.title}
          </span>
        </Link>
      ))}
    </div>
  );
}

function BottomLinks({onClose}: {onClose: () => void}) {
  const bottomLinks = [
    {
      id: 'orders',
      title: 'My orders',
      icon: Package,
      href: '/account/orders',
      color: 'text-blue-600',
    },
    {
      id: 'wishlist',
      title: 'Wishlist',
      icon: Heart,
      href: '/account/wishlist',
      color: 'text-blue-600',
    },
    {
      id: 'help',
      title: 'Help',
      icon: HelpCircle,
      href: '/hjalp',
      color: 'text-blue-600',
    },
  ];

  return (
    <div className="space-y-1">
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
    </div>
  );
}
