'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'

export default function BrandSliderOther(props: any) {
    const NewMedia = props.NewMedia;
    const [BrandData, setBrandData] = useState<any>([]);
    useEffect(() => {
        setBrandData(props?.data)
    }, [props]);

    const setBrand = (id: any, name: any) => {
        props.setBrandData(id, name)
    }
    return (
        <>
            <div className="flex flex-col m-auto p-auto">
                <div className="flex overflow-x-scroll hide-scroll-bar py-1">
                    <div className="flex flex-nowrap items-center">
                        {BrandData?.map((data: any, i: React.Key | null | undefined) => {
                            return (
                                <button
                                    className={`focus-visible:outline-none ltr:mr-2.5 rtl:ml-2.5 w-24 py-3 md:mr-3.5 md:w-36 md:py-4 max-w-xs overflow-hidden rounded-lg shadow-md transition-shadow duration-300 ease-in-out text-primary border hover:border-[#004B7A] hover:text-[#004B7A] hover:bg-[#004B7A05]
                                    ${props.BrandData[data?.name] ? 'border-[#004B7A] bg-[#004B7A05] font-mdium' : 'border-white bg-white '}
                                    `}
                                    key={i}
                                    onClick={() => {
                                        setBrand(data?.id, data?.name)
                                    }}
                                >
                                    <Image
                                        src={data?.brand_media_image ? `${NewMedia}${data?.brand_media_image?.image}` : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                        alt={(data?.brand_media_image?.alt_arabic && props?.lang == 'ar') ? data?.brand_media_image?.alt_arabic : (data?.brand_media_image?.alt && props?.lang == 'en') ? data?.brand_media_image?.alt : ''}
                                        title={(data?.brand_media_image?.title_arabic && props?.lang == 'ar') ? data?.brand_media_image?.title_arabic : (data?.brand_media_image?.title && props?.lang == 'en') ? data?.brand_media_image?.title : ''}
                                        height={0}
                                        width={0}
                                        loading='lazy'
                                        className='mx-auto h-auto w-28'
                                        sizes='100vw'
                                    />
                                </button>
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        </>
    );
}