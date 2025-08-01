export interface SquareBannerItem {
  id: string;
  title: string;
  handle: string;
  backgroundColor?: string;
  image?: {
    id?: string;
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  } | null;
}

export const defaultColors: Record<string, string> = {
  'toys-r-us': '#4CAF50',
  barbie: '#E91E63',
  lego: '#FFC107',
  disney: '#1976D2',
  'fisher-price': '#00BCD4',
  crayola: '#FFC107',
  minecraft: '#4CAF50',
  sonic: '#2196F3',
};
