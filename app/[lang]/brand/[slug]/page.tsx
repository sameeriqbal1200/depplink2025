"use client"; // This is a client component 👈🏽

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic';
import { NewMedia } from "@/lib/api/apiLinks";
import { useApp } from '@/app/_ctx/AppContext';
import { useSlot } from '@/app/_ctx/ClientDataRegistry';

const MobileHeader = dynamic(() => import('../../components/MobileHeader'), { ssr: true })

export default function Brand() {
    const { lang } = useApp();
    const brandPageData = useSlot<any>("brandPageData");
    return (
        <div className='pb-10'>
            <MobileHeader type="Third" lang={lang} pageTitle={lang == 'en' ? brandPageData?.data?.branddata?.name : brandPageData?.data?.branddata?.name_arabic} />
            <div className="max-md:py-16 container">
                {brandPageData?.data?.brand_banner_link ?
                    <Link href={brandPageData?.data?.brand_banner_link ? `/${lang}/${brandPageData?.data?.brand_banner_link}` : '#'} as={brandPageData?.data?.brand_banner_link ? `/${lang}/${brandPageData?.data?.brand_banner_link}` : '#'}>
                        <Image
                            src={brandPageData?.data?.brand_banner_image ? NewMedia + brandPageData?.data?.brand_banner_image?.image : 'https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                            alt='mainbanner'
                            title='MainBanner'
                            height={0}
                            width={0}
                            loading='lazy'
                            className='mx-auto w-full h-auto max-md:w-auto rounded-lg'
                        />
                    </Link>
                    : null}
                {brandPageData?.categoriessec1 ? (
                    <div className="mt-4">
                        <div className="grid grid-cols-2 gap-x-4">
                            {brandPageData.categoriessec1.map((item: any, i: number) => {
                                const brandName =
                                    brandPageData?.data?.brand?.name ??
                                    brandPageData?.data?.name ??
                                    "";

                                const slug = item?.category?.slug ?? "#";
                                const qs = new URLSearchParams({
                                    page: "1",
                                    brand: brandName, // URLSearchParams will encode Arabic/spaces correctly
                                }).toString();

                                const title =
                                    (item?.category &&
                                        (lang === "en"
                                            ? item?.category?.name
                                            : item?.category?.name_arabic)) ||
                                    "";

                                const desc =
                                    lang === "en"
                                        ? item?.category?.description || ""
                                        : item?.category?.description_arabic || "";

                                const imgSrc =
                                    item?.featured_image?.image
                                        ? NewMedia + item?.featured_image?.image
                                        : "https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png";

                                return (
                                    <Link
                                        key={item?.category?.id ?? slug ?? i}
                                        href={`/${lang}/category/${slug}?${qs}`}
                                        className="bg-[#EEF8FC] rounded-lg px-4 mb-4 block"
                                    >
                                        <Image
                                            src={imgSrc}
                                            alt={title}
                                            title={title}
                                            height={400}
                                            width={400}
                                            loading="lazy"
                                            className="mx-auto"
                                        />
                                        <div className="pb-6 pt-4">
                                            <h6 className="text-sm font-bold text-primary">{title}</h6>
                                            <div className="md:flex items-center justify-between">
                                                <div
                                                    className="text-[#5D686F] text-sm"
                                                    dangerouslySetInnerHTML={{ __html: desc }}
                                                />
                                                <div className="font-medium text-sm text-[#8D3C07] fill-[#8D3C07] flex items-center gap-x-1 max-md:mt-4">
                                                    {lang === "ar" ? "عرض كل المنتجات" : "View All Products"}
                                                    {lang === "ar" ? (
                                                        <svg height="13" width="13" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m235.4 256 149.7-149.7c20-20 20-52.3 0-72.3-20-20-52.3-20-72.3 0l-185.9 185.9c-20 20-20 52.3 0 72.3l185.9 185.8c20 20 52.3 20 72.3 0 20-20 20-52.3 0-72.3z" /></svg>
                                                    ) : (
                                                        <svg height="13" width="13" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m385.1 219.9-185.9-185.9c-20-20-52.3-20-72.3 0-20 20-20 52.3 0 72.3l149.8 149.7-149.8 149.7c-20 20-20 52.3 0 72.3 20 20 52.3 20 72.3 0l185.9-185.9c19.9-19.9 19.9-52.3 0-72.2z" /></svg>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ) : null}

                {brandPageData?.data?.middle_banner_image ? (
                    <Link
                        href={
                            brandPageData?.data?.middle_banner_link
                                ? `/${lang}/${brandPageData.data.middle_banner_link}`
                                : "#"
                        }
                    >
                        {/* Provide real dimensions or use fill; here we give a sane size */}
                        <Image
                            src={
                                brandPageData?.data?.middle_banner_image?.image
                                    ? NewMedia + brandPageData.data.middle_banner_image.image
                                    : "https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png"
                            }
                            alt="middlebanner"
                            title="Banner for middle"
                            height={400}
                            width={1600}
                            loading="lazy"
                            className="mx-auto rounded-lg h-auto w-full"
                        />
                    </Link>
                ) : null}

                {brandPageData?.categoriessec2 ? (
                    <div className="mt-4">
                        <div className="grid grid-cols-2 gap-x-4">
                            {brandPageData.categoriessec2.map((item: any, i: number) => {
                                const brandName =
                                    brandPageData?.data?.brand?.name ??
                                    brandPageData?.data?.name ??
                                    "";

                                const slug = item?.category?.slug ?? "#";
                                const qs = new URLSearchParams({
                                    page: "1",
                                    brand: brandName,
                                }).toString();

                                const title =
                                    (item?.category &&
                                        (lang === "en"
                                            ? item?.category?.name
                                            : item?.category?.name_arabic)) ||
                                    "";

                                const desc =
                                    lang === "en"
                                        ? item?.category?.description || ""
                                        : item?.category?.description_arabic || "";

                                const imgSrc =
                                    item?.featured_image?.image
                                        ? NewMedia + item?.featured_image?.image
                                        : "https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png";

                                return (
                                    <Link
                                        key={item?.category?.id ?? slug ?? i}
                                        href={`/${lang}/category/${slug}?${qs}`}
                                        className="bg-[#EEF8FC] rounded-lg px-4 mb-4 block"
                                    >
                                        <Image
                                            src={imgSrc}
                                            alt={title}
                                            title={title}
                                            height={400}
                                            width={400}
                                            loading="lazy"
                                            className="mx-auto"
                                        />
                                        <div className="pb-6 pt-4">
                                            <h6 className="text-sm font-bold text-primary">{title}</h6>
                                            <div className="md:flex items-center justify-between">
                                                <div
                                                    className="text-[#5D686F] text-sm"
                                                    dangerouslySetInnerHTML={{ __html: desc }}
                                                />
                                                <div className="font-medium text-sm text-[#8D3C07] fill-[#8D3C07] flex items-center gap-x-1 max-md:mt-4">
                                                    {lang === "ar" ? "عرض كل المنتجات" : "View All Products"}
                                                    {lang === "ar" ? (
                                                        <svg height="13" width="13" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m235.4 256 149.7-149.7c20-20 20-52.3 0-72.3-20-20-52.3-20-72.3 0l-185.9 185.9c-20 20-20 52.3 0 72.3l185.9 185.8c20 20 52.3 20 72.3 0 20-20 20-52.3 0-72.3z" /></svg>
                                                    ) : (
                                                        <svg height="13" width="13" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m385.1 219.9-185.9-185.9c-20-20-52.3-20-72.3 0-20 20-20 52.3 0 72.3l149.8 149.7-149.8 149.7c-20 20-20 52.3 0 72.3 20 20 52.3 20 72.3 0l185.9-185.9c19.9-19.9 19.9-52.3 0-72.2z" /></svg>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}