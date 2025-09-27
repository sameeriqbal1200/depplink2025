"use client"; // This is a client component 👈🏽

import React from 'react'
import { usePathname } from "next/navigation"
import { useApp } from '@/app/_ctx/AppContext';

export default function Settings() {
    const { lang } = useApp();
    return (
        <>
            <div className="container py-4">
                <div className="flex items-start my-4 gap-x-5">
                    <div className="w-full">
                        <div className='flex items-center justify-between mb-5'>
                            <h3 className='text-base'>{lang === 'ar' ? 'قائـمة طلبــاتك' : 'List your requests'}</h3>
                        </div>
                        <div className="bg-white rounded-md shadow-md flex justify-start items-center mb-5">
                            <h1>test</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}