"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Mousewheel, Navigation, Pagination, Scrollbar } from "swiper/modules";
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import './scrollBar.css';
import 'swiper/css/pagination';
import Link from "next/link";
import Image from "next/image";

export default function PriceSectionComponent(props: any) {
    const origin = props?.origin;
    const NewMedia = props?.NewMedia;
    const isMobileOrTablet = props?.isMobileOrTablet;
    const lang = props?.lang;
    const sectionData: any = props?.data
    const priceHeading = sectionData?.sec_nineteen_title;
    const ImageOne = sectionData?.sec_nineteen_image_one ? `${NewMedia}${sectionData?.sec_nineteen_image_one}` : '';
    const ImageOneLink = sectionData?.sec_nineteen_image_one_link;
    const ImageTwo = sectionData?.sec_nineteen_image_two ? `${NewMedia}${sectionData?.sec_nineteen_image_two}` : '';
    const ImageTwoLink = sectionData?.sec_nineteen_image_two_link;
    const ImageThree = sectionData?.sec_nineteen_image_three ? `${NewMedia}${sectionData?.sec_nineteen_image_three}` : '';
    const ImageThreeLink = sectionData?.sec_nineteen_image_three_link;
    const ImageFour = sectionData?.sec_nineteen_image_four ? `${NewMedia}${sectionData?.sec_nineteen_image_four}` : '';
    const ImageFourLink = sectionData?.sec_nineteen_image_four_link;
    const ImageFive = sectionData?.sec_nineteen_image_five ? `${NewMedia}${sectionData?.sec_nineteen_image_five}` : '';
    const ImageFiveLink = sectionData?.sec_nineteen_image_five_link;
    const ImageSix = sectionData?.sec_nineteen_image_six ? `${NewMedia}${sectionData?.sec_nineteen_image_six}` : '';
    const ImageSixLink = sectionData?.sec_nineteen_image_six_link;
    const ImageSeven = sectionData?.sec_nineteen_image_seven ? `${NewMedia}${sectionData?.sec_nineteen_image_seven}` : '';
    const ImageSevenLink = sectionData?.sec_nineteen_image_seven_link;
    const ImageEight = sectionData?.sec_nineteen_image_eight ? `${NewMedia}${sectionData?.sec_nineteen_image_eight}` : '';
    const ImageEightLink = sectionData?.sec_nineteen_image_eight_link;

    return (
        <div>
            <div className="md:mt-6">
                <h2 className="headingHomeMain mb-5">{priceHeading}</h2>
            </div>
            <Swiper
                spaceBetween={10}
                slidesPerView={6}
                breakpoints={{
                    320: {
                        slidesPerView: 4.2,
                        spaceBetween: 6,
                    },
                    640: {
                        slidesPerView: 4.2,
                        spaceBetween: 6,
                    },
                    768: {
                        slidesPerView: 4.2,
                        spaceBetween: 6,
                    },
                    1024: {
                        slidesPerView: 6,
                        spaceBetween: 16,
                    },
                    1280: {
                        slidesPerView: 8,
                        spaceBetween: 16,
                    },
                    1650: {
                        slidesPerView: 8,
                        spaceBetween: 16,
                    },
                    1920: {
                        slidesPerView: 8,
                        spaceBetween: 16,
                    },
                }}
                autoHeight={true}
                centeredSlides={false}
                autoplay={false}
                pagination={false}
                loop={false}
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
                className="swiperProductSlider !pb-8"
            >
                <SwiperSlide>
                    <Link href={`${origin}/${lang}/${ImageOneLink}`} aria-label={`${origin}/${lang}/${ImageOneLink}`} prefetch={false} scroll={false}>
                        <Image
                            src={ImageOne}
                            width={100}
                            height={100}
                            alt={`${origin}/${lang}/${ImageOneLink}`}
                            title={ImageOneLink}
                            sizes="100vw"
                            quality={100}
                        />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href={`${origin}/${lang}/${ImageTwoLink}`} aria-label={`${origin}/${lang}/${ImageTwoLink}`} prefetch={false} scroll={false}>
                        <Image
                            src={ImageTwo}
                            width={100}
                            height={100}
                            alt={`${origin}/${lang}/${ImageTwoLink}`}
                            title={ImageTwoLink}
                            sizes="100vw"
                            quality={100}
                        />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href={`${origin}/${lang}/${ImageThreeLink}`} aria-label={`${origin}/${lang}/${ImageThreeLink}`} prefetch={false} scroll={false}>
                        <Image
                            src={ImageThree}
                            width={100}
                            height={100}
                            alt={`${origin}/${lang}/${ImageThreeLink}`}
                            title={ImageThreeLink}
                            sizes="100vw"
                            quality={100}
                        />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href={`${origin}/${lang}/${ImageFourLink}`} aria-label={`${origin}/${lang}/${ImageFourLink}`} prefetch={false} scroll={false}>
                        <Image
                            src={ImageFour}
                            width={100}
                            height={100}
                            alt={`${origin}/${lang}/${ImageFourLink}`}
                            title={ImageFourLink}
                            sizes="100vw"
                            quality={100}
                        />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href={`${origin}/${lang}/${ImageFiveLink}`} aria-label={`${origin}/${lang}/${ImageFiveLink}`} prefetch={false} scroll={false}>
                        <Image
                            src={ImageFive}
                            width={100}
                            height={100}
                            alt={`${origin}/${lang}/${ImageFiveLink}`}
                            title={ImageFiveLink}
                            sizes="100vw"
                            quality={100}
                        />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href={`${origin}/${lang}/${ImageSixLink}`} aria-label={`${origin}/${lang}/${ImageSixLink}`} prefetch={false} scroll={false}>
                        <Image
                            src={ImageSix}
                            width={100}
                            height={100}
                            alt={`${origin}/${lang}/${ImageSixLink}`}
                            title={ImageSixLink}
                            sizes="100vw"
                            quality={100}
                        />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href={`${origin}/${lang}/${ImageSevenLink}`} aria-label={`${origin}/${lang}/${ImageSevenLink}`} prefetch={false} scroll={false}>
                        <Image
                            src={ImageSeven}
                            width={100}
                            height={100}
                            alt={`${origin}/${lang}/${ImageSevenLink}`}
                            title={ImageSevenLink}
                            sizes="100vw"
                            quality={100}
                        />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link href={`${origin}/${lang}/${ImageEightLink}`} aria-label={`${origin}/${lang}/${ImageEightLink}`} prefetch={false} scroll={false}>
                        <Image
                            src={ImageEight}
                            width={100}
                            height={100}
                            alt={`${origin}/${lang}/${ImageEightLink}`}
                            title={ImageEightLink}
                            sizes="100vw"
                            quality={100}
                        />
                    </Link>
                </SwiperSlide>
            </Swiper>
        </div>
    );
}
