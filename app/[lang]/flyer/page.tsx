"use client"; // This is a client component 👈🏽

import React from 'react';
import Link from 'next/link'
import dynamic from 'next/dynamic';
import { useApp } from '@/app/_ctx/AppContext';

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function Flyer() {
    const { deviceType, lang } = useApp()

    return (
        <>
            {deviceType === 'mobile' ?
                <MobileHeader type="Third" lang={lang} pageTitle={lang == 'ar' ? 'النشرة الترويجية' : 'Flyer'} />
                : null}
            <div className="container py-16 md:py-4">
                {/* BreadCrumbs */}
                {deviceType === 'mobile' ? null :
                    <ol className="flex text-gray-500  font-semibold dark:text-white-dark">
                        <li className="text-sm text-[#5D686F] font-semibold"><Link href={'/' + lang}>{lang == 'ar' ? 'الصفحة الرئيسي' : 'Home'}</Link></li>
                        <li className="text-sm text-primary font-medium before:content-['/'] before:px-1.5">{lang == 'ar' ? 'النشرة الترويجية' : 'Flyer'}</li>
                    </ol>
                }

                <div className="md:my-6 w-full">
                    <iframe src="https://player.flipsnack.com?hash=RkI2NkREQ0M1QTgrZHp1OHZvNGYwZw==" width="100%" height={deviceType === 'mobile' ? "560px" : "1200px"} seamless scrolling="no" frameBorder="0" allowFullScreen allow="autoplay; clipboard-read; clipboard-write"></iframe>
                    {/* <div className="text-sm text-[#5D686F] mt-3" dangerouslySetInnerHTML={{ __html: lang == 'ar' ? data?.page_content_ar : data?.page_content_en }}></div> */}
                </div>
            </div>
        </>
    )
}
