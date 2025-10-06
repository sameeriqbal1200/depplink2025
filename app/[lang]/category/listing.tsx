"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import { useRouter } from "next-nprogress-bar";

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

const Pagination = dynamic(() => import("@/components/NewPagination"), {
  ssr: true,
});

type ListingProps = {
  data: any;
  slug: string;
  lang: string;
  origin: string;
  deviceType: string;
  searchParams?: Record<string, string>;
};

export default function SubCategoryNew({ data, slug, lang, deviceType, origin, searchParams }: ListingProps) {
  const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA;
  const router = useRouter();
  const [dict, setDict] = useState<any>([]);
  const [CatData, setCatData] = useState<any>(data);
  const [brandData, setBrandData] = useState<any>(
    data?.productData?.brands
  );
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
        lang == "ar"
          ? "السعر (من الأقل إلى الأعلى)"
          : "Price (Low to High)",
    },
    {
      value: "sale_price-desc",
      label:
        lang == "ar"
          ? "السعر (من الأعلى إلى الأقل)"
          : "Price (Hight to Low)",
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
              item_link: `${origin}/${isArabic ? "ar" : "en"}/product/${item?.slug
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
    if (
      currentPage &&
      currentPage != data?.productData?.products?.current_page
    )
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
    if (currentPage != data?.productData?.products?.current_page)
      filter();
  }, [currentPage]);
  const isMobileOrTablet =
    deviceType === "mobile" || deviceType === "tablet"
      ? true
      : false;
  const isArabic = lang === "ar" ? true : false;

  // Const For Bottom Text
  const titleHeadingText =
    data?.productData?.products?.total +
    (isArabic ? " منتج" : " Products");
  const subHeadingOneText = isArabic ? "الكل" : "All";

  const subHeadingFiveText = isArabic ? "ترتيب حسب" : "Sort by";
  const applyFiltersText = isArabic ? "تطبيق الفلاتر" : "Apply Filters";



  const [sortPopup, setSortPopup] = useState(false);
  const [filterModal, setFilterModal] = useState(false);



  return (
    <>
      {isMobileOrTablet && (
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
      )}
      {/* Header Section */}
      {/* <div className="sticky top-0 z-40 w-full block">
        <div className="shadow-md bg-white">
          <div className="flex items-center justify-between px-20 py-5 2xl:gap-12 gap-8">
            <div className="desktop_logo">
              <button className="border-none outline-none">
                <Image
                  alt="Logo"
                  title="Logo"
                  src="/images/categoryNew/new_logo.svg"
                  width={0}
                  height={0}
                  decoding="async"
                  data-nimg="1"
                  sizes="100vw"
                  quality={100}
                  loading="lazy"
                  className="w-[10.782rem] !max-w-none h-[2.875rem] object-cover object0center"
                />
              </button>
            </div>
          
            <div className="relative w-[23.5rem] 2xl:w-1/3 desktop_searchBar">
              <div className="border rounded-lg px-2 flex items-center border-[#5D686F] focus::border-[#000] h-10 gap-2 relative z-20 bg-white">
                <input
                  id="productSearch"
                  className="form-input focus-visible:outline-none focus:ring-transparent text-sm h-8 border-none w-full"
                  placeholder="What you are looking for?"
                  type="text"
                  name="shipping-charge"
                />
                <div className="flex items-center gap-5">
                  <svg
                    width="2"
                    height="23"
                    viewBox="0 0 2 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.0293 0.917969V22.918"
                      stroke="#004B7A"
                      stroke-opacity="10"
                    ></path>
                  </svg>
                  <svg
                    width="19"
                    height="17"
                    viewBox="0 0 19 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-3"
                  >
                    <g clip-path="url(#clip0_7_64348)">
                      <path
                        d="M18.36 15.7804L13.7729 11.8011C15.023 10.4748 15.6376 8.7825 15.4896 7.07415C15.3416 5.3658 14.4424 3.77213 12.978 2.62279C11.5135 1.47345 9.59585 0.85637 7.62163 0.899191C5.64742 0.942012 3.7677 1.64146 2.37128 2.85285C0.974866 4.06424 0.16859 5.6949 0.119229 7.40754C0.0698671 9.12017 0.781196 10.7837 2.10608 12.0542C3.43097 13.3246 5.26804 14.1046 7.23732 14.233C9.2066 14.3614 11.1574 13.8282 12.6863 12.7438L17.2734 16.7231C17.4183 16.8445 17.6124 16.9117 17.8139 16.9102C18.0154 16.9087 18.2082 16.8386 18.3507 16.715C18.4932 16.5914 18.574 16.4242 18.5757 16.2494C18.5775 16.0746 18.5 15.9062 18.36 15.7804ZM7.82633 12.9184C6.61038 12.9184 5.42174 12.6056 4.41072 12.0196C3.3997 11.4336 2.61171 10.6006 2.14638 9.62609C1.68106 8.65155 1.55931 7.57919 1.79653 6.54463C2.03375 5.51006 2.61928 4.55975 3.47909 3.81387C4.33889 3.06799 5.43434 2.56004 6.62692 2.35425C7.81951 2.14847 9.05565 2.25408 10.179 2.65775C11.3024 3.06142 12.2626 3.745 12.9381 4.62207C13.6137 5.49913 13.9743 6.53027 13.9743 7.58511C13.9724 8.99911 13.3241 10.3547 12.1715 11.3546C11.019 12.3544 9.4563 12.9169 7.82633 12.9184Z"
                        fill="#004B7A"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_7_64348">
                        <rect
                          width="18.4438"
                          height="16"
                          fill="white"
                          transform="translate(0.141602 0.917969)"
                        ></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <button className="focus-visible:outline-none underline text-xs text-[#DC4E4E] font-semibold hidden">
                  Clear
                </button>
              </div>
              <div className="hidden">
                <div className="fixed inset-0 bg-dark/40 z-10"></div>
                <div className="bg-white py-4 px-2 absolute top-11 rounded-md shadow-lg w-full z-10 overflow-y-auto h-[750px]">
                  <div className="mb-6 flex flex-wrap gap-2"></div>
                  <div className="flex items-start gap-5">
                    <div className="w-full">
                      <h6 className="text-[#5D686F] text-xs font-bold">
                        Products
                      </h6>
                      <div className="mt-2">
                        <h2 className="text-[#5D686F] text-xs">
                          no products found!
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           
            <div className="flex items-center gap-8">
              <button
                className="focus-visible:outline-none flex items-center gap-2 text-[#5D686F] hover:text-primary fill-[#5D686F] hover:!fill-primary"
                aria-label="cityname"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="8"
                  viewBox="0 0 9 6"
                  fill="none"
                >
                  <path
                    d="M4.41261 3.70735L7.71261 0.407349L8.65527 1.35001L4.41261 5.59268L0.169939 1.35001L1.11261 0.407349L4.41261 3.70735Z"
                    fill="currentColor"
                  />
                </svg>
                Riyadh
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="20"
                  viewBox="0 0 18 20"
                  fill="none"
                >
                  <g clip-path="url(#clip0_1_22676)">
                    <path
                      d="M9.45684 16.8011L13.5216 12.7373C14.3253 11.9334 14.8727 10.9093 15.0944 9.79431C15.3161 8.67935 15.2022 7.52369 14.7671 6.47346C14.332 5.42322 13.5953 4.52558 12.6501 3.89404C11.7049 3.26249 10.5936 2.92541 9.45684 2.92541C8.32005 2.92541 7.20879 3.26249 6.26358 3.89404C5.31836 4.52558 4.58164 5.42322 4.14656 6.47346C3.71149 7.52369 3.59761 8.67935 3.81931 9.79431C4.04102 10.9093 4.58835 11.9334 5.39212 12.7373L9.45684 16.8011ZM14.8762 14.0919L9.45684 19.5112L4.03753 14.0919C2.96576 13.0201 2.23588 11.6545 1.9402 10.1679C1.64452 8.68127 1.79632 7.14034 2.37639 5.73997C2.95646 4.33961 3.93876 3.1427 5.19906 2.3006C6.45937 1.4585 7.94109 1.00903 9.45684 1.00903C10.9726 1.00903 12.4543 1.4585 13.7146 2.3006C14.9749 3.1427 15.9572 4.33961 16.5373 5.73997C17.1174 7.14034 17.2692 8.68127 16.9735 10.1679C16.6778 11.6545 15.9479 13.0201 14.8762 14.0919Z"
                      fill="currentColor"
                    />
                    <path
                      d="M9.52246 6.47119C10.4969 6.47135 11.2871 7.26132 11.2871 8.23584C11.287 9.21023 10.4969 10.0003 9.52246 10.0005C8.54794 10.0005 7.75797 9.21033 7.75781 8.23584C7.75781 7.26122 8.54784 6.47119 9.52246 6.47119Z"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="1.17647"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_22676">
                      <rect
                        width="16.4706"
                        height="20"
                        fill="white"
                        transform="translate(0.699219)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div> */}

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
        className={`relative mt-4 ${isMobileOrTablet ? "mb-24" : "mb-8"
          }`}
      >
        <div className="xl:px-20 lg:px-10 px-4 flex md:flex-row flex-col items-start gap-4 pt-12">
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
            className={`${!isMobileOrTablet ? "w-[76%]" : "w-full"
              } pb-2 overflow-hidden`}
          >
            {isMobileOrTablet ? (
              <div className="mb-5">
                <div className="flex items-center justify-between gap-4 mb-5">
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
                        className={`absolute top-full ${isArabic ? 'right-0' : 'left-0'} mt-2 z-30 w-max bg-white rounded-xl shadow-md p-4`}
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
                </div>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="headingHomeMain !text-base !text-dark text-nowrap order-0">
                    {titleHeadingText}
                  </h2>
                  {/* Pagination Section */}
                  {data?.productData?.products && (
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
                          lastPage={
                            data?.productData?.products?.last_page
                          }
                        />
                      )}
                    </>
                  )}
                </div>
                <hr className="w-full h-px border border-gray my-2.5 opacity-40"></hr>
              </div>
            ) : (
              <div className="mb-10">
                <div className="flex items-start justify-between xl:gap-10 lg-gap-5 gap-4">
                  <h2 className="headingHomeMain !text-dark lg:!text-[1.375rem] !text-sm text-nowrap self-center">
                    {titleHeadingText}
                  </h2>
                  {CatData?.category?.child?.length > 0 ? 
                    <>
                    <div className="flex items-center 2xl:w-[36.25rem] lg:w-[30.25rem] w-full overflow-x-auto hide_scrollbar pb-1">
                      <div className="flex flex-nowrap min-w-max">
                        <button
                          className={`bestProButton flex gap-2 items-center w-fit whitespace-nowrap 
        !text-xs !rounded-2xl lg:!py-2 !py-1 !px-3 md:!font-bold border-gray !transition-none 
        ${Object.keys(selectedcats).length === 0
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
                          <div className="filter_icons"
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
            ${selectedcats[child?.name]
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
                                <div className="filter_icons"
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
                  :null}

                  <div className="flex items-center gap-3">
                    <div className="flex items-center space-x-2 rounded-full py-1 px-2 shadow-md">
                      <button
                        className={`bestProButton w-fit whitespace-nowrap test !border-0 lg:!py-2 !py-1 !transition-none !px-2 
                          ${view === "grid"
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
                          ${view === "list"
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
                          className={`absolute top-full ${isArabic ? 'left-0' : 'right-0'} mt-2 z-30 w-max bg-white rounded-xl shadow-md p-4`}
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
                        {[...Array(isMobileOrTablet ? 10 : 12)].map(
                          (_, i) => (
                            <div
                              className="h-[22rem] bg-white rounded-2xl shadow-md"
                              key={i + 200}
                            ></div>
                          )
                        )}
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
                className={`tamkeenSales_cardss relative ${loaderStatus
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
                        {[...Array(isMobileOrTablet ? 10 : 12)].map(
                          (_, i) => (
                            <div
                              className="h-[32rem] bg-white rounded-2xl shadow-md"
                              key={i + 200}
                            ></div>
                          )
                        )}
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
                        currentPage={
                          data?.productData?.products?.current_page
                        }
                        lastPage={
                          data?.productData?.products?.last_page
                        }
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
