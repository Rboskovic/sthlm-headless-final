/**
 * Canonical URL utilities for SEO
 * Ensures clean URLs without tracking parameters in search results
 */

/**
 * Generates canonical URL for any route
 * Always returns absolute URL with production domain
 */
export function getCanonicalUrl(request: Request): string {
  const url = new URL(request.url);
  
  // Always use production domain for canonical URLs
  const canonicalUrl = new URL(url.pathname, 'https://www.klosslabbet.se');
  
  // Clean up any tracking parameters or unwanted query strings
  // Keep only specific search parameters that affect content (if any)
  const allowedParams = ['sort_by']; // Add other content-affecting params as needed
  
  allowedParams.forEach(param => {
    const value = url.searchParams.get(param);
    if (value) {
      canonicalUrl.searchParams.set(param, value);
    }
  });
  
  return canonicalUrl.toString();
}

/**
 * Generates canonical URL for a specific path
 * Useful when you know the exact path and want to ensure absolute URL
 */
export function getCanonicalUrlForPath(pathname: string): string {
  // Ensure pathname starts with /
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `https://www.klosslabbet.se${cleanPath}`;
}

/**
 * Creates canonical meta tag object for use in route meta functions
 * Compatible with Remix meta function return format
 */
export function createCanonicalMeta(request: Request) {
  return {
    tagName: 'link',
    rel: 'canonical',
    href: getCanonicalUrl(request),
  };
}

/**
 * Creates canonical meta tag for a specific path
 * Useful for static routes where you know the exact path
 */
export function createCanonicalMetaForPath(pathname: string) {
  return {
    tagName: 'link',
    rel: 'canonical',
    href: getCanonicalUrlForPath(pathname),
  };
}