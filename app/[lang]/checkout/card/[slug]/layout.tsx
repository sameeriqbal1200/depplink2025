
import type { Metadata } from 'next'
import { getRequestContext } from '@/lib/request-context';
type Props = {
    params: { slug: string, lang: string, data: any }
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
    const { lang, baseUrl } = await getRequestContext();
    const canonicalUrl = `${baseUrl}/${lang}/card`;

    return {
        title: `Card | Tamkeen Stores`,
        description: `Tamkeen Stores Card Page`,
        keywords: `Tamkeen Stores, Card, تمكين, Electronics Saudi Arabia`,
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
            title: `Card | Tamkeen Stores`,
            description: `Tamkeen Stores Card Page`,
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
                en: `${baseUrl}/en/card`,
                ar: `${baseUrl}/ar/card`,
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
            title: `Card | Tamkeen Stores`,
            description: `Tamkeen Stores Card Page`,
            site: '@TamkeenStores',
            creator: '@TamkeenStores',
            images: [`${baseUrl}/images/metaLogo.jpg`],
        },
    };
}

export default async function CardLayout({ children }: { children: React.ReactNode }) {
    const { lang, baseUrl, slugStr } = await getRequestContext();
    const jsonLd = [
        {
            "@id": "#breadcrumb",
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: lang === 'ar' ? 'الصفحة الرئيسي' : 'Home Page',
                    item: `${baseUrl}/${lang}`,
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: lang === 'ar' ? 'بطاقة' : 'Card',
                    item: `${baseUrl}/${lang}/checkout/card/${slugStr}`,
                },
            ],
        },
    ]
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
