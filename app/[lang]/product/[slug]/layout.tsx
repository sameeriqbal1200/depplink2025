import type { Metadata } from "next";
import { BridgeSlot } from "@/app/_ctx/ClientDataRegistry";
import { getRequestContext } from "@/lib/request-context";
import { getProductCached } from "@/lib/productpages/product.cached";

export default async function ProductLayout({ children }: { children: React.ReactNode }) {
    const { slugStr, city, lang } = await getRequestContext();
    if (!slugStr) return null;

    const productData = await getProductCached(city, slugStr, lang);
    const value = productData ? JSON.parse(JSON.stringify(productData)) : null;

    return <BridgeSlot slot="product" value={value}>{children}</BridgeSlot>;
}

export async function generateMetadata(): Promise<Metadata | null> {
    const { slugParts, slugStr, lang, origin, city } = await getRequestContext();
    if (!slugStr) return null;

    const productData = await getProductCached(city, slugStr, lang); // ✅ no second fetch

    const metaTitle =
        lang === "en"
            ? productData?.data?.meta_title_en ?? "Tamkeen Stores Product"
            : productData?.data?.meta_title_ar ?? "منتج | معارض تمكين";

    const metaDescription =
        lang === "en"
            ? productData?.data?.meta_description_en ??
            "Tamkeen Stores Product"
            : productData?.data?.meta_description_ar ??
            "منتج معارض تمكين";

    const suffix = slugParts?.length ? `/${slugParts.join("/")}` : "";
    const canonicalPath = `/${lang}${suffix}`;
    const canonicalUrl = `${origin}${canonicalPath}`;

    // Safe OG image fallback (don’t use `||` inside a template string)
    const productImage = productData?.data?.featured_image?.image;
    const ogImage = productImage
        ? `${origin}/product/${productImage}`
        : `${origin}/images/metaLogo.jpg`;

    return {
        metadataBase: new URL(origin),
        title: metaTitle,
        description: metaDescription,
        keywords: ["Tamkeen Stores", "تمكين", "Electronics Saudi Arabia", "معارض تمكين", "Product"],
        referrer: "origin-when-cross-origin",
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
        },
        formatDetection: { email: false, address: true, telephone: true },
        openGraph: {
            siteName: "Tamkeen Stores",
            title: metaTitle,
            description: metaDescription,
            locale: lang,
            type: "website",
            images: [{ url: ogImage, width: 800, height: 800, alt: "logo" }],
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
        },
    };
}
