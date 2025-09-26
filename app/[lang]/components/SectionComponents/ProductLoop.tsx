"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Mousewheel, Navigation, Pagination, Scrollbar } from "swiper/modules";
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import '../NewHomePageComp/scrollBar.css';
import 'swiper/css/pagination';
import Link from "next/link";
import { getCookie } from "cookies-next";
import { getProductExtraData } from "@/lib/components/component.client";


const ProductComponent = dynamic(
   () => import("../NewHomePageComp/product_component_updated"),
  { ssr: true }
);

export default function ProductLoopComponent(props: any) {
  const origin = props?.origin;
  const NewMedia = props?.NewMedia;
  const isArabic = props?.isArabic;
  const isMobileOrTablet = props?.isMobileOrTablet;
  const productDataSlider = props?.productDataSlider?.products?.data;
  const gtmNewListId = props?.gtmColumnItemListId;
  const gtmNewListName = props?.gtmColumnItemListName;
  const containerClass = isMobileOrTablet ? "container" : "px-[4.8rem]";
  const containerClassMobile = isMobileOrTablet ? "ltr:pl-4 rtl:pr-4" : "px-20";
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

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
          <Link prefetch={false} scroll={false} href={`${origin}/${isArabic ? "ar" : "en"}/${props?.buttonLink}`} className="text-primary text-sm md:text-xl font-medium px-1.5 bg-[#EBEBEB] py-1 md:shadow-none rounded-md shadow-sm text-nowrap">
            {props?.buttonTitle}
          </Link>
        </div>
        {isMobileOrTablet ? null :
          <>
            <button ref={prevRef} className={`absolute top-1/2 translate-middle-y z-10 cursor-pointer fill-white text-white p-2.5 left-1 md:p-3 md:left-7 bg-primary rounded-full`}>
              <svg
                height={isMobileOrTablet ? "18" : "22"}
                viewBox="0 0 24 24"
                width={isMobileOrTablet ? "18" : "22"}
                xmlns="http://www.w3.org/2000/svg"
                id="fi_10486749"
                className="fill-current transform transition duration-150 ease-in-out rotate-90"
              >
                <path
                  clipRule="evenodd"
                  d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </button>
            <button ref={nextRef} className={`absolute top-1/2 translate-middle-y z-10 cursor-pointer fill-white text-white p-2.5 right-1 md:p-3 md:right-7 bg-primary rounded-full`}>
              <svg
                height={isMobileOrTablet ? "18" : "22"}
                viewBox="0 0 24 24"
                width={isMobileOrTablet ? "18" : "22"}
                xmlns="http://www.w3.org/2000/svg"
                id="fi_10486750"
                className="fill-current transform transition duration-150 ease-in-out -rotate-90"
              >
                <path
                  clipRule="evenodd"
                  d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </button>
          </>
        }
      </div>
      <div className={`${containerClassMobile}`}>
        <Swiper
          spaceBetween={10}
          slidesPerView={4}
          breakpoints={{
            320: {
              slidesPerView: 1.2,
              spaceBetween: 6,
            },
            640: {
              slidesPerView: 1.5,
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
              <ProductComponent NewMedia={NewMedia} productData={productSlider} isArabic={isArabic} isMobileOrTablet={isMobileOrTablet} origin={origin} ProExtraData={ProExtraData?.[productSlider?.id]} gtmColumnItemListId={gtmNewListId} gtmColumnItemListName={gtmNewListName}/>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
