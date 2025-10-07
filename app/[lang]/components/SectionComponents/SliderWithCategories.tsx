"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Category {
  id: number;
  name_arabic: string;
  slug: string;
  image_link_app?: string;
  name?: string;
}

interface SliderWithCategoriesProps {
  lang: string;
  isArabic: boolean;
  deviceType?: string;
  categories?: Category[];
  bannerImage?: string;
  NewMedia: any;
}

export default function SliderWithCategories({
  lang,
  isArabic,
  deviceType,
  categories = [],
  bannerImage,
  NewMedia
}: SliderWithCategoriesProps) {
  const router = useRouter();
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  // Fallback banner image
  const defaultBannerImage = "/images/categoryNew/categoryBanner.png";

  // Validate and construct image URL
  const getImageSrc = (image?: string, isCategoryImage: boolean = false) => {
    if (!image) return defaultBannerImage;
    // Use image directly if it's a valid URL (starts with http:// or https://)
    if (/^https?:\/\//.test(image)) return image;
    // For category images, prepend NewMedia if it's a relative path
    if (isCategoryImage) {
      return image.startsWith("/") ? image : `${NewMedia}${image}`;
    }
    // For banner image, use default if not a valid URL or path
    return image.startsWith("/") ? image : defaultBannerImage;
  };
 const [visibleRange, setVisibleRange] = useState({ start: 0, end: 5});
  return (
    <section
      className={`bg-cover bg-center bg-no-repeat w-full h-full flex items-end justify-center mb-8 overflow-hidden relative`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Image
        src={getImageSrc(bannerImage)}
        alt={isArabic ? "بانر الفئة" : "Category Banner"}
        width={0}
        height={0}
        priority
        // loading="lazy"
        className="w-full h-full min-h-[25rem] object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
      />
      <div className="w-full shadow-md absolute bottom-0 left-1/2 -translate-x-1/2 xl:px-56">
        <Swiper
         onSlideChange={(swiper) => {
        const start = swiper.activeIndex;
        // Swiper slidesPerView can be fractional so ceil it
        const perView = Math.ceil(swiper.params.slidesPerView as number || 1);
        setVisibleRange({ start, end: start + perView - 1 });
      }}
      onResize={(swiper) => {
        const start = swiper.activeIndex;
        const perView = Math.ceil(swiper.params.slidesPerView as number || 1);
        setVisibleRange({ start, end: start + perView - 1 });
      }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 16 },
            768: { slidesPerView: 4, spaceBetween: 20 },
            1024: { slidesPerView: 6, spaceBetween: 30 },
          }}
          modules={[Navigation, Pagination]}
          onBeforeInit={(swiper) => {
            if (swiper.params.navigation) {
              const nav = swiper.params.navigation as any;
              nav.prevEl = prevRef.current;
              nav.nextEl = nextRef.current;
            }
          }}
          className="mySwiper !bg-white !py-2 xl:!px-20 xl:!rounded-t-[1.875rem] !w-full !max-w-full"
        >
          {categories.length > 0 ? (
            categories.map((item, index) => {
               const showDivider =
                    index >= visibleRange.start &&
                    index < visibleRange.end; // only between visible slides
              return(
              <SwiperSlide key={item.slug || index} className="relative group">
                <div
                  className="flex flex-col items-center w-full cursor-pointer"
                  onClick={() => router.push(`/${lang}/category/${item.slug}`)}
                >
                  <div className="relative mx-auto">
                    <Image
                      src={getImageSrc(item.image_link_app, true)}
                      alt={isArabic ? item.name_arabic : item.name || item.name_arabic}
                      title={isArabic ? item.name_arabic : item.name || item.name_arabic}
                      width={0}
                      height={0}
                      quality={100}
                      loading="lazy"
                      className="object-cover rounded-2xl transition-transform duration-300 hover:scale-105 h-16 w-16"
                      style={{
                        filter: "drop-shadow(0 5px 20px rgba(0, 0, 0, 0.15))",
                      }}
                      sizes="(max-width: 640px) 100px, (max-width: 768px) 100px, (max-width: 1024px) 100px, 100px"
                    />
                  </div>
                  <h2 className="font-bold mt-2 text-[0.65rem] xl:text-xs line-clamp-1 leading-4 text-center">
                    {isArabic ? item.name_arabic : item.name || item.name_arabic}
                  </h2>
                </div>

                {/* Divider (only show if NOT last slide) */}
               {showDivider && (
              <span
                className={`${
                  isArabic ? "left-0" : "right-0"
                } absolute top-1/2 -translate-y-1/2 w-px h-[80%] bg-gray opacity-30`}
              />
            )}
              </SwiperSlide>
              )
            })
          ) : (
            <SwiperSlide>
              <div className="flex flex-col items-center w-full">
                <h2 className="font-bold mt-2 text-[0.65rem] xl:text-xs line-clamp-1 leading-4 text-center">
                  {isArabic ? "لا توجد فئات متاحة" : "No categories available"}
                </h2>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </section>
  );
}