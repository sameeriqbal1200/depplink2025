"use client"; // This is a client component 👈🏽

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useApp } from "@/app/_ctx/AppContext";
import { useSlot } from "@/app/_ctx/ClientDataRegistry";

const MobileHeader = dynamic(() => import("../components/MobileHeader"), {
  ssr: true,
});

export default function BrandListing() {
  const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA;
  const { lang, deviceType, origin } = useApp();
  const [ariaLabel, setAriaLabel] = useState("/ar");
  const isArabic = lang === "ar" ? true : false;

  const titles = {
    breadcrumbHome: isArabic ? "الصفحة الرئيسية" : "Home",
    breadcrumbBrands: isArabic ? "تسوق حسب العلامة التجارية" : "Shop by Brands",
  };

  const brandsListingData = useSlot<any>("brandListingPageData");

  return (
    <>
      <MobileHeader
        type="Third"
        lang={lang}
        pageTitle={titles.breadcrumbBrands}
      />

      <div className="container md:py-4 py-16">
        <div className="my-6">
          <h1 className=" font-semibold text-lg 2xl:text-xl hidden md:block">
            {lang == "ar" ? "تسوق حسب العلامة التجارية" : `Shop By Brand's`}
          </h1>
          <div className={`grid grid-cols-2 md:mt-4 gap-3`}>
            {brandsListingData?.brands?.map((data: any, i: number) => {
              if (data?.categories?.length > 0) {
                return (
                  <div
                    className="bg-white h-auto relative p-2 rounded-lg shadow-md text-sm"
                    key={data?.id}
                  >
                    <div className='flex items-center justify-center w-[134px] h-[42px] mx-auto'>
                    <Link
                      replace={true}
                      prefetch={true}
                      href={`${origin}/${lang}/brand/${data.slug}`}
                      aria-label={lang == "ar" ? "" : ""}
                    >
                      <Image
                        src={
                          data?.brand_media_image
                            ? NewMedia + data?.brand_media_image?.image
                            : ""
                        }
                        alt={lang === "ar" ? data?.name_arabic : data?.name}
                        title={lang === "ar" ? data?.name_arabic : data?.name}
                        quality={100}
                        width={134}
                        height={58}
                        style={{
                          maxWidth: "134px",
                          height: "58px",
                        }}
                        loading="lazy"
                        className="mx-auto object-contain"
                        sizes="100vw"
                      />
                    </Link>
                    </div>
                    {data?.categories?.length ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mt-3 h-40 overflow-y-auto">
                        {data?.categories?.map(
                          (categoryData: any, k: number) => {
                            return (
                              <Link
                                replace={true}
                                prefetch={true}
                                key={k}
                                href={`${origin}/${lang}/category/${
                                  categoryData?.slug
                                }?page=1&brand=${data?.name
                                  .split(" ")
                                  .join("+")}`}
                                aria-label={
                                  lang == "ar"
                                    ? categoryData?.name_arabic
                                    : categoryData?.name
                                }
                                className="text-center h-[64px] w-full p-1 md:p-2 bg-white hover:bg-[#219EBC40] hover:fill-primary rounded-md hover:opacity-100"
                              >
                                {/*  <div className="flex items-center justify-center" dangerouslySetInnerHTML={{ __html: categoryData?.icon }}></div> */}
                                <div className="flex items-center justify-center">
                                  <Image
                                    src={
                                      categoryData?.image_link_app
                                        ? categoryData?.image_link_app
                                        : ""
                                    }
                                    alt={
                                      categoryData?.slug
                                        ? categoryData?.slug
                                        : "Category Icon"
                                    }
                                    width={32}
                                    height={32}
                                    className="w-6 h-6 mx-auto"
                                  />
                                </div>
                                <p className="mt-1 max-md:text-[0.65rem] text-xs font-[500] text-primary line-clamp-1">
                                  {lang == "ar"
                                    ? categoryData?.name_arabic
                                    : categoryData?.name}
                                </p>
                              </Link>
                            );
                          }
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
}
