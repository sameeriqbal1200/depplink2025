"use client"; // This is a client component 👈🏽

import React from 'react'
import { useApp } from "@/app/_ctx/AppContext";
import { useSlot } from '@/app/_ctx/ClientDataRegistry';
import Link from 'next/link';

export default function PrivacyPolicy() {
    const { origin, lang } = useApp();
    const footer = useSlot<any>("privacy_policy");
    return (
        <>
            <div className="container pt-4 pb-24 md:py-4">
                {/* BreadCrumbs */}
                <ol className="flex text-gray-500  font-semibold dark:text-white-dark">
                    <li className="text-sm text-[#5D686F] font-semibold"><Link href={`${origin}/${lang}`}>{lang == 'ar' ? 'الصفحة الرئيسي' : 'Home'}</Link></li>
                    <li className="text-sm text-primary font-medium before:content-['/'] before:px-1.5">{lang == 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</li>
                </ol>
                <div className="my-6">
                    <h1 className=" font-semibold text-lg 2xl:text-xl">{lang == 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</h1>
                    <div className="text-sm text-[#5D686F] mt-3" dangerouslySetInnerHTML={{ __html: lang == 'ar' ? footer?.data?.page_content_ar : footer?.data?.page_content_en }}></div>
                </div>
            </div>
        </>
    )
}
