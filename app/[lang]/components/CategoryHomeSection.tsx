import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

interface CategoriesSliderProps {
    params: any;
    lang: any;
    userAgent: any;
    origin: string;
    NewMedia: string;
}

const CategoriesSlider: React.FC<CategoriesSliderProps> = ({ params, userAgent, origin, NewMedia, lang }) => {
    if (params?.sec3_status != 1) {
        return null;
    }
    const categories = params?.categories || [];
    const isArabic = lang == 'ar';
    const renderCategoryName = (category: any) => (isArabic ? category.name_arabic : category.name);
    const renderHeading = () =>
        isArabic
            ? params?.sec3_category_title_ar
            : params?.sec3_category_title

    const showAllLink = userAgent?.isMobile || userAgent?.isTablet
        ? `${origin}/${isArabic ? "ar" : "en"}/categorieslisting`
        : `${origin}/${isArabic ? "ar" : "en"}/categorieslisting`;
    return (
        <div className={``}>
            <div className="align__center mb-2">
                <h2 className="headingHomeMain !text-xl">{renderHeading()}</h2>
                <div className="flex gap-4 items-center">
                    <div>
                        <Link href={`${origin}/${lang}/categorieslisting`} className="text-sm underline text-primary font-semibold">{isArabic ? 'عـرض الكــل' : 'Show All'}</Link>
                    </div>
                    <div className='flex items-center gap-1'>
                        <button aria-label="scrollLeft" className={`cursor-pointer ${lang == 'ar' ? 'rotate-180' : null} fill-dark p-2.5 bg-dark/20 rounded-full arrow-left-categories`}>
                            <svg height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className="fill-current transform transition duration-150 ease-in-out rotate-90"><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                        </button>
                        <button aria-label="scrollRight" className={`cursor-pointer ${lang == 'ar' ? 'rotate-180' : null} fill-dark p-2.5 bg-dark/20 rounded-full arrow-right-categories`}>
                            <svg height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className="fill-current transform transition duration-150 ease-in-out -rotate-90"><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Swiper Section */}
            <div className="relative">
                <Swiper
                    slidesPerView={8}
                    loop={false}
                    breakpoints={{
                        350: { slidesPerView: 4.5, spaceBetween: 2 },
                        768: { slidesPerView: 7.2, spaceBetween: 4 },
                        1280: { slidesPerView: 12, spaceBetween: 4 },
                        1440: { slidesPerView: 14, spaceBetween: 4 },
                    }}
                    spaceBetween={2}
                    pagination={{ clickable: true }}
                    modules={[Navigation]}
                    navigation={{
                        nextEl: ".arrow-right-categories",
                        prevEl: ".arrow-left-categories",
                    }}
                    className="mySwiper"
                >
                    {categories.length > 0 ? (
                        categories.map((category: any, id: number) => (
                            <SwiperSlide className="p-1" key={id}>
                                <Link href={`${origin}/${lang}/category/${category.slug}`} className="rounded-md">
                                    <Image
                                        src={category?.web_media_image ? `${NewMedia}${category.web_media_image.image}` : '/fallback-image.jpg'}
                                        alt={`${renderCategoryName(category)}-${id + 11}`}
                                        title={renderCategoryName(category)}
                                        width={114}
                                        height={114}
                                        priority={true}
                                        className="mx-auto h-auto w-full max-w-[114px] rounded-md"
                                        sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, (max-width: 1024px) 114px, 100vw"
                                    />
                                    <h2 className="font-bold mt-2 text-[0.65rem] xl:text-xs line-clamp-1 md:line-clamp-2 leading-4 text-xs text-center">
                                        {renderCategoryName(category)}
                                    </h2>
                                </Link>
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

                {/* Navigation Buttons */}
                <button
                    aria-label={isArabic ? 'السابق' : 'Previous'}
                    className="proPrevButtonSlider cursor-pointer focus-visible:outline-none fill-white arrow-right-categories"
                >
                    <svg
                        height="20"
                        viewBox="0 0 24 24"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current transform transition duration-150 ease-in-out -rotate-90"
                    >
                        <path
                            clipRule="evenodd"
                            d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z"
                            fillRule="evenodd"
                        />
                    </svg>
                </button>
                <button
                    aria-label={isArabic ? 'التالي' : 'Next'}
                    className="proNextButtonSlider cursor-pointer focus-visible:outline-none fill-white arrow-left-categories"
                >
                    <svg
                        height="20"
                        viewBox="0 0 24 24"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current transform transition duration-150 ease-in-out rotate-90"
                    >
                        <path
                            clipRule="evenodd"
                            d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z"
                            fillRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CategoriesSlider;
