import { Api } from "../api/Api";

type Props = {
    params: { slug: string, lang: string, data: any }
}

const fetcher = async (params: any) => {
    const slug = "tamkeenpremium";
    const res: any = await fetch(`${Api}/footer_pages/${slug}`, { next: { revalidate: 86400 } })
    return res.json()
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export default async function TamkeenPremiumLayout({ children, params }: { children: React.ReactNode, params: { slug: string, data: any, lang: string } }) {
    const footerdata = await fetcher(params);
    params.data = footerdata;
    return (
        <>
            {children}
        </>
    )
}
