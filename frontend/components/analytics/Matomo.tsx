import { MATOMO_URL } from '@config/env';
import { useRouter } from 'next/router';
import * as React from 'react';
import Script from 'next/script';
import { trackMatomoPageView } from '@ifixit/analytics';

export function Matomo() {
   const router = useRouter();
   React.useEffect(() => {
      router.events.on('routeChangeComplete', trackMatomoPageView);
      router.events.on('hashChangeComplete', trackMatomoPageView);
      return () => {
         router.events.off('routeChangeComplete', trackMatomoPageView);
         router.events.off('hashChangeComplete', trackMatomoPageView);
      };
   }, [router?.events]);

   return MATOMO_URL ? (
      <Script id="matomo-analytics" strategy="afterInteractive">
         {`
            var _paq = window._paq = window._paq || [];
            /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
               var u='${MATOMO_URL}';
               _paq.push(['setTrackerUrl', u+'/minerva.php']);
               _paq.push(['setSiteId', '1']);
               var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
               g.async=true; g.src=u+'/minerva.php'; s.parentNode.insertBefore(g,s);
            })();
         `}
      </Script>
   ) : null;
}
