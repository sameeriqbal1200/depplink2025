"use client"; // This is a client component 👈🏽

import React from 'react'
import { useApp } from "@/app/_ctx/AppContext";
import { useSlot } from '@/app/_ctx/ClientDataRegistry';

export default function PrivacyPolicy() {
    const { lang } = useApp();
    const footer = useSlot<any>("footer");
    return (
        <>
            <div className="container py-4">
                <div className="mb-6">
                    <h1 className=" font-semibold text-lg 2xl:text-xl">{lang == 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</h1>
                    <div className="text-sm text-[#5D686F] mt-3" dangerouslySetInnerHTML={{ __html: lang == 'ar' ? footer?.page_content_ar : footer?.page_content_en }}></div>
                </div>
            </div>
        </>
    )
}
