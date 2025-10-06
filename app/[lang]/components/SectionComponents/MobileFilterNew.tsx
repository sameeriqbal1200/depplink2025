"use client";

import React, { useState } from "react";
import Image from "next/image";
import CloseIcon from "../Icons/CloseIcon";
import ArrowLeftIcon from "../Icons/ArrowLeftIcon";

interface FilterProps {
  isArabic: boolean;
  isMobileOrTablet: boolean;
  deviceType: string;
  brands: { id: string; name: string; name_arabic: string; brand_media_image?: { image: string } }[];
  selectedbrands: Record<string, boolean>;
  tags: { name: string; name_arabic: string; childs: { name: string; name_arabic: string; icon?: string }[] }[];
  selectedtags: Record<string, boolean>;
  setClear: () => void;
  setBrandData: (id: string, name: string) => void;
  onChangetags: (tag: { name: string; name_arabic: string; icon?: string }) => void;
  setFilterModal: (value: boolean) => void;
  filterModal: boolean;
  NewMedia: any;
}

export default function MobileFilterNew(props: FilterProps) {
  const isArabic = props.isArabic;
  const NewMedia = props.NewMedia;

  // Check Icon (same as FilterVertical.tsx)
  const checkIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="11"
      viewBox="0 0 15 11"
      fill="none"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-75"
      aria-hidden="true"
    >
      <path
        opacity="0.5"
        d="M13.5029 0.569855C13.7684 0.569955 14.0232 0.675132 14.2109 0.862823C14.3986 1.05052 14.5038 1.3054 14.5039 1.57083C14.5039 1.83623 14.3985 2.09109 14.2109 2.27884L14.0342 2.4556L14.0322 2.45364L6.20898 10.2769C6.11608 10.3701 6.00632 10.4452 5.88477 10.4956C5.76325 10.5461 5.63254 10.5718 5.50098 10.5718C5.36962 10.5718 5.2395 10.546 5.11816 10.4956C5.02717 10.4579 4.94204 10.4066 4.86621 10.3443L4.79297 10.2779L1.29297 6.77786C1.20008 6.68492 1.12646 6.57407 1.07617 6.45267C1.02595 6.33129 1 6.20121 1 6.06985C1.00001 5.93848 1.02594 5.80843 1.07617 5.68704C1.12647 5.56562 1.20005 5.4548 1.29297 5.36185C1.38594 5.26888 1.4967 5.19537 1.61816 5.14505C1.73955 5.09477 1.86959 5.06892 2.00098 5.06888C2.13247 5.06888 2.26328 5.09473 2.38477 5.14505C2.50604 5.19533 2.61613 5.26904 2.70898 5.36185L5.50195 8.15482L12.7949 0.862823C12.9827 0.675263 13.2375 0.569855 13.5029 0.569855Z"
        fill="#004B7A"
        stroke="#004B7A"
        strokeWidth="0.5"
      />
    </svg>
  );

  // Dropdown Icon (same as MobileFilterNew.tsx)
  const smallDropdownIcon = (
    // <svg
    //   width="14"
    //   height="8"
    //   viewBox="0 0 14 8"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    //   <path
    //     d="M13.1962 0.81355C13.109 0.725724 13.0054 0.656013 12.8912 0.608441C12.777 0.560869 12.6546 0.536377 12.5309 0.536377C12.4072 0.536377 12.2847 0.560869 12.1705 0.608441C12.0563 0.656013 11.9527 0.725724 11.8656 0.81355L7.57393 5.10517C7.48682 5.193 7.38318 5.26271 7.269 5.31028C7.15481 5.35785 7.03233 5.38234 6.90863 5.38234C6.78493 5.38234 6.66246 5.35785 6.54827 5.31028C6.43409 5.26271 6.33045 5.193 6.24334 5.10517L1.95171 0.81355C1.8646 0.725724 1.76096 0.656013 1.64678 0.608441C1.53259 0.560869 1.41011 0.536377 1.28641 0.536377C1.16271 0.536377 1.04024 0.560869 0.92605 0.608441C0.811863 0.656013 0.708226 0.725724 0.621116 0.81355C0.446592 0.989116 0.348633 1.22661 0.348633 1.47416C0.348633 1.72171 0.446592 1.9592 0.621116 2.13477L4.92212 6.43576C5.4492 6.96219 6.16369 7.25788 6.90863 7.25788C7.65358 7.25788 8.36807 6.96219 8.89515 6.43576L13.1962 2.13477C13.3707 1.9592 13.4686 1.72171 13.4686 1.47416C13.4686 1.22661 13.3707 0.989116 13.1962 0.81355Z"
    //     fill="currentColor"
    //   />
    // </svg>
    <ArrowLeftIcon size={14} color="#ffffff" className="-rotate-90" />
  );

  // Const For Text
  const filterText = isArabic ? "الفلـتر حــسب" : "Filter by";
  const clearText = isArabic ? "مسح الكل" : "Clear all";
  const brandText = isArabic ? "العلامة التجارية" : "Brand";

  const [openFilter, setOpenFilter] = useState<{ [key: string]: boolean }>({});

  const toggleFilter = (name: any) => {
    setOpenFilter((prev) => {
        const newState:any = {};
        Object.keys(prev).forEach((key) => {
          newState[key] = false;
        });
        newState[name] = !prev[name];
        return newState;
    });
  };

  return (
    <div
      className={`filter_wrapper bg-white md:py-[1.75rem] md:px-[1.125rem] p-2 pt-8 shrink-0 overflow-hidden relative`}
    >
      {/* Cancel Button */}
      <button
        onClick={() => props.setFilterModal(!props.filterModal)}
        className="absolute -top-2 right-0 p-2 z-10"
        aria-label={isArabic ? "إغلاق" : "Close"}
      >
        <CloseIcon size={14} color="#121212" /> 
      </button>

      {/* Filter Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="headingHomeMain !text-base !text-dark">{filterText}</h2>
          {(Object.keys(props.selectedbrands).length > 0 || Object.keys(props.selectedtags).length > 0) &&
            <button
              className="clear_all text-xs text-[#BE0404] font-semibold"
              onClick={props.setClear}
              aria-label={clearText}
            >
              {clearText}
            </button>
          }
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {Object.keys(props.selectedbrands).map((brandName) => {
            const brand = props.brands.find((b) => b.name === brandName);
            return (
              <button
                key={brandName}
                className="bestProButton !w-fit whitespace-nowrap border-gray text-primary hover:text-white hover:bg-primary selected !px-3 !py-1 !text-[.625rem]"
                aria-label={isArabic ? brand?.name_arabic : brandName}
              >
                {isArabic ? brand?.name_arabic : brandName}
              </button>
            );
          })}
          {Object.keys(props.selectedtags).map((tagName) => {
            const tag = props.tags.flatMap((t) => t.childs).find((c) => c.name === tagName);
            return (
              <button
                key={tagName}
                className="bestProButton !w-fit whitespace-nowrap border-gray text-primary hover:text-white hover:bg-primary selected !px-3 !py-1 !text-[.625rem]"
                aria-label={isArabic ? tag?.name_arabic : tagName}
              >
                {isArabic ? tag?.name_arabic : tagName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Section */}
      {props.brands?.length > 0 && (
        <div className="mb-4 py-4 px-9 rounded-[.25rem] border border-[#E8E8E8]"  onClick={() => toggleFilter("FilterByBrand")}>
          <div className={`text-xs text-[#252B42] font-bold flex items-center justify-between gap-4 w-full ${openFilter["FilterByBrand"] ? 'mb-4' : ''}`}>
            <span className="line-clamp-1">{brandText}</span>
            <button
              className="text-xs text-white fill-white bg-primary font-bold flex items-center justify-center w-[22px] h-[22px] rounded-full p-1"
            >
              {Object.keys(props.selectedbrands).length > 0
                ? Object.keys(props.selectedbrands).length
                : smallDropdownIcon}
            </button>
          </div>
          {openFilter["FilterByBrand"] && (
            <div className="flex items-center flex-wrap gap-2">
              {props.brands.map((brand) => {
                const isSelected = props.selectedbrands[brand.name] === true;
                return (
                  <button
                    key={brand.id}
                    onClick={() => props.setBrandData(brand.id, brand.name)}
                    className={`relative w-16 h-8 px-4 py-[9px] rounded-full cursor-pointer outline-none ${isSelected ? "border-primary border-2 bg-white" : "bg-[#F3F3F3] border-white"}`}
                    aria-label={isArabic ? brand.name_arabic : brand.name}
                  >
                    <Image
                      alt={isArabic ? brand.name_arabic : brand.name}
                      title={isArabic ? brand.name_arabic : brand.name}
                      src={brand.brand_media_image ? `${NewMedia}${brand.brand_media_image.image}` : "https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png"}
                      width={0}
                      height={0}
                      decoding="async"
                      data-nimg="1"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                      quality={100}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-[1rem]"
                    />
                    {isSelected && checkIcon}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tags Section */}
      {props.tags?.map((tagdata, t) => (
        <div key={t} className="mb-4 py-4 px-9 rounded-[.25rem] border border-[#E8E8E8]"  onClick={() => toggleFilter(`FilterBy${tagdata.name}`)}>
          <div className={`text-xs text-[#252B42] font-bold flex items-center justify-between gap-4 w-full ${openFilter[`FilterBy${tagdata.name}`] ? 'mb-4' : ''} `}>
            <span className="line-clamp-1">{isArabic ? tagdata.name_arabic : tagdata.name}</span>
            <button
              className="text-xs text-white fill-white bg-primary font-bold flex items-center justify-center w-[22px] h-[22px] rounded-full p-1"
            >
              {tagdata.childs.filter((child) => props.selectedtags[child.name]).length > 0
                ? tagdata.childs.filter((child) => props.selectedtags[child.name]).length
                : smallDropdownIcon}
            </button>
          </div>
          {openFilter[`FilterBy${tagdata.name}`] && (
            <div className="flex items-center flex-wrap gap-2">
              {tagdata.childs.map((tagchild) => {
                const isSelected = props.selectedtags[tagchild.name] === true;
                return (
                  <button
                    key={tagchild.name}
                    onClick={() => props.onChangetags(tagchild)}
                    className={`relative w-16 h-8 rounded-full cursor-pointer outline-none border flex items-center justify-center px-2  ${isSelected ? "border-primary border-2 text-primary bg-white" : "bg-[#F3F3F3] border-white text-[#121212]"}`}
                    aria-label={isArabic ? tagchild.name_arabic : tagchild.name}
                  >
                    {tagchild.icon ? (
                      // <div dangerouslySetInnerHTML={{ __html: tagchild.icon }} />
                      <div className="font-bold tracking-[0.00544rem]">
                        <p className="text-[.5rem] leading-[.625rem]">
                          {isArabic ? tagchild.name_arabic : tagchild.name}
                        </p>
                      </div>
                    ) : (
                      <div className="text-[#121212] font-bold tracking-[0.00544rem]">
                        <p className="text-[.5rem] leading-[.625rem]">
                          {isArabic ? tagchild.name_arabic : tagchild.name}
                        </p>
                      </div>
                    )}
                    {isSelected && checkIcon}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Apply Button */}
      <div className="flex justify-center mt-5">
        <button
          className="bestProButton w-fit whitespace-nowrap !px-6 !py-2 bg-primary !text-white border-primary hover:!text-primary hover:bg-white"
          aria-label={isArabic ? "تطبيق" : "Apply"}
          onClick={() => props.setFilterModal(false)}
        >
          {isArabic ? "تطبيق" : "Apply"}
        </button>
      </div>
    </div>
  );
}