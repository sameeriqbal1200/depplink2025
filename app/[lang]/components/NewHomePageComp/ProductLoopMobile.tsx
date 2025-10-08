"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Mousewheel, Navigation, Pagination, Scrollbar } from "swiper/modules";
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import './scrollBar.css';
import 'swiper/css/pagination';
import { getCookie } from "cookies-next";
import { getProductExtraData } from "@/lib/components/component.client";


const ProductComponent = dynamic(
    () => import("./product_component_updated"),
    { ssr: true }
);

export default function ProductLoopMobile(props: any) {
    const NewMedia = props?.NewMedia;
    const origin = props?.origin;
    const isArabic = props?.lang;
    const isMobileOrTablet = props?.isMobileOrTablet;
    const productData = props?.productData;
    const [ProExtraData, setProExtraData] = useState<any>([])
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const gtmNewListId = props?.gtmColumnItemListId;
    const gtmNewListName = props?.gtmColumnItemListName;

    useEffect(() => {
        if (props?.productData) {
            extraproductdata()
        }
    }, [props?.productData])

    const extraproductdata = async () => {

        var a: number[] = []
        productData.forEach((item: any) => {
            a.push(item.id)
        });
        var city = getCookie('selectedCity')
        // localStorage.getItem("globalcity")
        if (a?.length >= 1) {
            const dataExtra = await getProductExtraData(a?.join(","), city);
            setProExtraData(dataExtra?.extraDataDetails?.data)
        }
    }
    return (
        <>
            <Swiper
                spaceBetween={10}
                slidesPerView={5}
                breakpoints={{
                    320: {
                        slidesPerView: 1.2,
                        spaceBetween: 6,
                    },
                    640: {
                        slidesPerView: 1.6,
                        spaceBetween: 6,
                    },
                    768: {
                        slidesPerView: 2.2,
                        spaceBetween: 6,
                    },
                    1024: {
                        slidesPerView: 3,
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
                loop={(productData?.length || 0) > 6}
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
                {productData?.map((productData: any, i: number) => (
                    <SwiperSlide key={i}>
                        <ProductComponent NewMedia={NewMedia} productData={productData} key={i} lang={isArabic} isMobileOrTablet={isMobileOrTablet} origin={origin} ProExtraData={ProExtraData[productData?.id]} gtmColumnItemListId={gtmNewListId} gtmColumnItemListName={gtmNewListName} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}
