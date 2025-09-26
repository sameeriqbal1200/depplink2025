"use client"; // This is a client component 👈🏽

import React from 'react';
import Link from 'next/link'
import { useApp } from '@/app/_ctx/AppContext';
import { useSlot } from '@/app/_ctx/ClientDataRegistry';

export default function AboutUs() {
    const { lang } = useApp();
    const footer = useSlot<any>("footer");
    console.log("footer", footer);  
    return (
        <>
            <div className="container md:py-4 pt-4 pb-20">
                {/* BreadCrumbs */}
                <ol className="flex text-gray-500  font-semibold dark:text-white-dark">
                    <li className="text-sm text-[#5D686F] font-semibold"><Link prefetch={false} scroll={false} href={`/${lang}`}>{lang === 'ar' ? 'الصفحة الرئيسي' : 'Home'}</Link></li>
                    <li className="text-sm text-primary font-medium before:content-['/'] before:px-1.5">{lang === 'ar' ? 'معلومات عنا' : 'About Us'}</li>
                </ol>

                <div className="my-6">
                    <h1 className=" font-semibold text-lg 2xl:text-xl">{lang === 'ar' ? 'معلومات عنا' : 'About Us'}</h1>
                    <div className="text-sm text-[#5D686F] mt-3" dangerouslySetInnerHTML={{ __html: lang === 'ar' ? footer?.data?.page_content_ar : footer?.data?.page_content_en }}></div>
                </div>
            </div>
        </>
    )
}
