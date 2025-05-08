
'use client';

import Script from 'next/script';
import type { FC } from 'react';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

const GoogleAnalytics: FC = () => {
  if (!GA_TRACKING_ID) {
    // You can uncomment the line below for development to see if the ID is missing
    // console.warn("Google Analytics Tracking ID (NEXT_PUBLIC_GA_ID) is not set. Analytics will be disabled.");
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
