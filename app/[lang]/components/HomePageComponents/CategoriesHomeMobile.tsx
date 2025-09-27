import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import 'swiper/css/grid';  // Import grid module for multi-row layout
import './styles.css';  // Ensure to import custom styles for the scrollbar

export default function CategoriesHomeMobile(props: any) {
    const categories = props?.params?.categories || [];
    const NewMedia = props?.NewMedia
    const isArabic = props?.isArabic;
    const origin = props?.origin;
    const renderCategoryName = (category: any) => (isArabic ? category.name_arabic : category.name);
    const renderHeading = () =>
        isArabic
            ? props?.params?.sec3_category_title_ar
            : props?.params?.sec3_category_title
    
    const showAllLink = props?.userAgent?.isMobile || props?.userAgent?.isTablet
        ? `${origin}/${isArabic ? "ar" : "en"}/categorieslisting`
        : `${origin}/${isArabic ? "ar" : "en"}/categorieslisting`;

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    return (
        <div className="overflow-hidden w-full">
            <div className="flex items-center justify-between mb-3">
                <h2 className="headingHomeMobile">{renderHeading()}</h2>
                <Link href={showAllLink} className="text-sm underline text-primary font-semibold">
                    {isArabic ? 'عـرض الكــل' : 'Show All'}
                </Link>
            </div>

            <div className="w-full grid grid-cols-4 gap-3 mt-3 bg-white">
                {categories.length > 0 ? (
                    categories.map((category: any, i: number) => (
                        <div key={i} className="pb-2">
                            <div className=''>
                                <Link href={`${origin}/${props?.lang}/category/${category.slug}`} className="rounded-md">
                                    <Image
                                        src={category?.mobile_media_app_image?.image ? `${NewMedia}${category.mobile_media_app_image.image}` : '/fallback-image.jpg'}
                                        alt={`${renderCategoryName(category)}-${i + 11}`}
                                        title={renderCategoryName(category)}
                                        width={100}
                                        height={86}
                                        priority={true}
                                        className="mx-auto h-[5.6rem] w-full rounded-md"
                                        sizes="(max-width: 640px) 80px, (max-width: 1024px) 100px, (max-width: 1280px) 115px, 100vw"
                                    />
                                    <h2 className="font-bold mt-1 text-[0.65rem] xl:text-xs leading-4 text-xs text-center">
                                        {renderCategoryName(category)}
                                    </h2>
                                </Link>
                            </div>
                        </div>
                    ))
                )
                    : null}
                {/* {isClient && (
                    <></>
                    <Swiper
                        direction="horizontal"
                        slidesPerView={4.5}  // 2 slides per row
                        spaceBetween={10}  // Space between slides
                        scrollbar={{
                            draggable: false,
                            hide: false, // Show scrollbar
                        }}
                        mousewheel={{
                            forceToAxis: true,
                            releaseOnEdges: true,
                            sensitivity: 2,
                            eventsTarget: ".swiper-wrapper", // Mousewheel events will be attached to swiper wrapper
                        }}
                        freeMode={true}
                        // speed={5000} // Smooth transition speed for slide changes
                        modules={[Scrollbar, Mousewheel, Grid, FreeMode]}  // Use only Scrollbar, Mousewheel, and Grid
                        className="mySwiper"
                    >
                        {categories.length > 0 ? (
                            categories.map((category: any, i: number) => (
                                <SwiperSlide key={i} className="pb-8">
                                    <div>
                                        <div className=''>
                                            <Link href={`${origin}/${props?.lang}/category/${category.slug}`} className="rounded-md">
                                                <Image
                                                    src={category?.web_media_image ? `${NewMedia}${category?.web_media_image?.image}` : ''}
                                                    alt={`${renderCategoryName(category)}-${i + 11}`}
                                                    title={renderCategoryName(category)}
                                                    width={0}
                                                    height={0}
                                                    sizes='(max-width: 140px) 100vw, (max-width: 1068px) 1150px, (max-width: 1024px) 1, 100vw'
                                                    priority={true}
                                                    className="mx-auto h-[4.8rem] w-full rounded-md"
                                                />
                                                <h2 className="font-bold mt-2 text-[0.65rem] xl:text-xs line-clamp-1 md:line-clamp-2 leading-4 text-xs text-center">
                                                    {renderCategoryName(category)}
                                                </h2>
                                            </Link>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))
                        ) : (
                            // Placeholder Slides
                            Array.from({ length: 16 }).map((_, index) => (
                                <SwiperSlide className="p-0.5" key={index}>
                                    <div className="bg-white py-2 px-1 rounded-lg shadow-md text-center text-primary animate-pulse">
                                        <div className="rounded-md bg-dark/10 p-2.5 h-[8.5rem] lg:h-[13.5rem] w-full"></div>
                                    </div>
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>
                )} */}
            </div>
        </div>
    );
}
