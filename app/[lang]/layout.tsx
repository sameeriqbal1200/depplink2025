import React, { cache } from "react";
import dynamic from "next/dynamic";
import { getRequestContext } from "@/lib/request-context";
import { getDictionary } from "@/lib/i18n.server";
// import { AppProvider } from "@/app/_ctx/AppContext";
// import CityBootstrapper from "@/app/(site)/CityBootstrapper";
import { getHomepageServerSide } from "@/lib/homepage/homepage.server";
import { Api } from "@/lib/api/apiLinks";

const MobileFooterNew = dynamic(() => import("@/components/MobileFooterNew"), {
  ssr: true,
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
  children
}: {
  children: React.ReactNode;
}) {
  const {
    lang: headerLang,
    origin,
  } = await getRequestContext();

  const lang = headerLang ?? "en";
  const dict = await getDictionary(lang);
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY!;

  return (
    <div>
      {children}
      <div className="fixed top-0 w-full z-50">
        <div className="h-1.5" id="loader-spin"></div>
      </div>
      <MobileFooterNew lang={lang} dict={dict} origin={origin} />
    </div>
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
