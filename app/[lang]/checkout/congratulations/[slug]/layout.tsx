import type { Metadata } from 'next'
import Script from "next/script";
import { getRequestContext } from '@/lib/request-context';
import { getOrderCached } from '@/lib/checkout/checkout.cached';
import { BridgeSlot } from '@/app/_ctx/ClientDataRegistry';

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    // userScalable: false,
}

export async function generateMetadata(): Promise<Metadata | null> {
    const { slugStr, lang } = await getRequestContext();
    if (!slugStr) return null;

    const orderData = await getOrderCached(slugStr);
    return {
        title: 'Order Confirmation | Tamkeen Stores',
        referrer: 'origin-when-cross-origin',
        robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
                index: false,
                follow: false,
                noimageindex: false,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        formatDetection: {
            email: true,
            address: true,
            telephone: true,
        },
        openGraph: {
            siteName: `Tamkeen Stores`,
            title: `Order Confirmation | Tamkeen Stores`,
            locale: lang,
            type: 'website',
            images: [
                {
                    url: '/images/metaLogo.jpg', // Must be an absolute URL
                    width: 800,
                    height: 800,
                    alt: 'logo',
                },
            ],
            url: `https://tamkeenstores.com.sa/${lang}/checkout/orderconfirmation/${orderData?.orderdata?.id}`,
        },
        alternates: {
            canonical: `https://tamkeenstores.com.sa/${lang}/checkout/orderconfirmation/${orderData?.orderdata?.id}`, //This will be current link will come
            languages: {
                'en': `https://tamkeenstores.com.sa/en/checkout/orderconfirmation/${orderData?.orderdata?.id}`,
                'ar': `https://tamkeenstores.com.sa/ar/checkout/orderconfirmation/${orderData?.orderdata?.id}`,
            },
        },
        appLinks: {
            ios: {
                url: 'https://apps.apple.com/sa/app/tamkeen-stores-%D9%85%D8%B9%D8%A7%D8%B1%D8%B6-%D8%AA%D9%85%D9%83%D9%8A%D9%86/id1546482321',
                app_store_id: 'com.tamkeen.tamkeenstore',
            },
            android: {
                package: 'https://play.google.com/store/apps/details?id=com.tamkeen.tamkeenstores&hl=en&gl=US&pli=1',
                app_name: 'com.tamkeen.tamkeenstores',
            },
            web: {
                url: `https://tamkeenstores.com.sa/${lang}/checkout/orderconfirmation/${orderData?.orderdata?.id}`,
                should_fallback: true,
            },
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Order Confirmation | Tamkeen Stores',
            description: 'Order Confirmation | Tamkeen Stores',
            siteId: '@TamkeenStores',
            creator: 'Muhammad Usman Siddiqui | usman@tamkeen-ksa.com',
            images: ['/images/metaLogo.jpg'], // Must be an absolute URL
        },
    }
}

export default async function CongratulationsLayout({ children }: { children: React.ReactNode }) {
    const { slugStr, lang, baseUrl } = await getRequestContext();

    if (!slugStr) return null;
    const orderData = await getOrderCached(slugStr);
    const value = orderData ? JSON.parse(JSON.stringify(orderData)) : null;

    const jsonLd = [
        {
            "@id": "#breadcrumb",
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
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
                    name: lang === 'ar' ? 'تهانينا' : 'Congratulations',
                    item: `${baseUrl}/${lang}/checkout/congratulations/${slugStr}`,
                },
            ],
        },
    ];

    return (
        <>
            <BridgeSlot slot="order" value={value}>
                <Script 
                    type="application/ld+json" 
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} 
                />
                {children}
            </BridgeSlot>
        </>
    )
}
