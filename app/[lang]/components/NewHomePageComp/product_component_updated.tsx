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

export default function product_component_updated(props: any) {
  const NewMedia = props?.NewMedia;
  const router = useRouter();
  const origin = props?.origin;
  const isArabic = props?.lang;
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
  const expressIcon = isArabic
    ? "/icons/express_logo/express_ar_w.webp"
    : "/icons/express_logo/express_en_w.webp";
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
  const percentage = (productData?.save_type === "1" || productData?.save_type === 1) ? 1 : 0; // 1 for percentage, 0 for amount
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
    // var testing: any = ProWishlistData
    if (localStorage.getItem("userid")) {
      var data = {
        user_id: localStorage.getItem("userid"),
        product_id: id,
      };
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
          // testing[id].wishlist = !type;
          // setProWishlistData({ ...testing })
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
        // router.push(
        //   `/${isArabic ? "ar" : "en"}/${localStorage.getItem("userid") ? "checkout" : "login?type=checkout"
        //   }`
        // ); // Redirect to cart page
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
        // router.push(
        //   `/${isArabic ? "ar" : "en"}/${localStorage.getItem("userid") ? "checkout" : "login?type=checkout"
        //   }`
        // ); // Redirect to cart page
        router.push(`/${isArabic ? "ar" : "en"}/cart`); // Redirect to cart page
        router.refresh();
      }
    }
  };

  const giftAvailableImage = productData?.gift_image
    ? productData?.gift_image
    : null;

  function detectPlatform() {
    if (window.Android) return "Android-WebView";
    if (window.webkit?.messageHandlers?.iosBridge) return "iOS-WebView";
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) return "Android-Mobile-WebView";
    if (/iPad|iPhone|iPod/.test(userAgent)) return "iOS-Mobile-WebView";
    return "Web";
  }

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
  // const specs = {
  //   capacity: isArabic ? "سعة: 430 لتر" : "Capacity: 430 L",
  //   width:    isArabic ? "عرض: 83.9 سم" : "Width: 83.9 cm",
  //   height:   isArabic ? "إرتفاع: 176.3 سم" : "Height: 176.3 cm",
  //   depth:    isArabic ? "عمق: 63.7 سم" : "Depth: 63.7 cm",
  // };

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
      : `${first?.feature_en || ""} `;
  }

  if (specs.length >= 2) {
    const second = specs[1];
    imgAbsoluteTextTwo = isArabic
      ? `${second?.feature_ar || ""}`
      : `${second?.feature_en || ""} `;
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

  return (
    <>
      <div className="tamkeenProduct_card relative w-full h-fit">
        <div className="proBox relative z-20 !min-h-full !rounded-2xl shadow-md !p-3.5">
          <div className="tamkeenProduct_card_header flex justify-between items-center px-2">
            <div className="productRedOrangeBtns h-8 flex items-center gap-x-2 z-10 absolute sm:top-3 top-2 rtl:left-3 ltr:right-3">
              <button
                className={`productSliderBtns hover:!bg-red !text-primary hover:!text-white !p-1.5 transition-all duration-300 ease-in-out ${
                  ProWishlistData.filter((item: any) => item == productData?.id)
                    .length >= 1
                    ? "!bg-red !fill-white !text-white"
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
              <button
                className="productSliderBtns !bg-white !p-1.5 !text-primary hover:!bg-primary hover:!text-white transition-all duration-300 ease-in-out"
                onClick={() => {
                  if (fGiftType == 0) {
                    addToCart(productData.id, 0, true);
                  } else if (fGift) {
                    router.push(productSlug);
                  } else {
                    addToCart(productData.id, 0, true);
                  }
                  handleGTMAddToCart();
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
          <Link prefetch={false} scroll={false} href={productSlug}>
            <div className="tamkeenProduct_card_img w-full !rounded-2xl">
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
              {imgAbsoluteTextOne ||
              imgAbsoluteTextTwo ||
              imgAbsoluteTextThree ||
              imgAbsoluteTextFour ? (
                <div className="flex items-center justify-center mx-8 text-nowrap overflow-hidden">
                  {imgAbsoluteTextOne && (
                    <div className="text-[0.5rem] font-semibold">
                      {imgAbsoluteTextOne}
                    </div>
                  )}
                  {imgAbsoluteTextTwo && (
                    <div className="h-3 w-px mx-1 border border-gray opacity-20"></div>
                  )}
                  {imgAbsoluteTextTwo && (
                    <div className="text-[0.5rem] font-semibold">
                      {imgAbsoluteTextTwo}
                    </div>
                  )}
                  {imgAbsoluteTextThree && (
                    <div className="h-3 w-px mx-1 border border-gray opacity-20"></div>
                  )}
                  {imgAbsoluteTextThree && (
                    <div className="text-[0.5rem] font-semibold">
                      {imgAbsoluteTextThree}
                    </div>
                  )}
                  {imgAbsoluteTextFour && (
                    <div className="h-3 w-px mx-1 border border-gray opacity-20"></div>
                  )}
                  {imgAbsoluteTextFour && (
                    <div className="text-[0.5rem] font-semibold">
                      {imgAbsoluteTextFour}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-4 w-full"></div>
              )}
            </div>
            <div className="tamkeenProduct_card_body pt-3 mb-1">
              <div className="flex items-end justify-between gap-1 w-full mb-1">
                <div className="flex items-center gap-1">
                  {giftAvailableImage != null ? (
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
                        className={`rounded-md object-contain h-[0.6875rem] ${
                          giftAvailableImage != null ? "w-14" : ""
                        } lg:w-14 2xl:w-12`}
                        src={giftAvailableImage}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                        style={{ color: "transparent" }}
                      />
                    </div>
                  ) : null}
                  {productBadgeTop ? (
                    <div
                      className={`productBadge_topText !text-[0.589rem] md:text-[0.589rem] font-semibold py-[0.150rem] px-[0.308rem] rounded-md w-auto text-center border line-clamp-1`}
                      style={{
                        borderColor: `${productBadgeLeftBackgroundColor}25`,
                        color: productBadgeLeftBackgroundColor,
                      }}
                    >
                      {productBadgeTop}
                    </div>
                  ) : (
                    <div className="h-[22.78px]" />
                  )}
                  {productBadgeInsideText ? (
                    <div
                      className={`productBadge_topText !text-[0.589rem] md:text-[0.589rem] font-semibold py-[0.150rem] px-[0.308rem] rounded-md w-auto text-center border line-clamp-1`}
                      style={{
                        borderColor: `${productBadgeRightBackgroundColor}25`,
                        color: productBadgeRightBackgroundColor,
                      }}
                    >
                      {productBadgeInsideText}
                    </div>
                  ) : (
                    <div className="h-[22.78px]" />
                  )}
                </div>
                {ProExtraData?.expressdeliveryData ? (
                  <div className="productBadge_topImg rtl:mr-auto ltr:ml-auto !w-[73px] !h-[27.2px] relative">
                    <Image
                      src="/icons/express_logo/express_en_w.png"
                      alt="Express Logo"
                      fill
                      loading="lazy"
                      decoding="async"
                      quality={100}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                      priority={false}
                      width={0}
                      height={0}
                      className="w-full h-full object-contain object-center"
                    />
                  </div>
                ) : (
                  <div className="h-[27.2px]" />
                )}
              </div>
              <h2 className="productDesc text-start !text-xs 2xl:text-sm line-clamp-2 font-semibold h-[2rem]">
                <span className='font-[900] after:content-["•"]'>
                  {productBrand}{" "}
                </span>{" "}
                {productTitle}
              </h2>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="productDesc  font-semibold text-start !text-xs 2xl:text-sm line-clamp-1">
                  <span className='font-[900] after:content-["•"]'>
                    {isArabic ? "كود" : "Code"}{" "}
                  </span>{" "}
                  <span className="inline-flex items-center gap-1">
                    {productData?.sku}
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
                  </span>
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
              {productSpecificationImageOne ||
              productSpecificationImageTwo ||
              productSpecificationImageThree ||
              productSpecificationImageFour ||
              productSpecificationImageFive ||
              productSpecificationImageSix ? (
                <div
                  className="specificationImagesProduct_wrapper  px-2 py-1 mb-3 rounded-md relative h-[36px]"
                  style={{ backgroundColor: productBadgeBackgroundColor }}
                >
                  <>
                    <div className="product_specification flex items-center justify-center gap-2">
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
                          className="specificationImagesProduct w-[36px] h-[26px] rounded-md"
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
                          className="specificationImagesProduct w-[36px] h-[26px] rounded-md"
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
                          className="specificationImagesProduct w-[36px] h-[26px] rounded-md"
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
                          className="specificationImagesProduct w-[36px] h-[26px] rounded-md"
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
                          className="specificationImagesProduct w-[36px] h-[26px] rounded-md"
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
                          className="specificationImagesProduct w-[36px] h-[26px] rounded-md hidden md:block"
                        />
                      ) : null}
                    </div>
                  </>
                </div>
              ) : (
                <div className="specificationImagesProduct_wrapper h-[36px] w-full mb-3"></div>
              )}
              <div
                className={`p-1 rounded-md relative h-[46px] ${
                  salePormotionText ? "" : "flex items-center justify-center"
                }`}
                style={{ backgroundColor: productBadgeBackgroundColor }}
              >
                <div className="align__center w-full">
                  <div>
                    <div className="flex items-center sm:gap-2 gap-1">
                      <h3 className="afterDiscount md:text-base !text-sm font-[900] text-orangePrice">
                        <div className="flex gap-1 items-center">
                          {productSalePrice > 0 ? (
                            <>{productSalePrice.toLocaleString("en-US")}</>
                          ) : (
                            <>{productRegularPrice.toLocaleString("en-US")}</>
                          )}
                          <svg
                            className="riyal-svg"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1124.14 1256.39"
                            width="10"
                            height="11"
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
                        </div>
                      </h3>
                      <div className="flex items-center mt-0.5">
                        {productSalePrice > 0 ? (
                          <>
                            <h3 className="realPrice md:!text-xs !text-[0.625rem] text-gray-500 line-through decoration-double decoration-red leading-3 flex items-center gap-x-0.5">
                              {productRegularPrice}
                              <svg
                                className="riyal-svg"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 1124.14 1256.39"
                                width="7"
                                height="8"
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
                            </h3>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`offerPercent !text-[0.625rem] md:!text-xs font-bold px-1 md:px-2 py-1 bg-white rounded-sm`}
                  >
                    <span className="text-[#F0660C] flex items-center gap-1 text-nowrap">
                      {productDiscountValue} {productDiscountType}
                    </span>
                  </div>
                </div>
                {(productData?.promotional_price >= 0 && productData?.promotional_price != null && productData?.sale_price) ? (
                  <span className="animated_orangePrice text-orangePrice !text-[0.55rem] md:!text-[0.625rem] font-bold animationImp">
                    {salePormotionText}
                  </span>
                ) : null}
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <h3
                  className={`paymentText font-bold md:!text-[0.619rem] sm:!text-[0.50rem] text-[.625rem] md:!leading-[0.619rem] sm:!leading-[0.50rem] leading-[.625rem] line-clamp-2`}
                >
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
                  className="rounded-md sm:w-24 w-32 h-5 md:w-28 md:h-5"
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
                  )}
                </div>
              </div>
            </div>
          </Link>
          <div
            className="
    tamkeenProduct_card_footer
    flex items-center
    2xl:justify-between xl:justify-center justify-between
    2xl:flex-nowrap xl:flex-wrap flex-nowrap
    sm:gap-2 gap-x-4 gap-y-2 mb-1 mt-3
    [&>button]:shrink-0
  "
          >
            <button
              className="bestProButton !text-xs selected bg-[#004B7A] !text-white
      transition-all duration-300 ease-in-out 2xl:!w-1/2 xl:!w-full sm:!w-1/2 !w-full text-nowrap"
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
            <button
              className="flex items-center flex-nowrap gap-1.5"
              onClick={() => router.push(productSlug)}
            >
              <span className="!text-xs font-bold text-primary text-nowrap">
                {btndiscoverText}
              </span>
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
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
