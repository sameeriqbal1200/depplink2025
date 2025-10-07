"use client"; // This is a client component 👈🏽

import React, { useState } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic';
import { useApp } from '@/app/_ctx/AppContext';
import { useSlot } from '@/app/_ctx/ClientDataRegistry';

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function BrandListing() {
    const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA;
    const { lang, deviceType, origin } = useApp();
    const [ariaLabel, setAriaLabel] = useState('/ar');
    const isArabic = lang === "ar" ? true : false;

    const titles = {
        breadcrumbHome: isArabic ? 'الصفحة الرئيسية' : 'Home',
        breadcrumbBrands: isArabic ? 'تسوق حسب العلامة التجارية' : 'Shop by Brands'
    };

    const brandsListingData = useSlot<any>("brandListingPageData"); 

    return (
        <>
            <MobileHeader type="Third" lang={lang} pageTitle={titles.breadcrumbBrands} />

            <div className="container md:py-4 py-16">
                <div className="my-6">
                    <h1 className=" font-semibold text-lg 2xl:text-xl hidden md:block">{lang == 'ar' ? 'تسوق حسب العلامة التجارية' : `Shop By Brand's`}</h1>
                    <div className={`grid grid-cols-2 md:mt-4 gap-3`}>
                        {brandsListingData?.brands?.map((data: any, i: number) => {
                            if (data?.categories?.length > 0) {
                                return (
                                    <div className='bg-white h-auto relative p-2 rounded-lg shadow-md text-sm' key={data?.id}>
                                        <Link
                                            replace={true}
                                            prefetch={true}
                                            href={`${origin}/${lang}/brand/${data.slug}`}
                                            aria-label={lang == 'ar' ? '' : ''}
                                        >
                                            <Image
                                                src={data?.brand_media_image ? NewMedia + data?.brand_media_image?.image : ''}
                                                alt={lang === 'ar' ? data?.name_arabic : data?.name}
                                                title={lang === 'ar' ? data?.name_arabic : data?.name}
                                                quality={100}
                                                width={134} // fixed width
                                                height={42} // allow flexible height
                                                style={{ maxWidth: "134px", height: "42px",}}
                                                loading='lazy'
                                                className='mx-auto object-contain'
                                                sizes='100vw'
                                            />
                                        </Link>
                                        {data?.categories?.length ?
                                            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mt-8 gap-y-2 h-40 overflow-y-auto'>
                                                {data?.categories?.map((categoryData: any, k: number) => {
                                                    return (
                                                        <Link
                                                            replace={true}
                                                            prefetch={true}
                                                            key={k}
                                                            href={`${origin}/${lang}/category/${categoryData?.slug}?page=1&brand=${data?.name.split(' ').join('+')}`}
                                                            aria-label={lang == 'ar' ? categoryData?.name_arabic : categoryData?.name}
                                                            className='text-center p-3 bg-white hover:bg-[#219EBC40] hover:fill-primary rounded-md opacity-50 hover:opacity-100'
                                                        >
                                                            {/*  <div className="flex items-center justify-center" dangerouslySetInnerHTML={{ __html: categoryData?.icon }}></div> */}
                                                            <div className="flex items-center justify-center">
                                                                <Image
                                                                    src={categoryData?.image_link_app ? categoryData?.image_link_app : ''}
                                                                    alt={categoryData?.slug ? categoryData?.slug : 'Category Icon'}
                                                                    width={32} 
                                                                    height={32} 
                                                                    className="object-contain"
                                                                />
                                                            </div>
                                                            <p className='mt-3 text-xs font-[500] text-primary line-clamp-1'>{lang == 'ar' ? categoryData?.name_arabic : categoryData?.name}</p>
                                                        </Link>
                                                    )
                                                })
                                                }
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                )
                            }
                        })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
