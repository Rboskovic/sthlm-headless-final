import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 * ✅ FIXED: Updated with blue "Show more" button styling to match search page
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  resourcesClassName?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>
            {/* Previous Link - Hidden by default, only show if needed */}
            <PreviousLink className="hidden">
              {isLoading ? 'Belastning...' : <span>↑ Load previous</span>}
            </PreviousLink>
            
            {/* Resources Grid */}
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}
            
            {/* ✅ FIXED: Blue "Show more" Button - Matches search page styling */}
            <div className="flex justify-center py-8">
              <NextLink 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-full transition-colors duration-200"
                style={{ color: 'white' }}
              >
                {isLoading ? 'Belastning...' : 'Visa mer'}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}