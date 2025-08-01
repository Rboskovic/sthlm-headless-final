// app/components/Header/MobileNav.tsx - Fixed accessibility issues
import {useState} from 'react';
import {Link} from 'react-router';
import {X, ChevronRight, ChevronDown} from 'lucide-react';
import {useAside} from '~/components/Aside';
import type {MobileNavProps} from './types';

export function MobileNav({
  menu,
  isOpen,
  onClose,
  primaryDomainUrl,
  publicStoreDomain,
}: MobileNavProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const {type: asideType} = useAside();

  // Use aside state if available, otherwise use prop
  const actuallyOpen = isOpen || asideType === 'mobile';

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

  // Handle backdrop click and ESC key
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!actuallyOpen) return null;

  const menuItems = menu?.items || [
    {id: '1', title: 'Leksaker', url: '/collections/leksaker', items: []},
    {id: '2', title: 'Märken', url: '/collections/marken', items: []},
    {id: '3', title: 'REA', url: '/collections/rea', items: []},
    {
      id: '4',
      title: 'Presentguide',
      url: '/collections/presentguide',
      items: [],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Close menu"
      />

      {/* Slide-out menu */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-sm bg-blue-900 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-400">
          <h2 className="text-lg font-semibold text-white">Meny</h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-yellow-300 transition-colors"
            aria-label="Stäng meny"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4">
          {menuItems.map((item: any) => (
            <MobileNavItem
              key={item.id}
              item={item}
              getUrl={getUrl}
              openSubmenu={openSubmenu}
              setOpenSubmenu={setOpenSubmenu}
              onClose={onClose}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

interface MobileNavItemProps {
  item: any;
  getUrl: (url: string | null | undefined) => string;
  openSubmenu: string | null;
  setOpenSubmenu: (id: string | null) => void;
  onClose: () => void;
  level?: number;
}

function MobileNavItem({
  item,
  getUrl,
  openSubmenu,
  setOpenSubmenu,
  onClose,
  level = 0,
}: MobileNavItemProps) {
  const hasSubItems = item.items && item.items.length > 0;
  const isOpen = openSubmenu === item.id;

  // Prevent infinite recursion
  if (level > 2) return null;

  const handleToggle = () => {
    if (hasSubItems) {
      setOpenSubmenu(isOpen ? null : item.id);
    }
  };

  return (
    <div className="border-b border-blue-400/30 last:border-b-0">
      <div className="flex items-center justify-between py-3">
        <Link
          to={getUrl(item.url)}
          onClick={onClose}
          className="flex-1 text-white hover:text-yellow-300 font-medium transition-colors"
          style={{paddingLeft: `${level * 16}px`}}
        >
          {item.title}
        </Link>
        {hasSubItems && (
          <button
            onClick={handleToggle}
            className="text-white hover:text-yellow-300 px-2 transition-colors"
            aria-label={`${isOpen ? 'Stäng' : 'Öppna'} ${item.title} undermeny`}
          >
            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
        )}
      </div>

      {hasSubItems && isOpen && (
        <div className="bg-blue-700/50">
          {item.items.map((subItem: any) => (
            <MobileNavItem
              key={subItem.id}
              item={subItem}
              getUrl={getUrl}
              openSubmenu={openSubmenu}
              setOpenSubmenu={setOpenSubmenu}
              onClose={onClose}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
