import type { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';
import { Api } from "@/lib/api/apiLinks";
import { getRequestContext } from "@/lib/request-context";
import { getFooterCached } from "@/lib/footerpages/footer.cached";

const fetcher = async (params: any) => {
    const slug = params.slug
    const res = await fetch(`${Api}shipment-tracking/${slug}`);
    return res.json();
};

// Viewport settings
export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};


export async function generateMetadata(): Promise<Metadata | null> {
    const { slugParts, slugStr, lang, origin } = await getRequestContext();
    if (!slugStr) return null;

    const footer = await getFooterCached(slugStr);

    const metaTitle =
        lang === "en"
            ? footer?.data?.meta_title_en ?? "Tamkeen Stores Shipment Tracking"
            : footer?.data?.meta_title_ar ?? "تتبع الشحنة | معارض تمكين";

    const metaDescription =
        lang === "en"
            ? footer?.data?.meta_description_en ??
            "Tamkeen Stores Shipment Tracking"
            : footer?.data?.meta_description_ar ??
            "معارض تمكين تتبع الشحنة";

    // In /[lang]/shipmenttracking/[...slug], slugParts are ONLY the [...slug] bits (not "shipmenttracking")
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

// Main component for shipment tracking layout
export default async function ShipmentTrackingLayout({ children, params }: { children: React.ReactNode, params: { devicetype: any, slug: string, data: any, lang: string } }) {
    const headersList = headers();
    const deviceType: string | null = headersList.get('device-type');
    params.devicetype = deviceType;
    
    // Fetch shipment data based on slug
    const shipmentData = await fetcher(params);
    params.data = shipmentData;
   
    return (
        <>
            {children}
        </>
    );
}
