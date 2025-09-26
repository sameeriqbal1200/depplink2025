"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  FreeMode,
  Mousewheel,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import "../NewHomePageComp/scrollBar.css";
import "swiper/css/pagination";
import { getCookie } from "cookies-next";
import { getProductExtraData } from "@/lib/components/component.client";

const ProductComponent = dynamic(() => import("../NewHomePageComp/product_component_updated"), { ssr: true });

interface Product {
  id: number;
  name: string;
  name_arabic: string;
  slug: string;
  sku: string;
  price: number;
  sale_price: number;
  flash_sale_price: number | null;
  flash_sale_expiry: string | null;
  quantity: string;
  feature_image: string;
  featured_image: { id: number; image: string };
  brand: { id: number; name: string; name_arabic: string; brand_media_image: { id: number; image: string } };
  promotional_price: string;
  promo_title: string;
  promo_title_arabic: string;
  badge_left?: string;
  badge_left_arabic?: string;
  badge_left_color?: string;
  cashback_amount: string;
}

interface ProductLoopTimerComponentProps {
  origin: string;
  isArabic: boolean;
  isMobileOrTablet: boolean;
  productDataSlider: { products?: { data: Product[] } };
  gtmColumnItemListId?: string;
  gtmColumnItemListName?: string;
  sliderHeading: string;
  buttonTitle: string;
  buttonLink: string;
  timerHeading: string;
  day: string;
  date: string;
  NewMedia: any;
}

export default function ProductLoopTimerComponent({
  origin,
  isArabic,
  isMobileOrTablet,
  productDataSlider,
  gtmColumnItemListId,
  gtmColumnItemListName,
  sliderHeading,
  buttonTitle,
  buttonLink,
  timerHeading,
  day,
  date,
  NewMedia
}: ProductLoopTimerComponentProps) {
  const productData = productDataSlider?.products?.data || [];
  const [ProExtraData, setProExtraData] = useState<any>({});
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const containerClass = isMobileOrTablet ? "container" : "px-20";
  const containerClassMobile = isMobileOrTablet
    ? "px-4 sm:px-6"
    : "px-10 md:px-16 lg:px-20";
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Fetch extra product data
  useEffect(() => {
    if (productData.length) {
      (async () => {
        const ids = productData.map((item: Product) => item.id);
        const city = getCookie("selectedCity");
        try {
          const dataExtra = await getProductExtraData(ids?.join(","), city);
          setProExtraData(dataExtra?.extraDataDetails?.data)
        } catch (error) {
          console.error("Error fetching extra product data:", error);
          setProExtraData({});
        }
      })();
    }
  }, [productData]);

  // Timer logic
  useEffect(() => {
    const targetDate = date;
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, "0");
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0");
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
      const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, "0");

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [productData, date]);

  // Construct image URL
  const getImageSrc = (image?: string) => {
    if (!image) return "/images/categoryNew/placeholder.png";
    if (/^https?:\/\//.test(image)) return image;
    return `${NewMedia}${image}`;
  };

  return (
    <section className="relative mb-8" dir={isArabic ? "rtl" : "ltr"}>
      <div className={containerClass}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="headingHomeMain">{sliderHeading}</h2>
          {/* {buttonLink && buttonTitle && (
            <button
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
              onClick={() => router.push(buttonLink.startsWith("http") ? buttonLink : `/${buttonLink}`)}
            >
              {buttonTitle}
            </button>
          )} */}
        </div>
        {!(timeLeft.days === "00" && timeLeft.hours === "00" && timeLeft.minutes === "00" && timeLeft.seconds === "00") && (
          <>
            <div className="mb-2 flex items-center gap-3">
              <span className="w-5 h-10 rounded-lg bg-orange"></span>
              <h2 className="headingHomeMain !text-base !text-dark">{day || (isArabic ? "اليوم" : "Today")}</h2>
            </div>

            <div className="flex items-center gap-12 lg:gap-20 mb-5">
              <h2 className="headingHomeMain !text-dark lg:!text-xl">
                {timerHeading || (isArabic ? "صفقات سريعة" : "Quick Deals")}
              </h2>
              <div className="flex items-center gap-5">
                {["Days", "Hours", "Minutes", "Seconds"].map((label, idx) => (
                  <div key={label} className="flex flex-col items-start gap-1">
                    <span className="text-xs font-bold">{isArabic ? ["أيام", "ساعات", "دقائق", "ثواني"][idx] : label}</span>
                    <div className="text-xl lg:text-2xl font-bold">
                      {timeLeft[label.toLowerCase() as keyof typeof timeLeft]}
                      {idx < 3 && (
                        <span className={`text-orangePrice opacity-50 ${isArabic ? 'mr-3 lg:mr-5' : 'ml-3 lg:ml-5'}`}>:</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!isMobileOrTablet && (
          <>
            <button
              ref={prevRef}
              className="absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer text-white fill-white p-2.5 left-1 md:p-3 md:left-7 bg-primary rounded-full"
            >
              <svg
                height="22"
                width="22"
                viewBox="0 0 24 24"
                className={`fill-current rotate-90`}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z"
                />
              </svg>
            </button>
            <button
              ref={nextRef}
              className="absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer text-white fill-white p-2.5 right-1 md:p-3 md:right-7 bg-primary rounded-full"
            >
              <svg
                height="22"
                width="22"
                viewBox="0 0 24 24"
                className={`fill-current -rotate-90`}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className={containerClassMobile}>
        <Swiper
          spaceBetween={14}
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 10 },
            640: { slidesPerView: 1.5, spaceBetween: 10 },
            768: { slidesPerView: 2.2, spaceBetween: 12 },
            1024: { slidesPerView: 4, spaceBetween: 14 },
            1280: { slidesPerView: 4, spaceBetween: 14 },
            1650: { slidesPerView: 4, spaceBetween: 14 },
            1920: { slidesPerView: 5, spaceBetween: 14 },
          }}
          autoHeight
          centeredSlides={false}
          autoplay={{
            delay: 15000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={false}
          loop={productData.length > 3}
          mousewheel={{
            forceToAxis: true,
            releaseOnEdges: true,
            sensitivity: 2,
            eventsTarget: ".swiper-wrapper",
          }}
          scrollbar={{
            draggable: true,
            hide: !isMobileOrTablet,
          }}
          freeMode
          modules={[Autoplay, Navigation, Pagination, FreeMode, Scrollbar, Mousewheel]}
          onBeforeInit={(swiper) => {
            if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          className="swiperProductSlider !pb-4"
        >
          {productData.length > 0 ? (
            productData.map((product: Product, index: number) => (
              <SwiperSlide key={product.id}>
                <div className="relative h-full">
                  <ProductComponent
                    productData={product} 
                    isArabic={isArabic} 
                    NewMedia={NewMedia}
                    isMobileOrTablet={isMobileOrTablet} 
                    origin={origin} 
                    ProExtraData={ProExtraData?.[product.id]}
                    gtmColumnItemListId={gtmColumnItemListId}
                    gtmColumnItemListName={gtmColumnItemListName}

                  />
                  {index < productData.length - 1 && (
                    <span className="absolute top-1/2 right-0 transform -translate-y-1/2 h-[80%] w-px bg-gray-300 opacity-30"></span>
                  )}
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="flex flex-col items-center w-full">
                <p className="text-sm font-medium text-center">
                  {isArabic ? "لا توجد منتجات متاحة" : "No products available"}
                </p>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </section>
  );
}