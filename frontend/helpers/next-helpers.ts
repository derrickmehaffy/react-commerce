import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { logAsync } from '@ifixit/helpers';
import { setSentryPageContext } from '@ifixit/sentry';
import * as Sentry from '@sentry/nextjs';

export function serverSidePropsWrapper<T>(
   getServerSidePropsInternal: GetServerSideProps<T>
): GetServerSideProps<T> {
   return async (context) => {
      console.log('context.resolvedUrl', context.resolvedUrl);
      console.log('context.req.url', context.req.url);
      console.log('context.req.headers', context.req.headers);
      Sentry.setContext('Extra Info', {
         headers: context?.req.headers,
         url: context?.req.url,
         method: context?.req.method,
         locale: context?.locale,
         ...context?.params,
         ...context?.query,
      });
      return logAsync('getServerSideProps', () =>
         getServerSidePropsInternal(context)
      ).catch((err) => {
         setSentryPageContext(context);
         throw err;
      });
   };
}
