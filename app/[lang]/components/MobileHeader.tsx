'use client'

import React, { useEffect } from 'react'
import { RWebShare } from "react-web-share"
import { useRouter } from "next-nprogress-bar";


export default function MobileHeader(props: any) {
    const router = useRouter()

    var timerLoader: any = 0;
    var interval: any;
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {

                interval = setInterval(() => {
                    timerLoader += 1;
                }, 1000);

            } else if (document.visibilityState === 'visible') {
                if (interval) {
                    clearInterval(interval);
                }

                if (timerLoader >= 3600) {
                    const url = window.location.href;

                    if (url.includes('/cart') || url.includes('/checkout') ||
                        url.includes('/login') || url.includes('/signup')) {
                        window.location.href = `/${props.lang}`;
                    } else {
                        window.location.reload();
                    }
                }
                timerLoader = 0;
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (interval) {
                clearInterval(interval);
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
    // const goBack = () => {
    //     if (props.redirect) {
    //         router.push(`/${props.lang}/${props.redirect}`);
    //         router.refresh(); // Only refresh after push (optional, based on your needs)
    //     } else {
    //         const currentPath = window.location.pathname;
    //         if (currentPath.includes('/category/')) {
    //             router.push(`/${props.lang}`);
    //             router.refresh()
    //         } else {
    //             router.back();
    //             setTimeout(() => router.refresh(), 300);
    //         }
    //         // const returnTo = sessionStorage.getItem('preLoginRoute') || '/'
    //         // router.push(returnTo, { scroll: false })
    //         // router.refresh()
    //     }
    // }
    const goBack = () => {
        if (props.redirect) {
            router.push(`/${props.lang}/${props.redirect}`);
            return;
        }
        const currentPath = window.location.pathname;
        if (currentPath.includes('/category/')) {
            router.push(`/${props.lang}`);
        } else if (window.history.length > 2) {
            router.back();
        } else {
            router.push(`/${props.lang}`);
        }
    };
    const BackIcon = () => (
        <button className="w-16" onClick={goBack}>
            <svg height="30" width="30" className={props.lang === 'ar' ? 'rotate-180' : ''} viewBox="0 0 24 24"><path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z" /></svg>
        </button>
    );
    const pageTitle = props?.pageTitle
    return (
        <>
            {props.type === "Secondary" && (
                <div className="fixed top-0 z-40 w-full">
                    <div className="bg-white shadow-md py-3.5 px-2 flex items-center justify-between">
                        <BackIcon />
                        <h1 className="heading__base line-clamp-1">{pageTitle}</h1>
                        <button onClick={props.onClick} className="text-[#004B7A] font-semibold flex items-center gap-x-1.5">
                            <svg className={props.lang === 'ar' ? '-rotate-90' : 'rotate-90'} height="18" width="18" viewBox="0 0 512 512"><path d="M16 90.259h243.605c7.342 33.419 37.186 58.508 72.778 58.508s65.436-25.088 72.778-58.508h90.839c8.836 0 16-7.164 16-16s-7.164-16-16-16h-90.847c-7.356-33.402-37.241-58.507-72.77-58.507-35.548 0-65.419 25.101-72.772 58.507H16c-8.836 0-16 7.164-16 16s7.164 16 16 16zm273.877-15.958c0-.057.001-.115.001-.172.07-23.367 19.137-42.376 42.505-42.376 23.335 0 42.403 18.983 42.504 42.339l.003.235c-.037 23.407-19.091 42.441-42.507 42.441-23.406 0-42.454-19.015-42.507-42.408z" /></svg>
                            <p>{props.lang === 'ar' ? 'فلتر' : 'Filter'}</p>
                        </button>
                    </div>
                    <div className="h-2" id="loader-spin"></div>
                </div>
            )}

            {props.type === "Third" && (
                <div className="bg-white shadow-md py-3.5 fixed top-0 z-40 w-full px-2 flex items-center">
                    <BackIcon />
                    <h1 className="text-lg font-bold text-center w-64 line-clamp-1">{pageTitle}</h1>
                </div>
            )}

            {props.type === "Product" && (
                <div className="bg-white shadow-md py-3.5 fixed top-0 z-40 w-full px-2 flex items-center justify-between">
                    <BackIcon />
                    <RWebShare data={{ title: props.title!, text: props.text!, url: props.url! }}>
                        <button className="text-[#004B7A] font-semibold flex items-center gap-x-1.5">
                            <svg height="18" width="18" viewBox="-33 0 512 512.00102"><path d="M361.824 344.395c-24.531 0-46.633 10.594-61.973 27.445l-137.973-85.453c3.684-9.43 5.727-19.672 5.727-30.387 0-10.719-2.043-20.961-5.727-30.387l137.973-85.457c15.34 16.852 37.441 27.45 61.973 27.45 46.211 0 83.805-37.594 83.805-83.805s-37.594-83.801-83.805-83.801c-46.211 0-83.805 37.594-83.805 83.805 0 10.715 2.047 20.957 5.727 30.387l-137.969 85.453c-15.34-16.852-37.441-27.45-61.973-27.45-46.211 0-83.805 37.598-83.805 83.805s37.594 83.805 83.805 83.805c24.531 0 46.633-10.594 61.973-27.45l137.969 85.453c-3.68 9.43-5.727 19.672-5.727 30.391 0 46.207 37.594 83.801 83.805 83.801 46.211 0 83.805-37.594 83.805-83.801s-37.594-83.805-83.805-83.805z" /></svg>
                            <p>{props.lang === 'ar' ? 'شارك' : 'Share'}</p>
                        </button>
                    </RWebShare>
                </div>
            )}
        </>
    )
}