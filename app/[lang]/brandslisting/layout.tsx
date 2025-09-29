import { getRequestContext } from "@/lib/request-context";
import { getFooterCached } from "@/lib/footerpages/footer.cached";
import type { Metadata } from 'next'
import { BridgeSlot } from "@/app/_ctx/ClientDataRegistry";
import { getBrandListingPageData } from "@/lib/brand/brand-listing.server";

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export default async function BrandLayout({ children }: { children: React.ReactNode }) {
    const { lang, baseUrl } = await getRequestContext();

    const brandPageData = await getBrandListingPageData();
    const value = brandPageData ? JSON.parse(JSON.stringify(brandPageData)) : null;
    const jsonLd = [
        {
            "@context": "https://schema.org", // Prefer https
            "@type": "BreadcrumbList",
            "@id": "#breadcrumb",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: lang === 'ar' ? 'الصفحة الرئيسية' : 'Home',
                    item: `${baseUrl}/${lang}`
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: lang === 'ar' ? 'تسوق حسب العلامة التجارية' : "Shop by Brands",
                    item: `${baseUrl}/${lang}/${brandPageData?.data?.data?.page_link}`
                }
            ]
        }
    ];

    return (
        <BridgeSlot slot="brandListingPageData" value={value}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </BridgeSlot>
    );
}

export async function generateMetadata(): Promise<Metadata | null> {
    const { slugParts, slugStr, lang, origin } = await getRequestContext();
    if (!slugStr) return null;

    const footer = await getFooterCached(slugStr);

    const metaTitle =
        lang === "en"
            ? footer?.data?.meta_title_en ?? "Tamkeen Stores Brand Listing"
            : footer?.data?.meta_title_ar ?? "قائمة الماركات | معارض تمكين";

    const metaDescription =
        lang === "en"
            ? footer?.data?.meta_description_en ??
            "Tamkeen Stores Brand Listing"
            : footer?.data?.meta_description_ar ??
            "قائمة الماركات معارض تمكين";

    // In /[lang]/brandslisting/[...slug], slugParts are ONLY the [...slug] bits (not "brandslisting")
    const suffix = slugParts?.length ? `/${slugParts.join("/")}` : "";
    const canonicalPath = `/${lang}${suffix}`;
    const canonicalUrl = `${origin}${canonicalPath}`;

    return {
        metadataBase: new URL(origin),
        title: metaTitle,
        description: metaDescription,
        keywords: [
            "Tamkeen Stores",
            "تمكين",
            "Electronics Saudi Arabia",
            "معارض تمكين",
            "Brand Listing",
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
        formatDetection: { email: false, address: true, telephone: true },

        openGraph: {
            siteName: "Tamkeen Stores",
            title: metaTitle,
            description: metaDescription,
            locale: lang,
            type: "website",
            images: [
                {
                    url: `${origin}/images/metaLogo.jpg`,
                    width: 800,
                    height: 800,
                    alt: "logo",
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
                package:
                    "https://play.google.com/store/apps/details?id=com.tamkeen.tamkeenstores",
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
            images: [`${origin}/images/metaLogo.jpg`],
        },

        // ✅ Developer Info (will render as <meta name="developer:*">)
        other: {
            "developer:name": "Muhammad Usman Siddiqui",
            "developer:email": "usman@tamkeen-ksa.com",
            "developer:role": "E-commerce Applications Manager",
        },
    };
}
