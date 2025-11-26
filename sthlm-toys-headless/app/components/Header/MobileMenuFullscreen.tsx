// FILE: app/components/Header/MobileMenuFullscreen.tsx
// ✅ UPDATED: Now uses collections directly from popular_collections metaobject (no filtering)

import {useState} from 'react';
import {Link} from 'react-router';
import {
  X,
  ChevronRight,
  ChevronLeft,
  User,
  Heart,
  Package,
  HelpCircle,
} from 'lucide-react';
import {Image} from '@shopify/hydrogen';
import {Logo} from './Logo';
import {WishlistsLink} from '../WishlistsLink';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import type {Menu, MenuItem} from './types';

const SHOP_ID = '90088112507';
const SHOPIFY_ACCOUNT_URL = `https://shopify.com/${SHOP_ID}/account`;
const SHOPIFY_ORDERS_URL = `https://shopify.com/${SHOP_ID}/account/orders`;

interface MobileMenuFullscreenProps {
  isOpen: boolean;
  onClose: () => void;
  shop: any;
  popularCollections?: Collection[];
  menu?: Menu | null;
  primaryDomainUrl?: string;
  publicStoreDomain?: string;
}

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
    <div className="mobile-menu-fullscreen fixed inset-0 z-[60] lg:hidden">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleClose}
        style={{ touchAction: 'none' }}
      />

      <div className="fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out overflow-hidden">
        
        <div className="mobile-brand-header">
          <div style={{ width: '48px' }}></div>
          
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
          
          <button
            onClick={handleClose}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Stäng meny"
            style={{ width: '48px', height: '48px' }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="mobile-nav-container">
          <div className="relative h-full overflow-hidden bg-white">
            
            <div
              className={`mobile-nav-screen ${
                navigationState.level === 'main' ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <MainMenuScreen
                menu={menu}
                onClose={handleClose}
                onNavigateToLevel2={navigateToLevel2}
                getUrl={getUrl}
                popularCollections={popularCollections}
              />
            </div>

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

function MainMenuScreen({
  menu,
  onClose,
  onNavigateToLevel2,
  getUrl,
  popularCollections,
}: {
  menu?: Menu | null;
  onClose: () => void;
  onNavigateToLevel2: (item: MenuItem) => void;
  getUrl: (url: string | null | undefined) => string;
  popularCollections: Collection[];
}) {
  return (
    <div 
      className="mobile-screen-content" 
      style={{ 
        WebkitOverflowScrolling: 'touch',
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      <DynamicMainNavigation
        menu={menu}
        onNavigateToLevel2={onNavigateToLevel2}
        getUrl={getUrl}
        onClose={onClose}
      />

      <div className="bg-gray-50 px-4 py-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Populära LEGO® set</h3>
        <PopularGrid collections={popularCollections} onClose={onClose} />
      </div>

      <div className="border-t border-gray-200 bg-white">
        <a
          href={SHOPIFY_ACCOUNT_URL}
          onClick={onClose}
          className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors bg-white"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
            <span className="text-gray-900 font-medium">Mitt Konto</span>
          </div>
          <ChevronRight size={20} style={{ color: 'var(--color-primary)' }} />
        </a>

        <WishlistsLink className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-gray-600" />
            <span className="text-gray-900 font-medium">Önskelista</span>
          </div>
          <ChevronRight size={20} style={{ color: 'var(--color-primary)' }} />
        </WishlistsLink>

        <AccountLink
          href={SHOPIFY_ORDERS_URL}
          icon={Package}
          title="Mina beställningar"
          onClose={onClose}
        />
        <AccountLink
          href="/pages/hjalp"
          icon={HelpCircle}
          title="Hjälp & FAQS"
          onClose={onClose}
        />
      </div>
    </div>
  );
}

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

  const level2Items = currentItem.items ? currentItem.items : [];

  return (
    <div className="mobile-screen-content">
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

      <div className="bg-white">
        {level2Items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          
          return (
            <div key={item.id} className="mobile-nav-item">
              {hasSubItems ? (
                <button
                  onClick={() => onNavigateToLevel3(item)}
                  className="mobile-nav-button w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <span>{item.title}</span>
                  <ChevronRight size={20} style={{ color: 'var(--color-primary)' }} />
                </button>
              ) : (
                <Link
                  to={getUrl(item.url)}
                  onClick={onClose}
                  className="mobile-nav-link w-full block p-4 hover:bg-gray-50 transition-colors text-gray-900 font-medium"
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

  const level3Items = currentItem.items ? currentItem.items : [];

  return (
    <div className="mobile-screen-content">
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

      <div className="bg-white">
        {level3Items.map((item) => (
          <div key={item.id} className="mobile-nav-item">
            <Link
              to={getUrl(item.url)}
              onClick={onClose}
              className="mobile-nav-link w-full block p-4 hover:bg-gray-50 transition-colors text-gray-900 font-medium"
            >
              {item.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

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
  if (!menu?.items || menu.items.length === 0) {
    return null;
  }

  const menuItemsWithSubItems = menu.items
    .filter((item) => item.items && item.items.length > 0)

  if (menuItemsWithSubItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white">
      {menuItemsWithSubItems.map((item) => (
        <div key={item.id} className="mobile-nav-item">
          <button
            onClick={() => onNavigateToLevel2(item)}
            className="mobile-nav-button w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <span>{item.title}</span>
            <ChevronRight size={20} style={{ color: 'var(--color-primary)' }} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ✅ UPDATED: No more filtering - uses collections directly from metaobject
function PopularGrid({
  collections,
  onClose,
}: {
  collections: Collection[];
  onClose: () => void;
}) {
  const getMetafieldValue = (
    metafields: Array<{key: string; value: string; namespace: string} | null> | null | undefined,
    key: string
  ): string | null => {
    if (!metafields || !Array.isArray(metafields)) return null;
    const metafield = metafields.find((field) => field && field.key === key);
    return metafield && metafield.value ? metafield.value : null;
  };

  // ✅ PERFORMANCE FIX: Optimize image URL with Shopify CDN
  const getOptimizedImageUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    // Display: 140px max, 2x retina = 280px needed
    return url.includes('?') 
      ? `${url}&width=280` 
      : `${url}?width=280`;
  };

  // ✅ UPDATED: No filtering! Use collections directly, limit to 9
  const displayCollections = collections.slice(0, 9);

  // Fallback items (only show if NO collections provided)
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

  const displayItems = displayCollections.length > 0 ? displayCollections : fallbackItems;

  return (
    <div className="grid grid-cols-3 gap-1 px-1">
      {displayItems.map((item) => {
        const customImageUrl = 'metafields' in item ? getMetafieldValue(
          item.metafields,
          'mobile_menu_image'
        ) : null;
        
        const rawImageUrl = customImageUrl || item.image?.url;
        const optimizedImageUrl = getOptimizedImageUrl(rawImageUrl);

        return (
          <Link
            key={item.id}
            to={`/collections/${item.handle}`}
            onClick={onClose}
            className="flex flex-col items-center text-center"
          >
            <div className="w-full aspect-[3/2] flex items-center justify-center overflow-hidden mb-1 bg-gray-50 rounded-lg max-w-[140px] mx-auto">
              {optimizedImageUrl ? (
                <Image
                  data={{
                    url: optimizedImageUrl,
                    altText: item.title,
                    width: 280,
                    height: 187,
                  }}
                  sizes="(max-width: 380px) 110px, (max-width: 500px) 130px, 140px"
                  className="w-full h-full object-contain rounded-lg"
                  loading="lazy"
                />
              ) : (
                <span className="text-2xl text-gray-400">🎯</span>
              )}
            </div>
            <span className="text-xs font-medium text-gray-900 text-center leading-tight px-1 max-w-[140px]">
              {item.title}
            </span>
          </Link>
        );
      })}
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
  const isExternalLink = href.startsWith('http');
  
  if (isExternalLink) {
    return (
      <a
        href={href}
        onClick={onClose}
        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className="text-gray-600" />
          <span className="text-gray-900 font-medium">{title}</span>
        </div>
        <ChevronRight size={20} style={{ color: 'var(--color-primary)' }} />
      </a>
    );
  }

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
      <ChevronRight size={20} style={{ color: 'var(--color-primary)' }} />
    </Link>
  );
}