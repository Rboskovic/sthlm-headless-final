// app/entry.server.tsx
// ✅ UPDATED: Added Judge.me domains to Content Security Policy

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
  // ✅ UPDATED: Added Judge.me domains to CSP
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    // ✅ NEW: connectSrc - For fetch/XMLHttpRequest requests
    connectSrc: [
      "'self'",
      'https://monorail-edge.shopifysvc.com',
      'https://cdn.shopify.com',
      context.env.PUBLIC_STORE_DOMAIN,
      // ✅ Judge.me domains (REQUIRED for Judge.me to work)
      'https://cdn.judge.me',
      'https://cdnwidget.judge.me',  // ✅ CRITICAL: Judge.me uses this subdomain!
      'https://judge.me',
    ],
    // ✅ NEW: scriptSrc - For loading JavaScript
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://cdn.shopify.com',
      // ✅ Judge.me CDN (REQUIRED for Judge.me scripts)
      'https://cdn.judge.me',
      'https://cdnwidget.judge.me',  // ✅ CRITICAL: Judge.me uses this subdomain!
    ],
    // ✅ NEW: styleSrc - For loading CSS
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://cdn.shopify.com',
      // ✅ Judge.me styles (recommended)
      'https://cdn.judge.me',
      'https://cdnwidget.judge.me',
    ],
    // ✅ NEW: imgSrc - For loading images
    imgSrc: [
      "'self'",
      'data:',
      'https://cdn.shopify.com',
      // ✅ Judge.me images (for review photos)
      'https://cdn.judge.me',
      'https://cdnwidget.judge.me',
      'https://judge.me',
    ],
  });

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
  responseHeaders.set('Content-Security-Policy', header);
  responseHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}