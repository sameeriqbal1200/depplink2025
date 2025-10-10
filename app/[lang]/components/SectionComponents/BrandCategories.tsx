"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
// import "swiper/css/free-mode";
// import "swiper/css/scrollbar";
import "swiper/css/pagination";
import "../NewHomePageComp/scrollBar.css";

interface Brand {
  id: number;
  name_arabic: string;
  slug: string;
  brand_image_media?: number;
  brand_app_image_media?: number;
  brand_media_image?: {
    id: number;
    image: string;
  };
  brand_media_app_image?: {
    id: number;
    image: string;
  };
  name?: string; // Optional English name
}

interface BrandCategoriesProps {
  origin: string;
  isMobileOrTablet: boolean;
  isArabic: boolean;
  lang: string;
  brands: Brand[];
  NewMedia: any;
}

export default function BrandCategories({
  origin,
  isMobileOrTablet,
  isArabic,
  lang,
  brands = [],
  NewMedia
}: BrandCategoriesProps) {
  const router = useRouter();
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  // Fallback image for brands
  const defaultBrandImage = "/images/placeholder.webp";

  // Construct image URL
  const getImageSrc = (image?: string) => {
    if (!image) return defaultBrandImage;
    if (/^https?:\/\//.test(image)) return image; // Use full URL if provided
    return `${NewMedia}${image}`; // Prepend NewMedia for relative paths
  };

  return (
    <div>
      <h2 className="headingHomeMain mb-5">
        {isArabic ? "تسوق من أفضل العلامات التجارية" : "Shop from the best brands"}
      </h2>

      {/* Navigation Arrows */}
      {!isMobileOrTablet && (
        <div>
          {/* Left Arrow */}
          <button
            ref={prevRef}
            className="swiper-prev absolute top-1/2 left-1 md:left-5  z-10 cursor-pointer p-2.5 md:p-3 bg-primary rounded-full text-white fill-white hover:bg-primary/90"
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

          {/* Right Arrow */}
          <button
            ref={nextRef}
            className="swiper-next absolute top-1/2 right-1 md:right-5  z-10 cursor-pointer p-2.5 md:p-3 bg-primary rounded-full text-white fill-white hover:bg-primary/90"
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
        </div>
      )}

      <Swiper
        modules={[Navigation, Pagination]}
        loop={brands.length > 3} // Enable loop only if enough brands
        slidesPerView={isMobileOrTablet ? 2.2 : 7.3}
        slidesPerGroup={1}
        spaceBetween={12}
        className="w-full"
        onBeforeInit={(swiper) => {
          if (
            swiper.params.navigation &&
            typeof swiper.params.navigation !== "boolean"
          ) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        breakpoints={{
          480: { slidesPerView: 2.2 },
          768: { slidesPerView: 4.2 },
          1024: { slidesPerView: 5.3 },
          1280: { slidesPerView: 8 },
        }}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {brands.length > 0 ? (
          brands.map((brand) => {
            const brandImage = isMobileOrTablet ? brand.brand_media_app_image?.image : brand.brand_media_image?.image;
          return (
            <>
            <SwiperSlide key={brand.slug || brand.id}>
              <button
                className="focus-visible:outline-none  py-3 w-full h-full md:py-4 max-w-xs overflow-hidden rounded-lg shadow-md transition-shadow duration-300 ease-in-out text-primary border hover:border-[#004B7A] hover:text-[#004B7A] hover:bg-[#004B7A05] border-white bg-white mb-1"
                onClick={() => router.push(`${origin}/${lang}/brand/${brand.slug}`)}
              >
                <Image
                  src={getImageSrc(brandImage)}
                  alt={isArabic ? brand.name_arabic : brand.name || brand.name_arabic}
                  title={isArabic ? brand.name_arabic : brand.name || brand.name_arabic}
                  width={134}
                  height={42}
                  className="object-contain mx-auto"
                  loading="lazy"
                  quality={100}
                  style={{ maxWidth: "134px", height: "42px" }}
                />
                {/* <p className="mt-2 text-sm font-medium text-center">
                  {isArabic ? brand.name_arabic : brand.name || brand.name_arabic}
                </p> */}
              </button>
            </SwiperSlide>
            </>
          )})
        ) : (
          <SwiperSlide>
            <div className="flex flex-col items-center w-full">
              <p className="text-sm font-medium text-center">
                {isArabic ? "لا توجد علامات تجارية متاحة" : "No brands available"}
              </p>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
}