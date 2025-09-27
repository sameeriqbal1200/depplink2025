"use client"; // This is a client component 👈🏽

import React, { useEffect, useState, useContext } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next-nprogress-bar'
import GlobalContext from '../../GlobalContext'
import { useApp } from '@/app/_ctx/AppContext';
import PullToRefresh from "react-simple-pull-to-refresh";
import { getWishlistDataAPI } from '@/lib/accounts/wishlist.client';
import Link from 'next/link';
const MobileHeader = dynamic(() => import('../../components/MobileHeader'), { ssr: true })
const ProductLoop = dynamic(
    () => import("../../components/NewHomePageComp/ProductLoop"),
    { ssr: true })

type PullIndicatorProps = { state: "pulling" | "refreshing"; lang: "ar" | "en" };
const PullIndicator = ({ state, lang }: PullIndicatorProps) => (
    <div className="flex h-16 items-center justify-center gap-2 text-[#004B7A] my-22">
        {state === "pulling" ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 3a1 1 0 0 1 1 1v11.586l3.293-3.293 1.414 1.414-5 5a1 1 0 0 1-1.414 0l-5-5 1.414-1.414L11 15.586V4a1 1 0 0 1 1-1z" /></svg>
        ) : (
            <div className="rounded-full border-2 border-current border-t-transparent animate-spin" style={{ width: 22, height: 22 }} />
        )}
        <span className="text-sm">
            {state === "pulling" ? (lang === "ar" ? "اسحب للتحديث" : "Pull to refresh")
                : (lang === "ar" ? "جارٍ التحديث…" : "Refreshing…")}
        </span>
    </div>
);

export default function Wishlist() {
    const { lang, origin } = useApp();
    const uiLang = (lang === "ar" ? "ar" : "en") as any; // narrow to union
    // const footer = useSlot<any>("footer");
    const router = useRouter();
    const [wishlistData, setWishlistData] = useState<any>([])
    const [dict, setDict] = useState<any>([]);
    const [wishlistCount, setWishlistCount] = useState<any>("0");
    const [loading, setLoading] = useState<boolean>(true)
    const isMobileOrTablet = true;
    const { updateWishlist, setUpdateWishlist } = useContext(GlobalContext);


    // function IosSpinner({ size = 24 }: { size?: number }) {
    //     return (
    //         <div
    //             className="rounded-full border-2 border-current border-t-transparent animate-spin"
    //             style={{ width: size, height: size }}
    //             aria-hidden
    //         />
    //     );
    // }

    // function PullIndicator({ state }: { state: "pulling" | "refreshing" }) {
    //     // const { lang } = useApp();
    //     return (
    //         <div className="flex h-16 items-center justify-center gap-2 text-[#004B7A] my-22">
    //             {state === "pulling" ? (
    //                 // Arrow that hints "pull down"
    //                 <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
    //                     <path d="M12 3a1 1 0 0 1 1 1v11.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5A1 1 0 1 1 7.707 12.293L11 15.586V4a1 1 0 0 1 1-1z" />
    //                 </svg>
    //             ) : (
    //                 // iOS-style spinner
    //                 <IosSpinner size={22} />
    //             )}
    //             <span className="text-sm">
    //                 {state === "pulling"
    //                     ? lang === "ar"
    //                         ? "اسحب للتحديث"
    //                         : "Pull to refresh"
    //                     : lang === "ar"
    //                         ? "جارٍ التحديث…"
    //                         : "Refreshing…"}
    //             </span>
    //         </div>
    //     );
    // }

    const onRefresh = async () => {
        router.refresh();        // App Router re-fetch
        // or window.location.reload()
    };
    // const userAgent: UserAgent | null = typeof window !== 'undefined' ? useUserAgent(window.navigator.userAgent) : null;

    // const HomePage = () => {
    //     router.push(`/${lang}`);
    // }

    // const getWishlistData = () => {
    //     if (localStorage.getItem("userid")) {
    //         getWishlistDataAPI().then((wishlistDataCore: any) => {
    //             const wishlistUserData = wishlistDataCore?.wishlistDataCore
    //             setWishlistData(wishlistUserData)
    //             setWishlistCount(wishlistUserData?.user?.products?.data?.length)
    //             setLoading(false)
    //         })
    //     } else {
    //         router.push(`/${lang}/login`);
    //     }
    // }

    const getWishlistData = async () => {
        try {
            setLoading(true);
            const userId = typeof window !== "undefined" ? localStorage.getItem("userid") : null;
            if (!userId) { router.push(`/${lang}/login`); return; }

            const res: any = await getWishlistDataAPI();
            const core = res?.wishlistDataCore ?? {};
            setWishlistData(core);
            setWishlistCount(core?.user?.products?.data?.length ?? 0);
        } catch (e) {
            console.error("getWishlistData failed:", e);
            setWishlistData({});
            setWishlistCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getWishlistData()
    }, [updateWishlist])

    const items = wishlistData?.user?.products?.data ?? [];
    const count = items.length;
    const isEmpty = count === 0;


    return (
        <div>
            <MobileHeader type="Third" lang={lang} pageTitle={lang === 'ar' ? 'اخر طلباتك' : 'Wishlist'} />
            <PullToRefresh
                onRefresh={onRefresh}
                pullDownThreshold={64}       // distance to trigger
                resistance={2.2}             // pull "feel" (higher = harder)
                refreshingContent={<PullIndicator state="refreshing" lang={uiLang} />}
                pullingContent={<PullIndicator state="pulling" lang={uiLang} />}
                className="min-h-screen"
            >
                <div className="container md:py-4 py-16">
                    {loading ? (
                        // simple skeleton loader
                        <div className="my-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="h-40 bg-gray-100 rounded-md animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-start my-4 gap-x-5">
                            <div className="w-full">
                                <div className="mb-4 font-bold text-base max-md:hidden">
                                    <h2>{lang === "ar" ? "قائمة المفضلة" : "Wishlist"} ({count})</h2>
                                </div>

                                {!isEmpty ? (
                                    <div className="tamkeenSales_cardss relative grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 xl:gap-x-3 gap-2 items-start justify-center">
                                        <ProductLoop
                                            productData={items}
                                            lang={lang}                // or pass isArabic if ProductLoop expects boolean
                                            isMobileOrTablet={isMobileOrTablet}
                                            origin={origin}
                                        />
                                    </div>
                                ) : (
                                    <div className="container my-10 flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-base text-[#5D686F] m-auto">
                                                {lang === "ar" ? "لم يتم إضافة أي منتج إلى قائمة المفضلة!" : "No product added to wishlist!"}
                                            </p>
                                            <Link
                                                href={`${origin}/${lang}`}
                                                prefetch
                                                className="btn bg-[#004B7A] w-72 p-2.5 rounded-md text-sm 2xl:text-base text-white mt-6 inline-block text-center"
                                            >
                                                {lang === "ar" ? "تسوق المنتجات" : "Shop products"}
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </PullToRefresh>
        </div>
    )
}