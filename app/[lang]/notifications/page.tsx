"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useApp } from "@/app/_ctx/AppContext";
import { getNotificationsData } from '@/lib/footerpages/notifications.client'

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function Notifications() {
    const { lang } = useApp();
    const router = useRouter();
    const [notificationsListing, setNotificationsListing] = useState([]);

    useEffect(() => {
        getNotificationsData().then((data) => {
            setNotificationsListing(data?.notifications?.data ?? []);
        });
    }, []);
    return (
        <>
            <MobileHeader type="Third" lang={lang} pageTitle={lang === 'ar' ? 'إشعارات' : 'Notifications'} />
            <div className="container py-16 md:py-4">
                {(notificationsListing ?? [])
                    // (optional) dedupe if your API can return duplicates
                    .filter(((seen) => (n: any) => {
                        const k = `${n?.id ?? "noid"}-${n?.created_at ?? "nocreated"}-${n?.link ?? "nolink"}`;
                        if (seen.has(k)) return false;
                        seen.add(k);
                        return true;
                    })(new Set<string>()))
                    .map((data: any, i: number) => {
                        const key = `${data?.id ?? "noid"}-${data?.created_at ?? i}-${data?.link ?? "nolink"}`;
                        return (
                            <button
                                key={key}
                                onClick={() => router.push(data?.link)}
                                className="focus-visible:outline-none bg-white shadow-md rounded-md pb-2 ltr:text-left rtl:text-right w-full mb-3"
                            >
                                {data?.image ? (
                                    <Image
                                        src={data?.image}
                                        alt={lang === "ar" ? data?.title_arabic : data?.title}
                                        title={lang === "ar" ? data?.title_arabic : data?.title}
                                        width={1200}
                                        height={675}
                                        className="h-auto w-full rounded-tl-md rounded-tr-md"
                                        sizes="100vw"
                                    />
                                ) : null}

                                <div className="mt-3 px-2">
                                    <h6 className="font-semibold text-base text-[#004B7A]">
                                        {lang === "ar" ? data?.title_arabic : data?.title}
                                    </h6>

                                    <small className="font-medium text-[#000000]">
                                        {lang === "ar" ? data?.message_arabic : data?.message}
                                    </small>

                                    <div className="mt-4">
                                        <small className="font-medium text-[#5D686F] text-xs">
                                            {dayjs(data?.created_at).format("MMMM Do, YYYY | h:mm A")}
                                        </small>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
            </div>

            {/* <div className="container py-16 md:py-4">
                {notificationsListing?.map((data: any, i: any) => (
                    <button onClick={() => router.push(data?.link)} className="focus-visible:outline-none bg-white shadow-md rounded-md pb-2 text-left w-full mb-3" key={data?.id + i}>
                        {data?.image ?
                            <Image src={data?.image} alt={lang === 'ar' ? data?.title_arabic : data?.title} title={lang === 'ar' ? data?.title_arabic : data?.title} height={0} width={0} className="h-auto w-full rounded-tl-md rounded-tr-md"
                                sizes='100vw'
                            />
                            : null}
                        <div className="mt-3 px-2">
                            <h6 className="font-semibold text-base text-[#004B7A]">{lang === 'ar' ? data?.title_arabic : data?.title}</h6>
                            <small className="font-medium text-[#000000]">{lang === 'ar' ? data?.message_arabic : data?.message}</small>

                            <div className="mt-4">
                                <small className="font-medium text-[#5D686F] text-xs">{dayjs(data?.created_at?.split('T')[0]).format('MMMM Do, YYYY | h:mm A')}</small>
                            </div>
                        </div>
                    </button>
                ))}
            </div> */}
        </>
    )
}
