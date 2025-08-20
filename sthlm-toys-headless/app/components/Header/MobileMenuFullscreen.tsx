// app/components/Header/MobileMenuFullscreen.tsx - Fixed: Proper Logo import
import {Suspense, useState} from 'react';
import {Link, Await} from 'react-router';
import {
  X,
  ChevronRight,
  ChevronLeft,
  LogIn,
  User,
  Heart,
  Package,
  HelpCircle,
} from 'lucide-react';
import {Image} from '@shopify/hydrogen';
import {Logo} from './Logo'; // ✅ FIXED: Import proper Logo component
import {WishlistsLink} from '../WishlistsLink';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import type {Menu, MenuItem} from './types';

interface MobileMenuFullscreenProps {
  isOpen: boolean;
  onClose: () => void;
  shop: any;
  isLoggedIn: Promise<boolean>;
  popularCollections?: Collection[];
  menu?: Menu | null;
  primaryDomainUrl?: string;
  publicStoreDomain?: string;
}

// Navigation state types
type NavigationLevel = 'main' | 'level2' | 'level3';

interface NavigationState {
  level: NavigationLevel;
  currentItem: MenuItem | null;
  parentItem: MenuItem | null;
  breadcrumb: MenuItem[];
}

export function MobileMenuFullscreen({
  isOpen,
  onClose,
  shop,
  isLoggedIn,
  popularCollections = [],
  menu,
  primaryDomainUrl = '',
  publicStoreDomain = '',
}: MobileMenuFullscreenProps) {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    level: 'main',
    currentItem: null,
    parentItem: null,
    breadcrumb: [],
  });

  // Reset navigation state when menu closes
  const handleClose = () => {
    setNavigationState({
      level: 'main',
      currentItem: null,
      parentItem: null,
      breadcrumb: [],
    });
    onClose();
  };

  const getUrl = (url: string | null | undefined): string => {
    if (!url) return '/';
    if (
      url.includes('myshopify.com') ||
      url.includes(publicStoreDomain) ||
      url.includes(primaryDomainUrl)
    ) {
      return new URL(url).pathname;
    }
    return url;
  };

  // Navigation handlers
  const navigateToLevel2 = (item: MenuItem) => {
    setNavigationState({
      level: 'level2',
      currentItem: item,
      parentItem: null,
      breadcrumb: [item],
    });
  };

  const navigateToLevel3 = (item: MenuItem) => {
    setNavigationState({
      level: 'level3',
      currentItem: item,
      parentItem: navigationState.currentItem,
      breadcrumb: [...navigationState.breadcrumb, item],
    });
  };

  const navigateBack = () => {
    if (navigationState.level === 'level3') {
      setNavigationState({
        level: 'level2',
        currentItem: navigationState.parentItem,
        parentItem: null,
        breadcrumb: navigationState.breadcrumb.slice(0, -1),
      });
    } else if (navigationState.level === 'level2') {
      setNavigationState({
        level: 'main',
        currentItem: null,
        parentItem: null,
        breadcrumb: [],
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Full-screen menu with slide animation */}
      <div className="fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out overflow-hidden">
        
        {/* ✅ FIXED BRAND HEADER - Centered Logo */}
        <div className="mobile-brand-header">
          {/* Left spacer to balance the close button */}
          <div style={{ width: '48px' }}></div>
          
          {/* Centered Logo */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Logo 
              shop={shop}
              style={{
                height: '40px',
                maxWidth: '160px',
              }}
            />
          </div>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Stäng meny"
            style={{ width: '48px', height: '48px' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Screens Container - Below fixed header */}
        <div className="mobile-nav-container">
          <div className="relative h-full overflow-hidden">
            
            {/* Main Menu Screen */}
            <div
              className={`mobile-nav-screen ${
                navigationState.level === 'main' ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <MainMenuScreen
                isLoggedIn={isLoggedIn}
                menu={menu}
                onClose={handleClose}
                onNavigateToLevel2={navigateToLevel2}
                getUrl={getUrl}
                popularCollections={popularCollections}
              />
            </div>

            {/* Level 2 Screen */}
            <div
              className={`mobile-nav-screen ${
                navigationState.level === 'level2' ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <Level2Screen
                currentItem={navigationState.currentItem}
                onBack={navigateBack}
                onClose={handleClose}
                onNavigateToLevel3={navigateToLevel3}
                getUrl={getUrl}
              />
            </div>

            {/* Level 3 Screen */}
            <div
              className={`mobile-nav-screen ${
                navigationState.level === 'level3' ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <Level3Screen
                currentItem={navigationState.currentItem}
                onBack={navigateBack}
                onClose={handleClose}
                getUrl={getUrl}
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Menu Screen Component
function MainMenuScreen({
  isLoggedIn,
  menu,
  onClose,
  onNavigateToLevel2,
  getUrl,
  popularCollections,
}: {
  isLoggedIn: Promise<boolean>;
  menu?: Menu | null;
  onClose: () => void;
  onNavigateToLevel2: (item: MenuItem) => void;
  getUrl: (url: string | null | undefined) => string;
  popularCollections: Collection[];
}) {
  return (
    <div className="mobile-screen-content">
      {/* User greeting section */}
      <div className="border-b border-gray-200 bg-white">
        <Suspense fallback={<UserGreetingFallback />}>
          <Await resolve={isLoggedIn}>
            {(isLoggedIn) => <UserGreeting isLoggedIn={isLoggedIn} />}
          </Await>
        </Suspense>
      </div>

      {/* Dynamic Main Navigation */}
      <div className="bg-white">
        <DynamicMainNavigation 
          menu={menu}
          onNavigateToLevel2={onNavigateToLevel2}
          getUrl={getUrl}
          onClose={onClose}
        />
      </div>

      {/* Popular section */}
      <div className="px-4 py-6 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Populära</h3>
        <PopularGrid collections={popularCollections} onClose={onClose} />
      </div>

      {/* Account & Support Links */}
      <div className="px-4 py-6 border-t border-gray-200 space-y-1 bg-white">
        <AccountLink
          href="/account/orders"
          icon={Package}
          title="Mina beställningar"
          onClose={onClose}
        />
        <WishlistsLink
          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          onClose={onClose}
        >
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-gray-600" />
            <span className="text-gray-900 font-medium">Önskelista</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </WishlistsLink>
        <AccountLink
          href="/pages/customer-service"
          icon={HelpCircle}
          title="Kundservice"
          onClose={onClose}
        />
      </div>
    </div>
  );
}

// Level 2 Drill-Down Screen - Fixed with separate navigation header
function Level2Screen({
  currentItem,
  onBack,
  onClose,
  onNavigateToLevel3,
  getUrl,
}: {
  currentItem: MenuItem | null;
  onBack: () => void;
  onClose: () => void;
  onNavigateToLevel3: (item: MenuItem) => void;
  getUrl: (url: string | null | undefined) => string;
}) {
  if (!currentItem) return null;

  const level2Items = currentItem.items ? currentItem.items.slice(0, 8) : [];

  return (
    <div className="mobile-screen-content">
      {/* NAVIGATION LEVEL HEADER - Separate from brand header */}
      <div className="mobile-nav-level-header">
        <button
          onClick={onBack}
          className="mobile-back-button"
        >
          <ChevronLeft size={20} />
          <span className="font-semibold text-base">{currentItem.title}</span>
        </button>
        
        <Link
          to={getUrl(currentItem.url)}
          onClick={onClose}
          className="mobile-shop-all-link"
        >
          Se alla →
        </Link>
      </div>

      {/* Level 2 Navigation Items */}
      <div className="bg-white">
        {level2Items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          
          return (
            <div key={item.id} className="mobile-nav-item">
              {hasSubItems ? (
                // Has Level 3 items - navigate to drill-down
                <button
                  onClick={() => onNavigateToLevel3(item)}
                  className="mobile-nav-button"
                >
                  <span>{item.title}</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              ) : (
                // No Level 3 items - direct link
                <Link
                  to={getUrl(item.url)}
                  onClick={onClose}
                  className="mobile-nav-link"
                >
                  {item.title}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Level 3 Drill-Down Screen - Fixed with separate navigation header
function Level3Screen({
  currentItem,
  onBack,
  onClose,
  getUrl,
}: {
  currentItem: MenuItem | null;
  onBack: () => void;
  onClose: () => void;
  getUrl: (url: string | null | undefined) => string;
}) {
  if (!currentItem) return null;

  const level3Items = currentItem.items ? currentItem.items.slice(0, 8) : [];

  return (
    <div className="mobile-screen-content">
      {/* NAVIGATION LEVEL HEADER - Separate from brand header */}
      <div className="mobile-nav-level-header">
        <button
          onClick={onBack}
          className="mobile-back-button"
        >
          <ChevronLeft size={20} />
          <span className="font-semibold text-base">{currentItem.title}</span>
        </button>
        
        <Link
          to={getUrl(currentItem.url)}
          onClick={onClose}
          className="mobile-shop-all-link"
        >
          Se alla →
        </Link>
      </div>

      {/* Level 3 Navigation Items - All direct links */}
      <div className="bg-white">
        {level3Items.map((item) => (
          <div key={item.id} className="mobile-nav-item">
            <Link
              to={getUrl(item.url)}
              onClick={onClose}
              className="mobile-nav-link"
            >
              {item.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// Dynamic Main Navigation - Shopify Menu Driven
function DynamicMainNavigation({
  menu,
  onNavigateToLevel2,
  getUrl,
  onClose,
}: {
  menu?: Menu | null;
  onNavigateToLevel2: (item: MenuItem) => void;
  getUrl: (url: string | null | undefined) => string;
  onClose: () => void;
}) {
  // Return empty if no menu - Shopify default behavior
  if (!menu?.items || menu.items.length === 0) {
    return null;
  }

  // Limit to max 6 Level 1 items for mobile UI
  const menuItems = menu.items.slice(0, 6);

  return (
    <div className="bg-white">
      {menuItems.map((item) => {
        const hasSubItems = item.items && item.items.length > 0;
        
        return (
          <div key={item.id} className="mobile-nav-item">
            {hasSubItems ? (
              // Has sub-items - navigate to drill-down (NOT direct link)
              <button
                onClick={() => onNavigateToLevel2(item)}
                className="mobile-nav-button"
              >
                <span>{item.title}</span>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            ) : (
              // No sub-items - direct link to collection
              <Link
                to={getUrl(item.url)}
                onClick={onClose}
                className="mobile-nav-link"
              >
                {item.title}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Helper Components
function UserGreetingFallback() {
  return (
    <div className="flex items-center justify-between px-4 py-4 bg-white">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

function UserGreeting({isLoggedIn}: {isLoggedIn: boolean}) {
  if (isLoggedIn) {
    const customerName = 'Kund';
    return (
      <Link
        to="/account"
        className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors bg-white"
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <span className="text-gray-900 font-medium">Hej, {customerName}</span>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </Link>
    );
  }

  return (
    <Link
      to="/account/login"
      className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors bg-white"
    >
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <LogIn size={14} className="text-white" />
        </div>
        <span className="text-gray-900 font-medium">Logga in</span>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </Link>
  );
}

function PopularGrid({
  collections,
  onClose,
}: {
  collections: Collection[];
  onClose: () => void;
}) {
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
        return isTrueValue(featuredValue);
      })
      ?.slice(0, 9) || [];

  const fallbackItems = [
    {id: 'deals', title: 'Erbjudanden', image: null, handle: 'deals'},
    {id: 'new', title: 'Nytt & Populärt', image: null, handle: 'new'},
    {id: 'all-toys', title: 'Alla Leksaker', image: null, handle: 'all-toys'},
    {id: 'lego', title: 'LEGO', image: null, handle: 'lego'},
    {id: 'minecraft', title: 'Minecraft', image: null, handle: 'minecraft'},
    {id: 'sonic', title: 'Sonic', image: null, handle: 'sonic'},
    {id: 'spiderman', title: 'Spiderman', image: null, handle: 'spiderman'},
    {id: 'disney', title: 'Disney', image: null, handle: 'disney'},
    {id: 'outdoor', title: 'Utomhus', image: null, handle: 'outdoor'},
  ];

  const displayItems =
    featuredCollections.length > 0 ? featuredCollections : fallbackItems;

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
              width: '5rem',
              height: '5rem',
              backgroundColor: item.image?.url ? 'transparent' : '#f3f4f6',
            }}
          >
            {item.image?.url ? (
              <Image
                data={item.image}
                sizes="80px"
                className="w-full h-full object-cover rounded-xl"
                loading="lazy"
              />
            ) : (
              <span className="text-2xl text-gray-400">🎯</span>
            )}
          </div>
          <span
            className="text-gray-900 text-center mt-2 leading-tight"
            style={{
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {item.title}
          </span>
        </Link>
      ))}
    </div>
  );
}

function AccountLink({
  href,
  icon: Icon,
  title,
  onClose,
}: {
  href: string;
  icon: any;
  title: string;
  onClose: () => void;
}) {
  return (
    <Link
      to={href}
      onClick={onClose}
      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-gray-600" />
        <span className="text-gray-900 font-medium">{title}</span>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </Link>
  );
}