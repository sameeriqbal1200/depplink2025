"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Mousewheel, Navigation, Pagination, Scrollbar } from "swiper/modules";
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import './scrollBar.css';
import 'swiper/css/pagination';
import Link from "next/link";
import { getCookie } from "cookies-next";
import { getProductExtraData } from "@/lib/components/component.client";


const ProductComponent = dynamic(
  () => import("./product_component_updated"),
  { ssr: true }
);

export default function ProductSliderComponent(props: any) {
  const origin = props?.origin;
  const NewMedia = props?.NewMedia;
  const isArabic = props?.isArabic;
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
    if (productDataSlider?.length >= 1) {
      productDataSlider?.forEach((item: any) => {
        a.push(item.id)
      });
    }
    var city = getCookie('selectedCity')
    // localStorage.getItem("globalcity")
    if (a?.length >= 1) {
      const dataExtra = await getProductExtraData(a?.join(","), city);
      setProExtraData(dataExtra?.extraDataDetails?.data)
    }
  }


  return (
    <>
      <div className={`${containerClass}`}>
        <div className="flex justify-between items-start">
          <h2 className="headingHomeMain mb-5">{props?.sliderHeading}</h2>
          <Link prefetch={false} scroll={false} href={`${origin}/${isArabic ? "ar" : "en"}/${props?.buttonLink}`} className="text-primary text-sm md:text-xl font-medium underline px-1.5 md:bg-white bg-[#EBEBEB] py-1 md:shadow-none rounded-md shadow-sm text-nowrap">
            {props?.buttonTitle}
          </Link>
        </div>
      </div>
      <div className={`${containerClassMobile}`}>
        <Swiper
          spaceBetween={10}
          slidesPerView={5}
          breakpoints={{
            320: {
              slidesPerView: 2.2,
              spaceBetween: 6,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 6,
            },
            768: {
              slidesPerView: 2.2,
              spaceBetween: 6,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 6,
            },
            1280: {
              slidesPerView: 5,
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
          loop={true}
          mousewheel={{
            forceToAxis: true,
            releaseOnEdges: true,
            sensitivity: 2,
            eventsTarget: ".swiper-wrapper", // Mousewheel events will be attached to swiper wrapper
          }}
          scrollbar={{
            draggable: true,
            hide: isMobileOrTablet ? false : true, // Show scrollbar
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
