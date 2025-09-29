"use client"; // This is a client component 👈🏽

import React, { useEffect, useState, useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Select from 'react-select'
import dynamic from 'next/dynamic'  

import { useRouter } from 'next/navigation'
import CartIcon from "@/public/icons/empty_cart.png";
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import '@next/third-parties/google'
import withReactContent from 'sweetalert2-react-content'
import {
  getCart,
  getCartCount,
  getSummary,
  removeCartItem,
  increaseQty,
  setShipping,
  setDiscountRule,
  setDiscountRuleBogo,
  getProductids,
  removecheckoutdata,
  removeCartItemFbt,
  removeCartItemGift,
  getExpressDeliveryCart,
  getPickupStoreCart,
  setPickupStoreCart,
} from "../cartstorage/cart";
import FullPageLoader from '../components/FullPageLoader';
import GlobalContext from '../GlobalContext'
import PickupStorePopup from '../components/PickupStorePopup';
import { getDiscountTypeCart, getUserProfileData, getWishlist, removeWishlist } from '@/lib/cartPage/cart.client';
import { useApp } from '@/app/_ctx/AppContext';

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function NewCart() {
    const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA;
    const { lang, origin, deviceType, t } = useApp();
    const [cartData, setcartData] = useState<any>({})
    const [cartCount, setCartCount] = useState(0)
    const [summary, setSummary] = useState<any>([]);
    const [userid, setUserid] = useState<any>(false)
    const [expressData, setexpressData] = useState<any>([])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [ProWishlistData, setProWishlistData] = useState<any>([])
    const router = useRouter();
    const [storePickup, setstorePickup] = useState<any>(0);
    const [profileData, setProfileData] = useState<any>([])
    const [discountType, setDiscountType] = useState<any>(0)
    const [productSku, setProductSku] = useState<any>([])
    const [productIds, setProductIds] = useState<any>([])
    const [loaderStatus, setLoaderStatus] = useState<any>(true)

    // Fgift 
    const [isOpen, setIsOpen] = useState(false)
    const isArabic = lang === "ar" ? true : false;
    const [extraData, setExtraData] = useState<any>([]);
    const [selectedGifts, setselectedGifts] = useState<any>({})
    const [allowed_gifts, setallowed_gifts] = useState(0)
    const [gift_product_id, setgift_product_id] = useState(false)

    // Pickup From Store
    const { globalStore, setglobalStore } = useContext<any>(GlobalContext);
    const { updateWishlist, setUpdateWishlist } = useContext(GlobalContext);
    const [gtmEventPushed, setGtmEventPushed] = useState<any>(false);
    const [allStores, setallStores] = useState<any>([])
    const [storeData, setstoreData] = useState<any>([])
    const [direction, setDirection] = useState<"left-to-right" | "right-to-left">(
        "left-to-right"
    );

    useEffect(() => {
        if (localStorage.getItem('userWishlist')) {
            var wdata: any = localStorage.getItem('userWishlist')
            setProWishlistData(JSON.parse(wdata))
        }

        updateDeliveryMethod(0)
        const handleGlobalStoreChange = () => {
            resetCart(false);
        };

        window.addEventListener("storage", () => {
            refetch();
        });
        window.addEventListener('globalStoreChanged', handleGlobalStoreChange);

        return () => {
            window.removeEventListener("storage", () => {
                refetch();
            });
            window.removeEventListener('globalStoreChanged', handleGlobalStoreChange);
        };
    }, []);

    const refetch = () => {
        if (localStorage.getItem('userWishlist')) {
            var wdata: any = localStorage.getItem('userWishlist')
            setProWishlistData(JSON.parse(wdata))
        }
        else if (ProWishlistData.length) {
            setProWishlistData([])
        }
    }

    useEffect(() => {

        resetCart()
        getDiscountType()
        getUser()

    }, []);

    useEffect(() => {
        var sku: string[] = []
        var productids: string[] = []
        cartData?.products?.forEach((item: any) => {
            sku.push(item?.sku)
        });
        setProductSku(sku)
        setProductIds(productids)
    }, [cartData?.products])

    useEffect(() => {
        if (cartData?.products && !gtmEventPushed) {
            pushGTMEvent()
            setGtmEventPushed(true)
        }
    }, [cartData?.products, gtmEventPushed])

    const pushGTMEvent = () => {
        if (typeof window === 'undefined' || !window.dataLayer) return;

        const isList = 'view_cart';
        const productArray = Array.isArray(cartData.products) ? cartData.products : [];
        if (!productArray.length) return;
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
            event: isList,
            value: Number(getSummary().filter((element: any) => element.key == 'total')[0]?.price), // sum of prices
            currency: "SAR", // currency
            platform: deviceType,
            ecommerce: {
                items: productArray.map((item: any, index: number) => {
                    const price = item?.bogo === 1 ? 0 : (item?.price > 0 ? Number(item?.price) : Number(item?.regular_price));
                    const discountPrice: any = item?.regular_price - price;
                    return {
                        item_id: item?.sku,
                        item_name: isArabic ? item?.name_arabic : item?.name,
                        item_brand: isArabic ? item?.brand?.name_arabic : item?.brand?.name,
                        item_image_link: `${item?.image}`,
                        item_link: `${origin}/${isArabic ? 'ar' : 'en'}/${item?.slug}`,
                        price: Number(price),
                        shelf_price: Number(item?.regular_price),
                        discount: Number(discountPrice),
                        item_availability: "in stock",
                        item_list_id: item?.item_list_id ?? "50000",
                        item_list_name: item?.item_list_name ?? "direct",
                        index: index + 1,
                        quantity: item?.quantity ?? 1,
                        id: item?.sku,
                    }
                }),
            },
        });
    };

    const getDiscountType = async () => {
        const discountData: any = await getDiscountTypeCart();
        const responseJson = discountData?.discountData;
        setDiscountType(responseJson?.data?.discount_type);
    };

    const resetCart = async (isRun: any = true) => {
        removecheckoutdata()
        setcartData(getCart());
        setCartCount(getCartCount())
        setSummary(getSummary())
        await setShipping();
        await setDiscountRule();
        await setDiscountRuleBogo();
        setcartData(getCart());
        setCartCount(getCartCount())
        setSummary(getSummary())

        const exp = await getExpressDeliveryCart()
        setexpressData(exp)

        {/* Commented Pickup Store */ }
        if (isRun == true) {
            const store: any = await getPickupStoreCart(lang, false)
            setglobalStore(store?.warehouse_single)
            localStorage.setItem('globalStore', store?.warehouse_single?.id)
            setallStores(store?.warehouses)

            setstoreData(store)
            if (store?.success == false) {
                setstorePickup(0)
                localStorage.setItem('globalStore', '0')
                updateDeliveryMethod(0, true)
            }
        }

        setLoaderStatus(false)
    }

    {/* Commented Pickup Store */ }
    useEffect(() => {
        if (storePickup != cartData?.storeType && cartData?.storeType != undefined && cartData?.storeType != null) {
            updateDeliveryMethod(cartData?.storeType)
        }
    }, [cartData])

    {/* Commented Pickup Store */ }
    const updateDeliveryMethod = (method: any, isSet: any = false) => {
        setstorePickup(method)
        var storeId: any = false
        var storetype: any = 0
        var storeCity: any = false
        if (method == 1) {
            storeId = globalStore?.id
            storetype = method
            storeCity = isArabic ? globalStore?.waybill_city_data?.name_arabic : globalStore?.waybill_city_data?.name
            localStorage.setItem('globalStore', storeId)
        }
        if (method == 0) {
            localStorage.setItem('globalStore', '0')
        }
        setPickupStoreCart(storeId, storetype, storeCity)
        if (isSet == false) {
            resetCart()
        }
    }

    const removeItem = (key: any) => {
        setLoaderStatus(true)
        removeCartItem(key)
        resetCart()
    }

    const removeItemFbt = (prokey: any, fbtkey: any) => {
        removeCartItemFbt(prokey, fbtkey)
        resetCart()
    }

    const removeItemGift = (prokey: any, fbtkey: any) => {
        removeCartItemGift(prokey, fbtkey)
        resetCart()
    }

    const updateQty = async (qty: any, key: any) => {
        setGtmEventPushed(false)
        setLoaderStatus(true)
        await increaseQty(cartData, qty, key, true)
        resetCart()
    }

    const getUser: any = async () => {
        if (localStorage.getItem("userid")) {
        setUserid(localStorage.getItem("userid"));

        var proid: any = getProductids();
        const profileData: any = await getUserProfileData();
        const responseJson = profileData?.userData;
        setProfileData(responseJson);
        }
    };

    const getCheckout: any = async () => {
        setLoaderStatus(true)
        // // abandoned cart work
        // var data = {
        //     user_id: localStorage.getItem("userid"),
        //     cart_data: getCart(),
        // }
        // post('abandoned-cart-store', data).then((responseJson: any) => {
        // })
        // // abandoned cart work
        if (localStorage.getItem("userid")) {
            router.push(`${origin}/${lang}/checkout`);
        } else {
            router.push(`${origin}/${lang}/login?type=checkout`)
        }
    }

    const WishlistProduct = async (i: number, id: number) => {
    if (localStorage.getItem("userid")) {
      var data = {
        user_id: localStorage.getItem("userid"),
        product_id: id,
      };
      const wishlistData = await getWishlist(data);
      const responseJson = wishlistData?.wishlistData;
      if (responseJson?.success) {
        if (localStorage.getItem("wishlistCount")) {
          topMessageAlartSuccess(t('products.wishlistAddedText'));
          var wishlistlength: any = localStorage.getItem("wishlistCount");
          wishlistlength = parseInt(wishlistlength) + 1;
          localStorage.setItem("wishlistCount", wishlistlength);
        }
        getUser();
        localStorage.removeItem("userWishlist");
        setUpdateWishlist(updateWishlist == 0 ? 1 : 0);
      }
    } else {
      router.push(`${origin}/${lang}/login`);
    }
    };

    const RemoveWishlistProduct = async (i: number, id: number) => {
        if (localStorage.getItem("userid")) {
        var data = {
            user_id: localStorage.getItem("userid"),
            product_id: id,
        };
        const wishlistData = await removeWishlist(data);
        const responseJson = wishlistData?.wishlistData;
        if (responseJson?.success) {
            if (localStorage.getItem("wishlistCount")) {
            topMessageAlartSuccess(t('products.wishlistAddedText'));
            var wishlistlength: any = localStorage.getItem("wishlistCount");
            wishlistlength = parseInt(wishlistlength) - 1;
            localStorage.setItem("wishlistCount", wishlistlength);
            }
            getUser();
            localStorage.removeItem("userWishlist");
            setUpdateWishlist(updateWishlist == 0 ? 1 : 0);
        }
        } else {
        router.push(`${origin}/${lang}/login`);
        }
    };
    const MySwal = withReactContent(Swal);
    const topMessageAlartSuccess = (title: any) => {
        MySwal.fire({
            icon: "success",
            title:
                <div className="text-xs">
                    <div className="">{title}</div>
                </div>
            ,
            toast: true,
            position: isArabic ? 'top-start' : 'top-end',
            showConfirmButton: false,
            timer: 5000,
            showCloseButton: false,
            background: '#20831E',
            color: '#FFFFFF',
            timerProgressBar: true,
            customClass: {
                popup: `bg-success`,
            },
        });
    };

    const totalPrice = summary.find((e: any) => e.key === "total")?.price || 0;

    // ✅ Reusable sub-component inside the same file
    const PaymentOption = ({
        src,
        alt,
        title,
        price,
        installments,
    }: {
        src: string;
        alt: string;
        title: string;
        price: number;
        installments: number;
    }) => {
        return (
            <div className={`${title == "Baseeta" ? "!w-full mt-6 !border-[#8782b8]" : ""} nc__278mainInnerFifthDiv`}>
                <Image
                    src={src}
                    height={68}
                    width={68}
                    alt={alt}
                    title={title}
                    className={`${title == "Baseeta" ? "!top-[-35%]" : ""} nc__278mainInnerImg`}
                    loading="lazy"
                />
                <p className="mt-3">
                    {lang === "ar"
                        ? `قسها على ${installments} دفعات`
                        : `Split in ${installments} payments of `}{" "}
                    <span className="font-bold inline-flex items-center gap-0.5">
                        {(price / installments).toLocaleString("en-US")}
                        <span>{currencySymbolSmall}</span>
                    </span>
                    .{" "}
                    {lang === "ar"
                        ? "بدون فوائد و رسوم تأخير"
                        : "No interest. No late fees"}.
                </p>
                <button className="nc__278mainInnerLMBtn" onClick={() => { router.push(`${origin}/${lang}/installment-service-methods`) }}>
                    {lang === "ar" ? "تعلم أكثر" : "Learn More"}
                </button>
            </div>
        );
    };


    // Data Const
    const pageTitle = isArabic ? 'العربة' : 'Cart';
    const pageDescription = isArabic ? 'لم تقم بإضافة أي منتجات إلى سلة التسوق الخاصة بك بعد، تصفح المنتجات وأضفها إلى سلة التسوق الخاصة بك لعملية دفع سريعة تصفح المنتجات وقم باضافتها الي العربة الان.' : 'You have not added any products to your shopping cart yet. Browse the products and add them to your shopping cart for a quick checkout process. Browse the products and add them to the cart now.';
    const shopProductsText = isArabic ? 'تسوق المنتجات' : 'Shop products';
    const subHeading = isArabic ? 'كيف ترغب في الحصول على طلبك؟' : 'How would you like to get your order?';
    const deliveryTextSuccess = isArabic ? 'نجاح! تم اختيار التوصيل إلى المنزل بنجاح.' : 'Success! Home Delivery Selected Successfully..';
    const deliveryText = isArabic ? 'توصيل إلى المنزل' : 'Home delivery';
    const pickupSuccess = isArabic ? 'نجاح! تم اختيار الاستلام من المعرض بنجاح.' : 'Success! Pickup Store Selected Successfully..';
    const pickupText = isArabic ? 'الاستلام من المعرض' : 'Store pickup';
    const itemText = isArabic ? 'منتجات متاحة' : 'items available';
    const itemPreText = isArabic ? 'من' : 'of';
    const fastDeiveryImg = 'https://cdn-icons-png.flaticon.com/512/9720/9720868.png';
    const fastDeliveryText = isArabic ? 'خيارات توصيل السريح حسب المنتجات المحددة والمنطقة والوقت. اختر عند الدفع.' : 'Faster delivery options depending on the selected items, area, and time. Choose when you checkout.';
    const percentageText = isArabic ? 'خصم %' : '% OFF ';
    const saveText = isArabic ? 'وفر ' : 'Save ';
    const removeText = isArabic ? 'إزالة' : ' Remove';
    const includeText = isArabic ? 'يشمل' : 'Include';
    const freeText = isArabic ? 'مجانا' : 'Free';
    const giftText = isArabic ? 'هدية' : 'Gifts ';
    const includedText = isArabic ? 'شامل' : 'Included';
    const removeWishlistText = isArabic ? 'إزالة من المفضلة' : 'Remove from Wishlist';
    const moveWishlistText = isArabic ? 'نقل إلى المفضلة' : 'Add to Wishlist';
    const expressIconImg = isArabic ? "/icons/express_logo/express_logo_ar.png" : "/icons/express_logo/express_logo_en.png";
    const expressParaText = isArabic ? "احصل عليه في غضون 24 الى 48 ساعة" : "Get it in 24 to 48 hours";
    const deliveryTimeText = isArabic ? "ومن المتوقع أن يتم التسليم في " : "Delivery is expected to take place on ";
    const orderTimeText = isArabic ? `اطلب خلال ساعة و4 دقائق` : `Order in 1 h 4 m`;
    const cartSummaryText = isArabic ? 'تفاصيل الطلب الخاص بك' : 'Cart Summary'
    const includingVatText = isArabic ? 'شامل الضريبة' : 'Including VAT'
    const tabbyImg = '/images/tabby-en.webp';
    const misspayImg = '/images/misspay_cart.webp';
    const madfuImg = '/images/madfu.webp';
    const tamaraImg = '/images/tamara-en.webp';
    const proceedCheckout = isArabic ? 'اكمال شراء الطلب' : 'Proceed to Checkout';
    const currencySymbol = (
        <svg
            className="riyal-svg inline-flex"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1124.14 1256.39"
            width="15"
            height="15"
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
    )
    const currencySymbolSmall = (
        <svg
            className="riyal-svg inline-flex"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1124.14 1256.39"
            width="12"
            height="12"
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
    )

    const iconPickupMan = "/icons/pickupMans.webp";
    const iconLocationPin = "/icons/location_icon.webp";
    const iconPickupTime = "/icons/box-time.webp";
    const pickupStoreContent = isArabic ? "الاستلام من المعرض" : "Store Pick Up";
    const showroomName = isArabic
        ? globalStore?.showroom_arabic
        : globalStore?.showroom;

    const pickupStoreTimeText = isArabic ? (
        <>
            الاستلام سوف يكون متاح خلال{" "}
            <span className="text-[#fde18d] font-bold">1</span> ساعة عمل.
        </>
    ) : (
        <>
            Collection will be available in the next{" "}
            <span className="text-[#fde18d] font-bold">1</span> hour.
        </>
    );
    const stockText = isArabic ? "متوفر في المعرض" : "Item in Stock for Pickup";

    return (
        <>
            <FullPageLoader loader={loaderStatus} />
            <MobileHeader type="Third" lang={lang} pageTitle={pageTitle} />
            {cartData?.products?.length < 1 ?
                <div className="nc__278mainDiv container">
                    <div className='text-center'>
                        {/* <Lottie
                            animationData={shoppingCart}
                            loop={true}
                            className="srh__302mainInnerLottie"
                            /> */}
                            <Image
                            src={CartIcon}
                            alt="Empty Cart"
                            title="Empty Cart"
                            width={0}
                            height={0}
                            className="w-48 h-48 object-contain inline-block mb-4"
                        />
                        <p className="nc__278mainInnerXsPara">{pageDescription}</p>
                        <div className="nc__278mainInnerSecDiv">
                            <Link prefetch={false} scroll={false} href={`${origin}/${lang}`} className="btn nc__278mainInnerLink">{shopProductsText}</Link>
                        </div>
                    </div>
                </div>
                : null}
            <div className='container py-4 max-md:py-16'>
                {cartData?.products?.length >= 1 ?
                    <>
                        <div className={`bg-white rounded-md md:my-3 shadow-md flex items-center gap-x-4 mb-2`}>
                            <div className="p-3 w-full mt-3">
                                <h6 className='text-sm font-semibold'>{subHeading}</h6>
                                <div className="space-y-3 mt-3">
                                    <label htmlFor='delivery' className='border border-[#004B7A] rounded-md p-3 flex justify-between items-center w-full'>
                                        <div className="flex gap-2 justify-start items-center">
                                            <input value={0} checked={storePickup == 0} onChange={(e: any) => {
                                                {/* Commented Pickup Store */ }
                                                updateDeliveryMethod(e.target.value)
                                                topMessageAlartSuccess(deliveryTextSuccess)
                                            }} type="radio" name='delivery' id='delivery' className='form-radio' />
                                            <label className='text-sm'>{deliveryText}</label>
                                        </div>
                                    </label>
                                    {storeData?.warehouses?.length >= 1 ?
                                        <label htmlFor='storePickup' className='border border-[#004B7A] rounded-md p-3 flex justify-between items-cente w-full'>
                                            <div className="flex gap-2 justify-start items-center">
                                                <input value={1} checked={storePickup == 1} onChange={(e: any) => {
                                                    updateDeliveryMethod(e.target.value)
                                                    topMessageAlartSuccess(pickupSuccess)
                                                }} type="radio" name='storePickup' id='storePickup' className='form-radio' />
                                                <label className='text-sm'>{pickupText}</label>
                                            </div>
                                            <h6 className='text-sm text-[#EF7E2C]'>{storeData?.success ? cartData?.products?.length : 0} {itemPreText} {cartData?.products?.length} {itemText}</h6>
                                        </label>
                                        : null}
                                </div>
                                {storePickup == 1 ?
                                    <>
                                        <hr className='opacity-5 my-3 w-full' />
                                        <button onClick={() => { setIsOpenModal(true) }} className='bg-primary text-white rounded-md p-2 text-sm w-full ltr:text-left rtl:text-right'>
                                            <div className='flex gap-2 md:gap-3 md:justify-between item-start md:items-center'>
                                                <Image src={iconPickupMan} alt="ExpressIcon" title="Express Icon" width="65" height="0" className='inline-block h-auto rounded-md' />
                                                <div className=''>
                                                    <div className='flex gap-4 items-center'>
                                                        <div className='flex gap-2 items-center'>
                                                            <Image src={iconLocationPin} alt="ExpressIcon" title="Express Icon" width="16" height="16" className='inline-block h-auto' />
                                                            <span className='text-xs md:text-sm font-bold'>{pickupStoreContent}: <span className='text-[#fde18d]'>{showroomName}</span></span>
                                                        </div>
                                                    </div>
                                                    <div className='flex gap-2 items-center mt-1 md:-mt-1 mb-3 md:mb-0'>
                                                        <Image src={iconPickupTime} alt="ExpressIcon" title="Express Icon" width="18" height="18" className='inline-block h-auto' />
                                                        <span className='text-[0.65rem] md:text-xs'>{pickupStoreTimeText}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className='bg-[#fde18d] px-2 py-1 text-primary text-[0.60rem] rounded-md font-semibold animate-pulse float-end'>{stockText}</span>
                                        </button>
                                    </>
                                    : null}
                            </div>
                        </div>
                        {storePickup == 0 ?
                            <div className={`bg-white rounded-md shadow-md flex items-start gap-x-2 mb-3 p-4 w-full text-xs font-semibold`}>
                                <img src={fastDeiveryImg} alt="errorMark" height='18' width='18' />
                                {fastDeliveryText}
                            </div>
                            : null}
                        <div className="pb-24">
                            {cartData?.products?.map((pro: any, i: number) => {
                                var prototalqty = []
                                const proImgAlt = isArabic ? pro?.name_arabic : pro?.name;
                                const proBrandText = isArabic ? pro?.brand?.name_arabic : pro?.brand?.name;
                                const brandMediaImg = pro?.brand?.brand_media_image ? NewMedia + pro?.brand?.brand_media_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'
                                for (let index = 0; index < pro.total_quantity; index++) {
                                    prototalqty.push({ value: (index + 1), label: (index + 1) })

                                }
                                var checkExp = expressData[pro?.id]
                                return (
                                    <div className="bg-white pb-3 rounded-md" key={i + 1}>
                                        <div className="nc__278mainInnerSixthDiv">
                                            <Image src={pro?.image}
                                                alt={proImgAlt}
                                                title={proImgAlt} height={200} width={100} />
                                            <div className="w-full">
                                                <div>
                                                    <div className="nc__278mainInnerSevDiv">
                                                        {/* <p className='leading-3 font-bold'>{proBrandText}</p> */}
                                                        {pro?.brand?.brand_media_image ?
                                                            <Image
                                                                src={brandMediaImg}
                                                                alt={proBrandText}
                                                                title={proBrandText}
                                                                height={0} width={80}
                                                            />
                                                            :
                                                            <p>{proBrandText}</p>
                                                        }
                                                    </div>
                                                    <h2 className="nc__278mainInnerSmHeading">{proImgAlt}</h2>
                                                    <div className="nc__278mainInnerEightDiv">
                                                        <div className="nc__278mainInnerNineDiv">
                                                            <p className='nc__278mainInnerLgPara flex items-center gap-0.5'>
                                                                {!pro?.bogo ? pro?.price?.toLocaleString('EN-US') : null}
                                                                {pro?.bogo ? pro?.discounted_amount?.toLocaleString('EN-US') : null}
                                                                <small className="tpb_308mainInnerXsPara">{currencySymbol}</small>
                                                            </p>
                                                            {pro?.regular_price > pro?.price ? <p className='nc__278mainInnerSecXsPara'><span className="line-through">{pro?.regular_price?.toLocaleString('EN-US')}</span></p> : null}
                                                        </div>
                                                        {pro?.regular_price > pro?.price ?
                                                            <div className="nc__278mainInnerTenDiv">
                                                                <p className="nc__278mainInnerThirdXspara flex items-center gap-0.5">
                                                                    {discountType === 1 ?
                                                                        <>
                                                                            {Math.round(((pro.regular_price - pro.price) * 100) / pro.regular_price)} {percentageText}
                                                                        </>
                                                                        :
                                                                        <>
                                                                            {saveText} {(pro?.regular_price - pro?.price).toLocaleString('EN-US')} {currencySymbolSmall}
                                                                        </>
                                                                    }
                                                                </p>
                                                            </div>
                                                            : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="nc__278mainInnerEleDiv mt-0 mx-3">
                                            <div className="sht_303mainInnenNineteenDiv">
                                                <Select
                                                    isDisabled={pro?.bogo ? true : false}
                                                    styles={{
                                                        control: (provided: any, state: any) => ({
                                                            ...provided,
                                                            background: '#fff',
                                                            borderColor: '#5D686F60',
                                                            borderRadius: '0.375rem',
                                                            minHeight: 30,
                                                            fontSize: "0.75rem",
                                                            boxShadow: state.isFocused ? null : null,
                                                        }),
                                                        valueContainer: (provided, state) => ({
                                                            ...provided,
                                                            overflow: 'visible',
                                                            textAlign: 'center'
                                                        }),
                                                        indicatorSeparator: state => ({
                                                            display: 'none',
                                                        }),
                                                        dropdownIndicator: state => ({
                                                            padding: 0,
                                                            width: 20,
                                                            color: '#5D686F60'
                                                        }),
                                                    }}
                                                    value={{ value: pro.quantity, label: pro.quantity }}
                                                    options={[...Array(parseInt(pro?.bogo ? pro.quantity : pro?.total_quantity))].map((item: any, qi: any) => {
                                                        return {
                                                            value: qi + 1,
                                                            label: qi + 1
                                                        }
                                                    })}
                                                    onChange={(e: any) => updateQty(e.value, i)}
                                                    isSearchable={false}
                                                    className="nc__278mainInnerSelect"
                                                    classNamePrefix="react-select"
                                                />
                                                {!pro?.bogo ?
                                                    <button className='nc__278mainInnerRemoveBtn' onClick={() => removeItem(i)}>
                                                        <span>
                                                            <svg height="14" viewBox="-40 0 427 427.00131" width="14" xmlns="http://www.w3.org/2000/svg" id="fi_1214428"><path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"></path><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path></svg>
                                                        </span>{removeText}
                                                    </button>
                                                    : null}
                                            </div>
                                            {!pro?.bogo ?
                                                <button className={`${ProWishlistData.filter((item: any) => item == pro?.id).length >= 1 ? "nc__278mainInnerWLBtnWhislist" : "nc__278mainInnerWLBtn"}`}
                                                    onClick={() => {
                                                        if (ProWishlistData.filter((item: any) => item == pro?.id).length >= 1) {
                                                            RemoveWishlistProduct(i, pro?.id)
                                                        } else {
                                                            WishlistProduct(i, pro?.id)
                                                        }

                                                    }}
                                                >
                                                    {ProWishlistData.filter((item: any) => item == pro?.id).length >= 1 ?
                                                        <>
                                                            <span>
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z" fill='#DC4E4E' />
                                                                </svg>
                                                            </span>{' '}{removeWishlistText}
                                                        </>
                                                        :
                                                        <>
                                                            <span>
                                                                <svg id="fi_3870922" height="14" viewBox="0 0 512 512" width="14" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m489.864 101.1a130.755 130.755 0 0 0 -60.164-50.89c-28.112-11.8-59.687-13.924-91.309-6.127-28.978 7.146-57.204 22.645-82.391 45.129-25.189-22.486-53.418-37.986-82.4-45.131-31.623-7.8-63.2-5.674-91.312 6.134a130.755 130.755 0 0 0 -60.161 50.9c-15.02 23.744-22.661 52.619-22.097 83.5 2.504 137.285 207.006 262.122 247.976 285.755a16 16 0 0 0 15.989 0c40.974-23.636 245.494-148.495 247.976-285.779.558-30.879-7.086-59.751-22.107-83.491zm-9.887 82.916c-.8 44.388-30.39 96.139-85.563 149.655-51.095 49.558-109.214 86.912-138.414 104.293-29.2-17.378-87.31-54.727-138.4-104.287-55.176-53.512-84.766-105.259-85.576-149.646-.884-48.467 22.539-87.462 62.656-104.313a106.644 106.644 0 0 1 41.511-8.238c36.795 0 75.717 17.812 108.4 51.046a16 16 0 0 0 22.815 0c45.406-46.17 102.85-62.573 149.9-42.811 40.121 16.845 63.547 55.834 62.671 104.298z"></path></svg>
                                                            </span>{' '}{moveWishlistText}
                                                        </>
                                                    }
                                                </button>
                                                : null}
                                        </div>


                                        {/* Free Gift Item or Frequently Item */}
                                        {pro?.gift?.length >= 1 || pro?.fbt?.length >= 1 ?
                                            <div className="">
                                                <h3 className="nc__278mainInnerXsHeading">{includeText}{' '}<span className="text-[#DC4E4E]">{pro?.gift?.length + pro?.fbt?.length}</span>{' '}{freeText}{' '}<span className="text-[#DC4E4E]">{giftText}</span>{' '} {includedText}</h3>
                                                {pro?.gift?.map((giftData: any, g: number) => {
                                                    const giftDataImage = giftData?.image ? giftData?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png';
                                                    const giftDataImgAlt = giftData?.image ? isArabic ? giftData?.name_arabic : giftData?.name : '';
                                                    const giftDataText = isArabic ? giftData?.name_arabic : giftData?.name;
                                                    return (
                                                        <div className="nc__278mainInnerThirteenDiv" key={g}>
                                                            <Image src={giftDataImage}
                                                                alt={giftDataImgAlt}
                                                                title={giftDataImgAlt} height={50} width={50} />
                                                            <div className="nc__278mainInnerFourteenDiv">
                                                                <div>
                                                                    <h5 className="tpb_308mainInnerXsPara">{giftDataText}</h5>
                                                                    <p className='nc__278mainInnerLgPara'><small className="tpb_308mainInnerXsPara">{currencySymbol}</small> {giftData?.discounted_amount?.toLocaleString('EN-US')}</p>
                                                                </div>
                                                                <div className="sht_303mainInnenNineteenDiv">
                                                                    <Select
                                                                        styles={{
                                                                            control: (provided: any, state: any) => ({
                                                                                ...provided,
                                                                                background: '#fff',
                                                                                borderColor: '#5D686F60',
                                                                                borderRadius: '0.375rem',
                                                                                minHeight: 30,
                                                                                fontSize: "0.75rem",
                                                                                boxShadow: state.isFocused ? null : null,
                                                                            }),
                                                                            valueContainer: (provided, state) => ({
                                                                                ...provided,
                                                                                overflow: 'visible',
                                                                                textAlign: 'center'
                                                                            }),
                                                                            indicatorSeparator: state => ({
                                                                                display: 'none',
                                                                            }),
                                                                            dropdownIndicator: state => ({
                                                                                padding: 0,
                                                                                width: 20,
                                                                                color: '#5D686F60'
                                                                            }),
                                                                        }}
                                                                        value={{ value: giftData?.quantity, label: giftData?.quantity }}
                                                                        isSearchable={false}
                                                                        className="nc__278mainInnerSelect"
                                                                        classNamePrefix="react-select"
                                                                        isDisabled
                                                                    />
                                                                    {giftData?.discounted_amount > 0 ?
                                                                        <button className='nc__278mainInnerRemoveBtn' onClick={() => removeItemGift(i, g)}>
                                                                            <span>
                                                                                <svg height="14" viewBox="-40 0 427 427.00131" width="14" xmlns="http://www.w3.org/2000/svg" id="fi_1214428"><path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"></path><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path></svg>
                                                                            </span>
                                                                        </button>
                                                                        : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                                {pro?.fbt?.map((giftData: any, g: number) => {
                                                    const giftDataImage = giftData?.image ? giftData?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png';
                                                    const giftDataImgAlt = giftData?.image ? isArabic ? giftData?.name_arabic : giftData?.name : '';
                                                    const gidtDataText = isArabic ? giftData?.name_arabic : giftData?.name;
                                                    return (
                                                        <div className="nc__278mainInnerThirteenDiv" key={g}>
                                                            <Image src={giftDataImage}
                                                                alt={giftDataImgAlt}
                                                                title={giftDataImgAlt} height={50} width={50} />
                                                            <div className="nc__278mainInnerFourteenDiv">
                                                                <div>
                                                                    <h5 className="tpb_308mainInnerXsPara">{gidtDataText}</h5>
                                                                    <p className='nc__278mainInnerLgPara'><small className="tpb_308mainInnerXsPara">{currencySymbol}</small> {giftData?.discounted_amount?.toLocaleString('EN-US')}</p>
                                                                </div>
                                                                <div className="sht_303mainInnenNineteenDiv">
                                                                    <Select
                                                                        styles={{
                                                                            control: (provided: any, state: any) => ({
                                                                                ...provided,
                                                                                background: '#fff',
                                                                                borderColor: '#5D686F60',
                                                                                borderRadius: '0.375rem',
                                                                                minHeight: 30,
                                                                                fontSize: "0.75rem",
                                                                                boxShadow: state.isFocused ? null : null,
                                                                            }),
                                                                            valueContainer: (provided, state) => ({
                                                                                ...provided,
                                                                                overflow: 'visible',
                                                                                textAlign: 'center'
                                                                            }),
                                                                            indicatorSeparator: state => ({
                                                                                display: 'none',
                                                                            }),
                                                                            dropdownIndicator: state => ({
                                                                                padding: 0,
                                                                                width: 20,
                                                                                color: '#5D686F60'
                                                                            }),
                                                                        }}
                                                                        value={{ value: giftData?.quantity, label: giftData?.quantity }}
                                                                        isSearchable={false}
                                                                        className="nc__278mainInnerSelect"
                                                                        classNamePrefix="react-select"
                                                                        isDisabled
                                                                    />
                                                                    {giftData?.discounted_amount > 0 ?
                                                                        <button className='nc__278mainInnerRemoveBtn' onClick={() => removeItemFbt(i, g)}>
                                                                            <span>
                                                                                <svg height="14" viewBox="-40 0 427 427.00131" width="14" xmlns="http://www.w3.org/2000/svg" id="fi_1214428"><path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"></path><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path></svg>
                                                                            </span>
                                                                        </button>
                                                                        : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            : null}
                                        {storePickup == 0 ?
                                            checkExp && checkExp?.qty >= pro?.quantity ?
                                                <>
                                                    <div className='flex items-center gap-x-4 mx-2 mt-2 bg-[#fde18d] rounded-md p-2 w-[-webkit-fit-content]'>
                                                        <Image
                                                            src={expressIconImg}
                                                            width="65" height="0" alt="express_delivery" title='Express Delivery' className='bg-white p-2.5 rounded-md'
                                                        />
                                                        <div className='text-sm font-normal'>
                                                            <h6 className='font-bold text-sm'>{expressParaText}</h6>
                                                            <p className='text-xs'>
                                                                {isArabic
                                                                    ? <>فقط <span className="text-[#219EBC] font-bold">{checkExp?.qty}</span> حبه متاحه للتوصيل السريع خلال 24 إلى 48 ساعة</>
                                                                    : <>Only <span className="text-[#219EBC] font-bold">{checkExp?.qty}</span> quantity is available in 24 to 48 hours express delivery</>
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </>
                                                :
                                                <div className='flex items-center gap-x-4 px-2.5 py-1'>
                                                    <svg id="fi_10112476" height="50" viewBox="0 0 512 512" width="50" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><g fillRule="evenodd"><path d="m310.168 100.287c6.255 0 11.357 5.103 11.357 11.357v261.113h-264.358c-12.456 0-22.62-10.162-22.62-22.62v-238.494c0-6.254 5.102-11.357 11.357-11.357h264.264z" fill="#323e66"></path><path d="m321.525 372.757h-264.358c-12.459 0-22.62-10.162-22.62-22.62v-38.283h286.978v60.904z" fill="#e37500"></path><path d="m483.254 372.757h-161.729v-186.34h97.774c7.146 0 13.298 2.704 18.13 7.97l39.349 42.88c4.331 4.72 6.477 10.231 6.477 16.637v118.854z" fill="#f9ac00"></path><path d="m467.005 372.757h-145.48v-186.34h81.524c7.147 0 13.298 2.704 18.13 7.97l39.349 42.88c4.331 4.72 6.477 10.231 6.477 16.637v118.854z" fill="#fdc72e"></path><path d="m368.851 257.715v-52.102h78.88l29.046 31.653c4.331 4.72 6.477 10.231 6.477 16.637v3.812z" fill="#e9e9ff"></path><path d="m368.851 257.715v-52.102h62.63l29.047 31.653c4.331 4.72 6.477 10.231 6.477 16.637v3.812h-98.153z" fill="#f0f0ff"></path><path d="m483.254 350.966h-448.708v21.79h450.364c8.861 0 16.089-7.227 16.089-16.089v-29.336h-17.745z" fill="#7986bf"></path></g><path d="m34.546 332.788h23.169v18.178h-23.169z" fill="#323e66"></path><path d="m460.89 291.132h22.364v25.908h-22.364z" fill="#323e66"></path><circle cx="396.154" cy="372.757" fill="#323e66" r="38.953"></circle><path d="m396.154 391.897c10.542 0 19.14-8.598 19.14-19.14s-8.598-19.14-19.14-19.14-19.14 8.598-19.14 19.14 8.598 19.14 19.14 19.14z" fill="#fdc72e" fillRule="evenodd"></path><circle cx="118.375" cy="372.757" fill="#323e66" r="38.953" transform="matrix(.987 -.162 .162 .987 -58.875 24.127)"></circle><path d="m118.375 391.897c10.542 0 19.14-8.598 19.14-19.14s-8.598-19.14-19.14-19.14-19.14 8.598-19.14 19.14 8.598 19.14 19.14 19.14z" fill="#fdc72e" fillRule="evenodd"></path><path d="m152.024 235.62h76.233v76.233h-76.233z" fill="#e6b17c"></path><path d="m178.996 235.62h22.289v24.799l-11.145-5.593-11.144 5.593z" fill="#fdc72e" fillRule="evenodd"></path><path d="m152.024 159.387h76.233v76.233h-76.233z" fill="#ba8047"></path><path d="m178.996 159.387h22.289v24.799l-11.145-5.593-11.144 5.593z" fill="#2dd62d" fillRule="evenodd"></path><path d="m228.257 235.62h76.233v76.233h-76.233z" fill="#dea368"></path><path d="m255.228 235.62h22.289v24.799l-11.144-5.593-11.145 5.593z" fill="#fb545c" fillRule="evenodd"></path><path d="m228.257 135.311h76.233v100.309h-76.233z" fill="#fdd7ad"></path><path d="m255.228 135.311h22.289v24.799l-11.144-5.593-11.145 5.593z" fill="#5caeff" fillRule="evenodd"></path><path d="m75.791 235.62h76.233v76.233h-76.233z" fill="#fdd7ad"></path><path d="m102.763 235.62h22.289v24.799l-11.145-5.593-11.144 5.593z" fill="#5caeff" fillRule="evenodd"></path><path d="m321.525 186.416h93.116l-15.238-15.238c-2.093-2.093-4.64-3.148-7.599-3.148h-70.279z" fill="#e37500" fillRule="evenodd"></path><path d="m75.791 235.62h8.362v76.233h-8.362z" fill="#f2c496"></path><path d="m152.024 235.62h8.362v76.233h-8.362z" fill="#dea368"></path><path d="m228.257 235.62h8.362v76.233h-8.362z" fill="#d19458"></path><path d="m228.257 135.311h8.362v100.309h-8.362z" fill="#f2c496"></path><path d="m152.024 159.387h8.362v76.233h-8.362z" fill="#ab733a"></path><path d="m56.692 187.026h-41.059c-2.762 0-5-2.238-5-5s2.238-5 5-5h41.059c2.757 0 5 2.238 5 5s-2.243 5-5 5zm21.777 26.773h-57.117c-2.762 0-5-2.238-5-5s2.238-5 5-5h57.116c2.762 0 5 2.238 5 5s-2.238 5-5 5zm-48.188-67.832h33.202c2.757 0 5 2.238 5 5s-2.243 5-5 5h-33.202c-2.762 0-5-2.238-5-5s2.238-5 5-5zm-19.282-12.843c-2.757 0-5-2.243-5-5s2.243-5 5-5h42.84c2.762 0 5 2.238 5 5s-2.238 5-5 5zm107.371 253.768c-7.791 0-14.139-6.338-14.139-14.139s6.348-14.139 14.139-14.139 14.139 6.348 14.139 14.139-6.338 14.139-14.139 14.139zm0-38.278c-13.31 0-24.139 10.829-24.139 24.139s10.829 24.139 24.139 24.139 24.139-10.829 24.139-24.139-10.829-24.139-24.139-24.139zm277.778 38.278c-7.791 0-14.139-6.338-14.139-14.139s6.348-14.139 14.139-14.139 14.143 6.348 14.143 14.139-6.343 14.139-14.143 14.139zm0-38.278c-13.305 0-24.139 10.829-24.139 24.139s10.834 24.139 24.139 24.139 24.144-10.829 24.144-24.139-10.834-24.139-24.144-24.139zm-37.168-51.288c0-2.762 2.229-5 5-5h21.491c2.757 0 5 2.238 5 5s-2.243 4.995-5 4.995h-21.491c-2.772 0-5-2.224-5-4.995zm137.02 59.336c0 6.124-4.981 11.091-11.091 11.091h-45.097c-.472-4.129-1.51-8.076-3.043-11.786h46.483c2.767 0 5-2.243 5-5v-18.634h7.748zm-99.851 50.054c18.72 0 33.963-15.244 33.963-33.963s-15.244-33.949-33.963-33.949-33.949 15.229-33.949 33.949 15.234 33.963 33.949 33.963zm-277.778 0c18.729 0 33.959-15.244 33.959-33.963s-15.229-33.949-33.959-33.949-33.949 15.229-33.949 33.949 15.229 33.963 33.949 33.963zm-78.817-50.75h38.206c-1.528 3.71-2.576 7.657-3.048 11.786h-35.159v-11.786zm13.167-10h-13.167v-8.181h13.167zm263.801-29.111v29.111h-163.34c-8.039-10.434-20.648-17.163-34.811-17.163s-26.758 6.729-34.801 17.163h-20.849v-13.181c0-2.762-2.238-5-5-5h-18.167v-10.929h276.967zm-235.734-76.236h16.972v19.8c0 1.733.9 3.343 2.381 4.253.8.495 1.71.748 2.619.748.772 0 1.538-.176 2.248-.533l8.9-4.467 8.9 4.467c1.552.776 3.391.7 4.872-.214 1.471-.909 2.372-2.519 2.372-4.253v-19.8h16.967v66.236h-66.231v-66.236zm26.972 0v11.695l3.9-1.957c1.419-.705 3.081-.705 4.491 0l3.9 1.957v-11.695zm49.259-76.232h16.982v19.801c0 1.733.89 3.343 2.367 4.252 1.471.91 3.324.99 4.872.214l8.901-4.467 8.9 4.467c.709.357 1.481.529 2.238.529.924 0 1.833-.248 2.633-.743 1.481-.91 2.367-2.519 2.367-4.252v-19.801h16.981v66.231h-66.241zm26.982 0v11.696l3.9-1.957c1.41-.71 3.067-.71 4.481 0l3.895 1.957v-11.696h-12.277zm66.231-24.077v19.801c0 1.733.896 3.343 2.367 4.252 1.481.91 3.319.99 4.872.214l8.9-4.467 8.896 4.467c.714.357 1.481.533 2.252.533.91 0 1.819-.253 2.619-.748 1.481-.91 2.381-2.519 2.381-4.252v-19.801h16.972v90.308h-66.231v-90.308h16.972zm9.996 0v11.696l3.9-1.957c1.409-.71 3.071-.71 4.491 0l3.9 1.957v-11.696zm0 100.309h12.291v11.695l-3.9-1.957c-1.419-.705-3.081-.705-4.491 0l-3.9 1.957zm-83.861 24.053c1.471.91 3.324.991 4.872.214l8.901-4.467 8.9 4.467c.709.357 1.481.533 2.238.533.924 0 1.833-.252 2.633-.748 1.481-.909 2.367-2.519 2.367-4.253v-19.8h16.981v66.236h-66.241v-66.236h16.982v19.8c0 1.733.89 3.343 2.367 4.253zm7.634-24.053v11.695l3.9-1.957c1.41-.705 3.067-.705 4.481 0l3.895 1.957v-11.695h-12.277zm49.259 66.236h66.231v-66.236h-16.972v19.8c0 1.733-.9 3.343-2.381 4.253-1.467.914-3.319.991-4.872.214l-8.896-4.467-8.9 4.467c-.709.357-1.471.533-2.243.533-.91 0-1.819-.252-2.629-.748-1.471-.909-2.367-2.519-2.367-4.253v-19.8h-16.972v66.236zm158.54-133.825c1.629 0 2.919.533 4.067 1.686l6.7 6.7h-76.046v-8.386zm-232.81 182.936h196.551c-1.543 3.71-2.581 7.657-3.052 11.786h-190.46c-.466-4.129-1.509-8.076-3.038-11.786zm274.75-158.202c-3.862-4.214-8.719-6.348-14.439-6.348h-92.78v154.549h34.83c8.039-10.434 20.648-17.163 34.797-17.163s26.772 6.729 34.811 17.163h47.292v-23.925h-17.363c-2.757 0-5-2.238-5-4.995v-25.911c0-2.762 2.243-5 5-5h17.363v-23.42h-109.4c-2.762 0-5-2.238-5-5v-52.102c0-2.762 2.238-5 5-5h67.508zm44.459 54.95h-104.347v-42.102h71.679l27.558 30.034c3.2 3.486 4.872 7.448 5.11 12.067zm.052 59.331h-12.362v-15.91h12.362zm22.749 10.286h-12.748v-68.427c0-7.653-2.624-14.386-7.791-20.02l-39.354-42.878c-5.748-6.272-13.296-9.591-21.806-9.591h-2.591l-13.772-13.777c-3.019-3.014-6.867-4.61-11.139-4.61h-65.279v-51.388c0-9.019-7.333-16.358-16.353-16.358h-277.019c-2.757 0-5 2.243-5 5s2.243 5 5 5h277.021c3.505 0 6.353 2.852 6.353 6.357v195.213h-7.034v-171.543c0-2.757-2.238-5-5-5h-76.227c-2.762 0-5 2.243-5 5v19.077h-71.241c-2.757 0-5 2.238-5 5v71.231h-71.232c-2.757 0-4.995 2.238-4.995 5v71.236h-31.239v-78.556c0-2.762-2.243-5-5-5-2.772 0-5 2.238-5 5v144.454c0 2.762 2.229 5 5 5h40.159c2.5 21.891 21.12 38.964 43.659 38.964s41.168-17.072 43.659-38.964h190.461c2.49 21.891 21.12 38.964 43.659 38.964s41.173-17.072 43.664-38.964h45.097c11.629 0 21.091-9.457 21.091-21.091v-29.33c0-2.757-2.238-5-5-5z" fillRule="evenodd"></path></svg>
                                                    <div className='text-[0.65rem] font-normal'>
                                                        <h6 className='font-semibold text-sm'>{deliveryTimeText} {dayjs().add(5, 'days').format('DD MMM')}</h6>
                                                        <p>{orderTimeText}</p>
                                                    </div>
                                                </div>
                                            : null}
                                    </div>
                                )
                            })}
                            <h6 className="nc__278mainInnerSeventeenDiv mt-4 !mb-2">{cartSummaryText}</h6>
                            <div className="flex-col mb-3">
                                <div className="nc__278mainInnerSixteenDiv">
                                    {summary?.map((s: any, i: number) => {
                                        const itemTitletext = isArabic ? s?.title_arabic : s?.title;
                                        const uniqueKey = s?.id || `${i}-${s?.price}`;
                                        if (s?.key == 'total') {
                                            return (
                                                <React.Fragment key={uniqueKey}>
                                                    <hr className="nc__278mainInnerHr" key={uniqueKey} />
                                                    <div className="nc__278mainInnerNineteenDiv" key={uniqueKey + 2}>
                                                        <label className="text-dark">{itemTitletext} <small className="nc__278mainInnerSmall">({includingVatText})</small></label>
                                                        <p className={`text-[#004B7A] flex items-center gap-0.5`}><span className="font-bold">{s?.price?.toLocaleString('EN-US')}</span>{' '}{currencySymbol}</p>
                                                    </div>
                                                </React.Fragment>
                                            )
                                        }
                                        return (
                                            <div className="nc__278mainInnerTwntyDiv" key={uniqueKey + 3}>
                                                <label className="nc__278mainInnerMdLabel">{itemTitletext}</label>
                                                <p className={`nc__278mainInnerPara flex items-center gap-0.5`}><span className="font-bold">{s?.price?.toLocaleString('EN-US')}</span>{' '}{currencySymbol}</p>
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                            <div className="nc__278mainInnerFourthDiv">
                                <PaymentOption
                                    src={tabbyImg}
                                    alt="Tabby"
                                    title="Tabby"
                                    price={totalPrice}
                                    installments={4}
                                />
                                <PaymentOption
                                    src={tamaraImg}
                                    alt="Tamara"
                                    title="Tamara"
                                    price={totalPrice}
                                    installments={12}
                                />
                            </div>
                            <div className="nc__278mainInnerFourthDiv">
                                <PaymentOption
                                    src={madfuImg}
                                    alt="Madfu"
                                    title="Madfu"
                                    price={totalPrice}
                                    installments={4}
                                />
                                <PaymentOption
                                    src={misspayImg}
                                    alt="Misspay"
                                    title="Misspay"
                                    price={totalPrice}
                                    installments={4}
                                />
                            </div>
                            <div className="!w-full mt-5">
                                <PaymentOption
                                    src="/images/baseeta.webp" // local image
                                    alt="Baseeta"
                                    title="Baseeta"
                                    price={totalPrice * 1.72}
                                    installments={36}
                                />
                            </div>
                        </div>
                        <div className="nc__278mainInnerCheckDiv container left-0 !bottom-[78px]">
                            <div className="nc__278mainInnerCheckFirstDiv" onClick={() => getCheckout()}>
                                <button className="nc__278mainInnerCheckBtn" onClick={() => getCheckout()}>{proceedCheckout}</button>
                            </div>
                        </div>
                        {/* Commented Pickup Store */}
                        <PickupStorePopup lang={lang} allStores={allStores} setModal={() => setIsOpenModal(false)} isOpenModal={isOpenModal} direction={direction} isArabic={isArabic ? true : false} />
                    </>
                    :
                    null}
            </div>
        </>
    )
}
