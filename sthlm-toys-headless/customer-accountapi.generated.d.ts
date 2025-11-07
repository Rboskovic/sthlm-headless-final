/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as CustomerAccountAPI from '@shopify/hydrogen/customer-account-api-types';

export type CustomerQueryVariables = CustomerAccountAPI.Exact<{
  [key: string]: never;
}>;

export type CustomerQuery = {
  customer: Pick<
    CustomerAccountAPI.Customer,
    'id' | 'firstName' | 'lastName' | 'displayName'
  >;
};

interface GeneratedQueryTypes {
  '#graphql\n  query Customer {\n    customer {\n      id\n      firstName\n      lastName\n      displayName\n    }\n  }\n': {
    return: CustomerQuery;
    variables: CustomerQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface CustomerAccountQueries extends GeneratedQueryTypes {}
  interface CustomerAccountMutations extends GeneratedMutationTypes {}
}
