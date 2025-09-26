'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface MainSliderMobileProps {
    data: any;
    lang: any;
    origin: any;
    NewMedia2: any;
}

const MainSliderMobile: React.FC<MainSliderMobileProps> = ({
    data, lang = 'ar', origin, NewMedia2
}) => {
    // const sortedData: any = data?.map((item: any) => ({ ...item, sorting: item?.sorting ?? 0, })).sort((a: any, b: any) => a.sorting - b.sorting);
    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <div className="rounded-2xl mb-8">
            <Swiper
                slidesPerView={1.4}
                centeredSlides={true}
                initialSlide={2} // Start from the 5th slide (index 4)
                spaceBetween={6}
                autoplay={{
                    delay: 15000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                autoHeight={true}
                pagination={{ clickable: true }}
                loop={true}
                onSlideChange={(swiper) => {
                    setActiveIndex(swiper.realIndex); // Correct real index
                }}
                modules={[Autoplay, Navigation, Pagination]}
                className="swiperProductSlider"
            >
                {(data || [])?.map((item: any, index: any) => {
                    const sliderImage: any = item?.image ? `${NewMedia2}${item?.image}` : '';
                    const sliderLink: any = item?.redirection_link ? origin + '/' + lang + '/' + item?.redirection_link : '';
                    return (
                        <SwiperSlide key={index} className={index === activeIndex ? '' : 'mobileSwiperTransaction'}>
                            <Link
                                prefetch={false}
                                scroll={false}
                                href={sliderLink}
                                aria-label={`Go to ${sliderLink}`}
                            >
                                <div className="relative w-full rounded-2xl">
                                    <Image
                                        src={sliderImage}
                                        alt={`${sliderLink} image`}
                                        title={`${sliderLink} image`}
                                        width={0}
                                        height={0}
                                        // loading="eager"
                                        className="object-center rounded-2xl h-auto w-full"
                                        quality={100}
                                        sizes='100vw'
                                        priority={true}
                                    />
                                </div>
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default MainSliderMobile;
