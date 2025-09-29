import "./globals.css";
import "./customGlobal.css";
import React, { cache, useState } from "react";
import dynamic from "next/dynamic";
import { Cairo, Noto_Sans } from "next/font/google";
import Providers from "./providers";
import LayoutWrapper from "./LayoutWrapper";
import GTM from "@/components/GTM";
import LoginGuard from "@/components/LoginGuard";
import { GlobalProvider } from "./GlobalContext";
import Script from "next/script";
import ReloadRefresh from "@/components/ReloadRefresh";
import { getRequestContext } from "@/lib/request-context";
import { getDictionary } from "@/lib/i18n.server";
import { AppProvider } from "@/app/_ctx/AppContext";
import { Metadata, ResolvingMetadata } from "next";
import CityBootstrapper from "@/app/(site)/CityBootstrapper";
import { getHomepageServerSide } from "@/lib/homepage/homepage.server";
import { Api } from "@/lib/api/apiLinks";
import DebugDOM from "@/components/DebugDOM";
// import "../../tailwind.config.ts";

const MobileFooterNew = dynamic(() => import("@/components/MobileFooterNew"), {
  ssr: true,
});

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
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "white",
};

export const fetcher = cache(async (url: string): Promise<any> => {
  const res = await fetch(`${Api}${url}`, { next: { revalidate: 7200 } });
  if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
  return res.json();
});

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
    slug,
    slugStr,
    slugParts,
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
        {/* Global SVG Sprite – define once */}

        {/* Whislist Icon */}
        <svg style={{ display: "none" }} xmlns="http://www.w3.org/2000/svg">
          {/* Wishlist Icon */}
          <symbol id="icon-heart" viewBox="0 -20 480 480">
            <path d="M348 0c-43 .0664062-83.28125 21.039062-108 56.222656-24.71875-35.183594-65-56.1562498-108-56.222656-70.320312 0-132 65.425781-132 140 0 72.679688 41.039062 147.535156 118.6875 216.480469 35.976562 31.882812 75.441406 59.597656 117.640625 82.625 2.304687 1.1875 5.039063 1.1875 7.34375 0 42.183594-23.027344 81.636719-50.746094 117.601563-82.625 77.6875-68.945313 118.726562-143.800781 118.726562-216.480469 0-74.574219-61.679688-140-132-140zm-108 422.902344c-29.382812-16.214844-224-129.496094-224-282.902344 0-66.054688 54.199219-124 116-124 41.867188.074219 80.460938 22.660156 101.03125 59.128906 1.539062 2.351563 4.160156 3.765625 6.96875 3.765625s5.429688-1.414062 6.96875-3.765625c20.570312-36.46875 59.164062-59.054687 101.03125-59.128906 61.800781 0 116 57.945312 116 124 0 153.40625-194.617188 266.6875-224 282.902344zm0 0"></path>
          </symbol>

          {/* SAR Icon */}
          <symbol id="icon-sar" viewBox="0 0 1124.14 1256.39">
            <path d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"></path>
            <path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
          </symbol>

          {/* Star Icon */}
          <symbol id="icon-star" viewBox="0 0 13 12">
            <path
              d="M7.00722 9.68738C6.82753 9.58159 6.6046 9.58159 6.4249 9.68738L3.63545 11.3294C3.19737 11.5873 2.66504 11.1904 2.78715 10.697L3.52981 7.69574C3.58284 7.48149 3.50829 7.25581 3.33809 7.11529L0.925653 5.12352C0.52746 4.79476 0.732039 4.14844 1.24688 4.10869L4.45509 3.86095C4.66757 3.84454 4.85346 3.71176 4.93788 3.51609L6.18908 0.616336C6.38846 0.154255 7.04366 0.154255 7.24304 0.616338L8.49424 3.51609C8.57867 3.71176 8.76455 3.84454 8.97703 3.86094L12.1858 4.10869C12.7006 4.14844 12.9052 4.79482 12.5069 5.12355L10.0941 7.11529C9.92385 7.25581 9.84929 7.48151 9.90231 7.69579L10.645 10.697C10.7671 11.1904 10.2347 11.5873 9.79667 11.3294L7.00722 9.68738Z"
              fill="currentColor"
            />
          </symbol>

          {/* New Copy Icon */}
          <symbol id="copy-icon" viewBox="0 0 12.7 12.7">
            <path d="m4.6395104.5296835c-.567738 0-1.064328.331462-1.306897.809253-.151891.256082-.06259.586654.197404.731738.254716.142095.576471.05171.719336-.202571.04912-.168465.199665-.281637.390157-.281637h6.0662956c.23423 0 .406177.171946.406177.406177v6.068363c0 .183495-.105741.327565-.264067.381889-.254286.142864-.344667.465137-.202572.719853.145086.26.475656.349295.731739.197404.469608-.244931.79375-.737887.79375-1.299146v-6.068363c0-.802241-.662786-1.46296-1.465027-1.46296zm-2.645317 2.646867c-.802241 0-1.46502698.660202-1.46502698 1.462443v6.0683635c0 .802241.66278598 1.46296 1.46502698 1.46296h6.066296c.802241 0 1.465027-.660719 1.465027-1.46296v-6.0683635c0-.802241-.662786-1.462443-1.465027-1.462443zm0 1.056266h6.066296c.234231 0 .406177.171946.406177.406177v6.0683635c0 .234231-.171946.406694-.406177.406694h-6.066296c-.23423 0-.406177-.172463-.406177-.406694v-6.0683635c0-.234231.171947-.406177.406177-.406177z" />
          </symbol>

          {/* Clock Icon */}
          <symbol id="clock-icon" viewBox="0 0 14 14">
            <path d="M6.73889 13.4101C3.48621 13.3672 0.859806 10.7408 0.816935 7.48812C0.859806 4.23544 3.48621 1.60904 6.73889 1.56616C9.99157 1.60904 12.618 4.23544 12.6608 7.48812C12.618 10.7408 9.99157 13.3672 6.73889 13.4101ZM6.73889 2.88215C4.20901 2.91546 2.16623 4.95824 2.13292 7.48812C2.16623 10.018 4.20901 12.0608 6.73889 12.0941C9.26877 12.0608 11.3115 10.018 11.3449 7.48812C11.3115 4.95824 9.26877 2.91546 6.73889 2.88215ZM10.0289 8.14611H6.08089V4.19814H7.39688V6.83012H10.0289V8.14611ZM12.195 3.34801L10.2151 1.37403L11.1422 0.44165L13.1228 2.41564L12.195 3.34736V3.34801ZM1.28214 3.34801L0.351074 2.41564L2.31914 0.44165L3.2502 1.37403L1.28345 3.34801H1.28214Z" />
          </symbol>

          {/* Arrow Right Icon */}
          <symbol id="arrowRight-icon" viewBox="0 0 24 24">
            <path d="M15 19a1 1 0 0 1-.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41L10.41 12l5.29 5.29A1 1 0 0 1 15 19z" />
          </symbol>
        </svg>

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
              <DebugDOM /> {/* 👈 Logs DOM size after hydration */}
              <LayoutWrapper>
                <LoginGuard />
                <CityBootstrapper lang={lang} googleApiKey={googleApiKey} />
                {children}
              </LayoutWrapper>
            </Providers>

            <div className="fixed top-0 w-full z-50">
              <div className="h-1.5" id="loader-spin"></div>
            </div>

            <MobileFooterNew lang={lang} dict={dict} origin={origin} />
          </GlobalProvider>
        </AppProvider>
      </body>
    </html>
  );
}

export async function generateMetadata() {
  const { lang } = await getRequestContext();
  const homepagedata: any = await getHomepageServerSide(lang);
  // params.data = homepagedata

  const metaTitle =
    lang === "en"
      ? homepagedata?.homepageData?.meta_title_en
      : homepagedata?.homepageData?.meta_title_ar;
  const metaDescription =
    lang === "en"
      ? homepagedata?.homepageData?.meta_description_en
      : homepagedata?.homepageData?.meta_description_ar;

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? `https://tamkeenstores.com.sa/${lang}`
      : "http://localhost:3000";

  return {
    metadataBase: new URL(baseUrl),
    title: metaTitle,
    description: metaDescription,
    keywords: [
      "Tamkeen Stores",
      "تمكين",
      "Electronics Saudi Arabia",
      "معارض تمكين",
    ],
    referrer: "origin-when-cross-origin",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
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
      type: "website",
      images: [
        { url: "/images/metaLogo.jpg", width: 800, height: 800, alt: "logo" },
      ],
      url: baseUrl,
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        en: "https://tamkeenstores.com.sa/en",
        ar: "https://tamkeenstores.com.sa/ar",
      },
    },
    appLinks: {
      ios: {
        url: "https://apps.apple.com/sa/app/tamkeen-stores-%D9%85%D8%B9%D8%A7%D8%B1%D8%B6-%D8%AA%D9%85%D9%83%D9%8A%D9%86/id1546482321",
        app_store_id: "com.tamkeen.tamkeenstore",
      },
      android: {
        package:
          "https://play.google.com/store/apps/details?id=com.tamkeen.tamkeenstores",
        app_name: "com.tamkeen.tamkeenstores",
      },
      web: {
        url: baseUrl,
        should_fallback: true,
      },
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      siteId: "@TamkeenStores",
      creator: "Muhammad Usman Siddiqui | usman@tamkeen-ksa.com",
      images: [`${baseUrl}/images/metaLogo.jpg`],
    },
  };
}
