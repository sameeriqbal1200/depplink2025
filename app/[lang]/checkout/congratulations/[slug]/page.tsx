"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "@next/third-parties/google";
import CongrattIcon from "@/public/icons/congratuolation_icon.png";
import { useApp } from "@/app/_ctx/AppContext";
import { useSlot } from "@/app/_ctx/ClientDataRegistry";
import { v4 as uuidv4 } from 'uuid';
import { useUserAgent } from 'next-useragent'

const MobileHeader = dynamic(() => import('../../../components/MobileHeader'), { ssr: true })


export default function Congratulations() {
    const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA;
    const { lang, origin, deviceType, slugStr } = useApp();
    const router = useRouter();
    const orderDataClassic = useSlot<any>("order");
    const [value1, setValue1] = useState<any>(1);
    const [orderDetails, setOrderDetails] = useState<any>(orderDataClassic)
    const [DeliveryDate, setDeliveryDate] = useState(7)

    const loyaltyPointCheck = orderDataClassic?.orderdata?.ordersummary.filter((item: { type: string; }) => item?.type == 'loyalty')[0]?.price >= 1 ? true : false

    // CURRENCY SYMBOL //
    const currencySymbol = <svg className="riyal-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39" width="11" height="12">
        <path fill="currentColor" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"></path>
        <path fill="currentColor" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
    </svg>;

    useEffect(() => {
        // fbAPi()
        // getGTM()
        if (orderDetails?.arabyads_check) {
            getArabyads()
        }
        getSnapCode()
        
        //gtm code
        const orderId = orderDataClassic?.orderdata?.id || [];
        const alreadyTracked = localStorage.getItem('purchaseTracked');
        // If already tracked, do not fire again
        if (alreadyTracked == String(orderId)) return;
        const products = orderDataClassic?.orderdata?.details || [];
        const couponName = orderDataClassic?.coupon || [];
        const totalValue = orderDataClassic?.total || [];
        const shippingItem = orderDataClassic.orderdata?.ordersummary?.find((item: any) => item.type == "shipping");
        const shippingPrice = shippingItem ? Number(shippingItem.price) : 0;
        const paymentmethod = orderDataClassic.orderdata?.paymentmethod;
        //user profile
        const storedProfile = localStorage.getItem('userProfileData');
        let userProfileAtt = storedProfile ? JSON.parse(storedProfile) : {};
        const userEmail = localStorage.getItem('eMail') || '';
        const userPhone: any = `966${localStorage.getItem('phoneNumber') || ''}`;

        const newRevenue = Number(totalValue);
        userProfileAtt.total_purchases = (userProfileAtt.total_purchases || 0) + 1;
        userProfileAtt.total_revenue = (userProfileAtt.total_revenue || 0) + newRevenue;
        userProfileAtt.last_purchase_date = dayjs().locale('en').format('DD-MM-YYYY hh:mm A');
        localStorage.setItem('userProfileData', JSON.stringify(userProfileAtt));
        const fullName = localStorage.getItem('fullName');
        const [firstname] = fullName?.trim().split(' ') || [];
        const selectedProducts: any = products?.map((product: any) => {
            const categories: any = product?.product_data?.productcategory ?? [];
            const item_category: any = categories[0] ? (lang === 'ar' ? categories[0].name_arabic ?? categories[0].name : categories[0].name) : "";
            const item_category2: any = categories[1] ? (lang === 'ar' ? categories[1].name_arabic ?? categories[1].name : categories[1].name) : "";
            const item_category3: any = categories[2] ? (lang === 'ar' ? categories[2].name_arabic ?? categories[2].name : categories[2].name) : "";
            const discountPrice = product?.product_data?.price - product?.total;
            return {
                item_name: lang === 'ar' ? (product?.product_data?.name_arabic ?? "") : (product?.product_data?.name ?? ""),
                item_id: product?.product_data?.sku ?? "",
                item_brand: lang === 'ar' ? (product?.product_data?.brand?.name_arabic ?? "") : (product?.product_data?.brand?.name ?? ""),
                item_category,
                item_category2,
                item_category3,
                quantity: Number(product?.quantity ?? 0),
                item_image_link: `${NewMedia}${product?.product_data?.featured_image?.image}`,
                item_link: `${origin}/${lang}/product/${product?.product_data?.slug ?? ""}`,
                item_availability: "in stock",
                shelf_price: Number(product?.product_data?.price ?? 0),
                price: Number(product?.total) ?? 0,
                discount: Number(discountPrice ?? 0),
                item_list_id: localStorage.getItem('item_list_id') ?? "5000",
                item_list_name: localStorage.getItem('item_list_name') ?? "direct",
            };
        }) ?? [];
        const email: any = localStorage.getItem('eMail') || "";
        const phoneNumber: any = `+996${localStorage.getItem('phoneNumber') || ""}`;
        var SHA256 = require("crypto-js/sha256");
        var encryptedEmail = SHA256(email);
        var splittedfinalEmail = encryptedEmail.words.join("");
        var finalEmail = splittedfinalEmail.split("-");

        var encryptedPhone = SHA256(phoneNumber);
        var splittedfinalPhone = encryptedPhone.words.join("");
        var finalPhone = splittedfinalPhone.split("-");

        var wind: any = typeof window !== "undefined" ? window.dataLayer : "";
        wind = wind || [];
        wind.push({ ecommerce: null });  // Clear the previous ecommerce object.
        wind.push({
            event: "purchase",
            email: email,
            phone: phoneNumber,
            hashed_email: finalEmail.join(""),
            hashed_phone: finalPhone.join(""),
            platform: deviceType,
            ecommerce: {
                transaction_id: String(orderId),
                affiliation: "Online Store",
                value: Number(totalValue),
                payment_type: paymentmethod,
                tax: 0,
                shipping: shippingPrice,
                currency: "SAR",
                coupon: couponName,
                items: selectedProducts
            }
        });
        const userProfileAttributes = {
            event: "global_variables",
            platform: deviceType,
            account_creation_date: dayjs(userProfileAtt?.account_creation_date, 'DD-MM-YYYY hh:mm A').isValid() ? dayjs(userProfileAtt.account_creation_date, 'DD-MM-YYYY hh:mm A').locale('en').format('DD-MM-YYYY hh:mm A') : '',
            user_id: String(userProfileAtt?.backend_user_id ?? ''),
            email: userEmail ?? '',
            phone: userPhone ?? '',
            last_purchase_date: dayjs(userProfileAtt?.last_purchase_date, 'DD-MM-YYYY hh:mm A').isValid() ? dayjs(userProfileAtt.last_purchase_date, 'DD-MM-YYYY hh:mm A').locale('en').format('DD-MM-YYYY hh:mm A') : '',
            store_language: userProfileAtt?.store_language ?? 'ar',
            total_purchases: Number(userProfileAtt?.total_purchases ?? 0),
            total_revenue: Number(userProfileAtt?.total_revenue ?? 0),
            user_data_source: deviceType,
        };
        wind.push(userProfileAttributes);
        localStorage.setItem('purchaseTracked', String(orderId));
    }, []);

    useEffect(() => {
        if (orderDataClassic?.orderdata?.details?.filter((item: { total: number; }) => item?.total >= 1).length == orderDataClassic?.orderdata?.details.filter((item: { expressproduct: number; }) => item?.expressproduct == 1)?.length) {
            setDeliveryDate(orderDataClassic?.orderdata?.ordersummary.filter((item: { type: string; }) => item?.type == 'express')[0]?.express_data?.num_of_days)
        }
    })

    const fbAPi = () => {
        window.dataLayer = window.dataLayer || [];
        var SHA256 = require("crypto-js/sha256");
        var encryptedEmail = SHA256(orderDetails?.orderdata?.address?.user_data?.email);
        var splittedfinalEmail = encryptedEmail.words.join("");
        var finalEmail = splittedfinalEmail.split("-");
        var encryptedPhone = SHA256(`966${orderDetails?.orderdata?.address?.user_data?.phone_number}`);
        var splittedfinalPhone = encryptedPhone.words.join("");
        var finalPhone = splittedfinalPhone.split("-");
        var encryptedCity = SHA256(orderDetails?.orderdata?.address?.state_data?.name);
        var encryptedFirstName = SHA256(orderDetails?.orderdata?.address?.user_data?.first_name);
        var encryptedLastName = SHA256(orderDetails?.orderdata?.address?.user_data?.last_name);

        const fbParams = {
            data: [
                {
                    event_name: "Purchase",
                    event_time: orderDetails?.orderdata?.created_at,
                    action_source: "website",
                    event_id: orderDetails?.orderdata?.order_no,
                    event_source_url: `https://tamkeenstores.com.sa/${lang}/checkout/orderconfirmation/${orderDetails?.orderdata?.id}`,
                    data_processing_options_country: 0,
                    user_data: {
                        em: encryptedEmail.toString(),
                        ph: encryptedPhone.toString(),
                        ct: [encryptedCity.toString()],
                        fn: [encryptedFirstName.toString()],
                        ln: [encryptedLastName.toString()],
                    },
                    custom_data: {
                        currency: "SAR",
                        value: orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price,
                        order_id: orderDetails?.orderdata?.order_no,
                        // status: this.props.gtagData?.status,
                        num_items: orderDetails?.orderdata?.details_count,
                        content_category: orderDetails?.items?.item_category3,
                    },
                },
            ],
            // "test_event_code": "TEST87408"
        };

        const apiResp = fetch(
            "https://graph.facebook.com/v18.0/1119048211790622/events?access_token=EAANOZB03ACKABO6g3mBUMWpP0ig5sGrowYR4N59qZAZBi4UwmcDDUzeS7LksIYSKSgtzUFICwsOig9awMZAoviveCepgZBYZC7bLABPcBeANmXjBybqwIY0zq0m7zJXYLlc9NYXpon3B1ZAeg1i2HRFZA4Tk72BAZCJEIW6zRMp00HYZB2Woa5Kl1sdZBGropOEOAZDZD",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(fbParams),
            }
        );

        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
            event: "purchased",
            phone_number: "+966" + orderDetails?.orderdata?.address?.user_data?.phone_number,
            __INSERT_USER_PHONE__: "+966" + orderDetails?.orderdata?.address?.user_data?.phone_number,
            __INSERT_USER_EMAIL__: orderDetails?.orderdata?.address?.user_data?.email,
            user_email: orderDetails?.orderdata?.address?.user_data?.email,
            user_hashed_phone_number: encryptedPhone.toString(),
            user_hashed_email: encryptedEmail.toString(),
            address: {
                first_name: orderDetails?.orderdata?.address?.user_data?.first_name,
                last_name: orderDetails?.orderdata?.address?.user_data?.last_name,
                city: lang == 'ar' ? orderDetails?.orderdata?.address?.state_data?.name_arabic : orderDetails?.orderdata?.address?.state_data?.name,
                country: lang == 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia',
            },
            ecommerce: {
                transaction_id: orderDetails?.orderdata?.order_no, // Transaction ID. Required for purchases and refunds.
                affiliation: "Tamkeen Stores Online Store",
                value: orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price, // Total transaction value (incl. tax and shipping)
                tax: (orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price - orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price / 1.15).toFixed(2),
                currency: "SAR",
                shipping: orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'shipping')[0]?.price,
                coupon: orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'discount').length >= 1 ? orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'discount')[0]?.price : '0',
                items: orderDetails?.items,
                no_of_items: orderDetails?.orderdata?.details_count,
                payment_info_available: orderDetails?.orderdata?.paymentmethod,
            },
        })
    }

    const getGTM = () => {
        var SHA256 = require("crypto-js/sha256");
        var encryptedEmail = SHA256(orderDetails?.orderdata?.address?.user_data?.email);
        var splittedfinalEmail = encryptedEmail.words.join("");
        var finalEmail = splittedfinalEmail.split("-");

        var encryptedPhone = SHA256(`966${orderDetails?.orderdata?.address?.user_data?.phone_number}`);
        var splittedfinalPhone = encryptedPhone.words.join("");
        var finalPhone = splittedfinalPhone.split("-");

        var wind: any = typeof window !== "undefined" ? window.dataLayer : "";
        wind = wind || [];
        wind.push({ ecommerce: null }); // Clear the previous ecommerce object.
        wind.push({
            event: "purchased",
            // user_email: this.props.gtagData?.email,
            phone_number: "+966" + orderDetails?.orderdata?.address?.user_data?.phone_number,
            __INSERT_USER_PHONE__: "+966" + orderDetails?.orderdata?.address?.user_data?.phone_number,
            __INSERT_USER_EMAIL__: orderDetails?.orderdata?.address?.user_data?.email,
            user_email: orderDetails?.orderdata?.address?.user_data?.email,
            user_hashed_phone_number: encryptedPhone.toString(),
            user_hashed_email: encryptedEmail.toString(),
            address: {
                first_name: orderDetails?.orderdata?.address?.user_data?.first_name,
                last_name: orderDetails?.orderdata?.address?.user_data?.last_name,
                city: orderDetails?.orderdata?.address?.user_data?.city,
                country: "Saudi Arabia",
            },
            ecommerce: {
                transaction_id: orderDetails?.orderdata?.transaction_id, // Transaction ID. Required for purchases and refunds.
                affiliation: "Tamkeen Stores Online Store",
                value: orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price, // Total transaction value (incl. tax and shipping)
                tax: (orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price - orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price / 1.15).toFixed(2),
                currency: "SAR",
                shipping: orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'shipping')[0]?.price,
                coupon: orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'discount').length >= 1 ? orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'discount')[0]?.price : '0',
                items: orderDetails?.orderdata?.items,
                no_of_items: orderDetails?.orderdata?.details_count,
                payment_info_available: orderDetails?.orderdata?.paymentmethod,
            },
        });
        
        wind.push({
            'event': 'criteo_purchase',
            'criteo.ecommerce': {
              'transaction_id': orderDetails?.orderdata?.order_no,
              currency: "SAR",
              'items': orderDetails?.items,
          }
        });
    };

    const getArabyads = async () => {
        const params = {
            client: "tamkeen",
            order_id: orderDetails?.orderdata?.order_no,
            currency: "SAR",
            country: "KSA",
            shipping: orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'shipping')[0]?.price,
            coupon: orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'discount').length >= 1 ? orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'discount')[0]?.name : '0',
            amount: orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price, // Total transaction value (incl. tax and shipping)
            items: orderDetails?.arabyads_items,
        };

        const apiResp = await fetch(
            "https://track.arabytracking.net/direct/conversion",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
            }
        );
    };

    const getSnapCode = async () => {
        const hashed_ip_address = await fetch(`https://geolocation-db.com/json/`)
            .then(res => res.json())

        var SHA256 = require("crypto-js/sha256");
        var hashemail = SHA256(orderDetails?.orderdata?.address?.user_data?.email);
        var hashphonenumber = SHA256(orderDetails?.orderdata?.address?.user_data?.phonenumber);
        var hashipaddress = SHA256(hashed_ip_address?.IPv4);
        var hashmobileadid = SHA256(uuidv4());

        const userAgent: any =
            typeof window !== 'undefined' && window.location.origin
                ? useUserAgent(window.navigator.userAgent)
                : false;

        var today = Math.round((new Date()).getTime() / 1000);
        var BearerToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzE0NTc2ODEyLCJzdWIiOiIyMDI0ZTljMy0wOGMzLTRiN2EtODYwOS02ZDFiYjEyZmM3Mzd-UFJPRFVDVElPTn44NzJlNjQ1YS1lMWI3LTQxMmItOTE4ZS1iNmEzYWMyMTM2MzIifQ.LweMCFn__dlla0OzMi2dTlwAFkOhymkd7T3hq2TGcjM';

        const paramsdata = {
            "pixel_id": "34f047fa-cff2-48f8-8461-add6e73568ab",
            "timestamp": today,
            "uuid_c1": uuidv4(),
            "event_type": "PURCHASE",
            "event_conversion_type": "WEB",
            "event_tag": "sales",
            "page_url": `https://tamkeenstores.com.sa/en/checkout/orderconfirmation/${slugStr}`,
            "hashed_email": hashemail.toString(),
            "hashed_phone_number": hashphonenumber?.toString(""),
            "user_agent": userAgent?.source,
            "hashed_ip_address": hashipaddress.toString(""),
            "hashed_mobile_ad_id": hashmobileadid.toString(""),
            "price": orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price,
            "transaction_id": orderDetails?.orderdata?.order_no,
            "item_category": orderDetails?.items[0]?.item_category,
            "item_ids": orderDetails?.items[0]?.item_id,
            "currency": "SAR",
            "number_items": orderDetails?.orderdata?.details_count,
        }

        const apiResp = await fetch(
            "https://tr.snapchat.com/v2/conversion/validate",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${BearerToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paramsdata),
            }
        );
    };


    return (
        <>
            <MobileHeader type="Third" lang={lang} pageTitle={lang === 'ar' ? 'تم تاكيد الطلب' : 'Order Confirmed'} />
            <div className="container py-16 md:py-4">
                <div className="container flex items-center justify-center md:w-full">
                    <div className='text-center'>
                        {/* <Lottie animationData={shoppingCart} loop={false} className="h-[340px] my-[-50px]" /> */}
                        <Image
                        src={CongrattIcon}
                        alt="Congratulations Icon"
                        title="Congratulations Icon"
                        width={0}
                        height={0}
                        className="w-30 h-30 object-contain inline-block mb-4"
                        />
                        <h1 className="text-base mb-1 md:text-lg font-bold md:mb-3">{lang == 'ar' ? 'شكرا لـك علي طــلبك من مــتجــر تــمكيــن' : 'Thank you for choosing Tamkeen Store'}</h1>
                        <p className="text-xs md:text-base text-[#5D686F] md:w-[72%] w-full mx-auto">
                            {lang == 'ar' ?
                                `نقوم بمعالجة طلبك الآن، وسيتم تسليمه خلال ${dayjs().add(7, 'days').locale(lang == 'ar' ? 'ar' : 'en').format("MMM  DD, YYYY")} أيام عمل، إليك التفاصيل، وسيتم إرسال نسخة من إيصالك إلى علي البريد الالكتروني الخاص بك`
                                :
                                `We are processing your order now, and it will be delivered before ${dayjs().add(7, 'days').locale(lang == 'ar' ? 'ar' : 'en').format("MMM  DD, YYYY")}. The invoice order confirmation is already send to your below mentioned email ID.`
                            }
                            <span className="text-[#219EBC]">{' '}{orderDetails?.orderdata?.address?.user_data?.email}</span>
                        </p>
                        <div className="flex items-center gap-4 justify-center">
                            <Link href={`${origin}/${lang}/account/orderdetails/${orderDetails?.orderdata?.id}`} prefetch={true}
                                className={`btn md:bg-[#004B7A] md:w-72 w-full p-2.5 rounded-md text-sm md:text-base md:text-white text-[#004B7A] mt-6 md:border-[#004B7A] border`}>
                                {lang == 'ar' ? 'اتبــاع الطلــلب' : 'Order Details'}
                            </Link>
                        </div>
                    </div>
                </div>

                <hr className="opacity-10 my-6" />
                <div className="text-center text-sm md:text-base text-[#5D686F] font-normal">
                    <h5>{lang == 'ar' ? 'رقم طلبك' : 'Order Number'}: <span dir='ltr' className="text-[#B15533] font-bold">{orderDetails?.orderdata?.order_no}</span></h5>
                    <p>{lang == 'ar' ? 'الوقت المتوقع للتوصيل' : 'Expected time for delivery'} {dayjs().add(DeliveryDate, 'days').locale(lang == 'ar' ? 'ar' : 'en').format("MMM  DD, YYYY")}</p>
                </div>
                <div className="md:flex items-start gap-x-4 my-6">
                    <div className="w-full">
                        <div className="mt-2 border bg-white border-[#219EBC] rounded-md p-3">
                            <div>
                                <p className="font-regular text-[#5D686F] text-sm">{lang == 'ar' ? 'التواصل' : 'Communication'}</p>
                                <div className="flex items-center gap-x-2 mt-1 rtl:mt-2 text-[#004B7A] font-regular text-sm">
                                    <label className="">{orderDataClassic.orderdata?.address?.user_data?.email}</label>
                                    <label className="">-</label>
                                    <label className="" dir="ltr">{'+966 ' + orderDataClassic.orderdata?.address?.user_data?.phone_number.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')}</label>
                                </div>
                                <hr className="opacity-10 my-3" />
                            </div>
                            {orderDataClassic.orderdata?.order_type == 1 ? (
                                <>
                                <div className="flex items-center justify-between text-sm">
                                    <label className="font-regular text-[#5D686F]">{lang == 'ar' ? 'متجر الاستلام' : 'Collect From Store'}</label>
                                </div>
                                <div className="flex items-center gap-x-2 mt-1 rtl:mt-2 text-[#004B7A] fill-[#004B7A] font-regular text-sm">
                                    <svg id="fi_3514361" height="28" viewBox="0 0 256 256" width="28" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m128 138.184a5 5 0 0 1 -3.607-1.538c-2.075-2.16-50.808-53.259-50.808-82.228a54.415 54.415 0 1 1 108.83 0c0 28.969-48.733 80.068-50.808 82.228a5 5 0 0 1 -3.607 1.538zm0-128.184a44.465 44.465 0 0 0 -44.415 44.418c0 19.07 29.312 54.978 44.414 71.451 15.1-16.478 44.416-52.4 44.416-71.451a44.465 44.465 0 0 0 -44.415-44.418z"></path><path d="m128 76.153a21.735 21.735 0 1 1 21.735-21.735 21.759 21.759 0 0 1 -21.735 21.735zm0-33.47a11.735 11.735 0 1 0 11.735 11.735 11.748 11.748 0 0 0 -11.735-11.735z"></path><path d="m128.126 256a4.992 4.992 0 0 1 -2.5-.67l-77.175-44.559a5 5 0 0 1 -2.5-4.331v-38.385a5 5 0 0 1 10 0v35.5l72.175 41.67 72.174-41.67v-35.88a5 5 0 0 1 10 0v38.765a5 5 0 0 1 -2.5 4.331l-77.174 44.556a4.992 4.992 0 0 1 -2.5.673z"></path><path d="m128.126 166.884a4.992 4.992 0 0 1 -2.5-.67l-77.175-44.557a5 5 0 1 1 5-8.66l74.675 43.113 74.674-43.11a5 5 0 1 1 5 8.66l-77.174 44.557a4.992 4.992 0 0 1 -2.5.667z"></path><path d="m160.933 198.291a5 5 0 0 1 -3.459-1.389l-32.806-31.402a5 5 0 0 1 6.916-7.224l30.1 28.813 68.154-39.349-27.558-26.382-27.359-15.744a5 5 0 1 1 4.988-8.667l27.885 16.047a4.988 4.988 0 0 1 .964.721l32.806 31.407a5 5 0 0 1 -.958 7.942l-77.174 44.557a4.993 4.993 0 0 1 -2.499.67z"></path><path d="m95.067 198.525a4.985 4.985 0 0 1 -2.5-.67l-77.173-44.555a5 5 0 0 1 -.957-7.942l33.057-31.642a4.967 4.967 0 0 1 .957-.718l27.634-15.955a5 5 0 1 1 5 8.66l-27.112 15.653-27.807 26.616 68.154 39.348 30.349-29.048a5 5 0 1 1 6.914 7.224l-33.058 31.641a4.991 4.991 0 0 1 -3.458 1.388z"></path></svg>
                                    <div><p className={`font-bold mb-1.5`}>{lang == 'ar' ? orderDetails?.orderdata?.warehouse.showroom_arabic : orderDetails?.orderdata?.warehouse.showroom}</p>
                                        <p className={``}>{lang == 'ar' ? orderDetails?.orderdata?.warehouse?.showroom_address_arabic : orderDetails?.orderdata?.warehouse?.showroom_address} | 8002444464</p>
                                        <p className={`ont-medium text-xs`}>{lang == 'ar' ? orderDetails?.orderdata?.warehouse?.waybill_city_data?.name_arabic : orderDetails?.orderdata?.warehouse?.waybill_city_data?.name}, {lang == 'ar' ? orderDetails?.orderdata?.warehouse?.store_regions?.name_arabic : orderDetails?.orderdata?.warehouse?.store_regions?.name} | {lang == 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</p><div className="mt-3"></div>
                                    </div>
                                </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between text-sm">
                                        <label className="font-regular text-[#5D686F]">{lang == 'ar' ? 'العنوان' : 'Address'}</label>
                                    </div>
                                    <div className="flex items-center gap-x-2 mt-1 rtl:mt-2 text-[#004B7A] fill-[#004B7A] font-regular text-sm">
                                        <svg id="fi_3514361" height="28" viewBox="0 0 256 256" width="28" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m128 138.184a5 5 0 0 1 -3.607-1.538c-2.075-2.16-50.808-53.259-50.808-82.228a54.415 54.415 0 1 1 108.83 0c0 28.969-48.733 80.068-50.808 82.228a5 5 0 0 1 -3.607 1.538zm0-128.184a44.465 44.465 0 0 0 -44.415 44.418c0 19.07 29.312 54.978 44.414 71.451 15.1-16.478 44.416-52.4 44.416-71.451a44.465 44.465 0 0 0 -44.415-44.418z"></path><path d="m128 76.153a21.735 21.735 0 1 1 21.735-21.735 21.759 21.759 0 0 1 -21.735 21.735zm0-33.47a11.735 11.735 0 1 0 11.735 11.735 11.748 11.748 0 0 0 -11.735-11.735z"></path><path d="m128.126 256a4.992 4.992 0 0 1 -2.5-.67l-77.175-44.559a5 5 0 0 1 -2.5-4.331v-38.385a5 5 0 0 1 10 0v35.5l72.175 41.67 72.174-41.67v-35.88a5 5 0 0 1 10 0v38.765a5 5 0 0 1 -2.5 4.331l-77.174 44.556a4.992 4.992 0 0 1 -2.5.673z"></path><path d="m128.126 166.884a4.992 4.992 0 0 1 -2.5-.67l-77.175-44.557a5 5 0 1 1 5-8.66l74.675 43.113 74.674-43.11a5 5 0 1 1 5 8.66l-77.174 44.557a4.992 4.992 0 0 1 -2.5.667z"></path><path d="m160.933 198.291a5 5 0 0 1 -3.459-1.389l-32.806-31.402a5 5 0 0 1 6.916-7.224l30.1 28.813 68.154-39.349-27.558-26.382-27.359-15.744a5 5 0 1 1 4.988-8.667l27.885 16.047a4.988 4.988 0 0 1 .964.721l32.806 31.407a5 5 0 0 1 -.958 7.942l-77.174 44.557a4.993 4.993 0 0 1 -2.499.67z"></path><path d="m95.067 198.525a4.985 4.985 0 0 1 -2.5-.67l-77.173-44.555a5 5 0 0 1 -.957-7.942l33.057-31.642a4.967 4.967 0 0 1 .957-.718l27.634-15.955a5 5 0 1 1 5 8.66l-27.112 15.653-27.807 26.616 68.154 39.348 30.349-29.048a5 5 0 1 1 6.914 7.224l-33.058 31.641a4.991 4.991 0 0 1 -3.458 1.388z"></path></svg>
                                        <div>
                                            <p className="font-bold mb-1.5">{orderDetails?.orderdata?.address?.address_label == 1 ? lang == 'ar' ? 'الــمنـــزل' : 'Home' : lang == 'ar' ? 'مكتب' : 'Office'}</p>
                                            <label className="">{orderDetails?.orderdata?.address?.address}</label>
                                            <p className="font-medium text-xs">{lang == 'ar' ? orderDetails?.orderdata?.address?.state_data?.name_arabic : orderDetails?.orderdata?.address?.state_data?.name}, {lang == 'ar' ? orderDetails?.orderdata?.address?.state_data?.region?.name_arabic : orderDetails?.orderdata?.address?.state_data?.region?.name} | {lang == 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="text-sm font-medium">
                                <p className="font-regular text-[#5D686F] text-sm">{lang == 'ar' ? 'الوقت المتوقع للتوصيل' : 'Expected time for delivery'}</p>
                                <label className="text-[#004B7A] font-regular text-sm mt-1">{dayjs().add(DeliveryDate, 'days').locale(lang == 'ar' ? 'ar' : 'en').format("MMM  DD, YYYY")}</label>
                                <hr className="opacity-10 my-3" />
                            </div>
                            <div className="text-sm font-medium">
                                <label className="font-regular text-[#5D686F]">{lang == 'ar' ? 'السعر الجزئي' : 'Sub Total'}</label>
                                <div className="gap-x-2 mt-1 rtl:mt-2 text-[#004B7A]">
                                    <label className="flex gap-x-1 items-center">{Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price)}{' '}{currencySymbol}</label>
                                </div>
                                {!loyaltyPointCheck ? <hr className="opacity-10 my-3" /> : null}
                            </div>
                            {!loyaltyPointCheck ? 
                                <>
                                <div className="text-sm font-medium">
                                    <div className='text-sm font-medium flex items-center justify-between'>
                                        <div>
                                            <label className="font-regular text-[#5D686F]">{lang == 'ar' ? 'الدفع عن طريق' : 'Payment via'}{' '}
                                                <span className="font-bold text-[#004B7A]">
                                                    {
                                                        orderDetails?.orderdata?.paymentmethod == 'tamara' ? lang == 'ar' ? 'تمارا' : 'Tamara'
                                                            : orderDetails?.orderdata?.paymentmethod == 'tabby' ? lang == 'ar' ? 'تابي' : 'Tabby'
                                                                : orderDetails?.orderdata?.paymentmethod == 'tasheel' ? lang == 'ar' ? 'بسيطه' : 'Baseeta'
                                                                    : orderDetails?.orderdata?.paymentmethod == 'madapay' ? lang == 'ar' ? 'بطاقات مدى' : 'Mada Card'
                                                                        : orderDetails?.orderdata?.paymentmethod == 'applepay' ? lang == 'ar' ? 'آبل باي' : 'Apple Pay'
                                                                            : orderDetails?.orderdata?.paymentmethod == 'hyperpay' ? lang == 'ar' ? 'البطاقات الإئتمانية' : 'Debit & Credit Card'
                                                                                : orderDetails?.orderdata?.paymentmethod == 'cod' ? lang == 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'
                                                                                    : null
                                                    }
                                                </span>
                                            </label>
                                            <div className="gap-x-2 mt-1 rtl:mt-2 text-[#004B7A]">
                                                {orderDetails?.orderdata?.status === 5 ?
                                                    <label>{lang == 'ar' ? 'إلغاء الأمر' : 'Order Has been Canceled'}</label>
                                                    :
                                                    orderDetails?.orderdata?.status === 6 ?
                                                        <label>{lang == 'ar' ? 'تم رد الطلب' : 'Refunded'}</label>
                                                        :
                                                        orderDetails?.orderdata?.status === 7 ?
                                                            <label>{lang == 'ar' ? 'فشل الطلب' : 'Failed'}</label>
                                                            :
                                                            orderDetails?.orderdata?.status === 8 ?
                                                                <label>{lang == 'ar' ? 'في انتظار الدفع' : 'Pending For Payment'}</label>
                                                                :
                                                                <label>
                                                                    {
                                                                        orderDetails?.orderdata?.paymentmethod == 'tamara' ? lang == 'ar' ? `غدا تقسيط علي 4 شهور بمبلغ ${Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price / 4)} ريال في الشهر` : `Installments for 4 months at an amount of SR ${Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price / 4)} per month`
                                                                            : orderDetails?.orderdata?.paymentmethod == 'tabby' ? lang == 'ar' ? `غدا تقسيط علي 4 شهور بمبلغ ${Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price / 4)} ريال في الشهر` : `Installments for 4 months at an amount of SR ${Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price / 4)} per month`
                                                                                : orderDetails?.orderdata?.paymentmethod == 'tasheel' ? lang == 'ar' ? `غدا تقسيط علي 36 شهور بمبلغ ${Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price / 36)} ريال في الشهر` : `Installments for 36 months at an amount of SR ${Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price / 36)} per month`
                                                                                    : orderDetails?.orderdata?.paymentmethod == 'madapay' ? lang == 'ar' ? `الدفع النقدي ${Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price)}` : `Instant pay SR ${Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price)}`
                                                                                        : orderDetails?.orderdata?.paymentmethod == 'applepay' ? lang == 'ar' ? `الدفع النقدي ${Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price)}` : `Instant pay SR ${Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price)}`
                                                                                            : orderDetails?.orderdata?.paymentmethod == 'hyperpay' ? lang == 'ar' ? `الدفع النقدي ${Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price)}` : `Instant pay SR ${Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price)}`
                                                                                                : orderDetails?.orderdata?.paymentmethod == 'cod' ? lang == 'ar' ? `الدفع عند الاستلام ${Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price)}` : `Paid upon delivery SR ${Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary.filter((element: any) => element.type == 'total')[0]?.price)}`
                                                                                                    : null
                                                                    }
                                                                    {currencySymbol}
                                                                </label>
                                                }
                                            </div>
                                        </div>
                                        {orderDetails?.orderdata?.paymentmethod == 'hyperpay' ?
                                            <Image
                                                src={lang == 'ar' ? '/images/master.webp' : '/images/master.webp'}
                                                alt={orderDetails?.orderdata?.paymentmethod}
                                                title={orderDetails?.orderdata?.paymentmethod}
                                                height={60}
                                                width={60}
                                                loading='lazy'
                                                className="rounded-md"
                                            />
                                            : null}
                                        {orderDetails?.orderdata?.paymentmethod == 'madapay' ?
                                            <Image
                                                src={lang == 'ar' ? '/images/mada.webp' : '/images/mada.webp'}
                                                alt={orderDetails?.orderdata?.paymentmethod}
                                                title={orderDetails?.orderdata?.paymentmethod}
                                                height={60}
                                                width={60}
                                                loading='lazy'
                                                className="rounded-md"
                                            />
                                            : null}
                                        {orderDetails?.orderdata?.paymentmethod == 'applepay' ?
                                            <Image
                                                src={lang == 'ar' ? '/images/applepay.webp' : '/images/applepay.webp'}
                                                alt={orderDetails?.orderdata?.paymentmethod}
                                                title={orderDetails?.orderdata?.paymentmethod}
                                                height={60}
                                                width={60}
                                                loading='lazy'
                                                className="rounded-md"
                                            />
                                            : null}
                                        {orderDetails?.orderdata?.paymentmethod == 'cod' ?
                                            <Image
                                                src={lang == 'ar' ? '/images/cod.webp' : '/images/cod.webp'}
                                                alt={orderDetails?.orderdata?.paymentmethod}
                                                title={orderDetails?.orderdata?.paymentmethod}
                                                height={60}
                                                width={60}
                                                loading='lazy'
                                                className="rounded-md"
                                            />
                                            : null}
                                        {orderDetails?.orderdata?.paymentmethod == 'tabby' ?
                                            <Image
                                                src={lang == 'ar' ? '/images/tabby-ar.webp' : '/images/tabby-en.webp'}
                                                alt={orderDetails?.orderdata?.paymentmethod}
                                                title={orderDetails?.orderdata?.paymentmethod}
                                                height={60}
                                                width={60}
                                                loading='lazy'
                                                className="rounded-md"
                                            />
                                            : null}
                                        {orderDetails?.orderdata?.paymentmethod == 'tamara' ?
                                            <Image
                                                src={lang == 'ar' ? '/images/tamara-ar.webp' : '/images/tamara-en.webp'}
                                                alt={orderDetails?.orderdata?.paymentmethod}
                                                title={orderDetails?.orderdata?.paymentmethod}
                                                height={60}
                                                width={60}
                                                loading='lazy'
                                                className="rounded-md"
                                            />
                                            : null}
                                        {orderDetails?.orderdata?.paymentmethod == 'tasheel' ?
                                            <Image
                                                src={lang == 'ar' ? '/images/baseeta.webp' : '/images/baseeta.webp'}
                                                alt={orderDetails?.orderdata?.paymentmethod}
                                                title={orderDetails?.orderdata?.paymentmethod}
                                                height={60}
                                                width={60}
                                                loading='lazy'
                                                className="rounded-md"
                                            />
                                            : null}
                                    </div>
                                </div>
                                </>
                            :null}
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 2xl:w-1/3 text-right ltr:text-left">
                        <h3 className='text-base md:text-lg font-bold md:mb-3 max-md:mt-3'>{lang == 'ar' ? 'قائمة المنتجات الخاصة بك' : 'Products'}</h3>
                        <span className="text-[#5D686F] text-xs font-light">{lang == 'ar' ? `لديك (${orderDetails?.orderdata?.details_count}) منتجات في العربة` : `You have (${orderDetails?.orderdata?.details_count}) products in the cart`}</span>
                        <div className="mt-2">
                            {orderDetails?.orderdata?.details?.map((data: any, i: number) => {
                                return (
                                    <div className="bg-white rounded-md shadow-md flex items-center gap-x-4 mb-4 p-3" key={data?.product_data?.id}>
                                        <div className="relative">
                                            <Image
                                                src={data?.product_data?.featured_image?.image ? NewMedia + data?.product_data?.featured_image?.image : 'https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                                alt={lang == 'ar' ? data?.product_data?.name_arabic : data?.product_data?.name}
                                                title={lang == 'ar' ? data?.product_data?.name_arabic : data?.product_data?.name}
                                                quality={100}
                                                height={100}
                                                width={100}
                                                loading='lazy'
                                                className="rounded-md mx-auto"
                                                sizes="(max-width: 960px) 50vw, (max-width: 1024px) 50vw, (max-width: 1650px) 50vw, (max-width: 1920px) 60vw, 100vw"
                                            />
                                            {data?.product_data?.regular_price > data?.product_data?.price ? <div className='text-[#EA4335] text-xs absolute ltr:left-0 rtl:right-0 top-0 bg-[#EA433520] px-3.5 py-1 rtl:rounded-bl-lg ltr:rounded-br-lg ltr:rounded-tl-lg'>{lang == 'ar' ? Math.round(((data?.product_data?.regular_price - data?.product_data?.price) * 100) / data?.product_data?.regular_price) + '% خصم' : Math.round(((data?.product_data?.regular_price - data?.product_data?.price) * 100) / data?.product_data?.regular_price) + '% OFF'}</div> : null}
                                        </div>
                                        <div className="w-full">
                                            {data?.expressproduct && orderDetails?.orderdata?.order_type != 1 ?
                                                <>
                                                    <p className="text-xs text-[#DC4E4E] font-medium">{lang === 'ar' ? 'اطلب مسبقًا الآن' : 'Express Delivery'}</p>
                                                    <p className="text-xs text-primary font-medium mb-2">{lang === 'ar' ? 'سلمت بواسطة' : 'Delivered by'}: {dayjs().add(orderDetails?.orderdata?.express_days, 'days').locale(lang == 'ar' ? 'ar' : 'en').format("MMM DD, YYYY")}</p>
                                                </>
                                                : null}
                                            {data?.pre_order && orderDetails?.orderdata?.order_type != 1 ?
                                                <>
                                                    <p className="text-sm text-[#DC4E4E] font-medium">{lang === 'ar' ? 'اطلب مسبقًا الآن' : 'Pre-Order Now'}</p>
                                                    <p className="text-sm text-primary font-medium">{lang === 'ar' ? 'سلمت بواسطة' : 'Delivered by'}: {dayjs().add(data?.pre_order_day, 'days').locale(lang == 'ar' ? 'ar' : 'en').format("MMM DD, YYYY")}</p>
                                                </>
                                                : null}
                                            {data?.express && orderDetails?.orderdata?.order_type != 1 ?
                                                <p className="text-sm text-[#DC4E4E] font-medium">{lang === 'ar' ? 'تسليم سريع' : 'Express Delivery'}</p>
                                                : null}
                                            <h4 className="text-primary text-sm line-clamp-2">{lang == 'ar' ? data?.product_data?.name_arabic : data?.product_data?.name}</h4>
                                            {data?.total != 0 ?
                                                <h2 className="text-lg  font-semibold text-dark mt-2 flex gap-x-1 items-center">
                                                    {data?.total?.toLocaleString('EN-US')}{'  '}{currencySymbol}
                                                    {data?.product_data?.sale_price ?
                                                        <span className="text-sm text-[#DC4E4E] line-through decoration-[#DC4E4E] decoration-2 font-medium">
                                                            {data?.product_data?.price.toLocaleString('EN-US')}
                                                        </span>
                                                        : null}
                                                </h2>
                                                :
                                                <h2 className="text-xs  font-semibold text-[#DC4E4E] mt-2">
                                                    {lang == 'ar' ? 'حر' : 'Free'}
                                                </h2>
                                            }

                                            <div className="text-[#5D686F] text-sm flex items-center gap-x-2 mt-4 justify-between w-full">
                                                <div className="flex items-center gap-x-2">
                                                    <p>{lang == 'ar' ? 'العلامة' : 'Brand'}:</p>
                                                    {data?.product_data?.brand?.brand_media_image ?
                                                        <Image
                                                            src={data?.product_data?.brand?.brand_media_image ? NewMedia + data?.product_data?.brand?.brand_media_image?.image : 'https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                                            alt={lang == 'ar' ? data?.product_data?.brand?.name_arabic : data?.product_data?.brand?.name}
                                                            title={lang == 'ar' ? data?.product_data?.brand?.name_arabic : data?.product_data?.brand?.name}
                                                            quality={100}
                                                            height={60}
                                                            width={60}
                                                            className="h-full"
                                                            loading='lazy'
                                                            sizes="(max-width: 960px) 50vw, (max-width: 1024px) 50vw, (max-width: 1650px) 50vw, (max-width: 1920px) 60vw, 100vw"
                                                        />
                                                        :
                                                        <p className="font-bold text-xs">{lang == 'ar' ? data?.product_data?.brand?.name_arabic : data?.product_data?.brand?.name}</p>
                                                    }
                                                </div>
                                                <p className="font-bold">{lang == 'ar' ? 'عدد' : 'Qty'} {data?.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 w-full p-3 bg-white shadow-md border-t border-[#5D686F26]">
                <button
                    type="button"
                    onClick={() => router.push(`${origin}/${lang}`)}
                    className="focus-visible:outline-none bg-[#004B7A] border border-[#004B7A] hover:bg-[#00446f] hover:border-[#00446f] text-white w-full rounded-md p-2.5 text-sm font-medium flex items-center justify-center">
                    {lang == 'ar' ? 'اكمال التسوق' : 'Shop Now'}
                </button>
            </div>
        </>
    )
}