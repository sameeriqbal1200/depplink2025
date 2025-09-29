import { getRequestContext } from '@/lib/request-context'
import type { Metadata } from 'next'

export const viewport = {
    width: 'device-width',
    initialScale: 1.0,
    maximumScale: 1.0,
    // userScalable: false,
}

export async function generateMetadata(): Promise<Metadata> {
    const { lang } = await getRequestContext();
    const baseUrl = 'https://tamkeenstores.com.sa';
    const canonicalUrl = `${baseUrl}/${lang}/checkout`;

    return {
        title: `Checkout | Tamkeen Stores`,
        description: `Tamkeen Stores Checkout Page`,
        keywords: `Tamkeen Stores, Checkout, تمكين, Electronics Saudi Arabia`,
        referrer: 'origin-when-cross-origin',
        robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
                index: false,
                follow: false,
                noimageindex: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        openGraph: {
            siteName: `Tamkeen Stores`,
            title: `Checkout | Tamkeen Stores`,
            description: `Tamkeen Stores Checkout Page`,
            locale: lang,
            type: 'website',
            images: [
                {
                    url: `${baseUrl}/images/metaLogo.jpg`,
                    width: 800,
                    height: 800,
                    alt: 'Tamkeen Stores Logo',
                },
            ],
            url: canonicalUrl,
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                en: `${baseUrl}/en/checkout`,
                ar: `${baseUrl}/ar/checkout`,
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
                url: canonicalUrl,
                should_fallback: true,
            },
        },
        twitter: {
            card: 'summary_large_image',
            title: `Checkout | Tamkeen Stores`,
            description: `Tamkeen Stores Checkout Page`,
            site: '@TamkeenStores',
            creator: '@TamkeenStores',
            images: [`${baseUrl}/images/metaLogo.jpg`],
        },
    };
}


export default async function CheckoutLayout(
    props: { children: React.ReactNode}
) {


    const {
        children
    } = props;

    const { lang, baseUrl} = await getRequestContext();
    const jsonLd = [
        {
            "@id": "#breadcrumb",
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: lang === 'ar' ? 'الصفحة الرئيسية' : 'Homepage',
                    item: `${baseUrl}/${lang}`,
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: lang === 'ar' ? 'الدفع' : 'Checkout',
                    item: `${baseUrl}/${lang}/checkout`,
                },
            ],
        },
    ];


    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    )
}
