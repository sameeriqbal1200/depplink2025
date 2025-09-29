"use client";
import React, { useEffect, useState, useContext } from "react";

import Link from "next/link";
import Image from "next/image";
import GlobalContext from "../../GlobalContext";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useRouter } from "next-nprogress-bar";
import { setCartItems } from "../../cartstorage/cart";
import { cacheKey } from "@/app/GlobalVar";
import FlashSaleTimer from "./FlashSaleTimer";
import {
  addProductWishlistData,
  removeProductWishlistData,
} from "@/lib/components/component.client";
import HeartIcon from "@/components/Icons/HeartIcon";
import { useApp } from "@/app/_ctx/AppContext";
import SARIcon from "../Icons/SARIcon";
import StarIcon from "../Icons/StarIcon";
import CopyIcon from "../Icons/CopyIcon";
import ClockIcon from "../Icons/ClockIcon";

export default function product_component_updated(props: any) {
  const router = useRouter();
  const origin = props?.origin;
  const isArabic = props?.lang;
  const NewMedia = props?.NewMedia;
  const { deviceDetail } = useApp();
  const isMobileOrTablet = props?.isMobileOrTablet;
  var productData: any = props?.productData;
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [newFreeGiftData, setnewFreeGiftData] = useState<any>(
    productData?.multi_free_gift_data
  );
  const gtmNewListId = props?.gtmColumnItemListId;
  const gtmNewListName = props?.gtmColumnItemListName;
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
  //Product Dynamic Data
  // const ExpressIcon = ({ isArabic }: { isArabic: boolean }) => {
  //   const expressIcon = isArabic
  //     ? "/icons/express_logo/express_w.webp"
  //     : "/icons/express_logo/express_en_w.webp";

  //   return (
  //     <div
  //       className="inline-block w-10 h-10 bg-contain bg-center bg-no-repeat"
  //       style={{ backgroundImage: `url(${expressIcon})` }}
  //     />
  //   );
  // };
  // const expressIcon = isArabic
  //   ? "/icons/express_logo/express_w.webp"
  //   : "/icons/express_logo/express_en_w.webp";
  const installmentMethodsImages = isArabic
    ? `/icons/installment-3.webp?v=${cacheKey}`
    : `/icons/installment-3.webp?v=${cacheKey}`;
  const expressTitle = isArabic ? "توصيل سريع" : "Express Delivery";
  const productBadgeTop = isArabic
    ? productData?.badge_left_arabic
    : productData?.badge_left;
  const productBadgeInsideText = isArabic
    ? productData?.badge_right_arabic
    : productData?.badge_right;
  const productBadgeInsideColor = "#004B7A";
  const productBadgeBackgroundColor = "#d8f0ff";
  const productBadgeLeftBackgroundColor = productData?.badge_left_color
    ? productData?.badge_left_color
    : "#EA4335";
  const productBadgeRightBackgroundColor = productData?.badge_right_color
    ? productData?.badge_right_color
    : "#004B7A";
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

  var productFlashSalePriceStatus = 0; // 1 for flash sale price, 0 for no flash sale price
  var productFlashSalePrice = 0;
  // var productFlashSaleTimer = "10:41:04";
  var productFlashSaleTimer: any = false;

  if (productData?.flash_sale_expiry && productData?.flash_sale_price) {
    var timer = calculateTimeLeft(productData?.flash_sale_expiry);
    if (!timer?.expired) {
      productFlashSalePriceStatus = 1;
      productFlashSalePrice = productData?.flash_sale_price;
      productFlashSaleTimer = `${timer?.hours}{" "}:{" "}${timer?.minutes}{" "}:{" "}${timer?.seconds}`;
      if (productData) {
        productData.sale_price = productData.flash_sale_price;
      }
    }
  }
  const salePormotionPriceSatus =
    productData?.promotional_price == null &&
    productData?.promotional_price >= 0
      ? 0
      : 1; // 1 for sale, 0 for no sale This is for dummy value only
  const salePormotionPriceOnly = productData?.promotional_price;
  const salePormotionText = isArabic
    ? productData?.promo_title_arabic
    : productData?.promo_title;

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
  const percentage =
    productData?.save_type === "1" || productData?.save_type === 1 ? 1 : 0; // 1 for percentage, 0 for amount
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
      ? Math.round(((regularPrice - salePrice) * 100) / regularPrice)
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

  const installmentMethods = isArabic ? "طرق الدفع" : "Payment";
  const installmentMethodsText = isArabic
    ? "قسطها ع كيفك, إشتري الأن وإدفع لاحقا"
    : "Split it your way buy now pay later!";
  const giftAvailableText = isArabic ? "هدية" : "Gift";
  const buttonTextCheckout = isArabic ? "شراء الأن" : "Checkout Now";
  const codeText = isArabic ? "كود" : "Code";

  const [timeLeft, setTimeLeft] = useState("");
  const [countdownTarget] = useState(() => {
    // Set your custom countdown target here (e.g., 1 day, 3 hours, 15 minutes)
    const days = 1;
    const hours = 3;
    const minutes = 15;
    const futureTime = productData?.flash_sale_expiry;
    return new Date(futureTime);
  });
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = countdownTarget.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft("00:00:00");
        return;
      }
      const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimeLeft(
        `${hrs.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [countdownTarget]);

  const [ProExtraData, setProExtraData] = useState<any>([]);
  const [ProWishlistData, setProWishlistData] = useState<any>([]);
  const [ProComparetData, setProComparetData] = useState<any>([]);
  const { updateCompare, setUpdateCompare } = useContext(GlobalContext);
  const { updateWishlist, setUpdateWishlist } = useContext(GlobalContext);
  const [buyNowLoading, setBuyNowLoading] = useState<number>(0);
  const [extraData, setExtraData] = useState<any>([]);
  const [selectedProductId, setSelectedProductId] = useState<any>(false);
  const [selectedProductKey, setSelectedProductKey] = useState<any>(false);
  const [selectedGifts, setselectedGifts] = useState<any>({});
  const [allowed_gifts, setallowed_gifts] = useState(0);
  const [cartid, setcartid] = useState(false);
  const [cartkey, setcartkey] = useState(false);

  useEffect(() => {
    setProExtraData(props?.ProExtraData);
  }, [props?.ProExtraData]);

  useEffect(() => {
    if (localStorage.getItem("userWishlist")) {
      var wdata: any = localStorage.getItem("userWishlist");
      if (wdata && wdata !== "undefined") {
        setProWishlistData(JSON.parse(wdata));
      }
    }
    if (localStorage.getItem("userCompare")) {
      var cdata: any = localStorage.getItem("userCompare");
      if (cdata && cdata !== "undefined") {
        setProComparetData(JSON.parse(cdata));
      }
    }
    window.addEventListener("storage", () => {
      refetch();
    });
    return () => {
      window.removeEventListener("storage", () => {
        refetch();
      });
    };
  }, []);

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
      position: isArabic ? "top-start" : "top-end",
      showConfirmButton: false,
      timer: 15000,
      showCloseButton: true,
      background: "#DC4E4E",
      color: "#FFFFFF",
      timerProgressBar: true,
    });
  };
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

  const refetch = () => {
    if (localStorage.getItem("userWishlist")) {
      var wdata: any = localStorage.getItem("userWishlist");
      if (wdata && wdata !== "undefined") {
        setProWishlistData(JSON.parse(wdata));
      }
    } else if (ProWishlistData.length) {
      setProWishlistData([]);
    }

    if (localStorage.getItem("userCompare")) {
      var cdata: any = localStorage.getItem("userCompare");
      if (cdata && cdata !== "undefined") {
        setProComparetData(JSON.parse(cdata));
      }
    } else if (ProComparetData.length) {
      setProComparetData([]);
    }
  };

  const WishlistProduct = async (id: any, type: boolean) => {
    if (localStorage.getItem("userid")) {
      var data = {
        user_id: localStorage.getItem("userid"),
        product_id: id,
      };
      if (type) {
        const RemoveData = await removeProductWishlistData(data);
        if (RemoveData?.removeWishlistData?.success) {
          var wishlistRemovetext = isArabic
            ? "تمت إزالة هذا المنتج من قائمة الرغبات."
            : "This product has been removed from wishlist.";
          topMessageAlartDanger(wishlistRemovetext);
          if (localStorage.getItem("wishlistCount")) {
            var wishlistlength: any = localStorage.getItem("wishlistCount");
            wishlistlength = parseInt(wishlistlength) - 1;
            localStorage.setItem("wishlistCount", wishlistlength);
          }
          localStorage.removeItem("userWishlist");
          setUpdateWishlist(updateWishlist == 0 ? 1 : 0);
        }
      } else {
        const AddData = await addProductWishlistData(data);
        if (AddData?.addWishlistData?.success) {
          var wishlistAddtext = isArabic
            ? "تمت إضافة هذا المنتج إلى قائمة الرغبات."
            : "This product has been Added in the wishlist.";
          topMessageAlartSuccess(wishlistAddtext);
          if (localStorage.getItem("wishlistCount")) {
            var wishlistlength: any = localStorage.getItem("wishlistCount");
            wishlistlength = parseInt(wishlistlength) + 1;
            localStorage.setItem("wishlistCount", wishlistlength);
          }
          localStorage.removeItem("userWishlist");
          setUpdateWishlist(updateWishlist == 0 ? 1 : 0);
        }
      }
    } else {
      router.push(`${origin}/${isArabic ? "ar" : "en"}/login`);
    }
  };

  const fGift = ProExtraData?.freegiftData;
  const fGiftType =
    fGift && fGift?.freegiftlist?.length == fGift?.allowed_gifts ? 0 : 1;

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
        item_list_id: gtmNewListId ?? "50000",
        item_list_name: gtmNewListName ?? "direct",
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
            item_list_id: gtmNewListId ?? "50000",
            item_list_name: gtmNewListName ?? "direct",
          };
          gifts.push(giftitem);
        }
      }

      // new free gift
      var newGifts: any = false;
      if (newFreeGiftData?.length >= 1) {
        newGifts = [];
        for (let index = 0; index < newFreeGiftData.length; index++) {
          const element = newFreeGiftData[index];
          newGifts.push({
            id: element?.product_sku_data.id,
            sku: element?.product_sku_data.sku,
            name: element?.product_sku_data.name,
            name_arabic: element?.product_sku_data.name_arabic,
            image: element?.product_sku_data?.featured_image
              ? `${NewMedia}${element?.product_sku_data?.featured_image?.image}`
              : "https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png",
            price: element?.product_sku_data.price,
            regular_price: 0,
            quantity: 1 * element?.free_gift_qty,
            discounted_amount: 0,
            slug: element?.product_sku_data?.slug,
            pre_order: 0,
            pre_order_day: false,
            new_gift: true,
            gift_quantity: element?.free_gift_qty,
            item_list_id: gtmNewListId ?? "50000",
            item_list_name: gtmNewListName ?? "direct",
          });
        }
      }

      // Finally merge them
      const allGifts: any = [
        ...(Array.isArray(gifts) ? gifts : []),
        ...(Array.isArray(newGifts) ? newGifts : []),
      ];

      var fbt: any = false;

      setCartItems(item, allGifts, fbt);
      topMessageAlartSuccess(
        isArabic ? "اضـافـة الـي العـربــة" : "Add to Cart",
        true
      );
      setBuyNowLoading(0);
      if (redirect) {
        router.push(`/${isArabic ? "ar" : "en"}/cart`); // Redirect to cart page
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
        item_list_id: gtmNewListId ?? "50000",
        item_list_name: gtmNewListName ?? "direct",
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
                item_list_id: gtmNewListId ?? "50000",
                item_list_name: gtmNewListName ?? "direct",
              };
              gifts.push(giftitem);
            }
          }
        }
      }

      // new free gift
      var newGifts: any = false;
      if (newFreeGiftData?.length >= 1) {
        newGifts = [];
        for (let index = 0; index < newFreeGiftData.length; index++) {
          const element = newFreeGiftData[index];
          newGifts.push({
            id: element?.product_sku_data.id,
            sku: element?.product_sku_data.sku,
            name: element?.product_sku_data.name,
            name_arabic: element?.product_sku_data.name_arabic,
            image: element?.product_sku_data?.featured_image
              ? `${NewMedia}${element?.product_sku_data?.featured_image?.image}`
              : "https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png",
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
            item_list_id: gtmNewListId ?? "50000",
            item_list_name: gtmNewListName ?? "direct",
          });
        }
      }

      // Finally merge them
      const allGifts: any = [
        ...(Array.isArray(gifts) ? gifts : []),
        ...(Array.isArray(newGifts) ? newGifts : []),
      ];

      var fbt: any = false;

      setCartItems(item, allGifts, fbt);
      topMessageAlartSuccess(
        isArabic ? "اضـافـة الـي العـربــة" : "Add to Cart",
        true
      );
      setBuyNowLoading(0);
      if (redirect) {
        router.push(`/${isArabic ? "ar" : "en"}/cart`); // Redirect to cart page
        router.refresh();
      }
    }
  };

  const giftAvailableImage = productData?.gift_image
    ? productData?.gift_image
    : null;

  const pushGTMEvent = (eventName: string) => {
    if (typeof window !== "undefined" && window.dataLayer) {
      // Clear previous ecommerce data
      window.dataLayer.push({ ecommerce: null });
      const getOriginalPrice = () => {
        if (!productData?.flash_sale_price && !productData?.sale_price)
          return productData?.price;
        return productData?.price;
      };
      const getDiscountedPrice = () => {
        let salePrice =
          productData?.sale_price > 0
            ? productData?.sale_price
            : productData?.price;
        if (productData?.promotional_price > 0) {
          salePrice = Math.max(
            0,
            Number(salePrice) - Number(productData?.promotional_price)
          );
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
        platform: deviceDetail,
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
            },
          ],
        },
      });
    }
  };

  const handleGTMAddToCart = () => {
    pushGTMEvent("add_to_cart");
  };
  const productBrandImage: any = productData?.brand?.brand_media_image?.image
    ? `${NewMedia}${productData?.brand?.brand_media_image?.image}`
    : null;
  const btndiscoverText = isArabic ? "اكتشف المزيد" : "Discover More";
  const ratingText = isArabic
    ? `${productData?.rating} ( تقيم )`
    : `${productData?.rating} ( Rating )`;

  var timerText = null;
  if (productData?.flash_sale_expiry && productData?.flash_sale_price) {
    var timer = calculateTimeLeft(productData?.flash_sale_expiry);
    if (!timer?.expired) {
      timerText = productData?.flash_sale_expiry;
      productFlashSalePriceStatus = 1;
      productFlashSalePrice = productData?.flash_sale_price;
      productFlashSaleTimer = `${timer?.hours}{" "}:{" "}${timer?.minutes}{" "}:{" "}${timer?.seconds}`;
      if (productData) {
        productData.sale_price = productData.flash_sale_price;
      }
    }
  }

  const giftText = isArabic ? "هدية" : "Gift";

  let imgAbsoluteTextOne = "";
  let imgAbsoluteTextTwo = "";
  let imgAbsoluteTextThree = "";
  let imgAbsoluteTextFour = "";

  const specs =
    productData?.features && productData?.features.length > 0
      ? productData?.features
      : [];
  if (specs.length >= 1) {
    const first = specs[0];
    imgAbsoluteTextOne = isArabic
      ? `${first?.feature_ar || ""} `
      : `${first?.feature_en || ""} `;
  }

  if (specs.length >= 2) {
    const second = specs[1];
    imgAbsoluteTextTwo = isArabic
      ? `${second?.feature_ar || ""}`
      : `${second?.feature_en || ""} `;
  }

  const specificationImages = [
    productSpecificationImageOne,
    productSpecificationImageTwo,
    productSpecificationImageThree,
    productSpecificationImageFour,
    productSpecificationImageFive,
    productSpecificationImageSix,
  ].filter(Boolean); // removes null/undefined

  const absoluteTexts = [
    imgAbsoluteTextOne,
    imgAbsoluteTextTwo,
    imgAbsoluteTextThree,
    imgAbsoluteTextFour,
  ].filter(Boolean);

  return (
    <div className="proBox relative z-20 !min-h-full !rounded-2xl shadow-md !p-3.5 w-full">
      <button
        className={`absolute top-3 rtl:left-3 ltr:right-3 z-10 hover:!bg-red hover:!text-white !p-1.5 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out ${
          ProWishlistData.filter((item: any) => item == productData?.id)
            .length >= 1
            ? "!bg-red"
            : "!bg-white"
        }`}
        onClick={(e: any) => {
          var type: boolean =
            ProWishlistData.filter((item: any) => item == productData?.id)
              .length >= 1;
          WishlistProduct(productData?.id, type);
        }}
      >
        <HeartIcon
          size={13}
          color={` ${
            ProWishlistData.filter((item: any) => item == productData?.id)
              .length >= 1
              ? "#ffffff"
              : "#004B7A"
          }`}
        />
      </button>
      <Link
        prefetch={false}
        scroll={false}
        href={productSlug}
        className="w-full !rounded-2xl"
      >
        <div className="relative z-[-1] w-full max-w-[350px] aspect-square mx-auto">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-2xl z-10"></div>
          )}
          <Image
            src={productFeaturedImage}
            alt={productTitle}
            title={productTitle}
            width={350}
            height={350}
            quality={100}
            className={`w-full h-full object-cover object-center rounded-2xl transition-opacity duration-300 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        {absoluteTexts.length > 0 ? (
          <div className="flex items-center justify-center mx-8 text-nowrap overflow-hidden">
            {absoluteTexts.map((text, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div className="h-3 w-px mx-1 border border-gray opacity-20"></div>
                )}
                <div className="text-xxs font-semibold">{text}</div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="h-3.5 w-full"></div>
        )}
        {/* Badge Gift & Express Area */}
        <div className="flex items-end justify-between gap-1 w-full mt-3 mb-1">
          {giftAvailableImage != null && (
            <div className="flex items-center gap-0.5 font-bold px-2 py-1">
              <Image
                alt={giftAvailableText}
                title={giftAvailableText}
                loading="lazy"
                width={0}
                height={0}
                decoding="async"
                data-nimg="1"
                quality={100}
                className={`rounded-md object-contain h-3 ${
                  giftAvailableImage != null ? "w-14" : ""
                } lg:w-14 2xl:w-12`}
                src={giftAvailableImage}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                style={{ color: "transparent" }}
              />
            </div>
          )}
          {productBadgeInsideText && (
            <div
              className="text-xxs font-semibold py-0.5 px-1 rounded-md w-auto text-center border line-clamp-1"
              style={{
                borderColor: `${productBadgeRightBackgroundColor}25`,
                color: productBadgeRightBackgroundColor,
              }}
            >
              {productBadgeInsideText}
            </div>
          )}
          {/* Express badge on the right */}
          {ProExtraData?.expressdeliveryData && (
            <div
              className={`${
                isArabic ? "bg-expressAr" : "bg-expressEn"
              } w-14 h-6`}
            />
          )}
        </div>
        <div className="my-3">
          <h2 className="text-start text-xs line-clamp-2 font-semibold">
            <span className='after:content-["•"] font-bold'>
              {productBrand}{" "}
            </span>{" "}
            {productTitle}
          </h2>
          <div className="flex items-center justify-between gap-2 my-2">
            <button className="font-semibold text-start text-xs line-clamp-1">
              <span className='font-bold after:content-["•"]'>{codeText} </span>{" "}
              <span className="inline-flex items-center gap-1">
                {productData?.sku} <CopyIcon size={12} color="#000000" />
              </span>
            </button>
            <Image
              src={productBrandImage}
              alt={productBrand}
              title={productBrand}
              loading="lazy"
              width={0}
              height={0}
              className="w-18 h-8 object-contain object-center"
              sizes="100vh"
            />
          </div>
          {specificationImages.length > 0 ? (
            <div
              className="py-2 mb-3 rounded-md relative flex items-center justify-center gap-1"
              style={{ backgroundColor: productBadgeBackgroundColor }}
            >
              {specificationImages.map((imgSrc, i) => (
                <Image
                  key={i}
                  src={imgSrc as string}
                  alt={`specification-${productTitle}-${i + 1}`}
                  decoding="async"
                  data-nimg="1"
                  title={`Specification ${productTitle} - ${i + 1}`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  quality={100}
                  className="w-10 h-auto rounded-md"
                />
              ))}
            </div>
          ) : (
            <div className="specificationImagesProduct_wrapper h-[45px] w-full mb-3"></div>
          )}
          <div
            className={`p-1 rounded-md relative h-[46px] ${
              salePormotionText ? "" : "flex items-center justify-center"
            }`}
            style={{ backgroundColor: productBadgeBackgroundColor }}
          >
            <div className="align__center w-full">
              <div className="flex items-center gap-1">
                <h3 className="!text-sm font-bold text-orangePrice flex gap-1 items-center">
                  {productSalePrice > 0 ? (
                    <>{productSalePrice.toLocaleString("en-US")}</>
                  ) : (
                    <>{productRegularPrice.toLocaleString("en-US")}</>
                  )}
                  <SARIcon size={8} color="#F0660C" />
                </h3>
                {productSalePrice > 0 && (
                  <h3 className="text-xxs text-gray-500 line-through decoration-double decoration-red leading-3 flex items-center gap-x-0.5 mt-0.5">
                    {productRegularPrice}
                    <SARIcon size={7} color="#6B7280" />
                  </h3>
                )}
              </div>
              <div
                className={`text-xxs text-[#F0660C] flex items-center gap-1 text-nowrap font-bold px-1 py-1 bg-white rounded-sm`}
              >
                {productDiscountValue} {productDiscountType}
              </div>
            </div>
            {productData?.promotional_price >= 0 &&
              productData?.promotional_price != null &&
              productData?.sale_price && (
                <span className="text-orangePrice text-xxs font-bold animationImp">
                  {salePormotionText}
                </span>
              )}
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <h3 className={`font-bold text-xxs line-clamp-2`}>
              {installmentMethodsText}
            </h3>
            <Image
              alt={installmentMethods}
              title={installmentMethods}
              loading="lazy"
              width={0}
              height={0}
              quality={100}
              decoding="async"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
              className="rounded-md w-40 h-5 object-contain"
              src={installmentMethodsImages}
            />
          </div>
          <div className="flex items-center justify-between gap-2 mt-3">
            {productData?.totalrating > 0 ? (
              <div className="rating_div flex ltr:flex-row rtl:flex-row-reverse items-center gap-x-1">
                <span className="!text-xs opacity-60">{ratingText}</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Number(productData?.rating) }).map(
                    (_, i) => (
                      <span key={i}>
                        <StarIcon
                          size={16}
                          color="gold"
                          className="inline-block"
                        />
                      </span>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="h-4" />
            )}
            <div className="flex items-center gap-1.5 ml-auto">
              {timerText && (
                <>
                  <span className="text-[#F00C0C] !text-sm font-medium tracking-[0.16px]">
                    <FlashSaleTimer
                      expiryTimestamp={productData.flash_sale_expiry}
                    />
                  </span>
                  <ClockIcon size={14} color="#F00C0C" />
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
      <button
        className="bestProButton !text-xs selected bg-[#004B7A] !text-white
      transition-all duration-300 ease-in-out !w-full text-nowrap"
        onClick={() => {
          if (fGiftType == 0) {
            addToCart(productData.id, 0, true, true);
          } else if (fGift) {
            router.push(productSlug);
          } else {
            addToCart(productData.id, 0, true, true);
          }
          handleGTMAddToCart();
        }}
      >
        {buttonTextCheckout}
      </button>
    </div>
  );
}
