"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic';
import { useSlot } from '@/app/_ctx/ClientDataRegistry';
import { useApp } from '@/app/_ctx/AppContext';
const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function CategoriesListing() {
    const { lang, deviceType, origin } = useApp();
    const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA;
    const categoryData = useSlot<any>("categoryListingPage");
    const [categoryListingData, setCategoryListingData] = useState<any>([]);
    const [categoryFilteredSearch, setCategoryFilteredSearch] = useState<any>('');
    const [categorisFilterData, setCategorisFilterData] = useState<any>([]);

    const getCategoryListingData = async () => {
        setCategoryListingData(categoryData?.category)
        setCategorisFilterData(categoryData?.category)
    }

    useEffect(() => {
        getCategoryListingData()
    }, [categoryData]);

    const filterCategory = (text: string) => {
        if (text) {
            const updatedData = categoryListingData?.filter((item: any) => {
                const item_data = `${item.name.toUpperCase()}`;
                const text_data = text.toUpperCase();
                return item_data.indexOf(text_data) > -1;
            });
            setCategoryFilteredSearch(text)
            setCategorisFilterData(updatedData);
        } else {
            setCategorisFilterData(categoryListingData);
        }
    };

    return (
        <>
            <MobileHeader type="Third" lang={lang} pageTitle={lang === 'ar' ? "فئات" : "Categories"} />
            <div className="container md:py-4 pt-16 pb-20">
                <div className="border rounded-full p-2.5 flex items-center border-[#9CA4AB50] bg-[#ECF1F6] w-full gap-3 mt-3 mb-4">
                    <svg id="fi_3287968" enableBackground="new 0 0 512 512" height="20" viewBox="0 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg" className="fill-[#9CA4AB50]"><path clipRule="evenodd" d="m217.257.879c-119.988 0-217.257 97.269-217.257 217.257s97.269 217.257 217.257 217.257 217.257-97.269 217.257-217.257-97.269-217.257-217.257-217.257zm285.789 500.901c-12.089 12.302-31.975 12.476-44.277.388l-86.843-85.334c16.521-12.879 31.39-27.774 44.247-44.314l86.485 84.983c12.302 12.088 12.477 31.974.388 44.277zm-285.789-440.411c86.58 0 156.766 70.187 156.766 156.766s-70.187 156.766-156.766 156.766c-86.58 0-156.766-70.187-156.766-156.766 0-86.579 70.187-156.766 156.766-156.766z" fillRule="evenodd"></path></svg>
                    <input
                        className="text-sm focus-visible:outline-none bg-[#ECF1F6] w-full"
                        placeholder={lang == "ar" ? "ما الذي تتوق إليه؟" : "What are you looking for?"}
                        onChange={(e) => {
                            filterCategory(e.target.value)
                            if (e.target.value == '') {
                                setCategoryFilteredSearch('')
                                return false;
                            }
                        }}
                        value={categoryFilteredSearch}
                    />
                </div>
                <div className='text-center'>
                    {categoryListingData?.length && categorisFilterData?.length == 0 ?
                        <h4 className="font-semibold mt-1.5 text-sm">
                            {lang === 'ar' ? 'غير معثور عليه!' : 'Not Found!'}
                        </h4>
                        : null
                    }
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {categoryListingData?.length ?
                        <>
                            {categorisFilterData?.map((cat: any, i: any) => {
                                return (
                                    // <Link href={`${origin}/${params?.lang}/category/${cat?.slug}`} className="text-primary text-center" key={cat?.id}>
                                    //     <div className="bg-white rounded-md shadow-md w-full py-2.5 h-[120px]">
                                    //         <Image
                                    //             src={cat?.mobile_media_app_image ? NewMedia + cat?.mobile_media_app_image?.image : "https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png"}
                                    //             alt={params?.lang === 'ar' ? cat?.name_arabic : cat?.name}
                                    //             title={params?.lang === 'ar' ? cat?.name_arabic : cat?.name}
                                    //             height={100}
                                    //             width={100}
                                    //             loading="lazy"
                                    //             className="mx-auto"
                                    //         />
                                    //     </div>
                                    //     <h4 className="font-semibold mt-1.5 text-sm">{params?.lang === 'ar' ? cat?.name_arabic : cat?.name}</h4>
                                    // </Link>
                                    <Link href={`${origin}/${lang}/category/${cat?.slug}`} className="text-primary text-center" key={cat?.id}>
                                        <div className="w-full">
                                            <Image
                                                src={cat?.mobile_media_app_image ? NewMedia + cat?.mobile_media_app_image?.image : "https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png"}
                                                alt={lang === 'ar' ? cat?.name_arabic : cat?.name}
                                                title={lang === 'ar' ? cat?.name_arabic : cat?.name}
                                                height={0}
                                                sizes="100vw"
                                                width={0}
                                                priority 
                                                // loading="lazy"
                                                className="mx-auto shadow-md rounded-md w-full h-full"
                                            />
                                        </div>
                                        <h4 className="font-semibold mt-1.5 text-sm">{lang === 'ar' ? cat?.name_arabic : cat?.name}</h4>
                                    </Link>
                                )
                            })}
                        </>
                        :
                        <>
                            {[...Array(16)].map((_, i) => (
                                <div className="animate-pulse" key={i}>
                                    <div className="bg-[#FFFFFF] rounded-md shadow-md w-full py-2.5 h-[120px]"></div>
                                    <div className="h-5 bg-[#FFFFFF] rounded mt-1.5 shadow-md"></div>
                                </div>
                            ))}
                        </>
                    }
                </div>
            </div>
        </>
    )
}


function useSelector(arg0: (state: any) => any) {
    throw new Error('Function not implemented.');
}

