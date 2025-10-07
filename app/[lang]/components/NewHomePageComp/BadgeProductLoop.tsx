"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Autoplay, Navigation, Pagination, Scrollbar, Mousewheel, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import './scrollBar.css';
import Link from "next/link";
import { getCookie } from "cookies-next";
import { getProductExtraData } from "@/lib/components/component.client";

const ProductComponent = dynamic(
    () => import("./product_component_updated"),
    { ssr: true }
);

export default function BadgeProductLoopComponent(props: any) {
    const origin = props?.origin;
    const isArabic = props?.isArabic;
    const NewMedia = props?.NewMedia;
    const isMobileOrTablet = props?.isMobileOrTablet;
    const productDataSlider = props?.productDataSlider?.products?.data;
    const containerClass = isMobileOrTablet ? "container" : "px-[4.8rem]";
    const containerClassMobile = isMobileOrTablet ? "ltr:pl-4 rtl:pr-4" : "px-20";
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const gtmNewListId = props?.gtmColumnItemListId;
    const gtmNewListName = props?.gtmColumnItemListName;

    const [ProExtraData, setProExtraData] = useState<any>([])

    useEffect(() => {
        if (props?.productDataSlider) {
            extraproductdata()
        }
    }, [props?.productDataSlider])

    const extraproductdata = async () => {

        var a: number[] = []
        productDataSlider.forEach((item: any) => {
            a.push(item.id)
        });
        var city = getCookie('selectedCity')
        // localStorage.getItem("globalcity")
        const dataExtra = await getProductExtraData(a?.join(","), city);
        setProExtraData(dataExtra?.extraDataDetails?.data)
    }


    return (
        <>
            <div className={containerClass}>
                <div className="flex justify-between items-start pb-4">
                    <h2 className="headingHomeMain bg-white w-fit p-3 rounded-bl-lg rounded-br-lg">
                        {props?.sliderHeading}
                    </h2>
                    <Link prefetch={false} scroll={false} href={`${origin}/${isArabic ? "ar" : "en"}/${props?.buttonLink}`} className="bg-white rounded-md shadow-sm px-3 py-2 text-dark text-sm font-medium mt-2">
                        {props?.buttonTitle}
                    </Link>
                </div>
            </div>
            <div className={`${containerClassMobile}`}>
                <Swiper
                    spaceBetween={10}
                    slidesPerView={6}
                    breakpoints={{
                        320: {
                            slidesPerView: 1.2,
                            spaceBetween: 6,
                        },
                        640: {
                            slidesPerView: 1.2,
                            spaceBetween: 6,
                        },
                        768: {
                            slidesPerView: 1.2,
                            spaceBetween: 6,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 6,
                        },
                        1280: {
                            slidesPerView: 4,
                            spaceBetween: 6,
                        },
                        1650: {
                            slidesPerView: 5,
                            spaceBetween: 6,
                        },
                        1920: {
                            slidesPerView: 5,
                            spaceBetween: 6,
                        },
                    }}
                    autoHeight={true}
                    centeredSlides={false}
                    autoplay={{
                        delay: 15000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    pagination={false}
                    // loop={true}
                    loop={(productDataSlider?.length || 0) > 2}
                    mousewheel={{
                        forceToAxis: true,
                        releaseOnEdges: true,
                        sensitivity: 2,
                        eventsTarget: ".swiper-wrapper", // Mousewheel events will be attached to swiper wrapper
                    }}
                    scrollbar={{
                        draggable: true,
                        hide: false, // Show scrollbar
                    }}
                    freeMode={true}
                    modules={[Autoplay, Navigation, Pagination, FreeMode, Scrollbar, Mousewheel]}
                    // navigation={{ nextEl: `.arrow-left-${idRandom}`, prevEl: `.arrow-right-${idRandom}` }}
                    onBeforeInit={(swiper) => {
                        if (swiper.params.navigation) {
                            const navigation = swiper.params.navigation as any;
                            navigation.prevEl = prevRef.current;
                            navigation.nextEl = nextRef.current;
                        }
                    }}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    className="swiperProductSlider !pb-4"
                >
                    {productDataSlider?.map((productSlider: any, productSliderID: number) => (
                        <SwiperSlide key={productSliderID}>
                            <ProductComponent NewMedia={NewMedia} productData={productSlider} lang={isArabic} isMobileOrTablet={isMobileOrTablet} origin={origin} ProExtraData={ProExtraData[productSlider?.id]} gtmColumnItemListId={gtmNewListId} gtmColumnItemListName={gtmNewListName}/>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>
    );
}
