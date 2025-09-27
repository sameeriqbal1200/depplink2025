"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDictionary } from "../dictionaries"
import dynamic from 'next/dynamic';
import { post } from "@/lib/api/apiCalls"

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function Flyer({ params, searchParams }: { params: { lang: string, data: any, devicetype: any }, searchParams: any }) {
    const [dict, setDict] = useState<any>([]);
    const [data, setData] = useState<any>(params?.data?.data);

    useEffect(() => {
        (async () => {
            const translationdata = await getDictionary(lang);
            setDict(translationdata);
        })();

        if (searchParams?.notifications?.length) {
            notificationCount()
        }
    }, [params])

    const notificationCount = () => {
        if (searchParams?.notifications?.length) {
            var data = {
                id: searchParams?.notifications,
                mobileapp: true,
            }
            post('notificationsCounts', data).then((responseJson: any) => {
                if (responseJson?.success) {
                }
            })
        }
    }

    return (
        <>
            {params.devicetype === 'mobile' ?
                <MobileHeader type="Third" lang={lang} pageTitle={lang == 'ar' ? 'النشرة الترويجية' : 'Flyer'} />
                : null}
            <div className="container py-16 md:py-4">
                {/* BreadCrumbs */}
                {params.devicetype === 'mobile' ? null :
                    <ol className="flex text-gray-500  font-semibold dark:text-white-dark">
                        <li className="text-sm text-[#5D686F] font-semibold"><Link href={'/' + lang}>{lang == 'ar' ? 'الصفحة الرئيسي' : 'Home'}</Link></li>
                        <li className="text-sm text-primary font-medium before:content-['/'] before:px-1.5">{lang == 'ar' ? 'النشرة الترويجية' : 'Flyer'}</li>
                    </ol>
                }

                <div className="md:my-6 w-full">
                    <iframe src="https://player.flipsnack.com?hash=RkI2NkREQ0M1QTgrZHp1OHZvNGYwZw==" width="100%" height={params.devicetype === 'mobile' ? "560px" : "1200px"} seamless scrolling="no" frameBorder="0" allowFullScreen allow="autoplay; clipboard-read; clipboard-write"></iframe>
                    {/* <div className="text-sm text-[#5D686F] mt-3" dangerouslySetInnerHTML={{ __html: lang == 'ar' ? data?.page_content_ar : data?.page_content_en }}></div> */}
                </div>
            </div>
        </>
    )
}
