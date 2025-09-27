import './globals.css'
import './customGlobal.css'
import React, { cache, useState } from 'react'
import dynamic from 'next/dynamic'
import { Cairo, Noto_Sans } from 'next/font/google'
import Providers from './providers';
import LayoutWrapper from './LayoutWrapper'
import GTM from '@/components/GTM'
import LoginGuard from '@/components/LoginGuard'
import { GlobalProvider } from './GlobalContext';
import Script from 'next/script';
import ReloadRefresh from '@/components/ReloadRefresh';
import { getRequestContext } from "@/lib/request-context";
import { getDictionary } from "@/lib/i18n.server";
import { AppProvider } from "@/app/_ctx/AppContext";
import { Metadata, ResolvingMetadata } from 'next';
import CityBootstrapper from "@/app/(site)/CityBootstrapper";
import { getHomepageServerSide } from "@/lib/homepage/homepage.server";
import { Api } from '@/lib/api/apiLinks';
// import "../../tailwind.config.ts";

const MobileFooterNew = dynamic(() => import('@/components/MobileFooterNew'), { ssr: true })

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

export const fetcher = cache(async (url: string): Promise<any> => {
  const res = await fetch(`${Api}${url}`, { next: { revalidate: 7200 } });
  if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
  return res.json();
})

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const {
    lang: headerLang,
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

  const lang = headerLang ?? "en";
  const dict = await getDictionary(lang);
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY!;

  // console.log("Lang:", headerLang);
  // console.log("Device:", deviceType);
  // console.log("Device Detail:", deviceDetail);
  // console.log("Is WebView:", isWebView);
  // console.log("OS:", os);
  // console.log("City:", city);
  // console.log("Origin:", origin, "FullUrl:", origin + "/" + headerLang);
  // console.log("Base URL:", baseUrl);
  // console.log("Full URL:", fullUrl);
  // console.log("Slug:", slug);
  // console.log("Slug String:", slugStr);
  // console.log("Slug Parts:", slugParts);

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <head>
        {/* <GTM />
        <Script src="/WebEngagge.js" strategy="afterInteractive" /> */}
      </head>
      <body
        className={lang === "ar" ? cairo.className : notoSans.className}
        suppressHydrationWarning
        // server-rendered data attributes you can target in CSS/JS if needed
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
              <LayoutWrapper>
                <LoginGuard />
                <CityBootstrapper lang={lang} googleApiKey={googleApiKey} />
                {children}
              </LayoutWrapper>
            </Providers>

            <div className="fixed top-0 w-full z-50">
              <div className="h-1.5" id="loader-spin"></div>
            </div>

            <MobileFooterNew lang={lang} dict={dict} origin={origin}/>
          </GlobalProvider>
        </AppProvider>
      </body>
    </html>
  );
}

export async function generateMetadata() {
  const { lang } = await getRequestContext();
  const homepagedata: any = await getHomepageServerSide(lang)
  // params.data = homepagedata

  const metaTitle = lang === 'en' ? homepagedata?.homepageData?.meta_title_en : homepagedata?.homepageData?.meta_title_ar
  const metaDescription = lang === 'en' ? homepagedata?.homepageData?.meta_description_en : homepagedata?.homepageData?.meta_description_ar

  const baseUrl = process.env.NODE_ENV === 'production' ? `https://tamkeenstores.com.sa/${lang}` : 'http://localhost:3000';

  return {
    metadataBase: new URL(baseUrl),
    title: metaTitle,
    description: metaDescription,
    keywords: ["Tamkeen Stores", "تمكين", "Electronics Saudi Arabia", "معارض تمكين"],
    referrer: 'origin-when-cross-origin',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    formatDetection: {
      email: false,
      address: true,
      telephone: true,
    },
    openGraph: {
      siteName: metaTitle,
      title: metaTitle,
      description: metaDescription,
      locale: lang,
      type: 'website',
      images: [{ url: '/images/metaLogo.jpg', width: 800, height: 800, alt: 'logo' }],
      url: baseUrl,
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        en: 'https://tamkeenstores.com.sa/en',
        ar: 'https://tamkeenstores.com.sa/ar',
      },
    },
    appLinks: {
      ios: {
        url: 'https://apps.apple.com/sa/app/tamkeen-stores-%D9%85%D8%B9%D8%A7%D8%B1%D8%B6-%D8%AA%D9%85%D9%83%D9%8A%D9%86/id1546482321',
        app_store_id: 'com.tamkeen.tamkeenstore',
      },
      android: {
        package: 'https://play.google.com/store/apps/details?id=com.tamkeen.tamkeenstores',
        app_name: 'com.tamkeen.tamkeenstores',
      },
      web: {
        url: baseUrl,
        should_fallback: true,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      siteId: '@TamkeenStores',
      creator: 'Muhammad Usman Siddiqui | usman@tamkeen-ksa.com',
      images: [`${baseUrl}/images/metaLogo.jpg`],
    },
  }
}
