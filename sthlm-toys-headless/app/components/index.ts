// FILE: app/components/index.ts
// ✅ SHOPIFY HYDROGEN STANDARDS: Export wishlist and login components

// Wishlist Components
export {WishlistButton} from './WishlistButton';
export {WishlistsLink} from './WishlistsLink';
export {LoginModal} from './LoginModal';

// Wishlist Hook
export {useWishlist} from '../hooks/useWishlist';

// Types
export type {WishlistButtonProps} from './WishlistButton';
export type {WishlistsLinkProps} from './WishlistsLink';
export type {LoginModalProps} from './LoginModal';
export type {WishlistItem, UseWishlistReturn} from '../hooks/useWishlist';
