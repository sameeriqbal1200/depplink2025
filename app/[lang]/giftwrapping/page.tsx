"use client"; // This is a client component 👈🏽

import React from 'react';
import dynamic from 'next/dynamic'
import { useSlot } from '@/app/_ctx/ClientDataRegistry';
import { useApp } from '@/app/_ctx/AppContext';

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function GiftWrapping() {
    const { lang } = useApp();
    const giftWrappingData = useSlot<any>("footer")

    return (
        <>
            <MobileHeader type="Third"  lang={lang} pageTitle={lang === 'ar' ? 'تغليف الهدايا' : 'Gift Wrapping'} />
            <div className="container py-16 md:py-4">
                <div className="my-2">
                    <h1 className=" font-semibold text-base 2xl:text-lg">{lang == 'ar' ? 'الاسئلة والاجوبة' : 'Gift Wrapping'}</h1>
                    <div className="text-sm text-[#5D686F] mt-1" dangerouslySetInnerHTML={{ __html: lang == 'ar' ? giftWrappingData?.data?.page_content_ar : giftWrappingData?.data?.page_content_en }}></div>
                </div>
            </div>
        </>
    )
}
