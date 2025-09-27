"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react'
import 'dayjs/locale/ar'
import dayjs from 'dayjs'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { get } from "../../api/ApiCalls"
import { getDictionary } from "../../dictionaries"
import { usePathname } from "next/navigation"
import { useRouter } from 'next-nprogress-bar'

const MobileHeader = dynamic(() => import('../../components/MobileHeader'), { ssr: true })

export default function OrderListing({ params }: { params: { lang: string, data: any, devicetype: any } }) {
    const [dict, setDict] = useState<any>([]);
    const [orderListing, setOrderListing] = useState<any>([])
    const router = useRouter();
    const path = usePathname();

    // CURRENCY SYMBOL //
    const currencySymbol = <svg className="riyal-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39" width="11" height="12">
        <path fill="currentColor" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"></path>
        <path fill="currentColor" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
    </svg>;

    const getOrderListData = async () => {
        if (localStorage.getItem('userid')) {
            await get(`user-orders/${localStorage.getItem('userid')}`).then((responseJson: any) => {
                setOrderListing(responseJson)
            })
        } else {
            router.push(`/${params.lang}`)
        }
    }

    useEffect(() => {
        (async () => {
            const translationdata = await getDictionary(params.lang);
            setDict(translationdata);
        })();
        getOrderListData()
    }, [params])

    const origin =
        typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : '';

    return (
        <>

            <MobileHeader type="Third" lang={params.lang} pageTitle={params.lang === 'ar' ? 'قائـمة طلبــاتك' : 'List of Orders'} />
            <div className="container md:py-4 py-16">
                <div className="flex items-start my-4 gap-x-5">
                    <div className="w-full">
                        <div className='flex items-center justify-between font-bold text-base mb-4 max-md:hidden'>
                            <h2>{params.lang == 'ar' ? 'قائـمة طلبــاتك' : 'List of Orders'}</h2>
                        </div>

                        <div>
                            {orderListing?.orderdata?.orders_data?.map((data: any, i: React.Key | null | undefined) => {
                                return (
                                    <div className="grid grid-cols-3 md:grid-cols-6 bg-white px-3 md:p-5 shadow-md rounded-md mb-3 text-sm" key={i}>
                                        <div className="text-[#1C262D85] max-md:my-4">
                                            <h4 className="font-medium text-xs mb-1">{params.lang == 'ar' ? 'رقم الطلب' : 'Order Number'}:</h4>
                                            <p className="font-medium text-[#004B7A]">{data?.order_no}</p>
                                        </div>
                                        <div className="text-[#1C262D85] max-md:my-4">
                                            <h4 className="font-medium text-xs mb-1">{params.lang == 'ar' ? 'تاريخ الطلب' : 'Order Date'}:</h4>
                                            <p className="font-medium text-[#004B7A]">{dayjs(data?.created_at).locale(params.lang == 'ar' ? 'ar' : 'en').format("MMM  DD, YYYY")}</p>
                                        </div>
                                        <div className="text-[#1C262D85] max-md:my-4">
                                            <h4 className="font-medium text-xs mb-1">{params.lang == 'ar' ? 'عدد المنتجات' : 'No. of Products'}:</h4>
                                            <p className="font-medium text-[#004B7A]">({data?.details_count}) {params.lang == 'ar' ? 'منتجات' : 'Items'}</p>
                                        </div>
                                        <div className="text-[#1C262D85] max-md:my-4">
                                            <h4 className="font-medium text-xs mb-1">{params.lang == 'ar' ? 'إجمالي القيمة' : 'Total Value'}:</h4>
                                            <p className="font-medium text-[#004B7A] flex items-center gap-1">{Intl.NumberFormat('en-US').format(data?.ordersummary[0]?.price)} {currencySymbol}</p>
                                        </div>
                                        <div className="text-[#1C262D85] max-md:my-4">
                                            <h4 className="font-medium text-xs mb-1">{params.lang == 'ar' ? 'حالة الطلب' : 'Order Status'}:</h4>
                                            {data?.status === 0 ?
                                                <p className="font-medium text-[#20831E]">{params.lang == 'ar' ? 'تم الإستلام' : 'Received'}</p>
                                                :
                                                data?.status === 1 ?
                                                    <p className="font-medium text-[#219EBC]">{params.lang == 'ar' ? 'تم التأكيد' : 'Confirmed'}</p>
                                                    :
                                                    data?.status === 2 ?
                                                        <p className="font-medium text-[#20831E]">{params.lang == 'ar' ? 'قيد التنفيذ' : 'Processing'}</p>
                                                        :
                                                        data?.status === 3 ?
                                                            <p className="font-medium text-[#219EBC]">{params.lang == 'ar' ? 'خرج للتوصيل' : 'Out for Delivery'}</p>
                                                            :
                                                            data?.status === 4 ?
                                                                <p className="font-medium text-[#20831E]">{params.lang == 'ar' ? 'تم التوصيل' : 'Delivered'}</p>
                                                                :
                                                                data?.status === 5 ?
                                                                    <p className="font-medium text-[#DC4E4E]">{params.lang == 'ar' ? 'ملغي' : 'Cancel'}</p>
                                                                    :
                                                                    data?.status === 6 ?
                                                                        <p className="font-medium text-[#DC4E4E]">{params.lang == 'ar' ? 'تم الإرجاع' : 'Refunded'}</p>
                                                                        :
                                                                        data?.status === 7 ?
                                                                            <p className="font-medium text-[#DC4E4E]">{params.lang == 'ar' ? 'فشل' : 'Failed'}</p>
                                                                            :
                                                                            data?.status === 8 ?
                                                                                <p className="font-medium text-[#00243c95]">{params.lang == 'ar' ? 'في انتظار الدفع' : 'Pending'}</p>
                                                                                :
                                                                                <p className="font-medium text-[#00243c95]">---</p>
                                            }
                                        </div>
                                        <div className="flex items-center justify-center underline text-[#B15533]">
                                            <Link href={`${origin}/${params.lang}/account/orderdetails/${data?.id}`} prefetch={true} replace={false}>{params.lang == 'ar' ? 'إظهار التفاصيل' : 'View Details'}</Link>
                                        </div>
                                        {data?.shipment_order && (data?.status == 0 || data?.status == 1 || data?.status == 2 || data?.status == 3 || data?.status == 4) ?
                                        <>
                                            <hr className="opacity-10 mb-3 col-span-3"/>   
                                            <div className="col-span-2 text-right underline text-[#004B7A] max-md:mb-4">
                                                <Link prefetch={false} scroll={false} href={`${origin}/${params.lang}/shipmenttracking/${data?.shipment_order?.shipment_no}`} replace={false}>{params.lang == 'ar' ? 'تتبع حالة الشحنة' : 'Track Your Shipment'}</Link>
                                            </div>
                                        </>
                                        : null}
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}