import { STRAPI_ORIGIN } from '@config/env';
import { sentryFetch } from '@ifixit/sentry';
import { getSdk, Requester } from './generated/sdk';
import * as Sentry from '@sentry/nextjs';
export * from './generated/sdk';

const requester: Requester = async <R, V>(
   doc: string,
   variables: V
): Promise<R> => {
   const response = await sentryFetch(`${STRAPI_ORIGIN}/graphql`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         query: doc,
         variables,
      }),
   });
   let result: any;
   try {
      result = await response.json();
   } catch (error) {
      throw new Error(`Response is not a json: ${response.statusText}`);
   }
   if (response.ok) {
      if (result?.data) {
         return result.data;
      }
      throw new Error('Data not available in GraphQL response');
   }
   if (Array.isArray(result.errors)) {
      console.error('GraphQL query failed with errors:');
      result.errors.map((error: any) => {
         const code = error.extensions?.code || 'UNKNOWN';
         console.error(`\t[${code}]`, error.message);
      });
      Sentry.withScope((scope) => {
         scope.setExtra('query', doc);
         scope.setExtra('variables', variables);
         scope.setExtra('errors', result.errors);
         Sentry.captureException(
            new Error('Strapi SDK GraphQL query failed with errors')
         );
      });
   }
   throw new Error(`GraphQL query failed to execute: ${response.statusText}`);
};

export const strapi = getSdk(requester);
