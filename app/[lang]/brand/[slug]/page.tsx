"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic';
import { useApp } from '@/app/_ctx/AppContext';
import { getDictionary } from "../../dictionaries";

const MobileHeader = dynamic(() => import('../../components/MobileHeader'), { ssr: true })

export default function Brand({ params }: { params: { lang:any, data: any } }) {
    const { lang, origin } = useApp();
    const NewMedia = process.env.NEXT_PUBLIC_NEWMEDIA;
    const [data, setData] = useState<any>(params?.data?.data);
    const [dict, setDict] = useState<any>([]);

    useEffect(() => {
        (async () => {
            const translationdata = await getDictionary(params.lang);
            setDict(translationdata);
        })();
    }, [params]);

    return (
        <>
            <MobileHeader type="Third" lang={lang} pageTitle={lang == 'en' ? data?.branddata?.name : data?.branddata?.name_arabic} />
            <div className="max-md:py-16 container">
                {data?.brand_banner_link ?
                    <Link href={data?.brand_banner_link ? `/${lang}/${data?.brand_banner_link}` : '#'} as={data?.brand_banner_link ? `/${lang}/${data?.brand_banner_link}` : '#'}>
                        <Image
                            src={data?.brand_banner_image ? `${NewMedia}${data?.brand_banner_image?.image}` : 'https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                            alt='mainbanner'
                            title='MainBanner'
                            height={0}
                            width={0}
                            loading='lazy'
                            className='mx-auto w-full h-auto max-md:w-auto rounded-lg'
                        />
                    </Link>
                    : null}
                {params?.data?.categoriessec1 ?
                    <div className='mt-4'>
                        <div className='grid grid-cols-2  gap-x-4'>
                            {params?.data?.categoriessec1?.map((item: any, i: any) => {
                                return (
                                    <Link href={`${origin}/${lang}/category/${item?.category?.slug}?page=1&brand=${data?.branddata?.name.split(' ').join('+')}`} className='bg-[#EEF8FC] rounded-lg px-4 mb-4'>
                                        <Image
                                            src={item?.featured_image ? `${NewMedia}${item?.featured_image?.image}` : 'https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                            alt={item?.category && lang == 'en' ? item?.category?.name : item?.category?.name_arabic}
                                            title={item?.category && lang == 'en' ? item?.category?.name : item?.category?.name_arabic}
                                            height={400}
                                            width={400}
                                            loading='lazy'
                                            className='mx-auto'
                                        />
                                        <div className="pb-6 pt-4">
                                            <h6 className="text-sm font-bold text-primary">{item?.category && lang == 'en' ? item?.category?.name : item?.category?.name_arabic}</h6>
                                            <div className="md:flex items-center justify-between">
                                                <div className="text-[#5D686F] text-sm" dangerouslySetInnerHTML={{ __html: lang == 'en' ? item?.category?.description : item?.category?.description_arabic }}></div>
                                                <div className='font-medium text-sm text-[#8D3C07] fill-[#8D3C07] flex items-center gap-x-1 max-md:mt-4'>
                                                    {lang == 'ar' ? 'عرض كل المنتجات' : 'View All Products'}
                                                    {lang == 'ar' ?
                                                        <svg height="13" width="13" id="fi_11488614" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="Icon"><g id="_43"><path d="m235.4 256 149.7-149.7c20-20 20-52.3 0-72.3-20-20-52.3-20-72.3 0l-185.9 185.9c-20 20-20 52.3 0 72.3l185.9 185.8c20 20 52.3 20 72.3 0 20-20 20-52.3 0-72.3z"></path></g></g></svg>
                                                        :
                                                        <svg height="13" width="13" id="fi_11488622" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="Icon"><g id="_45"><path d="m385.1 219.9-185.9-185.9c-20-20-52.3-20-72.3 0-20 20-20 52.3 0 72.3l149.8 149.7-149.8 149.7c-20 20-20 52.3 0 72.3 20 20 52.3 20 72.3 0l185.9-185.9c19.9-19.9 19.9-52.3 0-72.2z"></path></g></g></svg>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                            }
                        </div>
                    </div>
                    : null}
                {data?.middle_banner_image ?
                    <Link href={data?.middle_banner_link ? `/${lang}/${data?.middle_banner_link}` : '#'}>
                        <Image
                            src={data?.middle_banner_image ? `${NewMedia}${data?.middle_banner_image?.image}` : 'https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                            alt='middlebanner'
                            title='Banner for middle'
                            height={0}
                            width={0}
                            loading='lazy'
                            className='mx-auto rounded-lg h-auto w-full'
                        />
                    </Link>
                    : null}
                {params?.data?.categoriessec2 ?
                    <div className='mt-4'>
                        <div className='grid grid-cols-2  gap-x-4'>
                            {params?.data?.categoriessec2?.map((item: any, i: any) => {
                                return (
                                    <Link href={`${origin}/${lang}/category/${item?.category?.slug}?page=1&brand=${data?.branddata?.name.split(' ').join('+')}`} className='bg-[#EEF8FC] rounded-lg px-4 mb-4'>
                                        <Image
                                            src={item?.featured_image ? `${NewMedia}${item?.featured_image?.image}` : 'https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                            alt={item?.category && lang == 'en' ? item?.category?.name : item?.category?.name_arabic}
                                            title={item?.category && lang == 'en' ? item?.category?.name : item?.category?.name_arabic}
                                            height={400}
                                            width={400}
                                            loading='lazy'
                                            className='mx-auto'
                                        />
                                        <div className="pb-6 pt-4">
                                            <h6 className="text-sm font-bold text-primary">{item?.category && lang == 'en' ? item?.category?.name : item?.category?.name_arabic}</h6>
                                            <div className="md:flex items-center justify-between">
                                                <div className="text-[#5D686F] text-sm" dangerouslySetInnerHTML={{ __html: lang == 'en' ? item?.category?.description : item?.category?.description_arabic }}></div>
                                                <div className='font-medium text-sm text-[#8D3C07] fill-[#8D3C07] flex items-center gap-x-1 max-md:mt-4'>
                                                    {lang == 'ar' ? 'عرض كل المنتجات' : 'View All Products'}
                                                    {lang == 'ar' ?
                                                        <svg height="13" width="13" id="fi_11488614" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="Icon"><g id="_43"><path d="m235.4 256 149.7-149.7c20-20 20-52.3 0-72.3-20-20-52.3-20-72.3 0l-185.9 185.9c-20 20-20 52.3 0 72.3l185.9 185.8c20 20 52.3 20 72.3 0 20-20 20-52.3 0-72.3z"></path></g></g></svg>
                                                        :
                                                        <svg height="13" width="13" id="fi_11488622" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="Icon"><g id="_45"><path d="m385.1 219.9-185.9-185.9c-20-20-52.3-20-72.3 0-20 20-20 52.3 0 72.3l149.8 149.7-149.8 149.7c-20 20-20 52.3 0 72.3 20 20 52.3 20 72.3 0l185.9-185.9c19.9-19.9 19.9-52.3 0-72.2z"></path></g></g></svg>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                            }
                        </div>
                    </div>
                    : null}
            </div>
        </>
    )
}
