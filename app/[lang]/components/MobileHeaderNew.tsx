"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, Fragment, useContext } from "react";
import {
  Dialog,
  Transition,
  RadioGroup,
  Tab,
  Disclosure,
} from "@headlessui/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getCartCount } from "../cartstorage/cart";
import dynamic from "next/dynamic";
import GlobalContext from "../../GlobalContext";
import {
  getAllCityData,
  getHeaderMenuData,
  getOnlyCityData,
  getSearchData,
  getUserCompareData,
  getUserWishlistData,
} from "@/lib/components/component.client";
import ArrowLeftIcon from "./Icons/ArrowLeftIcon";
import CloseIcon from "./Icons/CloseIcon";
import SmallArrowIcon from "./Icons/SmallArrowIcon";
import LocationIcon from "./Icons/LocationIcon";
import BellBadgeIcon from "./Icons/BellBadgeIcon";
import CartIcon from "./Icons/CartIcon";
import LogoIcon from "./Icons/LogoIcon";
import SearchIcon from "./Icons/SearchIcon";
import MenuIcon from "./Icons/MenuIcon";
import CheckboxIcon from "./Icons/CheckboxIcon";
import { ErrorTracker } from "../utils/errorTracker";
const ProductLoop = dynamic(() => import("./NewHomePageComp/ProductLoop"), {
  ssr: false,
});

export default function MobileHeaderNew(props: any) {
  const { updateWishlist, setUpdateWishlist } = useContext(GlobalContext);
  const NewMedia = props?.NewMedia;
  const lang = props?.lang;
  const deviceType = props?.deviceType;
  const city = props?.city;
  const origin = props?.origin;
  const slugStr = props?.slugStr;
  const isArabic = props?.isArabic;
  const isMobileOrTablet = props?.isMobileOrTablet;
  const router = useRouter();
  const [appDrawer, setAppDrawer] = useState<boolean>(false);
  const [whatsappBtn, setWhatsappBtn] = useState<boolean>(false);
  const [menuData, setMenuData] = useState<any>([]);
  const [subCategory, setSubCategory] = useState<any>(false);
  const [parentCategory, setParentCategory] = useState<any>(false);
  const [useraddress, setuseraddress] = useState<any>("");
  const [cityData, setCityData] = useState<any>([]);
  const [selectedCityData, setselectedCityData] = useState<any>({});
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [citiesData, setcitiesData] = useState<any>([]);
  const [cityList, setCityList] = useState<boolean>(false);
  const [citySearch, setCitySearch] = useState<any>("");
  const [searchPop, setSearchPop] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<any>("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchDialoug, setSearchDialoug] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [fullAddress, setfullAddress] = useState<any>(null);
  const { updateCart, setUpdateCart } = useContext(GlobalContext);
  const { globalCity, setglobalCity } = useContext<any>(GlobalContext);
  const SearchData: any = async (e: any) => {
    if (e?.length == 0) {
      setSearchDialoug(false);
    } else {
      setSearchDialoug(true);
      var searchcity = await localStorage.getItem("city");
      const getData = await getSearchData(e, searchcity, lang);
      if (getData?.getUserSearchData) {
        setSearchResult(getData?.getUserSearchData);
      }
    }
  };

  useEffect(() => {
    DataLocalStorage();
    getUserData();
  }, [updateCart, updateWishlist]);

  const getUserData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const userId = localStorage.getItem("userid");

    if (!localStorage.getItem("userCompare")) {
      const getData = await getUserCompareData(userId);
      if (getData?.userCompareData) {
        localStorage.setItem(
          "userCompare",
          JSON.stringify(getData.userCompareData.comparedata)
        );
        window.dispatchEvent(new Event("storage"));
      }
    }

    if (!localStorage.getItem("userWishlist")) {
      const getDatapd = await getUserWishlistData(userId);
      if (getDatapd?.userWishlistData) {
        localStorage.setItem(
          "userWishlist",
          JSON.stringify(getDatapd.userWishlistData.wishlistdata)
        );
        window.dispatchEvent(new Event("storage"));
      }
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cartData") {
        setUpdateCart((prev: any) => (prev == 0 ? 1 : 0));
      }
    };

    const handleCustomCartChange = (e: Event) => {
      setUpdateCart((prev: any) => (prev == 0 ? 1 : 0));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartDataChanged", handleCustomCartChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartDataChanged", handleCustomCartChange);
    };
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("globalcity")) {
      setTimeout(function () {
        if (localStorage.getItem("default_address") != "yes") {
          var live = localStorage.getItem("live_location");
          if (live != "false") {
            if ("geolocation" in navigator) {
              // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
              navigator.geolocation.getCurrentPosition(({ coords }) => {
                setLatitude(coords.latitude);
                setLongitude(coords.longitude);
                const latitude = coords.latitude;
                const longitude = coords.longitude;
                // if (!localStorage.getItem("globalcity"))
                fetchApiData({ latitude, longitude });
              });
            }
          }
        }
      }, 5000);
    }
    // DataLocalStorage()

    // for address
    if (!fullAddress) {
      if ("geolocation" in navigator) {
        // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          setLatitude(coords.latitude);
          setLongitude(coords.longitude);
          const latitude = coords.latitude;
          const longitude = coords.longitude;
          // if (!localStorage.getItem("globalcity"))
          fetchApiData({ latitude, longitude });
        });
      }
    } else {
      setfullAddress(localStorage.getItem("fulladdress"));
    }
  }, []);

  const fetchApiData = async ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=${lang}&sensor=true&key=AIzaSyB3ekz5eMwuRZGvFy2HUADZVhxAzTWV5Ok`
    );
    const data = await res?.json();
    if (data?.results[0]?.formatted_address) {
      localStorage.setItem(
        "fulladdress",
        data?.results[0]?.formatted_address.toString()
      );
      setfullAddress(data?.results[0]?.formatted_address);
    }
    for (var a = 0; a < data?.results[0]["address_components"]?.length; a++) {
      if (
        data?.results[0]["address_components"][a]?.types[0] ==
        "administrative_area_level_2" &&
        data?.results[0]["address_components"][a]?.types[1] == "political" &&
        !localStorage.getItem("globalcity")
      ) {
        var city = data?.results[0]["address_components"][a]["long_name"];
        setCityData(city);
        localStorage.setItem("globalcity", city.toString());
        setglobalCity(city);
        updateCity();
      }

      // if (
      //   data?.results[0]["address_components"][a]?.types[0] == "neighborhood" &&
      //   data?.results[0]["address_components"][a]?.types[1] == "political" &&
      //   !fullAddress
      // ) {
      //   localStorage.setItem(
      //     "fulladdress",
      //     data?.results[0]["address_components"][a]["long_name"].toString()
      //   );
      //   setfullAddress(data?.results[0]["address_components"][a]["long_name"]);
      // }
    }
  };
  const DataLocalStorage = async () => {
    setCartCount(getCartCount());
    if (cityData != localStorage.getItem("globalcity")) {
      var cdata: any = localStorage.getItem("globalcity");
      setCityData(cdata);
      setselectedCityData(cdata);
      setuseraddress(localStorage.getItem("globaladdress"));
    }
  };
  const getMenu = async () => {
    if (!menuData?.length) {
      const mData = await getHeaderMenuData();
      setMenuData(mData?.menuDataUpd?.menu);
    }
  };
  const menuRedirection = (slug: any) => {
    router.push(`/${lang}/category/${slug}`);
  };
  const getCitiesData = async () => {
    const dataCities = await getAllCityData(lang);
    setcitiesData(dataCities?.allCitiesData?.cities);
  };

  const filteredCities = citiesData.filter((city: { label: string }) =>
    city.label.toLowerCase().includes(citySearch.toLowerCase())
  );
  const setupCity = () => {
    if (!selectedCityData) {
      topMessageAlartDanger(
        lang == "ar"
          ? "خطأ! الرجاء اختيار المدينة"
          : "Error! Please select city"
      );
      ErrorTracker.trackCustomError(
        lang == "ar" ? "خطأ! الرجاء اختيار المدينة" : "Error! Please select city",
        'frontend',
        400,
        deviceType,
        'Mobile Header New Page'
      );
      return false;
    }
    setCityData(selectedCityData);
    topMessageAlartSuccess(
      props?.lang === "ar"
        ? "تم تحديث مدينتك بنجاح!"
        : "Your city has been updated successfully!"
    )
    localStorage.setItem("globalcity", selectedCityData);
    setglobalCity(selectedCityData);
    localStorage.setItem("live_location", "false");
    setCityList(false);
    router.refresh();
  };

  const updateCity = async () => {
    var sCty: any = localStorage?.getItem("globalcity");
    if (!sCty) {
      sCty = "Jeddah";
    }
    const getData = await getOnlyCityData(sCty, lang);
    if (getData?.getCityDataUpd?.cities) {
      var city = "Jeddah";
      if (isArabic) {
        city = getData?.getCityDataUpd?.cities?.name_arabic;
      }
      if (isArabic == false) {
        city = getData?.getCityDataUpd?.cities?.name;
      }
      localStorage?.setItem("globalcity", city);
      setglobalCity(city);
      setCityData(city);
      setselectedCityData(city);
    }
  };

  // Here is the issue
  useEffect(() => {
    var live: any = localStorage.getItem("live_location");
    if (live == "false" || live == null) {
      updateCity();
    }
  }, [lang]);
  const MySwal = withReactContent(Swal);
  const topMessageAlartSuccess = (title: any) => {
    MySwal.fire({
        icon: "success",
        title:
            <div className="text-xs">
                <div className="uppercase">{title}</div>
            </div>
        ,
        toast: true,
        position: props.lang == 'ar' ? 'top-start' : 'top-end',
        showConfirmButton: false,
        timer: 15000,
        showCloseButton: false,
        background: '#20831E',
        color: '#FFFFFF',
        timerProgressBar: true,
        customClass: {
            popup: `bg-success`,
        },
    });
   };
  const topMessageAlartDanger = (title: any) => {
    MySwal.fire({
      icon: "error",
      title: (
        <div className="text-xs">
          <div className="uppercase">{title}</div>
        </div>
      ),
      toast: true,
      position: lang == "ar" ? "top-start" : "top-end",
      showConfirmButton: false,
      timer: 15000,
      showCloseButton: true,
      background: "#DC4E4E",
      color: "#FFFFFF",
      timerProgressBar: true,
    });
  };
  return (
    <>
      <header className="py-3 bg-white shadow-lg w-full overflow-hidden">
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
                onClick={() => setSearchPop(!searchPop)}
              />
            </div>
          </div>
          <div className="header_bottom flex items-center ltr:flex-row rtl:flex-row-reverse justify-between gap-x-10">
            <Link
              prefetch={false}
              scroll={false}
              href={`${origin}/${lang}/notifications`}
              className="bell_icon"
            >
              <BellBadgeIcon
                size={29}
                color="#004B7A"
                className="text-primary"
              />
            </Link>
            {/* </div> */}
            <div className="location_wrapper basis-full flex items-center justify-start gap-x-2 text-sm">
              <LocationIcon
                size={20}
                color="#004B7A"
                className="text-[#004B7A]"
              />
              <div className="location_text max-w-38">
                <div
                  className="flex ltr:flex-row rtl:flex-row-reverse ltr:justify-start rtl:justify-end items-center space-x-2"
                  onClick={() => {
                    getCitiesData();
                    setCityList(true);
                  }}
                >
                  <span className="text-xs text-[#606060] line-clamp-1">
                    {" "}
                    {cityData}
                  </span>
                  <SmallArrowIcon size={20} color="#606060" />
                </div>
                {fullAddress && (
                  <div className="text-[#101010] text-[10px] font-semibold max-w-38 line-clamp-1">
                    {fullAddress}
                  </div>
                )}
              </div>
            </div>
            <button
              className="hamburger_icon"
              onClick={() => {
                getMenu();
                setAppDrawer(true);
              }}
            >
              <MenuIcon size={32} color="#004B7A" className="text-[#004B7A]" />
            </button>
          </div>
        </div>
      </header>

      <Transition appear show={appDrawer} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40"
          onClose={() => setAppDrawer(false)}
        >
          <div className="fixed inset-0 bg-dark/40" aria-hidden="true" />
          <div className="fixed inset-0 overflow-y-auto">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom={
                lang === "ar" ? "translate-x-full" : "-translate-x-full"
              }
              enterTo={lang === "ar" ? "-translate-x-0" : "translate-x-0"}
              leave="transition ease-in-out duration-300 transform"
              leaveFrom={lang === "ar" ? "-translate-x-0" : "translate-x-0"}
              leaveTo={lang === "ar" ? "translate-x-full" : "-translate-x-full"}
            >
              <Dialog.Panel className="w-80 h-screen ltr:mr-auto rtl:ml-auto transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all">
                <div className="container align__center py-3.5 border-b mb-3 border-[#9CA4AB50]">
                  <Dialog.Title
                    as="h4"
                    className="text-lg font-bold leading-6 text-gray-900"
                  >
                    {lang == "ar" ? "فئات" : "Categories"}
                  </Dialog.Title>
                  <button
                    onClick={() => setAppDrawer(false)}
                    className="focus-visible:outline-none"
                  >
                    <CloseIcon size={16} color="#000000" />
                  </button>
                </div>
                <div className="overflow-y-auto h-screen pb-40 mt-4">
                  {/* SubCategories */}
                  {menuData?.map((data: any, i: number) => (
                    <React.Fragment key={i}>
                      <button
                        key={i + 3}
                        className={`focus-visible:outline-none align__center py-3 border-b border-[#9CA4AB50] pl-4 pr-3 w-full`}
                        onClick={() => {
                          if (data?.child?.length) {
                            if (parentCategory == data.id) {
                              setParentCategory(false);
                              setSubCategory(false);
                            } else {
                              setParentCategory(data.id);
                              setSubCategory(false);
                            }
                          } else {
                            menuRedirection(data?.slug);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={
                              data?.image_link_app
                                ? data?.image_link_app
                                : "https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png"
                            }
                            alt="name"
                            title="name"
                            width={22}
                            height={22}
                            sizes="22"
                            quality={100}
                          />
                          <label
                            className={`text-sm font-semibold ${parentCategory == data.id ? "text-[#219EBC]" : ""
                              }`}
                          >
                            {lang === "ar" ? data?.name_arabic : data?.name}
                          </label>
                        </div>
                        {data?.child.length && (
                          <ArrowLeftIcon
                            size={26}
                            color={
                              parentCategory === data.id ? "#219EBC" : "#000000"
                            }
                            className={
                              lang === "ar"
                                ? parentCategory === data.id
                                  ? "-rotate-90" // 270° is equivalent to -90°
                                  : ""
                                : parentCategory === data.id
                                  ? "-rotate-90" // 270° is equivalent to -90°
                                  : "rotate-180"
                            }
                          />
                        )}
                      </button>
                      {data?.child.length && (
                        <>
                          {/* SubSubCategories */}
                          {data?.child?.map((childcatgeory: any, i: number) => (
                            <React.Fragment key={i}>
                              <button
                                key={i + 10}
                                className={`focus-visible:outline-none py-3 border-b border-[#9CA4AB50] ltr:pl-8 rtl:pr-8 rtl:pl-3 ltr:pr-3 w-full ${parentCategory == data?.id
                                    ? "scale-100 block"
                                    : "scale-0 hidden"
                                  }`}
                                onClick={() => {
                                  if (childcatgeory?.child?.length) {
                                    if (subCategory === childcatgeory.id) {
                                      setSubCategory(false);
                                    } else {
                                      setSubCategory(childcatgeory.id);
                                    }
                                  } else {
                                    menuRedirection(childcatgeory?.slug);
                                  }
                                }}
                              >
                                <div className="align__center">
                                  <div className="flex items-center gap-2">
                                    <Image
                                      src={
                                        childcatgeory?.image_link_app
                                          ? childcatgeory?.image_link_app
                                          : "https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png"
                                      }
                                      alt="name"
                                      title="name"
                                      width={22}
                                      height={22}
                                      sizes="22"
                                      quality={100}
                                    />
                                    <label
                                      className={`text-sm font-semibold ${subCategory === childcatgeory.id
                                          ? "text-[#219EBC]"
                                          : ""
                                        }`}
                                    >
                                      {lang === "ar"
                                        ? childcatgeory.name_arabic
                                        : childcatgeory.name}
                                    </label>
                                  </div>
                                  {childcatgeory?.child.length ? (
                                    <>
                                      {subCategory === childcatgeory.id ? (
                                        <svg
                                          height="26"
                                          viewBox="0 0 24 24"
                                          width="26"
                                          className="-rotate-90 fill-[#219EBC]"
                                          xmlns="http://www.w3.org/2000/svg"
                                          id="fi_2722991"
                                        >
                                          <g id="_17" data-name="17">
                                            <path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z"></path>
                                          </g>
                                        </svg>
                                      ) : (
                                        <svg
                                          height="26"
                                          viewBox="0 0 24 24"
                                          width="26"
                                          className={
                                            lang === "ar" ? "" : "rotate-180"
                                          }
                                          xmlns="http://www.w3.org/2000/svg"
                                          id="fi_2722991"
                                        >
                                          <g id="_17" data-name="17">
                                            <path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z"></path>
                                          </g>
                                        </svg>
                                      )}
                                    </>
                                  ) : null}
                                </div>
                              </button>

                              {childcatgeory?.child?.length ? (
                                <>
                                  {childcatgeory?.child?.map(
                                    (subcatgeory: any, i: number) => (
                                      <React.Fragment key={i}>
                                        <button
                                          key={i + 50}
                                          className={`focus-visible:outline-none flex items-center gap-2 py-3 border-b border-[#9CA4AB50] w-full ltr:ml-4 ltr:pl-8 rtl:pr-8 ${subCategory == childcatgeory?.id
                                              ? "scale-100"
                                              : "scale-0 hidden"
                                            }`}
                                          onClick={() => {
                                            menuRedirection(subcatgeory?.slug);
                                          }}
                                        >
                                          <Image
                                            src={
                                              subcatgeory?.image_link_app
                                                ? subcatgeory?.image_link_app
                                                : "https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png"
                                            }
                                            alt="name"
                                            title="name"
                                            width={22}
                                            height={22}
                                            quality={100}
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 22px"
                                          />
                                          <label className="text-sm font-semibold">
                                            {lang === "ar"
                                              ? subcatgeory.name_arabic
                                              : subcatgeory.name}
                                          </label>
                                        </button>
                                      </React.Fragment>
                                    )
                                  )}
                                </>
                              ) : null}
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </React.Fragment>
                  ))}
                  <Link
                    className={`focus-visible:outline-none align__center py-3 border-b border-[#9CA4AB50] pl-4 pr-3 w-full`}
                    href={`${origin}/${lang}/category/bundles`}
                  >
                    <label className={`text-sm font-semibold`}>
                      {lang === "ar" ? "مجموعات" : "Bundles"}
                    </label>
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={cityList} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40"
          onClose={() => setCityList(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom={lang === "ar" ? "-translate-y-full" : "translate-y-full"} // Start from bottom for 'ar', top for others
            enterTo="translate-y-0" // Transition to center
          >
            <div className="fixed inset-0 overflow-y-auto">
              <Dialog.Panel className="w-full h-screen transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all">
                <div className="align__center py-3.5 px-4 bg-[#219EBC60]">
                  <Dialog.Title
                    as="h4"
                    className="text-lg font-bold leading-6 text-gray-900"
                  >
                    {lang == "ar" ? "اختر مدينة" : "Select City"}
                  </Dialog.Title>
                  <button
                    onClick={() => setCityList(false)}
                    className="focus-visible:outline-none"
                  >
                    <CloseIcon size={16} color="#000000" />
                  </button>
                </div>
                <div className="pb-4">
                  <Tab.Group>
                    <Tab.List className="w-full flex border-b border-[#474B5230] bg-[#219EBC60]">
                      <Tab as={Fragment}>
                        {({ selected }) => (
                          <button
                            className={`${selected
                                ? "!border-primary text-primary !outline-none"
                                : ""
                              } flex items-center justify-center border-b-2 text-base border-transparent bg-transparent py-3 before:inline-block hover:border-primary hover:text-primary font-bold w-full`}
                          >
                            {lang == "ar" ? "التوصيل" : "Deliver here"}
                          </button>
                        )}
                      </Tab>
                    </Tab.List>
                    <Tab.Panels>
                      <Tab.Panel className="focus-visible:outline-none mt-3 px-4">
                        <div className="panel rounded-t-none">
                          <div className="border rounded px-2 flex items-center border-[#004B7A] focus::border-[#000] h-10 gap-2 relative z-20 bg-white">
                            <input
                              id="productSearch"
                              type="text"
                              name="shipping-charge"
                              className="form-input focus-visible:outline-none text-sm h-9 border-none w-full"
                              placeholder={
                                lang === "ar" ? "مدينة البحث" : "Search City"
                              }
                              value={citySearch}
                              onChange={(e) => setCitySearch(e.target.value)}
                            />
                            {citySearch.length >= 1 && (
                              <button
                                className="focus-visible:outline-none underline text-xs text-[#DC4E4E] font-semibold"
                                onClick={() => setCitySearch("")}
                              >
                                {lang === "ar" ? "مسح" : "Clear"}
                              </button>
                            )}
                          </div>
                          <div className="overflow-y-auto h-[calc(100vh_-_220px)] md:h-[543px] px-2 ios-scroll">
                            <RadioGroup
                              value={selectedCityData}
                              onChange={(e) => {
                                setselectedCityData(e);
                              }}
                            >
                              <div className="space-y-3 mt-4">
                                {filteredCities?.map((data: any, i: any) => {
                                  return (
                                    <RadioGroup.Option
                                      key={i}
                                      value={data.label}
                                      className={({ active, checked }) =>
                                        `relative cursor-pointer focus:outline-none`
                                      }
                                    >
                                      {({ active, checked }) => (
                                        <>
                                          <div
                                            className={`flex w-full items-center justify-between pb-3 ${i + 1 === citiesData.length
                                                ? ""
                                                : "border-b border-[#9CA4AB50]"
                                              }`}
                                          >
                                            <label
                                              className={`font-normal text-sm ${checked
                                                  ? "text-[#219EBC]"
                                                  : "text-[#000000]"
                                                }`}
                                            >
                                              {data.label}
                                            </label>
                                            <CheckboxIcon checked={checked} />
                                          </div>
                                        </>
                                      )}
                                    </RadioGroup.Option>
                                  );
                                })}
                              </div>
                            </RadioGroup>
                          </div>
                          <div className="fixed z-20 bottom-0 w-[92%] py-3">
                            <button
                              onClick={() => {
                                setupCity();
                              }}
                              className="focus-visible:outline-none btn border border-[#004B7A] bg-[#004B7A] p-2.5 rounded-md w-full text-white fill-white font-medium"
                            >
                              {lang === "ar" ? "تغيير المدينة" : "Change City"}
                            </button>
                          </div>
                        </div>
                      </Tab.Panel>
                      <Tab.Panel className="focus-visible:outline-none">
                        <div className="panel rounded-t-none">
                          <div className="px-4">
                            <h5 className="font-semibold text-sm my-3 line-clamp-1">
                              {lang == "ar"
                                ? "المدينة المختارة:"
                                : "Selected City:"}{" "}
                              <span className="text-[#219EBC] font-bold uppercase">
                                Jeddah - Al Safa Dist
                              </span>
                            </h5>
                            <div className="border rounded flex items-center border-[#004B7A] focus::border-[#000] h-9 gap-2 relative z-20 bg-white mt-3">
                              <input
                                id="productSearch"
                                type="text"
                                name="shipping-charge"
                                className="form-input focus-visible:outline-none focus:ring-transparent text-xs h-6 border-none w-full"
                                value={citySearch}
                                onChange={(e) => setCitySearch(e.target.value)}
                                placeholder={"Search Store"}
                              />
                            </div>
                            <hr className="opacity-10" />
                            <h5 className="font-semibold text-sm my-3 line-clamp-1">
                              <span className="text-[#219EBC] font-bold uppercase">
                                50
                              </span>{" "}
                              {lang == "ar"
                                ? "المتاجر لديها توافر"
                                : "Stores have availablity"}
                            </h5>
                            <div className="overflow-y-auto h-[543px]">
                              <div className="border border-[#20831E] rounded-md mt-2">
                                <div className="flex justify-between gap-4 items-center p-3">
                                  <div className="flex gap-2">
                                    <img
                                      src="https://cdn-icons-png.flaticon.com/512/726/726498.png"
                                      alt="warehouse"
                                      height="20"
                                      width="20"
                                    />
                                    <h6 className="text-xs font-semibold">
                                      Jeddah - Old Airport
                                    </h6>
                                    <span className="border border-[#20831E] text-[#20831E] p-1 rounded text-[9px] font-semibold">
                                      {lang == "ar"
                                        ? "في الأوراق المالية"
                                        : "IN STOCK"}
                                    </span>
                                  </div>
                                  <h6 className="text-sm font-semibold text-[#004B7A]">
                                    {lang == "ar" ? "يختار" : "Select"}
                                  </h6>
                                </div>
                                <p className="text-xs px-3 mb-2.5">
                                  {lang == "ar"
                                    ? "شارع عبدالله سليمان منطقة المطار القديم 1"
                                    : "Abdullah Sulaiman Street Old Airport Area, 1"}
                                </p>
                                <Disclosure>
                                  {({ open }) => (
                                    <>
                                      <Disclosure.Button className="tc__311mainDisclosureBtn">
                                        <div className="flex gap-x-1 justify-start items-center">
                                          <span className="bg-[#20831E] h-2 w-2 rounded-full"></span>
                                          <p>
                                            {lang == "ar" ? "يفتح" : "Open"}
                                          </p>
                                        </div>
                                        <div className="flex gap-x-1.5 justify-start items-center">
                                          <p className="text-[#004B7A]">
                                            {lang == "ar"
                                              ? "تفاصيل"
                                              : "Details"}
                                          </p>
                                          <svg
                                            height="14"
                                            viewBox="0 0 24 24"
                                            width="14"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`${open ? "-rotate-180" : ""
                                              } tc__311mainDisclosureBtnSvg`}
                                          >
                                            <path
                                              clipRule="evenodd"
                                              d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z"
                                              fillRule="evenodd"
                                            ></path>
                                          </svg>
                                        </div>
                                      </Disclosure.Button>
                                      <Disclosure.Panel className="tc__311mainDisclosurePanel m-0">
                                        <div className="bg-[#EEF8FC] p-3">
                                          <div className="flex gap-2 justify-start items-start">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              x="0px"
                                              y="0px"
                                              width="14"
                                              height="14"
                                              viewBox="0 0 50 50"
                                            >
                                              <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 37.039062 10.990234 A 1.0001 1.0001 0 0 0 36.265625 11.322266 L 26.183594 22.244141 A 3 3 0 0 0 25 22 A 3 3 0 0 0 22 25 A 3 3 0 0 0 25 28 A 3 3 0 0 0 25.5 27.958984 L 29.125 34.486328 A 1.0010694 1.0010694 0 1 0 30.875 33.513672 L 27.246094 26.984375 A 3 3 0 0 0 28 25 A 3 3 0 0 0 27.652344 23.599609 L 37.734375 12.677734 A 1.0001 1.0001 0 0 0 37.039062 10.990234 z"></path>
                                            </svg>
                                            <div className="text-[#53616A] text-[10px]">
                                              <h6 className="p-0 text-xs mb-1">
                                                {lang == "ar"
                                                  ? "ساعات العمل"
                                                  : "Business hours"}
                                              </h6>
                                              <p>
                                                {lang == "ar"
                                                  ? "من السبت إلى الخميس"
                                                  : "Saturday to Thursday"}
                                              </p>
                                              <p>09:00 am - 11:59 pm</p>
                                            </div>
                                          </div>
                                          <hr className="my-4 opcaity-5" />
                                          <div className="flex gap-2 justify-start items-start">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              x="0px"
                                              y="0px"
                                              width="14"
                                              height="14"
                                              viewBox="0 0 50 50"
                                            >
                                              <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 37.039062 10.990234 A 1.0001 1.0001 0 0 0 36.265625 11.322266 L 26.183594 22.244141 A 3 3 0 0 0 25 22 A 3 3 0 0 0 22 25 A 3 3 0 0 0 25 28 A 3 3 0 0 0 25.5 27.958984 L 29.125 34.486328 A 1.0010694 1.0010694 0 1 0 30.875 33.513672 L 27.246094 26.984375 A 3 3 0 0 0 28 25 A 3 3 0 0 0 27.652344 23.599609 L 37.734375 12.677734 A 1.0001 1.0001 0 0 0 37.039062 10.990234 z"></path>
                                            </svg>
                                            <div className="text-[#53616A] text-[10px]">
                                              <h6 className="p-0 text-xs mb-1">
                                                {lang == "ar"
                                                  ? "ساعات العمل المسائية"
                                                  : "Evening Working Hours"}
                                              </h6>
                                              <p>
                                                {lang == "ar"
                                                  ? "ساعات العمل المسائية"
                                                  : "friday 04:30 PM - 11:59 PM"}
                                              </p>
                                            </div>
                                          </div>
                                          <hr className="my-4 opcaity-5" />
                                          <div className="flex gap-2 justify-start items-start">
                                            <svg
                                              width="14"
                                              height="14"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M4 10.1433C4 5.64588 7.58172 2 12 2C16.4183 2 20 5.64588 20 10.1433C20 14.6055 17.4467 19.8124 13.4629 21.6744C12.5343 22.1085 11.4657 22.1085 10.5371 21.6744C6.55332 19.8124 4 14.6055 4 10.1433Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                              />
                                              <circle
                                                cx="12"
                                                cy="10"
                                                r="3"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                              />
                                            </svg>
                                            <div className="text-[#53616A] text-[10px]">
                                              <h6 className="p-0 text-xs mb-1">
                                                {lang == "ar"
                                                  ? "ساعات العمل المسائية"
                                                  : "Address"}
                                              </h6>
                                              <p>
                                                {lang == "ar"
                                                  ? "شارع عبدالله سليمان منطقة المطار القديم 1"
                                                  : "Abdullah Sulaiman Street Old Airport Area, 1"}
                                              </p>
                                              <a
                                                href=""
                                                className="text-[#004B7A] text-xs"
                                              >
                                                {lang == "ar"
                                                  ? "ساعات العمل المسائية"
                                                  : "Get Direction"}
                                              </a>
                                            </div>
                                          </div>
                                          <hr className="my-4 opcaity-5" />
                                          <div className="flex gap-2 justify-start items-start">
                                            <svg
                                              width="14"
                                              height="14"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M16.1007 13.359L16.5562 12.9062C17.1858 12.2801 18.1672 12.1515 18.9728 12.5894L20.8833 13.628C22.1102 14.2949 22.3806 15.9295 21.4217 16.883L20.0011 18.2954C19.6399 18.6546 19.1917 18.9171 18.6763 18.9651M4.00289 5.74561C3.96765 5.12559 4.25823 4.56668 4.69185 4.13552L6.26145 2.57483C7.13596 1.70529 8.61028 1.83992 9.37326 2.85908L10.6342 4.54348C11.2507 5.36691 11.1841 6.49484 10.4775 7.19738L10.1907 7.48257"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                              />
                                              <path
                                                d="M18.6763 18.9651C17.0469 19.117 13.0622 18.9492 8.8154 14.7266C4.81076 10.7447 4.09308 7.33182 4.00293 5.74561"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                              />
                                              <path
                                                d="M16.1007 13.3589C16.1007 13.3589 15.0181 14.4353 12.0631 11.4971C9.10807 8.55886 10.1907 7.48242 10.1907 7.48242"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                              />
                                            </svg>
                                            <div className="text-[#53616A] text-[10px]">
                                              <h6 className="p-0 text-xs mb-1">
                                                {lang == "ar"
                                                  ? "اتصل بالمتجر"
                                                  : "Contact the store"}
                                              </h6>
                                              <p>
                                                {lang == "ar"
                                                  ? "شارع عبدالله سليمان منطقة المطار القديم 1"
                                                  : "Abdullah Sulaiman Street Old Airport Area, 1"}
                                              </p>
                                              <a
                                                href=""
                                                className="text-[#004B7A] text-xs"
                                              >
                                                983629347
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </Disclosure.Panel>
                                    </>
                                  )}
                                </Disclosure>
                              </div>
                              <div className="border border-[#20831E] rounded-md mt-2">
                                <div className="flex justify-between gap-4 items-center p-3">
                                  <div className="flex gap-2">
                                    <img
                                      src="https://cdn-icons-png.flaticon.com/512/726/726498.png"
                                      alt="warehouse"
                                      height="20"
                                      width="20"
                                    />
                                    <h6 className="text-xs font-semibold">
                                      Jeddah - Old Airport
                                    </h6>
                                    <span className="border border-[#20831E] text-[#20831E] p-1 rounded text-[9px] font-semibold">
                                      {lang == "ar"
                                        ? "في الأوراق المالية"
                                        : "IN STOCK"}
                                    </span>
                                  </div>
                                  <div className="flex gap-x-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      x="0px"
                                      y="0px"
                                      width="20"
                                      height="20"
                                      viewBox="0,0,256,256"
                                    >
                                      <g
                                        fill="none"
                                        fillRule="nonzero"
                                        stroke="none"
                                        strokeWidth="1"
                                        strokeLinecap="butt"
                                        strokeLinejoin="miter"
                                        stroke-miterlimit="10"
                                        stroke-dasharray=""
                                        stroke-dashoffset="0"
                                        font-family="none"
                                        font-weight="none"
                                        font-size="none"
                                        text-anchor="none"
                                        style={{ mixBlendMode: "normal" }}
                                      >
                                        <g transform="scale(5.33333,5.33333)">
                                          <path
                                            d="M44,24c0,11.045 -8.955,20 -20,20c-11.045,0 -20,-8.955 -20,-20c0,-11.045 8.955,-20 20,-20c11.045,0 20,8.955 20,20z"
                                            fill="#c8e6c9"
                                          ></path>
                                          <path
                                            d="M34.586,14.586l-13.57,13.586l-5.602,-5.586l-2.828,2.828l8.434,8.414l16.395,-16.414z"
                                            fill="#4caf50"
                                          ></path>
                                        </g>
                                      </g>
                                    </svg>
                                    <h6 className="text-sm font-semibold text-[#20831E]">
                                      {lang == "ar" ? "يختار" : "Select"}
                                    </h6>
                                  </div>
                                </div>
                                <p className="text-xs px-3 mb-2.5">
                                  {lang == "ar"
                                    ? "شارع عبدالله سليمان منطقة المطار القديم 1"
                                    : "Abdullah Sulaiman Street Old Airport Area, 1"}
                                </p>
                                <Disclosure>
                                  {({ open }) => (
                                    <>
                                      <Disclosure.Button className="tc__311mainDisclosureBtn">
                                        <div className="flex gap-x-1 justify-start items-center">
                                          <span className="bg-[#20831E] h-2 w-2 rounded-full"></span>
                                          <p>
                                            {lang == "ar" ? "يفتح" : "Open"}
                                          </p>
                                        </div>
                                        <div className="flex gap-x-1.5 justify-start items-center">
                                          <p className="text-[#004B7A]">
                                            {lang == "ar"
                                              ? "تفاصيل"
                                              : "Details"}
                                          </p>
                                          <svg
                                            height="14"
                                            viewBox="0 0 24 24"
                                            width="14"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`${open ? "-rotate-180" : ""
                                              } tc__311mainDisclosureBtnSvg`}
                                          >
                                            <path
                                              clipRule="evenodd"
                                              d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z"
                                              fillRule="evenodd"
                                            ></path>
                                          </svg>
                                        </div>
                                      </Disclosure.Button>
                                      <Disclosure.Panel className="tc__311mainDisclosurePanel m-0">
                                        <div className="bg-[#EEF8FC] p-3">
                                          <div className="flex gap-2 justify-start items-start">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              x="0px"
                                              y="0px"
                                              width="14"
                                              height="14"
                                              viewBox="0 0 50 50"
                                            >
                                              <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 37.039062 10.990234 A 1.0001 1.0001 0 0 0 36.265625 11.322266 L 26.183594 22.244141 A 3 3 0 0 0 25 22 A 3 3 0 0 0 22 25 A 3 3 0 0 0 25 28 A 3 3 0 0 0 25.5 27.958984 L 29.125 34.486328 A 1.0010694 1.0010694 0 1 0 30.875 33.513672 L 27.246094 26.984375 A 3 3 0 0 0 28 25 A 3 3 0 0 0 27.652344 23.599609 L 37.734375 12.677734 A 1.0001 1.0001 0 0 0 37.039062 10.990234 z"></path>
                                            </svg>
                                            <div className="text-[#53616A] text-[10px]">
                                              <h6 className="p-0 text-xs mb-1">
                                                {lang == "ar"
                                                  ? "ساعات العمل"
                                                  : "Business hours"}
                                              </h6>
                                              <p>
                                                {lang == "ar"
                                                  ? "من السبت إلى الخميس"
                                                  : "Saturday to Thursday"}
                                              </p>
                                              <p>09:00 am - 11:59 pm</p>
                                            </div>
                                          </div>
                                          <hr className="my-4 opcaity-5" />
                                          <div className="flex gap-2 justify-start items-start">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              x="0px"
                                              y="0px"
                                              width="14"
                                              height="14"
                                              viewBox="0 0 50 50"
                                            >
                                              <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 37.039062 10.990234 A 1.0001 1.0001 0 0 0 36.265625 11.322266 L 26.183594 22.244141 A 3 3 0 0 0 25 22 A 3 3 0 0 0 22 25 A 3 3 0 0 0 25 28 A 3 3 0 0 0 25.5 27.958984 L 29.125 34.486328 A 1.0010694 1.0010694 0 1 0 30.875 33.513672 L 27.246094 26.984375 A 3 3 0 0 0 28 25 A 3 3 0 0 0 27.652344 23.599609 L 37.734375 12.677734 A 1.0001 1.0001 0 0 0 37.039062 10.990234 z"></path>
                                            </svg>
                                            <div className="text-[#53616A] text-[10px]">
                                              <h6 className="p-0 text-xs mb-1">
                                                {lang == "ar"
                                                  ? "ساعات العمل المسائية"
                                                  : "Evening Working Hours"}
                                              </h6>
                                              <p>
                                                {lang == "ar"
                                                  ? "ساعات العمل المسائية"
                                                  : "friday 04:30 PM - 11:59 PM"}
                                              </p>
                                            </div>
                                          </div>
                                          <hr className="my-4 opcaity-5" />
                                          <div className="flex gap-2 justify-start items-start">
                                            <svg
                                              width="14"
                                              height="14"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M4 10.1433C4 5.64588 7.58172 2 12 2C16.4183 2 20 5.64588 20 10.1433C20 14.6055 17.4467 19.8124 13.4629 21.6744C12.5343 22.1085 11.4657 22.1085 10.5371 21.6744C6.55332 19.8124 4 14.6055 4 10.1433Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                              />
                                              <circle
                                                cx="12"
                                                cy="10"
                                                r="3"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                              />
                                            </svg>
                                            <div className="text-[#53616A] text-[10px]">
                                              <h6 className="p-0 text-xs mb-1">
                                                {lang == "ar"
                                                  ? "ساعات العمل المسائية"
                                                  : "Address"}
                                              </h6>
                                              <p>
                                                {lang == "ar"
                                                  ? "شارع عبدالله سليمان منطقة المطار القديم 1"
                                                  : "Abdullah Sulaiman Street Old Airport Area, 1"}
                                              </p>
                                              <a
                                                href=""
                                                className="text-[#004B7A] text-xs"
                                              >
                                                {lang == "ar"
                                                  ? "ساعات العمل المسائية"
                                                  : "Get Direction"}
                                              </a>
                                            </div>
                                          </div>
                                          <hr className="my-4 opcaity-5" />
                                          <div className="flex gap-2 justify-start items-start">
                                            <svg
                                              width="14"
                                              height="14"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M16.1007 13.359L16.5562 12.9062C17.1858 12.2801 18.1672 12.1515 18.9728 12.5894L20.8833 13.628C22.1102 14.2949 22.3806 15.9295 21.4217 16.883L20.0011 18.2954C19.6399 18.6546 19.1917 18.9171 18.6763 18.9651M4.00289 5.74561C3.96765 5.12559 4.25823 4.56668 4.69185 4.13552L6.26145 2.57483C7.13596 1.70529 8.61028 1.83992 9.37326 2.85908L10.6342 4.54348C11.2507 5.36691 11.1841 6.49484 10.4775 7.19738L10.1907 7.48257"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                              />
                                              <path
                                                d="M18.6763 18.9651C17.0469 19.117 13.0622 18.9492 8.8154 14.7266C4.81076 10.7447 4.09308 7.33182 4.00293 5.74561"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                              />
                                              <path
                                                d="M16.1007 13.3589C16.1007 13.3589 15.0181 14.4353 12.0631 11.4971C9.10807 8.55886 10.1907 7.48242 10.1907 7.48242"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                              />
                                            </svg>
                                            <div className="text-[#53616A] text-[10px]">
                                              <h6 className="p-0 text-xs mb-1">
                                                {lang == "ar"
                                                  ? "اتصل بالمتجر"
                                                  : "Contact the store"}
                                              </h6>
                                              <p>
                                                {lang == "ar"
                                                  ? "شارع عبدالله سليمان منطقة المطار القديم 1"
                                                  : "Abdullah Sulaiman Street Old Airport Area, 1"}
                                              </p>
                                              <a
                                                href=""
                                                className="text-[#004B7A] text-xs"
                                              >
                                                983629347
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </Disclosure.Panel>
                                    </>
                                  )}
                                </Disclosure>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
      <Transition appear show={searchPop} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40"
          onClose={() => setSearchPop(false)}
        >
          <div className="fixed inset-0 overflow-y-auto">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom={isArabic ? "translate-x-full" : "-translate-x-full"}
              enterTo={isArabic ? "-translate-x-0" : "translate-x-0"}
              leave="transition ease-in-out duration-300 transform"
              leaveFrom={isArabic ? "-translate-x-0" : "translate-x-0"}
              leaveTo={isArabic ? "translate-x-full" : "-translate-x-full"}
            >
              <Dialog.Panel className="w-full h-screen container transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all">
                <div className="align__center py-3.5 border-b mb-3 border-[#9CA4AB50]">
                  <Dialog.Title
                    as="h4"
                    className="text-lg font-bold leading-6 text-gray-900"
                  >
                    {isArabic ? "البحث" : "Search Here ..."}
                  </Dialog.Title>
                  <button
                    onClick={() => setSearchPop(false)}
                    className="focus-visible:outline-none"
                  >
                    <CloseIcon size={16} color="#000000" />
                  </button>
                </div>
                <div
                  className="border rounded px-2 flex items-center border-[#004B7A] focus::border-[#000] h-10 gap-2 relative z-20 bg-white"
                  onChange={(e: any) => SearchData(e.target.value)}
                >
                  <input
                    id="productSearch"
                    type="text"
                    name="shipping-charge"
                    className="form-input focus-visible:outline-none focus:ring-transparent text-sm h-9 border-none w-full"
                    value={searchInput}
                    placeholder={isArabic ? "البحث" : "Search Here ..."}
                    onChange={(e: any) => {
                      setSearchInput(e.target.value);
                    }}
                    onPaste={(e: any) => {
                      const pastedText = e.clipboardData.getData("text");
                      setSearchInput(e.target.value);
                      SearchData(pastedText);
                    }}
                  />
                  <button
                    className={`focus-visible:outline-none underline text-xs text-[#DC4E4E] font-semibold ${searchInput?.length ? "block" : "hidden"
                      }`}
                    onClick={() => {
                      setSearchInput(""), setSearchResult([]);
                    }}
                  >
                    {isArabic ? "مسح" : "Clear"}
                  </button>
                </div>
                <div className="overflow-y-auto h-screen pb-40 mt-4">
                  <div className="mb-6 flex flex-wrap gap-2">
                    {searchResult?.cats?.map((d: any, i: any) => (
                      <button
                        key={i}
                        onClick={() => {
                          router.push(`/${lang}/category/${d?.slug}`);
                          router.refresh();
                        }}
                        className="text-[#5D686F] text-xs font-medium bg-[#F0F5FA] py-2 px-3.5 rounded-full hover:bg-[#004B7A] hover:text-white"
                      >
                        {isArabic ? d.name_arabic : d.name}
                      </button>
                    ))}
                    {searchResult?.brands?.map((d: any, i: any) => (
                      <button
                        key={i}
                        onClick={() => {
                          router.push(`/${lang}/brand/${d?.slug}`);
                          router.refresh();
                        }}
                        className="text-[#5D686F] text-xs font-medium bg-[#F0F5FA] py-2 px-3.5 rounded-full hover:bg-[#004B7A] hover:text-white"
                      >
                        {isArabic ? d.name_arabic : d.name}
                      </button>
                    ))}
                  </div>
                  {searchResult?.cats?.length ? (
                    <div className="mb-4">
                      <h2 className="heading__bsm">
                        {isArabic ? "فئات ذات صلة" : "Related Categories"}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3">
                        {searchResult?.cats?.map((d: any, i: any) => (
                          <Link
                            key={i}
                            href={`${origin}/${lang}/category/${d.slug}`}
                            onClick={() => {
                              setSearchDialoug(false), setSearchInput("");
                            }}
                            className="bg-[#F0F5FA] border border-[#D9D9D920] flex items-center gap-2 p-2.5 text-xs rounded-md hover:border-[#004B7A] hover:text-[#004B7A] hover:bg-white font-semibold"
                          >
                            <Image
                              src={
                                d?.image_link_app
                                  ? d?.image_link_app
                                  : "https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png"
                              }
                              height={18}
                              width={18}
                              alt={isArabic ? d?.name_arabic : d?.name}
                              quality={100}
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                            />
                            {isArabic ? d.name_arabic : d.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {searchResult?.brands?.length ? (
                    <div className="mb-4">
                      <h2 className="heading__bsm">
                        {isArabic ? "العلامة التجارية" : "Brands"}
                      </h2>
                      <div className="grid grid-cols-4 gap-3">
                        {searchResult?.brands?.map((data: any) => {
                          return (
                            <Link
                              key={data?.id}
                              href={`${origin}/${lang}/brand/${data?.slug}`}
                              onClick={() => {
                                setSearchDialoug(false), setSearchInput("");
                              }}
                              className="py-2 rounded shadow-md transition-shadow duration-300 ease-in-out border border-[#9CA4AB50]"
                            >
                              {data?.brand_media_image?.image ? (
                                <Image
                                  src={`${NewMedia}${data?.brand_media_image?.image}`}
                                  alt={`${isArabic ? data?.name_arabic : data?.name
                                    }-${data?.id + 17}`}
                                  title={
                                    isArabic ? data?.name_arabic : data?.name
                                  }
                                  loading="lazy"
                                  width={60}
                                  quality={100}
                                  height={50}
                                  className="mx-auto"
                                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                                />
                              ) : null}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {searchResult?.products?.length == 0 && searchInput != "" ? (
                    <div className={`w-full heading__bsm`}>
                      {isArabic ? "قائمة المنتجات" : "no products found!"}
                    </div>
                  ) : null}
                  {searchResult?.products?.length ? (
                    <div className={`w-full`}>
                      <h2 className="heading__bsm">
                        {isArabic ? "العلامة التجارية" : "Products"}
                      </h2>
                      <div className="grid grid-cols-1 gap-y-4 pb-16">
                        <ProductLoop
                          productData={searchResult?.products}
                          lang={isArabic}
                          isMobileOrTablet={isMobileOrTablet}
                          origin={origin}
                          NewMedia={NewMedia}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
