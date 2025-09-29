"use client"; // This is a client component 👈🏽

import React from 'react';
import dynamic from 'next/dynamic'
import { useApp } from '@/app/_ctx/AppContext';

const MobileHeader = dynamic(() => import('@/components/MobileHeader'), { ssr: true })

export default function Card() {
    const { lang, slugStr } = useApp();
    const Api = process.env.NEXT_PUBLIC_API

    return (
        <>
            <MobileHeader type="Third"  lang={lang} pageTitle={lang === 'ar' ? 'بوابة الدفع الآمنة' : 'Secure Payment'} />
            <div className="container py-32 md:py-32">
                <iframe className='w-full h-[800px]' src={Api + 'hyperpay/' + slugStr + '/' + lang}></iframe>
            </div>
        </>
    )
}
