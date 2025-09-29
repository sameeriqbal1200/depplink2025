import type { Metadata } from 'next'
import Script from "next/script";
import { getRequestContext } from '@/lib/request-context';
import { getCategoryData } from '@/lib/categoryPage/category.server';
import { ReactNode } from 'react';
import { BridgeSlot } from '@/app/_ctx/ClientDataRegistry';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA;

export async function generateMetadata(): Promise<Metadata | null> {
  const { slugStr, lang, city, origin, slugParts } = await getRequestContext();
  if (!slugStr) return null;

  // ✅ same call, but no extra fetch (uses cache)
  const categoryData = await getCategoryData(slugStr, lang, { city });

  const metaTitle =
    lang === "en"
      ? categoryData?.category?.meta_title_en ?? "Tamkeen Stores Search"
      : categoryData?.category?.meta_title_ar ?? "منتج | معارض تمكين";

  const metaDescription =
    lang === "en"
      ? categoryData?.category?.meta_description_en ??
      "Tamkeen Stores Search"
      : categoryData?.category?.meta_description_ar ??
      "منتج معارض تمكين";

  const suffix = slugParts?.length ? `/${slugParts.join("/")}` : "";
  const canonicalPath = `/${lang}${suffix}`;
  const canonicalUrl = `${origin}${canonicalPath}`;

  // Safe OG image fallback (don’t use `||` inside a template string)
  const productImage = categoryData?.category?.featured_image?.image;
  const ogImage = productImage
    ? `${origin}/product/${productImage}`
    : `${origin}/images/metaLogo.jpg`;

  const noIndex = categoryData?.category?.no_index === 1;
  const noFollow = categoryData?.category?.no_follow === 1;
  const hasProducts = categoryData?.categoryData?.products?.data?.length > 0;

  const isArabic = lang === 'ar' ? true : false
  return {
    metadataBase: new URL(origin),
    title: metaTitle,
    description: metaDescription,
    keywords: [
      isArabic
        ? categoryData?.category?.product_meta_tag_ar
        : categoryData?.category?.product_meta_tag_en,
    ],
    referrer: 'origin-when-cross-origin',
    robots: {
      index: !noIndex && hasProducts,
      follow: !noFollow && hasProducts,
      googleBot: { index: !noIndex && hasProducts, follow: !noFollow && hasProducts, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      siteName:
        isArabic
          ? `${categoryData?.category?.name_arabic} | متاجر تمكين`
          : `${categoryData?.category?.name} | Tamkeen Stores`,
      title: metaTitle,
      description: metaDescription,
      locale: lang,
      type: 'website',
      images: [
        {
          url: categoryData?.category?.web_media_image == null ? '/images/metaLogo.jpg' : `${NewMedia}${categoryData?.category?.web_media_image.image}`,
          width: 800,
          height: 800,
          alt:
            isArabic
              ? categoryData?.category?.name_arabic
              : categoryData?.category?.name,
        },
      ],
      url: canonicalUrl,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${origin}/en${suffix}`,
        ar: `${origin}/ar${suffix}`,
      },
    },
    appLinks: {
      ios: {
        url: "https://apps.apple.com/sa/app/tamkeen-stores-%D9%85%D8%B9%D8%A7%D8%B1%D8%B6-%D8%AA%D9%85%D9%83%D9%8A%D9%86/id1546482321",
        app_store_id: "com.tamkeen.tamkeenstore",
      },
      android: {
        package: "https://play.google.com/store/apps/details?id=com.tamkeen.tamkeenstores",
        app_name: "com.tamkeen.tamkeenstores",
      },
      web: { url: canonicalUrl, should_fallback: true },
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      site: "@TamkeenStores",
      creator: "@TamkeenStores",
      images: [ogImage],
    },
    other: {
      "developer:name": "Muhammad Usman Siddiqui",
      "developer:email": "usman@tamkeen-ksa.com",
      "developer:role": "E-commerce Applications Manager",
    }
  }
}

export default async function SearchLayout({ children }: { children: ReactNode }) {
  const { slugStr, lang, city, baseUrl } = await getRequestContext();
  if (!slugStr) return null;
  const value = null;
  const isArabic = lang == 'ar';

  const jsonLd = [
    {
      "@context": "https://schema.org", // Use HTTPS version
      "@type": "BreadcrumbList",
      "@id": "#breadcrumb",
      itemListElement: [
        {
            "@type": "ListItem",
            position: 1,
            name: lang === 'ar' ? 'الصفحة الرئيسية' : 'Home Page',
            item: `${baseUrl}/${lang}`,
        },
        {
            "@type": "ListItem",
            position: 2,
            name: isArabic ? 'بحث' : 'Search',
            item: `${baseUrl}/${lang}/search?text=${slugStr}`,
        }
      ],
    },
  ];

  return (
    <>
      <BridgeSlot slot="category" value={value}>
        <Script 
            type="application/ld+json" 
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} 
          />
        {children}
      </BridgeSlot>
    </>
  )
}