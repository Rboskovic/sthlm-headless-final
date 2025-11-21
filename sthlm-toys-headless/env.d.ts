/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

import type {
  HydrogenContext,
  HydrogenSessionData,
  HydrogenEnv,
} from '@shopify/hydrogen';
import type {createAppLoadContext} from '~/lib/context';

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: {env: {NODE_ENV: 'production' | 'development'}};

  interface Env extends HydrogenEnv {
    // Admin API for contact form metaobjects (auto-injected from Oxygen)
    PRIVATE_ADMIN_API_TOKEN: string;
    PRIVATE_ADMIN_API_VERSION: string;
    
    // ✅ Judge.me environment variables (auto-injected from Oxygen)
    JUDGEME_PUBLIC_TOKEN: string;
    JUDGEME_SHOP_DOMAIN: string;
  }
}

declare module 'react-router' {
  interface AppLoadContext
    extends Awaited<ReturnType<typeof createAppLoadContext>> {
    // to change context type, change the return of createAppLoadContext() instead
  }

  // Legacy support for older loader patterns - remove if all loaders migrated
  interface LoaderFunctionArgs {
    context: AppLoadContext;
  }

  // Legacy support for older action patterns - remove if all actions migrated  
  interface ActionFunctionArgs {
    context: AppLoadContext;
  }

  interface SessionData extends HydrogenSessionData {
    // declare local additions to the Remix session data here
  }
}