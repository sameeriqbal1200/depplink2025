"use client";

import React, { useRef, useState, useEffect } from "react";
import { Autoplay, Navigation, Pagination, Scrollbar, Mousewheel, Grid, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import './scrollBar.css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import Image from "next/image";
import Link from "next/link";


export default function BrandSlider(props: any) {
    const NewMedia = props?.NewMedia;
    const brands = props?.data;
    const origin = props?.origin;
    const isArabic = props?.isArabic;
    // const productDataSlider = props?.productDataSlider?.products?.data;
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const scrollAmount = 300;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    // 🔁 Add wheel-to-horizontal scroll
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                el.scrollBy({
                    left: e.deltaY,
                });
            }
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);

    // Drag scroll handlers
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleMouseDown = (e: MouseEvent) => {
            setIsDragging(true);
            setStartX(e.pageX - el.offsetLeft);
            setScrollLeft(el.scrollLeft);
        };

        const handleMouseLeave = () => setIsDragging(false);
        const handleMouseUp = () => setIsDragging(false);

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX) * 1.5; // 1.5 = drag speed
            el.scrollLeft = scrollLeft - walk;
        };

        el.addEventListener("mousedown", handleMouseDown);
        el.addEventListener("mouseleave", handleMouseLeave);
        el.addEventListener("mouseup", handleMouseUp);
        el.addEventListener("mousemove", handleMouseMove);

        return () => {
            el.removeEventListener("mousedown", handleMouseDown);
            el.removeEventListener("mouseleave", handleMouseLeave);
            el.removeEventListener("mouseup", handleMouseUp);
            el.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isDragging, startX, scrollLeft]);

    let firstRowBrands: any = [];
    let secondRowBrands: any = [];
    let firstRowCategoryCount = 0;
    let secondRowCategoryCount = 0;

    // Distribute brands into two rows (7 in first)
    brands?.forEach((brand: any, index: any) => {
        const categoryCount = brand?.category?.length || 0;

        if (index < 7) {  // First 8 brands go to first row
            firstRowBrands.push(brand);
            firstRowCategoryCount += categoryCount;
        } else {  // Remaining brands go to second row
            secondRowBrands.push(brand);
            secondRowCategoryCount += categoryCount;
        }
    });
    return (
        <Swiper
            spaceBetween={16}
            slidesPerView={6}
            breakpoints={{
                320: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                    grid: { rows: 2, fill: 'row' },
                },
                640: {
                    slidesPerView: 1.3,
                    spaceBetween: 16,
                    grid: { rows: 2, fill: 'row' },
                },
                768: {
                    slidesPerView: 2.6,
                    spaceBetween: 16,
                    grid: { rows: 2, fill: 'row' },
                },
                1024: {
                    slidesPerView: 3.2,
                    spaceBetween: 16,
                    grid: { rows: 2, fill: 'row' },
                },
            }}
            autoHeight={false}
            centeredSlides={false}
            autoplay={false}
            pagination={false}
            loop={false}
            scrollbar={{
                draggable: true,
                hide: false, // Show scrollbar
            }}
            grid={{
                rows: 2,
                fill: "row",
            }}
            mousewheel={{
                forceToAxis: true,
                releaseOnEdges: true,
                sensitivity: 2,
                eventsTarget: ".swiper-wrapper", // Mousewheel events will be attached to swiper wrapper
            }}
            freeMode={true}
            modules={[Scrollbar, Mousewheel, Grid, FreeMode, Autoplay, Navigation, Pagination]}  // Use only Scrollbar, Mousewheel, and Grid
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
            className="swiperProductSlider !pb-5"
        >
            {brands?.map((brand: any, i: number) => {
                const brandCategoryCount = brand?.category?.length
                const brandImage: any = brand?.brand_media_app_image?.image;
                return (
                    <SwiperSlide className="" key={i}>
                        <div className="bg-white p-2 rounded-lg shadow-md w-full relative">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                <div className="brand_logo px-1 col-span-2">
                                    <Image
                                        src={`${NewMedia}/${brandImage}`}
                                        alt={brandImage}
                                        title={brandImage}
                                        width={180}
                                        height={45}
                                        quality={100}
                                        style={{ maxWidth: "", height: "65px" }}
                                        className="object-contain mx-auto"
                                        loading="lazy"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
                                    />
                                </div>
                                <div className="overflow-y-auto grid grid-cols-2 lg:col-span-2 h-36">
                                    {brand?.category.map((category: any, id: number) => (
                                        <div
                                            key={`brandIcon_${id}`}
                                            className="brand_item text-center p-1 md:p-2 bg-white hover:bg-[#219EBC40] hover:fill-primary rounded-md mx-auto transition-all duration-300 ease-in-out cursor-pointer w-full h-[64px] overflow-hidden"
                                        >
                                            <Link prefetch={false} scroll={false} href={`${origin}/${isArabic ? "ar" : "en"}/category/${category.slug}?page=1&brand=${encodeURIComponent(brand?.name)}`} aria-label="">
                                                <Image
                                                    src={category?.image_link_app ? category.image_link_app : "https://images.tamkeenstores.com.sa/assets/new-media/air-conditioner%20(convert.io).webp"}
                                                    alt="Air Conditioners"
                                                    title="Air Conditioners"
                                                    width={32}
                                                    height={32}
                                                    quality={100}
                                                    className="w-6 h-6 mx-auto"
                                                    loading="lazy"
                                                />
                                                <span className="text-xs font-semibold text-primary line-clamp-1 max-md:text-[0.65rem] mt-1">
                                                    {category?.name}
                                                </span>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white h-5 shadow-brandShadow left-0 right-0 bottom-0 z-40 absolute opacity-80"></div>
                        </div>
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
}
