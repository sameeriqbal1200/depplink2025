"use client"; // This is a client component 👈🏽

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { userAgent } from "next/server";
import { useRouter } from "next/navigation";

// const ProductSliderComponent = dynamic(() => import("@/components/NewHomePageComp/ProductSlider"), { ssr: false });
/* 🔹 Product Components */
const ProductSliderComponent = dynamic(() => import("@/components/NewHomePageComp/ProductSlider"), { ssr: false, loading: () => <div className="h-40 bg-gray-100 animate-pulse" /> });
const BadgeProductSlider = dynamic(() => import("@/components/NewHomePageComp/BadgeProductSlider"), { ssr: false });
const BadgeProductLoopComponent = dynamic(() => import("@/components/NewHomePageComp/BadgeProductLoop"), { ssr: false });
const ProductLoopMobile = dynamic(() => import("@/components/NewHomePageComp/ProductLoopMobile"), { ssr: false });

/* 🔹 Category Components */
const CategoriesHomeMobile = dynamic(() => import("@/components/NewHomePageComp/CategoriesHomeMobile"), { ssr: false, loading: () => <div className="bg-white rounded-lg shadow-md text-center text-primary animate-pulse w-full"><div className="rounded-md bg-dark/10 p-2.5 h-auto w-full" /></div> });

/* 🔹 Slider Components */
const MainSliderMobile = dynamic(() => import("@/components/NewHomePageComp/MainSliderMobile"), { ssr: false });
const TopSectionSlider = dynamic(() => import("@/components/NewHomePageComp/TopSectionSlider"), { ssr: false });
const BrandSlider = dynamic(() => import("@/components/NewHomePageComp/BrandSlider"), { ssr: false });

/* 🔹 Section Components */
const PriceSection = dynamic(() => import("@/components/NewHomePageComp/PriceSection"), { ssr: false });
const Newsletter = dynamic(() => import("@/components/NewHomePageComp/Newsletter"), { ssr: true });

/* 🔹 Layout / Shared Components */
const TamkeenServices = dynamic(() => import("@/components/TamkeenServices"), { ssr: true });
const MobileHeaderNew = dynamic(() => import("@/components/MobileHeaderNew"), { ssr: true });
// const Popup = dynamic(() => import("./components/NewHomePageComp/Popup"), { ssr: true })

import { useApp } from "../_ctx/AppContext";
import {
  getHomePages,
  getLatestCategoryProducts,
} from "@/lib/homepage/homepage.pages";

export default function Homepage() {
  const { lang, deviceType, city, origin, slugStr } = useApp();
  const Media = process.env.NEXT_PUBLIC_MEDIA;
  const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA;
  const NewMedia2 = process.env.NEXT_PUBLIC_NEW_MEDIA2;
  const [homepagepartonelatest, setHomepagePartOneLatest] = useState<any>(null);
  const [homepageparttwolatest, setHomepagePartTwoLatest] = useState<any>(null);
  const [homepagepartthreelatest, setHomepagePartThreeLatest] =
    useState<any>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      console.log("DOM nodes Page:", document.getElementsByTagName("*").length);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Run once initially
    console.log(
      "DOM nodes (initial):",
      document.getElementsByTagName("*").length
    );

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    (async () => {
      const { homepageSectionOne, homepageSectionTwo, homepageSectionThree } =
        await getHomePages(lang, deviceType); // ✅ must await
      setHomepagePartOneLatest(homepageSectionOne);
      setHomepagePartTwoLatest(homepageSectionTwo);
      setHomepagePartThreeLatest(homepageSectionThree);
    })();
  }, []);
  const router = useRouter();
  const isArabic = lang === "ar" ? true : false;
  const containerClass = "container";
  const containerClassMobile = "ltr:pl-4 rtl:pr-4";
  const [sec4SelectedIndex, setSec4SelectedIndex] = useState(0);
  const [sec4SelectedCategory, setSec4SelectedCategory] = useState<any>(null);
  const [sec4SelectedProducts, setSec4SelectedProducts] = useState<any>([]);

  const [sec6SelectedIndex, setSec6SelectedIndex] = useState(0);
  const [sec6SelectedCategory, setSec6SelectedCategory] = useState<any>(null);
  const [sec6SelectedProducts, setSec6SelectedProducts] = useState<any>([]);
  // Add this near your other state variables
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionProductsMap = useRef<Record<string, any[]>>({});
  const [gtmNewItemListId, setgtmNewItemListId] = useState<string | null>(null);
  const [gtmNewItemListName, setgtmNewItemListName] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (homepagepartonelatest?.first_five_sec?.section_four?.length > 0) {
      const firstSection: any =
        homepagepartonelatest.first_five_sec.section_four[0];
      setSec4SelectedCategory(firstSection?.category);
      setSec4SelectedProducts(firstSection?.products || []);
      setSec4SelectedIndex(0);
    }
    if (homepageparttwolatest?.six_eleven_sec?.section_six?.length > 0) {
      const secondSection: any =
        homepageparttwolatest?.six_eleven_sec?.section_six[0];
      setSec6SelectedCategory(secondSection?.category);
      setSec6SelectedProducts(secondSection?.products || []);
      setSec6SelectedIndex(0);
    }
  }, [homepagepartonelatest, homepageparttwolatest]);

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

  useEffect(() => {
    const allProducts: any[] = [];

    // 1. Section One
    const partOne: any = homepagepartonelatest?.first_five_sec;
    // const secFour: any = partOne?.section_four[0]?.products ?? [];

    // 2. Section Two
    // const secSix: any =
    //   homepageparttwolatest?.six_eleven_sec?.section_six[0]?.products || [];
    // const secNine: any =
    //   homepageparttwolatest?.six_eleven_sec?.section_nine?.products?.data || [];
    // const secTen: any =
    //   homepageparttwolatest?.six_eleven_sec?.section_ten?.products?.data || [];

    // 3. Section Three
    const partThree: any = homepagepartthreelatest?.twelve_seventeen_sec || {};
    // const secTwelve: any = partThree?.sec_twelve_products?.products?.data || {};
    // const secFifteen: any =
    //   partThree?.sec_fifteen_products?.products?.data || [];
    // const secSixteen: any =
    //   partThree?.sec_sixteen_products?.products?.data || [];
    // const secSeventeen: any =
    //   partThree?.sec_seventeen_products?.products?.data || [];
    // allProducts.push(...secFour, ...secSix, ...secNine, ...secTen, ...secTwelve, ...secFifteen, ...secSixteen, ...secSeventeen);
    // const uniqueProducts: any = Array.from(new Map(allProducts.map(p => [p.id, p])).values());

    // Push to GTM's dataLayer
    if (typeof window !== "undefined" && window.dataLayer && activeSection) {
      const sectionProducts = sectionProductsMap.current[activeSection] || [];

      if (sectionProducts.length === 0) return;
    }
  }, [activeSection, isArabic, homepagepartonelatest]);

  const [isSection4Visible, setIsSection4Visible] = useState(false);
  const [isSection6NewVisible, setIsSection6NewVisible] = useState(false);
  const handleIntersection = (entry: IntersectionObserverEntry) => {
    const sectionId = entry.target.getAttribute("data-section");
    const sectionIdKey = entry.target.getAttribute("data-section-id");

    // Handle existing visibility states
    if (entry.isIntersecting && sectionId) {
      const id = parseInt(sectionId);

      if (id === 5) setIsSection5Visible(true);
      if (id === 6) setIsSection6Visible(true);
      if (id === 7) setIsSection7Visible(true);
      if (id === 8) setIsSection8Visible(true);
      if (id === 9) setIsSection9Visible(true);
      if (id === 10) setIsSection10Visible(true);
      if (id === 11) setIsSection11Visible(true);
      if (id === 12) setIsSection12Visible(true);
      if (id === 13) setIsSection13Visible(true);
      if (id === 14) setIsSection14Visible(true);
      if (id === 15) setIsSection15Visible(true);
      if (id === 16) setIsSection16Visible(true);
      if (id === 17) setIsSection17Visible(true);
      if (id === 18) setIsSection18Visible(true);

      // Preload next section
      const nextId = id + 1;
      if (nextId === 6) setIsSection6Visible(true);
      if (nextId === 7) setIsSection7Visible(true);
      if (nextId === 8) setIsSection8Visible(true);
      if (nextId === 9) setIsSection9Visible(true);
      if (nextId === 10) setIsSection10Visible(true);
      if (nextId === 11) setIsSection11Visible(true);
      if (nextId === 12) setIsSection12Visible(true);
      if (nextId === 13) setIsSection13Visible(true);
      if (nextId === 14) setIsSection14Visible(true);
      if (nextId === 15) setIsSection15Visible(true);
      if (nextId === 16) setIsSection16Visible(true);
      if (nextId === 17) setIsSection17Visible(true);
      if (nextId === 18) setIsSection18Visible(true);
    }

    // DataLayer tracking
    if (sectionIdKey && entry.intersectionRatio > 0.5) {
      const { sectionName, itemListId, products } =
        getSectionData(sectionIdKey);

      if (products.length > 0 && window.dataLayer) {
        // Clear previous ecommerce object
        window.dataLayer.push({ ecommerce: null });

        // Sum all prices of section products
        const totalPrice = products.reduce(
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
        localStorage.setItem("item_list_id", String(itemListId));
        localStorage.setItem("item_list_name", sectionName);
        setgtmNewItemListId(String(itemListId));
        setgtmNewItemListName(sectionName);
        // Push GTM-compatible event
        window.dataLayer.push({
          event: "view_item_list",
          value: totalPrice,
          currency: "SAR",
          platform: deviceType,
          item_list_name: sectionName,
          item_list_id: String(itemListId),
          ecommerce: {
            items: products.map((item: any, index: number) => {
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
    }
  };

  const observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => handleIntersection(entry));
      },
      { threshold: [0.5], rootMargin: "0px 0px -30% 0px" }
    );

    observerRef.current = observer;

    // Observe all sections
    const allSections = [
      section5Ref,
      section6Ref,
      section7Ref,
      section8Ref,
      section9Ref,
      section10Ref,
      section11Ref,
      section12Ref,
      section14Ref,
      section15Ref,
      section16Ref,
      section17Ref,
      section18Ref,
    ];

    allSections.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    // Observe product sections
    const productSections = [
      "section4",
      "section6",
      "section9",
      "section10",
      "section12",
      "section15",
      "section16",
      "section17",
    ];

    productSections.forEach((sectionId) => {
      const element = document.querySelector(
        `[data-section-id="${sectionId}"]`
      );
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [
    activeSection,
    isArabic,
    homepagepartonelatest,
    homepageparttwolatest,
    sec4SelectedCategory,
    sec6SelectedCategory,
    sec4SelectedProducts,
    sec6SelectedProducts,
  ]);

  const updateCategoryProducts = async (
    rowId: any,
    categoryIndex: any,
    type: any
  ) => {
    try {
      if (type == 1) setIsSection4Visible(true);
      if (type == 2) setIsSection6NewVisible(true);
      const city: any = localStorage.getItem("globalcity") || "Jeddah";
      const response = await getLatestCategoryProducts(type, rowId, city);
      const data: any = response?.latestCategoryData;
      const selectedProducts = data?.[0]?.products || [];
      if (type == 2) {
        setSec6SelectedIndex(categoryIndex);
        setSec6SelectedProducts(selectedProducts);
        setIsSection6NewVisible(false);
        var catName =
          homepageparttwolatest?.six_eleven_sec?.section_six?.filter(
            (item: any) => item?.category?.id == rowId
          )[0];
        setSec6SelectedCategory(catName?.category);
        // Trigger dataLayer push for section6 category change
        setActiveSection("section6");
        // Manually trigger the observer for section6
        const sectionElement = document.querySelector(
          '[data-section-id="section6"]'
        );
        if (sectionElement && observerRef.current) {
          // Create a mock entry
          const mockEntry = {
            target: sectionElement,
            isIntersecting: true,
            intersectionRatio: 1,
            boundingClientRect: sectionElement.getBoundingClientRect(),
            intersectionRect: sectionElement.getBoundingClientRect(),
            rootBounds: null,
            time: performance.now(),
          } as IntersectionObserverEntry;

          handleIntersection(mockEntry);
        }
      } else {
        setSec4SelectedIndex(categoryIndex);
        setSec4SelectedProducts(selectedProducts);
        setIsSection4Visible(false);
        var catName =
          homepagepartonelatest?.first_five_sec?.section_four?.filter(
            (item: any) => item?.category?.id == rowId
          )[0];
        setSec4SelectedCategory(catName?.category);
        // Trigger dataLayer push for section4 category change
        setActiveSection("section4");
        // Manually trigger the observer for section4
        const sectionElement = document.querySelector(
          '[data-section-id="section4"]'
        );
        if (sectionElement && observerRef.current) {
          // Create a mock entry
          const mockEntry = {
            target: sectionElement,
            isIntersecting: true,
            intersectionRatio: 1,
            boundingClientRect: sectionElement.getBoundingClientRect(),
            intersectionRect: sectionElement.getBoundingClientRect(),
            rootBounds: null,
            time: performance.now(),
          } as IntersectionObserverEntry;

          handleIntersection(mockEntry);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsSection4Visible(false);
      setIsSection6NewVisible(false);
    }
  };

  const sec1SliderData: string = homepagepartonelatest?.first_five_sec?.section_one_slider_data?.slider_image || [];
  const sec2SliderTopImage: string = homepagepartonelatest?.first_five_sec?.section_two_slider_top?.slider_image || "";

  const secCategoryData: any = homepagepartonelatest?.first_five_sec || null;
  const sec4Title: string = homepagepartonelatest?.first_five_sec?.sec_four_title || "Section 4";
  const sec5Slider: any = homepagepartonelatest?.first_five_sec?.section_five_slider?.slider_image || "";
  const sec6Title: string = homepageparttwolatest?.six_eleven_sec?.sec_six_title || "Section 6";

  const sec8Link: any = homepageparttwolatest?.six_eleven_sec?.sec_eight_link || "";
  const sec8Image: any = homepageparttwolatest?.six_eleven_sec?.sec_eight_image ? `${NewMedia2}${homepageparttwolatest.six_eleven_sec.sec_eight_image}` : "/images/placeholder.webp";
  const sec8Heading: any = isArabic ? homepageparttwolatest?.six_eleven_sec?.sec_eight_heading || "" : "Fresh Air, Fresh Savings!";
  const sec8Para: any = isArabic ? homepageparttwolatest?.six_eleven_sec?.sec_eight_paragraph || "" : "High Performance Cooling, Low Energy Consumption.";
  const sec8ButtonTitle: any = isArabic ? homepageparttwolatest?.six_eleven_sec?.sec_eight_button_title || "" : "View More";


  const Sec9Heading: any = homepageparttwolatest?.six_eleven_sec?.sec_nine_title || "Tamkeen Exclusive Sales";
  const Sec9ButtonTitle: any = homepageparttwolatest?.six_eleven_sec?.sec_nine_button_title || "View All";
  const Sec9ButtonLink: any = homepageparttwolatest?.six_eleven_sec?.sec_nine_button_link || "";
  const sec9Products: any = homepageparttwolatest?.six_eleven_sec?.section_nine || [];

  const Sec10Heading: any = homepageparttwolatest?.six_eleven_sec?.sec_ten_title || "Tamkeen Exclusive Sales";
  const Sec10ButtonTitle: any = homepageparttwolatest?.six_eleven_sec?.sec_ten_button_title || "View All";
  const Sec10ButtonLink: any = homepageparttwolatest?.six_eleven_sec?.sec_ten_button_link || "";
  const sec10Products: any = homepageparttwolatest?.six_eleven_sec?.section_ten || "";

  const sec11Slider: any = homepageparttwolatest?.six_eleven_sec?.section_eleven?.slider_image || "";

  const Sec12Heading: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_twelve_title || "Tamkeen Exclusive Sales";
  const Sec12ButtonTitle: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_twelve_button_title || "View All";
  const Sec12ButtonLink: any = homepageparttwolatest?.six_eleven_sec?.sec_ten_button_link || "";
  const sec12Products: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_twelve_products || "";

  const sec13BgImage: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_thirteen_bg_image ? `url(${NewMedia2}${homepagepartthreelatest.twelve_seventeen_sec.sec_thirteen_bg_image})` : "none";
  const sec13Link1: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_thirteen_link_one || "";
  const sec13Image1: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_thirteen_image_one ? `${NewMedia2}${homepagepartthreelatest.twelve_seventeen_sec.sec_thirteen_image_one}` : "";
  const sec13Link2: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_thirteen_link_two || "";
  const sec13Image2: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_thirteen_image_two ? `${NewMedia2}${homepagepartthreelatest.twelve_seventeen_sec.sec_thirteen_image_two}` : "";
  const sec13Link3: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_thirteen_link_three || "";
  const sec13Image3: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_thirteen_image_three ? `${NewMedia2}${homepagepartthreelatest.twelve_seventeen_sec.sec_thirteen_image_three}` : "";
  const sec13ButtonLink: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_thirteen_button_link || "";
  const sec13ButtonTitle: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_thirteen_button_title || "View More";
  const sec14Slider: any = homepagepartthreelatest?.twelve_seventeen_sec?.section_fourteen?.slider_image || "";

  // const sec14Heading: any = isArabic ? "اطبخ بأناقة و دقة!" : 'Cook with elegance and precision!';
  // const sec14Paragraph: any = isArabic ? "تسوق الآن افران الطبخ و الأجهزة المدمجة بأفضل الأسعار مع  تخفيضات تمكين الحصرية" : 'Shop now Cooking Ovens and Built-in Appliances at the best prices with Exclusive Tamkeen Sales';
  // const sec14ButtonTitle: any = isArabic ? "عرض المزيد" : 'View More';
  const Sec15Heading: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_fifteen_title || "Tamkeen Exclusive Sales";
  const Sec15ButtonTitle: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_fifteen_button_title || "View All";
  const Sec15ButtonLink: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_fifteen_button_link || "";
  const sec15Products: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_fifteen_products || "";

  const Sec16Heading: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_sixteen_title || "Tamkeen Exclusive Sales";
  const Sec16ButtonTitle: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_sixteen_button_title || "View All";
  const Sec16ButtonLink: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_sixteen_button_link || "";
  const sec16Products: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_sixteen_products || "";

  const Sec17Heading: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_seventeen_title || "Tamkeen Exclusive Sales";
  const Sec17ButtonTitle: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_seventeen_button_title || "View All";
  const Sec17ButtonLink: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_seventeen_button_link || "";
  const sec17Products: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_seventeen_products || "";

  const sec18Heading: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_eighteen_heading || "Cook with elegance and precision!";
  const sec18Paragraph: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_eighteen_sub_heading || "Shop now Cooking Ovens and Built-in Appliances at the best prices with Exclusive Tamkeen Sales";
  const sec18ButtonTitle: any = isArabic ? "عرض المزيد" : "View More";
  const sec18ButtonLink: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_eighteen_button_link || "";
  const sec18Image1: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_eighteen_image_one ? `${NewMedia2}${homepagepartthreelatest.twelve_seventeen_sec.sec_eighteen_image_one}` : "";
  const sec18Link1: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_eighteen_link_one ? `${NewMedia2}${homepagepartthreelatest.twelve_seventeen_sec.sec_eighteen_link_one}` : "";
  const sec18Image2: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_eighteen_image_two ? `${NewMedia2}${homepagepartthreelatest.twelve_seventeen_sec.sec_eighteen_image_two}` : "";
  const sec18Link2: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_eighteen_link_two ? `${NewMedia2}${homepagepartthreelatest.twelve_seventeen_sec.sec_eighteen_link_two}` : "";
  const sec18Image3: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_eighteen_image_three ? `${NewMedia2}${homepagepartthreelatest.twelve_seventeen_sec.sec_eighteen_image_three}` : "";
  const sec18Link3: any = homepagepartthreelatest?.twelve_seventeen_sec?.sec_eighteen_link_three || "";

  const brandHeading: any = isArabic ? "تـصـفـح بالعـلامـات التـجـاريـــة" : "Shop by Brands";
  const brandButtonTitle: any = isArabic ? "عـرض الكــل" : "View All";
  const brandButtonLink: any = "brandslisting";


  // This is for loading on scroll
  const section5Ref = useRef<HTMLDivElement | null>(null);
  const section6Ref = useRef<HTMLDivElement | null>(null);
  const section7Ref = useRef<HTMLDivElement | null>(null);
  const section8Ref = useRef<HTMLDivElement | null>(null);
  const section9Ref = useRef<HTMLDivElement | null>(null);
  const section10Ref = useRef<HTMLDivElement | null>(null);
  const section11Ref = useRef<HTMLDivElement | null>(null);
  const section12Ref = useRef<HTMLDivElement | null>(null);
  const section13Ref = useRef<HTMLDivElement | null>(null);
  const section14Ref = useRef<HTMLDivElement | null>(null);
  const section15Ref = useRef<HTMLDivElement | null>(null);
  const section16Ref = useRef<HTMLDivElement | null>(null);
  const section17Ref = useRef<HTMLDivElement | null>(null);
  const section18Ref = useRef<HTMLDivElement | null>(null);
  const [isSection5Visible, setIsSection5Visible] = useState(false);
  const [isSection6Visible, setIsSection6Visible] = useState(false);
  const [isSection7Visible, setIsSection7Visible] = useState(false);
  const [isSection8Visible, setIsSection8Visible] = useState(false);
  const [isSection9Visible, setIsSection9Visible] = useState(false);
  const [isSection10Visible, setIsSection10Visible] = useState(false);
  const [isSection11Visible, setIsSection11Visible] = useState(false);
  const [isSection12Visible, setIsSection12Visible] = useState(false);
  const [isSection13Visible, setIsSection13Visible] = useState(false);
  const [isSection14Visible, setIsSection14Visible] = useState(false);
  const [isSection15Visible, setIsSection15Visible] = useState(false);
  const [isSection16Visible, setIsSection16Visible] = useState(false);
  const [isSection17Visible, setIsSection17Visible] = useState(false);
  const [isSection18Visible, setIsSection18Visible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute("data-section");
          if (entry.isIntersecting && sectionId) {
            const id = parseInt(sectionId);

            if (id === 5) setIsSection5Visible(true);
            if (id === 6) setIsSection6Visible(true);
            if (id === 7) setIsSection7Visible(true);
            if (id === 8) setIsSection8Visible(true);
            if (id === 9) setIsSection9Visible(true);
            if (id === 10) setIsSection10Visible(true);
            if (id === 11) setIsSection11Visible(true);
            if (id === 12) setIsSection12Visible(true);
            if (id === 13) setIsSection13Visible(true);
            if (id === 14) setIsSection14Visible(true);
            if (id === 15) setIsSection15Visible(true);
            if (id === 16) setIsSection16Visible(true);
            if (id === 17) setIsSection17Visible(true);
            if (id === 18) setIsSection18Visible(true);

            //Preload next section
            const nextId = id + 1;
            if (nextId === 6) setIsSection6Visible(true);
            if (nextId === 7) setIsSection7Visible(true);
            if (nextId === 8) setIsSection8Visible(true);
            if (nextId === 9) setIsSection9Visible(true);
            if (nextId === 10) setIsSection10Visible(true);
            if (nextId === 11) setIsSection11Visible(true);
            if (nextId === 12) setIsSection12Visible(true);
            if (nextId === 13) setIsSection13Visible(true);
            if (nextId === 14) setIsSection14Visible(true);
            if (nextId === 15) setIsSection15Visible(true);
            if (nextId === 16) setIsSection16Visible(true);
            if (nextId === 17) setIsSection17Visible(true);
            if (nextId === 18) setIsSection18Visible(true);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 1 } // Less strict, triggers sooner
    );

    if (section5Ref.current) observer.observe(section5Ref.current);
    if (section6Ref.current) observer.observe(section6Ref.current);
    if (section7Ref.current) observer.observe(section7Ref.current);
    if (section8Ref.current) observer.observe(section8Ref.current);
    if (section9Ref.current) observer.observe(section9Ref.current);
    if (section10Ref.current) observer.observe(section10Ref.current);
    if (section11Ref.current) observer.observe(section11Ref.current);
    if (section12Ref.current) observer.observe(section12Ref.current);
    if (section13Ref.current) observer.observe(section13Ref.current);
    if (section14Ref.current) observer.observe(section14Ref.current);
    if (section15Ref.current) observer.observe(section15Ref.current);
    if (section16Ref.current) observer.observe(section16Ref.current);
    if (section17Ref.current) observer.observe(section17Ref.current);
    if (section18Ref.current) observer.observe(section18Ref.current);

    return () => observer.disconnect();
  }, []);

  // Initialize section-products mapping
  useEffect(() => {
    sectionProductsMap.current = {
      section4: sec4SelectedProducts,
      section6: sec6SelectedProducts,
      section9: sec9Products?.products?.data || [],
      section10: sec10Products?.products?.data || [],
      section12: sec12Products?.products?.data || [],
      section15: sec15Products?.products?.data || [],
      section16: sec16Products?.products?.data || [],
      section17: sec17Products?.products?.data || [],
    };
  }, [
    sec4SelectedProducts,
    sec6SelectedProducts,
    sec9Products,
    sec10Products,
    sec12Products,
    sec15Products,
    sec16Products,
    sec17Products,
  ]);

  function getSectionData(sectionId: string) {
    const secNew = sectionId.replace("section", "");
    // Handle section3 with category names
    if (sectionId === "section4") {
      const category =
        sec4SelectedCategory?.name || sec4SelectedCategory?.name_arabic;
      return {
        sectionName: `${homepagepartonelatest?.first_five_sec?.sec_four_title ||
          "Latest Products"
          } - ${category}`,
        itemListId: `${secNew}_${sec4SelectedCategory?.id || "default"}`,
        products: sec4SelectedProducts,
      };
    }

    // Handle section6 with category names
    if (sectionId === "section6") {
      const category =
        sec6SelectedCategory?.name || sec6SelectedCategory?.name_arabic;
      return {
        sectionName: `${homepageparttwolatest?.six_eleven_sec?.sec_six_title ||
          "Special Offers"
          } - ${category}`,
        itemListId: `${secNew}_${sec6SelectedCategory?.id || "default"}`,
        products: sec6SelectedProducts,
      };
    }

    // Default section handling
    return {
      // sectionName: isArabic ? getArabicTitle(sectionId) : getEnglishTitle(sectionId),
      sectionName: getEnglishTitle(sectionId),
      itemListId: secNew, // Use section ID as item_list_id for other sections
      products: getSectionProducts(sectionId),
    };
  }

  function getEnglishTitle(sectionId: string): string {
    switch (sectionId) {
      case "section4":
        return homepagepartonelatest?.first_five_sec?.sec_four_title || "Latest Products";
      case "section6":
        return homepageparttwolatest?.six_eleven_sec?.sec_six_title || "Special Offers";
      case "section9":
        return homepageparttwolatest?.six_eleven_sec?.sec_nine_title || "Tamkeen Sales";
      case "section10":
        return homepageparttwolatest?.six_eleven_sec?.sec_ten_title || "Best Sellers";
      case "section12":
        return homepagepartthreelatest?.twelve_seventeen_sec?.sec_twelve_title || "Featured";
      case "section15":
        return homepagepartthreelatest?.twelve_seventeen_sec?.sec_fifteen_title || "Today's Deals";
      case "section16":
        return homepagepartthreelatest?.twelve_seventeen_sec?.sec_sixteen_title || "New Arrivals";
      case "section17":
        return homepagepartthreelatest?.twelve_seventeen_sec?.sec_seventeen_title || "Our Picks";
      default:
        return "Products";
    }
  }


  function getSectionProducts(sectionId: string): any[] {
    switch (sectionId) {
      // case 'section3': return homepagepartonelatest?.first_five_sec?.section_four || [];
      case "section4":
        return sec4SelectedProducts;
      case "section6":
        return sec6SelectedProducts;
      case "section9":
        return sec9Products?.products?.data || [];
      case "section10":
        return sec10Products?.products?.data || [];
      case "section12":
        return sec12Products?.products?.data || [];
      case "section15":
        return sec15Products?.products?.data || [];
      case "section16":
        return sec16Products?.products?.data || [];
      case "section17":
        return sec17Products?.products?.data || [];
      default:
        return [];
    }
  }

  const [bannerOneVisible, setBannerOneVisible] = useState(true);

  return (
    <>
      {/* Section 1 Start */}
      <TopSectionSlider
        data={sec1SliderData}
        lang={lang}
        origin={origin}
        NewMedia2={NewMedia2}
        deviceType={deviceType}
        isMobileOrTablet={true}
      />
      <div className="sticky top-0 z-40 bg-white">
        <MobileHeaderNew
          type="Main"
          isArabic={isArabic}
          NewMedia={NewMedia}
          lang={lang}
          deviceType={deviceType}
          city={city}
          origin={origin}
          slugStr={slugStr}
          isMobileOrTablet={true}
        />
      </div>
      <div className="pt-4"></div>

      {/* Top Slider Section */}
      <MainSliderMobile
        data={sec2SliderTopImage}
        lang={lang}
        origin={origin}
        NewMedia2={NewMedia2}
      />

      {/* Category Section */}
      <div className={containerClass}>
        <CategoriesHomeMobile
          lang={lang}
          params={secCategoryData}
          userAgent={userAgent}
          devicetype={true}
          isArabic={isArabic}
          origin={origin}
          NewMedia={NewMedia}
        />
      </div>

      {/* TSection 2 Start */}
      <section
        className="tamkeenSales_sec w-full mb-8 ltr:pl-4 rtl:pr-4"
        data-section="4"
        data-section-id="section4"
      >
        <h2 className="headingHomeMain mb-4">{sec4Title}</h2>
        <div className="tamkeenSales_btns overflow-x-auto scrollbar-hide flex items-center lg:justify-evenly 2xl:justify-start gap-x-3 md:gap-x-5 pb-3 mb-4 w-full">
          {homepagepartonelatest?.first_five_sec?.section_four?.map(
            (item: any, index: any) => {
              return (
                <button
                  key={index}
                  onClick={() =>
                    updateCategoryProducts(item?.category?.id, index, 1)
                  }
                  className={`bestProButton w-fit whitespace-nowrap px-4 py-2 selected
                                                ${index == sec4SelectedIndex
                      ? "bg-primary !text-white border-primary"
                      : " text-primary border-gray"
                    } 
                                            hover:text-white hover:bg-primary`}
                >
                  {item?.category?.name ? item?.category?.name : ""}
                </button>
              );
            }
          )}
        </div>
        {!isSection4Visible ? (
          <ProductLoopMobile
            productData={sec4SelectedProducts}
            lang={isArabic}
            isMobileOrTablet={true}
            origin={origin}
            gtmColumnItemListId={gtmNewItemListId}
            gtmColumnItemListName={gtmNewItemListName}
            NewMedia={NewMedia}
          />
        ) : (
          <div className="animate-pulse grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-2 xl:gap-x-3 xl:gap-y-0 gap-x-4 gap-y-8 items-center justify-center h-[380px] md:h-[550px] lg:h-[440px] overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                className="bg-white h-[380px] md:h-[550px] lg:h-[440px] rounded-2xl"
                key={i}
              ></div>
            ))}
          </div>
        )}
        {/* New Price Section */}
        <PriceSection
          NewMedia={NewMedia}
          data={homepagepartonelatest?.first_five_sec}
          isArabic={isArabic}
          lang={lang}
          origin={origin}
          isMobileOrTablet={true}
        />
      </section>

      {/* Section 2 End */}
      <MainSliderMobile
        data={sec5Slider}
        lang={lang}
        origin={origin}
        NewMedia2={NewMedia2}
      />

      {/* Section 4 Start */}
      <section
        className="bg-primary py-8 rounded-b-[3rem] lg:mb-14 mb-8  relative shadow-lg overflow-hidden"
        data-section="6"
        data-section-id="section6"
      >
        <div
          ref={section6Ref}
          className={`${containerClassMobile}`}
          data-section="6"
          data-section-id="section6"
        >
          {isSection6Visible ? (
            <>
              <h2 className="headingHomeMain bg-white mb-2 w-fit p-3 rounded-bl-lg rounded-br-lg -mt-8">
                {sec6Title}
              </h2>
              <div className="tamkeenSales_btns overflow-x-auto scrollbar-hide flex items-center lg:justify-evenly 2xl:justify-start gap-x-5 py-3 mb-4 w-full">
                {homepageparttwolatest?.six_eleven_sec?.section_six?.map(
                  (item: any, index: any) => (
                    <button
                      key={index}
                      onClick={() =>
                        updateCategoryProducts(item?.category?.id, index, 2)
                      }
                      className={`bestProButton tamkeenBtns w-fit whitespace-nowrap px-4 py-2
                                    ${index == sec6SelectedIndex
                          ? "selected"
                          : "bg-white text-primary border-gray"
                        } `}
                    >
                      {item?.category?.name ? item?.category?.name : ""}
                    </button>
                  )
                )}
              </div>
              {!isSection6NewVisible ? (
                <>
                  {sec6SelectedProducts?.length > 0 && (
                    <BadgeProductSlider
                      productDataSlider={sec6SelectedProducts}
                      isArabic={isArabic}
                      isMobileOrTablet={true}
                      origin={origin}
                      gtmColumnItemListId={gtmNewItemListId}
                      gtmColumnItemListName={gtmNewItemListName}
                      NewMedia={NewMedia}
                    />
                  )}
                </>
              ) : (
                <div className="animate-pulse flex items-center xl:justify-between justify-start xl:gap-4 gap-x-4 gap-y-8 overflow-hidden">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="relative w-full flex rtl:flex-row-reverse items-start mt-[1.2rem] md:mt-6"
                    >
                      <div className="bg-white h-[410px] sm:h-[500px] lg:h-[420px] 2xl:h-[500px] relative rounded-2xl w-[200px] sm:w-[280px] lg:w-[190px] xl:w-[210px] 2xl:w-[280px]"></div>
                      <div className="pl-[2rem] bg-white shadow-xl rounded-tr-lg rounded-br-lg w-fit -ml-[10px]">
                        <span className="text-[7rem] lg:text-[10rem] -mr-[1.6rem] font-bold text-primary opacity-0">
                          {i + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="animate-pulse w-full mb-8">
              <div className="tamkeenSales_btns flex flex-nowrap gap-4 py-3 mb-2 w-auto max-w-auto overflow-x-hidden">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white h-[38px] rounded-full w-[108px] shrink-0"
                  ></div>
                ))}
              </div>
              <div className="tamkeenSales_cardss flex items-center xl:justify-between justify-start xl:gap-4 gap-x-4 gap-y-8 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="relative w-full flex rtl:flex-row-reverse items-start mt-[1.2rem] md:mt-6"
                  >
                    <div className="bg-white h-[410px] sm:h-[500px] lg:h-[420px] 2xl:h-[500px] relative rounded-2xl w-[200px] sm:w-[280px] lg:w-[190px] xl:w-[210px] 2xl:w-[280px]"></div>
                    <div className="pl-[2rem] bg-white shadow-xl rounded-tr-lg rounded-br-lg w-fit -ml-[10px]">
                      <span className="text-[7rem] lg:text-[10rem] -mr-[1.6rem] font-bold text-primary opacity-0">
                        {i + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      {/*Section 4 End */}

      {/* Section 5 Start */}
      <section
        className="w-full lg:mb-14 mb-8 overflow-hidden relative pb-4"
        data-section="7"
      >
        <div ref={section7Ref} className={`${containerClass}`} data-section="7">
          {isSection7Visible ? (
            <>
              <div className="flex justify-between items-start">
                <h2 className="headingHomeMain mb-2">{brandHeading}</h2>
                <Link
                  prefetch={false}
                  scroll={false}
                  href={`${origin}/${lang}/${brandButtonLink}`}
                  className="text-primary text-sm md:text-xl font-medium underline px-1.5 md:bg-white bg-[#EBEBEB] py-1 rounded-md md:shadow-none shadow-sm"
                >
                  {brandButtonTitle}
                </Link>
              </div>
              <BrandSlider
                data={homepageparttwolatest?.six_eleven_sec?.section_seven}
                origin={origin}
                isArabic={isArabic}
                isMobileOrTablet={true}
                NewMedia={NewMedia}
              />
            </>
          ) : (
            <div className="animate-pulse w-full mb-8">
              <div className="shopByBrands_cards_wrapper flex items-center gap-4 mb-4 overflow-hidden">
                <div className="shopByBrands_brands_card bg-white px-4 py-2 rounded-lg w-[990px] h-[150px]"></div>
                <div className="shopByBrands_brands_card bg-white px-4 py-2 rounded-lg flex w-[310px] h-[150px]"></div>
              </div>
              <div className="shopByBrands_cards_wrapper flex items-center gap-4 overflow-hidden">
                <div className="shopByBrands_brands_card bg-white px-4 py-2 rounded-lg flex w-[610px] h-[150px]"></div>
                <div className="shopByBrands_brands_card bg-white px-4 py-2 rounded-lg flex w-[320px] h-[150px]"></div>
                <div className="shopByBrands_brands_card bg-white px-4 py-2 rounded-lg flex w-[320px] h-[150px]"></div>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Section 5 End */}

      {/* Section 6 Start */}
      <section
        className="section_6 xl:mb-14 mb-md-8 mb-4  relative bg-white md:bg-transparent py-4 md:py-0"
        data-section="8"
      >
        <div ref={section8Ref} className={`${containerClass}`} data-section="8">
          {isSection8Visible ? (
            <>
              <div className="">
                <Link
                  prefetch={false}
                  scroll={false}
                  href={`${origin}/${lang}/${sec8Link}`}
                >
                  <Image
                    alt={sec8Image}
                    title={sec8Image}
                    width={0}
                    height={0}
                    quality={100}
                    decoding="async"
                    data-nimg="1"
                    priority
                    // loading="lazy"
                    className="h-auto w-full mx-auto rounded-2xl mb-4"
                    src={sec8Image}
                    style={{ color: "transparent" }}
                    sizes="100vw"
                  />
                </Link>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="headingHomeMobile">{sec8Heading}</h2>
                    <p className="md:paraHomeMain text-xs mt-1 md:mt-2 line-clamp-2">
                      {sec8Para}
                    </p>
                  </div>
                  <Link
                    prefetch={false}
                    scroll={false}
                    href={`${origin}/${lang}/${sec8Link}`}
                    className="btnPrimarySpecial text-center transition-all duration-300 ease-in-out"
                  >
                    {sec8ButtonTitle}
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="animate-pulse w-full mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2 bg-white h-[400px] rounded-md"></div>
                <div className="bg-white w-full h-[400px] rounded-md"></div>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Section 6 End */}

      {/* Section 7 Start */}
      <section
        ref={section9Ref}
        className="tamkeenSales_sec w-full xl:mb-10 mb-8 relative overflow-hidden"
        data-section="9"
        data-section-id="section9"
      >
        {isSection9Visible ? (
          <>
            <ProductSliderComponent
              sliderHeading={Sec9Heading}
              buttonTitle={Sec9ButtonTitle}
              buttonLink={Sec9ButtonLink}
              productDataSlider={sec9Products}
              isArabic={isArabic}
              isMobileOrTablet={true}
              origin={origin}
              gtmColumnItemListId={gtmNewItemListId}
              gtmColumnItemListName={gtmNewItemListName}
              NewMedia={NewMedia}
              Media={Media}
              lang={lang}
            />
          </>
        ) : (
          <div className={`${containerClass}`}>
            <div className="animate-pulse">
              <div className="tamkeenSales_cardss grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-2 xl:gap-x-3 xl:gap-y-0 gap-x-4 gap-y-8 items-center justify-center h-[380px] md:h-[550px] lg:h-[440px] overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    className="bg-white h-[380px] md:h-[550px] lg:h-[440px] rounded-2xl"
                    key={i}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
      {/* Section 7 End */}

      {/* Section 8 Start */}
      <section
        ref={section10Ref}
        className="bg-[#F2FAFF] xl:pb-8 lg:pb-5 pb-3 mb-8 relative overflow-hidden"
        data-section="10"
        data-section-id="section10"
      >
        {isSection10Visible ? (
          <>
            <BadgeProductLoopComponent
              sliderHeading={Sec10Heading}
              buttonTitle={Sec10ButtonTitle}
              buttonLink={Sec10ButtonLink}
              productDataSlider={sec10Products}
              isArabic={isArabic}
              isMobileOrTablet={true}
              origin={origin}
              gtmColumnItemListId={gtmNewItemListId}
              gtmColumnItemListName={gtmNewItemListName}
              NewMedia={NewMedia}
            />
          </>
        ) : (
          <div className={`${containerClass}`}>
            <div className="animate-pulse">
              <div className="tamkeenSales_cardss grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-2 xl:gap-x-3 xl:gap-y-0 gap-x-4 gap-y-8 items-center justify-center h-[380px] md:h-[550px] lg:h-[440px] overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    className="bg-white h-[380px] md:h-[550px] lg:h-[440px] rounded-2xl"
                    key={i}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
      {/* Section 8 End */}

      {/* Section 9 Start */}
      <section
        className="rounded-b-[3rem] xl:mb-14 md:mb-10 mb-8"
        data-section="11"
      >
        <div ref={section11Ref} data-section="11">
          {isSection11Visible ? (
            <>
              <div className="main_banner flex gap-4 w-full">
                <div className="banner_slider w-full overflow-hidden">
                  <MainSliderMobile
                    data={sec11Slider}
                    lang={lang}
                    origin={origin}
                    NewMedia2={NewMedia2}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="animate-pulse">
              <div className="banner_slider_top bg-white h-[212px] mb-4 rounded-2xl w-full"></div>
            </div>
          )}
        </div>
      </section>
      {/* Section 9 End */}

      {/* Section 10 Start */}
      <section
        ref={section12Ref}
        className="tamkeenSales_sec w-full xl:mb-10 mb-8 relative overflow-hidden"
        data-section="12"
        data-section-id="section12"
      >
        {isSection12Visible ? (
          <>
            <ProductSliderComponent
              sliderHeading={Sec12Heading}
              buttonTitle={Sec12ButtonTitle}
              buttonLink={Sec12ButtonLink}
              productDataSlider={sec12Products}
              isArabic={isArabic}
              isMobileOrTablet={true}
              origin={origin}
              gtmColumnItemListId={gtmNewItemListId}
              gtmColumnItemListName={gtmNewItemListName}
              NewMedia={NewMedia}
            />
          </>
        ) : (
          <div className={`${containerClass}`}>
            <div className="animate-pulse">
              <div className="tamkeenSales_cardss grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-2 xl:gap-x-3 xl:gap-y-0 gap-x-4 gap-y-8 items-center justify-center h-[380px] md:h-[550px] lg:h-[440px] overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    className="bg-white h-[380px] md:h-[550px] lg:h-[440px] rounded-2xl"
                    key={i}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
      {/* Section 10 End */}

      {/* Section 11 Start */}
      <section
        className="builtInAppliances_sec xl-mb-14 lg:mb-12 mb-8 relative"
        data-section="13"
      >
        <div
          ref={section13Ref}
          className={`${containerClass} relative`}
          data-section="13"
        >
          {isSection13Visible ? (
            <>
              <div
                className={`w-full flex ltr:flex-row rtl:flex-row-reverse items-center gap-4 overflow-hidden bg-center bg-no-repeat max-md:pt-56 max-md:pb-24 md:py-24 px-3 md:px-6 rounded-2xl bg-cover`}
                style={{
                  backgroundImage: sec13BgImage,
                }}
              >
                <div className="felx flex-col space-y-3 sm:w-auto w-full">
                  <div className="overflow-hidden rounded-2xl">
                    {sec13Image2 && (
                      <Link
                        prefetch={false}
                        scroll={false}
                        href={`${origin}/${lang}/${sec13Link2}`}
                        aria-label={`${origin}/${lang}`}
                      >
                        <Image
                          alt="Built in Appliances"
                          title="Built in Appliances"
                          width={0}
                          height={0}
                          decoding="async"
                          loading="lazy"
                          sizes="100vw"
                          quality={100}
                          data-nimg="1"
                          className="h-auto w-[27rem] mx-auto rounded-2xl hover:scale-110 transform transition-transform duration-500 ease-in-out"
                          src={sec13Image2}
                          style={{ color: "transparent" }}
                        />
                      </Link>
                    )}
                  </div>
                  <div className="overflow-hidden rounded-2xl">
                    {sec13Image3 && (
                      <Link
                        prefetch={false}
                        scroll={false}
                        href={`${origin}/${lang}/${sec13Link3}`}
                        aria-label={`${origin}/${lang}`}
                      >
                        <Image
                          alt="Built in Appliances"
                          title="Built in Appliances"
                          width={0}
                          height={0}
                          decoding="async"
                          loading="lazy"
                          sizes="100vw"
                          quality={100}
                          data-nimg="1"
                          className="h-auto w-[27rem] mx-auto rounded-2xl hover:scale-110 transform transition-transform duration-500 ease-in-out"
                          src={sec13Image3}
                          style={{ color: "transparent" }}
                        />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl sm:w-auto md:w-auto">
                  {sec13Image1 && (
                    <Link
                      prefetch={false}
                      scroll={false}
                      href={`${origin}/${lang}/${sec13Link1}`}
                      aria-label={`${origin}/${lang}`}
                    >
                      <Image
                        alt="Built in Appliances"
                        title="Built in Appliances"
                        width={0}
                        height={0}
                        decoding="async"
                        sizes="100vw"
                        quality={100}
                        loading="lazy"
                        data-nimg="1"
                        className="h-auto w-64 mx-auto rounded-2xl hover:scale-110 transform transition-transform duration-500 ease-in-out"
                        src={sec13Image1}
                        style={{ color: "transparent" }}
                      />
                    </Link>
                  )}
                </div>
                <button className="btnPrimarySpecial absolute ltr:left-8 rtl:right-8 bottom-4 !py-[0.5rem] !px-[1.5rem]">
                  <Link
                    prefetch={false}
                    scroll={false}
                    href={`${origin}/${lang}/${sec13ButtonLink}`}
                    aria-label={`${origin}/${lang}`}
                  >
                    {sec13ButtonTitle}
                  </Link>
                </button>
              </div>
            </>
          ) : (
            <div className="animate-pulse">
              <div className="w-full flex sm:flex-row flex-col items-center gap-4 bg-center rounded-3xl sm:py-8 py-8 px-3 bg-white">
                <div className="rounded-3xl w-[220px] h-[240px] bg-white border-[#f0f1f2] border"></div>
                <div className="felx flex-col space-y-3">
                  <div className="rounded-3xl w-[310px] h-[120px] bg-white border-[#f0f1f2] border"></div>
                  <div className="rounded-3xl w-[310px] h-[120px] bg-white border-[#f0f1f2] border"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Section 11 End */}

      {/* Section 13 Start */}
      <section
        ref={section15Ref}
        className="tamkeenSales_sec w-full lg:mb-10 mb-8 relative overflow-hidden"
        data-section="15"
        data-section-id="section15"
      >
        {isSection15Visible ? (
          <>
            <ProductSliderComponent
              sliderHeading={Sec15Heading}
              buttonTitle={Sec15ButtonTitle}
              buttonLink={Sec15ButtonLink}
              productDataSlider={sec15Products}
              isArabic={isArabic}
              isMobileOrTablet={true}
              origin={origin}
              gtmColumnItemListId={gtmNewItemListId}
              gtmColumnItemListName={gtmNewItemListName}
              NewMedia={NewMedia}
            />
          </>
        ) : (
          <div className={`${containerClass}`}>
            <div className="animate-pulse">
              <div className="tamkeenSales_cardss grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-2 xl:gap-x-3 xl:gap-y-0 gap-x-4 gap-y-8 items-center justify-center h-[380px] md:h-[550px] lg:h-[440px] overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    className="bg-white h-[380px] md:h-[550px] lg:h-[440px] rounded-2xl"
                    key={i}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
      {/*Section 13 End */}

      {/* Section 14 Start */}
      <section
        className="cookingElegance_sec lg:mb-8 mb-6 relative bg-white py-4 lg:px-4"
        data-section="18"
      >
        <div
          ref={section18Ref}
          className={`${containerClass}`}
          data-section="18"
        >
          {isSection18Visible ? (
            <>
              <div className="flex items-center lg:flex-row md:flex-col flex-col-reverse gap-4">
                <div className="flex lg:flex-col lg:gap-0 gap-2 flex-row items-start justify-between w-full">
                  <div>
                    <h2 className="headingHomeMain lg:!text-[2.5rem] lg:!leading-[3.5rem] !text-[18px] !leading-[24px]">
                      {sec18Heading
                        .split(/،|,/)
                        .map((part: any, index: any, arr: any) => {
                          const comma: any = isArabic ? "،" : ",";
                          return (
                            <span key={index}>
                              {part.trim()}
                              {index < arr.length - 1 && comma}
                              {index < arr.length - 1 && <br />}
                            </span>
                          );
                        })}
                    </h2>
                    <p className="paraHomeMain mt-2 line-clamp-2 lg:!text-[18px] lg:!leading-[25px] !text-[11px] !leading-[15px]">
                      {sec18Paragraph}
                    </p>
                  </div>
                  <div className="lg:mt-8">
                    <button className="btnPrimarySpecial !rounded-2xl lg:!text-[18px] lg:!leading-[20px] !text-[11px] !leading-[15px] transition-all duration-300 ease-in-out text-nowrap">
                      <Link
                        prefetch={false}
                        scroll={false}
                        href={`${origin}/${lang}/${sec18ButtonLink}`}
                        aria-label={`${origin}/${lang}`}
                      >
                        {sec18ButtonTitle}
                      </Link>
                    </button>
                  </div>
                </div>
                <div className="w-full flex items-center justify-center md:gap-4 gap-2">
                  <div className="overflow-hidden rounded-md">
                    {sec18Image1 && (
                      <Link
                        prefetch={false}
                        scroll={false}
                        href={`${origin}/${lang}/${sec18Link1}`}
                        aria-label={`${origin}/${lang}`}
                      >
                        <Image
                          alt="oven-stg-25FEB.webp"
                          title="oven-stg-25FEB.webp"
                          width={0}
                          height={0}
                          quality={100}
                          decoding="async"
                          data-nimg="1"
                          className="h-auto w-[300px]  mx-auto rounded-2xl hover:scale-110 transform transition-transform duration-500 ease-in-out"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                          src={sec18Image1}
                          style={{ color: "transparent" }}
                        />
                      </Link>
                    )}
                  </div>
                  <div className="overflow-hidden rounded-md">
                    {sec18Image2 && (
                      <Link
                        prefetch={false}
                        scroll={false}
                        href={`${origin}/${lang}/${sec18Link2}`}
                        aria-label={`${origin}/${lang}`}
                      >
                        <Image
                          alt="oven-stg-25FEB.webp"
                          title="oven-stg-25FEB.webp"
                          width={0}
                          height={0}
                          quality={100}
                          decoding="async"
                          data-nimg="1"
                          className="h-auto w-[300px] mx-auto rounded-2xl hover:scale-110 transform transition-transform duration-500 ease-in-out"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                          src={sec18Image2}
                          style={{ color: "transparent" }}
                        />
                      </Link>
                    )}
                  </div>
                  <div className="overflow-hidden rounded-md">
                    {sec18Image3 && (
                      <Link
                        prefetch={false}
                        scroll={false}
                        href={`${origin}/${lang}/${sec18Link3}`}
                        aria-label={`${origin}/${lang}`}
                      >
                        <Image
                          alt="oven-stg-25FEB.webp"
                          title="oven-stg-25FEB.webp"
                          width={0}
                          height={0}
                          quality={100}
                          decoding="async"
                          data-nimg="1"
                          className="h-auto w-[300px] mx-auto rounded-2xl hover:scale-110 transform transition-transform duration-500 ease-in-out"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                          src={sec18Image3}
                          style={{ color: "transparent" }}
                        />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="animate-pulse">
              <div className="flex items-center lg:flex-row flex-col gap-4">
                <div className="w-full lg:text-left text-center"></div>
                <div className="w-full flex items-center justify-center md:gap-4 gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white h-[250px] rounded-2xl w-[200px] border-[#f0f1f2] border"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Section 14 End */}

      {/* Section 15 Start */}
      <section
        ref={section16Ref}
        className="tamkeenSales_sec w-full lg:mb-10 mb-8 relative overflow-hidden"
        data-section="16"
        data-section-id="section16"
      >
        {isSection16Visible ? (
          <>
            <ProductSliderComponent
              sliderHeading={Sec16Heading}
              buttonTitle={Sec16ButtonTitle}
              buttonLink={Sec16ButtonLink}
              productDataSlider={sec16Products}
              isArabic={isArabic}
              isMobileOrTablet={true}
              origin={origin}
              gtmColumnItemListId={gtmNewItemListId}
              gtmColumnItemListName={gtmNewItemListName}
              NewMedia={NewMedia}
            />
          </>
        ) : (
          <div className={`${containerClass}`}>
            <div className="animate-pulse">
              <div className="tamkeenSales_cardss grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-2 xl:gap-x-3 xl:gap-y-0 gap-x-4 gap-y-8 items-center justify-center h-[380px] md:h-[550px] lg:h-[440px] overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    className="bg-white h-[380px] md:h-[550px] lg:h-[440px] rounded-2xl"
                    key={i}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
      {/* Section 15 End */}

      {/* Section 12 Start */}
      <section
        className="rounded-b-[3rem] xl:mb-14 md:mb-10 mb-8"
        data-section="14"
      >
        <div ref={section14Ref} data-section="14">
          {isSection14Visible ? (
            <div className="main_banner flex gap-4 w-full">
              <div className="banner_slider w-full overflow-hidden">
                <MainSliderMobile
                  data={sec14Slider}
                  lang={lang}
                  origin={origin}
                  NewMedia2={NewMedia2}
                />
              </div>
            </div>
          ) : (
            <div className="animate-pulse">
              <div className="banner_slider_top bg-white h-[212px] mb-4 rounded-2xl w-full"></div>
            </div>
          )}
        </div>
      </section>
      {/* Section 12 End */}

      {/* Section 16 Start */}
      <section
        ref={section17Ref}
        className="tamkeenSales_sec w-full lg:mb-10 mb-8 relative overflow-hidden"
        data-section="17"
        data-section-id="section17"
      >
        {isSection17Visible ? (
          <>
            <ProductSliderComponent
              sliderHeading={Sec17Heading}
              buttonTitle={Sec17ButtonTitle}
              buttonLink={Sec17ButtonLink}
              productDataSlider={sec17Products}
              isArabic={isArabic}
              isMobileOrTablet={true}
              origin={origin}
              gtmColumnItemListId={gtmNewItemListId}
              gtmColumnItemListName={gtmNewItemListName}
              NewMedia={NewMedia}
            />
          </>
        ) : (
          <div className={`${containerClass}`}>
            <div className="animate-pulse">
              <div className="tamkeenSales_cardss grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-2 xl:gap-x-3 xl:gap-y-0 gap-x-4 gap-y-8 items-center justify-center h-[380px] md:h-[550px] lg:h-[440px] overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    className="bg-white h-[380px] md:h-[550px] lg:h-[440px] rounded-2xl"
                    key={i}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
      {/* Section 16 End */}

      <section
        className={`${containerClass} bg-[#F3F9FC] border-t border-b border-primary py-3`}
      >
        <div data-section="18">
          <TamkeenServices
            isArabic={isArabic}
            NewMedia={NewMedia}
            origin={origin}
            deviceType={deviceType}
          />
        </div>
      </section>
      <Newsletter isMobileOrTablet={true} isArabic={isArabic} lang={lang} />
      {/* <Popup isMobileOrTablet={isMobileOrTablet} lang={isArabic} /> */}
      {/* <div className="pb-20 md:pb-0"></div> */}
    </>
  );
}
