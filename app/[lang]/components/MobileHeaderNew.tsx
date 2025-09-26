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
import GlobalContext from "../GlobalContext";
import { getAllCityData, getHeaderMenuData, getOnlyCityData, getSearchData } from "@/lib/components/component.client";
const ProductLoop = dynamic(() => import("./NewHomePageComp/ProductLoop"), { ssr: false });

export default function MobileHeaderNew(props:any) {
  const NewMedia = props?.NewMedia;
  const lang = props?.lang
  const deviceType = props?.deviceType
  const city = props?.city
  const origin = props?.origin
  const slugStr = props?.slugStr
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
  const [searchInput, setSearchInput] = useState<any>(null);
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
      const getData = await getSearchData(e, searchcity, lang)
      if(getData?.getUserSearchData){
        setSearchResult(getData?.getUserSearchData)
      }
    }
  };

  useEffect(() => {
    DataLocalStorage();
  }, [updateCart]);

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
        updateCity()
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
    setcitiesData(dataCities?.allCitiesData?.cities)
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
      return false;
    }
    setCityData(selectedCityData);
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
    const getData = await getOnlyCityData(sCty, lang)
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

        <button onClick={() => setWhatsappBtn(true)} className={`WhatsappBeforeHover ${whatsappBtn ? "hidden" : "flex"}`}>
          <svg
            height={14}
            viewBox="0 0 24 24"
            width={14}
            xmlns="http://www.w3.org/2000/svg"
            id="fi_10486749"
            className="fill-[#54AB60] transform transition duration-150 ease-in-out rotate-90"
          >
            <path
              clipRule="evenodd"
              d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z"
              fillRule="evenodd"
            ></path>
          </svg>
        </button>
        <div className={`whatsappLayout ${whatsappBtn ? "flex" : "hidden"}`}>
          <Link href="https://wa.me/9668002444464" aria-label="" target="_blank" prefetch={false} scroll={false} rel="noopener noreferrer">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <g opacity="0.8">
                <rect width="25" height="25" transform="translate(0.75 0.5)" fill="url(#pattern0_579_2464)" />
              </g>
              <defs>
                <pattern id="pattern0_579_2464" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlinkHref="#image0_579_2464" transform="scale(0.0125)" />
                </pattern>
                <image id="image0_579_2464" width="80" height="80" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
              </defs>
            </svg>
          </Link>
        </div>

        <div className="container">
          <div className="header_top flex items-center gap-x-4 mb-4">
            <Link
              prefetch={false}
              scroll={false}
              href={`${origin}/${lang}`}
              className="logo"
            >
              <svg
                width="57"
                height="40"
                viewBox="0 0 57 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M52.4652 13.3444L32.363 1.19779C29.6908 -0.417697 26.3354 -0.397377 23.681 1.24859L4.19864 13.3317C1.75255 14.8482 0.266602 17.5203 0.266602 20.3982V31.6863C0.266602 36.2788 3.98781 40 8.58027 40H48.1648C52.7573 40 56.4785 36.2788 56.4785 31.6863V20.4617C56.4785 17.5508 54.957 14.8507 52.4652 13.347V13.3444ZM53.3821 22.443C53.2297 24.1525 52.3966 25.674 51.1596 26.7687C49.9226 27.8661 48.2791 28.5239 46.5011 28.5239H42.1042L42.0458 36.8452C42.0458 37.4447 41.6724 37.9832 41.1237 38.2042C41.078 38.227 41.0247 38.2448 40.9713 38.2626L40.9307 38.2753L39.3914 38.2626C39.333 38.2448 39.2796 38.227 39.2288 38.2042C39.1831 38.1864 39.1425 38.1686 39.1018 38.1407C38.9799 38.0822 38.8732 38.001 38.7818 37.9121C38.4973 37.6377 38.3271 37.2593 38.3271 36.8452L38.3855 24.8383L38.7056 24.8027H46.717C47.545 24.8027 48.3426 24.4471 48.9091 23.835C49.4806 23.2101 49.7498 22.3998 49.6736 21.554C49.539 20.0375 48.1699 18.8589 46.5493 18.8589H9.93159C9.10353 18.8589 8.30594 19.2019 7.73951 19.8216C7.16799 20.4465 6.89366 21.2619 6.96986 22.1026C7.10957 23.614 8.48629 24.8027 10.1018 24.8027H34.423L34.4509 25.1304L34.4636 31.8362C34.4636 34.5592 32.7389 36.9672 30.2776 37.9121C29.8585 38.0746 29.4089 38.1965 28.9491 38.2677L25.52 38.2727L25.4743 38.255C25.4337 38.2372 25.393 38.227 25.3575 38.2016C24.8393 37.9679 24.4938 37.4447 24.4938 36.8605V36.1035C24.4938 35.2932 25.1593 34.6227 25.9696 34.6227H27.9585C29.4978 34.6227 30.745 33.3755 30.745 31.8362V28.5239H9.93159C8.05956 28.5239 6.25864 27.7314 4.99368 26.342C3.71094 24.9424 3.09879 23.111 3.26897 21.2238C3.57124 17.8074 6.59901 15.1428 10.15 15.1428H46.7221C48.5941 15.1428 50.395 15.9302 51.66 17.3171C52.9427 18.7218 53.5549 20.5481 53.3847 22.443H53.3821ZM19.2334 21.7343C19.2334 22.6741 18.4688 23.4362 17.5315 23.4362C16.5942 23.4362 15.8297 22.6716 15.8297 21.7343C15.8297 20.797 16.5942 20.0325 17.5315 20.0325C18.4688 20.0325 19.2334 20.797 19.2334 21.7343ZM14.7146 21.7343C14.7146 22.6741 13.95 23.4362 13.0127 23.4362C12.0754 23.4362 11.3109 22.6716 11.3109 21.7343C11.3109 20.797 12.0754 20.0325 13.0127 20.0325C13.95 20.0325 14.7146 20.797 14.7146 21.7343Z"
                  fill="#004B7A"
                />
              </svg>
            </Link>
            <div className="searchBox flex items-center gap-x-2 bg-white px-4 py-[9px] border-[1px] rounded-lg border-[#5D686F] basis-full">
              <div className="flex items-center gap-x-2">
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_171_61057)">
                    <path
                      d="M19.1227 14.8625L14.5356 10.8831C15.7856 9.55687 16.4003 7.86453 16.2523 6.15618C16.1043 4.44783 15.2051 2.85416 13.7407 1.70482C12.2762 0.55548 10.3585 -0.0615992 8.38433 -0.018778C6.41011 0.0240432 4.53039 0.723488 3.13398 1.93488C1.73756 3.14627 0.931286 4.77693 0.881924 6.48957C0.832562 8.2022 1.54389 9.86578 2.86878 11.1362C4.19366 12.4066 6.03074 13.1867 8.00002 13.315C9.9693 13.4434 11.9201 12.9102 13.449 11.8258L18.0361 15.8051C18.181 15.9266 18.3751 15.9938 18.5766 15.9923C18.7781 15.9907 18.9709 15.9206 19.1134 15.797C19.2558 15.6734 19.3367 15.5062 19.3384 15.3314C19.3402 15.1566 19.2627 14.9882 19.1227 14.8625ZM8.58902 12.0005C7.37308 12.0005 6.18444 11.6877 5.17342 11.1016C4.1624 10.5156 3.3744 9.68266 2.90908 8.70812C2.44376 7.73358 2.32201 6.66122 2.55923 5.62666C2.79645 4.59209 3.38198 3.64178 4.24178 2.8959C5.10158 2.15002 6.19704 1.64207 7.38962 1.43628C8.5822 1.2305 9.81834 1.33611 10.9417 1.73978C12.0651 2.14345 13.0253 2.82704 13.7008 3.7041C14.3764 4.58116 14.7369 5.61231 14.7369 6.66714C14.7351 8.08114 14.0868 9.43677 12.9342 10.4366C11.7817 11.4365 10.219 11.9989 8.58902 12.0005Z"
                      fill="#004B7A"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_171_61057">
                      <rect
                        width="18.4438"
                        height="16"
                        fill="white"
                        transform="translate(0.904297)"
                      />
                    </clipPath>
                  </defs>
                </svg>
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
            <div className="Icons flex items-center gap-x-5">
              <Link
                prefetch={false}
                scroll={false}
                href={`${origin}/${lang}/cart`}
                className="cart_icon relative"
              >
                {cartCount > 0 ? (
                  <span className="badge absolute left-4 -top-3 bg-danger rounded-full bg-orange text-[10px] text-white h-5 w-5 flex justify-center items-center">
                    {cartCount}
                  </span>
                ) : null}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_180_655)">
                    <path
                      d="M1.40973 1.71429H1.21945C0.748018 1.71429 0.362305 1.32857 0.362305 0.857143C0.362305 0.385714 0.748018 0 1.21945 0H2.93373C3.40516 0 3.79088 0.385714 3.79088 0.857143C3.79088 1.21286 3.57145 1.51886 3.26202 1.64829L3.49945 2.57143H21.6194C23.128 2.57143 24.3623 3.79886 24.3623 5.35971L23.9166 12.6411C23.788 14.7986 21.7566 15.9326 19.9309 16.0774L7.21773 17.0794C7.24173 17.4874 6.95802 17.8749 6.5303 17.9751C6.04002 18.0874 5.54973 17.8097 5.43145 17.3409L4.51945 13.7974C3.60402 14.0837 2.92259 15.0737 2.92259 16.1871V16.2857C2.92259 17.664 3.95459 18.8571 5.18116 18.8571H23.5052C23.974 18.8571 24.3623 19.1846 24.3623 19.6766C24.3623 20.1686 23.9792 20.5714 23.5103 20.5714H21.3623C21.7033 20.5714 22.0303 20.7069 22.2714 20.948C22.5126 21.1891 22.648 21.5161 22.648 21.8571C22.648 22.1981 22.5126 22.5252 22.2714 22.7663C22.0303 23.0074 21.7033 23.1429 21.3623 23.1429C21.0213 23.1429 20.6943 23.0074 20.4532 22.7663C20.212 22.5252 20.0766 22.1981 20.0766 21.8571C20.0766 21.5161 20.212 21.1891 20.4532 20.948C20.6943 20.7069 21.0213 20.5714 21.3623 20.5714H5.93373C6.27472 20.5714 6.60175 20.7069 6.84287 20.948C7.08399 21.1891 7.21945 21.5161 7.21945 21.8571C7.21945 22.1981 7.08399 22.5252 6.84287 22.7663C6.60175 23.0074 6.27472 23.1429 5.93373 23.1429C5.59274 23.1429 5.26571 23.0074 5.0246 22.7663C4.78348 22.5252 4.64802 22.1981 4.64802 21.8571C4.64802 21.5161 4.78348 21.1891 5.0246 20.948C5.26571 20.7069 5.59274 20.5714 5.93373 20.5714H5.14602C2.98259 20.5714 1.21945 18.648 1.21945 16.2857V16.1871C1.21945 14.2431 2.44002 12.6043 4.09173 12.1346L1.40973 1.71429ZM7.54859 11.1429H8.93373V7.71429H6.70088L7.54859 11.1429ZM6.48916 6.85714H8.93373V4.29171L7.2623 4.29343C6.5423 4.29343 6.01945 4.95857 6.19088 5.64943L6.48916 6.85714ZM9.79088 4.29086V6.85714H13.5452V4.28571L9.79088 4.29086ZM14.4023 4.28486V6.85714H18.3452V4.28057L14.4023 4.28486ZM19.2023 4.27971V6.85714H22.5529L22.648 5.30829C22.648 4.73743 22.1852 4.27629 21.6109 4.27629L19.2023 4.27971ZM22.4997 7.71429H19.2023V11.1429H22.288L22.4997 7.71429ZM22.2357 12H19.2023V14.4257L19.7852 14.3803C20.9337 14.286 22.1337 13.6303 22.2023 12.5383L22.2357 12ZM18.3452 14.4943V12H14.4023V14.8046L18.3452 14.4943ZM13.5452 14.8714V12H9.79088V15.1029C9.79088 15.1251 9.78916 15.1469 9.78573 15.168L13.5452 14.8714ZM8.93373 15.0857V12H7.76031L8.3423 14.3546C8.38053 14.5127 8.45342 14.6603 8.55571 14.7867C8.658 14.9132 8.78712 15.0153 8.93373 15.0857ZM13.5452 7.71429H9.79088V11.1429H13.5452V7.71429ZM18.3452 7.71429H14.4023V11.1429H18.3452V7.71429Z"
                      fill="#004B7A"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_180_655">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="matrix(-1 0 0 1 24 0)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
              <Link
                prefetch={false}
                scroll={false}
                href={`${origin}/${lang}/notifications`}
                className="bell_icon"
              >
                <svg
                  width="29"
                  height="29"
                  viewBox="0 0 29 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.8609 20.9634L20.4664 19.5427C20.2714 19.3444 20.164 19.0819 20.164 18.8039V14.5078C20.164 11.04 17.8489 8.10328 14.683 7.16109C14.7115 7.01859 14.7265 6.87281 14.7265 6.72656C14.7265 5.49891 13.7276 4.5 12.5 4.5C11.2723 4.5 10.2734 5.49891 10.2734 6.72656C10.2734 6.87422 10.288 7.01953 10.3156 7.16156C7.15061 8.10422 4.83592 11.0405 4.83592 14.5078V18.8039C4.83592 19.0819 4.72858 19.3444 4.53358 19.5427L3.13905 20.9634C2.36467 21.7519 2.14905 22.875 2.57702 23.8945C3.00452 24.9136 3.95702 25.5469 5.06233 25.5469H9.1728C9.37061 27.2077 10.7867 28.5 12.5 28.5C14.2133 28.5 15.6294 27.2077 15.8272 25.5469H19.9376C21.043 25.5469 21.9955 24.9136 22.423 23.8945C22.8509 22.875 22.6353 21.7519 21.8609 20.9634ZM11.914 6.72656C11.914 6.40359 12.177 6.14062 12.5 6.14062C12.823 6.14062 13.0859 6.40359 13.0859 6.72656C13.0859 6.77719 13.0794 6.82266 13.069 6.86484C12.8811 6.85125 12.6912 6.84375 12.5 6.84375C12.3087 6.84375 12.1189 6.85125 11.9309 6.86484C11.9206 6.82313 11.914 6.77719 11.914 6.72656ZM12.5 26.8594C11.6937 26.8594 11.0164 26.2987 10.8364 25.5469H14.1636C13.9836 26.2987 13.3062 26.8594 12.5 26.8594ZM20.9103 23.2598C20.8465 23.4117 20.5883 23.9062 19.9376 23.9062H5.06233C4.4117 23.9062 4.15342 23.4112 4.08967 23.2598C4.02592 23.108 3.85389 22.5773 4.30952 22.1128L5.70452 20.692C6.20233 20.1848 6.47655 19.5145 6.47655 18.8039V14.5078C6.47655 11.1867 9.17842 8.48438 12.5 8.48438C15.8215 8.48438 18.5234 11.1867 18.5234 14.5078V18.8039C18.5234 19.5145 18.7976 20.1848 19.2955 20.692L20.6905 22.1128C21.1461 22.5769 20.974 23.108 20.9103 23.2598Z"
                    fill="#004B7A"
                  />
                  <rect
                    x="13.9405"
                    y="1.62016"
                    width="13.44"
                    height="13.44"
                    rx="6.72"
                    fill="#FF7B34"
                    stroke="white"
                    strokeWidth="1.92"
                  />
                </svg>
              </Link>
            </div>
            <div className="location_wrapper basis-full flex items-center justify-start gap-x-2 text-sm">
              <div className="location_icon">
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.94398 15.2809L11.399 11.8267C12.0822 11.1433 12.5474 10.2728 12.7359 9.32507C12.9243 8.37736 12.8275 7.39505 12.4577 6.50235C12.0879 5.60965 11.4617 4.84666 10.6582 4.30984C9.85481 3.77303 8.91024 3.48651 7.94398 3.48651C6.97771 3.48651 6.03314 3.77303 5.2297 4.30984C4.42627 4.84666 3.80006 5.60965 3.43024 6.50235C3.06043 7.39505 2.96363 8.37736 3.15208 9.32507C3.34053 10.2728 3.80577 11.1433 4.48896 11.8267L7.94398 15.2809ZM12.5504 12.9781L7.94398 17.5845L3.33756 12.9781C2.42656 12.067 1.80616 10.9063 1.55484 9.64263C1.30351 8.37899 1.43253 7.0692 1.92559 5.87889C2.41865 4.68858 3.25361 3.67121 4.32487 2.95542C5.39613 2.23964 6.65559 1.85759 7.94398 1.85759C9.23237 1.85759 10.4918 2.23964 11.5631 2.95542C12.6343 3.67121 13.4693 4.68858 13.9624 5.87889C14.4554 7.0692 14.5844 8.37899 14.3331 9.64263C14.0818 10.9063 13.4614 12.067 12.5504 12.9781ZM2.24398 18.1431H13.644V19.7716H2.24398V18.1431Z"
                    fill="#004B7A"
                  />
                  <circle cx="8" cy="8.00017" r="1" fill="#004B7A" />
                </svg>
              </div>
              <div className="location_text max-w-38">
                <div
                  className="flex ltr:flex-row rtl:flex-row-reverse ltr:justify-start rtl:justify-end items-center space-x-2"
                  onClick={() => {
                    getCitiesData();
                    setCityList(true);
                  }}
                >
                  <span className="text-[13px] text-[#606060] line-clamp-1">
                    {" "}
                    {cityData}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1712 11.3997L6.91406 8.14258H13.4283L10.1712 11.3997Z"
                      fill="#606060"
                    />
                  </svg>
                </div>
                {fullAddress ? (
                  <div className="text-[#101010] text-[10px] font-semibold max-w-38 line-clamp-1">
                    {fullAddress}
                  </div>
                ) : null}
              </div>
            </div>
            <button
              className="hamburger_icon"
              onClick={() => {
                getMenu();
                setAppDrawer(true);
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 16H22.6667"
                  stroke="#004B7A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 8H28"
                  stroke="#004B7A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 24H14.6667"
                  stroke="#004B7A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
              leaveFrom={
                lang === "ar" ? "-translate-x-0" : "translate-x-0"
              }
              leaveTo={
                lang === "ar" ? "translate-x-full" : "-translate-x-full"
              }
            >
              <Dialog.Panel className="w-80 h-[-webkit-fill-available] ltr:mr-auto rtl:ml-auto transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all">
                <div className="py-3.5 border-b mb-3 border-[#9CA4AB50]">
                  <div className="container align__center ">
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
                      <svg
                        height="16"
                        viewBox="0 0 329.26933 329"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                        id="fi_1828778"
                      >
                        <path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto h-[-webkit-fill-available] pb-40 mt-4">
                  {/* SubCategories */}
                  {menuData?.map((data: any, i: number) => (
                    <>
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
                            {lang === "ar"
                              ? data?.name_arabic
                              : data?.name}
                          </label>
                        </div>
                        {data?.child.length ? (
                          <>
                            {parentCategory == data.id ? (
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
                      </button>
                      {data?.child.length ? (
                        <>
                          {/* SubSubCategories */}
                          {data?.child?.map((childcatgeory: any, i: number) => (
                            <>
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
                                            lang === "ar"
                                              ? ""
                                              : "rotate-180"
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
                                      <>
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
                                      </>
                                    )
                                  )}
                                </>
                              ) : null}
                            </>
                          ))}
                        </>
                      ) : null}
                    </>
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
            enterFrom={
              lang === "ar" ? "-translate-y-full" : "translate-y-full"
            } // Start from bottom for 'ar', top for others
            enterTo="translate-y-0" // Transition to center
          >
            <div className="fixed inset-0 overflow-y-auto">
              <Dialog.Panel className="w-full h-[-webkit-fill-available] transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all">
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
                    <svg
                      height="16"
                      viewBox="0 0 329.26933 329"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                      id="fi_1828778"
                    >
                      <path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"></path>
                    </svg>
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
                      {/* <Tab as={Fragment}>
                                        {({ selected }) => (
                                            <button
                                                className={`${selected ? '!border-primary text-primary !outline-none' : ''
                                                    } flex items-center justify-center border-b-2 text-base border-transparent bg-transparent py-3 before:inline-block hover:border-primary hover:text-primary font-bold w-1/2`}
                                            >
                                                {lang == 'ar' ? 'التوصيل' : 'Store Pickup'}
                                            </button>
                                        )}
                                    </Tab> */}
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
                                lang === "ar"
                                  ? "مدينة البحث"
                                  : "Search City"
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
                                            {checked ? (
                                              <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="h-6 w-6"
                                              >
                                                <circle
                                                  cx={12}
                                                  cy={12}
                                                  r={12}
                                                  fill="#219EBC"
                                                  opacity="0.2"
                                                />
                                                <path
                                                  d="M7 13l3 3 7-7"
                                                  stroke="#219EBC"
                                                  strokeWidth={2}
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                              </svg>
                                            ) : (
                                              <svg
                                                viewBox="0 0 24 24"
                                                fill="#219EBC60"
                                                className="h-6 w-6"
                                              >
                                                <circle
                                                  cx={12}
                                                  cy={12}
                                                  r={12}
                                                  fill="#219EBC60"
                                                  opacity={0.2}
                                                />
                                              </svg>
                                            )}
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
                              {lang === "ar"
                                ? "تغيير المدينة"
                                : "Change City"}
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
                                            {lang == "ar"
                                              ? "يفتح"
                                              : "Open"}
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
                                            {lang == "ar"
                                              ? "يفتح"
                                              : "Open"}
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
              <Dialog.Panel className="w-full h-[-webkit-fill-available] container transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all">
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
                    <svg
                      height="16"
                      viewBox="0 0 329.26933 329"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                      id="fi_1828778"
                    >
                      <path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"></path>
                    </svg>
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
                <div className="overflow-y-auto h-[-webkit-fill-available] pb-40 mt-4">
                  <div className="mb-6 flex flex-wrap gap-2">
                    {searchResult?.cats?.map((d: any, i: any) => (
                      <button
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
                                  src={
                                    `${NewMedia}${data?.brand_media_image?.image}`
                                  }
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
                    <div className={`w-full`}>
                      <h2 className="heading__bsm">
                        {isArabic ? "قائمة المنتجات" : "no products found!"}
                      </h2>
                    </div>
                  ) : null}
                  {searchResult?.products?.length ? (
                    <div className={`w-full`}>
                      <h2 className="heading__bsm">
                        {isArabic ? "العلامة التجارية" : "Products"}
                      </h2>
                      <div className="pb-16">
                        <div className="grid grid-cols-2 gap-x-2 gap-y-10">
                          <ProductLoop
                            productData={searchResult?.products}
                            lang={isArabic}
                            isMobileOrTablet={isMobileOrTablet}
                            origin={origin}
                            NewMedia={NewMedia}
                          />
                        </div>
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
