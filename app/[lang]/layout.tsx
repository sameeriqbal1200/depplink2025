
import './globals.css'
import './customGlobal.css'
import { getRequestContext } from "@/lib/request-context";
import React from 'react'
import dynamic from 'next/dynamic'
import { Cairo, Noto_Sans } from 'next/font/google'
import Providers from './providers';

import { getDictionary } from './dictionariesserver'
import LayoutWrapper from './LayoutWrapper'
import GTM from './components/GTM'
import LoginGuard from './components/LoginGuard'
import { GlobalProvider } from './GlobalContext';
import Script from 'next/script';
import ReloadRefresh from './components/ReloadRefresh';
import ConnectionStatus from './components/ConnectionStatus';
import { AppProvider } from '../_ctx/AppContext';
import CityBootstrapper from '../(site)/CityBootstrapper';

const MobileFooterNew = dynamic(() => import('./components/MobileFooterNew'), { ssr: true })
const notoSans = Noto_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: 'white',
}

export default async function RootLayout(props: any) {
  const {
    children
  } = props;
   const {
     lang,
    deviceType,
    deviceDetail,
    isWebView,
    os,
    city,
    origin,
    baseUrl,
    fullUrl,
    slug, slugStr, slugParts,
  } = await getRequestContext();
  const isArabic = lang === 'ar';
  const dict = await getDictionary(lang);
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY!;
  
  return (
    <html lang={lang} dir={isArabic ? "rtl" : "ltr"} className='nprogress-busy' data-scroll-behavior="smooth">
      <head>
        <GTM />
        {/* <Script src="/WebEngagge.js" strategy="afterInteractive" /> */}
        {/* <WebEngage /> */}
      </head>
      <body
          className={lang === "ar" ? cairo.className : notoSans.className}
          suppressHydrationWarning
          data-slug={slugStr ?? ""}
          data-device={deviceDetail ?? deviceType}
          data-os={os ?? ""}
        >
        <AppProvider
        value={{
          lang,
          deviceType,
          deviceDetail,
          isWebView,
          os,
          city,
          dict,
          slug,
          params: { lang, slug: slugParts },
          origin,
          baseUrl,
          fullUrl,
        }}
        >
        {/* your existing tree */}
        <ReloadRefresh lang={lang} idleMs={30 * 60 * 1000} />
        <GlobalProvider>
          <Providers> 
            <div className="fixed top-0 w-full z-50">
              <div className="h-1.5" id="loader-spin"></div>
            </div>
            <LayoutWrapper>
              <LoginGuard />
              <CityBootstrapper lang={lang} googleApiKey={googleApiKey} />
              {children}
              {/* <ConnectionStatus /> */}
            </LayoutWrapper>
          </Providers>
          <MobileFooterNew lang={lang} dict={dict} />
        </GlobalProvider>
        </AppProvider>
      </body>
    </html>
  )
}
