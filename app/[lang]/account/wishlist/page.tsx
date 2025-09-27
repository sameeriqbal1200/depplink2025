"use client"; // This is a client component 👈🏽

import React, { useEffect, useState, useContext } from 'react'
import dynamic from 'next/dynamic'
import { get } from "../../api/ApiCalls"
import { getDictionary } from "../../dictionaries";
import { usePathname } from "next/navigation"
import { useUserAgent } from 'next-useragent';
import { useRouter } from 'next-nprogress-bar'
import GlobalContext from '../../GlobalContext'
const MobileHeader = dynamic(() => import('../../components/MobileHeader'), { ssr: true })
const ProductLoop = dynamic(
  () => import("../../components/NewHomePageComp/ProductLoop"),
  { ssr: true })
interface UserAgent {
    isMobile: boolean;
    [key: string]: any; // If there are additional dynamic properties
}

export default function Wishlist({ params }: { params: { lang: string, data: any, devicetype: any } }) {

    const router = useRouter();
    const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA;
    const path = usePathname();
    const [wishlistData, setWishlistData] = useState<any>([])
    const [dict, setDict] = useState<any>([]);
    const [wishlistCount, setWishlistCount] = useState<any>("0");
    const [loading, setLoading] = useState<boolean>(true)
    const isMobileOrTablet = true;
    const isArabic = params.lang === "ar" ? true : false;
    const { updateWishlist, setUpdateWishlist } = useContext(GlobalContext);
    const userAgent: UserAgent | null = typeof window !== 'undefined' ? useUserAgent(window.navigator.userAgent) : null;

    const HomePage = () => {
        router.push(`/${params.lang}`);
    }
    const getWishlistData = () => {
        if (localStorage.getItem("userid")) {
            get(`getwishlist-regional-new/${localStorage.getItem("userid")}/${localStorage.getItem("globalcity")}`).then((responseJson: any) => {
                setWishlistData(responseJson)
                setWishlistCount(responseJson?.user?.products?.data?.length)
                setLoading(false)
            })
        } else {
            router.push(`/${params.lang}/login`);
        }
    }

    useEffect(() => {
        (async () => {
            const translationdata = await getDictionary(params.lang);
            setDict(translationdata);
        })();
        getWishlistData()
    }, [params])

    useEffect(() => {
        getWishlistData()
    }, [updateWishlist])
    return (
        <>
            <MobileHeader type="Third"  lang={params.lang} pageTitle={params.lang === 'ar' ? 'اخر طلباتك' : 'Wishlist'} />
            <div className="container md:py-4 py-16">
                {loading ? 
                    <></>
                    :
                    <div className="flex items-start my-4 gap-x-5">
                    
                    <div className="w-full">
                        <div className='mb-4 font-bold text-base max-md:hidden'>
                            <h2>{params.lang == 'ar' ? 'اخر طلباتك' : 'Wishlist'} ({wishlistCount})</h2>
                        </div>
                        {wishlistData?.user?.products?.data?.length ?
                            <div className="tamkeenSales_cardss relative grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 xl:gap-x-3 gap-2 items-start justify-center">
                                <ProductLoop NewMedia={NewMedia} productData={wishlistData?.user?.products?.data} lang={isArabic} isMobileOrTablet={isMobileOrTablet} origin={origin} />
                            </div>
                            :
                            <div className="container my-10 flex items-center justify-center">
                                <div className='text-center'>
                                    <p className="text-center text-base text-[#5D686F] m-auto">{params.lang == 'ar' ? 'لم يتم إضافة أي منتج إلى قائمة المفضلة!' : 'No product added to wishlist!'}</p>
                                    <button onClick={() => { HomePage() }} className="focus-visible:outline-none btn bg-[#004B7A] w-72 p-2.5 rounded-md text-sm 2xl:text-base text-white mt-6">{params.lang == 'ar' ? 'تسوق المنتجات' : 'Shop products'}</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                }
            </div>
        </>
    )
}