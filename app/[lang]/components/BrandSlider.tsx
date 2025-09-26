'use client'

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import 'swiper/css';
import 'swiper/css/navigation';


export default function BrandSlider(props: any) {
    const origin = props?.origin;
    const NewMedia = props?.NewMedia;
    const brandData = props?.data;

    return (
        <>
            <div className="flex flex-col m-auto p-auto">
                <div className="flex overflow-x-scroll hide-scroll-bar pb-1">
                    <div className="flex flex-nowrap items-center gap-x-3">
                        {brandData.map((data: any, i: number) => {
                            return (
                                <div className='bg-white h-auto relative p-2 rounded-lg shadow-md mb-1.5 text-sm w-32 md:w-44' key={i}>
                                    <Link
                                        href={`${origin}/${props?.lang}/brand/${data?.slug}`}
                                        aria-label={props.lang == 'ar' ? data?.name_arabic : data?.name}
                                        className="h-[68px] relative"
                                    >
                                        <Image
                                            src={data?.brand_media_image ? `${NewMedia}${data?.brand_media_image?.image}` : ''}
                                            alt={props.lang === 'ar' ? data?.name_arabic : data?.name}
                                            title={props.lang === 'ar' ? data?.name_arabic : data?.name}
                                            height={0}
                                            width={0}
                                            loading='lazy'
                                            className='mx-auto w-24 md:w-32 h-auto md:h-40 lg:h-[66px]'
                                        />
                                    </Link>
                                    {data?.categories?.length ?
                                        <div className='grid grid-cols-2 mt-2 md:mt-8 gap-y-3' key={data?.categories?.name}>
                                            {data?.categories?.map((categoryData: any, k: number) => {
                                                return (
                                                    <Link
                                                        key={k}
                                                        href={`${origin}/${props?.lang}/category/${categoryData?.slug}?page=1&brand=${data?.name.split(' ').join('+')}`}
                                                        aria-label={props.lang == 'ar' ? categoryData?.name_arabic : categoryData?.name}
                                                        className='text-center p-1 md:p-2 bg-white hover:bg-[#219EBC40] hover:fill-primary rounded-md opacity-50 hover:opacity-100 mx-auto w-full'
                                                    >
                                                        <div className="flex justify-center w-full">
                                                            {/* <div className="h-6 w-6" dangerouslySetInnerHTML={{ __html: categoryData?.icon }}></div> */}
                                                            <Image src={categoryData?.image_link_app ? categoryData?.image_link_app : "https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png"} height={26} width={26} alt={props.lang == 'ar' ? categoryData?.name_arabic : categoryData?.name} />
                                                        </div>
                                                        <p className='mt-3 text-xs font-semibold text-primary line-clamp-1 max-md:text-[0.65rem]'>{props.lang == 'ar' ? categoryData?.name_arabic : categoryData?.name}</p>
                                                    </Link>
                                                )
                                            })
                                            }
                                        </div>
                                        : null}
                                </div>
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        </>
    );
}