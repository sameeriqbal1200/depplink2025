"use client"; // This is a client component 👈🏽

import React from 'react'
import dynamic from 'next/dynamic'
import { useApp } from '@/app/_ctx/AppContext';
import { useSlot } from '@/app/_ctx/ClientDataRegistry';

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function LoyaltyPoints() {
    const { lang } = useApp();
    const footer = useSlot<any>("footer");

    return (
        <div>
            <MobileHeader type="Third" lang={lang} pageTitle={lang === 'ar' ? 'نقاط الولاء' : 'Loyalty Points'} />
            <div className="container py-16 md:py-4">
                <div className="my-2">
                    <h1 className=" font-semibold text-base 2xl:text-lg">{lang == 'ar' ? 'نقاط الولاء' : 'Loyalty Points'}</h1>
                    <div className="text-sm text-[#5D686F] mt-1" dangerouslySetInnerHTML={{ __html: lang == 'ar' ? footer?.data?.page_content_ar : footer?.data?.page_content_en }}></div>
                </div>
            </div>
        </div>
    )
}
