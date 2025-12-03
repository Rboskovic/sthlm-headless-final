// app/entry.server.tsx
// ✅ FIXED: Custom CSP for Judge.me compatibility
// Problem: When nonce is present, browsers ignore 'unsafe-inline' per CSP spec
// Solution: Build custom CSP without nonce in script-src so 'unsafe-inline' works

import type {AppLoadContext} from '@shopify/remix-oxygen';
import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: AppLoadContext,
) {
  // Get nonce and NonceProvider from Hydrogen (still needed for React hydration)
  const {nonce, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
  });

  // ✅ Build custom CSP header that allows Judge.me inline scripts
  // Key insight: 'unsafe-inline' only works when NO nonce is in script-src
  const cspDirectives = [
    // Default fallback
    `default-src 'self'`,
    
    // ✅ Scripts: NO nonce here, so 'unsafe-inline' actually works for Judge.me
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com https://cdn.judge.me https://cdnwidget.judge.me https://judge.me blob:`,
    
    // Styles
    `style-src 'self' 'unsafe-inline' https://cdn.shopify.com https://cdn.judge.me https://cdnwidget.judge.me https://fonts.googleapis.com`,
    
    // Connect (fetch/XHR)
    `connect-src 'self' https://monorail-edge.shopifysvc.com https://cdn.shopify.com ${context.env.PUBLIC_STORE_DOMAIN} https://cdn.judge.me https://cdnwidget.judge.me https://judge.me https://*.judge.me`,
    
    // Images
    `img-src 'self' data: blob: https://cdn.shopify.com https://cdn.judge.me https://cdnwidget.judge.me https://judge.me https://*.judge.me`,
    
    // Fonts
    `font-src 'self' https://cdn.shopify.com https://fonts.gstatic.com data:`,
    
    // Frames
    `frame-src 'self' https://cdn.judge.me https://judge.me https://*.judge.me https://shop.app https://*.shopify.com https://*.myshopify.com`,
    
    // Media
    `media-src 'self' https://cdn.shopify.com`,
    
    // Child/Worker
    `child-src 'self' blob:`,
    `worker-src 'self' blob:`,
    
    // Object - disable plugins
    `object-src 'none'`,
    
    // Base URI
    `base-uri 'self'`,
    
    // Form actions
    `form-action 'self' https://*.shopify.com https://*.myshopify.com`,
    
    // Frame ancestors
    `frame-ancestors 'none'`,
  ];

  const customCspHeader = cspDirectives.join('; ');

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  // ✅ Use custom CSP instead of auto-generated one with nonce
  responseHeaders.set('Content-Security-Policy', customCspHeader);
  responseHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}