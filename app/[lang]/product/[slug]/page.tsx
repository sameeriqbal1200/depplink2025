"use client"; // This is a client component 👈🏽

import React, { useEffect, useState, Fragment, useRef, useContext } from 'react'
import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { NewMedia } from "@/lib/api/apiLinks"
// import { RWebShare } from "react-web-share"
import { get, post } from "@/lib/api/apiCalls"
import { setCartItems } from '../../cartstorage/cart'
import { usePathname } from "next/navigation"
import { useRouter } from 'next-nprogress-bar';
import { Dialog, Transition, TransitionChild, DialogPanel, DisclosureButton } from '@headlessui/react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Disclosure } from '@headlessui/react'
import GlobalContext from '../../../GlobalContext'
import PickupStorePopup from '../../components/PickupStorePopup';
import { getCookie } from 'cookies-next';
import { useApp } from '@/app/_ctx/AppContext';
import { useSlot } from '@/app/_ctx/ClientDataRegistry';
import { getPickupFromStoreProduct, getProductExtraDataRegional } from '@/lib/productpages/product.client';
import SARIcon from '../../components/Icons/SARIcon';
import { ErrorTracker } from '../../utils/errorTracker';


// const LoginSingup = dynamic(() => import('../../components/LoginSignup'), { ssr: false })
const MobileHeader = dynamic(() => import('../../components/MobileHeader'), { ssr: true })
const RatingComponent = dynamic(() => import('../../components/ProductComponents/Rating'), { ssr: false })
const ProductSliderComponent = dynamic(() => import("../../components/NewHomePageComp/ProductSlider"), { ssr: false });

type GTMEventType =
    | 'view_item_list'
    | 'select_item'
    | 'view_item'
    | 'add_to_cart'
    | 'remove_from_cart';

interface ProductItem {
    name: string;
    slug: string;
    price: number;
    sale_price?: number;
    brand: { name: string; name_arabic?: string };
    featured_image: { image: string };
    id: string | number;
}

interface PushGTMEventProps {
    type: GTMEventType;
    products: ProductItem | ProductItem[]; // can be one or many
}

export default function Product() {
    const { lang, deviceType, t, origin } = useApp();
    const isArabic = lang === "ar" ? true : false;
    const productDataClassic = useSlot<any>("product");
    // const [data, setData] = useState<any>(productDataClassic?.data);
    const [direction, setDirection] = useState<"left-to-right" | "right-to-left">("left-to-right");
    const isMobileOrTablet = true;
    const [isOpen, setIsOpen] = useState<any>(false)
    const [FbtisOpen, setFbtisOpen] = useState<any>(false)
    const [imageZoom, setImageZoom] = useState<boolean>(false)
    // const [descriptionMore, setDescriptionMore] = useState<boolean>(false)
    // const [isactive, setActive] = useState<any>(false)
    const [loginPopup, setLoginPopup] = useState<any>(false)
    const [wishlistProduct, setWishlistProduct] = useState<any>(false)
    const [CompareProduct, setCompareProduct] = useState<any>(false)
    const [PriceAlertProduct, setPriceAlertProduct] = useState<any>(false)
    const [StockAlertProduct, setStockAlertProduct] = useState<any>(false)

    const [productdata, setProductData] = useState<any>(productDataClassic?.productdata);
    // const [upsaleproductdata, setUpSaleProductData] = useState<any>(productDataClassic?.upsaleproductData);
    // const [highestviewprodata, setHighestViewProData] = useState<any>(productDataClassic?.highestviewedpros?.products?.data);
    const [productimage, setProductImage] = useState<any>(NewMedia + productDataClassic?.data?.featured_image?.image);
    // const [gallerylength, setGalleryLength] = useState<any>(productDataClassic?.data?.gallery?.length);
    // const [showGallery, setshowGallery] = useState<any>(false)
    const [keyFeature, setKeyFeature] = useState<any>(false)
    const [extraData, setExtraData] = useState<any>([]);
    const [selectedGifts, setselectedGifts] = useState<any>({})
    const [sqty, setsqty] = useState<any>(1)
    const [checkQty, setcheckQty] = useState<any>(false)
    const [allowed_gifts, setallowed_gifts] = useState<any>(0)
    const [buyNowLoading, setBuyNowLoading] = useState<boolean>(false)
    const [addToCartLoading, setAddToCartLoading] = useState<boolean>(false)
    const [quantityBox, setQuantityBox] = useState<boolean>(false)
    const [fbtProCheck, setfbtProCheck] = useState<any>({})
    const [fbtProId, setfbtProId] = useState<any>(null)
    const [popupcart, setpopupcart] = useState<any>(false)
    const [popuppre, setpopuppre] = useState<any>(false)
    const [popupfbt, setpopupfbt] = useState<any>(false)
    const [popupfbtid, setpopupfbtid] = useState<any>(false)
    const [fiveStarRating, setFiveStarRating] = useState<any>(0)
    const [fourStarRating, setFourStarRating] = useState<any>(0)
    const [threeStarRating, setThreeStarRating] = useState<any>(0)
    const [twoStarRating, setTwoStarRating] = useState<any>(0)
    const [oneStarRating, setOneStarRating] = useState<any>(0)
    const [ratingResponseTotal, setRatingResponseTotal] = useState<any>(0)
    const [imageScale, setImageScale] = useState<any>(1)
    const [imageScalePlus, setImageScalePlus] = useState<any>(true)
    // const [imageScaleMinus, setImageScaleMinus] = useState<any>(false)
    // const [flexMediaStatus, setFlexMediaStatus] = useState<any>(false)
    const [descriptionStatus, setDescriptionStatus] = useState<any>(false)
    const scrollContainerRef = useRef<any>(null);

    // set express delivery text
    // const [expDeliveryText, setexpDeliveryText] = useState<any>('')
    const [expDeliveryQty, setexpDeliveryQty] = useState<any>('')
    const [expDelivery, setexpDelivery] = useState<any>(true)
    const [CheckexpDelivery, setCheckexpDelivery] = useState<any>(true)

    // Pickup From Store
    const { globalStore, setglobalStore } = useContext<any>(GlobalContext);
    const [allStores, setallStores] = useState<any>([])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [foundStore, setfoundStore] = useState(false)
    // const [storeSearch, setstoreSearch] = useState<any>('')

    const { updateCompare, setUpdateCompare } = useContext(GlobalContext);
    const { updateWishlist, setUpdateWishlist } = useContext(GlobalContext);

    {/* Commented Pickup Store */ }
    const getStoreData = async() => {
        const res = await getPickupFromStoreProduct(productDataClassic?.data?.sku, getCookie('selectedCity'), lang, sqty)
        if (res?.pickupStoreData?.warehouse_single) {
            setfoundStore(true)
            var check = setglobalStore(res?.pickupStoreData?.warehouse_single)
            localStorage.setItem('globalStore', res?.pickupStoreData?.warehouse_single?.id)
        }
        if (res?.pickupStoreData?.warehouse) {
            setallStores(res?.pickupStoreData?.warehouse)
        }
    }
    useEffect(() => {
        if (eligiblePickup) {
            getStoreData()
        }
    }, [sqty])

    const scrollTop = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                top: -200,
                behavior: "smooth",
            });
        }
    };

    const scrollBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                top: 200,
                behavior: "smooth",
            });
        }
    };

    const router = useRouter();
    const path = usePathname();

    let quantity = [];
    for (let i = 0; i < productDataClassic?.data?.quantity; i++) {
        quantity.push({ value: i + 1, label: i + 1 });
    }

    useEffect(() => {
        if (productDataClassic?.data?.upsaleproductData?.products?.data) {
            pushGTMEvent({
                type: 'view_item_list',
                products: productDataClassic?.data?.upsaleproductData?.products?.data,
            });
        }

        pushGTMEvent({
            type: 'view_item',
            products: productDataClassic?.data, // single product
        });
        if (!deviceType)
            router.refresh()
    }, [productDataClassic?.data])

    const breadcrumbs: any = productDataClassic?.data?.breadcrumbs ?? [];
    const item_category: any = breadcrumbs[0] ? (isArabic ? breadcrumbs[0]?.name_arabic : breadcrumbs[0]?.name) : "";
    const item_category2: any = breadcrumbs[1] ? (isArabic ? breadcrumbs[1]?.name_arabic : breadcrumbs[1]?.name) : "";
    const item_category3: any = breadcrumbs[2] ? (isArabic ? breadcrumbs[2]?.name_arabic : breadcrumbs[2]?.name) : "";
    const eligiblePickup = productDataClassic?.data?.eligible_for_pickup == 1;

    const handleGTMAddToCart = () => {
        pushGTMEvent({
            type: 'add_to_cart',
            products: productDataClassic?.data, // single product,
        });
    };

    const pushGTMEvent = ({
        type,
        products,
    }: PushGTMEventProps) => {
        if (typeof window === 'undefined' || !window.dataLayer) return;

        const isList = type === 'view_item_list';
        const productArray = Array.isArray(products) ? products : [products];
        if (!productArray.length) return;

        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
            event: type,
            value: Number(getDiscountedPrice()),
            currency: "SAR",
            platform: deviceType,
            ...(isList && {
                item_list_id: localStorage.getItem('item_list_id') ?? "5000",
                item_list_name: localStorage.getItem('item_list_name') ?? "direct"
            }),
            ecommerce: {
                items: productArray.map((item: any, index: number) => {
                    const getOriginalPrice = () => {
                        if (!item?.flash_sale_price && !item?.sale_price) return item?.price;
                        return item?.price;
                    };
                    const getDiscountedPrice = () => {
                        let salePrice = item?.sale_price > 0 ? item?.sale_price : item?.price;
                        if (item?.promotional_price > 0) {
                            salePrice = Math.max(0, Number(salePrice) - Number(item?.promotional_price));
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
                        item_id: item?.sku ?? "",
                        item_name: isArabic ? item?.name_arabic : item?.name,
                        item_brand: isArabic ? item?.brand?.name_arabic : item?.brand?.name,
                        item_image_link: `${NewMedia}${item?.featured_image?.image}`,
                        item_link: `${origin}/${isArabic ? 'ar' : 'en'}/${item?.slug}`,
                        price: Number(getDiscountedPrice()),
                        shelf_price: Number(getOriginalPrice()),
                        discount: Number(discountPrice ?? 0),
                        item_availability: "in stock",
                        item_category: item_category ?? "",
                        item_category2: item_category2 ?? "",
                        item_category3: item_category3 ?? "",
                        ...(!isList && {
                            item_list_id: localStorage.getItem('item_list_id') ?? "5000",
                            item_list_name: localStorage.getItem('item_list_name') ?? "direct"
                        }),
                        index,
                        quantity: sqty,
                        id: item?.sku ?? "",
                    }
                }),
            },
        });
    };

    useEffect(() => {
        const newId = localStorage.getItem('item_list_id') ?? '';
        const newName = localStorage.getItem('item_list_name') ?? '';

        if (newId && newName && productDataClassic?.data) {
            pushGTMEvent({
                type: 'select_item',
                products: productDataClassic?.data,
            });
        }
    }, [productDataClassic?.data]);

    useEffect(() => {
        productExtraData()
        // checkWishlistProduct()
        // checkCompareProduct()
        checkPriceAlertProduct()
        checkStockAlertProduct()
        getRating()
        {/* Commented Pickup Store */ }
        if (eligiblePickup) {
            getStoreData()
        }

        setTimeout(() => {
            if (productDataClassic?.data?.mpn) {
                const FlixMediaDescription: any = document.querySelector("#FlixMediaDescription");
                FlixMediaDescription.innerHTML += "<div id=\"flix-inpage\"></div>";
                // FlixMediaDescription.innerHTML += "<div id=\"flix-inpage\"></div>";
                var product_mpn = productDataClassic?.data?.mpn;
                var product_ean = "";
                var product_brand = productDataClassic?.data?.brand?.name;
                var distributor = "18631";
                var language = isArabic ? 'ar' : 'd2';
                // var language = isArabic? productDataClassic?.data?.flixmedia_ar : productDataClassic?.data?.flixmedia_en;
                var fallback_language = "";
                var headID = document.getElementsByTagName("head")[0];
                var flixScript = document.createElement('script');
                flixScript.type = 'text/javascript';
                flixScript.async = true;
                flixScript.setAttribute('data-flix-distributor', distributor);
                flixScript.setAttribute('data-flix-language', language);
                flixScript.setAttribute('data-flix-fallback-language', fallback_language);
                flixScript.setAttribute('data-flix-brand', product_brand);
                flixScript.setAttribute('data-flix-ean', product_ean);
                flixScript.setAttribute('data-flix-mpn', product_mpn);
                flixScript.setAttribute('data-flix-inpage', 'flix-inpage');
                flixScript.setAttribute('data-flix-button', 'flix-minisite');
                flixScript.setAttribute('data-flix-price',
                    '');
                headID.appendChild(flixScript);
                flixScript.src = '//media.flixfacts.com/js/loader.js';
            }
            setDescriptionStatus(true)
        }, 3000);

        if (!localStorage.getItem('saveType') && localStorage.getItem('saveType') != productDataClassic?.data?.save_type) {
            localStorage.setItem('saveType', productDataClassic?.data?.save_type)
        }

        if (localStorage.getItem('cartData')) {
            var cartdata;
            var d: any = localStorage.getItem('cartData')
            var decodedata = Buffer.from(d, 'base64').toString("utf-8")
            cartdata = JSON.parse(decodedata);
            if (cartdata?.products?.length) {
                var cartPro = cartdata?.products?.filter((item: { sku: any; }) => item.sku == productDataClassic?.data?.sku)[0]
                if (cartPro?.quantity == productDataClassic?.data?.quantity) {
                    setcheckQty(true)
                }
            }
        }
    }, [productDataClassic?.data])



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
            expired: false
        };
    }

    var d1 = dayjs(productDataClassic?.data?.created_at?.split('T')[0]).format('YYYY-MM-DD')
    var d2 = dayjs().format('YYYY-MM-DD')

    var productFlashSalePriceStatus = 0; // 1 for flash sale price, 0 for no flash sale price
    var productFlashSalePrice = 0;
    var productFlashSaleTimer: any = false;

    var flashCalc = productDataClassic?.data?.sale_price
    if (productDataClassic?.data?.flash_sale_expiry && productDataClassic?.data?.flash_sale_price) {
        var timer = calculateTimeLeft(productDataClassic?.data?.flash_sale_expiry);
        if (!timer?.expired) {
            productFlashSalePriceStatus = 1;
            productFlashSalePrice = productDataClassic?.data?.flash_sale_price;
            productFlashSaleTimer = `${timer?.hours}{" "}:{" "}${timer?.minutes}{" "}:{" "}${timer?.seconds}`;
            if (productDataClassic?.data) {
                flashCalc = productDataClassic?.data.flash_sale_price;
            }
        }
    }

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    // const checkWishlistProduct = () => {
    //     if (localStorage.getItem("userid")) {
    //         if (localStorage.getItem('userWishlist')) {
    //             var wdata: any = localStorage.getItem('userWishlist')
    //             wdata = JSON.parse(wdata)
    //             if (wdata.filter((item: any) => item == productDataClassic?.data?.id).length >= 1) {
    //                 setWishlistProduct(true)
    //             }
    //         }
    //     }
    //     else {
    //         setWishlistProduct(false)
    //     }
    // }

    const checkPriceAlertProduct = () => {
        if (localStorage.getItem("userid")) {
            var data = {
                user_id: localStorage.getItem("userid"),
                product_id: productDataClassic?.data?.id,
            }
            post('checkpricealertproduct', data).then((responseJson: any) => {
                if (responseJson?.success) {
                    setPriceAlertProduct(true)

                }
            })
        }
        else {
            setPriceAlertProduct(false)
        }
    }
    const checkStockAlertProduct = () => {
        if (localStorage.getItem("userid")) {
            var data = {
                user_id: localStorage.getItem("userid"),
                product_id: productDataClassic?.data?.id,
            }
            post('checkstockalertproduct', data).then((responseJson: any) => {
                if (responseJson?.success) {
                    setStockAlertProduct(true)
                }
            })
        }
        else {
            setStockAlertProduct(false)
        }
    }

    // const WishlistProduct = () => {
    //     if (localStorage.getItem("userid")) {
    //         var data = {
    //             user_id: localStorage.getItem("userid"),
    //             product_id: productDataClassic?.data?.id,
    //         }
    //         if (wishlistProduct) {
    //             post('removewishlist', data).then((responseJson: any) => {
    //                 if (responseJson?.success) {
    //                     setWishlistProduct(false)
    //                     if (localStorage.getItem("wishlistCount")) {
    //                         topMessageAlartDanger(t("products.wishlistRemovedText"))
    //                         var wishlistlength: any = localStorage.getItem('wishlistCount');
    //                         wishlistlength = parseInt(wishlistlength) - 1;
    //                         localStorage.setItem('wishlistCount', wishlistlength);
    //                     }
    //                     localStorage.removeItem('userWishlist')
    //                     setUpdateWishlist(updateWishlist == 0 ? 1 : 0)
    //                 }
    //             })
    //         } else {
    //             post('addwishlist', data).then((responseJson: any) => {
    //                 if (responseJson?.success) {
    //                     setWishlistProduct(true)
    //                     if (localStorage.getItem("wishlistCount")) {
    //                         // topMessageAlartSuccess(dict?.products.wishlistAddedText)
    //                         topMessageAlartSuccess(t("products.wishlistAddedText"));
    //                         var wishlistlength: any = localStorage.getItem('wishlistCount');
    //                         wishlistlength = parseInt(wishlistlength) + 1;
    //                         localStorage.setItem('wishlistCount', wishlistlength);
    //                     }
    //                     localStorage.removeItem('userWishlist')
    //                     setUpdateWishlist(updateWishlist == 0 ? 1 : 0)
    //                 }
    //             })
    //         }
    //     } else {
    //         router.push(`${origin}/${lang}/login`);
    //     }
    // }


    // const checkCompareProduct = () => {
    //     if (localStorage.getItem("userid")) {
    //         if (localStorage.getItem('userCompare')) {
    //             var wdata: any = localStorage.getItem('userCompare')
    //             wdata = JSON.parse(wdata)
    //             if (wdata.filter((item: any) => item == productDataClassic?.data?.id).length >= 1) {
    //                 setCompareProduct(true)
    //             }
    //         }
    //     }
    //     else {
    //         setCompareProduct(false)
    //     }
    // }

    // const CompareProductData = () => {
    //     if (localStorage.getItem("userid")) {
    //         var data = {
    //             user_id: localStorage.getItem("userid"),
    //             product_id: productDataClassic?.data?.id,
    //         }
    //         if (CompareProduct) {
    //             post('removecompare', data).then((responseJson: any) => {
    //                 if (responseJson?.success) {
    //                     setCompareProduct(false)
    //                     topMessageAlartDanger(t("products.compareRemovedText"))
    //                     if (localStorage.getItem("compareCount")) {
    //                         var comparelength: any = localStorage.getItem('compareCount');
    //                         comparelength = parseInt(comparelength) - 1;
    //                         localStorage.setItem('compareCount', comparelength);
    //                     }
    //                     localStorage.removeItem('userCompare')
    //                     setUpdateCompare(updateCompare == 0 ? 1 : 0)
    //                 }
    //             })
    //         } else {
    //             post('addcompare', data).then((responseJson: any) => {
    //                 if (responseJson?.success) {
    //                     setCompareProduct(true)
    //                     topMessageAlartSuccess(t("products.compareAddedText"))
    //                     if (localStorage.getItem("compareCount")) {
    //                         var comparelength: any = localStorage.getItem('compareCount');
    //                         comparelength = parseInt(comparelength) + 1;
    //                         localStorage.setItem('compareCount', comparelength);
    //                     }
    //                     localStorage.removeItem('userCompare')
    //                     setUpdateCompare(updateCompare == 0 ? 1 : 0)
    //                 } else {
    //                     topMessageAlartDanger(t("products.compareAlreadyText"))
    //                 }
    //             })
    //         }
    //     } else {
    //         router.push(`/${lang}/login`);
    //     }
    // }

    const handlePriceAlert = () => {
        if (localStorage.getItem("userid")) {
            var data = {
                user_id: localStorage.getItem("userid"),
                product_id: productDataClassic?.data?.id,
                product_sale_price: productDataClassic?.data?.sale_price,
            }
            if (PriceAlertProduct) {
                post('removepricealert', data).then((responseJson: any) => {
                    if (responseJson?.success) {
                        setPriceAlertProduct(false)
                        topMessageAlartDanger(t("products.PriceAlertRemovedText"))
                    }
                })
            } else {
                post('addpricealert', data).then((responseJson: any) => {
                    if (responseJson?.success) {
                        setPriceAlertProduct(true)
                        topMessageAlartSuccess(t("products.PriceAlertAddedText"))
                    }
                })
            }
        }
        else {
            router.push(`/${lang}/login`);
        }
    }

    const handleStockAlert = () => {
        if (localStorage.getItem("userid")) {
            var data = {
                user_id: localStorage.getItem("userid"),
                product_id: productDataClassic?.data?.id,
                product_sale_price: productDataClassic?.data?.sale_price,
            }
            if (StockAlertProduct) {
                post('removestockalert', data).then((responseJson: any) => {
                    if (responseJson?.success) {
                        setStockAlertProduct(false)
                        topMessageAlartDanger(t("products.StockAlertRemovedText"))
                    }
                })
            } else {
                post('addstockalert', data).then((responseJson: any) => {
                    if (responseJson?.success) {
                        setStockAlertProduct(true)
                        topMessageAlartSuccess(t("products.StockAlertAddedText"))
                    }
                })
            }
        }
        else {
            router.push(`/${lang}/login`);
        }
    }

    function CheckIcon(props: any) {
        return (
            <svg viewBox="0 0 24 24" fill="none" {...props}>
                <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
                <path
                    d="M7 13l3 3 7-7"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        )
    }

    function CheckIconInActive(props: any) {
        return (
            <svg viewBox="0 0 24 24" fill="none" {...props}>
                <circle cx={12} cy={12} r={12} fill="#004B7A80" opacity="0.2" />
            </svg>
        )
    }

    // const getCart: any = () => {
    //     router.push(`${origin}/${lang}/cart`);
    // }

    const productExtraData: any = async() => {
        const responseExtra = await getProductExtraDataRegional(productDataClassic?.data?.id,localStorage.getItem("globalcity"))
        if (responseExtra?.productextradata && responseExtra?.productextradata?.expressdeliveryData) {
            const numOfDays = responseExtra?.productextradata?.expressdeliveryData?.num_of_days;
            // const lang = lang;
            setexpDeliveryQty(responseExtra?.productextradata?.expressdeliveryData?.qty)
        }
        else {
            setCheckexpDelivery(false)
        }

        setExtraData(responseExtra?.productextradata)
        if (responseExtra?.productextradata?.freegiftdata)
            setallowed_gifts(responseExtra?.productextradata?.freegiftdata?.allowed_gifts)
        if (responseExtra?.productextradata?.freegiftdata?.allowed_gifts == responseExtra?.productextradata?.freegiftdata?.freegiftlist.length && responseExtra?.productextradata?.freegiftdata?.discount_type == 1) {
            var gifts = selectedGifts
            for (let index = 0; index < responseExtra?.productextradata?.freegiftdata?.freegiftlist.length; index++) {
                const element = responseExtra?.productextradata?.freegiftdata?.freegiftlist[index];
                gifts[element.id] = true
            }
            setselectedGifts(gifts)
        }
        if (responseExtra?.productextradata?.fbtdata) {
            var fbtlist = responseExtra?.productextradata?.fbtdata?.fbtlist[0]
            var newfbtdata = fbtProCheck
            newfbtdata[fbtlist?.id] = true
            setfbtProId(fbtlist?.id)
            setfbtProCheck({ ...newfbtdata })
        }
    }

    const addfbt = (fbtid: number) => {
        var discountpricevalue: any = 0;
        var addtionaldiscount: any = 0;
        var discounttype: any = 0;
        if (productDataClassic?.data?.discounttypestatus == 1) {
            addtionaldiscount = productDataClassic?.data?.discounttypestatus;
            discounttype = productDataClassic?.data?.discountcondition;
            if (productDataClassic?.data?.discountcondition === 1) {
                discountpricevalue = productDataClassic?.data?.discountvalue;
            } else if (productDataClassic?.data?.discountcondition == 2) {
                if (productDataClassic?.data?.sale_price > 0) {
                    discountpricevalue = (productDataClassic?.data?.sale_price / 100) * productDataClassic?.data?.discountvalue;
                } else {
                    discountpricevalue = (productDataClassic?.data?.price / 100) * productDataClassic?.data?.discountvalue;
                }
                if (discountpricevalue > productDataClassic?.data?.discountvaluecap) {
                    discountpricevalue = productDataClassic?.data?.discountvaluecap;
                }
            } else if (productDataClassic?.data?.discountcondition == 3) {
                if (productDataClassic?.data?.pricetypevat == 0) {
                    discountpricevalue = productDataClassic?.data?.sale_price - ((productDataClassic?.data?.sale_price / 115) * 100);
                } else {
                    discountpricevalue = productDataClassic?.data?.price - ((productDataClassic?.data?.price / 115) * 100);
                }
            }
        }
        if (extraData?.freegiftdata?.discount_type == 1 && Object.keys(selectedGifts).length != allowed_gifts) {
            topMessageAlartDanger(t("products.addGiftText"))
            setIsOpen(true)
            setpopupcart(false)
            setpopuppre(false)
            setpopupfbt(true)
            setpopupfbtid(fbtid)
            return false
        }
        var item: any = {
            id: productDataClassic?.data?.id,
            sku: productDataClassic?.data?.sku,
            name: productDataClassic?.data?.name,
            name_arabic: productDataClassic?.data?.name_arabic,
            image: productDataClassic?.data?.featured_image ? NewMedia + productDataClassic?.data?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
            price: productDataClassic?.data?.sale_price ? productDataClassic?.data?.sale_price : productDataClassic?.data?.price,
            regular_price: productDataClassic?.data?.price,
            quantity: sqty,
            total_quantity: productDataClassic?.data?.quantity,
            brand: productDataClassic?.data?.brand,
            slug: productDataClassic?.data?.slug,
            pre_order: 0,
            pre_order_day: false,
            discounted_amount: discountpricevalue,
            discounttype: discounttype,
            addtionaldiscount: addtionaldiscount,
        }

        var gifts: any = false
        if (Object.keys(selectedGifts).length > 0) {
            gifts = []
            for (let index = 0; index < extraData?.freegiftdata?.freegiftlist?.length; index++) {
                const element = extraData?.freegiftdata?.freegiftlist[index];
                if (selectedGifts[element.id]) {
                    var amount = 0
                    if (extraData?.freegiftdata?.discount_type == 2) {
                        var fgprice = element?.productdetail?.sale_price ? element?.productdetail?.sale_price : element?.productdetail?.price;
                        fgprice -= (element?.discount * fgprice) / 100;
                    }
                    else if (extraData?.freegiftdata?.discount_type == 3)
                        amount = element.discount
                    var giftitem: any = {
                        id: element.productdetail.id,
                        sku: element.productdetail.sku,
                        name: element.productdetail.name,
                        name_arabic: element.productdetail.name_arabic,
                        image: element.productdetail?.featured_image ? NewMedia + element.productdetail?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
                        price: element.productdetail.sale_price ? element.productdetail.sale_price : element.productdetail.price,
                        regular_price: element.productdetail.price,
                        quantity: sqty,
                        gift_id: extraData?.freegiftdata?.id,
                        discounted_amount: amount,
                        slug: element.productdetail?.slug,
                        pre_order: 0,
                        pre_order_day: false

                    }
                    gifts.push(giftitem)
                }
            }
        }

        var fbt: any = []
        for (let index = 0; index < extraData?.fbtdata?.fbtlist?.length; index++) {
            const element = extraData?.fbtdata?.fbtlist[index];
            if (element.id == fbtid) {
                var fbtprice: number = element.productdetail.sale_price ? element.productdetail.sale_price : element.productdetail.price
                if (extraData?.fbtdata?.discount_type == 1) {
                    fbtprice -= (element?.discount * fbtprice) / 100;
                } else {
                    // fbtprice = element?.discount;
                    // amount type
                    if (extraData?.fbtdata?.amount_type == 1) {
                        fbtprice = fbtprice - element?.discount;
                    }
                    else {
                        fbtprice = element?.discount;
                    }
                }
                var fbtitem: any = {
                    id: element.productdetail.id,
                    sku: element.productdetail.sku,
                    name: element.productdetail.name,
                    name_arabic: element.productdetail.name_arabic,
                    image: element.productdetail?.featured_image ? NewMedia + element.productdetail?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
                    price: element.productdetail.sale_price ? element.productdetail.sale_price : element.productdetail.price,
                    regular_price: element.productdetail.price,
                    quantity: element.productdetail?.quantity >= sqty ? sqty : element.productdetail?.quantity,
                    fbt_id: extraData?.fbtdata?.id,
                    discounted_amount: fbtprice,
                    total_quantity: element.productdetail?.live_stock_sum?.length >= 1 ? element.productdetail?.live_stock_sum[0].quantity : 0,
                    slug: element.productdetail?.slug,
                    pre_order: 0,
                    pre_order_day: false
                }
                fbt.push(fbtitem)
                topMessageAlartSuccess(t("products.fbtAddedText"), true)
            }
        }
        setCartItems(item, gifts, fbt)
        // getCriteoAddToCart()
    }
    // const buyNow = () => {
    //     // addDataLayer()
    //     var discountpricevalue: any = 0;
    //     var addtionaldiscount: any = 0;
    //     var discounttype: any = 0;
    //     if (productDataClassic?.data?.discounttypestatus == 1) {
    //         addtionaldiscount = productDataClassic?.data?.discounttypestatus;
    //         discounttype = productDataClassic?.data?.discountcondition;
    //         if (productDataClassic?.data?.discountcondition === 1) {
    //             discountpricevalue = productDataClassic?.data?.discountvalue;
    //         } else if (productDataClassic?.data?.discountcondition == 2) {
    //             if (productDataClassic?.data?.sale_price > 0) {
    //                 discountpricevalue = (productDataClassic?.data?.sale_price / 100) * productDataClassic?.data?.discountvalue;
    //             } else {
    //                 discountpricevalue = (productDataClassic?.data?.price / 100) * productDataClassic?.data?.discountvalue;
    //             }
    //             if (discountpricevalue > productDataClassic?.data?.discountvaluecap) {
    //                 discountpricevalue = productDataClassic?.data?.discountvaluecap;
    //             }
    //         } else if (productDataClassic?.data?.discountcondition == 3) {
    //             if (productDataClassic?.data?.pricetypevat == 0) {
    //                 discountpricevalue = productDataClassic?.data?.sale_price - ((productDataClassic?.data?.sale_price / 115) * 100);
    //             } else {
    //                 discountpricevalue = productDataClassic?.data?.price - ((productDataClassic?.data?.price / 115) * 100);
    //             }
    //         }
    //     }
    //     setBuyNowLoading(true)
    //     var item: any = {
    //         id: productDataClassic?.data?.id,
    //         sku: productDataClassic?.data?.sku,
    //         name: productDataClassic?.data?.name,
    //         name_arabic: productDataClassic?.data?.name_arabic,
    //         image: productDataClassic?.data?.featured_image ? NewMedia + productDataClassic?.data?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
    //         // price: productDataClassic?.data?.sale_price ? productDataClassic?.data?.sale_price : productDataClassic?.data?.price,
    //         price: flashCalc ? flashCalc : productDataClassic?.data?.sale_price ? productDataClassic?.data?.sale_price : productDataClassic?.data?.price,
    //         regular_price: productDataClassic?.data?.price,
    //         quantity: sqty,
    //         total_quantity: productDataClassic?.data?.quantity,
    //         brand: productDataClassic?.data?.brand,
    //         slug: productDataClassic?.data?.slug,
    //         pre_order: 0,
    //         pre_order_day: false,
    //         discounted_amount: discountpricevalue,
    //         discounttype: discounttype,
    //         addtionaldiscount: addtionaldiscount,
    //     }
    //     var gifts: any = false
    //     var fbt_false: any = false
    //     setCartItems(item, gifts, fbt_false)
    //     getCriteoAddToCart()
    //     // router.push(`/${lang}/checkout`);
    //     router.push(`/${lang}/cart`);

    // }

    const addDataLayer = () => {
        const dataUrl = `${origin}/${lang}/product/${productDataClassic?.data?.slug}`;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'addToCart',
            id: productDataClassic?.data?.id,
            name: productDataClassic?.data?.name,
            name_arabic: productDataClassic?.data?.name_arabic,
            slug: productDataClassic?.data?.slug,
            price: productDataClassic?.data?.price,
            sale_price: productDataClassic?.data?.sale_price,
            status: productDataClassic?.data?.status,
            data_url: dataUrl,
            categories: productDataClassic?.data?.productcategory.map((category: any) => ({
                id: category.id,
                name: category.name,
                name_arabic: category.name_arabic,
            })),
            featured_image: {
                id: productDataClassic?.data?.featured_image.id,
                image: productDataClassic?.data?.featured_image.image,
            }
        });
    }

    const addToCart = () => {
        // addDataLayer()

        // Express delivery display
        if (extraData && extraData?.expressdeliveryData) {
            if (sqty > extraData?.expressdeliveryData?.qty) {
                setexpDelivery(false)
            }
            else {
                setexpDelivery(true)
            }
        }

        var discountpricevalue: any = 0;
        var addtionaldiscount: any = 0;
        var discounttype: any = 0;
        if (productDataClassic?.data?.discounttypestatus == 1) {
            addtionaldiscount = productDataClassic?.data?.discounttypestatus;
            discounttype = productDataClassic?.data?.discountcondition;
            if (productDataClassic?.data?.discountcondition === 1) {
                discountpricevalue = productDataClassic?.data?.discountvalue;
            } else if (productDataClassic?.data?.discountcondition == 2) {
                if (productDataClassic?.data?.sale_price > 0) {
                    discountpricevalue = (productDataClassic?.data?.sale_price / 100) * productDataClassic?.data?.discountvalue;
                } else {
                    discountpricevalue = (productDataClassic?.data?.price / 100) * productDataClassic?.data?.discountvalue;
                }
                if (discountpricevalue > productDataClassic?.data?.discountvaluecap) {
                    discountpricevalue = productDataClassic?.data?.discountvaluecap;
                }
            } else if (productDataClassic?.data?.discountcondition == 3) {
                if (productDataClassic?.data?.pricetypevat == 0) {
                    discountpricevalue = productDataClassic?.data?.sale_price - ((productDataClassic?.data?.sale_price / 115) * 100);
                } else {
                    discountpricevalue = productDataClassic?.data?.price - ((productDataClassic?.data?.price / 115) * 100);
                }
            }
        }
        setAddToCartLoading(true)
        if (extraData?.freegiftdata?.freegiftlist?.length == extraData?.freegiftdata?.allowed_gifts && extraData?.freegiftdata?.freegiftlist?.filter((e: any) => e?.discount > 0)?.length <= 0) {
            closeModal()
            var item: any = {
                id: productDataClassic?.data?.id,
                sku: productDataClassic?.data?.sku,
                name: productDataClassic?.data?.name,
                name_arabic: productDataClassic?.data?.name_arabic,
                image: productDataClassic?.data?.featured_image ? NewMedia + productDataClassic?.data?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
                price: flashCalc ? flashCalc : productDataClassic?.data?.sale_price ? productDataClassic?.data?.sale_price : productDataClassic?.data?.price,
                regular_price: productDataClassic?.data?.price,
                quantity: sqty,
                total_quantity: productDataClassic?.data?.quantity,
                brand: productDataClassic?.data?.brand,
                slug: productDataClassic?.data?.slug,
                pre_order: productDataClassic?.data?.pre_order,
                pre_order_day: productDataClassic?.data?.pre_order != null ? productDataClassic?.data?.no_of_days : false,
                discounted_amount: discountpricevalue,
                discounttype: discounttype,
                addtionaldiscount: addtionaldiscount,
                item_list_id: localStorage.getItem('item_list_id') ?? '5000',
                item_list_name: localStorage.getItem('item_list_name') ?? 'direct',
            }

            var gifts: any = false
            if (extraData?.freegiftdata?.freegiftlist?.length > 0) {
                gifts = []
                for (let index = 0; index < extraData?.freegiftdata?.freegiftlist?.length; index++) {
                    const element = extraData?.freegiftdata?.freegiftlist[index];
                    var amount = 0
                    if (extraData?.freegiftdata?.discount_type == 2) {
                        var fgprice = element?.productdetail?.sale_price ? element?.productdetail?.sale_price : element?.productdetail?.price;
                        fgprice -= (element?.discount * fgprice) / 100;
                    }
                    else if (extraData?.freegiftdata?.discount_type == 3)
                        amount = element.discount
                    var giftitem: any = {
                        id: element.productdetail.id,
                        sku: element.productdetail.sku,
                        name: element.productdetail.name,
                        name_arabic: element.productdetail.name_arabic,
                        image: element.productdetail?.featured_image ? NewMedia + element.productdetail?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
                        price: element.productdetail.sale_price ? element.productdetail.sale_price : element.productdetail.price,
                        regular_price: element.productdetail.price,
                        quantity: sqty,
                        gift_id: extraData?.freegiftdata?.id,
                        discounted_amount: amount,
                        slug: element.productdetail?.slug,
                        pre_order: 0,
                        pre_order_day: false,
                        item_list_id: localStorage.getItem('item_list_id') ?? '5000',
                        item_list_name: localStorage.getItem('item_list_name') ?? 'direct',
                    }
                    gifts.push(giftitem)
                }
            }
            var fbt_false: any = false;
            setCartItems(item, gifts, fbt_false)
            // getCriteoAddToCart()
            topMessageAlartSuccess(t("products.productCart"), true)
            setAddToCartLoading(false)
            return false;
        }
        if (extraData?.freegiftdata && Object.keys(selectedGifts).length != allowed_gifts) {
            setIsOpen(true)
            setAddToCartLoading(false)
            setpopupcart(true)
            setpopuppre(false)
            setpopupfbt(false)
            return false
        } else {
            closeModal()
            var item: any = {
                id: productDataClassic?.data?.id,
                sku: productDataClassic?.data?.sku,
                name: productDataClassic?.data?.name,
                name_arabic: productDataClassic?.data?.name_arabic,
                image: productDataClassic?.data?.featured_image ? NewMedia + productDataClassic?.data?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
                price: flashCalc ? flashCalc : productDataClassic?.data?.sale_price ? productDataClassic?.data?.sale_price : productDataClassic?.data?.price,
                regular_price: productDataClassic?.data?.price,
                quantity: sqty,
                total_quantity: productDataClassic?.data?.quantity,
                brand: productDataClassic?.data?.brand,
                slug: productDataClassic?.data?.slug,
                pre_order: productDataClassic?.data?.pre_order,
                pre_order_day: productDataClassic?.data?.pre_order != null ? productDataClassic?.data?.no_of_days : false,
                discounted_amount: discountpricevalue,
                discounttype: discounttype,
                addtionaldiscount: addtionaldiscount,
                item_list_id: localStorage.getItem('item_list_id') ?? '5000',
                item_list_name: localStorage.getItem('item_list_name') ?? 'direct',
            }

            var gifts: any = false
            if (Object.keys(selectedGifts).length > 0) {
                gifts = []
                for (let index = 0; index < extraData?.freegiftdata?.freegiftlist?.length; index++) {
                    const element = extraData?.freegiftdata?.freegiftlist[index];
                    if (selectedGifts[element.id]) {
                        var amount = 0
                        if (extraData?.freegiftdata?.discount_type == 2) {
                            var fgprice = element?.productdetail?.sale_price ? element?.productdetail?.sale_price : element?.productdetail?.price;
                            fgprice -= (element?.discount * fgprice) / 100;
                        }
                        else if (extraData?.freegiftdata?.discount_type == 3)
                            amount = element.discount
                        var giftitem: any = {
                            id: element.productdetail.id,
                            sku: element.productdetail.sku,
                            name: element.productdetail.name,
                            name_arabic: element.productdetail.name_arabic,
                            image: element.productdetail?.featured_image ? NewMedia + element.productdetail?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
                            price: element.productdetail.sale_price ? element.productdetail.sale_price : element.productdetail.price,
                            regular_price: element.productdetail.price,
                            quantity: sqty,
                            gift_id: extraData?.freegiftdata?.id,
                            discounted_amount: amount,
                            slug: element.productdetail?.slug,
                            pre_order: 0,
                            pre_order_day: false,
                            item_list_id: localStorage.getItem('item_list_id') ?? '5000',
                            item_list_name: localStorage.getItem('item_list_name') ?? 'direct',
                        }
                        gifts.push(giftitem)
                    }
                }
            }
            var fbt_false: any = false;
            setCartItems(item, gifts, fbt_false)
            // getCriteoAddToCart()
            topMessageAlartSuccess(t("products.productCart"), true)
            setAddToCartLoading(false)
        }
    }

    const singleAddToCart = () => {
        var discountpricevalue: any = 0;
        var addtionaldiscount: any = 0;
        var discounttype: any = 0;
        if (productDataClassic?.data?.discounttypestatus == 1) {
            addtionaldiscount = productDataClassic?.data?.discounttypestatus;
            discounttype = productDataClassic?.data?.discountcondition;
            if (productDataClassic?.data?.discountcondition === 1) {
                discountpricevalue = productDataClassic?.data?.discountvalue;
            } else if (productDataClassic?.data?.discountcondition == 2) {
                if (productDataClassic?.data?.sale_price > 0) {
                    discountpricevalue = (productDataClassic?.data?.sale_price / 100) * productDataClassic?.data?.discountvalue;
                } else {
                    discountpricevalue = (productDataClassic?.data?.price / 100) * productDataClassic?.data?.discountvalue;
                }
                if (discountpricevalue > productDataClassic?.data?.discountvaluecap) {
                    discountpricevalue = productDataClassic?.data?.discountvaluecap;
                }
            } else if (productDataClassic?.data?.discountcondition == 3) {
                if (productDataClassic?.data?.pricetypevat == 0) {
                    discountpricevalue = productDataClassic?.data?.sale_price - ((productDataClassic?.data?.sale_price / 115) * 100);
                } else {
                    discountpricevalue = productDataClassic?.data?.price - ((productDataClassic?.data?.price / 115) * 100);
                }
            }
        }
        closeModal()
        setAddToCartLoading(true)
        var item: any = {
            id: productDataClassic?.data?.id,
            sku: productDataClassic?.data?.sku,
            name: productDataClassic?.data?.name,
            name_arabic: productDataClassic?.data?.name_arabic,
            image: productDataClassic?.data?.featured_image ? NewMedia + productDataClassic?.data?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
            price: flashCalc ? flashCalc : productDataClassic?.data?.sale_price ? productDataClassic?.data?.sale_price : productDataClassic?.data?.price,
            regular_price: productDataClassic?.data?.price,
            quantity: sqty,
            total_quantity: productDataClassic?.data?.quantity,
            brand: productDataClassic?.data?.brand,
            slug: productDataClassic?.data?.slug,
            pre_order: productDataClassic?.data?.pre_order,
            pre_order_day: productDataClassic?.data?.pre_order != null ? productDataClassic?.data?.no_of_days : false,
            discounted_amount: discountpricevalue,
            discounttype: discounttype,
            addtionaldiscount: addtionaldiscount,
            item_list_id: localStorage.getItem('item_list_id') ?? '5000',
            item_list_name: localStorage.getItem('item_list_name') ?? 'direct',
        }
        var gifts: any = false;
        var fbt_false: any = false;
        setCartItems(item, gifts, fbt_false)
        // getCriteoAddToCart()
        topMessageAlartSuccess(t("products.productCart"), true)
        setAddToCartLoading(false)
    }

    const MySwal = withReactContent(Swal);
    const topMessageAlartSuccess = (title: any, viewcart: boolean = false) => {
        MySwal.fire({
            icon: "success",
            title:
                <div className="text-xs">
                    <div className="">{title}</div>
                    {viewcart ?
                        <>
                            <p className="font-light mb-3">{isArabic ? 'تمت إضافة العنصر إلى سلة التسوق الخاصة بك.' : 'The item has been added into your cart.'}</p>
                            <button
                                onClick={() => {
                                    router.push(`/${lang}/cart`)
                                    router.refresh();
                                }}
                                className="focus-visible:outline-none mt-2 underline">
                                {isArabic ? 'عرض العربة' : 'View Cart'}
                            </button>
                        </>
                        : null}
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

    const topMessageAlartDanger = (title: any) => {
        MySwal.fire({
            icon: "error",
            title:
                <div className="text-xs">
                    <div className="">{title}</div>
                </div>
            ,
            toast: true,
            position: isArabic ? 'top-start' : 'top-end',
            showConfirmButton: false,
            timer: 15000,
            showCloseButton: true,
            background: '#DC4E4E',
            color: '#FFFFFF',
            timerProgressBar: true,
        });
    };

    const getRating = () => {
        if (productDataClassic?.data?.reviews?.length) {
            var totalrating: any = 0;
            var fiveStarRating = productDataClassic?.data?.reviews?.filter((item: { rating: any; }) => item?.rating == '5')
            var fourStarRating = productDataClassic?.data?.reviews?.filter((item: { rating: any; }) => item?.rating == '4')
            var threeStarRating = productDataClassic?.data?.reviews?.filter((item: { rating: any; }) => item?.rating == '3')
            var twoStarRating = productDataClassic?.data?.reviews?.filter((item: { rating: any; }) => item?.rating == '2')
            var oneStarRating = productDataClassic?.data?.reviews?.filter((item: { rating: any; }) => item?.rating == '1')
            var ratingScoreTotal: any = fiveStarRating?.length * 5 + fourStarRating?.length * 4 + threeStarRating?.length * 3 + twoStarRating?.length * 2 + oneStarRating?.length * 1;
            var ratingResponseTotal: any = fiveStarRating?.length + fourStarRating?.length + threeStarRating?.length + twoStarRating?.length + oneStarRating?.length;
            totalrating = Math.ceil(ratingScoreTotal / ratingResponseTotal);

            setFiveStarRating(fiveStarRating?.length)
            setFourStarRating(fourStarRating?.length)
            setThreeStarRating(threeStarRating?.length)
            setTwoStarRating(twoStarRating?.length)
            setOneStarRating(oneStarRating?.length)
            setRatingResponseTotal(ratingResponseTotal)
        }
    }


    // const getCriteoAddToCart = () => {
    //     // var windowCriteo: any = typeof window !== "undefined" ? window.criteo_q : "";
    //     window.dataLayer = window.dataLayer || [];
    //     window.dataLayer.push({
    //         'event': 'criteo_addtocart',
    //         'criteo.ecommerce': {
    //             'currency': 'SAR',
    //             'items': [
    //                 {
    //                     'item_id': productDataClassic?.data?.id,
    //                     'price': productDataClassic?.data?.sale_price ? productDataClassic?.data?.sale_price : productDataClassic?.data?.price,
    //                     'quantity': productDataClassic?.data?.quantity
    //                 }
    //             ]
    //         }
    //     });
    // }

    function CheckIconFBT(props: any) {
        return (
            <svg viewBox="0 0 24 24" fill="none" {...props}>
                <circle cx={10} cy={10} r={10} fill="#004B7A80" opacity="0.2" />
            </svg>
        )
    }

    function CheckIconFBTActive(props: any) {
        return (
            <svg viewBox="0 0 24 24" fill="none" {...props}>
                <circle cx={10} cy={10} r={10} fill="#004B7A" opacity="100" />
                <path
                    d="M5 11l3 3 6-6"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        )
    }


    const getFormattedPrice = (price: number | undefined) =>
        price ? price.toLocaleString('EN-US') : '';

    const getDiscountedPrice = () => {
        var salePrice = productDataClassic?.data?.sale_price > 0 ? productDataClassic?.data?.sale_price : productDataClassic?.data?.price;
        if (productDataClassic?.data?.promotional_price > 0) {
            salePrice = Math.max(
                0,
                Number(salePrice) - Number(productDataClassic?.data?.promotional_price)
            )
        }
        var flashAmount = salePrice

        if (productDataClassic?.data?.flash_sale_expiry && productDataClassic?.data?.flash_sale_price) {
            var timer = calculateTimeLeft(productDataClassic?.data?.flash_sale_expiry);
            if (!timer?.expired) {
                productFlashSalePriceStatus = 1;
                productFlashSalePrice = productDataClassic?.data?.flash_sale_price;
                productFlashSaleTimer = `${timer?.hours}{" "}:{" "}${timer?.minutes}{" "}:{" "}${timer?.seconds}`;
                if (productDataClassic?.data) {
                    flashAmount = productDataClassic?.data.flash_sale_price;
                }
            }
        }

        return flashAmount
    };

    const getOriginalPrice = () => {
        if (!productDataClassic?.data?.flash_sale_price && !productDataClassic?.data?.sale_price) return '';
        return productDataClassic?.data?.price;
    };
    const currencySymbol = <SARIcon size={18} />

    const currencySmallSymbol =  <SARIcon size={12} />

    const currencyExtraSmallSymbol = <SARIcon size={10} />

    var productFlashSalePriceStatus = 0; // 1 for flash sale price, 0 for no flash sale price
    var productFlashSalePrice = 0;
    // var productFlashSaleTimer = "10:41:04";
    var productFlashSaleTimer: any = false;

    if (productDataClassic?.data?.flash_sale_expiry && productDataClassic?.data?.flash_sale_price) {
        var timer = calculateTimeLeft(productDataClassic?.data?.flash_sale_expiry);
        if (!timer?.expired) {
            productFlashSalePriceStatus = 1;
            productFlashSalePrice = productDataClassic?.data?.flash_sale_price;
            productFlashSaleTimer = `${timer?.hours}{" "}:{" "}${timer?.minutes}{" "}:{" "}${timer?.seconds}`;
            if (productDataClassic?.data) {
                productDataClassic.data.sale_price = productDataClassic?.data?.flash_sale_price;
            }
        }
    }

    const salePormotionPriceSatus =
        productDataClassic?.data?.promotional_price == null ? 0 : 1; // 1 for sale, 0 for no sale This is for dummy value only
    // const salePormotionText =
    //     salePormotionPriceSatus > 0 && productFlashSalePriceStatus == 0
    //         ? isArabic
    //             ? productDataClassic?.data?.promo_title_arabic
    //             : productDataClassic?.data?.promo_title
    //         : "";

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

    const badgeImageLink = productDataClassic?.data?.badge_image_link ? productDataClassic?.data?.badge_image_link : isArabic ? "/icons/express_logo/express_logo_ar.png" : "/icons/express_logo/express_logo_en.png";
    const badgePromoTitle = isArabic ? (productDataClassic?.data?.badge_promo_title_arabic ?? "السعر بعد الخصم يشمل الاسترداد النقدي") : (productDataClassic?.data?.badge_promo_title ?? "Sale Price Included Cashback");
    const badgeBackgroundColor = productDataClassic?.data?.badge_bg_color ? productDataClassic?.data?.badge_bg_color : "#fde18d";
    const badgeHeadingColor = productDataClassic?.data?.badge_heading_color ? productDataClassic?.data?.badge_heading_color : "#000000";
    const badgePriceColor = productDataClassic?.data?.badge_price_color ? productDataClassic?.data?.badge_price_color : "#219EBC";


    return (
        <>
            {/* <LoginSingup show={loginPopup} lang={lang} dict={dict} onClose={() => setLoginPopup(false)} /> */}
            <MobileHeader
                type="Product"
                ariaLabel={isArabic ? 'شـارك الــمــنـتـج' : 'Share Product'}
                title={isArabic ? productDataClassic?.data?.name_arabic : productDataClassic?.data?.name}
                text={isArabic ? productDataClassic?.data?.meta_description_ar : productDataClassic?.data?.meta_description_en}
                url={`${origin}/${lang}/product/${productDataClassic?.data?.slug}`}
                lang={lang}
            />

            <div className="container py-4 max-md:pt-20">
                <div className="md:flex pb-2 pt-10 max-md:pt-0 gap-x-4">
                    {/* Left Side Part Image Area */}
                    <div className="flex items-start gap-x-3.5 w-full">
                        <div className=''>
                            <div className="mx-auto md:flex justify-center items-center md:bg-white md:shadow-md md:rounded-md relative">
                                <div onClick={() => setImageZoom(true)} className="cursor-zoom-in flex justify-center items-center relative">
                                    <Image
                                        src={productimage ? productimage : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                        alt={isArabic ? productDataClassic?.data?.name_arabic : productDataClassic?.data?.name}
                                        title={isArabic ? productDataClassic?.data?.name_arabic : productDataClassic?.data?.name}
                                        height={600}
                                        width={600}
                                        priority={true}
                                        className="rounded-md max-md:shadow-md overflow-hidden"
                                        sizes='(max-width: 640px) 150px, (max-width: 768px) 150px, (max-width: 1024px) 150px, 100vw'
                                    />
                                    <div className="gap-x-2 absolute bottom-3 z-10 mx-auto no-scrollbar" id="scroll-containerPopup">
                                        {productDataClassic?.data?.gallery?.length >= 1 ?
                                            <button className={`focus-visible:outline-none rounded-md w-2 h-2 hover:bg-[#219EBC] ${productimage == NewMedia + productDataClassic?.data?.featured_image?.image ? "bg-[#219EBC]" : "bg-gray opacity-30"}`}
                                                onClick={(e) => { e.stopPropagation(), setProductImage(NewMedia + productDataClassic?.data?.featured_image?.image), setImageScale(1) }}></button>
                                            : null}

                                        {productDataClassic?.data?.gallery?.slice(0, 9).map((item: any, i: any) => {
                                            return (
                                                <button key={i} className={`focus-visible:outline-none ltr:ml-1 rtl:mr-1 rounded-md w-2 h-2 hover:bg-[#219EBC] ${productimage == NewMedia + item?.gallery_image?.image ? "bg-[#219EBC]" : "bg-gray opacity-30"}`} onClick={(e) => { e.stopPropagation(), setProductImage(NewMedia + item?.gallery_image?.image) }}></button>
                                            )
                                        })}
                                    </div>
                                    <div className="absolute top-0 w-full h-full">
                                        {dayjs(d2).diff(d1, 'days') <= productDataClassic?.data?.newtype ?
                                            <div className='text-[#20831E] text-xs absolute ltr:left-0 rtl:right-0 top-0 bg-[#20831E20] md:px-3.5 px-2 py-1 rtl:rounded-bl-lg rtl:rounded-tr-lg ltr:rounded-br-lg ltr:rounded-tl-lg'>{isArabic ? 'جديد' : 'New'}</div>
                                            : productDataClassic?.data?.best_seller == 1 ?
                                                <div className='text-[#20831E] text-xs absolute ltr:left-0 rtl:right-0 top-0 bg-[#20831E20] md:px-3.5 px-2 py-1 rtl:rounded-bl-lg rtl:rounded-tr-lg ltr:rounded-br-lg ltr:rounded-tl-lg'>{isArabic ? 'بيع سريع' : 'Selling Out Fast'}</div>
                                                : productDataClassic?.data?.top_selling == 2 ?
                                                    <div className='text-[#0B5ED8] text-xs absolute ltr:left-0 rtl:right-0 top-0 bg-[#0B5ED820] md:px-3.5 px-2 py-1 rtl:rounded-bl-lg rtl:rounded-tr-lg ltr:rounded-br-lg ltr:rounded-tl-lg'>{isArabic ? 'الأكثر مبيعا' : 'Top Selling'}</div>
                                                    : productDataClassic?.data?.low_in_stock == 3 ?
                                                        <div className='text-[#F0660C] text-xs absolute ltr:left-0 rtl:right-0 top-0 bg-[#F0660C20] md:px-3.5 px-2 py-1 rtl:rounded-bl-lg rtl:rounded-tr-lg ltr:rounded-br-lg ltr:rounded-tl-lg'>{isArabic ? 'انخفاض في المخزون' : 'Low in Stock'}</div>
                                                        : null}
                                        {/* <div className='text-[#20831E] text-xs absolute ltr:left-0 rtl:right-0 top-0 bg-[#20831E20] px-3.5 py-1 rtl:rounded-bl-lg rtl:rounded-tr-lg ltr:rounded-br-lg ltr:rounded-tl-lg'>{isArabic? 'الاكثر مبيعا' : 'Best Seller'}</div> */}
                                        <>
                                            {productDataClassic?.data?.sale_price ?
                                                <div className='text-[#EA4335] text-xs absolute ltr:right-0 rtl:left-0 top-0 bg-[#EA433520] md:px-3.5 px-2 py-1 rtl:rounded-tl-lg rtl:rounded-br-lg ltr:rounded-bl-lg ltr:rounded-tr-lg'>
                                                    {productDataClassic?.data?.save_type === 1 ?
                                                        isArabic ?
                                                            `خصم %${Math.round(((productDataClassic?.data?.price - flashCalc) * 100) / productDataClassic?.data?.price)}` :
                                                            `OFF ${Math.round(((productDataClassic?.data?.price - flashCalc) * 100) / productDataClassic?.data?.price)} %`
                                                        :
                                                        isArabic ?
                                                            <div className='flex gap-x-1 items-center'>
                                                                {'وفر '}
                                                                {(productDataClassic?.data?.price - flashCalc).toLocaleString('EN-US')}
                                                                {currencySmallSymbol}
                                                            </div> :
                                                            <div className='flex gap-x-1 items-center'>
                                                                {'Save '}
                                                                {(productDataClassic?.data?.price - flashCalc).toLocaleString('EN-US')}
                                                                {currencySmallSymbol}
                                                            </div>
                                                    }
                                                </div>
                                                : null}
                                        </>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <div className="flex items-center gap-x-2 text-sm">
                                        {isArabic ? 'العلامة' : 'Brand'}:
                                        <Link href={`${origin}/${lang}/brand/${productDataClassic?.data?.brand?.slug}`} aria-label={isArabic ? productDataClassic?.data?.brand?.name_arabic : productDataClassic?.data?.brand?.name} prefetch={false} scroll={false}>
                                            {productDataClassic?.data?.brand?.brand_media_image ?
                                                <Image
                                                    src={productDataClassic?.data?.brand?.brand_media_image ? NewMedia + productDataClassic?.data?.brand?.brand_media_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                                    alt={isArabic ? productDataClassic?.data?.brand?.name_arabic : productDataClassic?.data?.brand?.name}
                                                    title={isArabic ? productDataClassic?.data?.brand?.name_arabic : productDataClassic?.data?.brand?.name}
                                                    height={45}
                                                    width={45}
                                                    style={{ width: 'auto', height: 'auto' }}
                                                    loading='lazy'
                                                />
                                                :
                                                <p>{isArabic ? productDataClassic?.data?.brand?.name_arabic : productDataClassic?.data?.brand?.name}</p>
                                            }
                                        </Link>
                                    </div>
                                    <small className="text-sm font-semibold">{productDataClassic?.data?.sku}</small>
                                    <h1 className="text-base text-dark font-semibold py-1.5 -mt-1.5">{isArabic ? productDataClassic?.data?.name_arabic : productDataClassic?.data?.name}</h1>
                                    <div className="align__center">
                                        <div className='flex items-center gap-x-1.5'>
                                            {productDataClassic?.data?.totalrating > 0 ?
                                                <RatingComponent rating={productDataClassic?.data?.rating} totalRating={productDataClassic?.data?.totalrating} className={''} />
                                                :
                                                null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/5 mx-auto">
                            {productDataClassic?.data?.gallery?.length > 3 ?
                                <button id="scroll-leftPopup" className="ltr:ml-4 rtl:mr-6 pb-2 text-primary rotate-90 hover:text-primary rounded-full outline-none focus-visible:outline-none" onClick={scrollTop}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 5L9 12L15 19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='stroke-primary' />
                                    </svg>
                                </button>
                                : null}
                            <div className="overflow-y-auto h-[17.3rem] no-scrollbar" id="scroll-containerPopup" ref={scrollContainerRef}>
                                <button className={`focus-visible:outline-none rounded-md border shadow-md bg-white w-16 md:w-24 p-1 hover:border-[#219EBC] mb-2 md:mb-3 ${productimage == NewMedia + productDataClassic?.data?.featured_image?.image ? "border-[#219EBC]" : "border-[#219EBC00]"}`} onClick={() => { setProductImage(NewMedia + productDataClassic?.data?.featured_image?.image), setImageScale(1) }}>
                                    <Image
                                        src={productDataClassic?.data?.featured_image ? NewMedia + productDataClassic?.data?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                        alt={isArabic ? productDataClassic?.data?.brand?.name_arabic : productDataClassic?.data?.brand?.name + `featured`}
                                        title={isArabic ? productDataClassic?.data?.brand?.name_arabic : productDataClassic?.data?.brand?.name + `featured`}
                                        height={60}
                                        width={60}
                                        loading='lazy'
                                        className={`mx-auto ${productimage == NewMedia + productDataClassic?.data?.featured_image?.image ? "" : "opacity-70"}`}
                                    />
                                </button>
                                {productDataClassic?.data?.gallery?.map((item: any, i: number) => {
                                    return (
                                        <button
                                            key={i} // key is on the top-level element
                                            className={`focus-visible:outline-none border rounded-md shadow-md bg-white w-16 md:w-24 hover:border-[#219EBC] mb-2 md:mb-3 ${productimage === NewMedia + item?.gallery_image?.image ? "border-[#219EBC]" : "border-[#219EBC00]"
                                                }`}
                                            onClick={() => setProductImage(NewMedia + item?.gallery_image?.image)}
                                        >
                                            <Image
                                                src={
                                                    item?.gallery_image
                                                        ? NewMedia + item?.gallery_image?.image
                                                        : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'
                                                }
                                                alt={
                                                    isArabic
                                                        ? productDataClassic?.data?.brand?.name_arabic
                                                        : productDataClassic?.data?.brand?.name + i + 100
                                                }
                                                title={
                                                    isArabic
                                                        ? productDataClassic?.data?.brand?.name_arabic
                                                        : productDataClassic?.data?.brand?.name + i + 100
                                                }
                                                height={60}
                                                width={60}
                                                loading="lazy"
                                                className={`mx-auto ${productimage === NewMedia + item?.gallery_image?.image ? "" : "opacity-70"}`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                            {productDataClassic?.data?.gallery?.length > 3 ?
                                <button id="scroll-rightPopup" className="ltr:ml-4 rtl:mr-6 -rotate-90 pt-2 rounded-full text-primary hover:text-primary outline-none focus-visible:outline-none" onClick={scrollBottom}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 5L9 12L15 19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='stroke-primary' />
                                    </svg>
                                </button>
                                : null}
                        </div>
                    </div>
                    <div className="w-full mt-3 md:mt-0">
                        <div className="align__center">
                            {/* This is for mobile prices */}
                            <h2 className="text-3xl  font-semibold text-[#DC4E4E] flex items-baseline gap-x-1">
                                <div className='flex items-baseline gap-x-1'>
                                    {/* {data?.promotional_price > 0 ?
                                        <>{getFormattedPrice(Math.round(getDiscountedPrice() - data?.promotional_price)).toLocaleString()}{'  '}{currencySymbol}</>
                                        :
                                        <>{getFormattedPrice(getDiscountedPrice())}{'  '}{currencySymbol}</>
                                    } */}
                                    {getFormattedPrice(getDiscountedPrice())}{'  '}{currencySymbol}
                                </div>
                                {(extraData?.flash || productDataClassic?.data?.sale_price > 0) && (
                                    <span className="text-lg text-[#5D686F] line-through decoration-[#DC4E4E] decoration-2 decoration font-medium">
                                        {getFormattedPrice(getOriginalPrice())}
                                    </span>
                                )}
                                <span className='text-sm text-[#5D686F] font-medium'>{isArabic ? 'شامل الضريبة' : 'Included VAT'}</span>
                            </h2>
                            {productDataClassic?.data?.quantity == 0 || productDataClassic?.data?.quantity == null ?
                                <p className="text-[#DC4E4E] text-sm">{isArabic ? 'المنتج غير متوفر في منطقتك' : 'Out of Stock in your city'}</p>
                                :
                                <p className="text-primary text-xs">{isArabic ? ' متبقي' : ''} <span className="text-[#219EBC] font-bold">{productDataClassic?.data?.quantity ? productDataClassic?.data?.quantity : '0'} {isArabic ? ' قطع' : ''}</span> {isArabic ? ' فقط في المتجر' : 'Quantity left'}</p>
                            }
                        </div>
                        <div>
                            {productDataClassic?.data?.promotional_price > 0 ?
                                <p className="text-[#DC4E4E] text-xs mt-0.5 font-bold animationImp">{isArabic ? productDataClassic?.data?.promo_title_arabic : productDataClassic?.data?.promo_title}</p>
                                :
                                null
                            }
                        </div>
                        <hr className='my-2 opacity-5' />
                        <div className='bg-white my-2 w-full rounded-md'>
                            {productDataClassic?.data?.promotional_price > 0 && productDataClassic?.data?.promotional_price != null && productDataClassic?.data?.sale_price ?
                                <div className='flex items-center gap-4 my-2 rounded-md p-2' style={{ backgroundColor: badgeBackgroundColor }}>
                                    <Image
                                        src={badgeImageLink}
                                        width="65" height="0" alt={badgePromoTitle} title={badgePromoTitle} className='bg-white p-2.5 rounded-md'
                                    />
                                    <div className='text-sm font-normal'>
                                        <h6 className='font-bold' style={{ color: badgeHeadingColor }}>{badgePromoTitle}</h6>
                                        <span className="font-bold flex items-center gap-1" style={{ color: badgePriceColor }}>{productDataClassic?.data?.sale_price}{currencyExtraSmallSymbol}</span>
                                    </div>
                                </div>
                                : null}
                            {/* Commented Pickup Store */}
                            {/* <div className='flex gap-3 justify-start items-center'>
                                <svg id="fi_10112476" height="32" viewBox="0 0 512 512" width="32" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><g fillRule="evenodd"><path d="m310.168 100.287c6.255 0 11.357 5.103 11.357 11.357v261.113h-264.358c-12.456 0-22.62-10.162-22.62-22.62v-238.494c0-6.254 5.102-11.357 11.357-11.357h264.264z" fill="#323e66"></path><path d="m321.525 372.757h-264.358c-12.459 0-22.62-10.162-22.62-22.62v-38.283h286.978v60.904z" fill="#e37500"></path><path d="m483.254 372.757h-161.729v-186.34h97.774c7.146 0 13.298 2.704 18.13 7.97l39.349 42.88c4.331 4.72 6.477 10.231 6.477 16.637v118.854z" fill="#f9ac00"></path><path d="m467.005 372.757h-145.48v-186.34h81.524c7.147 0 13.298 2.704 18.13 7.97l39.349 42.88c4.331 4.72 6.477 10.231 6.477 16.637v118.854z" fill="#fdc72e"></path><path d="m368.851 257.715v-52.102h78.88l29.046 31.653c4.331 4.72 6.477 10.231 6.477 16.637v3.812z" fill="#e9e9ff"></path><path d="m368.851 257.715v-52.102h62.63l29.047 31.653c4.331 4.72 6.477 10.231 6.477 16.637v3.812h-98.153z" fill="#f0f0ff"></path><path d="m483.254 350.966h-448.708v21.79h450.364c8.861 0 16.089-7.227 16.089-16.089v-29.336h-17.745z" fill="#7986bf"></path></g><path d="m34.546 332.788h23.169v18.178h-23.169z" fill="#323e66"></path><path d="m460.89 291.132h22.364v25.908h-22.364z" fill="#323e66"></path><circle cx="396.154" cy="372.757" fill="#323e66" r="38.953"></circle><path d="m396.154 391.897c10.542 0 19.14-8.598 19.14-19.14s-8.598-19.14-19.14-19.14-19.14 8.598-19.14 19.14 8.598 19.14 19.14 19.14z" fill="#fdc72e" fillRule="evenodd"></path><circle cx="118.375" cy="372.757" fill="#323e66" r="38.953" transform="matrix(.987 -.162 .162 .987 -58.875 24.127)"></circle><path d="m118.375 391.897c10.542 0 19.14-8.598 19.14-19.14s-8.598-19.14-19.14-19.14-19.14 8.598-19.14 19.14 8.598 19.14 19.14 19.14z" fill="#fdc72e" fillRule="evenodd"></path><path d="m152.024 235.62h76.233v76.233h-76.233z" fill="#e6b17c"></path><path d="m178.996 235.62h22.289v24.799l-11.145-5.593-11.144 5.593z" fill="#fdc72e" fillRule="evenodd"></path><path d="m152.024 159.387h76.233v76.233h-76.233z" fill="#ba8047"></path><path d="m178.996 159.387h22.289v24.799l-11.145-5.593-11.144 5.593z" fill="#2dd62d" fillRule="evenodd"></path><path d="m228.257 235.62h76.233v76.233h-76.233z" fill="#dea368"></path><path d="m255.228 235.62h22.289v24.799l-11.144-5.593-11.145 5.593z" fill="#fb545c" fillRule="evenodd"></path><path d="m228.257 135.311h76.233v100.309h-76.233z" fill="#fdd7ad"></path><path d="m255.228 135.311h22.289v24.799l-11.144-5.593-11.145 5.593z" fill="#5caeff" fillRule="evenodd"></path><path d="m75.791 235.62h76.233v76.233h-76.233z" fill="#fdd7ad"></path><path d="m102.763 235.62h22.289v24.799l-11.145-5.593-11.144 5.593z" fill="#5caeff" fillRule="evenodd"></path><path d="m321.525 186.416h93.116l-15.238-15.238c-2.093-2.093-4.64-3.148-7.599-3.148h-70.279z" fill="#e37500" fillRule="evenodd"></path><path d="m75.791 235.62h8.362v76.233h-8.362z" fill="#f2c496"></path><path d="m152.024 235.62h8.362v76.233h-8.362z" fill="#dea368"></path><path d="m228.257 235.62h8.362v76.233h-8.362z" fill="#d19458"></path><path d="m228.257 135.311h8.362v100.309h-8.362z" fill="#f2c496"></path><path d="m152.024 159.387h8.362v76.233h-8.362z" fill="#ab733a"></path><path d="m56.692 187.026h-41.059c-2.762 0-5-2.238-5-5s2.238-5 5-5h41.059c2.757 0 5 2.238 5 5s-2.243 5-5 5zm21.777 26.773h-57.117c-2.762 0-5-2.238-5-5s2.238-5 5-5h57.116c2.762 0 5 2.238 5 5s-2.238 5-5 5zm-48.188-67.832h33.202c2.757 0 5 2.238 5 5s-2.243 5-5 5h-33.202c-2.762 0-5-2.238-5-5s2.238-5 5-5zm-19.282-12.843c-2.757 0-5-2.243-5-5s2.243-5 5-5h42.84c2.762 0 5 2.238 5 5s-2.238 5-5 5zm107.371 253.768c-7.791 0-14.139-6.338-14.139-14.139s6.348-14.139 14.139-14.139 14.139 6.348 14.139 14.139-6.338 14.139-14.139 14.139zm0-38.278c-13.31 0-24.139 10.829-24.139 24.139s10.829 24.139 24.139 24.139 24.139-10.829 24.139-24.139-10.829-24.139-24.139-24.139zm277.778 38.278c-7.791 0-14.139-6.338-14.139-14.139s6.348-14.139 14.139-14.139 14.143 6.348 14.143 14.139-6.343 14.139-14.143 14.139zm0-38.278c-13.305 0-24.139 10.829-24.139 24.139s10.834 24.139 24.139 24.139 24.144-10.829 24.144-24.139-10.834-24.139-24.144-24.139zm-37.168-51.288c0-2.762 2.229-5 5-5h21.491c2.757 0 5 2.238 5 5s-2.243 4.995-5 4.995h-21.491c-2.772 0-5-2.224-5-4.995zm137.02 59.336c0 6.124-4.981 11.091-11.091 11.091h-45.097c-.472-4.129-1.51-8.076-3.043-11.786h46.483c2.767 0 5-2.243 5-5v-18.634h7.748zm-99.851 50.054c18.72 0 33.963-15.244 33.963-33.963s-15.244-33.949-33.963-33.949-33.949 15.229-33.949 33.949 15.234 33.963 33.949 33.963zm-277.778 0c18.729 0 33.959-15.244 33.959-33.963s-15.229-33.949-33.959-33.949-33.949 15.229-33.949 33.949 15.229 33.963 33.949 33.963zm-78.817-50.75h38.206c-1.528 3.71-2.576 7.657-3.048 11.786h-35.159v-11.786zm13.167-10h-13.167v-8.181h13.167zm263.801-29.111v29.111h-163.34c-8.039-10.434-20.648-17.163-34.811-17.163s-26.758 6.729-34.801 17.163h-20.849v-13.181c0-2.762-2.238-5-5-5h-18.167v-10.929h276.967zm-235.734-76.236h16.972v19.8c0 1.733.9 3.343 2.381 4.253.8.495 1.71.748 2.619.748.772 0 1.538-.176 2.248-.533l8.9-4.467 8.9 4.467c1.552.776 3.391.7 4.872-.214 1.471-.909 2.372-2.519 2.372-4.253v-19.8h16.967v66.236h-66.231v-66.236zm26.972 0v11.695l3.9-1.957c1.419-.705 3.081-.705 4.491 0l3.9 1.957v-11.695zm49.259-76.232h16.982v19.801c0 1.733.89 3.343 2.367 4.252 1.471.91 3.324.99 4.872.214l8.901-4.467 8.9 4.467c.709.357 1.481.529 2.238.529.924 0 1.833-.248 2.633-.743 1.481-.91 2.367-2.519 2.367-4.252v-19.801h16.981v66.231h-66.241zm26.982 0v11.696l3.9-1.957c1.41-.71 3.067-.71 4.481 0l3.895 1.957v-11.696h-12.277zm66.231-24.077v19.801c0 1.733.896 3.343 2.367 4.252 1.481.91 3.319.99 4.872.214l8.9-4.467 8.896 4.467c.714.357 1.481.533 2.252.533.91 0 1.819-.253 2.619-.748 1.481-.91 2.381-2.519 2.381-4.252v-19.801h16.972v90.308h-66.231v-90.308h16.972zm9.996 0v11.696l3.9-1.957c1.409-.71 3.071-.71 4.491 0l3.9 1.957v-11.696zm0 100.309h12.291v11.695l-3.9-1.957c-1.419-.705-3.081-.705-4.491 0l-3.9 1.957zm-83.861 24.053c1.471.91 3.324.991 4.872.214l8.901-4.467 8.9 4.467c.709.357 1.481.533 2.238.533.924 0 1.833-.252 2.633-.748 1.481-.909 2.367-2.519 2.367-4.253v-19.8h16.981v66.236h-66.241v-66.236h16.982v19.8c0 1.733.89 3.343 2.367 4.253zm7.634-24.053v11.695l3.9-1.957c1.41-.705 3.067-.705 4.481 0l3.895 1.957v-11.695h-12.277zm49.259 66.236h66.231v-66.236h-16.972v19.8c0 1.733-.9 3.343-2.381 4.253-1.467.914-3.319.991-4.872.214l-8.896-4.467-8.9 4.467c-.709.357-1.471.533-2.243.533-.91 0-1.819-.252-2.629-.748-1.471-.909-2.367-2.519-2.367-4.253v-19.8h-16.972v66.236zm158.54-133.825c1.629 0 2.919.533 4.067 1.686l6.7 6.7h-76.046v-8.386zm-232.81 182.936h196.551c-1.543 3.71-2.581 7.657-3.052 11.786h-190.46c-.466-4.129-1.509-8.076-3.038-11.786zm274.75-158.202c-3.862-4.214-8.719-6.348-14.439-6.348h-92.78v154.549h34.83c8.039-10.434 20.648-17.163 34.797-17.163s26.772 6.729 34.811 17.163h47.292v-23.925h-17.363c-2.757 0-5-2.238-5-4.995v-25.911c0-2.762 2.243-5 5-5h17.363v-23.42h-109.4c-2.762 0-5-2.238-5-5v-52.102c0-2.762 2.238-5 5-5h67.508zm44.459 54.95h-104.347v-42.102h71.679l27.558 30.034c3.2 3.486 4.872 7.448 5.11 12.067zm.052 59.331h-12.362v-15.91h12.362zm22.749 10.286h-12.748v-68.427c0-7.653-2.624-14.386-7.791-20.02l-39.354-42.878c-5.748-6.272-13.296-9.591-21.806-9.591h-2.591l-13.772-13.777c-3.019-3.014-6.867-4.61-11.139-4.61h-65.279v-51.388c0-9.019-7.333-16.358-16.353-16.358h-277.019c-2.757 0-5 2.243-5 5s2.243 5 5 5h277.021c3.505 0 6.353 2.852 6.353 6.357v195.213h-7.034v-171.543c0-2.757-2.238-5-5-5h-76.227c-2.762 0-5 2.243-5 5v19.077h-71.241c-2.757 0-5 2.238-5 5v71.231h-71.232c-2.757 0-4.995 2.238-4.995 5v71.236h-31.239v-78.556c0-2.762-2.243-5-5-5-2.772 0-5 2.238-5 5v144.454c0 2.762 2.229 5 5 5h40.159c2.5 21.891 21.12 38.964 43.659 38.964s41.168-17.072 43.659-38.964h190.461c2.49 21.891 21.12 38.964 43.659 38.964s41.173-17.072 43.664-38.964h45.097c11.629 0 21.091-9.457 21.091-21.091v-29.33c0-2.757-2.238-5-5-5z" fillRule="evenodd"></path></svg>
                                <h6 className='font-bold text-sm'>{lang == "ar" ? "احصل عليه بطريقتك!" : "Get it your way!"}</h6>
                            </div> */}
                            {extraData?.expressdeliveryData && expDelivery ?
                                <div className='flex items-center gap-x-4 my-2 bg-[#fde18d] rounded-md p-2 w-full'>
                                    <Image
                                        src={isArabic ? "/icons/express_logo/express_logo_ar.png" : "/icons/express_logo/express_logo_en.png"}
                                        width="65" height="0" alt="express_delivery" title='Express Delivery' className='bg-white p-2.5 rounded-md'
                                    />
                                    <div className='text-sm font-normal'>
                                        <h6 className='font-bold'>{lang == "ar" ? "احصل عليه في غضون 24 الى 48 ساعة" : "Get it in 24 to 48 hours"}</h6>
                                        <p className='text-xs'>
                                            {lang == "ar"
                                                ? <>فقط <span className="text-[#219EBC] font-bold">{expDeliveryQty}</span> حبه متاحه للتوصيل السريع خلال 24 إلى 48 ساعة</>
                                                : <>Only <span className="text-[#219EBC] font-bold">{expDeliveryQty}</span> quantity is available in 24 to 48 hours express delivery</>
                                            }
                                        </p>
                                    </div>
                                </div>
                                :
                                <>
                                    {CheckexpDelivery == false ?
                                        <div className='flex items-center gap-x-4 my-2'>
                                            <svg id="fi_10112476" height="40" viewBox="0 0 512 512" width="40" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><g fillRule="evenodd"><path d="m310.168 100.287c6.255 0 11.357 5.103 11.357 11.357v261.113h-264.358c-12.456 0-22.62-10.162-22.62-22.62v-238.494c0-6.254 5.102-11.357 11.357-11.357h264.264z" fill="#323e66"></path><path d="m321.525 372.757h-264.358c-12.459 0-22.62-10.162-22.62-22.62v-38.283h286.978v60.904z" fill="#e37500"></path><path d="m483.254 372.757h-161.729v-186.34h97.774c7.146 0 13.298 2.704 18.13 7.97l39.349 42.88c4.331 4.72 6.477 10.231 6.477 16.637v118.854z" fill="#f9ac00"></path><path d="m467.005 372.757h-145.48v-186.34h81.524c7.147 0 13.298 2.704 18.13 7.97l39.349 42.88c4.331 4.72 6.477 10.231 6.477 16.637v118.854z" fill="#fdc72e"></path><path d="m368.851 257.715v-52.102h78.88l29.046 31.653c4.331 4.72 6.477 10.231 6.477 16.637v3.812z" fill="#e9e9ff"></path><path d="m368.851 257.715v-52.102h62.63l29.047 31.653c4.331 4.72 6.477 10.231 6.477 16.637v3.812h-98.153z" fill="#f0f0ff"></path><path d="m483.254 350.966h-448.708v21.79h450.364c8.861 0 16.089-7.227 16.089-16.089v-29.336h-17.745z" fill="#7986bf"></path></g><path d="m34.546 332.788h23.169v18.178h-23.169z" fill="#323e66"></path><path d="m460.89 291.132h22.364v25.908h-22.364z" fill="#323e66"></path><circle cx="396.154" cy="372.757" fill="#323e66" r="38.953"></circle><path d="m396.154 391.897c10.542 0 19.14-8.598 19.14-19.14s-8.598-19.14-19.14-19.14-19.14 8.598-19.14 19.14 8.598 19.14 19.14 19.14z" fill="#fdc72e" fillRule="evenodd"></path><circle cx="118.375" cy="372.757" fill="#323e66" r="38.953" transform="matrix(.987 -.162 .162 .987 -58.875 24.127)"></circle><path d="m118.375 391.897c10.542 0 19.14-8.598 19.14-19.14s-8.598-19.14-19.14-19.14-19.14 8.598-19.14 19.14 8.598 19.14 19.14 19.14z" fill="#fdc72e" fillRule="evenodd"></path><path d="m152.024 235.62h76.233v76.233h-76.233z" fill="#e6b17c"></path><path d="m178.996 235.62h22.289v24.799l-11.145-5.593-11.144 5.593z" fill="#fdc72e" fillRule="evenodd"></path><path d="m152.024 159.387h76.233v76.233h-76.233z" fill="#ba8047"></path><path d="m178.996 159.387h22.289v24.799l-11.145-5.593-11.144 5.593z" fill="#2dd62d" fillRule="evenodd"></path><path d="m228.257 235.62h76.233v76.233h-76.233z" fill="#dea368"></path><path d="m255.228 235.62h22.289v24.799l-11.144-5.593-11.145 5.593z" fill="#fb545c" fillRule="evenodd"></path><path d="m228.257 135.311h76.233v100.309h-76.233z" fill="#fdd7ad"></path><path d="m255.228 135.311h22.289v24.799l-11.144-5.593-11.145 5.593z" fill="#5caeff" fillRule="evenodd"></path><path d="m75.791 235.62h76.233v76.233h-76.233z" fill="#fdd7ad"></path><path d="m102.763 235.62h22.289v24.799l-11.145-5.593-11.144 5.593z" fill="#5caeff" fillRule="evenodd"></path><path d="m321.525 186.416h93.116l-15.238-15.238c-2.093-2.093-4.64-3.148-7.599-3.148h-70.279z" fill="#e37500" fillRule="evenodd"></path><path d="m75.791 235.62h8.362v76.233h-8.362z" fill="#f2c496"></path><path d="m152.024 235.62h8.362v76.233h-8.362z" fill="#dea368"></path><path d="m228.257 235.62h8.362v76.233h-8.362z" fill="#d19458"></path><path d="m228.257 135.311h8.362v100.309h-8.362z" fill="#f2c496"></path><path d="m152.024 159.387h8.362v76.233h-8.362z" fill="#ab733a"></path><path d="m56.692 187.026h-41.059c-2.762 0-5-2.238-5-5s2.238-5 5-5h41.059c2.757 0 5 2.238 5 5s-2.243 5-5 5zm21.777 26.773h-57.117c-2.762 0-5-2.238-5-5s2.238-5 5-5h57.116c2.762 0 5 2.238 5 5s-2.238 5-5 5zm-48.188-67.832h33.202c2.757 0 5 2.238 5 5s-2.243 5-5 5h-33.202c-2.762 0-5-2.238-5-5s2.238-5 5-5zm-19.282-12.843c-2.757 0-5-2.243-5-5s2.243-5 5-5h42.84c2.762 0 5 2.238 5 5s-2.238 5-5 5zm107.371 253.768c-7.791 0-14.139-6.338-14.139-14.139s6.348-14.139 14.139-14.139 14.139 6.348 14.139 14.139-6.338 14.139-14.139 14.139zm0-38.278c-13.31 0-24.139 10.829-24.139 24.139s10.829 24.139 24.139 24.139 24.139-10.829 24.139-24.139-10.829-24.139-24.139-24.139zm277.778 38.278c-7.791 0-14.139-6.338-14.139-14.139s6.348-14.139 14.139-14.139 14.143 6.348 14.143 14.139-6.343 14.139-14.143 14.139zm0-38.278c-13.305 0-24.139 10.829-24.139 24.139s10.834 24.139 24.139 24.139 24.144-10.829 24.144-24.139-10.834-24.139-24.144-24.139zm-37.168-51.288c0-2.762 2.229-5 5-5h21.491c2.757 0 5 2.238 5 5s-2.243 4.995-5 4.995h-21.491c-2.772 0-5-2.224-5-4.995zm137.02 59.336c0 6.124-4.981 11.091-11.091 11.091h-45.097c-.472-4.129-1.51-8.076-3.043-11.786h46.483c2.767 0 5-2.243 5-5v-18.634h7.748zm-99.851 50.054c18.72 0 33.963-15.244 33.963-33.963s-15.244-33.949-33.963-33.949-33.949 15.229-33.949 33.949 15.234 33.963 33.949 33.963zm-277.778 0c18.729 0 33.959-15.244 33.959-33.963s-15.229-33.949-33.959-33.949-33.949 15.229-33.949 33.949 15.229 33.963 33.949 33.963zm-78.817-50.75h38.206c-1.528 3.71-2.576 7.657-3.048 11.786h-35.159v-11.786zm13.167-10h-13.167v-8.181h13.167zm263.801-29.111v29.111h-163.34c-8.039-10.434-20.648-17.163-34.811-17.163s-26.758 6.729-34.801 17.163h-20.849v-13.181c0-2.762-2.238-5-5-5h-18.167v-10.929h276.967zm-235.734-76.236h16.972v19.8c0 1.733.9 3.343 2.381 4.253.8.495 1.71.748 2.619.748.772 0 1.538-.176 2.248-.533l8.9-4.467 8.9 4.467c1.552.776 3.391.7 4.872-.214 1.471-.909 2.372-2.519 2.372-4.253v-19.8h16.967v66.236h-66.231v-66.236zm26.972 0v11.695l3.9-1.957c1.419-.705 3.081-.705 4.491 0l3.9 1.957v-11.695zm49.259-76.232h16.982v19.801c0 1.733.89 3.343 2.367 4.252 1.471.91 3.324.99 4.872.214l8.901-4.467 8.9 4.467c.709.357 1.481.529 2.238.529.924 0 1.833-.248 2.633-.743 1.481-.91 2.367-2.519 2.367-4.252v-19.801h16.981v66.231h-66.241zm26.982 0v11.696l3.9-1.957c1.41-.71 3.067-.71 4.481 0l3.895 1.957v-11.696h-12.277zm66.231-24.077v19.801c0 1.733.896 3.343 2.367 4.252 1.481.91 3.319.99 4.872.214l8.9-4.467 8.896 4.467c.714.357 1.481.533 2.252.533.91 0 1.819-.253 2.619-.748 1.481-.91 2.381-2.519 2.381-4.252v-19.801h16.972v90.308h-66.231v-90.308h16.972zm9.996 0v11.696l3.9-1.957c1.409-.71 3.071-.71 4.491 0l3.9 1.957v-11.696zm0 100.309h12.291v11.695l-3.9-1.957c-1.419-.705-3.081-.705-4.491 0l-3.9 1.957zm-83.861 24.053c1.471.91 3.324.991 4.872.214l8.901-4.467 8.9 4.467c.709.357 1.481.533 2.238.533.924 0 1.833-.252 2.633-.748 1.481-.909 2.367-2.519 2.367-4.253v-19.8h16.981v66.236h-66.241v-66.236h16.982v19.8c0 1.733.89 3.343 2.367 4.253zm7.634-24.053v11.695l3.9-1.957c1.41-.705 3.067-.705 4.481 0l3.895 1.957v-11.695h-12.277zm49.259 66.236h66.231v-66.236h-16.972v19.8c0 1.733-.9 3.343-2.381 4.253-1.467.914-3.319.991-4.872.214l-8.896-4.467-8.9 4.467c-.709.357-1.471.533-2.243.533-.91 0-1.819-.252-2.629-.748-1.471-.909-2.367-2.519-2.367-4.253v-19.8h-16.972v66.236zm158.54-133.825c1.629 0 2.919.533 4.067 1.686l6.7 6.7h-76.046v-8.386zm-232.81 182.936h196.551c-1.543 3.71-2.581 7.657-3.052 11.786h-190.46c-.466-4.129-1.509-8.076-3.038-11.786zm274.75-158.202c-3.862-4.214-8.719-6.348-14.439-6.348h-92.78v154.549h34.83c8.039-10.434 20.648-17.163 34.797-17.163s26.772 6.729 34.811 17.163h47.292v-23.925h-17.363c-2.757 0-5-2.238-5-4.995v-25.911c0-2.762 2.243-5 5-5h17.363v-23.42h-109.4c-2.762 0-5-2.238-5-5v-52.102c0-2.762 2.238-5 5-5h67.508zm44.459 54.95h-104.347v-42.102h71.679l27.558 30.034c3.2 3.486 4.872 7.448 5.11 12.067zm.052 59.331h-12.362v-15.91h12.362zm22.749 10.286h-12.748v-68.427c0-7.653-2.624-14.386-7.791-20.02l-39.354-42.878c-5.748-6.272-13.296-9.591-21.806-9.591h-2.591l-13.772-13.777c-3.019-3.014-6.867-4.61-11.139-4.61h-65.279v-51.388c0-9.019-7.333-16.358-16.353-16.358h-277.019c-2.757 0-5 2.243-5 5s2.243 5 5 5h277.021c3.505 0 6.353 2.852 6.353 6.357v195.213h-7.034v-171.543c0-2.757-2.238-5-5-5h-76.227c-2.762 0-5 2.243-5 5v19.077h-71.241c-2.757 0-5 2.238-5 5v71.231h-71.232c-2.757 0-4.995 2.238-4.995 5v71.236h-31.239v-78.556c0-2.762-2.243-5-5-5-2.772 0-5 2.238-5 5v144.454c0 2.762 2.229 5 5 5h40.159c2.5 21.891 21.12 38.964 43.659 38.964s41.168-17.072 43.659-38.964h190.461c2.49 21.891 21.12 38.964 43.659 38.964s41.173-17.072 43.664-38.964h45.097c11.629 0 21.091-9.457 21.091-21.091v-29.33c0-2.757-2.238-5-5-5z" fillRule="evenodd"></path></svg>
                                            <div className='text-xs font-normal'>
                                                <h6 className='font-semibold text-sm'>{lang == "ar" ? "ومن المتوقع أن يتم التسليم في " : "Delivery is expected to take place on " + dayjs().add(1, 'days').format('DD MMM')} to {dayjs().add(5, 'days').format('DD MMM')}</h6>
                                                <p>{lang == "ar" ? `اطلب خلال ساعة و4 دقائق` : `Order in 1 h 4 m`}</p>
                                            </div>
                                        </div>
                                        : null}
                                </>
                            }
                            {eligiblePickup && (globalStore?.name_arabic || globalStore?.name) ?
                                <button onClick={() => { setIsOpenModal(true) }} className='bg-primary text-white rounded-md p-2 text-sm w-full ltr:text-left rtl:text-right'>
                                    <div className='flex gap-2 md:gap-3 md:justify-between item-start md:items-center'>
                                        <Image src={iconPickupMan} alt="ExpressIcon" title="Express Icon" width="65" height="0" className='inline-block h-auto rounded-md' />
                                        <div className='flex flex-col justify-center items-start gap-2'>
                                            <div className='flex gap-4 items-center'>
                                                <div className='flex gap-2 items-center'>
                                                    <Image src={iconLocationPin} alt="ExpressIcon" title="Express Icon" width="16" height="16" className='inline-block h-auto' />
                                                    <span className='text-xs md:text-sm font-bold'>{pickupStoreContent}: <span className='text-[#fde18d]'>{showroomName}</span></span>
                                                </div>
                                            </div>
                                            <div className='lex gap-2 items-center md:-mt-1 md:mb-0'>
                                                <Image src={iconPickupTime} alt="ExpressIcon" title="Express Icon" width="18" height="18" className='inline-block h-auto' />
                                                <span className='text-[0.65rem] md:text-xs'>{pickupStoreTimeText}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className='bg-[#fde18d] px-2 py-1 mt-3 text-primary text-[0.60rem] rounded-md font-semibold animate-pulse float-end'>{stockText}</span>
                                </button>
                            : null}
                        </div>
                        <div className="w-full mt-3">
                            {productDataClassic?.data?.short_description ?
                                <>
                                    <Image
                                        src={productDataClassic?.data?.short_description}
                                        alt={isArabic ? productDataClassic?.data?.name_arabic : productDataClassic?.data?.name}
                                        title={isArabic ? productDataClassic?.data?.name_arabic : productDataClassic?.data?.name}
                                        height={0}
                                        width={0}
                                        loading='lazy'
                                        className="rounded-md w-full h-auto m-auto"
                                        sizes='(max-width: 640px) 150px, (max-width: 768px) 150px, (max-width: 1024px) 150px, 100vw'
                                    />
                                </>
                                :
                                null
                            }
                            {/* {extraData?.badgeData ?
                                <Image
                                    src={extraData?.badgeData?.badge_slider ? NewMedia + extraData?.badgeData?.badge_slider?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                    alt={extraData?.badgeData?.badge_slider ? isArabic ? extraData?.badgeData?.badge_slider?.alt_arabic : extraData?.badgeData?.badge_slider?.alt : ''}
                                    title={extraData?.badgeData?.badge_slider ? isArabic ? extraData?.badgeData?.badge_slider?.alt_arabic : extraData?.badgeData?.badge_slider?.title : ''}
                                    height={0}
                                    width={0}
                                    loading='lazy'
                                    className="rounded-md h-auto w-full shadow-md mt-2.5"
                                    sizes='(max-width: 640px) 150px, (max-width: 768px) 150px, (max-width: 1024px) 150px, 100vw'
                                />
                                : null} */}
                        </div>
                        <div className="align__center gap-2 mt-3">
                            <div className="px-2 pt-2 bg-[#C3E6F170] rounded-md w-1/2 h-32">
                                <h4 className="sm:text-sm text-xs text-center w-full flex flex-col items-center justify-center">
                                    <span className="flex items-center gap-x-1 whitespace-nowrap">
                                        {isArabic ? ' أو قسمها إلى' : 'Or divide it into'}
                                        <span className="font-bold">4</span>
                                        {isArabic ? ' دفعات' : ' Payments'}
                                    </span>
                                    <span className="flex items-center gap-x-1 whitespace-nowrap">
                                        {isArabic ? ' بمبلغ' : ' In the amount of '}
                                        <span className="font-bold text-[#B15533] flex items-center gap-0.5">
                                            {getFormattedPrice(getDiscountedPrice() / 4)}{' '}{currencySmallSymbol}
                                        </span>
                                    </span>
                                    {isArabic ? 'بدون فوائد' : 'without interest'}.
                                    {/* <span className="text-[#5D686F] font-bold whitespace-nowrap"></span> */}
                                </h4>
                                <div className="flex items-center gap-2 justify-center mt-4">
                                    <Link prefetch={false} scroll={false} href={`${origin}/${lang}/installment-service-methods`} aria-label="Tabby">
                                        <Image
                                            src={`/images/pro_tabby.webp`}
                                            alt='tabby'
                                            title='Tabby'
                                            height={80}
                                            width={80}
                                            className="w-[40px] h-full"
                                        />
                                    </Link>
                                    <Link prefetch={false} scroll={false} href={`${origin}/${lang}/installment-service-methods`} aria-label="Tamara">
                                        <Image
                                            src="/images/pro_tamara.webp"
                                            alt='tamara'
                                            title='Tamara'
                                            height={80}
                                            width={80}
                                            className="w-[40px] h-full"
                                        />
                                    </Link>
                                    <Link prefetch={false} scroll={false} href={`${origin}/${lang}/installment-service-methods`} aria-label="misspay">
                                        <Image
                                            src={'/images/misspay.webp'}
                                            alt='misspay'
                                            title='Mis Pay'
                                            height={80}
                                            width={80}
                                            className="w-[40px] h-full"
                                        />
                                    </Link>
                                </div>
                            </div>
                            <div className="px-2 pt-2 bg-[#C3E6F170] rounded-md w-1/2 h-32 relative">
                                <h4 className="sm:text-sm text-xs font-medium text-center w-full flex flex-col items-center justify-center">
                                    <span className="text-[#B15533] font-bold flex items-center gap-x-1">
                                        {extraData?.flash && productDataClassic?.data?.sale_price ?
                                            extraData?.flash?.discount_type === 2 ?
                                                ((((Math.round((productDataClassic?.data?.sale_price * extraData?.flash?.discount_amount / 100)) * 72) / 100) + Math.round((productDataClassic?.data?.sale_price * extraData?.flash?.discount_amount / 100))) / 36).toFixed(2)
                                                :
                                                ((((extraData?.flash?.discount_amount * 72) / 100) + extraData?.flash?.discount_amount) / 36).toFixed(2)
                                            :
                                            productDataClassic?.data?.sale_price ?
                                                ((((productDataClassic?.data?.sale_price * 72) / 100) + productDataClassic?.data?.sale_price) / 36).toFixed(2) :
                                                extraData?.flash && productDataClassic?.data?.price && !productDataClassic?.data?.sale_price ?
                                                    extraData?.flash?.discount_type === 2 ? (Math.round((productDataClassic?.data?.price * extraData?.flash?.discount_amount / 100)) / 36).toLocaleString('EN-US') :
                                                        extraData?.flash?.discount_amount / 36 :
                                                    ((((productDataClassic?.data?.price * 72) / 100) + productDataClassic?.data?.price) / 36).toFixed(2)
                                        }
                                        {currencySmallSymbol}
                                        <span className='!text-[#000]'>{isArabic ? ' شهريا' : ' Monthly'}</span>
                                    </span>
                                    <span className="text-[#5D686F] font-bold">{isArabic ? '36 شهر' : '36 months'}{' '}</span>
                                </h4>
                                <div>
                                    
                                </div>
                                <Link prefetch={false} scroll={false} href={`${origin}/${lang}/installment-service-methods`} aria-label="baseeta" className="flex justify-center mt-6">
                                    <Image
                                        src="/images/pro_baseeta.webp"
                                        alt='baseeta'
                                        title='Baseeta Logo'
                                        height={55}
                                        width={85}
                                        loading='lazy'
                                        className='w-[40px] h-[30px]'
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="align__center mt-5 text-sm">
                            {PriceAlertProduct ?
                                <button onClick={(e: any) => { handlePriceAlert() }} className="focus-visible:outline-none flex items-center gap-x-2 text-[#DC4E4E] fill-[#DC4E4E] text-xs">
                                    <svg id="fi_9684650" enableBackground="new 0 0 512 512" height="14" viewBox="0 0 512 512" width="14" xmlns="http://www.w3.org/2000/svg"><g id="Layer_2_00000019666308414107203810000016359489542308255153_"><g id="croos"><path d="m325.6 256 172-172c19.3-19.2 19.3-50.3.2-69.6-19.2-19.3-50.3-19.3-69.6-.2 0 0-.1.1-.1.1l-172 172-172.1-171.9c-19.2-19.2-50.4-19.2-69.6 0s-19.2 50.4 0 69.6l172 172-172 172c-19.2 19.2-19.2 50.4 0 69.6s50.4 19.2 69.6 0l172-172 172 172c19.2 19.2 50.4 19.2 69.6 0s19.2-50.4 0-69.6z"></path></g></g></svg>
                                    <p>{isArabic ? 'تم اعداد اشعار السعر المنخفض' : 'Remove from Price Alert'}</p>
                                </button>
                                :
                                <button onClick={(e: any) => { handlePriceAlert() }} className="focus-visible:outline-none flex items-center gap-x-2 text-xs">
                                    <svg height="20" viewBox="-21 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg" id="fi_1827422"><path d="m453.332031 229.332031c-8.832031 0-16-7.167969-16-16 0-61.269531-23.847656-118.847656-67.15625-162.175781-6.25-6.25-6.25-16.382812 0-22.632812s16.382813-6.25 22.636719 0c49.34375 49.363281 76.519531 115.007812 76.519531 184.808593 0 8.832031-7.167969 16-16 16zm0 0"></path><path d="m16 229.332031c-8.832031 0-16-7.167969-16-16 0-69.800781 27.179688-135.445312 76.542969-184.789062 6.25-6.25 16.386719-6.25 22.636719 0s6.25 16.386719 0 22.636719c-43.328126 43.304687-67.179688 100.882812-67.179688 162.152343 0 8.832031-7.167969 16-16 16zm0 0"></path><path d="m234.667969 512c-44.117188 0-80-35.882812-80-80 0-8.832031 7.167969-16 16-16s16 7.167969 16 16c0 26.476562 21.523437 48 48 48 26.472656 0 48-21.523438 48-48 0-8.832031 7.167969-16 16-16s16 7.167969 16 16c0 44.117188-35.882813 80-80 80zm0 0"></path><path d="m410.667969 448h-352c-20.589844 0-37.335938-16.746094-37.335938-37.332031 0-10.925781 4.757813-21.269531 13.058594-28.375 32.445313-27.414063 50.941406-67.261719 50.941406-109.480469v-59.480469c0-82.34375 66.988281-149.332031 149.335938-149.332031 82.34375 0 149.332031 66.988281 149.332031 149.332031v59.480469c0 42.21875 18.496094 82.066406 50.730469 109.332031 8.511719 7.253907 13.269531 17.597657 13.269531 28.523438 0 20.585937-16.746094 37.332031-37.332031 37.332031zm-176-352c-64.707031 0-117.335938 52.628906-117.335938 117.332031v59.480469c0 51.644531-22.632812 100.414062-62.078125 133.757812-.746094.640626-1.921875 1.964844-1.921875 4.097657 0 2.898437 2.433594 5.332031 5.335938 5.332031h352c2.898437 0 5.332031-2.433594 5.332031-5.332031 0-2.132813-1.171875-3.457031-1.878906-4.054688-39.488282-33.386719-62.121094-82.15625-62.121094-133.800781v-59.480469c0-64.703125-52.628906-117.332031-117.332031-117.332031zm0 0"></path><path d="m234.667969 96c-8.832031 0-16-7.167969-16-16v-64c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v64c0 8.832031-7.167969 16-16 16zm0 0"></path></svg>
                                    <p>{isArabic ? 'ابلغني عن انخفاض السعر' : 'Setup Low Price Notification'}</p>
                                </button>
                            }
                            <Link className='focus-visible:outline-none flex items-center gap-x-2 text-xs' href={`${origin}/${lang}/returnexchange`} aria-label="repalcement and retrieval policy">
                                <svg height="20" viewBox="0 0 60 57" width="20" xmlns="http://www.w3.org/2000/svg" id="fi_3639103"><g id="Page-1" fill="none" fillRule="evenodd"><g id="012---Stacked-Boxes" fill="rgb(0,0,0)" fillRule="nonzero"><path id="Shape" d="m57 24h-9.786c.5015341-.5457648.7817569-1.2587999.786-2v-19c0-1.65685425-1.3431458-3-3-3h-19c-.7639211.00024057-1.4986774.29335573-2.053.819l-9.212 6.47c-1.0551795.4906837-1.7314083 1.54731563-1.735 2.711v14c-.7639211.0002406-1.4986774.2933557-2.053.819l-9.212 6.47c-1.05517947.4906837-1.73140831 1.5473156-1.735 2.711v20c0 1.6568542 1.34314575 3 3 3h21c.740399-.0026037 1.4533329-.2806479 2-.78.5466671.4993521 1.259601.7773963 2 .78h21c.8113742-.0004402 1.5876103-.3311529 2.15-.916l7.958-7.958c.570437-.5603504.8918383-1.3263808.892-2.126v-19c-.0082058-1.6534434-1.3465566-2.9917942-3-3zm-6.666 7.327c-.4129299-.2119451-.8698636-.3239521-1.334-.327h-8.766l5-5h11.188zm-26.334-.327h-8c-.5522847 0-1-.4477153-1-1v-20c0-.55228475.4477153-1 1-1h21c.5522847 0 1 .44771525 1 1v20c.0008743.2617573-.1015372.5132943-.285.7l-.02.02c-.1862728.1804188-.4356784.2808987-.695.28zm15.727-22.234 6.273-5.489v18.723c-.0014251.2642598-.1096223.5167198-.3.7l-5.7 5.709v-18.409c-.0011951-.42617997-.0943131-.84708685-.273-1.234zm-1.393-1.439c-.4129299-.21194509-.8698636-.32395209-1.334-.327h-7.085l6.428-5h8.079zm-13.169-4.919c.0506099-.03555351.0978121-.07572565.141-.12.183311-.18524278.4333915-.28902259.694-.288l7.085-.00000749-6.428 5.00000749h-8.03zm-13 24c.0506099-.0355535.0978121-.0757257.141-.12.183311-.1852428.4333915-.2890226.694-.288v4c.0033144.3414397.0655622.679743.184 1h-7.557zm-9.165 28.592c-.55228475 0-1-.4477153-1-1v-20c0-.5522847.44771525-1 1-1h21c.5522847 0 1 .4477153 1 1v20c-.0000381.2617729-.1027208.5130941-.286.7l-.018.017c-.1859805.1818493-.4358891.2834644-.696.283zm25 0c-.5522847 0-1-.4477153-1-1v-20c0-.5522847.4477153-1 1-1h21c.5522847 0 1 .4477153 1 1v20c-.0017673.255461-.1012377.5005589-.278.685l-.022.015-.014.016c-.1837482.1791927-.4293608.2808749-.686.284zm29.7-8.3-5.7 5.7v-18.4c-.0011951-.42618-.0943131-.8470868-.273-1.234l6.273-5.489v18.723c-.0014251.2642598-.1096223.5167198-.3.7z"></path><path id="Shape" d="m23 23h-4c-1.1045695 0-2 .8954305-2 2v2c0 1.1045695.8954305 2 2 2h4c1.1045695 0 2-.8954305 2-2v-2c0-1.1045695-.8954305-2-2-2zm-4 4v-2h4v2z"></path><path id="Shape" d="m35 23h-3c-.5522847 0-1 .4477153-1 1s.4477153 1 1 1h3c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1z"></path><path id="Shape" d="m35 27h-3c-.5522847 0-1 .4477153-1 1s.4477153 1 1 1h3c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1z"></path><path id="Shape" d="m10 47h-4c-1.1045695 0-2 .8954305-2 2v2c0 1.1045695.8954305 2 2 2h4c1.1045695 0 2-.8954305 2-2v-2c0-1.1045695-.8954305-2-2-2zm-4 4v-2h4v2z"></path><path id="Shape" d="m22 47h-3c-.5522847 0-1 .4477153-1 1s.4477153 1 1 1h3c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1z"></path><path id="Shape" d="m22 51h-3c-.5522847 0-1 .4477153-1 1s.4477153 1 1 1h3c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1z"></path><path id="Shape" d="m35 47h-4c-1.1045695 0-2 .8954305-2 2v2c0 1.1045695.8954305 2 2 2h4c1.1045695 0 2-.8954305 2-2v-2c0-1.1045695-.8954305-2-2-2zm-4 4v-2h4v2z"></path><path id="Shape" d="m47 47h-3c-.5522847 0-1 .4477153-1 1s.4477153 1 1 1h3c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1z"></path><path id="Shape" d="m47 51h-3c-.5522847 0-1 .4477153-1 1s.4477153 1 1 1h3c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1z"></path></g></g></svg>
                                <p>{isArabic ? 'لديك 14 يوم الي الاسترجاع' : '14 Days Return Policy'}</p>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="md:grid md:grid-cols-3 md:gap-x-4 py-2">
                    <div className="w-full">
                        {extraData?.fbtdata?.fbtlist?.map((fbtpro: any, i: number) => {
                            var fbtprice = fbtpro?.productdetail?.sale_price ? fbtpro?.productdetail?.sale_price : fbtpro?.productdetail?.price;
                            if (extraData?.fbtdata?.discount_type == 1) {
                                fbtprice -= (fbtpro?.discount * fbtprice) / 100;
                            } else {
                                // amount type
                                if (extraData?.fbtdata?.amount_type == 1) {
                                    fbtprice = fbtprice - fbtpro?.discount;
                                }
                                else {
                                    fbtprice = fbtpro?.discount;
                                }
                            }
                            return (
                                <div className="bg-white shadow-md rounded-md p-3 flex items-center gap-x-2 h-32" key={i}
                                    onClick={() => {
                                        var newfbtdata = fbtProCheck
                                        if (newfbtdata[fbtpro?.id]) {
                                            delete newfbtdata[fbtpro?.id]
                                            setfbtProId(null)
                                        }
                                        else {
                                            newfbtdata[fbtpro?.id] = true
                                            setfbtProId(fbtpro?.id)
                                        }
                                        setfbtProCheck({ ...newfbtdata })
                                    }}
                                >
                                    {fbtProCheck[fbtpro?.id] ?
                                        <CheckIconFBTActive className="h-10 w-10" />
                                        :
                                        <CheckIconFBT className="h-10 w-10" />
                                    }
                                    <Image
                                        src={fbtpro?.productdetail?.featured_image ? NewMedia + fbtpro?.productdetail?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                        alt={fbtpro?.productdetail?.featured_image ? isArabic ? fbtpro?.productdetail?.featured_image?.alt_arabic : fbtpro?.productdetail?.featured_image?.alt : ''}
                                        title={fbtpro?.productdetail?.featured_image ? isArabic ? fbtpro?.productdetail?.featured_image?.alt_arabic : fbtpro?.productdetail?.featured_image?.title : ''}
                                        height={100}
                                        width={100}
                                        loading='lazy'
                                    />
                                    <div className="w-full">
                                        {/* <p className="text-[#1C262D] text-xs font-regular">{isArabic? `احصل علي مـنتجك الاخر بـ ${fbtprice} ريال فقط` : `Add another this product with ${fbtprice} SR`}</p> */}
                                        <h4 className="text-[#004B7A] text-xs mt-1 line-clamp-2">{isArabic ? fbtpro?.productdetail?.name_arabic : fbtpro?.productdetail?.name}</h4>
                                        <div className="align__center mt-3">
                                            <h6 className=" font-semibold text-[#DC4E4E] text-base">{fbtprice} {isArabic ? 'ر.س' : 'SR'}</h6>
                                            {/* <button className="focus-visible:outline-none flex items-center justify-center gap-x-2 py-2.5 px-4 bg-[#B15533] text-white fill-white rounded-md text-xs" onClick={() => addfbt(fbtpro.id)}>
												<svg id="fi_3144456" enableBackground="new 0 0 511.728 511.728" height="20" viewBox="0 0 511.728 511.728" width="20" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF">
													<path d="m147.925 379.116c-22.357-1.142-21.936-32.588-.001-33.68 62.135.216 226.021.058 290.132.103 17.535 0 32.537-11.933 36.481-29.017l36.404-157.641c2.085-9.026-.019-18.368-5.771-25.629s-14.363-11.484-23.626-11.484c-25.791 0-244.716-.991-356.849-1.438l-17.775-65.953c-4.267-15.761-18.65-26.768-34.978-26.768h-56.942c-8.284 0-15 6.716-15 15s6.716 15 15 15h56.942c2.811 0 5.286 1.895 6.017 4.592l68.265 253.276c-12.003.436-23.183 5.318-31.661 13.92-8.908 9.04-13.692 21.006-13.471 33.695.442 25.377 21.451 46.023 46.833 46.023h21.872c-3.251 6.824-5.076 14.453-5.076 22.501 0 28.95 23.552 52.502 52.502 52.502s52.502-23.552 52.502-52.502c0-8.049-1.826-15.677-5.077-22.501h94.716c-3.248 6.822-5.073 14.447-5.073 22.493 0 28.95 23.553 52.502 52.502 52.502 28.95 0 52.503-23.553 52.503-52.502 0-8.359-1.974-16.263-5.464-23.285 5.936-1.999 10.216-7.598 10.216-14.207 0-8.284-6.716-15-15-15zm91.799 52.501c0 12.408-10.094 22.502-22.502 22.502s-22.502-10.094-22.502-22.502c0-12.401 10.084-22.491 22.483-22.501h.038c12.399.01 22.483 10.1 22.483 22.501zm167.07 22.494c-12.407 0-22.502-10.095-22.502-22.502 0-12.285 9.898-22.296 22.137-22.493h.731c12.24.197 22.138 10.208 22.138 22.493-.001 12.407-10.096 22.502-22.504 22.502zm74.86-302.233c.089.112.076.165.057.251l-15.339 66.425h-51.942l8.845-67.023 58.149.234c.089.002.142.002.23.113zm-154.645 163.66v-66.984h53.202l-8.84 66.984zm-74.382 0-8.912-66.984h53.294v66.984zm-69.053 0h-.047c-3.656-.001-6.877-2.467-7.828-5.98l-16.442-61.004h54.193l8.912 66.984zm56.149-96.983-9.021-67.799 66.306.267v67.532zm87.286 0v-67.411l66.022.266-8.861 67.145zm-126.588-67.922 9.037 67.921h-58.287l-18.38-68.194zm237.635 164.905h-36.426l8.84-66.984h48.973l-14.137 61.217c-.784 3.396-3.765 5.767-7.25 5.767z"></path>
												</svg>
												{isArabic? 'اضافة المنتجين' : 'Add Product'}
											</button> */}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>
                    <div className="w-full">
                        {extraData?.freegiftdata?.freegiftlist?.slice(0, 1).map((freegiftdatapro: any, i: number) => {
                            return (
                                <button key={freegiftdatapro?.id ?? i} onClick={openModal} className="focus-visible:outline-none bg-[#EEF8FC] shadow-md rounded-md p-3 w-full h-auto max-md:my-3">
                                    <p className="text-[#004B7A] fill-[#004B7A] text-sm font-bold flex items-center gap-x-1.5 mb-3">
                                        <svg id="fi_3850991" enableBackground="new 0 0 512 512" height="16" viewBox="0 0 512 512" width="16" fill="#219EBC" xmlns="http://www.w3.org/2000/svg"><g><path d="m359.42 20.97c13.36-8.94 29.92-6.83 38.21.38 3.59 3.13 7.1 8.46 3.4 16.1-7.77 16.12-24.32 26.53-42.14 26.53h-51.02c2.4 6.2 3.73 12.93 3.73 19.97 0 6.27-1.06 12.3-2.98 17.93h119.99c8-15.2 8.58-32.65 1.45-48.64l-14.62-32.82c-1.71-3.8-4.33-7.34-7.89-10.44-12.42-10.78-36.42-14.98-56.52-1.54l-55.1 36.89c3.5 3.62 6.52 7.7 8.94 12.15z"></path><path d="m203.4 101.87c-1.92-5.63-2.98-11.66-2.98-17.93 0-7.04 1.33-13.77 3.73-19.97h-50.99c-17.82 0-34.37-10.42-42.18-26.54-3.7-7.63-.19-12.96 3.41-16.08 4.46-3.88 11.31-6.28 18.77-6.28 6.41 0 13.26 1.77 19.43 5.9l54.54 36.51c2.42-4.46 5.45-8.54 8.94-12.15l-55.1-36.89c-20.1-13.44-44.1-9.24-56.49 1.54-3.97 3.45-6.79 7.44-8.45 11.74l-14.07 31.51c-7.14 15.99-6.56 33.44 1.45 48.64z"></path><path d="m219.67 101.87h72.65c2.68-5.41 4.2-11.5 4.2-17.93 0-22.33-18.2-40.53-40.53-40.53s-40.53 18.2-40.53 40.53c.01 6.44 1.53 12.52 4.21 17.93z"></path><path d="m16.2 148.65v49.55c0 14.89 10.32 27.41 24.17 30.8h187.69v-112.07h-180.15c-17.48 0-31.71 14.23-31.71 31.72z"></path><path d="m40.38 469.91c0 23.21 18.88 42.09 42.09 42.09h145.6v-267.95h-187.69z"></path><path d="m464.09 116.93h-180.13v112.06h187.66c13.86-3.39 24.17-15.91 24.17-30.8v-49.55c.01-17.48-14.22-31.71-31.7-31.71z"></path><path d="m283.96 512h145.57c23.21 0 42.09-18.88 42.09-42.09v-225.86h-187.66z"></path></g></svg>
                                        {extraData?.freegiftdata?.freegiftlist.length === extraData?.freegiftdata?.allowed_gifts ?
                                            <>{isArabic ? `(${extraData?.freegiftdata?.allowed_gifts})  هدية مجانية` : `(${extraData?.freegiftdata?.allowed_gifts}) Free Gift`}</>
                                            :
                                            extraData?.freegiftdata?.discount_type === 1 ?
                                                <>{isArabic ? `هديا (${extraData?.freegiftdata?.allowed_gifts}) اختر هديتك المجانية` : `Choose (${extraData?.freegiftdata?.allowed_gifts}) Free Gift`}</>
                                                :
                                                <>{isArabic ? `اختر منتج واحد بـ 11 ر.س` : `Choose (${extraData?.freegiftdata?.allowed_gifts}) Product in 11 SR`}</>
                                        }
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4">
                                        {/* <div className="overflow-x-auto flex gap-4 mx-4 no-scrollbar" id="scroll-container"> */}
                                        {extraData?.freegiftdata?.freegiftlist?.map((freegiftdatapro: any, i: number) => {
                                            if (extraData?.freegiftdata?.discount_type == 2) {
                                                var fgprice = freegiftdatapro?.productdetail?.sale_price ? freegiftdatapro?.productdetail?.sale_price : freegiftdatapro?.productdetail?.price;
                                                fgprice -= (freegiftdatapro?.discount * fgprice) / 100;
                                            }
                                            return (
                                                <div key={freegiftdatapro?.id ?? i} className={`rounded-md bg-white ${selectedGifts[freegiftdatapro.id] ? " border" : ""}`}>
                                                    {/* <div className="overflow-x-auto flex gap-4 mx-4 no-scrollbar" id="scroll-container"> */}
                                                    <Image
                                                        src={freegiftdatapro?.productdetail?.featured_image ? NewMedia + freegiftdatapro?.productdetail?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                                        alt={freegiftdatapro?.productdetail ? (isArabic ? freegiftdatapro?.productdetail?.name_arabic : freegiftdatapro?.productdetail?.name) : ''}
                                                        title={freegiftdatapro?.productdetail ? (isArabic ? freegiftdatapro?.productdetail?.name_arabic : freegiftdatapro?.productdetail?.name) : ''}
                                                        height={80}
                                                        width={80}
                                                        loading='lazy'
                                                        className='rounded-md'
                                                    />
                                                    {extraData?.freegiftdata?.discount_type === 1 ?
                                                        <p className={`text-[#004B7A] text-xs font-bold mb-2 -mt-2 flex gap-x-1 items-center justify-center ${selectedGifts[freegiftdatapro.id] ? 'text-secondary' : ''}`}>
                                                            {freegiftdatapro?.productdetail?.sale_price ? freegiftdatapro?.productdetail?.sale_price : freegiftdatapro?.productdetail?.price}{' '}{currencySmallSymbol}
                                                        </p>
                                                        :
                                                        <p className={`text-[#004B7A] text-xs font-bold mb-2 -mt-2 flex gap-x-1 items-center justify-center ${selectedGifts[freegiftdatapro.id] ? 'text-secondary' : ''}`}>
                                                            {/* {isArabic? ' ر.س' : ' SR'}
															{' '}
															{freegiftdatapro?.productdetail?.sale_price ? freegiftdatapro?.productdetail?.sale_price : freegiftdatapro?.productdetail?.price} */}
                                                            {freegiftdatapro?.discount != 0 ?
                                                                // (freegiftdatapro?.discount + ' ' + (isArabic ? ' ر.س' : ' SR')) : lang ? 'حر' : 'Free'}
                                                                (currencySmallSymbol + ' ' + freegiftdatapro?.discount) : lang ? 'حر' : 'Free'}
                                                        </p>

                                                    }

                                                </div>
                                            )
                                        })
                                        }
                                    </div>
                                </button>
                            )
                        })
                        }
                    </div>
                </div>
                <hr className='mb-2 opacity-5' />
                <div className="mt-3">
                    <h3 className="text-base font-semibold">{isArabic ? 'دلائل الميزات' : 'Key Features'}</h3>
                    <ul className="mt-2">
                        {productDataClassic?.data?.features?.slice(0, !keyFeature ? 3 : 5).map((data: any, i: number) => (
                            <li className="flex items-center gap-x-2 mb-2 ltr:ml-3 rtl:mr-3" key={i}>
                                <Image
                                    src={data?.feature_image_link ? data?.feature_image_link : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                    alt={isArabic ? data?.feature_ar : data?.feature_en}
                                    title={isArabic ? data?.feature_ar : data?.feature_en}
                                    height={20}
                                    width={20}
                                    loading='lazy'
                                />
                                <p className="text__txs">{isArabic ? data?.feature_ar : data?.feature_en}</p>
                            </li>
                        ))}
                    </ul>
                    {productDataClassic?.data?.features?.length > 3 ?
                        <>
                            <div className={`text-xs font-semibold ltr:ml-3 rtl:mr-3 mt-4`}>
                                {keyFeature === true ?
                                    <button className="underline focus-visible:outline-none" onClick={() => setKeyFeature(false)}>
                                        {lang === "ar" ? '- أقل' : '- Less More'}
                                    </button>
                                    :
                                    <button className="underline focus-visible:outline-none" onClick={() => setKeyFeature(true)}>
                                        {lang ==="ar" ? '+ أظهر المزيد' : '+ Show More'}
                                    </button>
                                }
                            </div>
                        </>
                        : null}
                    {/* Up Sale Products */}
                    {productDataClassic?.data?.upsaleproductdata?.products?.data?.length > 0 ?
                        <>
                            <div className='my-6 relative'>
                                <ProductSliderComponent origin={origin} sliderHeading={isArabic ? 'المنتجات الموصى بها' : 'Recommended Products'} productDataSlider={productDataClassic?.data?.upsaleproductdata} headingRequired={true} isMobileOrTablet={isMobileOrTablet} isArabic={isArabic} />
                            </div>
                        </>
                        : null}
                </div>
            </div >

            {
                productDataClassic?.data?.mpn ?
                    <div className="container">
                        <div id="FlixMediaDescription" ></div>
                    </div>
                    :
                    null
            }
            {
                descriptionStatus ?
                    <div className="container mb-6">
                        <h3 className='text-base font-semibold mb-1'>{lang ==="ar" ? 'معلومات إضافية' : 'More Details'}</h3>
                        <div className={`relative bg-white max-h-full`}>
                            <div className={`text-sm text-[#5D686F]`} dangerouslySetInnerHTML={{ __html: isArabic ? productDataClassic?.data?.description_arabic : productDataClassic?.data?.description }}></div>
                        </div>
                    </div>
                    : null
            }


            {productDataClassic?.data?.specs?.length >= 2 ?
                <>
                    <div className="container">
                        <h3 className='text-base  font-semibold'>{isArabic ? 'تفاصيل المنتج الحالي' : 'Current product details'}</h3>
                        {/* <Link prefetch={false} scroll={false} href="#" className='text-[#219EBC] hover:underline'>المواصفات</Link> */}
                    </div>

                    <div className="bg-white mb-3 mt-1.5">
                        {productDataClassic?.data?.specs?.map((item: any, i: any) => {
                            return (
                                <div className="py-3 border-2 border-[#5D686F30] border-t-0 border-l-0 border-r-0" key={i}>
                                    <div className="grid md:grid-cols-8 container">
                                        <label className="md:py-4 font-semibold text-sm md:text-xs max-md:mb-4">{isArabic ? item?.heading_ar : item?.heading_en}</label>
                                        <div className="col-span-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 items-center">
                                            {item?.specdetails?.map((a: any, index: number) => {
                                                return (
                                                    <div key={index} className="flex items-center gap-4">
                                                        <div className="h-10 md:border-r w-1 border-[#00000010] hidden md:block"></div>
                                                        <div className="py-2 md:py-4 text-xs max-md:border-b border-[#00000010] w-full">
                                                            <p className="mb-1">{isArabic ? a.specs_ar : a.specs_en}</p>
                                                            <span className="text-[#5D686F]">{isArabic ? a.value_ar : a.value_en}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>
                :
                null
            }

            {/* Customer Reviews */}
            {productDataClassic?.data?.reviews?.length ?
                <div className="container my-6">
                    <div className="bg-white shadow-md rounded-md p-4">
                        <h3 className='text-base  font-semibold'>{isArabic ? 'منـتجات الاكثر مشاهدة' : 'Product Ratings & Reviews'}</h3>
                        <hr className="w-full my-3 opacity-10" />
                        <div className="md:flex items-start gap-x-5 md:divide-x divide-[#e8e8e8] max-md:divide-y">
                            <div className="w-full md:w-1/4 pb-4 md:pb-0">
                                <h4 className="text-sm font-semibold">{lang === "ar" ? 'التقييم العام' : 'Overall Rating'}</h4>
                                <p className="text-3xl font-bold mt-5">{productDataClassic?.data?.rating}</p>
                                {productDataClassic?.data?.totalrating <= 0 ?
                                    null
                                    :
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <svg height="20" width="20" viewBox="0 -10 511.99143 511" xmlns="http://www.w3.org/2000/svg" id="fi_1828961" fill={productDataClassic?.data?.rating >= 1 ? "#FFC107" : 'fill-[#5D686F]'}><path d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"></path></svg>
                                        <svg height="20" width="20" viewBox="0 -10 511.99143 511" xmlns="http://www.w3.org/2000/svg" id="fi_1828961" fill={productDataClassic?.data?.rating >= 2 ? "#FFC107" : 'fill-[#5D686F]'}><path d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"></path></svg>
                                        <svg height="20" width="20" viewBox="0 -10 511.99143 511" xmlns="http://www.w3.org/2000/svg" id="fi_1828961" fill={productDataClassic?.data?.rating >= 3 ? "#FFC107" : 'fill-[#5D686F]'}><path d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"></path></svg>
                                        <svg height="20" width="20" viewBox="0 -10 511.99143 511" xmlns="http://www.w3.org/2000/svg" id="fi_1828961" fill={productDataClassic?.data?.rating >= 4 ? "#FFC107" : 'fill-[#5D686F]'}><path d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"></path></svg>
                                        <svg height="20" width="20" viewBox="0 -10 511.99143 511" xmlns="http://www.w3.org/2000/svg" id="fi_1828961" fill={productDataClassic?.data?.rating >= 5 ? "#FFC107" : 'fill-[#5D686F]'}><path d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"></path></svg>
                                    </div>
                                }

                                {/* <label className="text-xs text-[#5D686F]">{lang ? `Based on ${1,531} ratings` : `Based on ${1,531} ratings`}</label> */}
                                <div className="mt-4">
                                    <div className="flex items-center gap-2.5 mb-1">
                                        <div className="flex items-center gap-1">
                                            <label className="text-sm font-semibold">5</label>
                                            <svg height="15" width="15" viewBox="0 -10 511.99143 511" xmlns="http://www.w3.org/2000/svg" id="fi_1828961" fill={"#38ae04"}><path d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"></path></svg>
                                        </div>
                                        <div className="w-full bg-primary/10 rounded">
                                            <div className={`bg-[#38ae04] text-xs font-medium text-white text-center p-1 leading-none rounded w-[${fiveStarRating * ratingResponseTotal}%]`}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5 mb-1">
                                        <div className="flex items-center gap-1">
                                            <label className="text-sm font-semibold">4</label>
                                            <svg height="15" width="15" viewBox="0 -10 511.99143 511" xmlns="http://www.w3.org/2000/svg" id="fi_1828961" fill={"#82ae04"}><path d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"></path></svg>
                                        </div>
                                        <div className="w-full bg-primary/10 rounded">
                                            <div className={`bg-[#82ae04] text-xs font-medium text-white text-center p-1 leading-none rounded w-[${fourStarRating * ratingResponseTotal}%]`}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5 mb-1">
                                        <div className="flex items-center gap-1">
                                            <label className="text-sm font-semibold">3</label>
                                            <svg height="15" width="15" viewBox="0 -10 511.99143 511" xmlns="http://www.w3.org/2000/svg" id="fi_1828961" fill={"#f3ac30"}><path d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"></path></svg>
                                        </div>
                                        <div className="w-full bg-primary/10 rounded">
                                            <div className={`bg-[#f3ac30] text-xs font-medium text-white text-center p-1 leading-none rounded w-[${threeStarRating * ratingResponseTotal}%]`}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5 mb-1">
                                        <div className="flex items-center gap-1">
                                            <label className="text-sm font-semibold">2</label>
                                            <svg height="15" width="15" viewBox="0 -10 511.99143 511" xmlns="http://www.w3.org/2000/svg" id="fi_1828961" fill={"#f36c32"}><path d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"></path></svg>
                                        </div>
                                        <div className="w-full bg-primary/10 rounded">
                                            <div className={`bg-[#f36c32] text-xs font-medium text-white text-center p-1 leading-none rounded w-[${twoStarRating * ratingResponseTotal}%]`}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex items-center gap-1">
                                            <label className="text-sm font-semibold">1</label>
                                            <svg height="15" width="15" viewBox="0 -10 511.99143 511" xmlns="http://www.w3.org/2000/svg" id="fi_1828961" fill={"#f36c32"}><path d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"></path></svg>
                                        </div>
                                        <div className="w-full bg-primary/10 rounded">
                                            <div className={`bg-[#f36c32] text-xs font-medium text-white text-center p-1 leading-none rounded w-[${oneStarRating * ratingResponseTotal}%]`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:ltr:pl-5 md:rtl:pr-5 max-md:pt-4 md:mt-0">
                                <h4 className="text-sm font-semibold">{productDataClassic?.data?.reviews?.length}{' '}{lang ==="ar" ? 'التعليقات' : 'Reviews'}</h4>
                                <hr className="w-full my-3 opacity-10" />
                                {/* <label className="text-xs text-[#5D686F]">{lang ? `Based on ${1,531} ratings` : `Based on ${1,531} ratings`}</label> */}
                                <div className="mt-4">
                                    {productDataClassic?.data?.reviews?.map((review: any, i: number) => (
                                        <div className="" key={i}>
                                            <div className="flex items-center gap-3">
                                                <div className="md:h-14 md:w-14 h-12 w-12 bg-[#219EBC20] rounded-full justify-center items-center flex font-bold text-[#219EBC]">{lang === "ar" ? '' : 'U'}</div>
                                                <div className="font-semibold text-xs">
                                                    <h5 className="text-sm">{review?.user_data?.first_name}{` `}{review?.user_data?.last_name}</h5>
                                                    <label className="text-[#5D686F75]">{dayjs(review?.created_at).format("MMM DD, YYYY")} </label>
                                                </div>
                                                <div className="h-12 border-r opacity-10 md:block hidden"></div>
                                                <div className="text-[#3866DF] fill-[#3866DF] font-semibold text-xs md:flex items-center gap-1.5 hidden">
                                                    <svg width="14" height="14" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5.07262 9.64218L2.67767 7.24723L3.52189 6.403L5.07262 7.94775L9.0183 4.00206L9.86252 4.85227L5.07262 9.64218ZM6.2701 0.661133C2.96506 0.661133 0.282715 3.34348 0.282715 6.64851C0.282715 9.95355 2.96506 12.6359 6.2701 12.6359C9.57513 12.6359 12.2575 9.95355 12.2575 6.64851C12.2575 3.34348 9.57513 0.661133 6.2701 0.661133Z"></path></svg>
                                                    {lang ==="ar" ? 'التحقق من الشراء' : 'Verified Purchase'}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 mt-2">
                                                <svg height="14" width="14" viewBox="0 -10 511.99143 511" xmlns="http://www.w3.org/2000/svg" id="fi_1828961" fill={review?.rating >= 1 ? "#FFC107" : 'fill-[#004B7A20]'}><path d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"></path></svg>
                                                <svg height="14" width="14" viewBox="0 -10 511.99143 511" xmlns="http://www.w3.org/2000/svg" id="fi_1828961" fill={review?.rating >= 2 ? "#FFC107" : 'fill-[#004B7A20]'}><path d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"></path></svg>
                                                <svg height="14" width="14" viewBox="0 -10 511.99143 511" xmlns="http://www.w3.org/2000/svg" id="fi_1828961" fill={review?.rating >= 3 ? "#FFC107" : 'fill-[#004B7A20]'}><path d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"></path></svg>
                                                <svg height="14" width="14" viewBox="0 -10 511.99143 511" xmlns="http://www.w3.org/2000/svg" id="fi_1828961" fill={review?.rating >= 4 ? "#FFC107" : 'fill-[#004B7A20]'}><path d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"></path></svg>
                                                <svg height="14" width="14" viewBox="0 -10 511.99143 511" xmlns="http://www.w3.org/2000/svg" id="fi_1828961" fill={review?.rating >= 5 ? "#FFC107" : 'fill-[#004B7A20]'}><path d="m510.652344 185.882812c-3.371094-10.367187-12.566406-17.707031-23.402344-18.6875l-147.796875-13.417968-58.410156-136.75c-4.3125-10.046875-14.125-16.53125-25.046875-16.53125s-20.738282 6.484375-25.023438 16.53125l-58.410156 136.75-147.820312 13.417968c-10.835938 1-20.011719 8.339844-23.402344 18.6875-3.371094 10.367188-.257813 21.738282 7.9375 28.925782l111.722656 97.964844-32.941406 145.085937c-2.410156 10.667969 1.730468 21.699219 10.582031 28.097656 4.757813 3.457031 10.347656 5.183594 15.957031 5.183594 4.820313 0 9.644532-1.28125 13.953125-3.859375l127.445313-76.203125 127.421875 76.203125c9.347656 5.585938 21.101562 5.074219 29.933593-1.324219 8.851563-6.398437 12.992188-17.429687 10.582032-28.097656l-32.941406-145.085937 111.722656-97.964844c8.191406-7.1875 11.308594-18.535156 7.9375-28.925782zm-252.203125 223.722657"></path></svg>
                                            </div>
                                            <div className="text-sm mt-5">
                                                <h6 className="font-semibold">{review?.title}</h6>
                                                <p className="text__txs text-[#5D686F]">{review?.review}</p>
                                            </div>
                                            {i + 1 === review?.length ?
                                                null
                                                :
                                                <hr className="w-full my-3 opacity-10" />
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : null
            }

            {/* Related Products */}
            {
                productdata?.products?.data?.length > 0 ?
                    <div className='my-6 relative'>
                        <h3 className='text-base  font-semibold'>{isArabic ? 'منـتجات مشـابهـة' : 'Related Products'}</h3>
                        <div className='mt-2 pb-2'>
                            <ProductSliderComponent origin={origin} productDataSlider={productdata} isMobileOrTablet={isMobileOrTablet} isArabic={isArabic} />
                        </div>
                    </div>
                    : null
            }

            {/* Recently Viewed */}
            {/* {highestviewprodata ?
				<div className='my-6 container'>
					<h3 className='text-base  font-semibold'>{isArabic? 'منـتجات الاكثر مشاهدة' : 'Recently Viewed'}</h3>
					<div className='mt-2 pb-2'>
						<ProductSlider lang={lang} dict={dict.products} products={highestviewprodata} devicetype={deviceType} />
					</div>
				</div>
				: null} */}

            {/* Add to Cart Button For Mobile */}
            <div className="h-28"></div>
            <div className="fixed bottom-0 w-full p-3 bg-white shadow-md border-t border-[#5D686F26] z-10">
                {/* QuantityBox */}
                {quantityBox ?
                    <div className="flex flex-col m-auto p-auto">
                        <div className="flex overflow-x-scroll hide-scroll-bar pb-1">
                            <div className="flex flex-nowrap items-center">
                                <div className="text-[#5D686F] mb-2 flex gap-x-2">
                                    {[...Array(quantity?.length)].map((_, i) => (
                                        <button key={i} className={`focus-visible:outline-none border rounded-md p-2 w-12 ${i === 1 ? 'border-[#004B7A]' : 'border-[#5D686F]'} text-sm`} onClick={() => {
                                            setsqty(i + 1)
                                            setQuantityBox(false)
                                        }}>{i + 1}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    : null}
                {/* {quantity > 0 || quantity == null ? */}
                <div className="align__center gap-x-1 md:gap-x-3">
                    {productDataClassic?.data?.pre_order === 1 ?
                        <>
                            <button onClick={() => {
                                if (fbtProId != null && fbtProCheck[fbtProId]) {
                                    addfbt(fbtProId)
                                }
                                else {
                                    addToCart()
                                    handleGTMAddToCart()
                                }
                            }}
                                className="btn border focus-visible:outline-none border-[#004B7A] bg-[#004B7A] p-2.5 rounded-md w-full text-white fill-white flex items-center justify-center font-medium gap-x-2">
                                {addToCartLoading ?
                                    <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 mr-3 fill-white" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg>
                                    :
                                    <>
                                        <svg id="fi_3144456" enableBackground="new 0 0 511.728 511.728" height="20" viewBox="0 0 511.728 511.728" width="20" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF">
                                            <path d="m147.925 379.116c-22.357-1.142-21.936-32.588-.001-33.68 62.135.216 226.021.058 290.132.103 17.535 0 32.537-11.933 36.481-29.017l36.404-157.641c2.085-9.026-.019-18.368-5.771-25.629s-14.363-11.484-23.626-11.484c-25.791 0-244.716-.991-356.849-1.438l-17.775-65.953c-4.267-15.761-18.65-26.768-34.978-26.768h-56.942c-8.284 0-15 6.716-15 15s6.716 15 15 15h56.942c2.811 0 5.286 1.895 6.017 4.592l68.265 253.276c-12.003.436-23.183 5.318-31.661 13.92-8.908 9.04-13.692 21.006-13.471 33.695.442 25.377 21.451 46.023 46.833 46.023h21.872c-3.251 6.824-5.076 14.453-5.076 22.501 0 28.95 23.552 52.502 52.502 52.502s52.502-23.552 52.502-52.502c0-8.049-1.826-15.677-5.077-22.501h94.716c-3.248 6.822-5.073 14.447-5.073 22.493 0 28.95 23.553 52.502 52.502 52.502 28.95 0 52.503-23.553 52.503-52.502 0-8.359-1.974-16.263-5.464-23.285 5.936-1.999 10.216-7.598 10.216-14.207 0-8.284-6.716-15-15-15zm91.799 52.501c0 12.408-10.094 22.502-22.502 22.502s-22.502-10.094-22.502-22.502c0-12.401 10.084-22.491 22.483-22.501h.038c12.399.01 22.483 10.1 22.483 22.501zm167.07 22.494c-12.407 0-22.502-10.095-22.502-22.502 0-12.285 9.898-22.296 22.137-22.493h.731c12.24.197 22.138 10.208 22.138 22.493-.001 12.407-10.096 22.502-22.504 22.502zm74.86-302.233c.089.112.076.165.057.251l-15.339 66.425h-51.942l8.845-67.023 58.149.234c.089.002.142.002.23.113zm-154.645 163.66v-66.984h53.202l-8.84 66.984zm-74.382 0-8.912-66.984h53.294v66.984zm-69.053 0h-.047c-3.656-.001-6.877-2.467-7.828-5.98l-16.442-61.004h54.193l8.912 66.984zm56.149-96.983-9.021-67.799 66.306.267v67.532zm87.286 0v-67.411l66.022.266-8.861 67.145zm-126.588-67.922 9.037 67.921h-58.287l-18.38-68.194zm237.635 164.905h-36.426l8.84-66.984h48.973l-14.137 61.217c-.784 3.396-3.765 5.767-7.25 5.767z"></path>
                                        </svg>
                                        {isArabic ? 'اضف الي العربة' : 'Pre Order'}
                                    </>
                                }
                            </button>
                        </>
                        :
                        <>
                            {productDataClassic?.data?.quantity == 0 || productDataClassic?.data?.quantity == null ?
                                <>
                                    {StockAlertProduct ?
                                        <button onClick={(e: any) => { handleStockAlert() }} className="focus-visible:outline-none btn border border-[#DC4E4E] bg-[#DC4E4E] text-white p-3 rounded-md w-full font-medium">
                                            {isArabic ? 'إزالة تنبيه توفر المنتج' : 'Remove Stock Alert'}
                                        </button>
                                        :
                                        <button onClick={(e: any) => { handleStockAlert() }} className="focus-visible:outline-none btn border border-[#004B7A] bg-[#004B7A] text-white p-3 rounded-md w-full font-medium">
                                            {isArabic ? 'أبلغني عند توفر المنتج' : 'Setup Stock Alert'}
                                        </button>
                                    }
                                </>
                                :
                                <>
                                    <button disabled={checkQty} onClick={() => {
                                        if (fbtProId != null && fbtProCheck[fbtProId]) {
                                            addfbt(fbtProId)
                                        }
                                        else {
                                            addToCart()
                                            handleGTMAddToCart()
                                        }
                                    }}
                                        className="btn border focus-visible:outline-none border-[#004B7A] bg-[#004B7A] p-2.5 rounded-md w-full text-white fill-white flex items-center justify-center font-medium gap-x-2">
                                        {addToCartLoading ?
                                            <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 mr-3 fill-white" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg>
                                            :
                                            <>
                                                <svg id="fi_3144456" enableBackground="new 0 0 511.728 511.728" height="20" viewBox="0 0 511.728 511.728" width="20" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF">
                                                    <path d="m147.925 379.116c-22.357-1.142-21.936-32.588-.001-33.68 62.135.216 226.021.058 290.132.103 17.535 0 32.537-11.933 36.481-29.017l36.404-157.641c2.085-9.026-.019-18.368-5.771-25.629s-14.363-11.484-23.626-11.484c-25.791 0-244.716-.991-356.849-1.438l-17.775-65.953c-4.267-15.761-18.65-26.768-34.978-26.768h-56.942c-8.284 0-15 6.716-15 15s6.716 15 15 15h56.942c2.811 0 5.286 1.895 6.017 4.592l68.265 253.276c-12.003.436-23.183 5.318-31.661 13.92-8.908 9.04-13.692 21.006-13.471 33.695.442 25.377 21.451 46.023 46.833 46.023h21.872c-3.251 6.824-5.076 14.453-5.076 22.501 0 28.95 23.552 52.502 52.502 52.502s52.502-23.552 52.502-52.502c0-8.049-1.826-15.677-5.077-22.501h94.716c-3.248 6.822-5.073 14.447-5.073 22.493 0 28.95 23.553 52.502 52.502 52.502 28.95 0 52.503-23.553 52.503-52.502 0-8.359-1.974-16.263-5.464-23.285 5.936-1.999 10.216-7.598 10.216-14.207 0-8.284-6.716-15-15-15zm91.799 52.501c0 12.408-10.094 22.502-22.502 22.502s-22.502-10.094-22.502-22.502c0-12.401 10.084-22.491 22.483-22.501h.038c12.399.01 22.483 10.1 22.483 22.501zm167.07 22.494c-12.407 0-22.502-10.095-22.502-22.502 0-12.285 9.898-22.296 22.137-22.493h.731c12.24.197 22.138 10.208 22.138 22.493-.001 12.407-10.096 22.502-22.504 22.502zm74.86-302.233c.089.112.076.165.057.251l-15.339 66.425h-51.942l8.845-67.023 58.149.234c.089.002.142.002.23.113zm-154.645 163.66v-66.984h53.202l-8.84 66.984zm-74.382 0-8.912-66.984h53.294v66.984zm-69.053 0h-.047c-3.656-.001-6.877-2.467-7.828-5.98l-16.442-61.004h54.193l8.912 66.984zm56.149-96.983-9.021-67.799 66.306.267v67.532zm87.286 0v-67.411l66.022.266-8.861 67.145zm-126.588-67.922 9.037 67.921h-58.287l-18.38-68.194zm237.635 164.905h-36.426l8.84-66.984h48.973l-14.137 61.217c-.784 3.396-3.765 5.767-7.25 5.767z"></path>
                                                </svg>
                                                {isArabic ? 'اضف الي العربة' : 'Add to Cart'}
                                            </>
                                        }
                                    </button>
                                    <button onClick={() => router.push(`${origin}/${lang}/cart`)}
                                        className="btn border focus-visible:outline-none border-[#004B7A] bg-white hover:bg-[#004B7A] hover:text-white hover:fill-white p-2.5 rounded-md w-full text-[#004B7A] fill-[#004B7A] flex items-center justify-center font-medium gap-x-2">
                                        {addToCartLoading ?
                                            <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 mr-3 fill-white" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg>
                                            :
                                            <>
                                                {isArabic ? 'اذهب للعربة' : 'Go to Cart'}
                                            </>
                                        }
                                    </button>
                                </>
                            }
                            {productDataClassic?.data?.quantity == 0 || productDataClassic?.data?.quantity == null ?
                                null
                                :
                                <button
                                    onClick={() => setQuantityBox(!quantityBox)}
                                    className="border focus-visible:outline-none rounded-md py-2.5 px-2 h-auto w-36 border-[#004B7A] text-[#004B7A] fill-[#004B7A]  font-semibold text-base bg-[#5D686F05] align__center"
                                >
                                    {sqty}
                                    <div className="flex items-center gap-x-1.5">
                                        <div className="border-l h-5 opacity-40 border-[#004B7A]"></div>
                                        <svg height="14" viewBox="0 0 32 32" width="14" className={`transform ease-out duration-150 ${quantityBox ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" id="fi_9126125"><path clipRule="evenodd" d="m4.93934 10.9393c.58579-.5857 1.53553-.5857 2.12132 0l8.93934 8.9394 8.9393-8.9394c.5858-.5857 1.5356-.5857 2.1214 0 .5857.5858.5857 1.5356 0 2.1214l-10 10c-.5858.5857-1.5356.5857-2.1214 0l-9.99996-10c-.58579-.5858-.58579-1.5356 0-2.1214z" fillRule="evenodd"></path></svg>
                                    </div>
                                </button>
                            }
                        </>
                    }

                </div>
                {/* :null} */}
            </div>

            {
                productDataClassic?.data?.questions?.length > 0 ?
                    <div className="container md:py-4 py-16">
                        <h3 className='text-base  font-semibold'>{isArabic ? 'أسئلة مكررة' : 'FAQs'}</h3>
                        <div className="my-6 grid md:grid-cols-2 md:gap-4">
                            {productDataClassic?.data?.questions?.map((questionData: any, i: number) => {
                                return (
                                    <>

                                        <div>
                                            <Disclosure>
                                                {({ open }) => (
                                                    <>
                                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                                            {lang === "ar" ? questionData?.question_arabic : questionData?.question}
                                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                                        </DisclosureButton>
                                                        <Disclosure.Panel className="text-xs mb-3">
                                                            {lang === "ar" ? questionData?.answer_arabic : questionData?.answer}
                                                        </Disclosure.Panel>
                                                    </>
                                                )}
                                            </Disclosure>
                                        </div>
                                    </>
                                )
                            })}

                        </div>
                    </div>
                    : null
            }

            {/* Gift Modal */}
            {
                extraData?.freegiftdata ?
                    <Transition appear show={isOpen} as={Fragment}>
                        <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0" />
                            </TransitionChild>
                            <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                                <div className="flex items-center justify-center min-h-screen px-4">
                                    <TransitionChild
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <DialogPanel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black bg-white">
                                            <div className="flex bg-white items-center justify-between px-5 pt-4">
                                                <h5 className='text-base font-[600] flex items-center gap-x-2 text-[#004B7A] fill-[#004B7A]'>
                                                    <svg id="fi_3850991" enableBackground="new 0 0 512 512" height="20" viewBox="0 0 512 512" width="20" fill="#219EBC" xmlns="http://www.w3.org/2000/svg"><g><path d="m359.42 20.97c13.36-8.94 29.92-6.83 38.21.38 3.59 3.13 7.1 8.46 3.4 16.1-7.77 16.12-24.32 26.53-42.14 26.53h-51.02c2.4 6.2 3.73 12.93 3.73 19.97 0 6.27-1.06 12.3-2.98 17.93h119.99c8-15.2 8.58-32.65 1.45-48.64l-14.62-32.82c-1.71-3.8-4.33-7.34-7.89-10.44-12.42-10.78-36.42-14.98-56.52-1.54l-55.1 36.89c3.5 3.62 6.52 7.7 8.94 12.15z"></path><path d="m203.4 101.87c-1.92-5.63-2.98-11.66-2.98-17.93 0-7.04 1.33-13.77 3.73-19.97h-50.99c-17.82 0-34.37-10.42-42.18-26.54-3.7-7.63-.19-12.96 3.41-16.08 4.46-3.88 11.31-6.28 18.77-6.28 6.41 0 13.26 1.77 19.43 5.9l54.54 36.51c2.42-4.46 5.45-8.54 8.94-12.15l-55.1-36.89c-20.1-13.44-44.1-9.24-56.49 1.54-3.97 3.45-6.79 7.44-8.45 11.74l-14.07 31.51c-7.14 15.99-6.56 33.44 1.45 48.64z"></path><path d="m219.67 101.87h72.65c2.68-5.41 4.2-11.5 4.2-17.93 0-22.33-18.2-40.53-40.53-40.53s-40.53 18.2-40.53 40.53c.01 6.44 1.53 12.52 4.21 17.93z"></path><path d="m16.2 148.65v49.55c0 14.89 10.32 27.41 24.17 30.8h187.69v-112.07h-180.15c-17.48 0-31.71 14.23-31.71 31.72z"></path><path d="m40.38 469.91c0 23.21 18.88 42.09 42.09 42.09h145.6v-267.95h-187.69z"></path><path d="m464.09 116.93h-180.13v112.06h187.66c13.86-3.39 24.17-15.91 24.17-30.8v-49.55c.01-17.48-14.22-31.71-31.7-31.71z"></path><path d="m283.96 512h145.57c23.21 0 42.09-18.88 42.09-42.09v-225.86h-187.66z"></path></g></svg>
                                                    {extraData?.freegiftdata?.freegiftlist.length === extraData?.freegiftdata?.allowed_gifts ?
                                                        <>{isArabic ? `(${extraData?.freegiftdata?.allowed_gifts})  هدية مجانية` : `(${extraData?.freegiftdata?.allowed_gifts}) Free Gift`}</>
                                                        :
                                                        extraData?.freegiftdata?.discount_type === 1 ?
                                                            <>{isArabic ? `هديا (${extraData?.freegiftdata?.allowed_gifts}) اختر هديتك المجانية` : `Choose (${extraData?.freegiftdata?.allowed_gifts}) Free Gift`}</>
                                                            :
                                                            <>{isArabic ? `اختر منتج واحد بـ 11 ر.س` : `Choose (${extraData?.freegiftdata?.allowed_gifts}) Product in 11 SR`}</>
                                                    }
                                                </h5>
                                                <button type="button" className="focus-visible:outline-none text-dark hover:text-dark fill-dark" onClick={() => setIsOpen(false)}>
                                                    <svg height="16" viewBox="0 0 329.26933 329" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_1828778"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"></path></svg>
                                                </button>
                                            </div>
                                            <div className="p-5">
                                                <div className="mx-auto w-full">
                                                    {extraData?.freegiftdata?.freegiftlist?.map((freegiftdatapro: any, i: number) => {
                                                        if (extraData?.freegiftdata?.discount_type == 2) {
                                                            var fgprice = freegiftdatapro?.productdetail?.sale_price ? freegiftdatapro?.productdetail?.sale_price : freegiftdatapro?.productdetail?.price;
                                                            fgprice -= (freegiftdatapro?.discount * fgprice) / 100;
                                                        }
                                                        return (
                                                            <div
                                                                className={
                                                                    `${selectedGifts[freegiftdatapro.id]
                                                                        ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                                                                        : ''
                                                                    } ${selectedGifts[freegiftdatapro.id] ? 'bg-[#004B7A] text-white' : 'bg-[#EEF4F7]'} relative flex rounded-lg p-3 focus:outline-none mb-1`}
                                                            >
                                                                <div className="relative align__center w-full">
                                                                    <label htmlFor="hs-checkbox-delete" className="cursor-pointer"
                                                                        onClick={() => {

                                                                            if (extraData?.freegiftdata?.allowed_gifts == extraData?.freegiftdata?.freegiftlist?.length && extraData?.freegiftdata?.discount_type == 1) {
                                                                                return false
                                                                            }
                                                                            else {
                                                                                var gifts = selectedGifts
                                                                                if (gifts[freegiftdatapro.id])
                                                                                    delete gifts[freegiftdatapro.id]
                                                                                else if (Object.keys(selectedGifts).length < allowed_gifts)
                                                                                    gifts[freegiftdatapro.id] = true
                                                                                setselectedGifts({ ...gifts })
                                                                            }
                                                                            // if (Object.keys(selectedGifts).length == allowed_gifts) {
                                                                            // // topMessageAlartSuccess("Gift have been selected!")
                                                                            // closeModal()
                                                                            // if (popupcart) {
                                                                            // setpopupcart(false)
                                                                            // setpopuppre(false)
                                                                            // setpopupfbt(false)
                                                                            // addToCart()
                                                                            // }
                                                                            // if (popuppre) {
                                                                            // setpopupcart(false)
                                                                            // setpopuppre(false)
                                                                            // setpopupfbt(false)
                                                                            // addToCart()
                                                                            // }
                                                                            // if (popupfbt) {
                                                                            // setpopupcart(false)
                                                                            // setpopuppre(false)
                                                                            // setpopupfbt(false)
                                                                            // addfbt(popupfbtid)
                                                                            // }
                                                                            // // addToCart()

                                                                            // }

                                                                        }}
                                                                    >
                                                                        <div className="flex w-full items-center justify-between">
                                                                            <div className="flex items-center gap-x-3">
                                                                                <Image
                                                                                    src={freegiftdatapro?.productdetail?.featured_image ? NewMedia + freegiftdatapro?.productdetail?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                                                                    alt={freegiftdatapro?.productdetail?.featured_image ? isArabic ? freegiftdatapro?.productdetail?.featured_image?.alt_arabic : freegiftdatapro?.productdetail?.featured_image?.alt : ''}
                                                                                    title={freegiftdatapro?.productdetail?.featured_image ? isArabic ? freegiftdatapro?.productdetail?.featured_image?.alt_arabic : freegiftdatapro?.productdetail?.featured_image?.title : ''}
                                                                                    height={60}
                                                                                    width={60}
                                                                                    loading='lazy'
                                                                                    className="rounded-md"
                                                                                />
                                                                                <div className="flex items-center text-xs">
                                                                                    <span>
                                                                                        {extraData?.freegiftdata?.discount_type == 1 ?
                                                                                            <p className={`text-[#004B7A] font-bold ${selectedGifts[freegiftdatapro.id] ? 'text-secondary' : ''}`}>
                                                                                                {isArabic ? 'هدية مجانية' : 'Free Gift Item'}
                                                                                            </p>
                                                                                            : null}
                                                                                        {extraData?.freegiftdata?.discount_type == 2 ?
                                                                                            <p className={`text-[#004B7A] font-bold ${selectedGifts[freegiftdatapro.id] ? 'text-secondary' : ''}`}>

                                                                                                {fgprice != 0 ? (fgprice + ' ' + (isArabic ? ' ر.س' : ' SR')) : lang ? 'حر' : 'Free'}
                                                                                            </p>
                                                                                            : null}
                                                                                        {extraData?.freegiftdata?.discount_type == 3 ?
                                                                                            <p className={`text-[#004B7A] font-bold ${selectedGifts[freegiftdatapro.id] ? 'text-secondary' : ''}`}>
                                                                                                {freegiftdatapro?.discount != 0 ?
                                                                                                    (freegiftdatapro?.discount + ' ' + (isArabic ? ' ر.س' : ' SR')) : lang ? 'حر' : 'Free'}
                                                                                            </p>
                                                                                            : null}
                                                                                        <h4 className={`text-[#004B7A] text-sm md:w-80 max-md:line-clamp-2 ${selectedGifts[freegiftdatapro.id] ? 'text-white' : ''}`}>{isArabic ? freegiftdatapro?.productdetail?.name_arabic : freegiftdatapro?.productdetail?.name}</h4>
                                                                                        <h6 className={` font-semibold text-[#5D686F] mt-3.5 text-left rtl:text-right ${selectedGifts[freegiftdatapro.id] ? 'text-secondary' : ''}`}>
                                                                                            {isArabic ? 'العلامة' : 'Brand'} {isArabic ? freegiftdatapro?.productdetail?.brand?.name_arabic : freegiftdatapro?.productdetail?.brand?.name}</h6>
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </label>
                                                                    <input
                                                                        id="hs-checkbox-delete"
                                                                        name="hs-checkbox-delete"
                                                                        type="checkbox"
                                                                        className="rounded hidden" aria-describedby="hs-checkbox-delete-description"
                                                                    />
                                                                    {selectedGifts[freegiftdatapro.id] ?
                                                                        <div className="shrink-0 text-white">
                                                                            <CheckIcon className="h-6 w-6" />
                                                                        </div>
                                                                        :
                                                                        <div className="shrink-0 text-white">
                                                                            <CheckIconInActive className="h-6 w-6" />
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                </div>
                                            </div>
                                            {extraData?.freegiftdata?.freegiftlist?.filter((e: any) => e?.discount > 0)?.length > 0 ?
                                                <div className="border-t border-[#5D686F30] py-3 px-3 gap-2 flex items-center justify-end">
                                                    <button className={`focus-visible:outline-none hover:text-white py-1.5 px-4 rounded-md h-10 ${checkQty ? 'bg-[#DC4E4E] text-white' : ''} hover:bg-[#DC4E4E] border-[#DC4E4E] text-[#DC4E4E] border`}
                                                        aria-label={isArabic ? "أضف بدون هدايا" : "Add Without Gifts"}
                                                        disabled={checkQty}
                                                        onClick={() => {
                                                            singleAddToCart()
                                                        }}
                                                    >
                                                        <div className='text-xs  font-semibold'>
                                                            {isArabic ? "أضف بدون هدايا" : "Add Without Gifts"}
                                                        </div>
                                                    </button>
                                                    <button className={`focus-visible:outline-none text-white py-1.5 px-4 rounded-md h-10 bg-[#004B7A] border-[#004B7A] border`}
                                                        // aria-label={isArabic? "أضف بدون هدايا" : "Add Without Gifts"}
                                                        disabled={checkQty}
                                                        onClick={() => {
                                                            if (Object.keys(selectedGifts).length == extraData?.freegiftdata?.allowed_gifts) {
                                                                if (fbtProId != null && fbtProCheck[fbtProId]) {
                                                                    addfbt(fbtProId)
                                                                }
                                                                else {
                                                                    addToCart()
                                                                    handleGTMAddToCart()
                                                                }
                                                                // addToCart()
                                                            } else {
                                                                topMessageAlartDanger(lang ? 'الرجاء اختيار منتجات الهدايا' : 'please select gift products')
                                                                ErrorTracker.trackCustomError(
                                                                    lang ? 'الرجاء اختيار منتجات الهدايا' : 'please select gift products',
                                                                    'frontend',
                                                                    400,
                                                                    deviceType,
                                                                    'Product Page'
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <div className='text-xs font-semibold'>
                                                            {isArabic ? "اختر هذه الهدية" : "Select This Gift"}
                                                        </div>
                                                    </button>
                                                </div>
                                                : null}
                                        </DialogPanel>
                                    </TransitionChild>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                    : null
            }


            {/* FBT Modal */}
            {
                extraData?.fbtdata ?
                    <Transition appear show={FbtisOpen} as={Fragment}>
                        <Dialog as="div" open={FbtisOpen} onClose={() => setFbtisOpen(false)}>
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0" />
                            </TransitionChild>
                            <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                                <div className="flex items-center justify-center min-h-screen px-4">
                                    <TransitionChild
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <DialogPanel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-md my-8 text-black bg-white">
                                            <div className="flex bg-white items-center justify-between px-5 pt-4">
                                                <h5 className='text-base font-[600] flex items-center gap-x-2 text-[#004B7A] fill-[#004B7A]'>
                                                    <svg id="fi_3850991" enableBackground="new 0 0 512 512" height="20" viewBox="0 0 512 512" width="20" fill="#219EBC" xmlns="http://www.w3.org/2000/svg"><g><path d="m359.42 20.97c13.36-8.94 29.92-6.83 38.21.38 3.59 3.13 7.1 8.46 3.4 16.1-7.77 16.12-24.32 26.53-42.14 26.53h-51.02c2.4 6.2 3.73 12.93 3.73 19.97 0 6.27-1.06 12.3-2.98 17.93h119.99c8-15.2 8.58-32.65 1.45-48.64l-14.62-32.82c-1.71-3.8-4.33-7.34-7.89-10.44-12.42-10.78-36.42-14.98-56.52-1.54l-55.1 36.89c3.5 3.62 6.52 7.7 8.94 12.15z"></path><path d="m203.4 101.87c-1.92-5.63-2.98-11.66-2.98-17.93 0-7.04 1.33-13.77 3.73-19.97h-50.99c-17.82 0-34.37-10.42-42.18-26.54-3.7-7.63-.19-12.96 3.41-16.08 4.46-3.88 11.31-6.28 18.77-6.28 6.41 0 13.26 1.77 19.43 5.9l54.54 36.51c2.42-4.46 5.45-8.54 8.94-12.15l-55.1-36.89c-20.1-13.44-44.1-9.24-56.49 1.54-3.97 3.45-6.79 7.44-8.45 11.74l-14.07 31.51c-7.14 15.99-6.56 33.44 1.45 48.64z"></path><path d="m219.67 101.87h72.65c2.68-5.41 4.2-11.5 4.2-17.93 0-22.33-18.2-40.53-40.53-40.53s-40.53 18.2-40.53 40.53c.01 6.44 1.53 12.52 4.21 17.93z"></path><path d="m16.2 148.65v49.55c0 14.89 10.32 27.41 24.17 30.8h187.69v-112.07h-180.15c-17.48 0-31.71 14.23-31.71 31.72z"></path><path d="m40.38 469.91c0 23.21 18.88 42.09 42.09 42.09h145.6v-267.95h-187.69z"></path><path d="m464.09 116.93h-180.13v112.06h187.66c13.86-3.39 24.17-15.91 24.17-30.8v-49.55c.01-17.48-14.22-31.71-31.7-31.71z"></path><path d="m283.96 512h145.57c23.21 0 42.09-18.88 42.09-42.09v-225.86h-187.66z"></path></g></svg>
                                                    {isArabic ? 'Add With FBT Products' : 'Add With FBT Products'} {extraData?.freegiftdata?.allowed_gifts}
                                                </h5>
                                                <button type="button" className="focus-visible:outline-none text-dark hover:text-dark fill-dark" onClick={() => setFbtisOpen(false)}>
                                                    <svg height="16" viewBox="0 0 329.26933 329" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_1828778"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"></path></svg>
                                                </button>
                                            </div>
                                            <div className="p-5">
                                                <div className="mx-auto w-full">
                                                    {extraData?.fbtdata?.fbtlist?.map((fbtpro: any, i: number) => {
                                                        var fbtprice = fbtpro?.productdetail?.sale_price ? fbtpro?.productdetail?.sale_price : fbtpro?.productdetail?.price;
                                                        if (extraData?.fbtdata?.discount_type == 1) {
                                                            fbtprice -= (fbtpro?.discount * fbtprice) / 100;
                                                        } else {
                                                            // amount type
                                                            if (extraData?.fbtdata?.amount_type == 1) {
                                                                fbtprice = fbtprice - fbtpro?.discount;
                                                            }
                                                            else {
                                                                fbtprice = fbtpro?.discount;
                                                            }
                                                        }
                                                        return (
                                                            <>
                                                                <div
                                                                    className={`bg-[#fff] text-white relative flex rounded-lg p-3 focus:outline-none mb-1`}
                                                                >
                                                                    <div className="relative align__center w-full">
                                                                        <label htmlFor="hs-checkbox-delete" className="cursor-pointer"
                                                                            onClick={() => {
                                                                                // if (Object.keys(selectedGifts).length == allowed_gifts) {
                                                                                // // topMessageAlartSuccess("Gift have been selected!")
                                                                                // closeModal()
                                                                                // if (popupcart) {
                                                                                // setpopupcart(false)
                                                                                // setpopuppre(false)
                                                                                // setpopupfbt(false)
                                                                                // addToCart()
                                                                                // }
                                                                                // if (popuppre) {
                                                                                // setpopupcart(false)
                                                                                // setpopuppre(false)
                                                                                // setpopupfbt(false)
                                                                                // addToCart()
                                                                                // }
                                                                                // if (popupfbt) {
                                                                                // setpopupcart(false)
                                                                                // setpopuppre(false)
                                                                                // setpopupfbt(false)
                                                                                // addfbt(popupfbtid)
                                                                                // }
                                                                                // // addToCart()

                                                                                // }

                                                                            }}
                                                                        >
                                                                            <div className="flex w-full items-center justify-between">
                                                                                <div className="flex items-center gap-x-3">
                                                                                    <Image
                                                                                        src={fbtpro?.productdetail?.featured_image ? NewMedia + fbtpro?.productdetail?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                                                                        alt={fbtpro?.productdetail?.featured_image ? isArabic ? fbtpro?.productdetail?.featured_image?.alt_arabic : fbtpro?.productdetail?.featured_image?.alt : ''}
                                                                                        title={fbtpro?.productdetail?.featured_image ? isArabic ? fbtpro?.productdetail?.featured_image?.alt_arabic : fbtpro?.productdetail?.featured_image?.title : ''}
                                                                                        height={60}
                                                                                        width={60}
                                                                                        loading='lazy'
                                                                                        className="rounded-md"
                                                                                    />
                                                                                    <div className="flex items-center text-xs">
                                                                                        <span>
                                                                                            <h4 className={`text-[#004B7A] text-sm md:w-80 max-md:line-clamp-2`}>{isArabic ? fbtpro?.productdetail?.name_arabic : fbtpro?.productdetail?.name}</h4>
                                                                                            <h2 className="mt-4 text-xl  font-semibold text-dark flex gap-x-1 items-center">{fbtpro?.discount?.toLocaleString('EN-US')}{currencySymbol} <span className="text-sm text-[#DC4E4E] line-through decoration-[#DC4E4E] decoration-2 font-medium">{isArabic ? fbtpro?.productdetail?.price.toLocaleString('EN-US') + ' ر.س' : 'SR ' + fbtpro?.productdetail?.price.toLocaleString('EN-US')}</span></h2>
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </label>
                                                                        <input
                                                                            id="hs-checkbox-delete"
                                                                            name="hs-checkbox-delete"
                                                                            type="checkbox"
                                                                            className="rounded hidden" aria-describedby="hs-checkbox-delete-description"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <hr className="w-full my-3 opacity-10" />
                                                                <div className='flex gap-3'>
                                                                    <button className="w-[50%] focus-visible:outline-none flex items-center justify-center gap-x-2 py-2.5 px-4 bg-[#B15533] text-white fill-white rounded-md text-xs" onClick={() => {
                                                                        addfbt(fbtpro?.id)
                                                                        setFbtisOpen(false)
                                                                    }}>
                                                                        <svg id="fi_3144456" enableBackground="new 0 0 511.728 511.728" height="20" viewBox="0 0 511.728 511.728" width="20" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF">
                                                                            <path d="m147.925 379.116c-22.357-1.142-21.936-32.588-.001-33.68 62.135.216 226.021.058 290.132.103 17.535 0 32.537-11.933 36.481-29.017l36.404-157.641c2.085-9.026-.019-18.368-5.771-25.629s-14.363-11.484-23.626-11.484c-25.791 0-244.716-.991-356.849-1.438l-17.775-65.953c-4.267-15.761-18.65-26.768-34.978-26.768h-56.942c-8.284 0-15 6.716-15 15s6.716 15 15 15h56.942c2.811 0 5.286 1.895 6.017 4.592l68.265 253.276c-12.003.436-23.183 5.318-31.661 13.92-8.908 9.04-13.692 21.006-13.471 33.695.442 25.377 21.451 46.023 46.833 46.023h21.872c-3.251 6.824-5.076 14.453-5.076 22.501 0 28.95 23.552 52.502 52.502 52.502s52.502-23.552 52.502-52.502c0-8.049-1.826-15.677-5.077-22.501h94.716c-3.248 6.822-5.073 14.447-5.073 22.493 0 28.95 23.553 52.502 52.502 52.502 28.95 0 52.503-23.553 52.503-52.502 0-8.359-1.974-16.263-5.464-23.285 5.936-1.999 10.216-7.598 10.216-14.207 0-8.284-6.716-15-15-15zm91.799 52.501c0 12.408-10.094 22.502-22.502 22.502s-22.502-10.094-22.502-22.502c0-12.401 10.084-22.491 22.483-22.501h.038c12.399.01 22.483 10.1 22.483 22.501zm167.07 22.494c-12.407 0-22.502-10.095-22.502-22.502 0-12.285 9.898-22.296 22.137-22.493h.731c12.24.197 22.138 10.208 22.138 22.493-.001 12.407-10.096 22.502-22.504 22.502zm74.86-302.233c.089.112.076.165.057.251l-15.339 66.425h-51.942l8.845-67.023 58.149.234c.089.002.142.002.23.113zm-154.645 163.66v-66.984h53.202l-8.84 66.984zm-74.382 0-8.912-66.984h53.294v66.984zm-69.053 0h-.047c-3.656-.001-6.877-2.467-7.828-5.98l-16.442-61.004h54.193l8.912 66.984zm56.149-96.983-9.021-67.799 66.306.267v67.532zm87.286 0v-67.411l66.022.266-8.861 67.145zm-126.588-67.922 9.037 67.921h-58.287l-18.38-68.194zm237.635 164.905h-36.426l8.84-66.984h48.973l-14.137 61.217c-.784 3.396-3.765 5.767-7.25 5.767z"></path>
                                                                        </svg>
                                                                        {isArabic ? 'Add With FBT Product' : 'Add With FBT Product'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            addToCart()
                                                                            setFbtisOpen(false)
                                                                            handleGTMAddToCart()
                                                                        }} className="focus-visible:outline-none btn border border-[#004B7A] bg-[#004B7A] p-3 rounded-md w-[50%] text-white fill-white flex items-center justify-center font-medium gap-x-2">
                                                                        {addToCartLoading ?
                                                                            <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 mr-3 fill-white" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg>
                                                                            :
                                                                            <>
                                                                                <svg id="fi_3144456" enableBackground="new 0 0 511.728 511.728" height="20" viewBox="0 0 511.728 511.728" width="20" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF">
                                                                                    <path d="m147.925 379.116c-22.357-1.142-21.936-32.588-.001-33.68 62.135.216 226.021.058 290.132.103 17.535 0 32.537-11.933 36.481-29.017l36.404-157.641c2.085-9.026-.019-18.368-5.771-25.629s-14.363-11.484-23.626-11.484c-25.791 0-244.716-.991-356.849-1.438l-17.775-65.953c-4.267-15.761-18.65-26.768-34.978-26.768h-56.942c-8.284 0-15 6.716-15 15s6.716 15 15 15h56.942c2.811 0 5.286 1.895 6.017 4.592l68.265 253.276c-12.003.436-23.183 5.318-31.661 13.92-8.908 9.04-13.692 21.006-13.471 33.695.442 25.377 21.451 46.023 46.833 46.023h21.872c-3.251 6.824-5.076 14.453-5.076 22.501 0 28.95 23.552 52.502 52.502 52.502s52.502-23.552 52.502-52.502c0-8.049-1.826-15.677-5.077-22.501h94.716c-3.248 6.822-5.073 14.447-5.073 22.493 0 28.95 23.553 52.502 52.502 52.502 28.95 0 52.503-23.553 52.503-52.502 0-8.359-1.974-16.263-5.464-23.285 5.936-1.999 10.216-7.598 10.216-14.207 0-8.284-6.716-15-15-15zm91.799 52.501c0 12.408-10.094 22.502-22.502 22.502s-22.502-10.094-22.502-22.502c0-12.401 10.084-22.491 22.483-22.501h.038c12.399.01 22.483 10.1 22.483 22.501zm167.07 22.494c-12.407 0-22.502-10.095-22.502-22.502 0-12.285 9.898-22.296 22.137-22.493h.731c12.24.197 22.138 10.208 22.138 22.493-.001 12.407-10.096 22.502-22.504 22.502zm74.86-302.233c.089.112.076.165.057.251l-15.339 66.425h-51.942l8.845-67.023 58.149.234c.089.002.142.002.23.113zm-154.645 163.66v-66.984h53.202l-8.84 66.984zm-74.382 0-8.912-66.984h53.294v66.984zm-69.053 0h-.047c-3.656-.001-6.877-2.467-7.828-5.98l-16.442-61.004h54.193l8.912 66.984zm56.149-96.983-9.021-67.799 66.306.267v67.532zm87.286 0v-67.411l66.022.266-8.861 67.145zm-126.588-67.922 9.037 67.921h-58.287l-18.38-68.194zm237.635 164.905h-36.426l8.84-66.984h48.973l-14.137 61.217c-.784 3.396-3.765 5.767-7.25 5.767z"></path>
                                                                                </svg>
                                                                                {isArabic ? 'اضف الي العربة' : 'Add to Cart'}
                                                                            </>
                                                                        }
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )
                                                    })
                                                    }
                                                </div>
                                            </div>
                                        </DialogPanel>
                                    </TransitionChild>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                    : null
            }

            <Transition appear show={imageZoom} as={Fragment}>
                <Dialog as="div" open={imageZoom} onClose={() => setImageZoom(false)}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </TransitionChild>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full h-auto max-w-5xl my-8 text-black bg-white relative">
                                    <button type="button" className="focus-visible:outline-none text-dark hover:text-dark fill-dark absolute top-5 z-40 right-5" onClick={() => setImageZoom(false)}>
                                        <svg height="16" viewBox="0 0 329.26933 329" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_1828778"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"></path></svg>
                                    </button>
                                    <div className="overflow-hidden">
                                        <button className={`${imageScalePlus ? 'cursor-zoom-in' : 'cursor-zoom-out'} mx-auto w-full`}
                                        >
                                            <Image
                                                src={productimage ? productimage : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                                alt={isArabic ? productDataClassic?.data?.name_arabic : productDataClassic?.data?.name}
                                                title={isArabic ? productDataClassic?.data?.name_arabic : productDataClassic?.data?.name}
                                                height={650}
                                                width={650}
                                                loading='lazy'
                                                className={`mx-auto scale-${imageScale}`}
                                                style={{ ["scale" as any]: imageScale }}
                                            // style={{}`'scale': scale-${imageScale}`}
                                            />
                                        </button>


                                    </div>
                                    <div className="border-t border-[#5D686F26] p-3 flex gap-3">
                                        <button className={`focus-visible:outline-none rounded-md shadow-md bg-white w-16 md:w-24 p-1 hover:border-[#219EBC] ${productimage == NewMedia + productDataClassic?.data?.featured_image?.image ? "border-[#219EBC]" : "border-[#219EBC00]"}`}
                                            onClick={() => { setProductImage(NewMedia + productDataClassic?.data?.featured_image?.image), setImageScale(1) }}
                                        >
                                            <Image
                                                src={productDataClassic?.data?.featured_image ? NewMedia + productDataClassic?.data?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                                alt={`${isArabic ? productDataClassic?.data?.name_arabic : productDataClassic?.data?.name}featuredImage`}
                                                title={isArabic ? productDataClassic?.data?.name_arabic : productDataClassic?.data?.name}
                                                height={60}
                                                width={60}
                                                loading='lazy'
                                                className={`mx-auto ${productimage == NewMedia + productDataClassic?.data?.featured_image?.image ? "" : "opacity-70"} `}
                                            />
                                        </button>
                                        {productDataClassic?.data?.gallery?.slice(0, 9).map((item: any, i: any) => {
                                            return (
                                                <button key={i} className={`focus-visible:outline-none border rounded-md shadow-md bg-white w-16 md:w-24 p-1 hover:border-[#219EBC] ${productimage == NewMedia + item?.gallery_image?.image ? "border-[#219EBC]" : "border-[#219EBC00]"}`} onClick={() => { setProductImage(NewMedia + item?.gallery_image?.image) }}>
                                                    <Image
                                                        src={item?.gallery_image ? NewMedia + item?.gallery_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                                        alt={`${isArabic ? productDataClassic?.data?.name_arabic : productDataClassic?.data?.name}-${i + 100}`}
                                                        title={isArabic ? productDataClassic?.data?.name_arabic : productDataClassic?.data?.name}
                                                        height={60}
                                                        width={60}
                                                        loading='lazy'
                                                        className={`mx-auto ${productimage == NewMedia + item?.gallery_image?.image ? "" : "opacity-70"}`}
                                                    />
                                                </button>
                                            )
                                        })}
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <PickupStorePopup lang={lang} allStores={allStores} setModal={() => setIsOpenModal(false)} isOpenModal={isOpenModal} direction={direction} isArabic={lang == 'ar' ? true : false} />
        </>
    )
}