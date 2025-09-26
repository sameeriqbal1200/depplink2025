'use client'

import 'swiper/css'
import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import Swal from 'sweetalert2'
import { Media } from '../api/Api'
import { NewMedia } from '../api/Api'
import { get, post } from "../api/ApiCalls"
import { setCartItems } from '../cartstorage/cart'
import React, { useState, useEffect, Fragment, useContext } from 'react'
import withReactContent from 'sweetalert2-react-content'
import { usePathname } from "next/navigation"
import { useRouter } from 'next-nprogress-bar'
import { Dialog, Transition } from '@headlessui/react'
import { useUserAgent } from 'next-useragent'
// import { useDraggable } from "react-use-draggable-scroll";
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules';
// import LazyImage from './LazyImage';
import 'swiper/css/pagination';
import dynamic from 'next/dynamic'
import GlobalContext from '../GlobalContext';
const RatingComponent = dynamic(() => import('./ProductComponents/Rating'), { ssr: false })

export default function ProductSlider(props: any, request: any) {

    const router = useRouter()
    const path = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [loginPopup, setLoginPopup] = useState<any>(false)
    const [ProExtraData, setProExtraData] = useState<any>([])
    const [buyNowLoading, setBuyNowLoading] = useState<number>(0)
    const [ProWishlistData, setProWishlistData] = useState<any>([])
    const [ProData, setProData] = useState<any>(props?.products ? props?.products : [])
    const [extraData, setExtraData] = useState<any>([]);
    const [selectedGifts, setselectedGifts] = useState<any>({})
    const [allowed_gifts, setallowed_gifts] = useState(0)
    const [cartid, setcartid] = useState(false)
    const [cartkey, setcartkey] = useState(false)
    const [selectedProductId, setSelectedProductId] = useState<any>(false)
    const [selectedProductKey, setSelectedProductKey] = useState<any>(false)
    const [fbtProCheck, setfbtProCheck] = useState<any>({})
    const isArabic = props?.lang === 'ar';
    const { updateCompare, setUpdateCompare } = useContext(GlobalContext);
    const { updateWishlist, setUpdateWishlist } = useContext(GlobalContext);

    // CURRENCY SYMBOL //
    const currencySymbol = <svg className="riyal-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39" width="15" height="15">
        <path fill="currentColor" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"></path>
        <path fill="currentColor" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
    </svg>;

    useEffect(() => {
        if (props?.products) {
            setProData([...props?.products])
            extraproductdata()
        }
    }, [props.products])

    useEffect(() => {
        if (localStorage.getItem('userWishlist')) {
            var wdata: any = localStorage.getItem('userWishlist')
            setProWishlistData(JSON.parse(wdata))
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

    const refetch = () => {
        if (localStorage.getItem('userWishlist')) {
            var wdata: any = localStorage.getItem('userWishlist')
            setProWishlistData(JSON.parse(wdata))
        }
        else if (ProWishlistData.length) {
            setProWishlistData([])
        }
    }

    const extraproductdata = async () => {

        var a: number[] = []
        props.products.forEach((item: any) => {
            a.push(item.id)
        });

        await get(`productextradatamulti-regional-new/${a?.join(",")}/${localStorage.getItem("globalcity")}`).then((responseJson: any) => {
            const data = responseJson?.data;
            setProExtraData(data)

            if (data && typeof data === 'object') {
                const entries: any = Object.entries(data);
                const filteredEntries: any = entries.filter(([key, item]: any) => item.fbtdata !== false);
                if (filteredEntries.length > 0) {
                    const filteredData: any = filteredEntries.map(([key, item]: any) => ({ key, ...item }));
                    for (let index = 0; index < filteredData.length; index++) {
                        const element = filteredData[index];
                        if (element?.fbtdata?.show_on_thumbnail === 1) {
                            var newfbtdata = fbtProCheck
                            newfbtdata[element?.key] = true
                            setfbtProCheck({ ...newfbtdata })
                        }
                    }
                } else {
                    console.log('No objects have fbtdata not equal to false.');
                }
            } else {
                console.log('No valid data found.');
            }
        })

        if (localStorage.getItem("userid")) {
            // get(`checkmultiwishlistproduct/${a.join(",")}/${localStorage.getItem("userid")}`).then((responseJson: any) => {
            //     setProWishlistData(responseJson?.data)
            // })
            // get(`checkmulticompareproduct/${a.join(",")}/${localStorage.getItem("userid")}`).then((responseJson: any) => {
            //     setProComparetData(responseJson?.data)
            // })
        }
    }

    const WishlistProduct = (id: any, type: boolean) => {
        // var testing: any = ProWishlistData
        if (localStorage.getItem("userid")) {
            var data = {
                user_id: localStorage.getItem("userid"),
                product_id: id,
            }
            if (type) {
                post('removewishlist', data).then((responseJson: any) => {
                    if (responseJson?.success) {
                        // testing[id].wishlist = !type;
                        // setProWishlistData({ ...testing })
                        topMessageAlartDanger(props.dict?.wishlistRemovedText)
                        if (localStorage.getItem("wishlistCount")) {
                            var wishlistlength: any = localStorage.getItem('wishlistCount');
                            wishlistlength = parseInt(wishlistlength) - 1;
                            localStorage.setItem('wishlistCount', wishlistlength);
                        }
                        localStorage.removeItem('userWishlist')
                        setUpdateWishlist(updateWishlist == 0 ? 1 : 0)
                    }
                })
            } else {
                post('addwishlist', data).then((responseJson: any) => {
                    if (responseJson?.success) {
                        // testing[id].wishlist = !type;
                        // setProWishlistData({ ...testing })
                        topMessageAlartSuccess(props.dict?.wishlistAddedText)
                        if (localStorage.getItem("wishlistCount")) {
                            var wishlistlength: any = localStorage.getItem('wishlistCount');
                            wishlistlength = parseInt(wishlistlength) + 1;
                            localStorage.setItem('wishlistCount', wishlistlength);
                        }
                        localStorage.removeItem('userWishlist')
                        setUpdateWishlist(updateWishlist == 0 ? 1 : 0)
                    }
                })
            }

        } else {
            router.push(`/${props.lang}/login`);
        }
    }

    const MySwal = withReactContent(Swal);
    const topMessageAlartSuccess = (title: any, viewcart: boolean = false) => {
        MySwal.fire({
            icon: "success",
            title:
                <div className="text-xs">
                    <div className="uppercase">{title}</div>
                    {viewcart ?
                        <>
                            <p className="font-light mb-3">{props.lang == 'ar' ? 'تمت إضافة العنصر إلى سلة التسوق الخاصة بك.' : 'The item has been added into your cart.'}</p>
                            <button
                                onClick={() => {
                                    router.push(`/${props.lang}/cart`)
                                    router.refresh();
                                }}
                                className="focus-visible:outline-none mt-2 underline">
                                {props.lang == 'ar' ? 'عرض العربة' : 'View Cart'}
                            </button>
                        </>
                        : null}
                </div>
            ,
            toast: true,
            position: props.lang == 'ar' ? 'top-start' : 'top-end',
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


    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
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

    function CheckIconInActive(props: any) {
        return (
            <svg viewBox="0 0 24 24" fill="none" {...props}>
                <circle cx={12} cy={12} r={12} fill="#004B7A80" opacity="0.2" />
            </svg>
        )
    }

    const topMessageAlartDanger = (title: any) => {
        MySwal.fire({
            icon: "error",
            title:
                <div className="text-xs">
                    <div className="uppercase">{title}</div>
                </div>
            ,
            toast: true,
            position: props.lang == 'ar' ? 'top-start' : 'top-end',
            showConfirmButton: false,
            timer: 15000,
            showCloseButton: true,
            background: '#DC4E4E',
            color: '#FFFFFF',
            timerProgressBar: true
        });
    };

    const addToCart = (id: any, i: any, giftcheck = false) => {
        var discountpricevalue: any = 0;
        var addtionaldiscount: any = 0;
        var discounttype: any = 0;
        if (ProData[i]?.discounttypestatus == 1) {
            addtionaldiscount = ProData[i].discounttypestatus;
            discounttype = ProData[i].discountcondition;
            if (ProData[i].discountcondition === 1) {
                discountpricevalue = ProData[i].discountvalue;
            } else if (ProData[i].discountcondition == 2) {
                if (ProData[i].sale_price > 0) {
                    discountpricevalue = (ProData[i].sale_price / 100) * ProData[i].discountvalue;
                } else {
                    discountpricevalue = (ProData[i].price / 100) * ProData[i].discountvalue;
                }
                if (discountpricevalue > ProData[i].discountvaluecap) {
                    discountpricevalue = ProData[i].discountvaluecap;
                }
            } else if (ProData[i].discountcondition == 3) {
                if (ProData[i].pricetypevat == 0) {
                    discountpricevalue = ProData[i].sale_price - ((ProData[i].sale_price / 115) * 100);
                } else {
                    discountpricevalue = ProData[i].price - ((ProData[i].price / 115) * 100);
                }
            }
        }
        var flashCalc = ProExtraData[id]?.flash ? ProExtraData[id]?.flash?.discount_type === 2 ? Math.round(ProData[i]?.sale_price * ProExtraData[id]?.flash?.discount_amount / 100) : ProExtraData[id]?.flash?.discount_amount : ProData[i]?.sale_price
        setBuyNowLoading(id);
        setSelectedProductId(id)
        setSelectedProductKey(i)
        setExtraData(ProExtraData[id])

        if (ProExtraData[id]?.freegiftData?.freegiftlist?.length == ProExtraData[id]?.freegiftData?.allowed_gifts && ProExtraData[id]?.freegiftData?.freegiftlist?.filter((e: any) => e?.discount > 0)?.length <= 0) {
            var item: any = {
                id: ProData[i].id,
                sku: ProData[i].sku,
                name: ProData[i].name,
                name_arabic: ProData[i].name_arabic,
                image: ProData[i]?.featured_image ? NewMedia + ProData[i]?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
                price: flashCalc ? flashCalc : ProData[i].sale_price ? ProData[i].sale_price : ProData[i].price,
                regular_price: ProData[i].price,
                quantity: 1,
                total_quantity: ProData[i].quantity,
                brand: ProData[i]?.brand,
                slug: ProData[i]?.slug,
                pre_order: ProData[i]?.pre_order,
                pre_order_day: ProData[i]?.pre_order != null ? ProData[i]?.no_of_days : false,
                discounted_amount: discountpricevalue,
                discounttype: discounttype,
                addtionaldiscount: addtionaldiscount,
            }
            var gifts: any = false
            if (ProExtraData[id]?.freegiftData) {
                gifts = []
                for (let index = 0; index < ProExtraData[id]?.freegiftData?.freegiftlist?.length; index++) {
                    const element = ProExtraData[id]?.freegiftData?.freegiftlist[index]; var amount = 0
                    if (ProExtraData[id]?.freegiftData?.discount_type == 2) {
                        var fgprice = element?.productdetail?.sale_price ? element?.productdetail?.sale_price : element?.productdetail?.price;
                        fgprice -= (element?.discount * fgprice) / 100;
                    }
                    else if (ProExtraData[id]?.freegiftData?.discount_type == 3)
                        amount = element.discount
                    var giftitem: any = {
                        id: element.productdetail.id,
                        sku: element.productdetail.sku,
                        name: element.productdetail.name,
                        name_arabic: element.productdetail.name_arabic,
                        image: element.productdetail?.featured_image ? NewMedia + element.productdetail?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
                        price: element.productdetail.sale_price ? element.productdetail.sale_price : element.productdetail.price,
                        regular_price: element.productdetail.price,
                        quantity: 1,
                        gift_id: ProExtraData[id]?.freegiftData?.id,
                        discounted_amount: amount,
                        slug: element.productdetail?.slug,
                        pre_order: 0,
                        pre_order_day: false
                    }
                    gifts.push(giftitem)
                }
            }
            var fbt: any = false
            if (fbtProCheck[id]) {
                var fbt: any = []
                for (let index = 0; index < ProExtraData[id]?.fbtdata?.fbtlist?.length; index++) {
                    const element = ProExtraData[id]?.fbtdata?.fbtlist[index];
                    if (index == 0) {
                        var fbtprice: number = element.productdetail.sale_price ? element.productdetail.sale_price : element.productdetail.price
                        if (ProExtraData[id]?.fbtdata?.discount_type == 1) {
                            fbtprice -= (element?.discount * fbtprice) / 100;
                        } else {
                            // fbtprice = element?.discount;
                            // amount type
                            if (ProExtraData[id]?.fbtdata?.amount_type == 1) {
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
                            quantity: 1,
                            fbt_id: ProExtraData[id]?.fbtdata?.id,
                            discounted_amount: fbtprice,
                            total_quantity: element.productdetail.quantity,
                            slug: element.productdetail?.slug,
                            pre_order: 0,
                            pre_order_day: false
                        }
                        fbt.push(fbtitem)
                    }
                }
            }

            setCartItems(item, gifts, fbt)
            topMessageAlartSuccess(props.dict?.productCart, true)
            setBuyNowLoading(0);
            return false;
        }
        if (ProExtraData[id]?.freegiftData && giftcheck) {
            setExtraData(ProExtraData[id])
            setallowed_gifts(ProExtraData[id]?.freegiftData?.allowed_gifts)
            openModal()
            setBuyNowLoading(0);
            setselectedGifts({})
            setcartid(id)
            setcartkey(i)
            return false
        } else {
            var item: any = {
                id: ProData[i].id,
                sku: ProData[i].sku,
                name: ProData[i].name,
                name_arabic: ProData[i].name_arabic,
                image: ProData[i]?.featured_image ? NewMedia + ProData[i]?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
                price: flashCalc ? flashCalc : ProData[i].sale_price ? ProData[i].sale_price : ProData[i].price,
                regular_price: ProData[i].price,
                quantity: 1,
                total_quantity: ProData[i].quantity,
                brand: ProData[i]?.brand,
                slug: ProData[i]?.slug,
                pre_order: ProData[i]?.pre_order,
                pre_order_day: ProData[i]?.pre_order != null ? ProData[i]?.no_of_days : false,
                discounted_amount: discountpricevalue,
                discounttype: discounttype,
                addtionaldiscount: addtionaldiscount,
            }
            var gifts: any = false
            if (ProExtraData[id]?.freegiftData) {
                if (Object.keys(selectedGifts).length > 0) {
                    gifts = []
                    for (let index = 0; index < extraData?.freegiftData?.freegiftlist?.length; index++) {
                        const element = extraData?.freegiftData?.freegiftlist[index];
                        if (selectedGifts[element.id]) {
                            var amount = 0
                            if (extraData?.freegiftData?.discount_type == 2) {
                                var fgprice = element?.productdetail?.sale_price ? element?.productdetail?.sale_price : element?.productdetail?.price;
                                fgprice -= (element?.discount * fgprice) / 100;
                            }
                            else if (extraData?.freegiftData?.discount_type == 3)
                                amount = element.discount
                            var giftitem: any = {
                                id: element.productdetail.id,
                                sku: element.productdetail.sku,
                                name: element.productdetail.name,
                                name_arabic: element.productdetail.name_arabic,
                                image: element.productdetail?.featured_image ? NewMedia + element.productdetail?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
                                price: element.productdetail.sale_price ? element.productdetail.sale_price : element.productdetail.price,
                                regular_price: element.productdetail.price,
                                quantity: 1,
                                gift_id: extraData?.freegiftData?.id,
                                discounted_amount: amount,
                                slug: element.productdetail?.slug,
                                pre_order: 0,
                                pre_order_day: false
                            }
                            gifts.push(giftitem)
                        }
                    }
                }
            }
            closeModal()
            var fbt: any = false
            if (fbtProCheck[id]) {
                var fbt: any = []
                for (let index = 0; index < ProExtraData[id]?.fbtdata?.fbtlist?.length; index++) {
                    const element = ProExtraData[id]?.fbtdata?.fbtlist[index];
                    if (index == 0) {
                        var fbtprice: number = element.productdetail.sale_price ? element.productdetail.sale_price : element.productdetail.price
                        if (ProExtraData[id]?.fbtdata?.discount_type == 1) {
                            fbtprice -= (element?.discount * fbtprice) / 100;
                        } else {
                            // fbtprice = element?.discount;
                            // amount type
                            if (ProExtraData[id]?.fbtdata?.amount_type == 1) {
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
                            quantity: 1,
                            fbt_id: ProExtraData[id]?.fbtdata?.id,
                            discounted_amount: fbtprice,
                            total_quantity: element.productdetail.quantity,
                            slug: element.productdetail?.slug,
                            pre_order: 0,
                            pre_order_day: false
                        }
                        fbt.push(fbtitem)
                    }
                }
            }

            setCartItems(item, gifts, fbt)
            topMessageAlartSuccess(props.dict?.productCart, true)
            setBuyNowLoading(0);
        }
    }

    const singleAddToCart = (id: any, i: any, giftcheck = false) => {
        var discountpricevalue: any = 0;
        var addtionaldiscount: any = 0;
        var discounttype: any = 0;
        if (ProData[i]?.discounttypestatus == 1) {
            addtionaldiscount = ProData[i].discounttypestatus;
            discounttype = ProData[i].discountcondition;
            if (ProData[i].discountcondition === 1) {
                discountpricevalue = ProData[i].discountvalue;
            } else if (ProData[i].discountcondition == 2) {
                if (ProData[i].sale_price > 0) {
                    discountpricevalue = (ProData[i].sale_price / 100) * ProData[i].discountvalue;
                } else {
                    discountpricevalue = (ProData[i].price / 100) * ProData[i].discountvalue;
                }
                if (discountpricevalue > ProData[i].discountvaluecap) {
                    discountpricevalue = ProData[i].discountvaluecap;
                }
            } else if (ProData[i].discountcondition == 3) {
                if (ProData[i].pricetypevat == 0) {
                    discountpricevalue = ProData[i].sale_price - ((ProData[i].sale_price / 115) * 100);
                } else {
                    discountpricevalue = ProData[i].price - ((ProData[i].price / 115) * 100);
                }
            }
        }
        closeModal()
        var flashCalc = ProExtraData[id]?.flash ? ProExtraData[id]?.flash?.discount_type === 2 ? Math.round(ProData[i]?.sale_price * ProExtraData[id]?.flash?.discount_amount / 100) : ProExtraData[id]?.flash?.discount_amount : ProData[i]?.sale_price
        var item: any = {
            id: ProData[i].id,
            sku: ProData[i].sku,
            name: ProData[i].name,
            name_arabic: ProData[i].name_arabic,
            image: ProData[i]?.featured_image ? NewMedia + ProData[i]?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
            price: flashCalc ? flashCalc : ProData[i].sale_price ? ProData[i].sale_price : ProData[i].price,
            regular_price: ProData[i].price,
            quantity: 1,
            total_quantity: ProData[i].quantity,
            brand: ProData[i]?.brand,
            slug: ProData[i]?.slug,
            pre_order: ProData[i]?.pre_order,
            pre_order_day: ProData[i]?.pre_order != null ? ProData[i]?.no_of_days : false,
            discounted_amount: discountpricevalue,
            discounttype: discounttype,
            addtionaldiscount: addtionaldiscount,
        }
        var gifts: any = false
        var fbt: any = false
        if (fbtProCheck[id]) {
            var fbt: any = []
            for (let index = 0; index < ProExtraData[id]?.fbtdata?.fbtlist?.length; index++) {
                const element = ProExtraData[id]?.fbtdata?.fbtlist[index];
                if (index == 0) {
                    var fbtprice: number = element.productdetail.sale_price ? element.productdetail.sale_price : element.productdetail.price
                    if (ProExtraData[id]?.fbtdata?.discount_type == 1) {
                        fbtprice -= (element?.discount * fbtprice) / 100;
                    } else {
                        // fbtprice = element?.discount;
                        // amount type
                        if (ProExtraData[id]?.fbtdata?.amount_type == 1) {
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
                        quantity: 1,
                        fbt_id: ProExtraData[id]?.fbtdata?.id,
                        discounted_amount: fbtprice,
                        total_quantity: element.productdetail.quantity,
                        slug: element.productdetail?.slug,
                        pre_order: 0,
                        pre_order_day: false
                    }
                    fbt.push(fbtitem)
                }
            }
        }

        setCartItems(item, gifts, fbt)
        topMessageAlartSuccess(props.dict?.productCart, true)
        setBuyNowLoading(0);
    }
    const origin =
        typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : '';

    const userAgent: any =
        typeof window !== 'undefined' && window.location.origin
            ? useUserAgent(window.navigator.userAgent)
            : false;


    // const ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
    // const { events } = useDraggable(ref,
    //     {
    //         decayRate: 0.98,
    //         safeDisplacement: 12,
    //         applyRubberBandEffect: true,
    //     });
    // const handleNav = (direction: any) => {
    //     if (direction === 'left') {
    //         ref ? (ref.current.scrollLeft -= 380) : null;
    //     } else {
    //         ref ? (ref.current.scrollLeft += 380) : null;
    //     }
    // }

    return (
        <>
            <div className='align__center font-bold mb-2'>
                <h2 className='text-base'>{props?.titleSlider}</h2>
                <div className='flex items-center gap-3'>
                    <Link
                        href={props?.hrefLink ? props?.hrefLink : "#"}
                        className='text-[#219EBC] hover:underline text-sm'>
                        {props.lang == 'ar' ? 'عـرض الكــل' : 'Show All'}
                    </Link>
                    <div className="flex gap-2">
                        <button aria-label="Previous" className={`${props.lang == 'ar' ? 'rotate-180' : null} cursor-pointer fill-dark arrow-right arrow p-2 bg-dark/20 rounded-md`}>
                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className="fill-current transform transition duration-150 ease-in-out rotate-90"><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                        </button>
                        <button aria-label="Next" className={`${props.lang == 'ar' ? 'rotate-180' : null} cursor-pointer fill-dark arrow-left arrow p-2 bg-dark/20 rounded-md`}>
                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className="fill-current transform transition duration-150 ease-in-out -rotate-90"><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="relative pb-2">
                <Swiper
                    spaceBetween={10}
                    slidesPerView={5.5}
                    // autoHeight={true}
                    breakpoints={{
                        320: {
                            slidesPerView: 1.7,
                            spaceBetween: 10,
                        },
                        640: {
                            slidesPerView: 1.8,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 3.5,
                            spaceBetween: 10,
                        },
                        1024: {
                            slidesPerView: 4.8,
                            spaceBetween: 10,
                        },
                        1650: {
                            slidesPerView: 5,
                            spaceBetween: 10,
                        },
                        1920: {
                            slidesPerView: 6,
                            spaceBetween: 10,
                        },
                    }}
                    centeredSlides={false}
                    pagination={false}
                    loop={true}
                    modules={[Navigation, Pagination]}
                    navigation={{ nextEl: `.arrow-left`, prevEl: ".arrow-right" }}
                    className="mySwiper !grid !pb-2"
                >
                    {props?.products?.map((data: any, i: any) => {

                        var d1 = dayjs(data.created_at.split('T')[0]).format('YYYY-MM-DD')
                        var d2 = dayjs().format('YYYY-MM-DD')
                        var flashCalc = ProExtraData[data?.id]?.flash ? ProExtraData[data?.id]?.flash?.discount_type === 2 ? Math.round(data?.sale_price * ProExtraData[data?.id]?.flash?.discount_amount / 100) : ProExtraData[data?.id]?.flash?.discount_amount : data.sale_price
                        var checkQty = false
                        if (typeof window !== 'undefined' && localStorage.getItem('cartData')) {
                            var cartdata;
                            var d: any = localStorage.getItem('cartData')
                            var decodedata = Buffer.from(d, 'base64').toString("utf-8")
                            cartdata = JSON.parse(decodedata);
                            if (cartdata?.products?.length) {
                                var cartPro = cartdata?.products?.filter((item: { sku: any; }) => item.sku == data?.sku)[0]
                                if (cartPro?.quantity == data?.quantity) {
                                    checkQty = true
                                }
                            }
                        }
                        const vatOnUs = data?.vatonuspromo === 1 ? true : false;
                        return (
                            <SwiperSlide className="bg-white relative p-1 md:p-2 rounded-lg shadow-md cursor-pointer !h-full self-stretch" key={i} >
                                {/* <div className=""> */}
                                {/* flex-initial basis-1/3 sm:basis-40 md:basis-48 lg:basis-60 xl:basis-64 shrink-0 */}
                                <Link
                                    href={`${origin}/${props.lang}/product/${data.slug}`} as={`${origin}/${props.lang}/product/${data.slug}`}
                                    aria-label={props.lang == 'ar' ? data?.name_arabic : data?.name}
                                >
                                    {props?.devicetype === 'mobile' ? null
                                        :
                                        ProExtraData[data?.id]?.expressdeliveryData ?
                                            <div className="absolute z-10 top-1 ltr:left-3 rtl:right-3">
                                                <Image
                                                    src={props?.lang == 'ar' ? "/icons/express_logo/express_logo_ar.png" : "/icons/express_logo/express_logo_en.png"}
                                                    width="65" height="0" alt="express_delivery" title='Express Delivery'
                                                />
                                            </div>
                                            :
                                            dayjs(d2).diff(d1, 'days') <= data.newtype ?
                                                <div className='text-[#20831E] text-[0.55rem] lg:text-xs absolute ltr:left-0 rtl:right-0 top-0 bg-[#20831E20] md:px-3.5 px-2 py-1 rtl:rounded-bl-lg rtl:rounded-tr-lg ltr:rounded-br-lg ltr:rounded-tl-lg z-10'>{props.lang == 'ar' ? 'جديد' : 'New'}</div>
                                                : data.best_seller == 1 ?
                                                    <div className='text-[#20831E] text-[0.55rem] lg:text-xs absolute ltr:left-0 rtl:right-0 top-0 bg-[#20831E20] md:px-3.5 px-2 py-1 rtl:rounded-bl-lg rtl:rounded-tr-lg ltr:rounded-br-lg ltr:rounded-tl-lg z-10'>{props.lang == 'ar' ? 'أكثر مبيعا' : 'Selling Out Fast'}</div>
                                                    : data.top_selling == 2 ?
                                                        <div className='text-[#0B5ED8] text-[0.55rem] lg:text-xs absolute ltr:left-0 rtl:right-0 top-0 bg-[#0B5ED820] md:px-3.5 px-2 py-1 rtl:rounded-bl-lg rtl:rounded-tr-lg ltr:rounded-br-lg ltr:rounded-tl-lg z-10'>{props.lang == 'ar' ? 'أكثر مبيعا' : 'Top Selling'}</div>
                                                        : data.low_in_stock == 3 ?
                                                            <div className='text-[#F0660C] text-[0.55rem] lg:text-xs absolute ltr:left-0 rtl:right-0 top-0 bg-[#F0660C20] md:px-3.5 px-2 py-1 rtl:rounded-bl-lg rtl:rounded-tr-lg ltr:rounded-br-lg ltr:rounded-tl-lg z-10'>{props.lang == 'ar' ? 'كمية محدودة' : 'Low in Stock'}</div>
                                                            : null

                                    }
                                    {data?.custom_badge_en || data?.custom_badge_ar ?
                                        <>
                                            <div className='text-[#EA4335] text-[0.55rem] md:text-xs absolute ltr:right-0 rtl:left-0 top-0 bg-[#EA433520] md:px-3.5 px-2 py-1 rtl:rounded-tl-lg rtl:rounded-br-lg ltr:rounded-bl-lg ltr:rounded-tr-lg z-20'>
                                                {props?.lang == 'ar' ? data?.custom_badge_ar : data?.custom_badge_en}
                                            </div>

                                        </>
                                        :
                                        <>
                                            {data?.sale_price ?
                                                <div className='text-[#EA4335] text-[0.55rem] md:text-xs absolute ltr:right-0 rtl:left-0 top-0 bg-[#EA433520] md:px-3.5 px-2 py-1 rtl:rounded-tl-lg rtl:rounded-br-lg ltr:rounded-bl-lg ltr:rounded-tr-lg z-20 flex gap-x-1 items-center'>
                                                    {data?.savetype == 1 ?
                                                        props.lang == 'ar' ? 'خصم %' +
                                                            Math.round(((data.price - flashCalc) * 100) / data.price) : 'OFF ' + Math.round(((data.price - flashCalc) * 100) / data.price) + ' %'
                                                        :
                                                        props.lang == 'ar' ? 'وفر '  + currencySymbol  + (data.price - flashCalc).toLocaleString('EN-US'): 'Save ' + currencySymbol + (data.price - flashCalc).toLocaleString('EN-US')
                                                    }
                                                </div>
                                                : null}
                                        </>
                                    }
                                    <div className='relative'>
                                        <Image
                                            src={data?.featured_image ? Media + data?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                            alt={props?.lang == 'ar' ? data?.name_arabic : data?.name}
                                            title={props?.lang == 'ar' ? data?.name_arabic : data?.name}
                                            height={props?.devicetype === 'mobile' ? 150 : 260}
                                            width={props?.devicetype === 'mobile' ? 150 : 260}
                                            loading='lazy'
                                            className='mx-auto z-1'
                                        />
                                        <small className="text-xs line-clamp-1 ltr:text-left rtl:text-right">{data?.sku}</small>
                                    </div>
                                    <h2 className='text-primary font-semibold md:text-sm line-clamp-2 text-xs'>{props?.lang == 'ar' ? data?.name_arabic : data?.name}</h2>
                                    <div className='text-primary text-xs flex items-center gap-x-2 max-md:mt-1'>
                                        <span>{props.lang == 'ar' ? "العلامة" : "Brand"}:</span>
                                        {data?.brand?.brand_media_image ?
                                            <Image
                                                src={data?.brand?.brand_media_image ? NewMedia + data?.brand?.brand_media_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                                alt={props?.lang == 'ar' ? data?.brand?.name_arabic : data?.brand?.name}
                                                title={props?.lang == 'ar' ? data?.brand?.name_arabic : data?.brand?.name}
                                                height={0}
                                                width={0}
                                                loading='lazy'
                                                className="h-auto w-14 sm:w-20"
                                            />
                                            :
                                            <p className="text-[#004B7A] text-xs">{props?.lang == 'ar' ? data?.brand?.name_arabic : data?.brand?.name}</p>
                                        }
                                    </div>
                                    <RatingComponent rating={data?.rating} totalRating={data?.totalrating} className={''} />
                                    <div className='md:flex md:items-end md:gap-x-2 mt-2.5 md:mt-1.5 ltr:text-left rtl:text-right'>
                                        {vatOnUs ?
                                            <>
                                                <p className='font-bold text-lg lg:text-xl text-[#DC4E4E] max-sm:leading-3 flex gap-x-1 items-center'>
                                                    {ProExtraData[data?.id]?.flash && data?.sale_price ?
                                                        ProExtraData[data?.id]?.flash?.discount_type === 2 ? Math.round(data?.sale_price * ProExtraData[data?.id]?.flash?.discount_amount / 100).toLocaleString('EN-US') :
                                                            ProExtraData[data?.id]?.flash?.discount_amount :
                                                        data?.sale_price ? Math.round((data?.sale_price / 115) * 100).toLocaleString('EN-US') : data?.price.toLocaleString('EN-US')}
                                                        {currencySymbol}
                                                </p>
                                            </>
                                            :
                                            <>
                                                <p className='font-bold text-lg lg:text-xl text-[#DC4E4E] max-sm:leading-3 flex gap-x-1 items-center'>
                                                    {ProExtraData[data?.id]?.flash && data?.sale_price ?
                                                        ProExtraData[data?.id]?.flash?.discount_type === 2 ? Math.round(data?.sale_price * ProExtraData[data?.id]?.flash?.discount_amount / 100).toLocaleString('EN-US') :
                                                            ProExtraData[data?.id]?.flash?.discount_amount :
                                                        data?.sale_price ? data?.sale_price.toLocaleString('EN-US') : data?.price.toLocaleString('EN-US')}
                                                        {currencySymbol}
                                                </p>
                                            </>
                                        }
                                        {ProExtraData && Object.keys(ProExtraData).length > 0 && data?.sale_price && (
                                            <small className='text-xs md:text-sm font-medium text-[#5D686F] line-through decoration-[#DC4E4E] decoration-2 decoration'>
                                                {(() => {
                                                    const flashData = ProExtraData[data?.id]?.flash;
                                                    const price = data?.price;

                                                    if (flashData && price && !data?.sale_price) {
                                                        return flashData.discount_type === 2
                                                            ? Math.round(price * flashData.discount_amount / 100).toLocaleString('EN-US')
                                                            : flashData.discount_amount;
                                                    }
                                                    return price.toLocaleString('EN-US');
                                                })()}
                                            </small>
                                        )}
                                    </div>
                                    {vatOnUs ?
                                        <p className="text-[#DC4E4E] text-xs mt-0.5 font-bold animationImp">{isArabic ? 'السعر بعد خصم الضريبة علينا' : 'Price exclusive VAT'}</p>
                                        :
                                        null
                                    }
                                    {props?.devicetype === 'mobile' ?
                                        (ProExtraData[data?.id]?.expressdeliveryData ?
                                            <Image
                                                src={props?.lang == 'ar' ? "/icons/express_logo/Express_ar_48.webp" : "/icons/express_logo/Express_en_48.webp"}
                                                width='0' height="0" alt="express_delivery" title='Express Delivery' className='my-2 w-full'
                                            /> : null)
                                        : null}
                                    {ProExtraData[data?.id]?.freegiftData ?
                                        <div className='flex items-end gap-1 md:gap-2 md:mt-2 mt-1'>
                                            <svg id="fi_3850991" enableBackground="new 0 0 512 512" height="16" viewBox="0 0 512 512" width="16" fill="#219EBC" xmlns="http://www.w3.org/2000/svg"><g><path d="m359.42 20.97c13.36-8.94 29.92-6.83 38.21.38 3.59 3.13 7.1 8.46 3.4 16.1-7.77 16.12-24.32 26.53-42.14 26.53h-51.02c2.4 6.2 3.73 12.93 3.73 19.97 0 6.27-1.06 12.3-2.98 17.93h119.99c8-15.2 8.58-32.65 1.45-48.64l-14.62-32.82c-1.71-3.8-4.33-7.34-7.89-10.44-12.42-10.78-36.42-14.98-56.52-1.54l-55.1 36.89c3.5 3.62 6.52 7.7 8.94 12.15z"></path><path d="m203.4 101.87c-1.92-5.63-2.98-11.66-2.98-17.93 0-7.04 1.33-13.77 3.73-19.97h-50.99c-17.82 0-34.37-10.42-42.18-26.54-3.7-7.63-.19-12.96 3.41-16.08 4.46-3.88 11.31-6.28 18.77-6.28 6.41 0 13.26 1.77 19.43 5.9l54.54 36.51c2.42-4.46 5.45-8.54 8.94-12.15l-55.1-36.89c-20.1-13.44-44.1-9.24-56.49 1.54-3.97 3.45-6.79 7.44-8.45 11.74l-14.07 31.51c-7.14 15.99-6.56 33.44 1.45 48.64z"></path><path d="m219.67 101.87h72.65c2.68-5.41 4.2-11.5 4.2-17.93 0-22.33-18.2-40.53-40.53-40.53s-40.53 18.2-40.53 40.53c.01 6.44 1.53 12.52 4.21 17.93z"></path><path d="m16.2 148.65v49.55c0 14.89 10.32 27.41 24.17 30.8h187.69v-112.07h-180.15c-17.48 0-31.71 14.23-31.71 31.72z"></path><path d="m40.38 469.91c0 23.21 18.88 42.09 42.09 42.09h145.6v-267.95h-187.69z"></path><path d="m464.09 116.93h-180.13v112.06h187.66c13.86-3.39 24.17-15.91 24.17-30.8v-49.55c.01-17.48-14.22-31.71-31.7-31.71z"></path><path d="m283.96 512h145.57c23.21 0 42.09-18.88 42.09-42.09v-225.86h-187.66z"></path></g></svg>
                                            <div className='text-xs font-regular'>
                                                {props.lang == 'ar' ? "يوجد هدية مع الـمنتج" : "With Free Gift"}
                                            </div>
                                        </div>
                                        :
                                        null
                                    }
                                    {data?.short_description ?
                                        <>
                                            <Image
                                                src={data?.short_description}
                                                alt={props.lang == 'ar' ? data?.name_arabic : data?.name}
                                                title={props.lang == 'ar' ? data?.name_arabic : data?.name}
                                                height={0}
                                                width={0}
                                                loading='lazy'
                                                className="w-auto md:w-[60%] h-auto mt-2 rounded-md"
                                            />
                                        </>
                                        :
                                        null
                                    }
                                    {ProExtraData[data?.id]?.badgeData ?
                                        <Image
                                            src={ProExtraData[data?.id]?.badgeData?.badge_slider ? NewMedia + ProExtraData[data?.id]?.badgeData?.badge_slider?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                            alt={props?.lang == 'ar' ? ProExtraData[data?.id]?.badgeData?.badge_slider?.title_arabic : ProExtraData[data?.id]?.badgeData?.badge_slider?.title}
                                            title={props?.lang == 'ar' ? ProExtraData[data?.id]?.badgeData?.badge_slider?.title_arabic : ProExtraData[data?.id]?.badgeData?.badge_slider?.title}
                                            height={0}
                                            width={0}
                                            loading='lazy'
                                            className="w-auto h-auto mt-2 rounded-md"
                                        />
                                        :
                                        null
                                    }
                                </Link>
                                <div className='align__center mt-3.5 gap-x-2'>
                                    {data?.pre_order == 1 ?
                                        <>
                                            <button className='bg-primary focus-visible:outline-none text-white flex items-center justify-center px-1 py-2 gap-x-1 rounded-md md:h-10 h-8 w-full'
                                                aria-label={props.lang == 'ar' ? "اضـافـة الـي العـربــة" : "Add to Cart"}
                                                disabled={data?.quantity == 0 || data?.quantity == null ? true : false || checkQty} onClick={() => addToCart(data.id, i, true)}
                                            >
                                                {buyNowLoading == data?.id ?
                                                    <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 mr-3 fill-white" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg>
                                                    :
                                                    <>
                                                        <svg id="fi_3144456" enableBackground="new 0 0 511.728 511.728" height="18" viewBox="0 0 511.728 511.728" width="18" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF">
                                                            <path d="m147.925 379.116c-22.357-1.142-21.936-32.588-.001-33.68 62.135.216 226.021.058 290.132.103 17.535 0 32.537-11.933 36.481-29.017l36.404-157.641c2.085-9.026-.019-18.368-5.771-25.629s-14.363-11.484-23.626-11.484c-25.791 0-244.716-.991-356.849-1.438l-17.775-65.953c-4.267-15.761-18.65-26.768-34.978-26.768h-56.942c-8.284 0-15 6.716-15 15s6.716 15 15 15h56.942c2.811 0 5.286 1.895 6.017 4.592l68.265 253.276c-12.003.436-23.183 5.318-31.661 13.92-8.908 9.04-13.692 21.006-13.471 33.695.442 25.377 21.451 46.023 46.833 46.023h21.872c-3.251 6.824-5.076 14.453-5.076 22.501 0 28.95 23.552 52.502 52.502 52.502s52.502-23.552 52.502-52.502c0-8.049-1.826-15.677-5.077-22.501h94.716c-3.248 6.822-5.073 14.447-5.073 22.493 0 28.95 23.553 52.502 52.502 52.502 28.95 0 52.503-23.553 52.503-52.502 0-8.359-1.974-16.263-5.464-23.285 5.936-1.999 10.216-7.598 10.216-14.207 0-8.284-6.716-15-15-15zm91.799 52.501c0 12.408-10.094 22.502-22.502 22.502s-22.502-10.094-22.502-22.502c0-12.401 10.084-22.491 22.483-22.501h.038c12.399.01 22.483 10.1 22.483 22.501zm167.07 22.494c-12.407 0-22.502-10.095-22.502-22.502 0-12.285 9.898-22.296 22.137-22.493h.731c12.24.197 22.138 10.208 22.138 22.493-.001 12.407-10.096 22.502-22.504 22.502zm74.86-302.233c.089.112.076.165.057.251l-15.339 66.425h-51.942l8.845-67.023 58.149.234c.089.002.142.002.23.113zm-154.645 163.66v-66.984h53.202l-8.84 66.984zm-74.382 0-8.912-66.984h53.294v66.984zm-69.053 0h-.047c-3.656-.001-6.877-2.467-7.828-5.98l-16.442-61.004h54.193l8.912 66.984zm56.149-96.983-9.021-67.799 66.306.267v67.532zm87.286 0v-67.411l66.022.266-8.861 67.145zm-126.588-67.922 9.037 67.921h-58.287l-18.38-68.194zm237.635 164.905h-36.426l8.84-66.984h48.973l-14.137 61.217c-.784 3.396-3.765 5.767-7.25 5.767z"></path>
                                                        </svg>
                                                        <div className='text-[0.65rem] font-semibold max-md:hidden'>
                                                            {props.lang == 'ar' ? 'اضف الي العربة' : 'Pre Order'}</div>
                                                    </>
                                                }
                                            </button>
                                        </>
                                        :
                                        <button className={`focus-visible:outline-none text-white flex items-center justify-center px-1 py-2 gap-x-1 rounded-md md:h-10 h-8 w-full ${data?.quantity == 0 || data?.quantity == null ? true : false || checkQty ? 'bg-primary/50' : 'bg-primary'}`}
                                            aria-label={props.lang == 'ar' ? "اضـافـة الـي العـربــة" : "Pre Order"}
                                            disabled={data?.quantity == 0 || data?.quantity == null ? true : false || checkQty}
                                            onClick={() => addToCart(data.id, i, true)}
                                        >
                                            {buyNowLoading == data?.id ?
                                                <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 mr-3 fill-white" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg>
                                                :
                                                <>
                                                    <svg id="fi_3144456" enableBackground="new 0 0 511.728 511.728" height="18" viewBox="0 0 511.728 511.728" width="18" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF">
                                                        <path d="m147.925 379.116c-22.357-1.142-21.936-32.588-.001-33.68 62.135.216 226.021.058 290.132.103 17.535 0 32.537-11.933 36.481-29.017l36.404-157.641c2.085-9.026-.019-18.368-5.771-25.629s-14.363-11.484-23.626-11.484c-25.791 0-244.716-.991-356.849-1.438l-17.775-65.953c-4.267-15.761-18.65-26.768-34.978-26.768h-56.942c-8.284 0-15 6.716-15 15s6.716 15 15 15h56.942c2.811 0 5.286 1.895 6.017 4.592l68.265 253.276c-12.003.436-23.183 5.318-31.661 13.92-8.908 9.04-13.692 21.006-13.471 33.695.442 25.377 21.451 46.023 46.833 46.023h21.872c-3.251 6.824-5.076 14.453-5.076 22.501 0 28.95 23.552 52.502 52.502 52.502s52.502-23.552 52.502-52.502c0-8.049-1.826-15.677-5.077-22.501h94.716c-3.248 6.822-5.073 14.447-5.073 22.493 0 28.95 23.553 52.502 52.502 52.502 28.95 0 52.503-23.553 52.503-52.502 0-8.359-1.974-16.263-5.464-23.285 5.936-1.999 10.216-7.598 10.216-14.207 0-8.284-6.716-15-15-15zm91.799 52.501c0 12.408-10.094 22.502-22.502 22.502s-22.502-10.094-22.502-22.502c0-12.401 10.084-22.491 22.483-22.501h.038c12.399.01 22.483 10.1 22.483 22.501zm167.07 22.494c-12.407 0-22.502-10.095-22.502-22.502 0-12.285 9.898-22.296 22.137-22.493h.731c12.24.197 22.138 10.208 22.138 22.493-.001 12.407-10.096 22.502-22.504 22.502zm74.86-302.233c.089.112.076.165.057.251l-15.339 66.425h-51.942l8.845-67.023 58.149.234c.089.002.142.002.23.113zm-154.645 163.66v-66.984h53.202l-8.84 66.984zm-74.382 0-8.912-66.984h53.294v66.984zm-69.053 0h-.047c-3.656-.001-6.877-2.467-7.828-5.98l-16.442-61.004h54.193l8.912 66.984zm56.149-96.983-9.021-67.799 66.306.267v67.532zm87.286 0v-67.411l66.022.266-8.861 67.145zm-126.588-67.922 9.037 67.921h-58.287l-18.38-68.194zm237.635 164.905h-36.426l8.84-66.984h48.973l-14.137 61.217c-.784 3.396-3.765 5.767-7.25 5.767z"></path>
                                                    </svg>
                                                    <div className='text-xs  font-semibold max-md:hidden'>
                                                        {props.lang == 'ar' ? "اضـافـة الـي العـربــة" : "Add to Cart"}
                                                    </div>
                                                </>
                                            }
                                        </button>
                                    }
                                    <button onClick={(e: any) => {
                                        var type: boolean = ProWishlistData.filter((item: any) => item == data?.id).length >= 1;
                                        WishlistProduct(data?.id, type)
                                    }} className={`focus-visible:outline-none ${ProWishlistData.filter((item: any) => item == data?.id).length >= 1 ? "bg-[#DC4E4E] fill-white border-[#DC4E4E]" : "border-primary fill-primary"}  border md:h-10 h-8 px-2 md:px-3 rounded-md hover:fill-white hover:bg-[#DC4E4E] hover:border-[#DC4E4E]`} aria-label="add to wishlist">
                                        {ProWishlistData.filter((item: any) => item == data?.id).length >= 1 ?
                                            <svg id="fi_4240564" enableBackground="new 0 0 512 512" height={props?.devicetype === 'mobile' ? "16" : "20"} viewBox="0 0 512 512" width={props?.devicetype === 'mobile' ? "16" : "20"} xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="m256 469.878c-86.27-49.763-253.779-170.182-255.971-290.334-2.395-131.178 145.05-190.67 255.971-77.883 110.905-112.771 258.343-53.318 255.971 77.86-2.171 120.16-169.697 240.59-255.971 290.357z" fillRule="evenodd"></path></svg>
                                            :
                                            <svg id="fi_3870922" height={props?.devicetype === 'mobile' ? "16" : "20"} viewBox="0 0 512 512" width={props?.devicetype === 'mobile' ? "16" : "20"} xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m489.864 101.1a130.755 130.755 0 0 0 -60.164-50.89c-28.112-11.8-59.687-13.924-91.309-6.127-28.978 7.146-57.204 22.645-82.391 45.129-25.189-22.486-53.418-37.986-82.4-45.131-31.623-7.8-63.2-5.674-91.312 6.134a130.755 130.755 0 0 0 -60.161 50.9c-15.02 23.744-22.661 52.619-22.097 83.5 2.504 137.285 207.006 262.122 247.976 285.755a16 16 0 0 0 15.989 0c40.974-23.636 245.494-148.495 247.976-285.779.558-30.879-7.086-59.751-22.107-83.491zm-9.887 82.916c-.8 44.388-30.39 96.139-85.563 149.655-51.095 49.558-109.214 86.912-138.414 104.293-29.2-17.378-87.31-54.727-138.4-104.287-55.176-53.512-84.766-105.259-85.576-149.646-.884-48.467 22.539-87.462 62.656-104.313a106.644 106.644 0 0 1 41.511-8.238c36.795 0 75.717 17.812 108.4 51.046a16 16 0 0 0 22.815 0c45.406-46.17 102.85-62.573 149.9-42.811 40.121 16.845 63.547 55.834 62.671 104.298z"></path></svg>
                                        }
                                    </button>
                                </div>

                                {ProExtraData[data?.id]?.fbtdata?.show_on_thumbnail == 1 ?
                                    <>
                                        {ProExtraData[data?.id]?.fbtdata?.fbtlist?.map((fbtpro: any, i: number) => {
                                            var fbtprice = fbtpro?.productdetail?.sale_price ? fbtpro?.productdetail?.sale_price : fbtpro?.productdetail?.price;
                                            if (ProExtraData[data?.id]?.fbtdata?.discount_type == 1) {
                                                fbtprice -= (fbtpro?.discount * fbtprice) / 100;
                                            } else {
                                                // amount type
                                                if (ProExtraData[data?.id]?.fbtdata?.amount_type == 1) {
                                                    fbtprice = fbtprice - fbtpro?.discount;
                                                }
                                                else {
                                                    fbtprice = fbtpro?.discount;
                                                }
                                            }
                                            return (
                                                <>
                                                    <hr className='my-2 opacity-10' />
                                                    <div className={`md:flex md:items-center md:gap-2`}
                                                        onClick={() => {
                                                            var newfbtdata = fbtProCheck
                                                            if (newfbtdata[data?.id]) {
                                                                delete newfbtdata[data?.id]
                                                            }
                                                            else {
                                                                newfbtdata[data?.id] = true
                                                            }
                                                            setfbtProCheck({ ...newfbtdata })
                                                        }}
                                                    >
                                                        <div className="shrink-0 text-primary">
                                                            {fbtProCheck[data?.id] ?
                                                                <CheckIconFBTActive className="h-5 w-5" />
                                                                :
                                                                <CheckIconFBT className="h-5 w-5" />
                                                            }
                                                        </div>
                                                        <div className="flex items-center w-full md:gap-2 mt-2 md:mt-0" key={i}>
                                                            {props?.devicetype !== 'mobile' ?
                                                                <Image
                                                                    src={fbtpro?.productdetail?.featured_image ? NewMedia + fbtpro?.productdetail?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                                                    alt={fbtpro?.productdetail?.featured_image ? props.lang == 'ar' ? fbtpro?.productdetail?.featured_image?.alt_arabic : fbtpro?.productdetail?.featured_image?.alt : ''}
                                                                    title={fbtpro?.productdetail?.featured_image ? props.lang == 'ar' ? fbtpro?.productdetail?.featured_image?.alt_arabic : fbtpro?.productdetail?.featured_image?.title : ''}
                                                                    height={50}
                                                                    width={50}
                                                                    loading='lazy'
                                                                />
                                                                : null}
                                                            <div className="w-full">
                                                                <h2 className="text-[0.65rem] line-clamp-2">{props.lang === 'ar' ? fbtpro?.productdetail?.name_arabic : fbtpro?.productdetail?.name}</h2>
                                                                <h4 className="mt-1 text-sm  font-bold text-dark">
                                                                    <>
                                                                        <div className="flex gap-x-1 items-center">
                                                                            {fbtprice}{currencySymbol}
                                                                        </div>{' '}
                                                                        <span className="text-[0.65rem] text-[#DC4E4E] line-through decoration-[#DC4E4E] decoration-2 font-medium">{fbtpro?.productdetail?.price}</span>
                                                                    </>
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })}
                                    </>
                                    : null}
                                {/* </div> */}
                            </SwiperSlide>
                        )
                    })
                    }
                </Swiper>
            </div>

            {extraData?.freegiftData ?
                <Transition appear show={isOpen} as={Fragment}>
                    < Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black bg-white">
                                        <div className="flex bg-white items-center justify-between px-3 py-4 border-b border-[#474B5230]">
                                            <h5 className='text-sm font-semibold flex items-center gap-x-2 text-[#004B7A] fill-[#004B7A]'>
                                                <svg id="fi_3850991" enableBackground="new 0 0 512 512" height="20" viewBox="0 0 512 512" width="20" fill="#219EBC" xmlns="http://www.w3.org/2000/svg"><g><path d="m359.42 20.97c13.36-8.94 29.92-6.83 38.21.38 3.59 3.13 7.1 8.46 3.4 16.1-7.77 16.12-24.32 26.53-42.14 26.53h-51.02c2.4 6.2 3.73 12.93 3.73 19.97 0 6.27-1.06 12.3-2.98 17.93h119.99c8-15.2 8.58-32.65 1.45-48.64l-14.62-32.82c-1.71-3.8-4.33-7.34-7.89-10.44-12.42-10.78-36.42-14.98-56.52-1.54l-55.1 36.89c3.5 3.62 6.52 7.7 8.94 12.15z"></path><path d="m203.4 101.87c-1.92-5.63-2.98-11.66-2.98-17.93 0-7.04 1.33-13.77 3.73-19.97h-50.99c-17.82 0-34.37-10.42-42.18-26.54-3.7-7.63-.19-12.96 3.41-16.08 4.46-3.88 11.31-6.28 18.77-6.28 6.41 0 13.26 1.77 19.43 5.9l54.54 36.51c2.42-4.46 5.45-8.54 8.94-12.15l-55.1-36.89c-20.1-13.44-44.1-9.24-56.49 1.54-3.97 3.45-6.79 7.44-8.45 11.74l-14.07 31.51c-7.14 15.99-6.56 33.44 1.45 48.64z"></path><path d="m219.67 101.87h72.65c2.68-5.41 4.2-11.5 4.2-17.93 0-22.33-18.2-40.53-40.53-40.53s-40.53 18.2-40.53 40.53c.01 6.44 1.53 12.52 4.21 17.93z"></path><path d="m16.2 148.65v49.55c0 14.89 10.32 27.41 24.17 30.8h187.69v-112.07h-180.15c-17.48 0-31.71 14.23-31.71 31.72z"></path><path d="m40.38 469.91c0 23.21 18.88 42.09 42.09 42.09h145.6v-267.95h-187.69z"></path><path d="m464.09 116.93h-180.13v112.06h187.66c13.86-3.39 24.17-15.91 24.17-30.8v-49.55c.01-17.48-14.22-31.71-31.7-31.71z"></path><path d="m283.96 512h145.57c23.21 0 42.09-18.88 42.09-42.09v-225.86h-187.66z"></path></g></svg>
                                                {props.lang == 'ar' ? 'هـدايــا العرض' : 'Select Free Gifts'} {extraData?.freegiftData?.allowed_gifts}
                                            </h5>
                                            <button type="button" className="focus-visible:outline-none text-dark hover:text-dark fill-dark" onClick={() => setIsOpen(false)}>
                                                <svg height="16" viewBox="0 0 329.26933 329" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_1828778"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"></path></svg>
                                            </button>
                                        </div>

                                        <div className="p-5">
                                            <div className="mx-auto w-full">
                                                {extraData?.freegiftData?.freegiftlist?.map((freegiftdatapro: any, i: number) => {
                                                    if (extraData?.freegiftData?.discount_type == 2) {
                                                        var fgprice = freegiftdatapro?.productdetail?.sale_price ? freegiftdatapro?.productdetail?.sale_price : freegiftdatapro?.productdetail?.price;
                                                        fgprice -= (freegiftdatapro?.discount * fgprice) / 100;
                                                    }
                                                    return (
                                                        <div
                                                            key={i + 100}
                                                            className={
                                                                `${selectedGifts[freegiftdatapro.id]
                                                                    ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                                                                    : ''
                                                                } ${selectedGifts[freegiftdatapro.id] ? 'bg-[#004B7A] text-white' : 'bg-[#EEF4F7]'} relative flex rounded-lg p-3 focus:outline-none mb-1`}
                                                        >
                                                            <div className="relative align__center w-full">
                                                                <label htmlFor="hs-checkbox-delete" className="cursor-pointer"
                                                                    onClick={async () => {

                                                                        if (extraData?.freegiftData?.allowed_gifts == extraData?.freegiftData?.freegiftlist.length && extraData?.freegiftData?.discount_type == 1) {
                                                                            return false
                                                                        }
                                                                        else {
                                                                            var gifts = selectedGifts
                                                                            if (gifts[freegiftdatapro.id])
                                                                                delete gifts[freegiftdatapro.id]
                                                                            else if (Object.keys(selectedGifts).length < allowed_gifts)
                                                                                gifts[freegiftdatapro.id] = true
                                                                            await setselectedGifts({ ...gifts })
                                                                        }
                                                                        // if (Object.keys(selectedGifts).length == allowed_gifts) {
                                                                        //     //topMessageAlartSuccess("Gift have been selected!")
                                                                        //     closeModal()
                                                                        //     addToCart(cartid, cartkey)

                                                                        // }

                                                                    }}
                                                                >
                                                                    <div className="flex w-full items-center justify-between">
                                                                        <div className="flex items-center gap-x-3">
                                                                            <Image
                                                                                src={freegiftdatapro?.productdetail?.featured_image ? NewMedia + freegiftdatapro?.productdetail?.featured_image?.image : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                                                                alt={freegiftdatapro?.productdetail?.featured_image ? props.lang == 'ar' ? freegiftdatapro?.productdetail?.featured_image?.alt_arabic : freegiftdatapro?.productdetail?.featured_image?.alt : ''}
                                                                                title={freegiftdatapro?.productdetail?.featured_image ? props.lang == 'ar' ? freegiftdatapro?.productdetail?.featured_image?.alt_arabic : freegiftdatapro?.productdetail?.featured_image?.title : ''}
                                                                                height={60}
                                                                                width={60}
                                                                                loading='lazy'
                                                                                className="rounded-md"
                                                                            />
                                                                            <div className="flex items-center text-xs">
                                                                                <span>
                                                                                    {extraData?.freegiftData?.discount_type == 1 ?
                                                                                        <p className={`text-[#004B7A] font-bold ${selectedGifts[freegiftdatapro.id] ? 'text-secondary' : ''}`}>
                                                                                            {props.lang == 'ar' ? 'هدية مجانية' : 'Free Gift Item'}
                                                                                        </p>
                                                                                        : null}
                                                                                    {extraData?.freegiftData?.discount_type == 2 ?
                                                                                        <p className={`text-[#004B7A] font-bold ${selectedGifts[freegiftdatapro.id] ? 'text-secondary' : ''}`}>
                                                                                            {fgprice != 0 ? fgprice + ' ' + props.dict?.sr : props.lang === 'ar' ? 'حر' : 'Free'}
                                                                                        </p>
                                                                                        : null}
                                                                                    {extraData?.freegiftData?.discount_type == 3 ?
                                                                                        <p className={`text-[#004B7A] font-bold ${selectedGifts[freegiftdatapro.id] ? 'text-secondary' : ''}`}>
                                                                                            {freegiftdatapro.discount != 0 ? freegiftdatapro.discount + ' ' + props.dict?.sr : props.lang === 'ar' ? 'حر' : 'Free'}
                                                                                        </p>
                                                                                        : null}
                                                                                    <h4 className={`text-[#004B7A] text-sm md:w-80 max-md:line-clamp-2 ${selectedGifts[freegiftdatapro.id] ? 'text-white' : ''}`}>{props.lang == 'ar' ? freegiftdatapro?.productdetail?.name_arabic : freegiftdatapro?.productdetail?.name}</h4>
                                                                                    <h6 className={` font-semibold text-[#474B52] mt-3.5 text-left rtl:text-right ${selectedGifts[freegiftdatapro.id] ? 'text-secondary' : ''}`}>
                                                                                        {props.lang == 'ar' ? 'العلامة' : 'Brand'} {props.lang == 'ar' ? freegiftdatapro?.productdetail?.brand?.name_arabic : freegiftdatapro?.productdetail?.brand?.name}</h6>
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


                                        <div className="border-t border-[#474B5230] py-3 px-3 gap-2 flex items-center justify-end">
                                            {extraData?.freegiftData?.freegiftlist?.filter((e: any) => e?.discount > 0)?.length > 0 ?
                                                <button className={`focus-visible:outline-none hover:text-white py-1.5 px-4 rounded-md h-10 hover:bg-[#DC4E4E] border-[#DC4E4E] text-[#DC4E4E] border`}
                                                    aria-label={props.lang == 'ar' ? "أضف بدون هدايا" : "Add Without Gifts"}
                                                    onClick={() => {
                                                        singleAddToCart(selectedProductId, selectedProductKey, true)
                                                    }}
                                                >
                                                    <div className='text-xs font-semibold'>
                                                        {props.lang == 'ar' ? "أضف بدون هدايا" : "Add Without Gifts"}
                                                    </div>
                                                </button>
                                                : null}
                                            <button className={`focus-visible:outline-none text-white py-1.5 px-4 rounded-md h-10 bg-[#004B7A] border-[#004B7A] border`}
                                                onClick={() => {
                                                    if (Object.keys(selectedGifts).length == extraData?.freegiftData?.allowed_gifts) {

                                                        addToCart(cartid, cartkey)
                                                    } else {
                                                        topMessageAlartDanger(props.lang === 'ar' ? 'الرجاء اختيار منتجات الهدايا' : 'please select gift products')
                                                    }
                                                }}
                                            >
                                                <div className='text-xs font-semibold'>
                                                    {props.lang == 'ar' ? "يتخطى" : "Select This"}{' '}{extraData?.freegiftData?.allowed_gifts}{' '}{props.lang == 'ar' ? "يتخطى" : "Gift"}
                                                </div>
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog >
                </Transition >
                : null
            }
        </>
    );
}