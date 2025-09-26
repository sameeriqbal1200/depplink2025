"use client"; // This is a client component 👈🏽

import React from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from "next/navigation"
import { useApp } from '@/app/_ctx/AppContext';

const AccountSidebar = dynamic(() => import('../../components/AccountSidebar'), { ssr: false })

export default function Settings(props: any) {

    const { lang, origin } = useApp();
    const path = usePathname();
    
    return (
        <>
            <div className="container py-4">
               
                <div className="flex items-start my-4 gap-x-5">
                    <AccountSidebar lang={lang} path={path} origin={origin}/>
                    
                    <div className="w-full">
                        <div className='flex items-center justify-between mb-5'>
                            <h3 className='text-base'>{lang == 'ar' ? 'قائـمة طلبــاتك' : 'List your requests'}</h3>
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