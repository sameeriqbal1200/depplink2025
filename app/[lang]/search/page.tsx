"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "swiper/css";
import "swiper/css/navigation";
import { useRouter } from "next-nprogress-bar";
import { getSearchData } from "@/lib/searchPage/search.server";
import { useApp } from "@/app/_ctx/AppContext";

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

const ProductLoop = dynamic(
  () => import("../components/NewHomePageComp/ProductLoop"),
  {
    ssr: true,
  }
);

const ProductLoopList = dynamic(
  () => import("../components/NewHomePageComp/productListLoop"),
  {
    ssr: true,
  }
);

const Pagination = dynamic(() => import("../components/NewPagination"), {
  ssr: true,
});

type SearchProps = {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<Record<string, string>>;
};

export default function Search({ params, searchParams }: SearchProps) {
  const router = useRouter()
  const { lang, deviceType } = useApp();
  const [view, setview] = useState<any>("grid");
  const [sortPopup, setSortPopup] = useState(false);
  const NewMedia = process.env.NEXT_PUBLIC_MEDIA;
  const isArabic = lang === 'ar' ? true : false;
  const [dict, setBrandData] = useState<any>([]);
  const [itemsToShowTag, setitemsToShowTag] = useState<any>({});
  const [CatData, setCatData] = useState<any>(null);
  const [products, setproducts] = useState<any>([]);
  const [currentPage, setcurrentPage] = useState<any>(null);
  const [selectedcats, setselectedcats] = useState<any>({})
  const [selectedbrands, setselectedbrands] = useState<any>({})
  const [selectedtags, setselectedtags] = useState<any>({})
  const [selectedrating, setselectedrating] = useState<any>({})
  const [sort, setsort] = useState<any>(false);
  const [loaderStatus, setLoaderStatus] = useState<any>(false)
  const [min, setMin] = useState<any>(0);
  const [max, setMax] = useState<any>(0);

   const [resolvedSearchParams, setResolvedSearchParams] = useState<
    Record<string, string>
  >({}); // Store resolved searchParams

  const isMobileOrTablet = deviceType === 'mobile' || deviceType === 'tablet' ? true : false;
   useEffect(() => {
    const fetchData = async () => {
      const resolvedSearchParams = await searchParams;
      setResolvedSearchParams(resolvedSearchParams); // Store resolved searchParams
      // Fetch data using getSearchData
      const categoryData = await getSearchData(resolvedSearchParams);
      const data = categoryData ? JSON.parse(JSON.stringify(categoryData)) : null;
      setCatData(data);
      setBrandData(data?.productData?.brands);
      setcurrentPage(data?.productData?.products?.current_page || 1);
      setMin(data?.productData?.min || 0);
      setMax(data?.productData?.max || 0);
      if (resolvedSearchParams?.sort) {
        setsort(resolvedSearchParams?.sort);
      }

      const prodata = data?.productData?.products?.data;
      setproducts([...(prodata || [])]);
      setLoaderStatus(false);
    };

    fetchData();
  }, [params, searchParams]);

  const filter = () => {
    setLoaderStatus(true);
    const filterdata: Record<string, string> = {};
    // Get current URL search params to preserve 'text'
    const currentParams = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    const searchText = currentParams.get("text") || resolvedSearchParams.text;

    if (
      currentPage &&
      currentPage !== CatData?.productData?.products?.current_page
    ) {
      filterdata["page"] = String(currentPage);
    }
    if (sort && sort !== "") {
      filterdata["sort"] = sort;
    }
    if (searchText) {
      filterdata["text"] = searchText;
    }
    const result = "?" + new URLSearchParams(filterdata).toString();
    if (Object.keys(filterdata).length >= 1) {
      router.push(`${origin}/${lang}/search${result}`, { scroll: false });
      router.refresh();
    }
  };

  useEffect(() => {
      if (sort !== resolvedSearchParams?.sort) filter();
    }, [sort]);

    useEffect(() => {
      if (currentPage != CatData?.productData?.products?.current_page)
        filter()
    }, [currentPage])

  const SortingProduct = [
    { value: '', label: lang == 'ar' ? 'الأكثر تطابقاً' : 'Relevance' },
    { value: 'price-asc', label: lang == 'ar' ? 'السعر (من الأقل إلى الأعلى)' : 'Price (Low to High)' },
    { value: 'price-desc', label: lang == 'ar' ? 'السعر (من الأعلى إلى الأقل)' : 'Price (Hight to Low)' },
  ];

  const  titleHeadingText = (CatData?.productData?.products?.total + (isArabic ? " منتج" : " Products"));
  const subHeadingFiveText = isArabic ? "ترتيب حسب" : "Sort by";

  return (
    <>
        <MobileHeader type="Third" lang={lang} dict={dict} pageTitle={`"${resolvedSearchParams?.text}"`} />
      {/* Section 2 */}
      <section
        className={`relative mt-4 ${isMobileOrTablet ? "mb-24" : "mb-8"}`}
      >
        <div className="xl:px-20 lg:px-10 px-4 flex md:flex-row flex-col items-start gap-4 pt-12">
          <div
            className={`w-full pb-2 overflow-hidden`}
          >
            {deviceType === 'mobile' ? null :
              <h1 className='srh__302mainInnerXlHeading'>{lang === 'ar' ? 'نتائج بحثك عن' : 'Your search result for'} "{resolvedSearchParams?.text}"</h1>
            }
            {isMobileOrTablet ? (
              <div className="mb-5">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setSortPopup(!sortPopup)}
                      className="bestProButton shadow-md !text-base flex gap-2 items-center w-fit whitespace-nowrap selected lg:!py-2.5 !py-1 !px-4 !text-primary !border-0 hover:!text-white hover:bg-primary transition-all"
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
                        className="absolute top-full ltr:left-0 rtl:right-0 mt-2 z-30 w-max bg-white rounded-xl shadow-md p-4"
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
                                    checked={sort === filter?.value}
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
                <div className="flex items-center justify-between gap-4">
                  <h2 className="headingHomeMain !text-base !text-dark text-nowrap order-0">
                    {titleHeadingText}
                  </h2>
                  {CatData?.productData?.products && (
                    <>
                      {CatData?.productData?.products?.last_page > 1 && (
                        <Pagination
                          setCurrentPage={(newpage) => {
                            setLoaderStatus(true);
                            window.scrollTo(0, 0);
                            setcurrentPage(newpage);
                          }}
                          isMobileOrTablet={isMobileOrTablet}
                          isArabic={isArabic}
                          currentPage={CatData?.productData?.products?.current_page}
                          lastPage={CatData?.productData?.products?.last_page}
                        />
                      )}
                    </>
                  )}
                </div>
                <hr className="w-full h-px border border-gray my-2.5 opacity-40"></hr>
              </div>
            ) : (
              <div className="mb-10">
                <div className="flex items-start justify-between xl:gap-10 lg:gap-5 gap-4">
                  <h2 className="headingHomeMain !text-dark lg:!text-[1.375rem] !text-sm text-nowrap self-center">
                    {titleHeadingText}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-full py-1 px-2 shadow-md">
                      <button
                        className={`bestProButton w-fit whitespace-nowrap test !border-0 lg:!py-2 !py-1 !px-2 
                          ${view === "grid"
                            ? "selected !text-white !fill-white bg-primary"
                            : "text-primary hover:text-white hover:bg-primary"
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
                            stroke="#004B7A"
                            fill="currentColor"
                          />
                          <rect
                            x="10.5"
                            y="1"
                            width="7"
                            height="7"
                            stroke="#004B7A"
                            fill="currentColor"
                          />
                          <rect
                            x="0.5"
                            y="11"
                            width="7"
                            height="7"
                            stroke="#004B7A"
                            fill="currentColor"
                          />
                          <rect
                            x="10.5"
                            y="11"
                            width="7"
                            height="7"
                            stroke="#004B7A"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                      <button
                        className={`bestProButton w-fit whitespace-nowrap test !border-0 lg:!py-2 !py-1 !px-2 
                          ${view === "list"
                            ? "selected !text-white !fill-white bg-primary"
                            : "text-primary hover:text-white hover:bg-primary"
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
                            fill="white"
                          />
                          <rect
                            x="0.5"
                            y="1"
                            width="17"
                            height="7"
                            stroke="#004B7A"
                          />
                          <rect
                            x="0.5"
                            y="11"
                            width="17"
                            height="7"
                            stroke="#004B7A"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="relative inline-block">
                      <button
                        onClick={() => setSortPopup(!sortPopup)}
                        className="bestProButton shadow-md !text-base flex gap-2 items-center w-fit whitespace-nowrap selected lg:!py-2.5 !py-1 !px-4 !text-primary !border-0 hover:!text-white hover:bg-primary transition-all"
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
                          className="absolute top-full right-0 mt-2 z-30 w-max bg-white rounded-xl shadow-md p-4"
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
                                      checked={sort === filter?.value}
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
              <div className="tamkeenSales_cardss relative grid grid-cols-1 xl:gap-10 gap-5 items-start justify-center mb-10">
                {CatData?.productData?.products?.data?.length > 0 ? (
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
                            : CatData?.productData?.products?.data
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
                    {lang === "ar" ? "لم يتم العثور على منتجات" : "No Product Found"}
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
                {CatData?.productData?.products?.data?.length > 0 ? (
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
                            : CatData?.productData?.products?.data
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
                    {lang === "ar" ? "لم يتم العثور على منتجات" : "No Product Found"}
                  </h1>
                )}
              </div>
            )}
            {!isMobileOrTablet && products?.length > 0 && (
              <hr className="w-2/3 h-px border border-gray my-3 opacity-40 mx-auto" />
            )}
            {!isMobileOrTablet && (
              <div>
                {CatData?.productData?.products && (
                  <div>
                    {CatData?.productData?.products?.last_page > 1 && (
                      <Pagination
                        setCurrentPage={(newpage) => {
                          setLoaderStatus(true);
                          window.scrollTo(0, 0);
                          setcurrentPage(newpage);
                        }}
                        isMobileOrTablet={isMobileOrTablet}
                        isArabic={isArabic}
                        currentPage={CatData?.productData?.products?.current_page}
                        lastPage={CatData?.productData?.products?.last_page}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}