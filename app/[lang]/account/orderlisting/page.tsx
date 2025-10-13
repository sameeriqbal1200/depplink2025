"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react'
import 'dayjs/locale/ar'
import dayjs from 'dayjs'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next-nprogress-bar'
import { useApp } from '@/app/_ctx/AppContext';
import { getOrderListingData } from '@/lib/accounts/orderListing.client';

const MobileHeader = dynamic(() => import('../../components/MobileHeader'), { ssr: true })

export default function OrderListing() {
    const router = useRouter();
    const { lang, origin } = useApp();
    const [orderListing, setOrderListing] = useState<any>([])

    // CURRENCY SYMBOL //
    const currencySymbol = <svg className="riyal-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39" width="11" height="12">
        <path fill="currentColor" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"></path>
        <path fill="currentColor" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
    </svg>;

    const getOrderListData = async () => {
        try {
            const userId =
                typeof window !== "undefined" ? localStorage.getItem("userid") : null;

            if (!userId) {
                router.push(`/${lang}`);
                return;
            }

            const res = await getOrderListingData();
            setOrderListing(res?.orderListingData ?? []);
        } catch (err) {
            console.error("Failed to load order list:", err);
            setOrderListing([]); // fallback
        }
    };

    useEffect(() => {
        getOrderListData()
    }, [])

    const statusMap: Record<number, { ar: string; en: string; color: string }> = {
        0: { ar: "تم الإستلام", en: "Received", color: "#20831E" },
        1: { ar: "تم التأكيد", en: "Confirmed", color: "#219EBC" },
        2: { ar: "قيد التنفيذ", en: "Processing", color: "#20831E" },
        3: { ar: "خرج للتوصيل", en: "Out for Delivery", color: "#219EBC" },
        4: { ar: "تم التوصيل", en: "Delivered", color: "#20831E" },
        5: { ar: "ملغي", en: "Cancel", color: "#DC4E4E" },
        6: { ar: "تم الإرجاع", en: "Refunded", color: "#DC4E4E" },
        7: { ar: "فشل", en: "Failed", color: "#DC4E4E" },
        8: { ar: "في انتظار الدفع", en: "Pending", color: "#00243c95" },
    };

    const fmt = (n: number) => Intl.NumberFormat("en-US").format(n);
    const canTrack = (d: any) => {
        return (
            d?.shipment_order &&
            Object.keys(d?.shipment_order).length > 0 &&
            [0, 1, 2, 3].includes(Number(d?.status))
        );
    };

    const getTotal = (d: any) =>
        d?.ordersummary?.find((x: any) => x?.name === "total")?.price ?? d?.ordersummary?.[0]?.price ?? 0;

    return (
        <>

            <MobileHeader type="Third" lang={lang} pageTitle={lang === 'ar' ? 'قائـمة طلبــاتك' : 'List of Orders'} />
            <div className="container md:py-4 py-16">
                <div className="flex items-start my-4 gap-x-5">
                    <div className="w-full">
                        <div className='flex items-center justify-between font-bold text-base mb-4 max-md:hidden'>
                            <h2>{lang == 'ar' ? 'قائـمة طلبــاتك' : 'List of Orders'}</h2>
                        </div>
                        <div>
                            {orderListing?.orderdata?.orders_data?.map((d: any) => {
                                const total = getTotal(d);
                                const st = statusMap[Number(d?.status)] as typeof statusMap[keyof typeof statusMap] | undefined;
                                return (
                                    <div
                                        className="grid grid-cols-3 md:grid-cols-6 bg-white px-3 md:p-5 shadow-md rounded-md mb-3 text-sm"
                                        key={d?.id ?? d?.order_no}
                                    >
                                        <div className="text-[#1C262D85] max-md:my-4">
                                            <h4 className="font-medium text-xs mb-1">{lang === "ar" ? "رقم الطلب" : "Order Number"}:</h4>
                                            <p className="font-medium text-[#004B7A]">{d?.order_no}</p>
                                        </div>

                                        <div className="text-[#1C262D85] max-md:my-4">
                                            <h4 className="font-medium text-xs mb-1">{lang === "ar" ? "تاريخ الطلب" : "Order Date"}:</h4>
                                            <p className="font-medium text-[#004B7A]">
                                                {dayjs(d?.created_at).locale(lang === "ar" ? "ar" : "en").format("MMM DD, YYYY")}
                                            </p>
                                        </div>

                                        <div className="text-[#1C262D85] max-md:my-4">
                                            <h4 className="font-medium text-xs mb-1">{lang === "ar" ? "عدد المنتجات" : "No. of Products"}:</h4>
                                            <p className="font-medium text-[#004B7A]">
                                                ({d?.details_count}) {lang === "ar" ? "منتجات" : "Items"}
                                            </p>
                                        </div>

                                        <div className="text-[#1C262D85] max-md:my-4">
                                            <h4 className="font-medium text-xs mb-1">{lang === "ar" ? "إجمالي القيمة" : "Total Value"}:</h4>
                                            <p className="font-medium text-[#004B7A] flex items-center gap-1">
                                                {fmt(total)} {currencySymbol}
                                            </p>
                                        </div>

                                        <div className="text-[#1C262D85] max-md:my-4">
                                            <h4 className="font-medium text-xs mb-1">{lang === "ar" ? "حالة الطلب" : "Order Status"}:</h4>
                                            <p className="font-medium" style={{ color: st?.color ?? "#00243c95" }}>
                                                {st ? (lang === "ar" ? st.ar : st.en) : "---"}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-center underline text-[#B15533]">
                                            <Link href={`${origin}/${lang}/account/orderdetails/${d?.id}`} prefetch replace={false}>
                                                {lang === "ar" ? "إظهار التفاصيل" : "View Details"}
                                            </Link>
                                        </div>
                                        {canTrack(d) && (
                                            <div className='col-span-3'>
                                                <hr className="opacity-10 mb-3" />
                                                <div className="text-center underline text-[#004B7A] max-md:mb-4">
                                                    <Link
                                                        prefetch={false}
                                                        scroll={false}
                                                        href={`${origin}/${lang}/shipmenttracking/${d?.shipment_order?.shipment_no}`}
                                                        replace={false}
                                                    >
                                                        {lang === "ar" ? "تتبع حالة الشحنة" : "Track Your Shipment"}
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}