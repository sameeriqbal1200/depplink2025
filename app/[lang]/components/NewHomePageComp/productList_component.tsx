"use client";

import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { useRouter } from "next-nprogress-bar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { cacheKey } from "../../../GlobalVar";
import { setCartItems } from "../../cartstorage/cart";
import GlobalContext from "../../../GlobalContext";
import FlashSaleTimer from "./FlashSaleTimer";
import { addProductWishlistData, removeProductWishlistData } from "@/lib/components/component.client";

export default function ProductListComponent({
  productData,
  isArabic,
  isMobileOrTablet,
  origin,
  ProExtraData,
  gtmColumnItemListId = '50000',
  gtmColumnItemListName = 'direct',
  NewMedia
}: any) {
  const router = useRouter();
  const productSlug = `${origin}/${isArabic ? "ar" : "en"}/product/${
    productData?.slug
  }`;
  function isValidUrl(value: any) {
    return value != null && value !== "" && value !== undefined;
  }
  const productFeaturedImage: any =
    isValidUrl(productData?.featured_image?.image) &&
    productData?.featured_image?.image
      ? `${NewMedia}${productData?.featured_image?.image}`
      : null;
  const productSpecificationImageOne: any =
    isValidUrl(productData?.specification_image_one) &&
    productData?.specification_image_one
      ? `${productData?.specification_image_one}`
      : null;
  const productSpecificationImageTwo: any =
    isValidUrl(productData?.specification_image_two) &&
    productData?.specification_image_two
      ? `${productData?.specification_image_two}`
      : null;
  const productSpecificationImageThree: any =
    isValidUrl(productData?.specification_image_three) &&
    productData?.specification_image_three
      ? `${productData?.specification_image_three}`
      : null;
  const productSpecificationImageFour: any =
    isValidUrl(productData?.specification_image_four) &&
    productData?.specification_image_four
      ? `${productData?.specification_image_four}`
      : null;
  const productSpecificationImageFive: any =
    isValidUrl(productData?.specification_image_five) &&
    productData?.specification_image_five
      ? `${productData?.specification_image_five}`
      : null;
  const productSpecificationImageSix: any =
    isValidUrl(productData?.specification_image_six) &&
    productData?.specification_image_six
      ? `${productData?.specification_image_six}`
      : null;
  const productTitle = isArabic ? productData?.name_arabic : productData?.name;
  const productBrand = isArabic
    ? productData?.brand?.name_arabic
    : productData?.brand?.name;

  const productBrandImage: any = productData?.brand?.brand_media_image?.image
  ? `${NewMedia}${productData?.brand?.brand_media_image?.image}` 
  : null;

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

  var productFlashSalePriceStatus = 0; // 1 for flash sale price, 0 for no flash sale price
  var productFlashSalePrice = 0;
  // var productFlashSaleTimer = "10:41:04";
  var productFlashSaleTimer: any = false;
  var timerText = null ;
  if (productData?.flash_sale_expiry && productData?.flash_sale_price) {
    var timer = calculateTimeLeft(productData?.flash_sale_expiry);
    if (!timer?.expired) {
      timerText = productData?.flash_sale_expiry ;
      productFlashSalePriceStatus = 1;
      productFlashSalePrice = productData?.flash_sale_price;
      productFlashSaleTimer = `${timer?.hours}{" "}:{" "}${timer?.minutes}{" "}:{" "}${timer?.seconds}`;
      if (productData) {
        productData.sale_price = productData.flash_sale_price;
      }
    }
  }
  const salePormotionPriceSatus =
    productData?.promotional_price == null ||
    productData?.promotional_price == 0
      ? 0
      : 1; // 1 for sale, 0 for no sale This is for dummy value only
  const salePormotionPriceOnly = productData?.promotional_price;
  const salePormotionText =
    salePormotionPriceSatus > 0 && productFlashSalePriceStatus == 0
      ? isArabic
        ? productData?.promo_title_arabic
        : productData?.promo_title
      : "";

  const productSalePrice =
    salePormotionPriceSatus > 0 && productFlashSalePriceStatus == 0
      ? Math.max(
          0,
          Number(
            productData?.sale_price > 0
              ? productData?.sale_price
              : productData?.price
          ) - Number(salePormotionPriceOnly)
        )
      : productData?.sale_price;
  const productRegularPrice = productData?.price;
  const regularPrice = Number(productRegularPrice);
  const salePrice = Number(productSalePrice);
  const flashSalePrice = Number(productFlashSalePrice);
  const percentage = productData?.save_type === "1" ? 1 : 0; // 1 for percentage, 0 for amount
  const sarIcon = () => (
    <svg
      className="riyal-svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1124.14 1256.39"
      width={isMobileOrTablet ? "9" : "11"}
      height={isMobileOrTablet ? "10" : "12"}
    >
      <path
        fill="currentColor"
        d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"
      ></path>
      <path
        fill="currentColor"
        d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"
      ></path>
    </svg>
  );
  const discountPercentage =
    percentage > 0
      ? Math.round((salePrice / regularPrice) * 100)
      : Math.max(0, Number(productRegularPrice) - Number(productSalePrice));
  const productDiscountType = percentage > 0 ? (isArabic ? "خصم" : "OFF") : "";
  const productDiscountValue =
    percentage > 0 ? (
      isArabic ? (
        `%${discountPercentage}`
      ) : (
        `${discountPercentage}%`
      )
    ) : isArabic ? (
      <>
        وفر {discountPercentage.toLocaleString("en-US")} {sarIcon()}
      </>
    ) : (
      <>
        Save {discountPercentage.toLocaleString("en-US")} {sarIcon()}
      </>
    );

  const [ProductExtraData, setProductExtraData] = useState<any>([]);

  useEffect(() => {
    setProductExtraData(ProExtraData);
  }, [ProExtraData]);

  const giftAvailableImage = productData?.gift_image
    ? productData?.gift_image
    : null;


let imgAbsoluteTextOne = "";
let imgAbsoluteTextTwo = "";
let imgAbsoluteTextThree = "";
let imgAbsoluteTextFour = "";

// const specs =
  //   productData?.specs && productData?.specs[0]?.specdetails
  //     ? productData?.specs[0]?.specdetails
  //     : [];

  const specs =
    productData?.features && productData?.features.length > 0
      ? productData?.features
      : [];
      if (specs.length >= 1) {
        const first = specs[0];
        imgAbsoluteTextOne = isArabic
        ? `${first?.feature_ar || ""} `
      : `${first?.feature_en || ""} `
    }

  if (specs.length >= 2) {
    const second = specs[1];
    imgAbsoluteTextTwo = isArabic
      ? `${second?.feature_ar || ""}`
      : `${second?.feature_en || ""} `
  }

  // if (specs.length >= 3) {
  //   const third = specs[2];
  //   imgAbsoluteTextThree = isArabic
  //     ? `${third?.specs_ar || ""} ${third?.value_ar || ""}`
  //     : `${third?.specs_en || ""} ${third?.value_en || ""}`;
  // }

  // if (specs.length >= 4) {
  //   const fourth = specs[3];
  //   imgAbsoluteTextFour = isArabic
  //     ? `${fourth?.specs_ar || ""} ${fourth?.value_ar || ""}`
  //     : `${fourth?.specs_en || ""} ${fourth?.value_en || ""}`;
  // }
  const subOneText = isArabic ? "هدية" : "Gift";
  const subTwoText = isArabic ? "غير متوفر" : "Not Available";
  const subThreeText = isArabic ? 
              productData?.badge_left_arabic && (
                productData?.badge_left_arabic 
              ) : productData?.badge_left && (
                productData?.badge_left
              )
  const subFourText = isArabic ?
              productData?.badge_right_arabic && (
                productData?.badge_right_arabic 
              ) : productData?.badge_right && (
                productData?.badge_right
              )
  const brandNameText = isArabic ? "جنرال سوبريم" : "General Supreme";
  const brandDetailText = isArabic
    ? "ثلاجة باب بجانب باب 15.2قدم ,430 لتر ,انفرتر."
    : "Side-by-side refrigerator, 15.2 cu.ft, 430 liters, inverter";
  const brandCodeText = isArabic ? "كود:" : "Code:";
  const brandCodeNoText = productData?.sku;
  const priceText = isArabic ? "659" : "659";
  const priceDiscountedText = isArabic ? "1499" : "1499";
  const priceSaveText = isArabic ? "وفر 800" : "Save 800";
  const priceAdditionalDiscountText = isArabic
    ? "السعر بعد خصم الاسترداد النقدي"
    : "Price Included Additional Discount";
  const buyNowText = isArabic
    ? "إشتري الأن وإدفع لاحقا "
    : "Buy now and pay later";
  const installmentMethodsImages = isArabic
    ? `/icons/installment-3.webp?v=${cacheKey}`
    : `/icons/installment-3.webp?v=${cacheKey}`;
  const installmentMethods = isArabic ? "طرق الدفع" : "Payment";
  const ratingText = isArabic
    ? `${productData?.rating} ( تقيم )`
    : `${productData?.rating} ( Rating )`;
  const btnCheckoutText = isArabic ? "شراء الأن " : "Checkout Now";
  const btndiscoverText = isArabic ? "اكتشف المزيد" : "Discover More";
  const productBadgeLeftBackgroundColor = productData?.badge_left_color
    ? productData?.badge_left_color
    : "#EA4335";
  const productBadgeRightBackgroundColor = productData?.badge_right_color
    ? productData?.badge_right_color
    : "#004B7A";

  const fGift = ProExtraData?.freegiftData;
  const fGiftType =
    fGift && fGift?.freegiftlist?.length == fGift?.allowed_gifts ? 0 : 1;
    

  const [newFreeGiftData, setnewFreeGiftData] = useState<any>(productData?.multi_free_gift_data);
  const { updateWishlist, setUpdateWishlist } = useContext(GlobalContext);
  const [ProWishlistData, setProWishlistData] = useState<any>([]);
  const [buyNowLoading, setBuyNowLoading] = useState<number>(0);
  const [extraData, setExtraData] = useState<any>([]);
  const [selectedProductId, setSelectedProductId] = useState<any>(false);
  const [selectedProductKey, setSelectedProductKey] = useState<any>(false);
  const [selectedGifts, setselectedGifts] = useState<any>({});
  const [allowed_gifts, setallowed_gifts] = useState(0);
  const [cartid, setcartid] = useState(false);
  const [cartkey, setcartkey] = useState(false);
  const gtmNewListId = gtmColumnItemListId;
  const gtmNewListName = gtmColumnItemListName;

  const [isImageLoaded, setImageLoaded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(brandCodeNoText);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Copy Text Popup
  const handleCopyPopup = async (type: any) => {
    if (type === brandCodeNoText) {
      const toast = Swal.mixin({
        toast: true,
        position: isArabic ? "top-start" : "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      toast.fire({
        icon: "success",
        title: isArabic ? 'تم النسخ إلى الحافظة!' : 'Copied to clipboard!',
        padding: "10px 20px",
        background: "#20831E",
        color: "#FFFFFF",
      });
    }
  };

  useEffect(() => {
      if (localStorage.getItem("userWishlist")) {
        var wdata: any = localStorage.getItem("userWishlist");
        setProWishlistData(JSON.parse(wdata));
      }
      // if (localStorage.getItem("userCompare")) {
      //   var wdata: any = localStorage.getItem("userCompare");
      //   setProComparetData(JSON.parse(wdata));
      // }
      window.addEventListener("storage", () => {
        refetch();
      });
      return () => {
        window.removeEventListener("storage", () => {
          refetch();
        });
      };
    }, []);

    const refetch = () => {
      if (localStorage.getItem("userWishlist")) {
        var wdata: any = localStorage.getItem("userWishlist");
        setProWishlistData(JSON.parse(wdata));
      } else if (ProWishlistData.length) {
        setProWishlistData([]);
      }

      // if (localStorage.getItem("userCompare")) {
      //   var wdata: any = localStorage.getItem("userCompare");
      //   setProComparetData(JSON.parse(wdata));
      // } else if (ProComparetData.length) {
      //   setProComparetData([]);
      // }
    };

  // Add to Cart Functionality
  const addToCart = (id: any, i: any, giftcheck = false, redirect = false) => {
    var discountpricevalue: any = 0;
    var addtionaldiscount: any = 0;
    var discounttype: any = 0;
    if (productData?.discounttypestatus == 1) {
      addtionaldiscount = productData.discounttypestatus;
      discounttype = productData.discountcondition;
      if (productData.discountcondition === 1) {
        discountpricevalue = productData.discountvalue;
      } else if (productData.discountcondition == 2) {
        if (productData.sale_price > 0) {
          discountpricevalue =
            (productData.sale_price / 100) * productData.discountvalue;
        } else {
          discountpricevalue =
            (productData.price / 100) * productData.discountvalue;
        }
        if (discountpricevalue > productData.discountvaluecap) {
          discountpricevalue = productData.discountvaluecap;
        }
      } else if (productData.discountcondition == 3) {
        if (productData.pricetypevat == 0) {
          discountpricevalue =
            productData.sale_price - (productData.sale_price / 115) * 100;
        } else {
          discountpricevalue =
            productData.price - (productData.price / 115) * 100;
        }
      }
    }
    var flashCalc = ProExtraData?.flash
      ? ProExtraData?.flash?.discount_type === 2
        ? Math.round(
          (productData?.sale_price * ProExtraData?.flash?.discount_amount) /
          100
        )
        : ProExtraData?.flash?.discount_amount
      : productData?.sale_price;
    setBuyNowLoading(id);
    setSelectedProductId(id);
    setSelectedProductKey(i);
    setExtraData(ProExtraData);

    if (
      ProExtraData?.freegiftData?.freegiftlist?.length ==
      ProExtraData?.freegiftData?.allowed_gifts &&
      ProExtraData?.freegiftData?.freegiftlist?.filter(
        (e: any) => e?.discount > 0
      )?.length <= 0
    ) {
      var item: any = {
        id: productData.id,
        sku: productData.sku,
        name: productData.name,
        name_arabic: productData.name_arabic,
        image: productData?.featured_image
          ? `${NewMedia}${productData?.featured_image?.image}`
          : "https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png",
        price: flashCalc
          ? flashCalc
          : productData.sale_price
            ? productData.sale_price
            : productData.price,
        regular_price: productData.price,
        quantity: 1,
        total_quantity: productData.quantity,
        brand: productData?.brand,
        slug: productData?.slug,
        pre_order: productData?.pre_order,
        pre_order_day:
          productData?.pre_order != null ? productData?.no_of_days : false,
        discounted_amount: discountpricevalue,
        discounttype: discounttype,
        addtionaldiscount: addtionaldiscount,
        item_list_id: gtmNewListId ?? '50000',
        item_list_name: gtmNewListName ?? 'direct',
      };
      var gifts: any = false;
      if (ProExtraData?.freegiftData) {
        gifts = [];
        for (
          let index = 0;
          index < ProExtraData?.freegiftData?.freegiftlist?.length;
          index++
        ) {
          const element = ProExtraData?.freegiftData?.freegiftlist[index];
          var amount = 0;
          if (ProExtraData?.freegiftData?.discount_type == 2) {
            var fgprice = element?.productdetail?.sale_price
              ? element?.productdetail?.sale_price
              : element?.productdetail?.price;
            fgprice -= (element?.discount * fgprice) / 100;
          } else if (ProExtraData?.freegiftData?.discount_type == 3)
            amount = element.discount;
          var giftitem: any = {
            id: element.productdetail.id,
            sku: element.productdetail.sku,
            name: element.productdetail.name,
            name_arabic: element.productdetail.name_arabic,
            image: element.productdetail?.featured_image
              ? `${NewMedia}${element.productdetail?.featured_image?.image}`
              : "https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png",
            price: element.productdetail.sale_price
              ? element.productdetail.sale_price
              : element.productdetail.price,
            regular_price: element.productdetail.price,
            quantity: 1,
            gift_id: ProExtraData?.freegiftData?.id,
            discounted_amount: amount,
            slug: element.productdetail?.slug,
            pre_order: 0,
            pre_order_day: false,
            item_list_id: gtmNewListId ?? '50000',
            item_list_name: gtmNewListName ?? 'direct',
          };
          gifts.push(giftitem);
        }
      }

      // new free gift
      var newGifts: any = false
      if (newFreeGiftData?.length >= 1) {
        newGifts = []
        for (let index = 0; index < newFreeGiftData.length; index++) {
          const element = newFreeGiftData[index];
          newGifts.push({
            id: element?.product_sku_data.id,
            sku: element?.product_sku_data.sku,
            name: element?.product_sku_data.name,
            name_arabic: element?.product_sku_data.name_arabic,
            image: element?.product_sku_data?.featured_image ? `${NewMedia}${element?.product_sku_data?.featured_image?.image}` : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
            price: element?.product_sku_data.price,
            regular_price: 0,
            quantity: 1 * element?.free_gift_qty,
            discounted_amount: 0,
            slug: element?.product_sku_data?.slug,
            pre_order: 0,
            pre_order_day: false,
            new_gift: true,
            gift_quantity: element?.free_gift_qty,
            item_list_id: gtmNewListId ?? '50000',
            item_list_name: gtmNewListName ?? 'direct',
          });
        }
      }

      // Finally merge them
      const allGifts: any = [
        ...(Array.isArray(gifts) ? gifts : []),
        ...(Array.isArray(newGifts) ? newGifts : [])
      ];

      var fbt: any = false;

      setCartItems(item, allGifts, fbt);
      topMessageAlartSuccess(
        isArabic ? "اضـافـة الـي العـربــة" : "Add to Cart",
        true
      );
      setBuyNowLoading(0);
      if (redirect) {
        // router.push(
        //   `/${isArabic ? "ar" : "en"}/${localStorage.getItem("userid") ? "checkout" : "login?type=checkout"
        //   }`
        // ); // Redirect to cart page
        router.push(
          `/${isArabic ? "ar" : "en"}/cart`
        ); // Redirect to cart page
        router.refresh();
      }
      return false;
    }
    if (ProExtraData?.freegiftData && giftcheck) {
      setExtraData(ProExtraData);
      setallowed_gifts(ProExtraData?.freegiftData?.allowed_gifts);
      setBuyNowLoading(0);
      setselectedGifts({});
      setcartid(id);
      setcartkey(i);
      return false;
    } else {
      var item: any = {
        id: productData.id,
        sku: productData.sku,
        name: productData.name,
        name_arabic: productData.name_arabic,
        image: productData?.featured_image
          ? `${NewMedia}${productData?.featured_image?.image}`
          : "https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png",
        price: flashCalc
          ? flashCalc
          : productData.sale_price
            ? productData.sale_price
            : productData.price,
        regular_price: productData.price,
        quantity: 1,
        total_quantity: productData.quantity,
        brand: productData?.brand,
        slug: productData?.slug,
        pre_order: productData?.pre_order,
        pre_order_day:
          productData?.pre_order != null ? productData?.no_of_days : false,
        discounted_amount: discountpricevalue,
        discounttype: discounttype,
        addtionaldiscount: addtionaldiscount,
        directcashback: productData?.cashback_amount,
        directcashback_title: productData?.cashback_title,
        directcashback_title_arabic: productData?.cashback_title_arabic,
        item_list_id: gtmNewListId ?? '50000',
        item_list_name: gtmNewListName ?? 'direct',
      };
      var gifts: any = false;
      if (ProExtraData?.freegiftData) {
        if (Object.keys(selectedGifts).length > 0) {
          gifts = [];
          for (
            let index = 0;
            index < extraData?.freegiftData?.freegiftlist?.length;
            index++
          ) {
            const element = extraData?.freegiftData?.freegiftlist[index];
            if (selectedGifts[element.id]) {
              var amount = 0;
              if (extraData?.freegiftData?.discount_type == 2) {
                var fgprice = element?.productdetail?.sale_price
                  ? element?.productdetail?.sale_price
                  : element?.productdetail?.price;
                fgprice -= (element?.discount * fgprice) / 100;
              } else if (extraData?.freegiftData?.discount_type == 3)
                amount = element.discount;
              var giftitem: any = {
                id: element.productdetail.id,
                sku: element.productdetail.sku,
                name: element.productdetail.name,
                name_arabic: element.productdetail.name_arabic,
                image: element.productdetail?.featured_image
                  ? `${NewMedia}${element.productdetail?.featured_image?.image}`
                  : "https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png",
                price: element.productdetail.sale_price
                  ? element.productdetail.sale_price
                  : element.productdetail.price,
                regular_price: element.productdetail.price,
                quantity: 1,
                gift_id: extraData?.freegiftData?.id,
                discounted_amount: amount,
                slug: element.productdetail?.slug,
                pre_order: 0,
                pre_order_day: false,
                item_list_id: gtmNewListId ?? '50000',
                item_list_name: gtmNewListName ?? 'direct',
              };
              gifts.push(giftitem);
            }
          }
        }
      }

      // new free gift
      var newGifts: any = false
      if (newFreeGiftData?.length >= 1) {
        newGifts = []
        for (let index = 0; index < newFreeGiftData.length; index++) {
          const element = newFreeGiftData[index];
          newGifts.push({
            id: element?.product_sku_data.id,
            sku: element?.product_sku_data.sku,
            name: element?.product_sku_data.name,
            name_arabic: element?.product_sku_data.name_arabic,
            image: element?.product_sku_data?.featured_image ? `${NewMedia}${element?.product_sku_data?.featured_image?.image}` : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
            price: element?.product_sku_data.price,
            regular_price: 0,
            quantity: 1 * element?.free_gift_qty,
            // gift_id: extraData?.freegiftdata?.id,
            discounted_amount: 0,
            slug: element?.product_sku_data?.slug,
            pre_order: 0,
            pre_order_day: false,
            new_gift: true,
            gift_quantity: element?.free_gift_qty,
            item_list_id: gtmNewListId ?? '50000',
            item_list_name: gtmNewListName ?? 'direct',
          });
        }
      }

      // Finally merge them
      const allGifts: any = [
        ...(Array.isArray(gifts) ? gifts : []),
        ...(Array.isArray(newGifts) ? newGifts : [])
      ];

      var fbt: any = false;

      setCartItems(item, allGifts, fbt);
      topMessageAlartSuccess(
        isArabic ? "اضـافـة الـي العـربــة" : "Add to Cart",
        true
      );
      setBuyNowLoading(0);
      if (redirect) {
        // router.push(
        //   `/${isArabic ? "ar" : "en"}/${localStorage.getItem("userid") ? "checkout" : "login?type=checkout"
        //   }`
        // ); // Redirect to cart page
        router.push(
          `/${isArabic ? "ar" : "en"}/cart`
        ); // Redirect to cart page
        router.refresh();
      }
    }
  };
  
  const MySwal = withReactContent(Swal);
  const topMessageAlartSuccess = (title: any, viewcart: boolean = false) => {
    MySwal.fire({
      icon: "success",
      title: (
        <div className="text-xs">
          <div className="uppercase">{title}</div>
          {viewcart ? (
            <>
              <p className="font-light mb-3">
                {isArabic
                  ? "تمت إضافة العنصر إلى سلة التسوق الخاصة بك."
                  : "The item has been added into your cart."}
              </p>
              <button
                onClick={() => {
                  router.push(`/${isArabic ? "ar" : "en"}/cart`);
                  router.refresh();
                }}
                className="focus-visible:outline-none mt-2 underline"
              >
                {isArabic ? "عرض العربة" : "View Cart"}
              </button>
            </>
          ) : null}
        </div>
      ),
      toast: true,
      position: isArabic ? "top-start" : "top-end",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: false,
      background: "#20831E",
      color: "#FFFFFF",
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
      position: isArabic ? "top-start" : "top-end",
      showConfirmButton: false,
      timer: 15000,
      showCloseButton: true,
      background: "#DC4E4E",
      color: "#FFFFFF",
      timerProgressBar: true,
    });
  };

  function detectPlatform() {
    if (window.Android) return "Android-WebView";
    if (window.webkit?.messageHandlers?.iosBridge) return "iOS-WebView";
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) return "Android-Mobile-WebView";
    if (/iPad|iPhone|iPod/.test(userAgent)) return "iOS-Mobile-WebView";
    return "Web";
  }

  const pushGTMEvent = (eventName: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      // Clear previous ecommerce data
      window.dataLayer.push({ ecommerce: null });
      const getOriginalPrice = () => {
        if (!productData?.flash_sale_price && !productData?.sale_price) return productData?.price;
        return productData?.price;
      };
      const getDiscountedPrice = () => {
        let salePrice = productData?.sale_price > 0 ? productData?.sale_price : productData?.price;
        if (productData?.promotional_price > 0) {
          salePrice = Math.max(0, Number(salePrice) - Number(productData?.promotional_price));
        }
        if (productData?.flash_sale_expiry && productData?.flash_sale_price) {
          const timer = calculateTimeLeft(productData?.flash_sale_expiry);
          if (!timer?.expired) {
            salePrice = productData?.flash_sale_price;
          }
        }

        return salePrice;
      };

      const discountPrice = productData?.price - getDiscountedPrice();
      // Push new ecommerce event
      window.dataLayer.push({
        event: eventName,
        platform: detectPlatform(),
        event_value: Number(getDiscountedPrice()), // sum of prices
        currency: "SAR", // currency
        ecommerce: {
          items: [
            {
              item_id: productData?.sku,
              item_name: productTitle,
              price: Number(getDiscountedPrice()),
              item_brand: productBrand,
              item_image_link: productFeaturedImage,
              item_link: productSlug,
              item_list_id: gtmNewListId ?? "50000",
              item_list_name: gtmNewListName ?? "direct",
              shelf_price: Number(getOriginalPrice()),
              discount: Number(discountPrice ?? 0),
              item_availability: "in stock",
              index: productData?.id,
              quantity: 1,
              id: productData?.sku,
            }
          ]
        }
      });
    }
  };

  const handleGTMAddToCart = () => {
    pushGTMEvent('add_to_cart');
  };
  const WishlistProduct = async (id: any, type: boolean) => {
      // var testing: any = ProWishlistData
      if (localStorage.getItem("userid")) {
          var data = {
              user_id: localStorage.getItem("userid"),
              product_id: id,
          }
          if (type) {
              const RemoveData = await removeProductWishlistData(data);
              if (RemoveData?.removeWishlistData?.success) {
              // testing[id].wishlist = !type;
                  // setProWishlistData({ ...testing })
                  var wishlistRemovetext = isArabic
                      ? "تمت إزالة هذا المنتج من قائمة الرغبات."
                      : "This product has been removed from wishlist.";
                    topMessageAlartDanger(wishlistRemovetext);
                  if (localStorage.getItem("wishlistCount")) {
                      var wishlistlength: any = localStorage.getItem('wishlistCount');
                      wishlistlength = parseInt(wishlistlength) - 1;
                      localStorage.setItem('wishlistCount', wishlistlength);
                  }
                  localStorage.removeItem('userWishlist')
                  setUpdateWishlist(updateWishlist == 0 ? 1 : 0)
              }
          } else {
              const AddData = await addProductWishlistData(data);
              if (AddData?.addWishlistData?.success) {
                  // testing[id].wishlist = !type;
                  // setProWishlistData({ ...testing })
                  var wishlistAddtext = isArabic
                    ? "تمت إضافة هذا المنتج إلى قائمة الرغبات."
                    : "This product has been Added in the wishlist.";
                  topMessageAlartSuccess(wishlistAddtext);
                  if (localStorage.getItem("wishlistCount")) {
                      var wishlistlength: any = localStorage.getItem('wishlistCount');
                      wishlistlength = parseInt(wishlistlength) + 1;
                      localStorage.setItem('wishlistCount', wishlistlength);
                  }
                  localStorage.removeItem('userWishlist')
                  setUpdateWishlist(updateWishlist == 0 ? 1 : 0)
              }
          }

      } else {
          router.push(`${origin}/${isArabic ? "ar" : "en"}/login`);
      }
  }

  return (
    <div className="flex items-center lg:flex-row flex-col bg-white rounded-2xl h-full w-full shadow-md">
      {/* Product Cart Top Area */}
      <div className="xl:pt-0 xl:pb-0 pt-3.5 pb-1.5 relative shrink-0 lg:border-r lg:border-[#F2F2F2]">
        {/* Product Image */}
        <Link prefetch={false} scroll={false} href={productSlug}>
          <div className="relative w-full xl:max-w-[380px] max-w-[305px] aspect-square mx-auto">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-2xl z-10"></div>
            )}
            <Image
              src={productFeaturedImage}
              alt={productTitle}
              title={productTitle}
              loading="lazy"
              width={0}
              height={0}
              quality={100}
              className={`xl:w-[507px] xl:h-[380px] w-[305px] h-[285px] object-cover object-center rounded-2xl transition-opacity duration-300 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 140px) 100vw, (max-width: 1068px) 1150px, (max-width: 1024px) 1, 100vw"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </Link>
        {/* Product Specifications Text */}
        <div className={`flex items-center justify-center ${(imgAbsoluteTextOne || imgAbsoluteTextTwo || imgAbsoluteTextThree || imgAbsoluteTextFour) ? 'mb-4' : 'mb-0'} text-nowrap mx-auto w-[356px] overflow-hidden`}>
          {imgAbsoluteTextOne && 
          <div className="text-[0.5rem] font-semibold">
            {imgAbsoluteTextOne}
          </div>
          }
          {imgAbsoluteTextTwo && <div className="h-3 w-px mx-1 border border-gray opacity-20"></div>}
          {imgAbsoluteTextTwo && 
          <div className="text-[0.5rem] font-semibold">
            {imgAbsoluteTextTwo}
          </div>
          }
          {imgAbsoluteTextThree && <div className="h-3 w-px mx-1 border border-gray opacity-20"></div>}
          {imgAbsoluteTextThree && 
          <div className="text-[0.5rem] font-semibold">
            {imgAbsoluteTextThree}
          </div>
          }
          {imgAbsoluteTextFour && <div className="h-3 w-px mx-1 border border-gray opacity-20"></div>}
          {imgAbsoluteTextFour && 
          <div className="text-[0.5rem] font-semibold">
            {imgAbsoluteTextFour}
          </div>
          }
        </div>
        {/* Wishlist And Cart */}
        <div className="flex items-center gap-2 absolute xl:top-5 top-3.5 left-3.5 z-10">
          <button className={`w-[1.65rem] h-[1.65rem] grid place-content-center bg-white hover:!bg-red text-primary hover:text-white rounded-full shadow-md transition-all duration-200 ease-in-out
            ${
              ProWishlistData.filter((item: any) => item == productData?.id)
                .length >= 1
                ? "!bg-red !text-white"
                : "!bg-white"
            }`}
            onClick={(e: any) => {
              var type: boolean =
                ProWishlistData.filter(
                  (item: any) => item == productData?.id
                ).length >= 1;
              WishlistProduct(productData?.id, type);
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 27 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1_8618)">
                <g clipPath="url(#clip1_1_8618)">
                  <path
                    d="M24.4211 6.4022C23.7697 5.36917 22.8155 4.56212 21.6888 4.09101C20.412 3.55511 18.9781 3.45865 17.5419 3.81275C16.2259 4.13729 14.944 4.84118 13.8001 5.8623C12.6561 4.84109 11.3741 4.13716 10.0579 3.81266C8.62172 3.45842 7.18764 3.55498 5.91093 4.09124C4.78414 4.56249 3.83005 5.3697 3.17869 6.40288C2.49655 7.48122 2.14954 8.79259 2.17515 10.1951C2.28887 16.4299 11.5764 22.0994 13.4371 23.1727C13.5475 23.2364 13.6727 23.2699 13.8001 23.2699C13.9276 23.2699 14.0528 23.2364 14.1632 23.1727C16.0241 22.0993 25.3124 16.4288 25.4251 10.194C25.4505 8.79159 25.1033 7.48036 24.4211 6.4022ZM23.9721 10.1679C23.9358 12.1838 22.5919 14.534 20.0862 16.9645C17.7657 19.2152 15.1262 20.9116 13.8001 21.701C12.474 20.9118 9.8349 19.2155 7.51463 16.9648C5.0088 14.5345 3.66496 12.1844 3.62817 10.1685C3.58802 7.9674 4.65179 6.19642 6.47371 5.43113C7.07081 5.18168 7.71185 5.05446 8.35895 5.057C10.03 5.057 11.7977 5.86594 13.282 7.37527C13.3496 7.44403 13.4302 7.49864 13.5192 7.53592C13.6081 7.5732 13.7036 7.59239 13.8 7.59239C13.8965 7.59239 13.992 7.5732 14.0809 7.53592C14.1699 7.49864 14.2505 7.44403 14.3181 7.37527C16.3803 5.27844 18.9891 4.53349 21.1259 5.43099C22.948 6.19601 24.0119 7.96671 23.9721 10.1677V10.1679Z"
                    fill="currentColor"
                  />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_1_8618">
                  <rect
                    width="26.1592"
                    height="26.1592"
                    fill="white"
                    transform="translate(0.72168 0.266602)"
                  />
                </clipPath>
                <clipPath id="clip1_1_8618">
                  <rect
                    width="26.1592"
                    height="26.1592"
                    fill="white"
                    transform="translate(0.72168 0.266449)"
                  />
                </clipPath>
              </defs>
            </svg>
          </button>
          <button className="w-[1.65rem] h-[1.65rem] grid place-content-center bg-white hover:bg-orange text-primary hover:text-white rounded-full shadow-md transition-all duration-200 ease-in-out"
            onClick={() => {
                if (fGiftType == 0) {
                  addToCart(productData.id, 0, true);
                } else if (fGift) {
                  router.push(productSlug);
                } else {
                  addToCart(productData.id, 0, true);
                }
                handleGTMAddToCart()
              }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 27 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1_8623)">
                <g clipPath="url(#clip1_1_8623)">
                  <g clipPath="url(#clip2_1_8623)">
                    <path
                      d="M9.53418 26.0958C10.1228 26.0958 10.6172 26.5855 10.6172 27.21C10.6172 27.8346 10.1228 28.3243 9.53418 28.3243C8.94571 28.324 8.45216 27.8344 8.45215 27.21C8.45215 26.5856 8.9457 26.096 9.53418 26.0958Z"
                      fill="white"
                      stroke="currentColor"
                      strokeWidth="0.968858"
                    />
                    <path
                      d="M19.0527 26.096C19.6414 26.096 20.1357 26.5857 20.1357 27.2102C20.1357 27.8348 19.6414 28.3245 19.0527 28.3245C18.4643 28.3243 17.9707 27.8346 17.9707 27.2102C17.9707 26.5858 18.4643 26.0962 19.0527 26.096Z"
                      fill="white"
                      stroke="currentColor"
                      strokeWidth="0.968858"
                    />
                    <path
                      d="M2.75391 7.79214C2.86045 7.78183 2.96807 7.79334 3.07031 7.82535L5.92578 8.71988L6.01758 8.75504C6.10677 8.79535 6.18811 8.85201 6.25781 8.92203C6.32756 8.99211 6.38414 9.07425 6.4248 9.16422L6.45996 9.25699L9.61816 19.4582H19.8877L21.6963 11.1603H8.62207L8.59668 11.0802L8.14355 9.65933L8.09668 9.51089H22.752C22.8718 9.51177 22.9898 9.54006 23.0977 9.59293C23.2056 9.64584 23.3008 9.72207 23.376 9.81656H23.375C23.4543 9.91163 23.5124 10.0232 23.543 10.1437C23.5737 10.2648 23.5762 10.3913 23.5518 10.5138V10.5168L21.3438 20.463C21.3028 20.6485 21.2003 20.8143 21.0527 20.9318C20.9057 21.0488 20.7232 21.1097 20.5361 21.1056V21.1066H9.82715L8.2002 22.4836C8.17468 22.5344 8.15934 22.5901 8.15918 22.6476C8.15902 22.7103 8.1752 22.7719 8.20508 22.8263C8.23488 22.8806 8.27758 22.926 8.3291 22.9582C8.38074 22.9903 8.4399 23.0078 8.5 23.0099H20.2295C20.4452 23.0099 20.6519 23.0982 20.8037 23.2531C20.9553 23.4079 21.04 23.6172 21.04 23.8351C21.04 24.053 20.9554 24.2624 20.8037 24.4171C20.6519 24.572 20.4452 24.6593 20.2295 24.6593H8.60742V24.6584C8.29281 24.6733 7.97932 24.6145 7.69141 24.4845C7.40172 24.3537 7.14623 24.1556 6.94531 23.9064L6.94336 23.9044C6.6605 23.5382 6.51169 23.0828 6.52246 22.6173C6.53331 22.1519 6.7034 21.7049 7.00293 21.3527L7.00781 21.3459L7.09863 21.2541L7.10645 21.2462L7.17969 21.3341L7.10742 21.2462L8.19043 20.3429L5.03418 10.1701L2.5918 9.40738C2.38521 9.34261 2.21296 9.19662 2.1123 9.00308C2.01172 8.80941 1.99068 8.58247 2.05371 8.3732C2.1168 8.16409 2.25855 7.98803 2.44922 7.88492C2.54363 7.83387 2.64734 7.80249 2.75391 7.79214Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="0.228241"
                    />
                  </g>
                </g>
              </g>
              <path
                d="M19.0157 5.70898H16.9877V4.26898H19.0157V2.25298H20.4557V4.26898H22.5077V5.70898H20.4557V7.74898H19.0157V5.70898Z"
                fill="currentColor"
              />
              <defs>
                <clipPath id="clip0_1_8623">
                  <rect
                    width="26.1592"
                    height="26.1592"
                    fill="white"
                    transform="translate(0.821289 5.17773)"
                  />
                </clipPath>
                <clipPath id="clip1_1_8623">
                  <rect
                    width="24.4788"
                    height="24.4788"
                    fill="white"
                    transform="matrix(-1 0 0 1 25.5186 5.55743)"
                  />
                </clipPath>
                <clipPath id="clip2_1_8623">
                  <rect
                    width="22.2837"
                    height="21.3149"
                    fill="white"
                    transform="translate(1.64453 7.49344)"
                  />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
      {/* Product Cart Body Area */}
      <div className="py-[1.375rem] px-[1.875rem] lg:border-0 border-t border-[#F2F2F2] xl:grow">
        {/* Product Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {giftAvailableImage && (
              <div className="flex items-center gap-0.5 font-bold px-2 py-1 bg-[#E6D9FF] rounded-md">
                <svg
                  width="10"
                  height="11"
                  viewBox="0 0 10 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.7204 5.98712V9.09942C8.72043 9.51281 8.5598 9.91053 8.27146 10.211C7.98313 10.5115 7.58894 10.6919 7.16978 10.7153L7.07672 10.7178H2.2721C1.85226 10.7178 1.44832 10.5597 1.14315 10.2758C0.837984 9.99189 0.654716 9.60377 0.630947 9.19105L0.628418 9.09942V5.98712H8.7204Z"
                    fill="url(#paint0_linear_20_8834)"
                  />
                  <path
                    d="M8.59483 3.24896C8.9438 3.24896 9.22702 3.52782 9.22702 3.87142V5.61431C9.22705 5.75781 9.17672 5.89691 9.08456 6.00807C8.9924 6.11923 8.86406 6.19562 8.72127 6.22432H0.629284C0.341007 6.16656 0.123535 5.91558 0.123535 5.61431V3.87142C0.123535 3.52782 0.406755 3.24896 0.755721 3.24896H8.59483Z"
                    fill="url(#paint1_radial_20_8834)"
                  />
                  <path
                    d="M4.29541 10.7188V5.73907H5.05403V10.7188H4.29541Z"
                    fill="url(#paint2_linear_20_8834)"
                  />
                  <path
                    d="M4.29541 6.23526V3.74542H5.05403V6.23526H4.29541Z"
                    fill="url(#paint3_linear_20_8834)"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.41063 3.99589C3.13392 3.99587 2.8617 3.92706 2.6192 3.79585C2.37669 3.66465 2.17176 3.47528 2.02338 3.24532C1.875 3.01535 1.78799 2.75222 1.77041 2.48032C1.75283 2.20843 1.80525 1.93656 1.9228 1.68992C2.04036 1.44328 2.21925 1.22986 2.4429 1.06943C2.66655 0.908998 2.92771 0.806757 3.20218 0.77218C3.47664 0.737604 3.75554 0.771813 4.013 0.871634C4.27046 0.971456 4.49817 1.13366 4.675 1.34321C4.85184 1.13366 5.07954 0.971456 5.33701 0.871634C5.59447 0.771813 5.87336 0.737604 6.14783 0.77218C6.4223 0.806757 6.68346 0.908998 6.9071 1.06943C7.13075 1.22986 7.30964 1.44328 7.4272 1.68992C7.54476 1.93656 7.59717 2.20843 7.57959 2.48032C7.56201 2.75222 7.475 3.01535 7.32662 3.24532C7.17825 3.47528 6.97331 3.66465 6.73081 3.79585C6.4883 3.92706 6.21608 3.99587 5.93937 3.99589H3.41063ZM2.52557 2.37749C2.52557 2.14637 2.61882 1.92472 2.7848 1.76129C2.95078 1.59786 3.1759 1.50605 3.41063 1.50605C3.64536 1.50605 3.87048 1.59786 4.03646 1.76129C4.20244 1.92472 4.29569 2.14637 4.29569 2.37749V3.24894H3.41063C3.1759 3.24894 2.95078 3.15712 2.7848 2.9937C2.61882 2.83027 2.52557 2.60861 2.52557 2.37749ZM5.05431 3.24894H5.93937C6.11442 3.24894 6.28554 3.19783 6.43109 3.10207C6.57664 3.00632 6.69008 2.87021 6.75706 2.71098C6.82405 2.55174 6.84158 2.37653 6.80743 2.20748C6.77328 2.03844 6.68899 1.88316 6.56521 1.76129C6.44143 1.63941 6.28373 1.55642 6.11204 1.52279C5.94036 1.48917 5.7624 1.50642 5.60068 1.57238C5.43895 1.63834 5.30073 1.75003 5.20347 1.89334C5.10622 2.03665 5.05431 2.20514 5.05431 2.37749V3.24894Z"
                    fill="#121212"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.41063 3.99589C3.13392 3.99587 2.8617 3.92706 2.6192 3.79585C2.37669 3.66465 2.17176 3.47528 2.02338 3.24532C1.875 3.01535 1.78799 2.75222 1.77041 2.48032C1.75283 2.20843 1.80525 1.93656 1.9228 1.68992C2.04036 1.44328 2.21925 1.22986 2.4429 1.06943C2.66655 0.908998 2.92771 0.806757 3.20218 0.77218C3.47664 0.737604 3.75554 0.771813 4.013 0.871634C4.27046 0.971456 4.49817 1.13366 4.675 1.34321C4.85184 1.13366 5.07954 0.971456 5.33701 0.871634C5.59447 0.771813 5.87336 0.737604 6.14783 0.77218C6.4223 0.806757 6.68346 0.908998 6.9071 1.06943C7.13075 1.22986 7.30964 1.44328 7.4272 1.68992C7.54476 1.93656 7.59717 2.20843 7.57959 2.48032C7.56201 2.75222 7.475 3.01535 7.32662 3.24532C7.17825 3.47528 6.97331 3.66465 6.73081 3.79585C6.4883 3.92706 6.21608 3.99587 5.93937 3.99589H3.41063ZM2.52557 2.37749C2.52557 2.14637 2.61882 1.92472 2.7848 1.76129C2.95078 1.59786 3.1759 1.50605 3.41063 1.50605C3.64536 1.50605 3.87048 1.59786 4.03646 1.76129C4.20244 1.92472 4.29569 2.14637 4.29569 2.37749V3.24894H3.41063C3.1759 3.24894 2.95078 3.15712 2.7848 2.9937C2.61882 2.83027 2.52557 2.60861 2.52557 2.37749ZM5.05431 3.24894H5.93937C6.11442 3.24894 6.28554 3.19783 6.43109 3.10207C6.57664 3.00632 6.69008 2.87021 6.75706 2.71098C6.82405 2.55174 6.84158 2.37653 6.80743 2.20748C6.77328 2.03844 6.68899 1.88316 6.56521 1.76129C6.44143 1.63941 6.28373 1.55642 6.11204 1.52279C5.94036 1.48917 5.7624 1.50642 5.60068 1.57238C5.43895 1.63834 5.30073 1.75003 5.20347 1.89334C5.10622 2.03665 5.05431 2.20514 5.05431 2.37749V3.24894Z"
                    fill="url(#paint4_linear_20_8834)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_20_8834"
                      x1="4.15855"
                      y1="12.5767"
                      x2="4.15855"
                      y2="4.14464"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#BB45EA" />
                      <stop offset="0.348" stopColor="#8B57ED" />
                      <stop offset="1" stopColor="#5B2AB5" />
                    </linearGradient>
                    <radialGradient
                      id="paint1_radial_20_8834"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(4.67528 2.13351) scale(11.7248 4.64901)"
                    >
                      <stop offset="0.196" stopColor="#5B2AB5" />
                      <stop offset="0.763" stopColor="#8B57ED" />
                      <stop offset="1" stopColor="#BB45EA" />
                    </radialGradient>
                    <linearGradient
                      id="paint2_linear_20_8834"
                      x1="4.29541"
                      y1="2.938"
                      x2="4.29541"
                      y2="9.85279"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FB5937" />
                      <stop offset="1" stopColor="#FFCD0F" />
                    </linearGradient>
                    <linearGradient
                      id="paint3_linear_20_8834"
                      x1="4.29541"
                      y1="-6.92554"
                      x2="4.29541"
                      y2="10.5034"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FB5937" />
                      <stop offset="1" stopColor="#FFCD0F" />
                    </linearGradient>
                    <linearGradient
                      id="paint4_linear_20_8834"
                      x1="6.29036"
                      y1="3.99489"
                      x2="4.67494"
                      y2="-2.68898"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FF6F47" />
                      <stop offset="1" stopColor="#FFCD0F" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-[.5625rem] leading-[.465rem] font-bold">
                  {subOneText}
                </span>
              </div>
            )}
            {/* <div className="text-[.5625rem] text-[#E88011] bg-white shadow-[0_0_0.89px_0_#E8801140] rounded-[2.67px] py-[3px] px-1">
              {subTwoText}
            </div> */}
            {subThreeText && 
            <div className={`text-[.5625rem] bg-white shadow-[0_0_0.89px_0_#1A84E540] rounded-md py-[3px] px-1 border`}
              style={{
                borderColor: `${productBadgeLeftBackgroundColor}25`,
                color: productBadgeLeftBackgroundColor,
              }}>
              {subThreeText}
            </div>
            }
            {subFourText && 
            <div className={`text-[.5625rem] bg-white shadow-[0_0_0.89px_0_#AC040840] rounded-md py-[3px] px-1 border`}
              style={{
                borderColor: `${productBadgeRightBackgroundColor}25`,
                color: productBadgeRightBackgroundColor,
              }}>
              {subFourText}
            </div>
            }
          </div>
          {ProductExtraData?.expressdeliveryData ? (
            <div className="flex flex-col items-center justify-center">
              <svg
                width="74"
                height="28"
                viewBox="0 0 74 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M29.0812 10.1354C28.7271 10.6355 28.0324 10.9475 27.4362 10.9475C27.0453 10.9475 26.7101 10.8805 26.4319 10.747C26.1531 10.613 25.9703 10.4356 25.8837 10.2149H25.8404C25.507 10.7037 24.9387 10.9475 24.1361 10.9475C23.8211 10.9475 23.5422 10.8977 23.3002 10.798C23.0576 10.6984 22.8695 10.5673 22.7354 10.4047H22.6921C22.3047 12.5071 20.9154 13.5589 18.5229 13.5589C18.0305 13.5589 17.5838 13.5162 17.1822 13.4314C16.78 13.3466 16.4329 13.2285 16.1399 13.0784C15.8468 12.9283 15.5888 12.7409 15.3663 12.5166C15.1432 12.2924 14.9617 12.0498 14.8205 11.7893C14.6793 11.5289 14.5642 11.2347 14.4759 10.9072C14.3875 10.5797 14.3258 10.2505 14.2914 9.91887C14.257 9.58785 14.2397 9.22657 14.2397 8.83563V8.03773H15.7436V8.83563C15.7436 10.0446 15.9625 10.9119 16.4003 11.4387C16.8381 11.9655 17.5387 12.2283 18.5009 12.2283C19.4632 12.2283 20.1406 11.9649 20.5749 11.4387C21.0091 10.9119 21.2268 10.0446 21.2268 8.83563V6.64778H22.8013V8.87893C22.8013 9.14707 22.882 9.34403 23.0427 9.47039C23.2041 9.59734 23.4271 9.66022 23.7131 9.66022C23.999 9.66022 24.1924 9.59793 24.3265 9.47335C24.46 9.34877 24.5276 9.15004 24.5276 8.87893V6.41464H26.1074V8.87893C26.1074 9.14707 26.1875 9.34403 26.3488 9.47039C26.5102 9.59734 26.7332 9.66022 27.0192 9.66022C27.3051 9.66022 27.4973 9.59793 27.6296 9.47335C27.7619 9.34877 27.8278 9.15004 27.8278 8.87893V6.18091C27.8278 6.18091 29.4069 6.18091 29.4075 6.18091C29.3737 6.18209 29.4295 8.20383 29.4325 8.36104C29.4431 8.92105 29.4402 9.53505 29.1483 10.0334C29.1281 10.0684 29.1062 10.1022 29.0824 10.1354H29.0812Z"
                  fill="#121212"
                />
                <path
                  d="M38.0163 11.5828H36.4365V12.8802H38.0163V11.5828Z"
                  fill="black"
                />
                <path
                  d="M49.9041 9.60187H49.7944C49.3779 9.60187 49.1703 9.34322 49.1703 8.82592V6.18248H47.5905V8.8805C47.5905 9.15161 47.5247 9.35034 47.3924 9.47492C47.2601 9.5995 47.0566 9.66179 46.7819 9.66179C46.5073 9.66179 46.2724 9.5989 46.1116 9.47195C45.9502 9.345 45.8701 9.14805 45.8701 8.8805V6.41621H44.2904V8.8805C44.2904 9.15161 44.2245 9.35034 44.0922 9.47492C43.9599 9.5995 43.7564 9.66179 43.4818 9.66179C43.2071 9.66179 42.9722 9.5989 42.8114 9.47195C42.6501 9.345 42.57 9.14805 42.57 8.8805V6.62206H40.9902V8.82592C40.9902 9.34322 40.782 9.60187 40.3661 9.60187H39.1393C38.886 9.60187 38.6653 9.50992 38.4773 9.32483C38.2886 9.14034 38.1949 8.87101 38.1949 8.51626V6.18188H36.6151V8.73872C36.6151 9.03889 36.5332 9.2578 36.3707 9.39543C36.2082 9.53306 36.0326 9.60187 35.8445 9.60187H34.1295C33.344 9.60187 32.9513 9.29754 32.9513 8.69007V6.18188H31.3609V10.7361C31.3609 11.3009 31.2956 11.7162 31.1657 11.9819C31.0352 12.2477 30.8145 12.3812 30.503 12.3812C30.2349 12.3812 30.0237 12.3343 29.8677 12.24V13.3855C30.1245 13.5012 30.4556 13.5593 30.8613 13.5593C31.2671 13.5593 31.5797 13.4923 31.855 13.3582C32.1297 13.2242 32.3462 13.029 32.504 12.7721C32.6612 12.5152 32.7751 12.221 32.8457 11.89C32.9163 11.5589 32.9519 11.1745 32.9519 10.7361V10.2153H32.9952C33.0747 10.4217 33.2283 10.5896 33.4567 10.7201C33.6845 10.8506 33.9088 10.9153 34.1301 10.9153H35.8451C36.1453 10.9153 36.4674 10.8566 36.8115 10.7391C37.155 10.6216 37.4486 10.4253 37.6906 10.15C37.8496 10.36 38.0644 10.5404 38.3337 10.6899C38.6036 10.8399 38.8718 10.9153 39.1399 10.9153H41.2032C41.4565 10.9153 41.6997 10.8257 41.9335 10.6466C42.1672 10.4674 42.2906 10.3238 42.3054 10.2153H42.3487C42.4353 10.436 42.6186 10.6133 42.8969 10.7474C43.1757 10.8815 43.5103 10.9479 43.9012 10.9479C44.705 10.9479 45.2728 10.7035 45.6056 10.2153H45.6489C45.7319 10.436 45.9146 10.6133 46.197 10.7474C46.4794 10.8815 46.8158 10.9479 47.2067 10.9479C48.0064 10.9479 48.5729 10.7035 48.9057 10.2153H48.949C49.0285 10.4217 49.1839 10.5896 49.4159 10.7201C49.582 10.8133 49.7451 10.872 49.9053 10.8987V9.60187H49.9041Z"
                  fill="#121212"
                />
                <path
                  d="M54.6252 7.41363H54.5981V7.3866C54.606 7.39441 54.6174 7.40222 54.6252 7.41363Z"
                  fill="#1CB2E7"
                />
                <path
                  d="M60.2399 2.96661H58.6602V10.9142H60.2399V2.96661Z"
                  fill="black"
                />
                <path
                  d="M53.0378 4.36272L52.1112 5.32375C46.3912 1.28324 39.0446 1.12426 39.0446 1.12426C29.9462 0.420684 23.8632 4.03703 23.8632 4.03703L25.2365 4.82781H21.457L23.5606 1.58935V3.45092C30.597 -0.268062 39.0446 0.0344892 39.0446 0.0344892C45.5097 0.235002 50.1707 2.4442 53.0384 4.36212L53.0378 4.36272Z"
                  fill="#1CB2E7"
                />
                <path
                  d="M53.5924 5.95444L53.2976 6.238C52.9873 5.97698 52.6693 5.72723 52.3442 5.48875L53.2786 4.52771C53.6416 4.77746 53.9709 5.0195 54.2699 5.25383L53.7021 5.84409L53.5924 5.95384V5.95444Z"
                  fill="#1CB2E7"
                />
                <path
                  d="M56.4721 7.12185C55.8693 6.50726 55.2085 5.91462 54.4948 5.43054L53.901 6.04691L53.7877 6.16022L53.5112 6.4248C53.5112 6.43845 53.7818 6.63125 53.8061 6.6532C53.9704 6.79854 54.1353 6.94388 54.2979 7.09159C54.8383 7.58338 55.4108 8.12204 55.7169 8.79833C55.7465 8.86418 55.9963 9.58436 55.9138 9.60276C55.9138 9.60276 51.2896 9.60276 50.0806 9.60276V10.915C50.0841 10.915 50.0877 10.9156 50.0913 10.9156H57.4984C57.4984 10.4849 57.4948 10.0536 57.4984 9.62233C57.4984 9.61224 57.4984 9.60156 57.4984 9.59148C57.4984 8.67256 57.1139 7.77619 56.4715 7.12126L56.4721 7.12185Z"
                  fill="#1CB2E7"
                />
                <path
                  d="M51.0948 9.60308H49.7927C49.4788 9.60308 49.2854 9.45536 49.2065 9.16052V10.5718C49.2706 10.6246 49.3353 10.678 49.4148 10.7195C49.6455 10.8518 49.8728 10.9165 50.0923 10.9165H51.096V9.60367L51.0948 9.60308Z"
                  fill="#1CB2E7"
                />
                <path
                  d="M56.4668 2.96564L54.3632 5.15585L54.2689 5.25433L53.7011 5.8446L53.5914 5.95435L53.2966 6.23791L51.7304 7.7471H50.1299L52.2637 5.57171L52.3432 5.48866L53.2776 4.52762L53.6371 4.15685L54.7909 2.96564H56.4668Z"
                  fill="#1CB2E7"
                />
                <path
                  d="M2.90756 24.2289C2.44356 24.2289 2.07823 24.1595 1.81156 24.0209C1.54489 23.8769 1.35289 23.6582 1.23556 23.3649C1.12356 23.0662 1.06756 22.6902 1.06756 22.2369C1.06756 21.7782 1.12356 21.3995 1.23556 21.1009C1.35289 20.8022 1.54489 20.5809 1.81156 20.4369C2.07823 20.2929 2.44356 20.2209 2.90756 20.2209H4.60356V23.8609H3.85956V20.6289L4.16356 20.8929H2.90756C2.62489 20.8929 2.40356 20.9275 2.24356 20.9969C2.08356 21.0609 1.97156 21.1915 1.90756 21.3889C1.84356 21.5809 1.81156 21.8635 1.81156 22.2369C1.81156 22.6049 1.84356 22.8849 1.90756 23.0769C1.97156 23.2635 2.08089 23.3915 2.23556 23.4609C2.39556 23.5302 2.61956 23.5649 2.90756 23.5649H5.45956V24.2289H2.90756ZM5.45956 24.2289V23.5649C5.49156 23.5649 5.51823 23.5729 5.53956 23.5889C5.56089 23.6049 5.57689 23.6262 5.58756 23.6529C5.59823 23.6795 5.60623 23.7142 5.61156 23.7569C5.61689 23.7942 5.61956 23.8395 5.61956 23.8929C5.61956 23.9409 5.61689 23.9862 5.61156 24.0289C5.60623 24.0715 5.59823 24.1089 5.58756 24.1409C5.57689 24.1675 5.56089 24.1889 5.53956 24.2049C5.51823 24.2209 5.49156 24.2289 5.45956 24.2289ZM2.01156 19.5009V18.7249H2.74756V19.5009H2.01156ZM3.20356 19.5009V18.7249H3.93956V19.5009H3.20356ZM7.1305 24.1729C6.84783 23.9275 6.63183 23.6502 6.4825 23.3409C6.33316 23.0315 6.2585 22.7035 6.2585 22.3569C6.2585 22.0475 6.3145 21.7622 6.4265 21.5009C6.5385 21.2395 6.68783 21.0129 6.8745 20.8209C7.0665 20.6289 7.29316 20.4822 7.5545 20.3809C7.81583 20.2742 8.09316 20.2209 8.3865 20.2209C8.54116 20.2209 8.7065 20.2369 8.8825 20.2689C9.06383 20.3009 9.23716 20.3462 9.4025 20.4049L9.1545 21.0369C9.0265 20.9889 8.8985 20.9542 8.7705 20.9329C8.6425 20.9062 8.51983 20.8929 8.4025 20.8929C8.1305 20.8929 7.88783 20.9569 7.6745 21.0849C7.4665 21.2075 7.30383 21.3782 7.1865 21.5969C7.06916 21.8155 7.0105 22.0662 7.0105 22.3489C7.0105 22.6102 7.06383 22.8555 7.1705 23.0849C7.27716 23.3089 7.43183 23.5089 7.6345 23.6849L7.1305 24.1729ZM5.4585 24.2289V23.5649H9.4905V24.2289H5.4585ZM5.4585 24.2289C5.4265 24.2289 5.39983 24.2209 5.3785 24.2049C5.35716 24.1889 5.34116 24.1675 5.3305 24.1409C5.31983 24.1089 5.31183 24.0715 5.3065 24.0289C5.30116 23.9862 5.2985 23.9409 5.2985 23.8929C5.2985 23.8235 5.30383 23.7649 5.3145 23.7169C5.31983 23.6689 5.33583 23.6315 5.3625 23.6049C5.38383 23.5782 5.41583 23.5649 5.4585 23.5649V24.2289ZM11.6576 24.2289V23.5649H12.6176V24.2289H11.6576ZM10.9136 24.2289V18.5169H11.6576V24.2289H10.9136ZM12.6176 24.2289V23.5649C12.6443 23.5649 12.6683 23.5729 12.6896 23.5889C12.711 23.6049 12.727 23.6262 12.7376 23.6529C12.7483 23.6795 12.7563 23.7142 12.7616 23.7569C12.7723 23.7942 12.7776 23.8395 12.7776 23.8929C12.7776 23.9409 12.7723 23.9862 12.7616 24.0289C12.7563 24.0715 12.7483 24.1089 12.7376 24.1409C12.727 24.1675 12.711 24.1889 12.6896 24.2049C12.6683 24.2209 12.6443 24.2289 12.6176 24.2289ZM16.9587 24.2289C16.7667 24.2289 16.5774 24.1942 16.3907 24.1249C16.2094 24.0502 16.0361 23.9355 15.8707 23.7809L16.3427 23.2849C16.4601 23.3809 16.5667 23.4529 16.6627 23.5009C16.7587 23.5435 16.8574 23.5649 16.9587 23.5649H18.4067L18.0787 23.8849V22.0129C18.0787 21.9169 18.0681 21.7835 18.0467 21.6129C18.0307 21.4369 18.0041 21.2395 17.9667 21.0209C17.9347 20.7969 17.8947 20.5702 17.8467 20.3409L18.5747 20.2209C18.6121 20.4129 18.6494 20.6235 18.6867 20.8529C18.7241 21.0822 18.7561 21.3009 18.7827 21.5089C18.8094 21.7169 18.8227 21.8849 18.8227 22.0129V24.2289H16.9587ZM12.6147 24.2289V23.5649H13.7827L13.5987 23.7489V21.0289H14.3427V24.2289H12.6147ZM14.3427 24.2289V23.5649H15.1747C15.3561 23.5649 15.4921 23.5382 15.5827 23.4849C15.6734 23.4315 15.7374 23.3249 15.7747 23.1649C15.8121 23.0049 15.8307 22.7702 15.8307 22.4609V20.6289H16.5827V22.4609C16.5827 22.8929 16.5321 23.2395 16.4307 23.5009C16.3347 23.7622 16.1854 23.9489 15.9827 24.0609C15.7801 24.1729 15.5107 24.2289 15.1747 24.2289H14.3427ZM12.6147 24.2289C12.5827 24.2289 12.5561 24.2209 12.5347 24.2049C12.5134 24.1889 12.4974 24.1675 12.4867 24.1409C12.4761 24.1089 12.4681 24.0715 12.4627 24.0289C12.4574 23.9862 12.4547 23.9409 12.4547 23.8929C12.4547 23.8235 12.4601 23.7649 12.4707 23.7169C12.4761 23.6689 12.4921 23.6315 12.5187 23.6049C12.5401 23.5782 12.5721 23.5649 12.6147 23.5649V24.2289ZM21.6896 24.2289V23.5969L23.1216 22.1009C23.3456 21.8715 23.5376 21.6662 23.6976 21.4849C23.863 21.2982 23.9883 21.1195 24.0736 20.9489C24.159 20.7729 24.2016 20.5889 24.2016 20.3969C24.2016 20.0715 24.111 19.8475 23.9296 19.7249C23.7536 19.6022 23.4843 19.5409 23.1216 19.5409C22.983 19.5409 22.8283 19.5515 22.6576 19.5729C22.4923 19.5889 22.3323 19.6102 22.1776 19.6369C22.023 19.6582 21.8896 19.6822 21.7776 19.7089L21.7296 19.0929C21.8416 19.0555 21.9803 19.0209 22.1456 18.9889C22.3163 18.9569 22.5003 18.9302 22.6976 18.9089C22.895 18.8822 23.0896 18.8689 23.2816 18.8689C23.847 18.8689 24.271 18.9835 24.5536 19.2129C24.8416 19.4369 24.9856 19.7995 24.9856 20.3009C24.9856 20.5675 24.9456 20.8049 24.8656 21.0129C24.7856 21.2209 24.663 21.4262 24.4976 21.6289C24.3376 21.8262 24.1296 22.0449 23.8736 22.2849L22.5776 23.5729H25.0976V24.2289H21.6896ZM28.4384 24.2289V23.2449H25.9344V22.6689L27.3424 18.9489H28.1984L26.7184 22.5809H28.4384L28.4544 21.0209H29.1984V22.5809H29.8144V23.2449H29.1984V24.2289H28.4384ZM34.4651 26.2129C34.0331 26.2129 33.6411 26.1329 33.2891 25.9729C32.9425 25.8182 32.6678 25.5969 32.4651 25.3089C32.2678 25.0262 32.1691 24.7035 32.1691 24.3409C32.1691 24.2289 32.1771 24.0822 32.1931 23.9009C32.2145 23.7195 32.2385 23.5169 32.2651 23.2929C32.2971 23.0689 32.3291 22.8422 32.3611 22.6129C32.3985 22.3835 32.4331 22.1622 32.4651 21.9489L33.2091 22.0609C33.1505 22.4289 33.0971 22.7675 33.0491 23.0769C33.0065 23.3809 32.9718 23.6422 32.9451 23.8609C32.9238 24.0742 32.9131 24.2342 32.9131 24.3409C32.9131 24.5755 32.9771 24.7835 33.1051 24.9649C33.2331 25.1462 33.4145 25.2875 33.6491 25.3889C33.8838 25.4955 34.1558 25.5489 34.4651 25.5489C34.7745 25.5489 35.0358 25.4982 35.2491 25.3969C35.4678 25.3009 35.6331 25.1675 35.7451 24.9969C35.8571 24.8262 35.9131 24.6235 35.9131 24.3889V18.5169H36.6651V24.3889C36.6651 24.7675 36.5665 25.0929 36.3691 25.3649C36.1718 25.6369 35.9078 25.8449 35.5771 25.9889C35.2465 26.1382 34.8758 26.2129 34.4651 26.2129ZM41.8716 24.2289V23.5649H42.7276V24.2289H41.8716ZM37.5676 24.2289V23.5649H41.5196L41.1276 23.9649V18.5169H41.8716V24.2289H37.5676ZM38.7996 23.5649V19.6449H39.5436V23.5649H38.7996ZM42.7276 24.2289V23.5649C42.7596 23.5649 42.7862 23.5729 42.8076 23.5889C42.8289 23.6049 42.8449 23.6262 42.8556 23.6529C42.8662 23.6795 42.8742 23.7142 42.8796 23.7569C42.8849 23.7942 42.8876 23.8395 42.8876 23.8929C42.8876 23.9409 42.8849 23.9862 42.8796 24.0289C42.8742 24.0715 42.8662 24.1089 42.8556 24.1409C42.8449 24.1675 42.8289 24.1889 42.8076 24.2049C42.7862 24.2209 42.7596 24.2289 42.7276 24.2289ZM42.7241 24.2289V23.5649H46.2281L45.9881 23.7649V21.9169C45.9881 21.5809 45.8815 21.3275 45.6681 21.1569C45.4601 20.9862 45.1348 20.9009 44.6921 20.9009C44.5588 20.9009 44.3668 20.9115 44.1161 20.9329C43.8708 20.9542 43.6095 20.9862 43.3321 21.0289L43.2521 20.4209C43.4708 20.3675 43.7081 20.3222 43.9641 20.2849C44.2201 20.2422 44.4681 20.2209 44.7081 20.2209C45.1241 20.2209 45.4815 20.2875 45.7801 20.4209C46.0841 20.5542 46.3188 20.7489 46.4841 21.0049C46.6495 21.2555 46.7321 21.5595 46.7321 21.9169V24.2289H42.7241ZM42.7241 24.2289C42.6921 24.2289 42.6655 24.2209 42.6441 24.2049C42.6228 24.1889 42.6068 24.1675 42.5961 24.1409C42.5855 24.1089 42.5775 24.0715 42.5721 24.0289C42.5668 23.9862 42.5641 23.9409 42.5641 23.8929C42.5641 23.8235 42.5695 23.7649 42.5801 23.7169C42.5855 23.6689 42.6015 23.6315 42.6281 23.6049C42.6495 23.5782 42.6815 23.5649 42.7241 23.5649V24.2289ZM44.3321 19.6529V18.8769H45.0841V19.6529H44.3321ZM53.4625 24.2289V23.5649H54.3185V24.2289H53.4625ZM49.4785 26.8849C49.4252 26.5862 49.3772 26.3009 49.3345 26.0289C49.2972 25.7569 49.2785 25.5222 49.2785 25.3249C49.2785 24.9622 49.3425 24.6475 49.4705 24.3809C49.6038 24.1195 49.7932 23.9195 50.0385 23.7809C50.2838 23.6369 50.5745 23.5649 50.9105 23.5649C51.0012 23.5649 51.1265 23.5649 51.2865 23.5649C51.4465 23.5649 51.6305 23.5649 51.8385 23.5649C52.0518 23.5649 52.2732 23.5649 52.5025 23.5649C52.7372 23.5649 52.9665 23.5649 53.1905 23.5649L52.7185 23.9889V22.2609C52.7185 21.9142 52.6785 21.6422 52.5985 21.4449C52.5238 21.2475 52.3878 21.1062 52.1905 21.0209C51.9985 20.9355 51.7345 20.8929 51.3985 20.8929C51.1798 20.8929 50.9612 20.9089 50.7425 20.9409C50.5238 20.9675 50.3532 21.0075 50.2305 21.0609L50.6865 20.6129C50.6545 20.7409 50.6225 20.9035 50.5905 21.1009C50.5638 21.2929 50.5398 21.4982 50.5185 21.7169C50.5025 21.9355 50.4945 22.1515 50.4945 22.3649C50.4945 22.5835 50.5025 22.7995 50.5185 23.0129C50.5398 23.2262 50.5612 23.4129 50.5825 23.5729C50.6092 23.7329 50.6305 23.8422 50.6465 23.9009L49.9425 24.1009C49.9212 24.0315 49.8945 23.9115 49.8625 23.7409C49.8305 23.5702 49.8012 23.3675 49.7745 23.1329C49.7532 22.8929 49.7425 22.6369 49.7425 22.3649C49.7425 22.1035 49.7558 21.8502 49.7825 21.6049C49.8092 21.3542 49.8385 21.1275 49.8705 20.9249C49.9078 20.7222 49.9425 20.5595 49.9745 20.4369C50.0972 20.3889 50.2865 20.3409 50.5425 20.2929C50.8038 20.2449 51.0918 20.2209 51.4065 20.2209C51.6945 20.2209 51.9505 20.2475 52.1745 20.3009C52.3985 20.3542 52.5905 20.4342 52.7505 20.5409C52.9158 20.6475 53.0518 20.7809 53.1585 20.9409C53.2652 21.1009 53.3425 21.2929 53.3905 21.5169C53.4385 21.7355 53.4625 21.9862 53.4625 22.2689V24.2289C53.2385 24.2289 52.9958 24.2289 52.7345 24.2289C52.4785 24.2289 52.2278 24.2289 51.9825 24.2289C51.7372 24.2289 51.5185 24.2289 51.3265 24.2289C51.1398 24.2289 51.0012 24.2289 50.9105 24.2289C50.8252 24.2289 50.7318 24.2395 50.6305 24.2609C50.5292 24.2875 50.4305 24.3355 50.3345 24.4049C50.2438 24.4795 50.1692 24.5889 50.1105 24.7329C50.0518 24.8822 50.0225 25.0795 50.0225 25.3249C50.0225 25.5275 50.0412 25.7569 50.0785 26.0129C50.1158 26.2742 50.1585 26.5649 50.2065 26.8849H49.4785ZM54.3185 24.2289V23.5649C54.3505 23.5649 54.3772 23.5729 54.3985 23.5889C54.4198 23.6049 54.4358 23.6262 54.4465 23.6529C54.4572 23.6795 54.4652 23.7142 54.4705 23.7569C54.4758 23.7942 54.4785 23.8395 54.4785 23.8929C54.4785 23.9409 54.4758 23.9862 54.4705 24.0289C54.4652 24.0715 54.4572 24.1089 54.4465 24.1409C54.4358 24.1675 54.4198 24.1889 54.3985 24.2049C54.3772 24.2209 54.3505 24.2289 54.3185 24.2289ZM56.0379 24.2289V23.5649H56.9419V24.2289H56.0379ZM56.9419 24.2289V23.5649C56.9739 23.5649 57.0005 23.5729 57.0219 23.5889C57.0432 23.6049 57.0592 23.6262 57.0699 23.6529C57.0805 23.6795 57.0885 23.7142 57.0939 23.7569C57.0992 23.7942 57.1019 23.8395 57.1019 23.8929C57.1019 23.9409 57.0992 23.9862 57.0939 24.0289C57.0885 24.0715 57.0805 24.1089 57.0699 24.1409C57.0592 24.1675 57.0432 24.1889 57.0219 24.2049C57.0005 24.2209 56.9739 24.2289 56.9419 24.2289ZM54.3179 24.2289C54.2859 24.2289 54.2592 24.2209 54.2379 24.2049C54.2165 24.1889 54.2005 24.1675 54.1899 24.1409C54.1792 24.1089 54.1712 24.0715 54.1659 24.0289C54.1605 23.9862 54.1579 23.9409 54.1579 23.8929C54.1579 23.8235 54.1632 23.7649 54.1739 23.7169C54.1792 23.6689 54.1952 23.6315 54.2219 23.6049C54.2432 23.5782 54.2752 23.5649 54.3179 23.5649V24.2289ZM54.3179 24.2289V23.5649H55.6779L55.2939 23.8689V20.2209H56.0379V24.2289H54.3179ZM54.6299 25.7409V24.9649H55.3659V25.7409H54.6299ZM55.8219 25.7409V24.9649H56.5579V25.7409H55.8219ZM58.6389 24.2289V23.5649H59.5029V24.2289H58.6389ZM56.9429 24.2289C56.9109 24.2289 56.8842 24.2209 56.8629 24.2049C56.8415 24.1889 56.8255 24.1675 56.8149 24.1409C56.8042 24.1089 56.7962 24.0715 56.7909 24.0289C56.7855 23.9862 56.7829 23.9409 56.7829 23.8929C56.7829 23.8235 56.7882 23.7649 56.7989 23.7169C56.8042 23.6689 56.8202 23.6315 56.8469 23.6049C56.8682 23.5782 56.9002 23.5649 56.9429 23.5649V24.2289ZM57.8949 24.2289V18.5169H58.6389V24.2289H57.8949ZM56.9429 24.2289V23.5649H57.8949V24.2289H56.9429ZM59.5029 24.2289V23.5649C59.5295 23.5649 59.5535 23.5729 59.5749 23.5889C59.5962 23.6049 59.6122 23.6262 59.6229 23.6529C59.6335 23.6795 59.6415 23.7142 59.6469 23.7569C59.6575 23.7942 59.6629 23.8395 59.6629 23.8929C59.6629 23.9409 59.6575 23.9862 59.6469 24.0289C59.6415 24.0715 59.6335 24.1089 59.6229 24.1409C59.6122 24.1675 59.5962 24.1889 59.5749 24.2049C59.5535 24.2209 59.5295 24.2289 59.5029 24.2289ZM65.7134 24.2289V23.5649H66.5694V24.2289H65.7134ZM59.5054 24.2289C59.4734 24.2289 59.4467 24.2209 59.4254 24.2049C59.404 24.1889 59.388 24.1675 59.3774 24.1409C59.3667 24.1089 59.3587 24.0715 59.3534 24.0289C59.348 23.9862 59.3454 23.9409 59.3454 23.8929C59.3454 23.8235 59.3507 23.7649 59.3614 23.7169C59.3667 23.6689 59.3827 23.6315 59.4094 23.6049C59.4307 23.5782 59.4627 23.5649 59.5054 23.5649V24.2289ZM63.8494 24.2289C63.6574 24.2289 63.468 24.1942 63.2814 24.1249C63.1 24.0502 62.9267 23.9355 62.7614 23.7809L63.2334 23.2849C63.3507 23.3809 63.4574 23.4529 63.5534 23.5009C63.6494 23.5435 63.748 23.5649 63.8494 23.5649H65.2974L64.9694 23.8849V22.0129C64.9694 21.9169 64.9587 21.7835 64.9374 21.6129C64.9214 21.4369 64.8947 21.2395 64.8574 21.0209C64.8254 20.7969 64.7854 20.5702 64.7374 20.3409L65.4654 20.2209C65.5027 20.4129 65.54 20.6235 65.5774 20.8529C65.6147 21.0822 65.6467 21.3009 65.6734 21.5089C65.7 21.7169 65.7134 21.8849 65.7134 22.0129V24.2289H63.8494ZM59.5054 24.2289V23.5649H60.6734L60.4894 23.7489V21.0289H61.2334V24.2289H59.5054ZM61.2334 24.2289V23.5649H62.0654C62.2467 23.5649 62.3827 23.5382 62.4734 23.4849C62.564 23.4315 62.628 23.3249 62.6654 23.1649C62.7027 23.0049 62.7214 22.7702 62.7214 22.4609V20.6289H63.4734V22.4609C63.4734 22.8929 63.4227 23.2395 63.3214 23.5009C63.2254 23.7622 63.076 23.9489 62.8734 24.0609C62.6707 24.1729 62.4014 24.2289 62.0654 24.2289H61.2334ZM66.5694 24.2289V23.5649C66.6014 23.5649 66.628 23.5729 66.6494 23.5889C66.6707 23.6049 66.6867 23.6262 66.6974 23.6529C66.708 23.6795 66.716 23.7142 66.7214 23.7569C66.7267 23.7942 66.7294 23.8395 66.7294 23.8929C66.7294 23.9409 66.7267 23.9862 66.7214 24.0289C66.716 24.0715 66.708 24.1089 66.6974 24.1409C66.6867 24.1675 66.6707 24.1889 66.6494 24.2049C66.628 24.2209 66.6014 24.2289 66.5694 24.2289ZM68.2879 24.2289V23.5649H69.1919V24.2289H68.2879ZM69.1919 24.2289V23.5649C69.2239 23.5649 69.2505 23.5729 69.2719 23.5889C69.2932 23.6049 69.3092 23.6262 69.3199 23.6529C69.3305 23.6795 69.3385 23.7142 69.3439 23.7569C69.3492 23.7942 69.3519 23.8395 69.3519 23.8929C69.3519 23.9409 69.3492 23.9862 69.3439 24.0289C69.3385 24.0715 69.3305 24.1089 69.3199 24.1409C69.3092 24.1675 69.2932 24.1889 69.2719 24.2049C69.2505 24.2209 69.2239 24.2289 69.1919 24.2289ZM66.5679 24.2289C66.5359 24.2289 66.5092 24.2209 66.4879 24.2049C66.4665 24.1889 66.4505 24.1675 66.4399 24.1409C66.4292 24.1089 66.4212 24.0715 66.4159 24.0289C66.4105 23.9862 66.4079 23.9409 66.4079 23.8929C66.4079 23.8235 66.4132 23.7649 66.4239 23.7169C66.4292 23.6689 66.4452 23.6315 66.4719 23.6049C66.4932 23.5782 66.5252 23.5649 66.5679 23.5649V24.2289ZM66.5679 24.2289V23.5649H67.9279L67.5439 23.8689V20.2209H68.2879V24.2289H66.5679ZM66.9519 19.5009V18.7249H67.6879V19.5009H66.9519ZM68.1439 19.5009V18.7249H68.8799V19.5009H68.1439ZM70.1449 24.2289V18.5169H70.8889V24.2289H70.1449ZM69.1929 24.2289V23.5649H70.1449V24.2289H69.1929ZM69.1929 24.2289C69.1609 24.2289 69.1342 24.2209 69.1129 24.2049C69.0915 24.1889 69.0755 24.1675 69.0649 24.1409C69.0542 24.1089 69.0462 24.0715 69.0409 24.0289C69.0355 23.9862 69.0329 23.9409 69.0329 23.8929C69.0329 23.8235 69.0382 23.7649 69.0489 23.7169C69.0542 23.6689 69.0702 23.6315 69.0969 23.6049C69.1182 23.5782 69.1502 23.5649 69.1929 23.5649V24.2289ZM72.2417 24.2289V18.5169H72.9857V24.2289H72.2417Z"
                  fill="#121212"
                />
              </svg>
            </div>
          ) : <div className="w-7 h-7"></div>}
        </div>
        <div>
          {/* Product Name */}
          <h2 className="text-sm line-clamp-2 font-normal lg:h-auto h-10">
            <span className="font-bold after:mx-1 after:content-['•']">
              {productBrand}
            </span>
            {productTitle}
          </h2>
        </div>
        {/* Product Code */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-normal">
            <span className="font-bold after:ml-1">{brandCodeText}</span>{" "}
            <button
              onClick={() => {
                handleCopy(), handleCopyPopup(brandCodeNoText);
              }}
              className="inline-flex items-center gap-1 border-0 outline-none"
              aria-label="Copy to clipboard"
            >
              {brandCodeNoText}
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.6223 7.23994C13.8728 7.23994 14.113 7.33944 14.2901 7.51656C14.4672 7.69368 14.5667 7.9339 14.5667 8.18438V13.851C14.5667 14.1015 14.4672 14.3418 14.2901 14.5189C14.113 14.696 13.8728 14.7955 13.6223 14.7955H7.95562C7.70514 14.7955 7.46492 14.696 7.2878 14.5189C7.11068 14.3418 7.01118 14.1015 7.01118 13.851V8.18438C7.01118 7.9339 7.11068 7.69368 7.2878 7.51656C7.46492 7.33944 7.70514 7.23994 7.95562 7.23994H13.6223ZM13.6223 8.18438H7.95562V13.851H13.6223V8.18438ZM9.84451 3.46216C10.095 3.46216 10.3352 3.56166 10.5123 3.73878C10.6895 3.9159 10.789 4.15612 10.789 4.4066V5.82327C10.789 5.94851 10.7392 6.06862 10.6506 6.15718C10.5621 6.24574 10.442 6.29549 10.3167 6.29549C10.1915 6.29549 10.0714 6.24574 9.98282 6.15718C9.89426 6.06862 9.84451 5.94851 9.84451 5.82327V4.4066H4.17784V10.0733H5.59451C5.71975 10.0733 5.83986 10.123 5.92842 10.2116C6.01698 10.3001 6.06673 10.4203 6.06673 10.5455C6.06673 10.6707 6.01698 10.7908 5.92842 10.8794C5.83986 10.968 5.71975 11.0177 5.59451 11.0177H4.17784C3.92736 11.0177 3.68714 10.9182 3.51002 10.7411C3.3329 10.564 3.2334 10.3238 3.2334 10.0733V4.4066C3.2334 4.15612 3.3329 3.9159 3.51002 3.73878C3.68714 3.56166 3.92736 3.46216 4.17784 3.46216H9.84451Z"
                  fill="black"
                />
              </svg>
            </button>
          </h2>
          <Image
            src={productBrandImage}
            alt={productBrand}
            title={productBrand}
            loading="lazy"
            width={0}
            height={0}
            className="w-[4.625rem] h-7 object-contain object-center"
            sizes="100vh"
          />
        </div>

        {/* Product Specification Images */}
        {productSpecificationImageOne ||
        productSpecificationImageTwo ||
        productSpecificationImageThree ||
        productSpecificationImageFour ||
        productSpecificationImageFive ||
        productSpecificationImageSix ? (
          <>
            <div className="flex justify-center py-1.5 bg-[#D9F1FF] rounded-md mb-3">
              <div className="prodTop_verticalImgs flex items-center gap-2">
                {productSpecificationImageOne ? (
                  <Image
                    src={productSpecificationImageOne}
                    alt={`specification-${productTitle}`}
                    decoding="async"
                    data-nimg="1"
                    title={`Specification ${productTitle}`}
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    quality={100}
                    className="specificationImagesProduct md:w-[36px] md:h-[26px] w-[24px] h-[18px] rounded-[.25rem]"
                  />
                ) : null}
                {productSpecificationImageTwo ? (
                  <Image
                    src={productSpecificationImageTwo}
                    alt={`specification-${productTitle}`}
                    decoding="async"
                    data-nimg="1"
                    title={`Specification ${productTitle}`}
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    quality={100}
                    className="specificationImagesProduct md:w-[36px] md:h-[26px] w-[24px] h-[18px] rounded-[.25rem]"
                  />
                ) : null}
                {productSpecificationImageThree ? (
                  <Image
                    src={productSpecificationImageThree}
                    alt={`specification-${productTitle}`}
                    decoding="async"
                    data-nimg="1"
                    title={`Specification ${productTitle}`}
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    quality={100}
                    className="specificationImagesProduct md:w-[36px] md:h-[26px] w-[24px] h-[18px] rounded-[.25rem]"
                  />
                ) : null}
                {productSpecificationImageFour ? (
                  <Image
                    src={productSpecificationImageFour}
                    alt={`specification-${productTitle}`}
                    decoding="async"
                    data-nimg="1"
                    title={`Specification ${productTitle}`}
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    quality={100}
                    className="specificationImagesProduct md:w-[36px] md:h-[26px] w-[24px] h-[18px] rounded-[.25rem]"
                  />
                ) : null}
                {productSpecificationImageFive ? (
                  <Image
                    src={productSpecificationImageFive}
                    alt={`specification-${productTitle}`}
                    decoding="async"
                    data-nimg="1"
                    title={`Specification ${productTitle}`}
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    quality={100}
                    className="specificationImagesProduct md:w-[36px] md:h-[26px] w-[24px] h-[18px] rounded-[.25rem]"
                  />
                ) : null}
                {productSpecificationImageSix ? (
                  <Image
                    src={productSpecificationImageSix}
                    alt={`specification-${productTitle}`}
                    decoding="async"
                    data-nimg="1"
                    title={`Specification ${productTitle}`}
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    quality={100}
                    className="specificationImagesProduct md:w-[36px] md:h-[26px] w-[24px] h-[18px] rounded-[.25rem] hidden md:block"
                  />
                ) : null}
              </div>
            </div>
          </>
        ) : <div className="h-[2.375rem] rounded-[.25rem] mb-3"></div>}

        {/* Price Section */}
        <div className="px-1.5 py-1 rounded-md relative mb-1.5 bg-[#D9F1FF] h-[3.375rem]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <h3 className="afterDiscount text-[1rem] leading-[.75rem] font-bold text-orangePrice">
                <div className="flex gap-0.5 items-center">
                  {productSalePrice > 0 ? (
                    <>{productSalePrice.toLocaleString("en-US")}</>
                  ) : (
                    <>{productRegularPrice.toLocaleString("en-US")}</>
                  )}
                  <svg
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.6848 10.5385C6.51378 10.918 6.40073 11.3297 6.35742 11.7615L9.97652 10.9917C10.1475 10.6124 10.2605 10.2006 10.3039 9.7688L6.6848 10.5385Z"
                      fill="#F0660C"
                    />
                    <path
                      d="M10.7287 8.86257C10.9072 8.47975 11.0251 8.06413 11.0703 7.62838L8.12869 8.23381V7.06995L10.7286 6.53527C10.9071 6.15246 11.025 5.73684 11.0702 5.30108L8.1286 5.906V1.7204C7.67785 1.96531 7.27755 2.29131 6.95214 2.67585V6.14807L5.77569 6.39005V1.15112C5.32494 1.39595 4.92464 1.72204 4.59923 2.10657V6.63195L1.96691 7.17325C1.78846 7.55606 1.67042 7.97168 1.62514 8.40744L4.59923 7.79581V9.26148L1.41191 9.91693C1.23346 10.2997 1.1155 10.7154 1.07031 11.1511L4.40655 10.465C4.67814 10.4104 4.91156 10.255 5.06332 10.0411L5.67517 9.16335V9.16317C5.73868 9.07236 5.77569 8.96286 5.77569 8.84492V7.55383L6.95214 7.31184V9.63957L10.7286 8.8624L10.7287 8.86257Z"
                      fill="#F0660C"
                    />
                  </svg>
                </div>
              </h3>
              <div className="flex items-center mt-0.5">
                <h3 className="realPrice text-xs text-[#727272] line-through decoration-orangePrice leading-3 flex items-center gap-x-0.5 font-semibold">
                  {productRegularPrice}
                  <svg
                    width="9"
                    height="10"
                    viewBox="0 0 9 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.59914 8.4046C5.45552 8.72323 5.36059 9.06901 5.32422 9.43162L8.36348 8.78519C8.50709 8.46664 8.60196 8.12079 8.6384 7.75818L5.59914 8.4046Z"
                      fill="#727272"
                    />
                    <path
                      d="M8.36705 6.84493C8.51067 6.52638 8.6056 6.18053 8.64197 5.81792L6.27448 6.32172V5.35323L8.36697 4.90831C8.51059 4.58976 8.60553 4.24391 8.6419 3.8813L6.27441 4.38467V0.901693C5.91164 1.10549 5.58947 1.37677 5.32758 1.69676V4.58611L4.38074 4.78747V0.427979C4.01797 0.631705 3.69579 0.903054 3.4339 1.22304V4.98876L1.31535 5.43919C1.17173 5.75775 1.07673 6.1036 1.04028 6.46621L3.4339 5.95725V7.17688L0.868673 7.7223C0.725054 8.04086 0.63012 8.38671 0.59375 8.74932L3.27883 8.1784C3.49741 8.13291 3.68527 8.00361 3.80741 7.82567L4.29984 7.09522V7.09508C4.35096 7.01951 4.38074 6.92839 4.38074 6.83025V5.75589L5.32758 5.55452V7.4915L8.36697 6.84479L8.36705 6.84493Z"
                      fill="#727272"
                    />
                  </svg>
                </h3>
              </div>
            </div>
            <div className="offerPercent text-[.625rem] leading-[.625rem] font-bold px-2 py-[.3125rem] bg-white rounded shadow-[0_0_0.89px_0_#AC040840]">
              <span className="text-orangePrice flex items-center gap-0.5">
                {productDiscountValue} {productDiscountType}
              </span>
            </div>
          </div>
          <span className="animated_orangePrice text-orangePrice text-[.6875rem] font-bold animationImp">
            {salePormotionText}
          </span>
        </div>
        {/* Payment Split Option */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-xs">{buyNowText}</h2>
          <Link className="" href="">
            <Image
              src={installmentMethodsImages}
              alt={installmentMethods}
              title={installmentMethods}
              loading="lazy"
              width={0}
              height={0}
              className="w-36 h-5"
              decoding="async"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
            />
          </Link>
        </div>
        {/* Rating Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-[#737373] text-[.625rem] gap-1">
            {productData?.totalrating > 0 ? (
              <>
                {ratingText}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Number(productData?.rating) }).map(
                    (_, i) => (
                      <span key={i}>
                        <svg
                          width="13"
                          height="12"
                          viewBox="0 0 13 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.00722 9.68738C6.82753 9.58159 6.6046 9.58159 6.4249 9.68738L3.63545 11.3294C3.19737 11.5873 2.66504 11.1904 2.78715 10.697L3.52981 7.69574C3.58284 7.48149 3.50829 7.25581 3.33809 7.11529L0.925653 5.12352C0.52746 4.79476 0.732039 4.14844 1.24688 4.10869L4.45509 3.86095C4.66757 3.84454 4.85346 3.71176 4.93788 3.51609L6.18908 0.616336C6.38846 0.154255 7.04366 0.154255 7.24304 0.616338L8.49424 3.51609C8.57867 3.71176 8.76455 3.84454 8.97703 3.86094L12.1858 4.10869C12.7006 4.14844 12.9052 4.79482 12.5069 5.12355L10.0941 7.11529C9.92385 7.25581 9.84929 7.48151 9.90231 7.69579L10.645 10.697C10.7671 11.1904 10.2347 11.5873 9.79667 11.3294L7.00722 9.68738Z"
                            fill="#FFC107"
                          />
                        </svg>
                      </span>
                    )
                  )}
                </div>
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-1.5">
            {timerText && 
            <>
            <span className="text-[#F00C0C] text-sm font-medium tracking-[0.16px]">
              <FlashSaleTimer expiryTimestamp={productData.flash_sale_expiry} />
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.73889 13.4101C3.48621 13.3672 0.859806 10.7408 0.816935 7.48812C0.859806 4.23544 3.48621 1.60904 6.73889 1.56616C9.99157 1.60904 12.618 4.23544 12.6608 7.48812C12.618 10.7408 9.99157 13.3672 6.73889 13.4101ZM6.73889 2.88215C4.20901 2.91546 2.16623 4.95824 2.13292 7.48812C2.16623 10.018 4.20901 12.0608 6.73889 12.0941C9.26877 12.0608 11.3115 10.018 11.3449 7.48812C11.3115 4.95824 9.26877 2.91546 6.73889 2.88215ZM10.0289 8.14611H6.08089V4.19814H7.39688V6.83012H10.0289V8.14611ZM12.195 3.34801L10.2151 1.37403L11.1422 0.44165L13.1228 2.41564L12.195 3.34736V3.34801ZM1.28214 3.34801L0.351074 2.41564L2.31914 0.44165L3.2502 1.37403L1.28345 3.34801H1.28214Z"
                fill="#F00C0C"
              />
            </svg>
            </>
            }
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 w-full">
          <button className="w-fit text-sm !leading-[.875rem] px-10 py-2.5 rounded-[.875rem] selected bg-[#004B7A] !text-white transition-all duration-300 ease-in-out"
            onClick={() => {
                if (fGiftType == 0) {
                  addToCart(productData.id, 0, true, true);
                } else if (fGift) {
                  router.push(productSlug);
                } else {
                  addToCart(productData.id, 0, true, true);
                }
                handleGTMAddToCart()
              }}
          >
            {btnCheckoutText}
          </button>
          <div className="flex items-center gap-1.5">
            <button className="text-xs font-bold text-primary" onClick={() => router.push(productSlug)}>
              {btndiscoverText}
            </button>
            <svg
              width="9"
              height="15"
              viewBox="0 0 12 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${isArabic ? "rotate-0" : "rotate-180"}`}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.85159 3.39646C9.80158 3.34632 9.74217 3.30654 9.67676 3.27939C9.61135 3.25225 9.54122 3.23828 9.47041 3.23828C9.39959 3.23828 9.32946 3.25225 9.26405 3.27939C9.19864 3.30654 9.13923 3.34632 9.08922 3.39646L2.62844 9.85724C2.5783 9.90725 2.53852 9.96666 2.51138 10.0321C2.48424 10.0975 2.47026 10.1676 2.47026 10.2384C2.47026 10.3092 2.48424 10.3794 2.51138 10.4448C2.53852 10.5102 2.5783 10.5696 2.62844 10.6196L9.08922 17.0804C9.19032 17.1815 9.32743 17.2383 9.47041 17.2383C9.61338 17.2383 9.75049 17.1815 9.85159 17.0804C9.95269 16.9793 10.0095 16.8422 10.0095 16.6992C10.0095 16.5562 9.95269 16.4191 9.85159 16.318L3.77092 10.2384L9.85159 4.15883C9.90173 4.10882 9.94151 4.0494 9.96865 3.98399C9.99579 3.91858 10.0098 3.84846 10.0098 3.77764C10.0098 3.70682 9.99579 3.6367 9.96865 3.57129C9.94151 3.50588 9.90173 3.44647 9.85159 3.39646Z"
                fill="#004B7A"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
