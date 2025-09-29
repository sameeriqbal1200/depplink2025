import type { Metadata } from "next";
import { getRequestContext } from "@/lib/request-context";
import { BridgeSlot } from "@/app/_ctx/ClientDataRegistry";
import { getShipmentTrackingCached } from "@/lib/shipmentTracking/shipmentTracking.cached";

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export default async function ShipmentTrackingLayout({ children }: { children: React.ReactNode }) {
    const { slugStr, lang, baseUrl } = await getRequestContext();
    if (!slugStr) return null;

    const shipmentTracking = await getShipmentTrackingCached(slugStr);
    const value = shipmentTracking ? JSON.parse(JSON.stringify(shipmentTracking)) : null;

    const jsonLd = [
        {
            "@id": "#breadcrumb",
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: lang === "ar" ? "الصفحة الرئيسية" : "Home Page",
                    item: `${baseUrl}/${lang}`,
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: lang === "ar" ? "تتبع الشحنة" : "Shipment Tracking",
                    item: `${baseUrl}/${lang}/shipment-tracking`,
                },
            ],
        },
    ];


    return (
        <BridgeSlot slot="shipmentTracking" value={value}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </BridgeSlot>
    );
}

// ---- SEO metadata ----
export async function generateMetadata(): Promise<Metadata | null> {
    const { slugParts, slugStr, lang, origin } = await getRequestContext();
    if (!slugStr) return null;

    // ✅ Cached API call for shipment tracking page
    const shipmentTracking = await getShipmentTrackingCached(slugStr);

    const metaTitle =
        lang === "en"
            ? shipmentTracking?.data?.meta_title_en ?? "Tamkeen Stores Shipment Tracking"
            : shipmentTracking?.data?.meta_title_ar ?? "تتبع الشحنة | معارض تمكين";

    const metaDescription =
        lang === "en"
            ? shipmentTracking?.data?.meta_description_en ??
            "Track your shipment with Tamkeen Stores easily and quickly."
            : shipmentTracking?.data?.meta_description_ar ??
            "تتبع شحنتك من معارض تمكين بسهولة وسرعة.";

    // Slug parts (shipment-tracking/[...slug])
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
            "Shipment Tracking",
            "تتبع الشحنة",
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
                    alt: "Tamkeen Stores Logo",
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

        // ✅ Developer Info
        other: {
            "developer:name": "Muhammad Usman Siddiqui",
            "developer:email": "usman@tamkeen-ksa.com",
            "developer:role": "E-commerce Applications Manager",
        },
    };
}