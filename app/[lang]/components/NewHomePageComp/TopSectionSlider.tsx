'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


interface TopSectionSliderData {
  data: any;
  lang: any;
  origin: any;
  NewMedia2: any;
  deviceType: any;
  isMobileOrTablet: any;
  // devicetype?: string; // Optional prop for device type
}

const TopSectionSlider: React.FC<TopSectionSliderData> = ({
  data, lang, origin, isMobileOrTablet, NewMedia2, deviceType
}) => {
  // const sortedData: any = data?.map((item: any) => ({...item,sorting: item?.sorting ?? 0, })).sort((a: any, b: any) => a.sorting - b.sorting);
  return (
    <div className={`right_banner_slider_top`}>
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{
          delay: 15000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        // loop={true}
        loop={(data?.length || 0) > 1}
        modules={[Autoplay, Navigation, Pagination]}
        className="mySwiper cursor-grab active:cursor-grabbing"
      >
        {data?.map((item: any) => {
          const sliderImage: any = item?.image ? `${NewMedia2}${item?.image}` : '/images/';
          const sliderLink: any = item?.redirection_link ? `${origin}/${lang}/${item?.redirection_link}` : '';
          return (
            <SwiperSlide key={item?.id}>
              {/* <Link
                prefetch={false}
                scroll={false}
                href={sliderLink}
                className='rounded-b-2xl w-full cursor-grab'
                aria-label={`Go to ${sliderLink}`}
              > */}
              <div className={`relative w-full`}>
                <Image
                  src={sliderImage}
                  alt={`${sliderLink} image`}
                  title={`${sliderLink} image`}
                  width={0}
                  height={0}
                  className={`object-center shadow-lg h-auto w-full`}
                  quality={100}
                  sizes='100vw'
                  priority={true}
                />
              </div>
              {/* </Link> */}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default TopSectionSlider;
