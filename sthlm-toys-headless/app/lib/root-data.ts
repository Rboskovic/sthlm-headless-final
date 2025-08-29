// FILE: app/lib/root-data.ts
// ✅ SHOPIFY HYDROGEN STANDARD: Root loader data access hook

import {useMatches} from 'react-router';
import type {SerializeFrom} from '@shopify/remix-oxygen';
import type {RootLoader} from '~/root';

export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<RootLoader> | undefined;
};