'use client'

import React, { useContext, useEffect } from 'react'
import { RWebShare } from "react-web-share"
import { useRouter } from "next-nprogress-bar";
import ArrowLeftIcon from './Icons/ArrowLeftIcon';
import FilterIcon from './Icons/FilterIcon';
import ShareIcon from './Icons/ShareIcon';
import GlobalContext from '@/app/GlobalContext';
import { getUserCompareData, getUserWishlistData } from '@/lib/components/component.client';


export default function MobileHeader(props: any) {
    const router = useRouter()
    const { updateWishlist, setUpdateWishlist } = useContext(GlobalContext);

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
            <ArrowLeftIcon size={30} color='#000000' className={props.lang === 'ar' ? 'rotate-180' : ''} />
        </button>
    );

    useEffect(() => {
        getUserData();
    }, [updateWishlist]);

    const getUserData = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));

        const userId = localStorage.getItem("userid");

        if (!localStorage.getItem("userCompare")) {
            const getData = await getUserCompareData(userId);
            if (getData?.userCompareData) {
                localStorage.setItem(
                    "userCompare",
                    JSON.stringify(getData.userCompareData.comparedata)
                );
                window.dispatchEvent(new Event("storage"));
            }
        }

        if (!localStorage.getItem("userWishlist")) {
            const getDatapd = await getUserWishlistData(userId);
            if (getDatapd?.userWishlistData) {
                localStorage.setItem(
                    "userWishlist",
                    JSON.stringify(getDatapd.userWishlistData.wishlistdata)
                );
                window.dispatchEvent(new Event("storage"));
            }
        }
    };

    const pageTitle = props?.pageTitle
    return (
        <>
            {props.type === "Secondary" && (
                <div className="fixed top-0 z-40 w-full">
                    <div className="bg-white shadow-md py-3.5 px-2 flex items-center justify-between">
                        <BackIcon />
                        <h1 className="heading__base line-clamp-1">{pageTitle}</h1>
                        <button onClick={props.onClick} className="text-[#004B7A] font-semibold flex items-center gap-x-1.5">
                            <FilterIcon size={18} color='#004B7A' className={props.lang === 'ar' ? '-rotate-90' : 'rotate-90'} />
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
                            <ShareIcon size={18} color='#004B7A' />
                            <p>{props.lang === 'ar' ? 'شارك' : 'Share'}</p>
                        </button>
                    </RWebShare>
                </div>
            )}
        </>
    )
}