"use client"

import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect, Fragment, useContext } from 'react'
import dynamic from 'next/dynamic'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { setCartItems } from '../cartstorage/cart'
import GlobalContext from '../GlobalContext'
import { addProductCompareData, addProductWishlistData, getProductExtraData, removeProductCompareData, removeProductWishlistData } from '@/lib/components/component.client'
import { useRouter } from 'next-nprogress-bar'

const RatingComponent = dynamic(() => import('./ProductComponents/Rating'), { ssr: false })

interface DiscountProps {
    isSale: boolean;
    discountPercentage?: number; // Optional, only needed if it's not a sale
    regPrice: any; // Optional, only needed if it's not a sale
    salePrice?: any; // Optional, only needed if it's not a sale
}

interface FreeGiftProps {
    freeGiftType: any; // 0 = Sale, 1 = Select, 2 = Select
    freeGiftAllowed?: any; // Optional, only needed if it's not a sale
    isSelectGift?: boolean; // Optional, only needed if it's not a sale
    freeGiftList?: any; // Optional, only needed if it's not a sale
}

export default function Products(props: any) {
    const isArabic = props?.isArabic
    const lang = props?.lang;
    const NewMedia = props?.NewMedia;
    const router = useRouter()
    const [ProExtraData, setProExtraData] = useState<any>([])
    const [buyNowLoading, setBuyNowLoading] = useState<number>(0)
    const [ProWishlistData, setProWishlistData] = useState<any>([])
    const [ProComparetData, setProComparetData] = useState<any>([])
    const [ProData, setProData] = useState<any>(props?.products ? props?.products : [])
    const [extraData, setExtraData] = useState<any>([]);
    const [selectedGifts, setselectedGifts] = useState<any>({})
    const [allowed_gifts, setallowed_gifts] = useState(0)
    const [cartid, setcartid] = useState(false)
    const [cartkey, setcartkey] = useState(false)
    const [selectedProductId, setSelectedProductId] = useState<any>(false)
    const [selectedProductKey, setSelectedProductKey] = useState<any>(false)
    const [fbtProCheck, setfbtProCheck] = useState<any>({})
    const { updateCompare, setUpdateCompare } = useContext(GlobalContext);
    const { updateWishlist, setUpdateWishlist } = useContext(GlobalContext);

    // CURRENCY SYMBOL //
    const currencySymbol = <svg className="riyal-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39" width="11" height="12">
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
        if (localStorage.getItem('userCompare')) {
            var wdata: any = localStorage.getItem('userCompare')
            setProComparetData(JSON.parse(wdata))
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

        if (localStorage.getItem('userCompare')) {
            var wdata: any = localStorage.getItem('userCompare')
            setProComparetData(JSON.parse(wdata))
        }
        else if (ProComparetData.length) {
            setProComparetData([])
        }
    }

    const extraproductdata = async () => {

        var a: number[] = []
        props.products.forEach((item: any) => {
            a.push(item.id)
        });
        // localStorage.getItem("globalcity")
        const city = localStorage.getItem("globalcity");
        const dataExtra = await getProductExtraData(a?.join(","), city);
        const data = dataExtra?.extraDataDetails?.data;
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

        if (localStorage.getItem("userid")) {
            // get(`checkmultiwishlistproduct/${a.join(",")}/${localStorage.getItem("userid")}`).then((responseJson: any) => {
            //     setProWishlistData(responseJson?.data)
            // })
            // get(`checkmulticompareproduct/${a.join(",")}/${localStorage.getItem("userid")}`).then((responseJson: any) => {
            //     setProComparetData(responseJson?.data)
            // })
        }
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
            position: lang == 'ar' ? 'top-start' : 'top-end',
            showConfirmButton: false,
            timer: 15000,
            showCloseButton: true,
            background: '#DC4E4E',
            color: '#FFFFFF',
            timerProgressBar: true
        });
    };

    const WishlistProduct = async (id: any, type: boolean) => {
        // var testing: any = ProWishlistData
        if (localStorage.getItem("userid")) {
            var data = {
                user_id: localStorage.getItem("userid"),
                product_id: id,
            }
            if (type) {
                const removeWishlist = await removeProductWishlistData(data);
                if (removeWishlist?.removeWishlistData?.success) {
                    // testing[id].wishlist = !type;
                    // setProWishlistData({ ...testing })
                    var wishlistRemovetext = props.dict?.wishlistRemovedText ? props.dict?.wishlistRemovedText : props?.dict?.products?.wishlistRemovedText
                    topMessageAlartDanger(wishlistRemovetext)
                    if (localStorage.getItem("wishlistCount")) {
                        var wishlistlength: any = localStorage.getItem('wishlistCount');
                        wishlistlength = parseInt(wishlistlength) - 1;
                        localStorage.setItem('wishlistCount', wishlistlength);
                    }
                    localStorage.removeItem('userWishlist')
                    setUpdateWishlist(updateWishlist == 0 ? 1 : 0)
                }
            } else {
                const addWishlist = await addProductWishlistData(data);
                if (addWishlist?.addWishlistData?.success) {
                    // testing[id].wishlist = !type;
                    // setProWishlistData({ ...testing })
                    var wishlistAddtext = props.dict?.wishlistAddedText ? props.dict?.wishlistAddedText : props?.dict?.products?.wishlistAddedText
                    topMessageAlartSuccess(wishlistAddtext)
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
            router.push(`/${lang}/login`);
        }
    }

    const CompareProduct = async (id: any, type: boolean) => {
        // var testing: any = ProComparetData
        if (localStorage.getItem("userid")) {
            var data = {
                user_id: localStorage.getItem("userid"),
                product_id: id,
            }
            if (type) {
                const removeCompare = await removeProductCompareData(data);
                if (removeCompare?.removeCompareData?.success) {
                    // testing[id].compare = !type;
                    // setProComparetData({ ...testing })
                    var compareRemovetext = props.dict?.compareRemovedText ? props.dict?.compareRemovedText : props?.dict?.compareRemovedText
                    topMessageAlartDanger(compareRemovetext)
                    if (localStorage.getItem("compareCount")) {
                        var comparelength: any = localStorage.getItem('compareCount');
                        comparelength = parseInt(comparelength) - 1;
                        localStorage.setItem('compareCount', comparelength);
                    }
                    localStorage.removeItem('userCompare')
                    setUpdateCompare(updateCompare == 0 ? 1 : 0)
                }
            } else {
                const addCompare = await addProductCompareData(data);
                if (addCompare?.addCompareData?.success) {
                    // testing[id].compare = !type;
                    // setProComparetData({ ...testing })
                    var compareAddtext = props.dict?.compareAddedText ? props.dict?.compareAddedText : props?.dict?.compareAddedText
                    topMessageAlartSuccess(compareAddtext)
                    if (localStorage.getItem("compareCount")) {
                        var comparelength: any = localStorage.getItem('compareCount');
                        comparelength = parseInt(comparelength) + 1;
                        localStorage.setItem('compareCount', comparelength);
                    }
                    localStorage.removeItem('userCompare')
                    setUpdateCompare(updateCompare == 0 ? 1 : 0)
                } else {
                    topMessageAlartDanger(props.dict?.compareAlreadyText)
                }
            }
        } else {
            router.push(`/${lang}/login`);
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
                            <p className="font-light mb-3">{lang == 'ar' ? 'تمت إضافة العنصر إلى سلة التسوق الخاصة بك.' : 'The item has been added into your cart.'}</p>
                            <button
                                onClick={() => {
                                    router.push(`/${lang}/cart`)
                                    router.refresh();
                                }}
                                className="focus-visible:outline-none mt-2 underline">
                                {lang == 'ar' ? 'عرض العربة' : 'View Cart'}
                            </button>
                        </>
                        : null}
                </div>
            ,
            toast: true,
            position: lang == 'ar' ? 'top-start' : 'top-end',
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
            topMessageAlartSuccess(props.dict?.products?.productCart, true)
            setBuyNowLoading(0);
            return false;
        }
        if (ProExtraData[id]?.freegiftData && giftcheck) {
            setExtraData(ProExtraData[id])
            setallowed_gifts(ProExtraData[id]?.freegiftData?.allowed_gifts)
            // openModal()
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
            // closeModal()
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

            topMessageAlartSuccess(props.dict?.products?.productCart, true)
            setBuyNowLoading(0);
        }
    }

    const checkAr = isArabic ? 'ar' : 'en';

    const origin = props?.origin

    return (
        <>
            <div className={`grid ${props?.grid ? `grid-cols-${props?.grid}` : `sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6`} items-start justify-center gap-3`}>
                {props?.products?.map((data: any, i: number) => {
                    const productLink = `${origin}/${checkAr}/product/${data?.slug}`
                    const proImageSrc = data?.featured_image ? `${NewMedia}${data?.featured_image?.image}` : 'https://images.tamkeenstores.com.sa/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'
                    const proIimageAlt = isArabic ? data?.name_arabic : data?.name
                    const productBrand = isArabic ? data?.brand?.name_arabic : data?.brand?.name
                    const proTitle = isArabic ? data?.name_arabic : data?.name
                    const pormotionType = isArabic ? 'عرض' : 'Offer';
                    const installmentPlans = isArabic ? 'خطط التقسيط' : 'Split it your way buy now pay later!';
                    // const useCodeText = isArabic ? `استخدم كود الخصم ${`RMD12`}` : `Use code ${`RMD12`}`
                    // const customBadge = isArabic ? "أكثر مبيعا" : "Selling Out Fast"
                    const useCodeText = isArabic ? data?.badge_right_arabic ?? '' : data?.badge_right ?? '';
                    const useCodeTextColor = data?.badge_right_color ? data?.badge_right_color : 'greenDark';
                    const customBadge = isArabic ? data?.badge_left_arabic ?? '' : data?.badge_left ?? '';
                    const customBadgeColor = data?.badge_left_color ? data?.badge_left_color : 'red';
                    const pormotionTitle = isArabic ? data?.pormotion_arabic ?? '' : data?.pormotion ?? '';
                    const pormotionColor = data?.pormotion_color ? data?.pormotion_color : 'specialDarkYellow';
                    // const badgeImage = `${NewMedia}VAT-ON-USE-BADG-09FEB.webp`
                    const badgeTitle = isArabic ? "" : ""
                    const badgeAlt = isArabic ? "" : ""
                    const shortDescriptionImage = `${NewMedia}32eac6e753c2a26ddfe51cb82847394f1719238746.webp`
                    // const shortDescriptionAvailable = i == 0 ? true : i == 1 ? false : null
                    const shortDescriptionAvailable = true
                    const expressImage = isArabic ? `/icons/express_logo/express_logo_ar.png` : `/icons/express_logo/express_logo_en.png`
                    const expressAlt = isArabic ? "express delivery" : "express delivery"
                    const saleType = data?.savetype == 1 ? false : true // 1 = percentage, 2 = save
                    const getFormattedPrice = (price: number | undefined) =>
                        price ? price.toLocaleString('EN-US') : '';

                    const getDiscountedPrice = () => {
                        if (!extraData?.flash || !data?.sale_price) return data?.sale_price || data?.price;

                        return extraData.flash.discount_type === 2
                            ? Math.round(data.sale_price * extraData.flash.discount_amount / 100)
                            : extraData.flash.discount_amount;
                    };

                    const getOriginalPrice = () => {
                        if (!extraData?.flash && !data?.sale_price) return '';
                        return extraData?.flash && data?.price && !data?.sale_price
                            ? extraData.flash.discount_type === 2
                                ? Math.round(data.price * extraData.flash.discount_amount / 100)
                                : extraData.flash.discount_amount
                            : data?.price;
                    };
                    const productRegularPrice: any = getFormattedPrice(getOriginalPrice())
                    const numericproductRegularPrice = parseInt(productRegularPrice.replace(/,/g, ''), 10)
                    // const productSalePrice = vatOnUs ? (getFormattedPrice(Math.round((getDiscountedPrice() / 115) * 100)).toLocaleString()) : (getFormattedPrice(getDiscountedPrice()))
                    const productSalePrice = parseInt(String(data?.promotional_price || '0').replace(/,/g, '')) > 0 ? (getFormattedPrice(Math.round((parseInt(getDiscountedPrice()) - parseInt(data?.promotional_price)))).toLocaleString()) : (getFormattedPrice(parseInt(getDiscountedPrice())))
                    const numericproductSalePrice = parseInt(productSalePrice.replace(/,/g, ''), 10)                    

                    var flashCalc = extraData?.flash ? extraData?.flash?.discount_type === 2 ? Math.round(data?.sale_price * extraData?.flash?.discount_amount / 100) : extraData?.flash?.discount_amount : data?.sale_price
                    const percentageAmount = flashCalc > 0 ? Math.round(((data?.price - flashCalc) * 100) / data?.price) : 0
                    const discountAmount = flashCalc > 0 ? data?.price - flashCalc : 0

                    const fGift = ProExtraData[data?.id]?.freegiftData
                    const fGiftType = (fGift && fGift?.freegiftlist?.length == fGift?.allowed_gifts) ? 0 : 1
                    const FreeGiftData: React.FC<FreeGiftProps> = ({ freeGiftType, freeGiftAllowed, isSelectGift, freeGiftList }) => {
                        return (
                            <div className="text-[0.65rem] font-semibold">
                                {freeGiftType == "0" ?
                                    <span className="text-specialDarkYellow flex items-center gap-1"><Image src="/icons/gift.svg" height={16} width={16} alt="giftIcon" title='Gift Icon' className='' />{isArabic ? `هدية مجانية ${freeGiftAllowed}` : `${freeGiftAllowed} Free Gift ${freeGiftAllowed >= 2 ? '(s)' : ''}`}</span>
                                    :
                                    freeGiftType == "1" ?
                                        <span className="text-red flex items-center gap-1"><Image src="/icons/gift.svg" height={16} width={16} alt="giftIcon" title='Gift Icon' className='' />{isArabic ? `هدية مجانية ${freeGiftAllowed} اختر` : `Select ${freeGiftAllowed} Free Gift`}</span>
                                        // :
                                        // freeGiftType == "2" ?
                                        //     <span className="text-red">{isArabic ? `احصل على منتج إضافي بـ ${11}${currencySymbol} فق` : `Choose another item for ${11}${currencySymbol}`}</span>
                                        : null
                                }
                            </div>
                        );
                    };

                    const DiscountLabel: React.FC<DiscountProps> = ({ isSale, discountPercentage, regPrice, salePrice }) => {
                        const regPriceStr = typeof regPrice === 'string' ? regPrice : regPrice.toString();
                        const salePriceStr = typeof salePrice === 'string' ? salePrice : salePrice.toString();
                        return (
                            <div className="text-xs font-semibold">
                                {data?.custom_badge_en || data?.custom_badge_ar ?
                                    <>
                                        <span className="text-greenDark flex items-center gap-1">{isArabic ? "وفر " : "Save"}{" "}{isArabic ? data?.custom_badge_ar : data?.custom_badge_en}{" "}{currencySymbol}</span>
                                    </>
                                    :
                                    <>
                                        {isSale ? (
                                            <>
                                            {salePrice > 0 ? 
                                                <span className="text-greenDark flex items-center gap-1">{isArabic ? "وفر " : "Save"}{" "}{parseInt(regPriceStr?.replace(/,/g, ''), 10) - parseInt(salePriceStr?.replace(/,/g, ''), 10)}{" "}{currencySymbol}</span>
                                            :null}
                                            </>
                                        ) : (
                                            <>
                                            {discountPercentage && discountPercentage > 0 ?
                                                <>
                                                <span className="text-red">{discountPercentage}% {isArabic ? "خصم" : "OFF"}</span>
                                                </>
                                            : null}
                                            </>
                                        )}
                                    </>
                                }
                            </div>
                        );
                    };

                    const opacity = 0.1;
                    
                    return (
                        props?.devicetype == true ?
                            <div className='proBox relative'>
                                <div className="flex justify-between">
                                    <div className='space-y-2'>
                                        {customBadge ?
                                            <div className={`text-[0.60rem] font-semibold bg-${customBadgeColor}/15 py-1 px-1.5 rounded-md line-clamp-1`} style={{backgroundColor:`${customBadgeColor}15`}}>
                                                <span className={`text-${customBadgeColor} animationImp`} style={{color:`${customBadgeColor}`}}>{customBadge}</span>
                                            </div>
                                            : null}
                                        {useCodeText ?
                                            <div className={`text-[0.60rem] font-semibold bg-${useCodeTextColor}/15 py-1 px-1.5 rounded-md w-fit line-clamp-1`} style={{backgroundColor:`${useCodeTextColor}15`}}>
                                                <span className={`text-${useCodeTextColor}`} style={{backgroundColor:`${useCodeTextColor}`}}>{useCodeText}</span>
                                            </div>
                                            : null}
                                    </div>
                                    <div className='overflow-hidden'>
                                        <div className='absolute ltr:right-2 rtl:left-2 z-10'>
                                            <div className='flex flex-col'>
                                                <div className='mb-1.5'>
                                                    <button className='productSliderBtns'
                                                        onClick={() => {
                                                            if (fGiftType == 0) {
                                                                addToCart(data.id, i, true)
                                                            }
                                                            else if (fGift) {
                                                                router.push(productLink)
                                                            }
                                                            else {
                                                                addToCart(data.id, i, true)
                                                            }
                                                        }}
                                                    >
                                                        <svg id="fi_3144456" enableBackground="new 0 0 511.728 511.728" height="14" viewBox="0 0 511.728 511.728" width="14" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="m147.925 379.116c-22.357-1.142-21.936-32.588-.001-33.68 62.135.216 226.021.058 290.132.103 17.535 0 32.537-11.933 36.481-29.017l36.404-157.641c2.085-9.026-.019-18.368-5.771-25.629s-14.363-11.484-23.626-11.484c-25.791 0-244.716-.991-356.849-1.438l-17.775-65.953c-4.267-15.761-18.65-26.768-34.978-26.768h-56.942c-8.284 0-15 6.716-15 15s6.716 15 15 15h56.942c2.811 0 5.286 1.895 6.017 4.592l68.265 253.276c-12.003.436-23.183 5.318-31.661 13.92-8.908 9.04-13.692 21.006-13.471 33.695.442 25.377 21.451 46.023 46.833 46.023h21.872c-3.251 6.824-5.076 14.453-5.076 22.501 0 28.95 23.552 52.502 52.502 52.502s52.502-23.552 52.502-52.502c0-8.049-1.826-15.677-5.077-22.501h94.716c-3.248 6.822-5.073 14.447-5.073 22.493 0 28.95 23.553 52.502 52.502 52.502 28.95 0 52.503-23.553 52.503-52.502 0-8.359-1.974-16.263-5.464-23.285 5.936-1.999 10.216-7.598 10.216-14.207 0-8.284-6.716-15-15-15zm91.799 52.501c0 12.408-10.094 22.502-22.502 22.502s-22.502-10.094-22.502-22.502c0-12.401 10.084-22.491 22.483-22.501h.038c12.399.01 22.483 10.1 22.483 22.501zm167.07 22.494c-12.407 0-22.502-10.095-22.502-22.502 0-12.285 9.898-22.296 22.137-22.493h.731c12.24.197 22.138 10.208 22.138 22.493-.001 12.407-10.096 22.502-22.504 22.502zm74.86-302.233c.089.112.076.165.057.251l-15.339 66.425h-51.942l8.845-67.023 58.149.234c.089.002.142.002.23.113zm-154.645 163.66v-66.984h53.202l-8.84 66.984zm-74.382 0-8.912-66.984h53.294v66.984zm-69.053 0h-.047c-3.656-.001-6.877-2.467-7.828-5.98l-16.442-61.004h54.193l8.912 66.984zm56.149-96.983-9.021-67.799 66.306.267v67.532zm87.286 0v-67.411l66.022.266-8.861 67.145zm-126.588-67.922 9.037 67.921h-58.287l-18.38-68.194zm237.635 164.905h-36.426l8.84-66.984h48.973l-14.137 61.217c-.784 3.396-3.765 5.767-7.25 5.767z"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                                {/* <div className='mb-1.5'>
                                                    <button className={`productSliderBtns ${ProComparetData.filter((item: any) => item == data?.id).length >= 1 ? 'bg-red' : ''}`}
                                                        onClick={(e: any) => {
                                                            var type: boolean = ProComparetData.filter((item: any) => item == data?.id).length >= 1;
                                                            CompareProduct(data?.id, type)
                                                        }}
                                                    >
                                                        <svg height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg" id="fi_7182235"><g clipRule="evenodd"><path d="m5 7.91303c1.43335-.33858 2.5-1.62624 2.5-3.16303 0-1.79493-1.45507-3.25-3.25-3.25s-3.25 1.45507-3.25 3.25c0 1.53679 1.06665 2.82445 2.5 3.16303v8.33697c0 2.0711 1.67893 3.75 3.75 3.75h4.0643l-1.2196 1.2197c-.29292.2929-.29292.7677 0 1.0606.2929.2929.7677.2929 1.0606 0l2.5-2.5c.2929-.2929.2929-.7677 0-1.0606l-2.5-2.5c-.2929-.2929-.7677-.2929-1.0606 0-.29292.2929-.29292.7677 0 1.0606l1.2196 1.2197h-4.0643c-1.24264 0-2.25-1.0074-2.25-2.25zm-.75-1.41303c.9665 0 1.75-.7835 1.75-1.75s-.7835-1.75-1.75-1.75-1.75.7835-1.75 1.75.7835 1.75 1.75 1.75z"></path><path d="m13.9053 2.78033c.2929-.29289.2929-.76777 0-1.06066s-.7677-.29289-1.0606 0l-2.5 2.5c-.2929.29289-.2929.76777 0 1.06066l2.5 2.5c.2929.29289.7677.29289 1.0606 0s.2929-.76777 0-1.06066l-1.2196-1.21967h4.0643c1.2426 0 2.25 1.00736 2.25 2.25v8.337c-1.4333.3385-2.5 1.6262-2.5 3.163 0 1.7949 1.4551 3.25 3.25 3.25s3.25-1.4551 3.25-3.25c0-1.5368-1.0667-2.8245-2.5-3.163v-8.337c0-2.07107-1.6789-3.75-3.75-3.75h-4.0643zm4.0947 16.46967c0-.9665.7835-1.75 1.75-1.75s1.75.7835 1.75 1.75-.7835 1.75-1.75 1.75-1.75-.7835-1.75-1.75z"></path></g></svg>
                                                    </button>
                                                </div> */}
                                                {/* <div>
                                                    <button className={`productSliderBtns ${ProWishlistData.filter((item: any) => item == data?.id).length >= 1 ? '!bg-red !fill-white' : ''}`}
                                                        onClick={(e: any) => {
                                                            var type: boolean = ProWishlistData.filter((item: any) => item == data?.id).length >= 1;
                                                            WishlistProduct(data?.id, type)
                                                        }}
                                                    >
                                                        <svg id="fi_4240564" enable-background="new 0 0 512 512" height="14" viewBox="0 0 512 512" width="14" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="m256 469.878c-86.27-49.763-253.779-170.182-255.971-290.334-2.395-131.178 145.05-190.67 255.971-77.883 110.905-112.771 258.343-53.318 255.971 77.86-2.171 120.16-169.697 240.59-255.971 290.357z" fillRule="evenodd"></path></svg>
                                                    </button>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Link href={productLink} className=''>
                                    <div className='overflow-hidden'>
                                        <Image
                                            src={proImageSrc}
                                            alt={proIimageAlt}
                                            title={proTitle}
                                            width={350}
                                            height={350}
                                            priority={true}
                                            className="mx-auto rounded-md w-full max-w-[350px] h-auto"
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                                        />
                                    </div>
                                    <h2 className={`${props?.lang == 'ar' ?  'text-right': 'text-left'} line-clamp-2`}><span className='font-bold after:content-["•"]'>{productBrand}{' '}</span>{' '}{proTitle}</h2>
                                    <RatingComponent rating={data?.rating} totalRating={data?.totalrating} className='my-2' />
                                    <div className='align__center bg-gray/10 p-2 rounded-md'>
                                        <div className=''>
                                            <h3 className='text-[1.05rem] font-bold text-red'>
                                                <div className='flex items-center gap-1 text-[1.05rem] font-bold text-red'>
                                                    {productSalePrice}{currencySymbol}
                                                </div>
                                            </h3>
                                            <div className='flex items-center'>
                                                {parseInt(productRegularPrice) >= 1 ?
                                                    <>
                                                        <h3 className='text-xs text-gray-500 line-through decoration-double decoration-red leading-3'>{productRegularPrice}</h3>
                                                    </>
                                                    : null}
                                                <span className='before:content-["•"] mx-1'></span>
                                                <h4 className='text-sm'><DiscountLabel isSale={saleType} discountPercentage={percentageAmount} regPrice={numericproductRegularPrice} salePrice={numericproductSalePrice} /></h4>
                                            </div>
                                            {data?.promotional_price > 0 ?
                                                <span className='text-[#DC4E4E] text-[0.65rem] mt-1 font-bold animationImp'>{isArabic ? data?.promo_title_arabic : data?.promo_title}</span>
                                                :
                                                <div className='h-8'></div>
                                            }
                                        </div>
                                    </div>
                                    {ProExtraData[data?.id]?.expressdeliveryData ?
                                        <Image
                                            src={props?.lang == 'ar' ? "/icons/express_logo/Express_ar_48.webp" : "/icons/express_logo/Express_en_48.webp"}
                                            width='0' height="0" alt="express_delivery" title='Express Delivery' className='my-2 w-full'
                                            sizes="(max-width: 140px) 100vw, (max-width: 1068px) 1150px, (max-width: 1024px) 1, 100vw"
                                        />
                                        : <div className={`${props.devicetype == 'desktop' ? 'h-10 my-1' : 'h-10 my-1'}`}></div>}
                                    {shortDescriptionAvailable ?
                                        <div className={`bg-gray/10 p-2 rounded-md mt-2 ${isArabic ? 'text-right' : ''}`}>
                                            <h3 className='font-normal text-[0.65rem]'>{installmentPlans}</h3>
                                            <div className='w-full overflow-hidden'>
                                                <Image
                                                    src={'/images/logos_paymentmethods.webp?updated'}
                                                    alt={isArabic ? "طرق الدفع" : "payment methods"}
                                                    title={isArabic ? "طرق الدفع" : "payment methods"}
                                                    height={45}
                                                    width={350}
                                                    loading='lazy'
                                                    className='rounded-md mt-1.5 w-full max-w-[350px] h-auto'
                                                    sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw'
                                                />
                                            </div>
                                        </div>
                                        :
                                        null
                                        // <div className='bg-gray/10 p-2 rounded-md mt-2'>
                                        //     <div className='flex items-center gap-1 justify-between overflow-hidden'>
                                        //         <Image
                                        //             src={shortDescriptionImage}
                                        //             alt={proIimageAlt}
                                        //             title={proTitle}
                                        //             height={0}
                                        //             width={0}
                                        //             loading='lazy'
                                        //             className='rounded-md h-full w-full'
                                        //             sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw'
                                        //         />
                                        //     </div>
                                        // </div>
                                    }
                                    {/* <div className='rounded-md mt-2'>
                                        <div className='flex items-center gap-1 justify-between overflow-hidden'>
                                            <Image
                                                src={badgeImage}
                                                alt={badgeAlt}
                                                title={badgeTitle}
                                                height={0}
                                                width={0}
                                                loading='lazy'
                                                className='h-full w-full rounded-md'
                                                sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw'
                                            />
                                        </div>
                                    </div> */}

                                    <div className='mt-2 flex items-center text-xs font-bold'>
                                        {fGift && fGift?.allowed_gifts >= 1 ?
                                            <FreeGiftData freeGiftType={fGiftType} freeGiftAllowed={fGift ? fGift?.allowed_gifts : 0} />
                                            :
                                            null
                                        }

                                        {data?.pormotion_arabic || data?.pormotion != null ?
                                            <>
                                                <span className={`before:content-["•"] mx-1 text-${pormotionColor}`}></span>
                                                <h5 className={`text-${pormotionColor}`}>{pormotionTitle}</h5>
                                            </>
                                            : <div className='h-4'></div>}
                                    </div>
                                </Link>
                            </div>
                            :
                            <div className='proBox relative'>
                                <div className='align__center'>
                                    {customBadge ?
                                        <div className={`text-[0.60rem] font-semibold bg-${customBadgeColor}/15 py-1 px-1.5 rounded-md w-fit`} style={{backgroundColor:`${customBadgeColor}15`}}>
                                            <span className={`text-${customBadgeColor} animationImp`} style={{color:`${customBadgeColor}`}}>{customBadge}</span>
                                        </div>
                                        : null}
                                    {useCodeText ?
                                        <div className={`text-[0.60rem] font-semibold bg-${useCodeTextColor}/15 py-1 px-1.5 rounded-md w-fit`} style={{backgroundColor:`${useCodeTextColor}15`}}>
                                            <span className={`text-${useCodeTextColor}`} style={{color:`${useCodeTextColor}`}}>{useCodeText}</span>
                                        </div>
                                        : null}
                                </div>
                                <div className='overflow-hidden'>
                                    <div className='absolute ltr:right-2 rtl:left-2 top-12 z-10'>
                                        <div className='flex flex-col'>
                                            <div className='mb-1.5'>
                                                <button className='productSliderBtns'
                                                    onClick={() => {
                                                        if (fGiftType == 0) {
                                                            addToCart(data.id, i, true)
                                                        }
                                                        else if (fGift) {
                                                            router.push(productLink)
                                                        }
                                                        else {
                                                            addToCart(data.id, i, true)
                                                        }
                                                    }}
                                                >
                                                    <svg id="fi_3144456" enableBackground="new 0 0 511.728 511.728" height="14" viewBox="0 0 511.728 511.728" width="14" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="m147.925 379.116c-22.357-1.142-21.936-32.588-.001-33.68 62.135.216 226.021.058 290.132.103 17.535 0 32.537-11.933 36.481-29.017l36.404-157.641c2.085-9.026-.019-18.368-5.771-25.629s-14.363-11.484-23.626-11.484c-25.791 0-244.716-.991-356.849-1.438l-17.775-65.953c-4.267-15.761-18.65-26.768-34.978-26.768h-56.942c-8.284 0-15 6.716-15 15s6.716 15 15 15h56.942c2.811 0 5.286 1.895 6.017 4.592l68.265 253.276c-12.003.436-23.183 5.318-31.661 13.92-8.908 9.04-13.692 21.006-13.471 33.695.442 25.377 21.451 46.023 46.833 46.023h21.872c-3.251 6.824-5.076 14.453-5.076 22.501 0 28.95 23.552 52.502 52.502 52.502s52.502-23.552 52.502-52.502c0-8.049-1.826-15.677-5.077-22.501h94.716c-3.248 6.822-5.073 14.447-5.073 22.493 0 28.95 23.553 52.502 52.502 52.502 28.95 0 52.503-23.553 52.503-52.502 0-8.359-1.974-16.263-5.464-23.285 5.936-1.999 10.216-7.598 10.216-14.207 0-8.284-6.716-15-15-15zm91.799 52.501c0 12.408-10.094 22.502-22.502 22.502s-22.502-10.094-22.502-22.502c0-12.401 10.084-22.491 22.483-22.501h.038c12.399.01 22.483 10.1 22.483 22.501zm167.07 22.494c-12.407 0-22.502-10.095-22.502-22.502 0-12.285 9.898-22.296 22.137-22.493h.731c12.24.197 22.138 10.208 22.138 22.493-.001 12.407-10.096 22.502-22.504 22.502zm74.86-302.233c.089.112.076.165.057.251l-15.339 66.425h-51.942l8.845-67.023 58.149.234c.089.002.142.002.23.113zm-154.645 163.66v-66.984h53.202l-8.84 66.984zm-74.382 0-8.912-66.984h53.294v66.984zm-69.053 0h-.047c-3.656-.001-6.877-2.467-7.828-5.98l-16.442-61.004h54.193l8.912 66.984zm56.149-96.983-9.021-67.799 66.306.267v67.532zm87.286 0v-67.411l66.022.266-8.861 67.145zm-126.588-67.922 9.037 67.921h-58.287l-18.38-68.194zm237.635 164.905h-36.426l8.84-66.984h48.973l-14.137 61.217c-.784 3.396-3.765 5.767-7.25 5.767z"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className='mb-1.5'>
                                                <button className={`productSliderBtns ${ProComparetData.filter((item: any) => item == data?.id).length >= 1 ? 'bg-red' : ''}`}
                                                    onClick={(e: any) => {
                                                        var type: boolean = ProComparetData.filter((item: any) => item == data?.id).length >= 1;
                                                        CompareProduct(data?.id, type)
                                                    }}
                                                >
                                                    <svg height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg" id="fi_7182235"><g clipRule="evenodd"><path d="m5 7.91303c1.43335-.33858 2.5-1.62624 2.5-3.16303 0-1.79493-1.45507-3.25-3.25-3.25s-3.25 1.45507-3.25 3.25c0 1.53679 1.06665 2.82445 2.5 3.16303v8.33697c0 2.0711 1.67893 3.75 3.75 3.75h4.0643l-1.2196 1.2197c-.29292.2929-.29292.7677 0 1.0606.2929.2929.7677.2929 1.0606 0l2.5-2.5c.2929-.2929.2929-.7677 0-1.0606l-2.5-2.5c-.2929-.2929-.7677-.2929-1.0606 0-.29292.2929-.29292.7677 0 1.0606l1.2196 1.2197h-4.0643c-1.24264 0-2.25-1.0074-2.25-2.25zm-.75-1.41303c.9665 0 1.75-.7835 1.75-1.75s-.7835-1.75-1.75-1.75-1.75.7835-1.75 1.75.7835 1.75 1.75 1.75z"></path><path d="m13.9053 2.78033c.2929-.29289.2929-.76777 0-1.06066s-.7677-.29289-1.0606 0l-2.5 2.5c-.2929.29289-.2929.76777 0 1.06066l2.5 2.5c.2929.29289.7677.29289 1.0606 0s.2929-.76777 0-1.06066l-1.2196-1.21967h4.0643c1.2426 0 2.25 1.00736 2.25 2.25v8.337c-1.4333.3385-2.5 1.6262-2.5 3.163 0 1.7949 1.4551 3.25 3.25 3.25s3.25-1.4551 3.25-3.25c0-1.5368-1.0667-2.8245-2.5-3.163v-8.337c0-2.07107-1.6789-3.75-3.75-3.75h-4.0643zm4.0947 16.46967c0-.9665.7835-1.75 1.75-1.75s1.75.7835 1.75 1.75-.7835 1.75-1.75 1.75-1.75-.7835-1.75-1.75z"></path></g></svg>
                                                </button>
                                            </div>
                                            {/* <div>
                                                <button className={`productSliderBtns ${ProWishlistData.filter((item: any) => item == data?.id).length >= 1 ? '!bg-red !fill-white' : ''}`}
                                                    onClick={(e: any) => {
                                                        var type: boolean = ProWishlistData.filter((item: any) => item == data?.id).length >= 1;
                                                        WishlistProduct(data?.id, type)
                                                    }}
                                                >
                                                    <svg id="fi_4240564" enableBackground="new 0 0 512 512" height="14" viewBox="0 0 512 512" width="14" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="m256 469.878c-86.27-49.763-253.779-170.182-255.971-290.334-2.395-131.178 145.05-190.67 255.971-77.883 110.905-112.771 258.343-53.318 255.971 77.86-2.171 120.16-169.697 240.59-255.971 290.357z" fillRule="evenodd"></path></svg>
                                                </button>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                <Link href={productLink} className=''>
                                    <div className='overflow-hidden'>
                                        <Image
                                            src={proImageSrc}
                                            alt={proIimageAlt}
                                            title={proTitle}
                                            width={350}
                                            height={350}
                                            priority={true}
                                            className="mx-auto rounded-md w-full max-w-[350px] h-auto"
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                                        />
                                    </div>
                                    <h2 className='line-clamp-2'><span className='font-bold after:content-["•"]'>{productBrand}{' '}</span>{' '}{proTitle}</h2>
                                    <RatingComponent rating={data?.rating} totalRating={data?.totalrating} className='my-2' />
                                    <div className='bg-gray/10 p-2 rounded-md'>
                                        <div className='align__center'>
                                            <div className=''>
                                                <h3 className='text-[1.05rem] font-bold text-red'>
                                                    <div className='flex gap-1 items-center'>
                                                        {productSalePrice}{currencySymbol}
                                                    </div>
                                                </h3>
                                                <div className='flex items-center'>
                                                    {parseInt(productRegularPrice) >= 1 ?
                                                        <>
                                                            <h3 className='text-xs text-gray-500 line-through decoration-double decoration-red leading-3'>{productRegularPrice}</h3>
                                                        </>
                                                        : null}
                                                    <span className='before:content-["•"] mx-1'></span>
                                                    <h4 className='text-sm'><DiscountLabel isSale={saleType} discountPercentage={percentageAmount} regPrice={numericproductRegularPrice} salePrice={numericproductSalePrice} /></h4>
                                                </div>
                                            </div>
                                            {ProExtraData[data?.id]?.expressdeliveryData ?
                                                <Image
                                                    src={expressImage}
                                                    alt={expressAlt}
                                                    title={expressAlt}
                                                    height={65}
                                                    width={65}
                                                    loading='lazy'
                                                    className='rounded-md'
                                                    sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw'
                                                />
                                                : null}
                                        </div>
                                        {data?.promotional_price > 0 ?
                                            <span className='text-[#DC4E4E] text-xs mt-0.5 font-bold animationImp'>{isArabic ? data?.promo_title_arabic : data?.promo_title}</span>
                                            :
                                            null
                                        }
                                    </div>
                                    {shortDescriptionAvailable ?
                                        <div className='bg-gray/10 p-2 rounded-md mt-2'>
                                            <h3 className='font-normal text-[0.65rem]'>{installmentPlans}</h3>
                                            <div className='flex items-center gap-1 justify-between overflow-hidden'>
                                                <Image
                                                    src={'/images/logos_paymentmethods.webp'}
                                                    alt={isArabic ? "طرق الدفع" : "payment methods"}
                                                    title={isArabic ? "طرق الدفع" : "payment methods"}
                                                    height={45}
                                                    width={350}
                                                    loading='lazy'
                                                    className='rounded-md mt-1.5 w-full max-w-[350px] h-auto'
                                                    sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw'
                                                />
                                            </div>
                                        </div>
                                        :
                                        null
                                        // <div className='bg-gray/10 p-2 rounded-md mt-2'>
                                        //     <div className='flex items-center gap-1 justify-between overflow-hidden'>
                                        //         <Image
                                        //             src={shortDescriptionImage}
                                        //             alt={proIimageAlt}
                                        //             title={proTitle}
                                        //             height={0}
                                        //             width={0}
                                        //             loading='lazy'
                                        //             className='rounded-md h-full w-full'
                                        //             sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw'
                                        //         />
                                        //     </div>
                                        // </div>
                                    }
                                    {/* <div className='rounded-md mt-2'>
                                    <div className='flex items-center gap-1 justify-between overflow-hidden'>
                                        <Image
                                            src={badgeImage}
                                            alt={badgeAlt}
                                            title={badgeTitle}
                                            height={0}
                                            width={0}
                                            loading='lazy'
                                            className='h-full w-full rounded-md'
                                            sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw'
                                        />
                                    </div>
                                </div> */}
                                    <div className='mt-2 flex items-center text-[0.65rem] font-bold'>
                                        {fGift && fGift?.allowed_gifts >= 1 ?
                                            <FreeGiftData freeGiftType={fGiftType} freeGiftAllowed={fGift ? fGift?.allowed_gifts : 0} />
                                            : null}

                                        {data?.pormotion_arabic || data?.pormotion != null ?
                                            <>
                                                <span className={`before:content-["•"] mx-1 text-${pormotionColor}`}></span>
                                                <h5 className={`text-${pormotionColor}`}>{pormotionTitle}</h5>
                                            </>
                                            : <div className='h-4'></div>}
                                    </div>
                                </Link>
                            </div>
                    )
                }
                )}
            </div >
        </>
    );
}