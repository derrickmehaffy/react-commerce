const {
   getLegacyPartItemTypeRedirects,
} = require('./next-config/redirects/part-collections');
const {
   getLegacyToolRedirects,
} = require('./next-config/redirects/tool-collections');

const withTM = require('next-transpile-modules')([
   '@ifixit/analytics',
   '@ifixit/app',
   '@ifixit/ui',
   '@ifixit/icons',
   '@ifixit/auth-sdk',
   '@ifixit/cart-sdk',
   '@ifixit/newsletter-sdk',
   '@ifixit/helpers',
   '@ifixit/ifixit-api-client',
   '@ifixit/shopify-storefront-client',
   '@ifixit/sentry',
   '@ifixit/footer',
]);

const { withSentryConfig } = require('@sentry/nextjs');

const withBundleAnalyzer =
   process.env.ANALYZE === 'true'
      ? require('@next/bundle-analyzer')()
      : (arg) => arg;

const sentryWebpackPluginOptions = {
   // Additional config options for the Sentry Webpack plugin. Keep in mind that
   // the following options are set automatically, and overriding them is not
   // recommended:
   //   release, url, org, project, authToken, configFile, stripPrefix,
   //   urlPrefix, include, ignore

   silent: true, // Suppresses all logs
   // For all available options, see:
   // https://github.com/getsentry/sentry-webpack-plugin#options.
};
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;

console.log('Strapi API: ' + process.env.NEXT_PUBLIC_STRAPI_ORIGIN);
console.log('iFixit API: ' + process.env.NEXT_PUBLIC_IFIXIT_ORIGIN);

const moduleExports = {
   env: {
      ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
      NEXT_PUBLIC_ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      NEXT_PUBLIC_IFIXIT_ORIGIN: process.env.NEXT_PUBLIC_IFIXIT_ORIGIN,
      NEXT_PUBLIC_STRAPI_ORIGIN: process.env.NEXT_PUBLIC_STRAPI_ORIGIN,
      SENTRY_DSN: process.env.SENTRY_DSN,
      NEXT_PUBLIC_MATOMO_URL: process.env.NEXT_PUBLIC_MATOMO_URL,
      NEXT_PUBLIC_GA_URL: process.env.NEXT_PUBLIC_GA_URL,
      NEXT_PUBLIC_GA_KEY: process.env.NEXT_PUBLIC_GA_KEY,
      NEXT_PUBLIC_DEFAULT_STORE_CODE:
         process.env.NEXT_PUBLIC_DEFAULT_STORE_CODE,
   },
   async rewrites() {
      return [
         {
            source: '/uploads/:name',
            destination: `${process.env.NEXT_PUBLIC_STRAPI_ORIGIN}/uploads/:name`,
         },
      ];
   },
   async redirects() {
      return [
         ...getLegacyPartItemTypeRedirects(),
         ...getLegacyToolRedirects(),
         {
            source: '/Store/Guide/:guideid',
            destination: `${process.env.NEXT_PUBLIC_IFIXIT_ORIGIN}/Guide/_/:guideid`,
            permanent: true,
         },
         {
            source: '/products/sitemap.xml',
            destination: `${process.env.NEXT_PUBLIC_IFIXIT_ORIGIN}/sitemap/products.xml`,
            permanent: true,
         },
         {
            source: '/Parts/sitemap.xml',
            destination: `${process.env.NEXT_PUBLIC_IFIXIT_ORIGIN}/sitemap/parts.xml`,
            permanent: true,
         },
         {
            source: '/Tools/sitemap.xml',
            destination: `${process.env.NEXT_PUBLIC_IFIXIT_ORIGIN}/sitemap/tools.xml`,
            permanent: true,
         },
         {
            source: '/Shop/sitemap.xml',
            destination: `${process.env.NEXT_PUBLIC_IFIXIT_ORIGIN}/sitemap/marketing.xml`,
            permanent: true,
         },
         {
            source: '/products/pro-tech-toolkit',
            destination: `${process.env.NEXT_PUBLIC_IFIXIT_ORIGIN}/Store/Tools/Pro-Tech-Toolkit/IF145-307`,
            permanent: false,
         },
         {
            source: '/products/manta-driver-kit-112-bit-driver-kit',
            destination: `${process.env.NEXT_PUBLIC_IFIXIT_ORIGIN}/Store/Tools/Manta-Driver-Kit--112-Bit-Driver-Kit/IF145-392`,
            permanent: false,
         },
      ];
   },
   images: {
      domains: [
         'localhost',
         'cdn.shopify.com',
         'strapi.cominor.com',
         'www.cominor.com',
         'ifixit.com',
         'valkyrie.cdn.ifixit.com',
         'cart-products.cdn.ifixit.com',
         'assets.cdn.ifixit.com',
         'www.cominor.com',
         'guide-images.cdn.ifixit.com',
         process.env.STRAPI_IMAGE_DOMAIN,
      ].filter((domain) => domain),
      imageSizes: [41, 70, 110, 170, 250, 400, 600],
   },
   i18n: {
      locales: ['en-US'],
      defaultLocale: 'en-US',
   },
   ...(!SENTRY_AUTH_TOKEN && {
      sentry: {
         disableServerWebpackPlugin: true,
         disableClientWebpackPlugin: true,
      },
   }),
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(
   withBundleAnalyzer(withTM(moduleExports)),
   SENTRY_AUTH_TOKEN ? sentryWebpackPluginOptions : undefined
);
