// app/components/WishlistHeader.tsx
// ✅ UPDATED: Swedish translation + Blue colors

import { useState } from 'react';
import { Share2, Link as LinkIcon, Trash2, Copy, Check } from 'lucide-react';

interface WishlistHeaderProps {
  count: number;
  onClear: () => void;
  onShare: (title?: string) => Promise<boolean>;
  onCopyLink: (title?: string) => Promise<boolean>;
  createShareableLink: (title?: string) => string;
}

export function WishlistHeader({
  count,
  onClear,
  onShare,
  onCopyLink,
  createShareableLink
}: WishlistHeaderProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = async () => {
    const success = await onShare('Kolla in min önskelista från Klosslabbet!');
    if (!success) {
      // Fallback to copy link if native sharing not supported
      handleCopyLink();
    }
    setShowShareMenu(false);
  };

  const handleCopyLink = async () => {
    const success = await onCopyLink('Min Klosslabbet Önskelista');
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
    setShowShareMenu(false);
  };

  const handleClear = () => {
    if (showClearConfirm) {
      onClear();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      // Auto-cancel after 5 seconds
      setTimeout(() => setShowClearConfirm(false), 5000);
    }
  };

  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
      {/* Title & Count */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Min Önskelista
        </h1>
        <p className="text-gray-600">
          {count} {count === 1 ? 'produkt' : 'produkter'} sparade
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Share Menu */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Share2 size={18} />
            <span className="hidden sm:inline">Dela</span>
          </button>

          {showShareMenu && (
            <div className="absolute right-0 top-12 z-10 bg-white rounded-lg shadow-lg border min-w-48">
              <div className="p-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Share2 size={16} />
                  <span>Dela Önskelista</span>
                </button>
                
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copySuccess ? (
                    <>
                      <Check size={16} className="text-green-600" />
                      <span className="text-green-600">Länk Kopierad!</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon size={16} />
                      <span>Kopiera Länk</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Clear Button */}
        <button
          onClick={handleClear}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showClearConfirm
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
          }`}
        >
          <Trash2 size={18} />
          <span className="hidden sm:inline">
            {showClearConfirm ? 'Klicka för att bekräfta' : 'Rensa Allt'}
          </span>
        </button>
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}