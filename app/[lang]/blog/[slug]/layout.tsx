import { Api } from '../../api/Api';

type Props = {
    params: { slug: string, lang: string, data: any }
}

const fetcher = async (params: any) => {
    const slug = params.slug
    const res: any = await fetch(`${Api}/blog/${slug}`, { next: { revalidate: 86400 } })
    return res.json()
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export default async function BlogDetailsLayout({ children, params }: { children: React.ReactNode, params: { slug: string, data: any, lang: string } }) {
    const blogDetails = await fetcher(params);
    params.data = blogDetails;
    return (
        <>
            {children}
        </>
    )
}
