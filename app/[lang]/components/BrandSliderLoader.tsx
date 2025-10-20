'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules'


export default function BrandSliderLoader(props: any) {
    return (
        <>
            <Swiper
                navigation={false}
                modules={[Navigation]}
                className="mySwiper"
                slidesPerView={6.3}
                spaceBetween={24}
                pagination={{
                    clickable: true,
                }}
                breakpoints={{
                    350: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    960: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                    1140: {
                        slidesPerView: 4,
                        spaceBetween: 10,
                    },
                    1280: {
                        slidesPerView: 4.3,
                        spaceBetween: 10,
                    },
                    1440: {
                        slidesPerView: 4.2,
                        spaceBetween: 10,
                    },
                    1920: {
                        slidesPerView: 5.2,
                        spaceBetween: 10,
                    },
                }}
            >
                {[...Array(6)].map((_, i) => (
                    <SwiperSlide>
                        <div className='bg-white h-auto relative p-2 rounded-lg shadow-md mb-1.5 text-sm'>
                            <div className="animate-pulse">
                                <div className="rounded-md bg-dark/10 p-2.5 h-[130px] w-full"></div>
                                <div className='grid grid-cols-2 mt-8 gap-3'>
                                    {[...Array(4)].map((_, i) => (
                                        <div className="rounded-md bg-dark/10 p-2.5 h-20 mt-2"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}