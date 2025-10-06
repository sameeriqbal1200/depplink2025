"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import { useRouter } from "next-nprogress-bar";
import ArrowLeftIcon from "../components/Icons/ArrowLeftIcon";
import Link from "next/link";
import LogoIcon from "../components/Icons/LogoIcon";
import SearchIcon from "../components/Icons/SearchIcon";
import LocationIcon from "../components/Icons/LocationIcon";
import SortIcon from "../components/Icons/SortIcon";
import FilterIcon from "../components/Icons/FilterIcon";
import FilterIconTwo from "../components/Icons/FilterIcon2";
import Pagination from "../components/NewPagination";
import CheckIcon from "../components/Icons/CheckIcon";

// Import Images
const MobileHeader = dynamic(() => import("@/components/MobileHeader"), {
  ssr: true,
});

const FilterVertical = dynamic(
  () => import("@/components/SectionComponents/FilterVertical"),
  {
    ssr: true,
  }
);

const MobileFilterNew = dynamic(
  () => import("@/components/SectionComponents/MobileFilterNew"),
  {
    ssr: true,
  }
);

const FilterHorizontal = dynamic(
  () => import("@/components/SectionComponents/FilterHorizontal"),
  {
    ssr: true,
  }
);

const ProductLoop = dynamic(
  () => import("@/components/NewHomePageComp/ProductLoop"),
  {
    ssr: true,
  }
);

const ProductLoopList = dynamic(
  () => import("@/components/NewHomePageComp/productListLoop"),
  {
    ssr: true,
  }
);

const StickyPagination = dynamic(
  () => import("@/components/StickyPagination"),
  {
    ssr: true,
  }
);

type ListingProps = {
  data: any;
  slug: string;
  lang: string;
  origin: string;
  deviceType: string;
  searchParams?: Record<string, string>;
};

export default function SubCategoryNew({
  data,
  slug,
  lang,
  deviceType,
  origin,
  searchParams,
}: ListingProps) {
  const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA;
  const router = useRouter();
  const [dict, setDict] = useState<any>([]);
  const [CatData, setCatData] = useState<any>(data);
  const [brandData, setBrandData] = useState<any>(data?.productData?.brands);
  const [loaderStatus, setLoaderStatus] = useState<any>(true);
  const [currentPage, setcurrentPage] = useState<any>(
    data?.productData?.products?.current_page
  );
  const [BrandfilterHide, setBrandfilterHide] = useState<any>(false);
  const [selectedbrands, setselectedbrands] = useState<any>({});
  const [filterHide, setFilterHide] = useState<any>(false);
  const [selectedcats, setselectedcats] = useState<any>({});
  const [RatingfilterHide, setRatingfilterHide] = useState<any>(false);
  const [selectedrating, setselectedrating] = useState<any>({});
  const [selectedtags, setselectedtags] = useState<any>({});
  const [sort, setsort] = useState<any>(false);
  const [products, setproducts] = useState<any>([]);
  const [view, setview] = useState<any>("grid");
  const [min, setMin] = useState<any>(data?.productData?.min || 0); // Adjust default as needed
  const [max, setMax] = useState<any>(data?.productData?.max || 0); // Adjust default as needed
  const SortingProduct = [
    { value: "", label: lang == "ar" ? "الأكثر تطابقاً" : "Relevance" },
    {
      value: "sale_price-asc",
      label:
        lang == "ar" ? "السعر (من الأقل إلى الأعلى)" : "Price (Low to High)",
    },
    {
      value: "sale_price-desc",
      label:
        lang == "ar" ? "السعر (من الأعلى إلى الأقل)" : "Price (Hight to Low)",
    },
  ];
  useEffect(() => {
    if (!deviceType) {
      router.refresh();
    }
    googleGTMList();
  }, []);
  function calculateTimeLeft(endTime: any) {
    const now: any = new Date();
    const end: any = new Date(endTime);
    const difference: any = end - now;

    if (difference <= 0) {
      return { expired: true };
    }

    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  }

  const googleGTMList = () => {
    // Push to GTM's dataLayer
    const productDataGTM = data?.productData?.products?.data;
    if (
      typeof window !== "undefined" &&
      window.dataLayer &&
      productDataGTM?.length
    ) {
      // Clear previous ecommerce object
      window.dataLayer.push({ ecommerce: null });
      const totalPrice = productDataGTM.reduce(
        (
          sum: number,
          item: {
            flash_sale_price?: number;
            sale_price?: number;
            price: number;
          }
        ) => {
          const itemPrice =
            item.flash_sale_price ?? item.sale_price ?? item.price;
          return sum + (itemPrice || 0);
        },
        0
      );
      // Push GTM-compatible event
      window.dataLayer.push({
        event: "view_item_list",
        value: totalPrice,
        currency: "SAR",
        platform: deviceType,
        item_list_name: isArabic
          ? data?.category?.name_arabic
          : data?.category?.name,
        item_list_id: String(data?.category?.id ?? ""), // Added item_list_id
        ecommerce: {
          items: productDataGTM.map((item: any, index: number) => {
            const getOriginalPrice = () => {
              if (!item?.flash_sale_price && !item?.sale_price)
                return item?.price;
              return item?.price;
            };
            const getDiscountedPrice = () => {
              let salePrice =
                item?.sale_price > 0 ? item?.sale_price : item?.price;
              if (item?.promotional_price > 0) {
                salePrice = Math.max(
                  0,
                  Number(salePrice) - Number(item?.promotional_price)
                );
              }
              if (item?.flash_sale_expiry && item?.flash_sale_price) {
                const timer = calculateTimeLeft(item?.flash_sale_expiry);
                if (!timer?.expired) {
                  salePrice = item?.flash_sale_price;
                }
              }

              return salePrice;
            };

            const discountPrice = item?.price - getDiscountedPrice();
            return {
              item_id: item?.sku,
              item_name: isArabic ? item?.name_arabic : item?.name,
              price: Number(getDiscountedPrice()),
              shelf_price: Number(getOriginalPrice()),
              discount: Number(discountPrice ?? 0),
              currency: "SAR",
              item_brand: isArabic
                ? item?.brand?.name_arabic
                : item?.brand?.name,
              item_image_link: `${NewMedia}${item?.featured_image?.image}`,
              item_link: `${origin}/${isArabic ? "ar" : "en"}/product/${
                item?.slug
              }`,
              item_availability: "in stock",
              index: index,
              quantity: 1,
              id: item?.sku,
            };
          }),
        },
      });
    }
  };
  useEffect(() => {
    const handlePopState = () => {
      // Called on browser back/forward
      router.refresh();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  useEffect(() => {
    (async () => {
      if (searchParams?.brand) {
        setBrandfilterHide(true);
        var br = searchParams?.brand.split(",");
        var brandnames: any = {};
        for (var b = 0; b < br.length; b++) {
          if (!brandnames[br[b]]) {
            brandnames[br[b]] = true;
          }
        }
        setselectedbrands(brandnames);
        if (deviceType == "mobile") {
          window.scrollTo(0, 250);
        } else {
          window.scrollTo(0, 350);
        }
      }

      if (searchParams?.cats) {
        setFilterHide(true);
        var cats = searchParams?.cats.split(",");
        var scats: any = {};
        for (var c = 0; c < cats.length; c++) {
          if (!scats[cats[c]]) {
            scats[cats[c]] = true;
          }
        }
        setselectedcats(scats);
      }

      if (searchParams?.rating) {
        setRatingfilterHide(true);
        var rates = searchParams?.rating.split(",");
        var srate: any = {};
        for (var r = 0; r < rates.length; r++) {
          if (!srate[rates[r]]) {
            srate[rates[r]] = true;
          }
        }
        setselectedrating(srate);
        if (deviceType == "mobile") {
          window.scrollTo(0, 250);
        } else {
          window.scrollTo(0, 350);
        }
      }

      if (searchParams?.sort) {
        setsort(searchParams?.sort);
      }

      if (searchParams?.tags) {
        var tagdata = searchParams?.tags.split(",");
        var shitems: any = {};
        //var maintag = itemsToShowTag
        for (var t = 0; t < tagdata.length; t++) {
          if (!shitems[tagdata[t]]) shitems[tagdata[t]] = true;
          for (
            let index = 0;
            index < CatData?.productData?.tags?.length;
            index++
          ) {
            const element = CatData?.productData?.tags[index];
            const relatetype = element?.childs?.filter(
              (item: any) => item?.name == tagdata[t]
            );
          }
        }
        setselectedtags({ ...shitems });
        if (deviceType == "mobile") {
          window.scrollTo(0, 250);
        } else {
          window.scrollTo(0, 350);
        }
      }
    })();
    // var prodata = products
    // if (data?.productData?.products?.current_page == 1)
    //   prodata = []
    // prodata = prodata.concat(data?.productData?.products?.data)

    var prodata = data?.productData?.products?.data;
    setproducts([...prodata]);
    setLoaderStatus(false);
    if (typeof window !== "undefined") {
      var load = true;
      window.onscroll = function () {
        var elem: any = document.getElementById("loadmore");
        if (elem?.offsetTop - 700 <= window?.pageYOffset && load) {
          load = false;
          elem.click();
          setTimeout(function () {
            load = true;
          }, 1500);
        }
      };
    }
    // if (searchnotifications?.length) {
    //   notificationCount();
    // }
  }, [data]);
  // const notificationCount = () => {
  //   if (searchnotifications?.length) {
  //     var data = {
  //       id: searchnotifications,
  //       desktop: true,
  //     };
  //     post("notificationsCounts", data).then((responseJson: any) => {
  //       if (responseJson?.success) {
  //       }
  //     });
  //   }
  // };
  const filter = () => {
    setLoaderStatus(true);
    var filterdata: any = {};
    if (currentPage && currentPage != data?.productData?.products?.current_page)
      filterdata["page"] = currentPage;
    // if (min)
    //   filterdata['min'] = min
    // if (max)
    //   filterdata['max'] = max
    if (Object.keys(selectedcats).length)
      filterdata["cats"] = Object.keys(selectedcats).join(",");
    if (Object.keys(selectedbrands).length)
      filterdata["brand"] = Object.keys(selectedbrands).join(",");
    if (Object.keys(selectedrating).length)
      filterdata["rating"] = Object.keys(selectedrating).join(",");
    if (Object.keys(selectedtags).length)
      filterdata["tags"] = Object.keys(selectedtags).join(",");
    if (sort) filterdata["sort"] = sort;
    const result = "?" + new URLSearchParams(filterdata).toString();
    // console.log("result",result)
    if (
      Object.keys(filterdata).length == 3 &&
      // Object.keys(searchParams).length <= 3 &&
      filterdata["page"] &&
      currentPage == data?.productData?.products?.current_page &&
      min == data?.productData?.min &&
      max == data?.productData?.max
    )
      return false;
    router.push(`${origin}/${lang}/category/${slug}${result}`, {
      scroll: false,
    });
    router.refresh();
  };

  useEffect(() => {
    if (sort != searchParams?.sort && sort) filter();
  }, [sort]);

  useEffect(() => {
    if (
      (Object.keys(selectedcats).length > 0 &&
        searchParams?.cats != Object.keys(selectedcats)[0]) ||
      (Object.keys(selectedcats).length == 0 && searchParams?.cats)
    ) {
      filter();
    }
  }, [selectedcats]);

  // useEffect(() => {
  //   if (pricefilter) {
  //     setcurrentPage(1)
  //     filter()
  //   }
  // }, [pricefilter])

  useEffect(() => {
    if (currentPage != data?.productData?.products?.current_page) filter();
  }, [currentPage]);
  const isMobileOrTablet =
    deviceType === "mobile" || deviceType === "tablet" ? true : false;
  const isArabic = lang === "ar" ? true : false;

  // Const For Bottom Text
  const titleHeadingText =
    data?.productData?.products?.total + (isArabic ? " منتج" : " Products");
  const subHeadingOneText = isArabic ? "الكل" : "All";

  const subHeadingFiveText = isArabic ? "ترتيب حسب" : "Sort by";
  const applyFiltersText = isArabic ? "تطبيق الفلاتر" : "Apply Filters";

  const [sortPopup, setSortPopup] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  const [whatsappBtn, setWhatsappBtn] = useState<boolean>(false);

  return (
    <>
      {/* {isMobileOrTablet && (
        <MobileHeader
          type="Secondary"
          lang={lang}
          dict={dict}
          pageTitle={
            isArabic
              ? CatData?.category?.name_arabic
              : CatData?.category?.name
          }
          onClick={() => setFilterModal(true)}
        />
      )} */}
      {/* Header Section */}
      <header className="pt-3 bg-white shadow-lg w-full sticky top-0 z-50">
        <button
          onClick={() => setWhatsappBtn(true)}
          className={`WhatsappBeforeHover ${
            whatsappBtn ? "!hidden" : "!flex"
          } ${
            isArabic
              ? "right-0  rounded-tl-2xl rounded-bl-2xl"
              : "left-0 rounded-tr-2xl rounded-br-2xl"
          }`}
        >
          <ArrowLeftIcon
            size={16}
            color="#54AB60"
            className={`${isArabic ? "" : "rotate-180"}`}
          />
        </button>
        <Link
          href="https://wa.me/9668002444464"
          aria-label=""
          target="_blank"
          prefetch={false}
          scroll={false}
          rel="noopener noreferrer"
          className={`whatsappLayout ${whatsappBtn ? "!flex" : "!hidden"} ${
            isArabic
              ? "right-0 rounded-tl-2xl rounded-bl-2xl"
              : "left-0 rounded-tr-2xl rounded-br-2xl"
          }`}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g opacity="0.8">
              <rect
                width="25"
                height="25"
                transform="translate(0.75 0.5)"
                fill="url(#pattern0_579_2464)"
              />
            </g>
            <defs>
              <pattern
                id="pattern0_579_2464"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use xlinkHref="#image0_579_2464" transform="scale(0.0125)" />
              </pattern>
              <image
                id="image0_579_2464"
                width="80"
                height="80"
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,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"
              />
            </defs>
          </svg>
        </Link>
        <div className="container">
          <div className="header_top flex items-center gap-x-4 mb-4">
            <Link
              prefetch={false}
              scroll={false}
              href={`${origin}/${lang}`}
              className="logo"
            >
              <LogoIcon size={57} color="#004B7A" className="text-primary" />
            </Link>
            <div className="searchBox flex items-center gap-x-2 bg-white px-4 py-[9px] border-[1px] rounded-lg border-[#5D686F] basis-full">
              <div className="flex items-center gap-x-2">
                <SearchIcon
                  size={20}
                  color="#004B7A"
                  className="text-primary"
                />
                <svg
                  width="2"
                  height="22"
                  viewBox="0 0 2 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.791992 0V22"
                    stroke="#004B7A"
                    strokeOpacity="0.7"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder={
                  lang === "ar" ? "ابحث هنا" : "What are you looking for?"
                }
                className="border-none outline-none w-full px-2 text-xs text-[#004B7A] placeholder:text-[#6B7280]"
              />
            </div>
          </div>
        </div>
        <div className="sticky_pagination px-2 flex ltr:flex-row rtl:flex-row-reverse items-center justify-between gap-2 bg-primary">
          {data?.productData?.products && (
            <>
              {data?.productData?.products?.last_page > 1 && (
                <StickyPagination
                  setCurrentPage={(newpage) => {
                    setLoaderStatus(true);
                    window.scrollTo(0, 0);
                    setcurrentPage(newpage);
                  }}
                  isMobileOrTablet={isMobileOrTablet}
                  isArabic={isArabic}
                  currentPage={data?.productData?.products?.current_page}
                  lastPage={data?.productData?.products?.last_page}
                />
              )}
            </>
          )}
          <div className="w-px h-8 border border-white"></div>
          <div className="h-full">
            <button
              onClick={() => {
                setFilterModal(!filterModal);
              }}
              className="text-white text-10 !font-semibold flex gap-1 items-center !w-fit whitespace-nowrap selected !border-0 outline-0 hover:text-primary  hover:bg-white !transition-none"
            >
              <FilterIconTwo size={12} color="#ffffff" />
              {applyFiltersText}
            </button>
          </div>
          <div className="w-px h-8 border border-white"></div>
          <div className="relative inline-block">
            <button
              onClick={() => setSortPopup(!sortPopup)}
              className="text-white text-10 !font-semibold flex gap-1 items-center !w-fit whitespace-nowrap selected !border-0 outline-0 hover:text-primary  hover:bg-white !transition-none"
            >
              <SortIcon size={12} color="#ffffff" />
              {subHeadingFiveText}
            </button>

            {sortPopup && (
              <div
                className={`absolute top-full ${
                  isArabic ? "right-0" : "left-0"
                } mt-3 z-30 w-max bg-white rounded-xl p-4 shadow-[0_0_4px_rgb(0,75,122)]`}
                onClick={(e) => e.stopPropagation()}
              >
                <ul className="space-y-3">
                  {SortingProduct.map((filter) => (
                    <li key={filter?.value} className="">
                      <label
                        htmlFor={filter?.label.toLowerCase().replace(" ", "_")}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <span className="inline-flex justify-center items-center w-5 h-5 rounded border border-gray-300 peer-checked:border-primary cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            id={filter?.label.toLowerCase().replace(" ", "_")}
                            className="hidden peer"
                            checked={sort == filter?.value}
                            onChange={() => setsort(filter?.value)}
                          />
                          <CheckIcon
                            size={14}
                            className="hidden peer-checked:block"
                          />
                        </span>
                        <span className="text-xs text-primary">
                          {filter?.label}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* <div className={`${isMobileOrTablet ? "mt-32" : "mt-24"}`}></div> */}

      {/* Section 1 */}
      {!isMobileOrTablet && (
        <section className={`filter_sec relative`}>
          <div className="xl:px-20 lg:px-10 px-4 py-5">
            <FilterHorizontal
              NewMedia={NewMedia}
              isArabic={isArabic}
              isMobileOrTablet={isMobileOrTablet}
              deviceType={deviceType}
              tags={CatData?.productData?.tags}
              selectedtags={selectedtags}
              onChangetags={(tagchild: any) => {
                var tagnames = selectedtags;
                if (!tagnames[tagchild.name]) {
                  tagnames[tagchild.name] = true;
                } else {
                  delete tagnames[tagchild.name];
                  window.scrollTo(0, 0);
                }
                setLoaderStatus(true);
                setselectedtags({ ...tagnames });
                setcurrentPage(1);
                filter();
              }}
              brands={CatData?.productData?.brands}
              selectedbrands={selectedbrands}
              setBrandData={(id: any, name: string) => {
                var bdata = selectedbrands;
                if (!bdata[name]) {
                  bdata[name] = true;
                } else {
                  delete bdata[name];
                }
                setLoaderStatus(true);
                setselectedbrands({ ...bdata });
                setcurrentPage(1);
                filter();
              }}
              setClear={() => {
                setLoaderStatus(true);
                setselectedbrands({});
                setselectedrating({});
                setselectedcats({});
                setcurrentPage(1);
                setselectedtags({});
                // setFilterMobile(false)
                window.scrollTo(0, 0);
                router.push(`${origin}/${lang}/category/${slug}`, {
                  scroll: true,
                });
                router.refresh();
              }}
            />
          </div>
        </section>
      )}

      {/* Section 2 */}
      <section
        className={`relative mt-4 ${isMobileOrTablet ? "mb-24" : "mb-8"}`}
      >
        <div className="xl:px-20 lg:px-10 px-4 flex md:flex-row flex-col items-start gap-4">
          {!isMobileOrTablet && (
            <div className={`${!isMobileOrTablet ? "w-[24%]" : "w-full"}`}>
              <FilterVertical
                isArabic={isArabic}
                NewMedia={NewMedia}
                isMobileOrTablet={isMobileOrTablet}
                deviceType={deviceType}
                tags={CatData?.productData?.tags}
                selectedtags={selectedtags}
                onChangetags={(tagchild: any) => {
                  var tagnames = selectedtags;
                  if (!tagnames[tagchild.name]) {
                    tagnames[tagchild.name] = true;
                  } else {
                    delete tagnames[tagchild.name];
                    window.scrollTo(0, 0);
                  }
                  setLoaderStatus(true);
                  setselectedtags({ ...tagnames });
                  setcurrentPage(1);
                  filter();
                }}
                brands={CatData?.productData?.brands}
                selectedbrands={selectedbrands}
                setBrandData={(id: any, name: string) => {
                  var bdata = selectedbrands;
                  if (!bdata[name]) {
                    bdata[name] = true;
                  } else {
                    delete bdata[name];
                  }
                  setLoaderStatus(true);
                  setselectedbrands({ ...bdata });
                  setcurrentPage(1);
                  filter();
                }}
                setClear={() => {
                  setLoaderStatus(true);
                  setselectedbrands({});
                  setselectedrating({});
                  setselectedcats({});
                  setcurrentPage(1);
                  setselectedtags({});
                  // setFilterMobile(false)
                  window.scrollTo(0, 0);
                  router.push(`${origin}/${lang}/category/${slug}`, {
                    scroll: true,
                  });
                  router.refresh();
                }}
              />
            </div>
          )}
          <div
            className={`${
              !isMobileOrTablet ? "w-[76%]" : "w-full"
            } pb-2 overflow-hidden`}
          >
            {isMobileOrTablet ? (
              <div className="mb-5">
                {/* <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setSortPopup(!sortPopup)}
                      className="bestProButton shadow-md !text-base flex gap-2 items-center w-fit whitespace-nowrap selected lg:!py-2.5 !py-1 !px-4 !bg-white !text-primary !border-0 hover:!text-white hover:!bg-primary !transition-none"
                    >
                      {subHeadingFiveText}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M11.0039 1.36035V11.6592L12.582 10.2119L12.6191 10.1777L12.6533 10.2148L13.3291 10.9512L13.3623 10.9883L13.3262 11.0225L10.4883 13.625L10.4541 13.6562L10.4199 13.625L7.58203 11.0225L7.5459 10.9883L7.5791 10.9512L8.25488 10.2148L8.28906 10.1777L8.32617 10.2119L9.9043 11.6602V1.36035H11.0039ZM3.53418 0.992188L6.37207 3.5957L6.40918 3.62891L6.375 3.66602L5.69922 4.40332L5.66504 4.44043L5.62793 4.40625L4.0498 2.95703V13.5508H2.9502V2.95703L1.37207 4.40625L1.33496 4.44043L1.30078 4.40332L0.625 3.66602L0.591797 3.62891L0.62793 3.5957L3.4668 0.992188L3.5 0.961914L3.53418 0.992188Z"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="0.1"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="5"
                        viewBox="0 0 10 5"
                        fill="none"
                      >
                        <path
                          d="M0 5L5 0L10 5H0Z"
                          fill="currentColor"
                          fillOpacity="0.7"
                        />
                      </svg>
                    </button>

                    {sortPopup && (
                      <div
                        className={`absolute top-full ${
                          isArabic ? "right-0" : "left-0"
                        } mt-2 z-30 w-max bg-white rounded-xl shadow-md p-4`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ul className="space-y-3">
                          {SortingProduct.map((filter) => (
                            <li key={filter?.value} className="">
                              <label
                                htmlFor={filter?.label
                                  .toLowerCase()
                                  .replace(" ", "_")}
                                className="flex items-center gap-3 cursor-pointer"
                              >
                                <span className="inline-flex justify-center items-center w-5 h-5 rounded border border-gray-300 peer-checked:border-primary cursor-pointer transition-all duration-200">
                                  <input
                                    type="checkbox"
                                    id={filter?.label
                                      .toLowerCase()
                                      .replace(" ", "_")}
                                    className="hidden peer"
                                    checked={sort == filter?.value}
                                    onChange={() => setsort(filter?.value)}
                                  />
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="10"
                                    viewBox="0 0 14 10"
                                    fill="none"
                                    className="hidden peer-checked:block"
                                  >
                                    <path
                                      d="M12.5029 0.569855C12.7684 0.569955 13.0232 0.675132 13.2109 0.862823C13.3986 1.05052 13.5038 1.3054 13.5039 1.57083C13.5039 1.83623 13.3985 2.09109 13.2109 2.27884L5.20898 9.2769C5.11608 9.3701 5.00632 9.4452 4.88477 9.4956C4.76325 9.5461 4.63254 9.5718 4.50098 9.5718C4.36962 9.5718 4.2395 9.546 4.11816 9.4956C4.02717 9.4579 3.94204 9.4066 3.86621 9.3443L0.792969 6.77786C0.70008 6.68492 0.62646 6.57407 0.576172 6.45267C0.52595 6.33129 0.5 6.20121 0.5 6.06985C0.50001 5.93848 0.52594 5.80843 0.576172 5.68704C0.62647 5.56562 0.70005 5.4548 0.792969 5.36185C0.885938 5.26888 0.9967 5.19537 1.11816 5.14505C1.23955 5.09477 1.36959 5.06892 1.50098 5.06888C1.63247 5.06888 1.76328 5.09473 1.88477 5.14505C2.00604 5.19533 2.11613 5.26904 2.20898 5.36185L4.50195 7.65482L11.7949 0.862823C11.9827 0.675263 12.2375 0.569855 12.5029 0.569855Z"
                                      fill="#004B7A"
                                      stroke="#004B7A"
                                      strokeWidth="0.5"
                                    />
                                  </svg>
                                </span>
                                <span className="sm:text-sm text-xs text-primary">
                                  {filter?.label}
                                </span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setFilterModal(!filterModal);
                    }}
                    className="bestProButton bg-white shadow-md !text-sm !rounded-[.625rem] !font-semibold flex gap-2 items-center !w-fit whitespace-nowrap selected !py-1 !px-4 !text-[000] !border-0 hover:text-white hover:fill-white hover:bg-primary !transition-none"
                  >
                    {applyFiltersText}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                    >
                      <path
                        d="M14.1111 1.38889H0.888916L5.94447 8.51851V14.6111L9.05558 12.537V8.51851L14.1111 1.38889Z"
                        stroke="currentcolor"
                        strokeOpacity="0.7"
                        strokeWidth="1.18056"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div> */}
                <div className="flex items-center justify-between gap-4">
                  <h2 className="headingHomeMain !text-base !text-dark text-nowrap order-0">
                    {titleHeadingText}
                  </h2>
                  {/* Pagination Section */}
                  {/* {data?.productData?.products && (
                    <>
                      {data?.productData?.products?.last_page > 1 && (
                        <Pagination
                          setCurrentPage={(newpage) => {
                            setLoaderStatus(true);
                            window.scrollTo(0, 0);
                            setcurrentPage(newpage);
                          }}
                          isMobileOrTablet={isMobileOrTablet}
                          isArabic={isArabic}
                          currentPage={
                            data?.productData?.products?.current_page
                          }
                          lastPage={data?.productData?.products?.last_page}
                        />
                      )}
                    </>
                  )} */}
                </div>
                <hr className="w-full h-px border border-gray my-2.5 opacity-40"></hr>
              </div>
            ) : (
              <div className="mb-10">
                <div className="flex items-start justify-between xl:gap-10 lg-gap-5 gap-4">
                  <h2 className="headingHomeMain !text-dark lg:!text-[1.375rem] !text-sm text-nowrap self-center">
                    {titleHeadingText}
                  </h2>
                  {CatData?.category?.child?.length > 0 ? (
                    <>
                      <div className="flex items-center 2xl:w-[36.25rem] lg:w-[30.25rem] w-full overflow-x-auto hide_scrollbar pb-1">
                        <div className="flex flex-nowrap min-w-max">
                          <button
                            className={`bestProButton flex gap-2 items-center w-fit whitespace-nowrap 
        !text-xs !rounded-2xl lg:!py-2 !py-1 !px-3 md:!font-bold border-gray !transition-none 
        ${
          Object.keys(selectedcats).length === 0
            ? "!text-white fill-white bg-primary"
            : "text-primary fill-primary hover:text-white hover:fill-white hover:bg-primary"
        }`}
                            onClick={() => {
                              setFilterHide(false);
                              setselectedcats({ ...{} });
                              setcurrentPage(1);
                              setLoaderStatus(true);
                              // filter();
                            }}
                          >
                            <div
                              className="filter_icons"
                              dangerouslySetInnerHTML={{
                                __html: CatData?.category?.icon,
                              }}
                            />
                            {subHeadingOneText}
                          </button>

                          {CatData?.category?.child.map(
                            (child: any, tc: number) => (
                              <div
                                key={tc}
                                className="flex items-center shrink-0"
                              >
                                <div className="h-[20px] w-px mx-2 border border-gray opacity-20"></div>
                                <button
                                  className={`bestProButton flex gap-1 items-center w-fit whitespace-nowrap 
            !text-xs !rounded-2xl lg:!py-2 !py-1 !px-3 md:!font-bold border-gray h-full !transition-none 
            ${
              selectedcats[child?.name]
                ? "!text-white fill-white bg-primary"
                : "text-primary fill-primary hover:text-white hover:fill-white hover:bg-primary"
            }`}
                                  onClick={() => {
                                    const bdata: any = {};
                                    bdata[child?.name] = true;
                                    setselectedcats({ ...bdata });
                                    setcurrentPage(1);
                                    setLoaderStatus(true);
                                    // setselectedcats((prev:any) => {
                                    //   const newState = { ...bdata };
                                    //   console.log("bdata", bdata);
                                    //   setTimeout(() => {
                                    //     console.log("selectedcats3", selectedcats);
                                    //     filter();
                                    //   }, 1000);
                                    //   return newState;
                                    // });
                                    // setcurrentPage(1);
                                    // console.log("bdata", bdata);

                                    // setTimeout(() => {
                                    //   console.log("selectedcats", selectedcats);
                                    //   filter();
                                    // }, 1000);
                                  }}
                                >
                                  <div
                                    className="filter_icons"
                                    dangerouslySetInnerHTML={{
                                      __html: child?.icon,
                                    }}
                                  />
                                  {isArabic ? child?.name_arabic : child?.name}
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  ) : null}

                  <div className="flex items-center gap-3">
                    <div className="flex items-center space-x-2 rounded-full py-1 px-2 shadow-md">
                      <button
                        className={`bestProButton w-fit whitespace-nowrap test !border-0 lg:!py-2 !py-1 !transition-none !px-2 
                          ${
                            view === "grid"
                              ? "selected !text-white !fill-white bg-primary" // active state
                              : "text-primary fill-primary hover:!text-white hover:!fill-white hover:bg-primary" // default + hover
                          }`}
                        onClick={() => setview("grid")}
                      >
                        <svg
                          width="18"
                          height="18"
                          className="lg:w-[18px] lg:h-[18px] w-4 h-4 shrink-0"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            y="1"
                            width="7"
                            height="7"
                            stroke="currentColor"
                            // fill="currentColor"
                          />
                          <rect
                            x="10.5"
                            y="1"
                            width="7"
                            height="7"
                            stroke="currentColor"
                            // fill="currentColor"
                          />
                          <rect
                            x="0.5"
                            y="11"
                            width="7"
                            height="7"
                            stroke="currentColor"
                            // fill="currentColor"
                          />
                          <rect
                            x="10.5"
                            y="11"
                            width="7"
                            height="7"
                            stroke="currentColor"
                            // fill="currentColor"
                          />
                        </svg>
                      </button>
                      <button
                        className={`bestProButton w-fit whitespace-nowrap test !border-0 lg:!py-2 !py-1 !transition-none !px-2 
                          ${
                            view === "list"
                              ? "selected !text-white !fill-white bg-primary" // active state
                              : "!text-primary !fill-primary hover:!text-white hover:!fill-white hover:bg-primary" // default + hover
                          }`}
                        onClick={() => setview("list")}
                      >
                        <svg
                          width="18"
                          height="18"
                          className="lg:w-[18px] lg:h-[18px] w-4 h-4 shrink-0"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            y="0.5"
                            width="18"
                            height="18"
                            rx="4"
                            fill="transparent"
                          />
                          <rect
                            x="0.5"
                            y="1"
                            width="17"
                            height="7"
                            stroke="currentColor"
                          />
                          <rect
                            x="0.5"
                            y="11"
                            width="17"
                            height="7"
                            stroke="currentColor"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="relative inline-block">
                      <button
                        onClick={() => setSortPopup(!sortPopup)}
                        className="bestProButton shadow-md !text-base flex gap-2 items-center w-fit whitespace-nowrap selected lg:!py-2.5 !py-1 !px-4 !text-primary !border-0 hover:!text-white hover:bg-primary !transition-none"
                      >
                        {subHeadingFiveText}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            d="M11.0039 1.36035V11.6592L12.582 10.2119L12.6191 10.1777L12.6533 10.2148L13.3291 10.9512L13.3623 10.9883L13.3262 11.0225L10.4883 13.625L10.4541 13.6562L10.4199 13.625L7.58203 11.0225L7.5459 10.9883L7.5791 10.9512L8.25488 10.2148L8.28906 10.1777L8.32617 10.2119L9.9043 11.6602V1.36035H11.0039ZM3.53418 0.992188L6.37207 3.5957L6.40918 3.62891L6.375 3.66602L5.69922 4.40332L5.66504 4.44043L5.62793 4.40625L4.0498 2.95703V13.5508H2.9502V2.95703L1.37207 4.40625L1.33496 4.44043L1.30078 4.40332L0.625 3.66602L0.591797 3.62891L0.62793 3.5957L3.4668 0.992188L3.5 0.961914L3.53418 0.992188Z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="0.1"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="5"
                          viewBox="0 0 10 5"
                          fill="none"
                        >
                          <path
                            d="M0 5L5 0L10 5H0Z"
                            fill="currentColor"
                            fillOpacity="0.7"
                          />
                        </svg>
                      </button>

                      {sortPopup && (
                        <div
                          className={`absolute top-full ${
                            isArabic ? "left-0" : "right-0"
                          } mt-3 z-30 w-max bg-white rounded-xl shadow-[0_0_4px_rgb(0,75,122)] p-4`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ul className="space-y-3">
                            {SortingProduct.map((filter) => (
                              <li key={filter?.value} className="">
                                <label
                                  htmlFor={filter?.label
                                    .toLowerCase()
                                    .replace(" ", "_")}
                                  className="flex items-center gap-3 cursor-pointer"
                                >
                                  <span className="inline-flex justify-center items-center w-5 h-5 rounded border border-gray-300 peer-checked:border-primary cursor-pointer transition-all duration-200">
                                    <input
                                      type="checkbox"
                                      id={filter?.label
                                        .toLowerCase()
                                        .replace(" ", "_")}
                                      className="hidden peer"
                                      checked={sort == filter?.value}
                                      onChange={() => setsort(filter?.value)}
                                    />
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14"
                                      height="10"
                                      viewBox="0 0 14 10"
                                      fill="none"
                                      className="hidden peer-checked:block"
                                    >
                                      <path
                                        d="M12.5029 0.569855C12.7684 0.569955 13.0232 0.675132 13.2109 0.862823C13.3986 1.05052 13.5038 1.3054 13.5039 1.57083C13.5039 1.83623 13.3985 2.09109 13.2109 2.27884L5.20898 9.2769C5.11608 9.3701 5.00632 9.4452 4.88477 9.4956C4.76325 9.5461 4.63254 9.5718 4.50098 9.5718C4.36962 9.5718 4.2395 9.546 4.11816 9.4956C4.02717 9.4579 3.94204 9.4066 3.86621 9.3443L0.792969 6.77786C0.70008 6.68492 0.62646 6.57407 0.576172 6.45267C0.52595 6.33129 0.5 6.20121 0.5 6.06985C0.50001 5.93848 0.52594 5.80843 0.576172 5.68704C0.62647 5.56562 0.70005 5.4548 0.792969 5.36185C0.885938 5.26888 0.9967 5.19537 1.11816 5.14505C1.23955 5.09477 1.36959 5.06892 1.50098 5.06888C1.63247 5.06888 1.76328 5.09473 1.88477 5.14505C2.00604 5.19533 2.11613 5.26904 2.20898 5.36185L4.50195 7.65482L11.7949 0.862823C11.9827 0.675263 12.2375 0.569855 12.5029 0.569855Z"
                                        fill="#004B7A"
                                        stroke="#004B7A"
                                        strokeWidth="0.5"
                                      />
                                    </svg>
                                  </span>
                                  <span className="sm:text-sm text-xs text-primary">
                                    {filter?.label}
                                  </span>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <hr className="w-full h-px border border-gray my-3 opacity-40"></hr>
              </div>
            )}
            {view === "list" ? (
              <div className="tamkeenSales_cardss relative grid grid-cols-1 gap-5 items-start justify-center mb-10">
                {data?.productData?.products?.data?.length > 0 ? (
                  <>
                    {loaderStatus ? (
                      <div
                        className={`animate-pulse tamkeenSales_cardss relative grid grid-cols-1 xl:gap-x-3 gap-2 items-start justify-center`}
                      >
                        {[...Array(isMobileOrTablet ? 10 : 12)].map((_, i) => (
                          <div
                            className="h-[22rem] bg-white rounded-2xl shadow-md"
                            key={i + 200}
                          ></div>
                        ))}
                      </div>
                    ) : (
                      <ProductLoopList
                        productData={
                          products?.length
                            ? products
                            : data?.productData?.products?.data
                        }
                        lang={isArabic}
                        isMobileOrTablet={isMobileOrTablet}
                        origin={origin}
                        NewMedia={NewMedia}
                      />
                    )}
                  </>
                ) : (
                  <h1 className="col-span-3 text-center text-[#5D686F] font-bold">
                    {lang === "ar"
                      ? "لم يتم العثور على منتجات"
                      : "No Product Found"}
                  </h1>
                )}
              </div>
            ) : (
              <div
                className={`tamkeenSales_cardss relative ${
                  loaderStatus
                    ? ""
                    : "grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1"
                } gap-3 items-start justify-center`}
              >
                {data?.productData?.products?.data?.length > 0 ? (
                  <>
                    {loaderStatus ? (
                      <div
                        className={`animate-pulse tamkeenSales_cardss grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 xl:gap-x-3 gap-2 items-start justify-center`}
                      >
                        {[...Array(isMobileOrTablet ? 10 : 12)].map((_, i) => (
                          <div
                            className="h-[32rem] bg-white rounded-2xl shadow-md"
                            key={i + 200}
                          ></div>
                        ))}
                      </div>
                    ) : (
                      <ProductLoop
                        productData={
                          products?.length
                            ? products
                            : data?.productData?.products?.data
                        }
                        lang={isArabic}
                        NewMedia={NewMedia}
                        isMobileOrTablet={isMobileOrTablet}
                        origin={origin}
                      />
                    )}
                  </>
                ) : (
                  <h1 className="col-span-3 text-center text-[#5D686F] font-bold">
                    {lang === "ar"
                      ? "لم يتم العثور على منتجات"
                      : "No Product Found"}
                  </h1>
                )}
              </div>
            )}
            {!isMobileOrTablet && products?.length > 0 && (
              <hr className="w-full h-px border border-gray my-3 opacity-40 mx-auto" />
            )}

            {/* Pagination Section */}
            {!isMobileOrTablet && (
              <div>
                {data?.productData?.products && (
                  <div>
                    {data?.productData?.products?.last_page > 1 && (
                      <Pagination
                        setCurrentPage={(newpage) => {
                          setLoaderStatus(true);
                          window.scrollTo(0, 0);
                          setcurrentPage(newpage);
                        }}
                        isMobileOrTablet={isMobileOrTablet}
                        isArabic={isArabic}
                        currentPage={data?.productData?.products?.current_page}
                        lastPage={data?.productData?.products?.last_page}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Modal */}
      <section
        className={`fixed inset-0 bg-white z-50 p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out
    ${filterModal ? "translate-x-0" : "-translate-x-full"}`}
      >
        <MobileFilterNew
          NewMedia={NewMedia}
          filterModal={filterModal}
          setFilterModal={setFilterModal}
          tags={CatData?.productData?.tags}
          isArabic={isArabic}
          deviceType={deviceType}
          isMobileOrTablet={isMobileOrTablet}
          selectedtags={selectedtags}
          onChangetags={(tagchild: any) => {
            var tagnames = selectedtags;
            if (!tagnames[tagchild.name]) {
              tagnames[tagchild.name] = true;
            } else {
              delete tagnames[tagchild.name];
              window.scrollTo(0, 0);
            }
            setLoaderStatus(true);
            setselectedtags({ ...tagnames });
            setcurrentPage(1);
            filter();
          }}
          brands={CatData?.productData?.brands}
          selectedbrands={selectedbrands}
          setBrandData={(id: any, name: string) => {
            var bdata = selectedbrands;
            if (!bdata[name]) {
              bdata[name] = true;
            } else {
              delete bdata[name];
            }
            setLoaderStatus(true);
            setselectedbrands({ ...bdata });
            setcurrentPage(1);
            filter();
          }}
          setClear={() => {
            setLoaderStatus(true);
            setselectedbrands({});
            setselectedrating({});
            setselectedcats({});
            setcurrentPage(1);
            setselectedtags({});
            // setFilterMobile(false)
            window.scrollTo(0, 0);
            router.push(`${origin}/${lang}/category/${slug}`, {
              scroll: true,
            });
            router.refresh();
          }}
        />
      </section>

      {/* Section 3 */}
      {/* <section className="px-20 py-10">
        <Accordion isArabic={isArabic} origin={origin} isMobileOrTablet={isMobileOrTablet} />
      </section> */}
    </>
  );
}
