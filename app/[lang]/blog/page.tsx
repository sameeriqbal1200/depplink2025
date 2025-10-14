"use client"; // This is a client component 👈🏽

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
import 'dayjs/locale/ar'
import dynamic from 'next/dynamic';
import { useApp } from '@/app/_ctx/AppContext';
import { useSlot } from '@/app/_ctx/ClientDataRegistry';

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

const getRelativeTime = (dateString: string, lang: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (lang === 'ar') {
    if (diffInYears > 0) {
      return `منذ ${diffInYears} ${diffInYears === 1 ? 'سنة' : 'سنوات'}`;
    } else if (diffInMonths > 0) {
      return `منذ ${diffInMonths} ${diffInMonths === 1 ? 'شهر' : 'أشهر'}`;
    } else if (diffInWeeks > 0) {
      return `منذ ${diffInWeeks} ${diffInWeeks === 1 ? 'أسبوع' : 'أسابيع'}`;
    } else if (diffInDays > 0) {
      return `منذ ${diffInDays} ${diffInDays === 1 ? 'يوم' : 'أيام'}`;
    } else if (diffInHours > 0) {
      return `منذ ${diffInHours} ${diffInHours === 1 ? 'ساعة' : 'ساعات'}`;
    } else if (diffInMinutes > 0) {
      return `منذ ${diffInMinutes} ${diffInMinutes === 1 ? 'دقيقة' : 'دقائق'}`;
    } else {
      return 'الآن';
    }
  } else {
    if (diffInYears > 0) {
      return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
    } else if (diffInMonths > 0) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    } else if (diffInWeeks > 0) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffInDays > 0) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  }
};

export default function Blogs() {
    const { lang, origin } = useApp();
    const blogsData = useSlot<any>("blogs");
    const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA;

    const formatDate = (dateString: string) => {
        const dateLocale = lang === 'ar' ? 'ar' : 'en';
        return dayjs(dateString).locale(dateLocale).format("MMM DD, YYYY");
    };

    return (
        <div className='pt-10'>
            <MobileHeader
                type="Third"
                lang={lang}
                pageTitle={lang === 'ar' ? 'المدونة' : 'Blogs'}
            />
            <div className="container py-4">
                <div className="py-6">
                    {/* <div className="text-xs text-white font-bold flex items-center justify-between gap-2 mb-3">
                        <button className="focus-visible:outline-none bg-[#004B7A] hover:bg-[#00446f] px-1 py-2 w-fit rounded-md line-clamp-1">{lang === 'ar' ? 'حلول منزلية' : 'Home solutions'}</button>
                        <button className="focus-visible:outline-none bg-[#004B7A] hover:bg-[#00446f] px-1 py-2 w-fit rounded-md line-clamp-1">{lang === 'ar' ? ' دليل المرأة' : `Women's guide`}</button>
                        <button className="focus-visible:outline-none bg-[#004B7A] hover:bg-[#00446f] px-1 py-2 w-fit rounded-md line-clamp-1">{lang === 'ar' ? 'دليل التسوق' : 'Shopping guide'}</button>
                        <button className="focus-visible:outline-none bg-[#004B7A] hover:bg-[#00446f] px-1 py-2 w-fit rounded-md line-clamp-1">{lang === 'ar' ? 'الصفحة الرئيسية' : 'Homepage'}</button>
                    </div> */}
                    <div className="grid grid-cols-2 gap-3 pb-40">
                        {blogsData?.data?.map((data: any, i: React.Key | null | undefined) => {
                            return (
                                <Link href={`${origin}/${lang}/blog/${data?.slug}`} className="bg-white rounded-2xl shadow-md overflow-hidden" key={i}>
                                    <Image
                                        src={data?.blog_media_image ? NewMedia + data?.blog_media_image?.image : 'https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                        alt={(data?.blog_media_image?.alt_arabic && blogsData?.lang == 'ar') ? data?.blog_media_image?.alt_arabic : (data?.blog_media_image?.alt && blogsData?.lang == 'en') ? data?.blog_media_image?.alt : ''}
                                        title={(data?.blog_media_image?.title_arabic && blogsData?.lang == 'ar') ? data?.blog_media_image?.title_arabic : (data?.blog_media_image?.title && blogsData?.lang == 'en') ? data?.blog_media_image?.title : ''}
                                        quality={100}
                                        height={300}
                                        width={300}
                                        priority={true}
                                        className="rounded-tl-md rounded-tr-md min-w-full object-contain"
                                    />
                                    <div className='mt-5 pb-5 px-3'>
                                        <ul className="text-[0.60rem] flex items-center gap-x-1 font-medium">
                                            <li>{formatDate(data?.created_at)}</li>
                                            <li>|</li>
                                            <li>{getRelativeTime(data?.created_at, lang)}</li>
                                        </ul>
                                        <h2 className="mt-2 font-bold text-xs text-[#004B7A] line-clamp-2">{lang == 'ar' ? data?.name_arabic : data?.name}</h2>
                                        <div className="text-[0.60rem] mt-1.5 line-clamp-3 leading-4" dangerouslySetInnerHTML={{ __html: lang == 'ar' ? data?.description_arabic : data?.description }} />
                                        <div className="flex items-center justify-between mt-4 text-[0.60rem] font-bold">
                                            <span className="">{data?.views}{' '}{lang == 'ar' ? 'المشاهدات' : 'Views'}</span>
                                            <button className="focus-visible:outline-none btn fill-[#004B7A] text-[#004B7A] font-bold flex items-center gap-x-2">
                                                <span>8</span>
                                                <svg id="fi_3870922" height="16" viewBox="0 0 512 512" width="16" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m489.864 101.1a130.755 130.755 0 0 0 -60.164-50.89c-28.112-11.8-59.687-13.924-91.309-6.127-28.978 7.146-57.204 22.645-82.391 45.129-25.189-22.486-53.418-37.986-82.4-45.131-31.623-7.8-63.2-5.674-91.312 6.134a130.755 130.755 0 0 0 -60.161 50.9c-15.02 23.744-22.661 52.619-22.097 83.5 2.504 137.285 207.006 262.122 247.976 285.755a16 16 0 0 0 15.989 0c40.974-23.636 245.494-148.495 247.976-285.779.558-30.879-7.086-59.751-22.107-83.491zm-9.887 82.916c-.8 44.388-30.39 96.139-85.563 149.655-51.095 49.558-109.214 86.912-138.414 104.293-29.2-17.378-87.31-54.727-138.4-104.287-55.176-53.512-84.766-105.259-85.576-149.646-.884-48.467 22.539-87.462 62.656-104.313a106.644 106.644 0 0 1 41.511-8.238c36.795 0 75.717 17.812 108.4 51.046a16 16 0 0 0 22.815 0c45.406-46.17 102.85-62.573 149.9-42.811 40.121 16.845 63.547 55.834 62.671 104.298z"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
