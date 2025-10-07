"use client"; // This is a client component 👈🏽

import React, { useEffect, useState, use } from 'react';
import { getOrderId, removeCart } from '../../cartstorage/cart';
import { useRouter } from "next/navigation"
import dynamic from 'next/dynamic';
import { useApp } from '@/app/_ctx/AppContext';
import { hyperpayUpdate, misspayUpdate, orderUpdate } from '@/lib/paymentstatus/paymentstatus.client';
const FullPageLoader = dynamic(() => import('@/components/FullPageLoader'), { ssr: false })

export default function PaymentStatus(
    props: { searchParams: Promise<any> }
) {
    const { lang, slugStr, deviceType, origin } = useApp();
    const searchParams = use(props.searchParams);
    const [paymentmethod, setpaymentmethod] = useState<any>(false);
    const [paymentid, setpaymentid] = useState<any>(false);
    const [orderId, setorderId] = useState<any>(false);
    const [type, settype] = useState<any>(false);
    const router = useRouter();
    const [loaderStatus, setLoaderStatus] = useState<any>(false)

   useEffect(() => {
        setupData()
        setLoaderStatus(true)
    }, [])

    useEffect(() => {
        if (paymentid)
            submitOrder()
    }, [paymentid])

    useEffect(() => {
        if (orderId)
            submitProcess()
    }, [orderId])

    const submitOrder = async () => {
        const orderData = await orderUpdate(orderId, paymentid);
        const responseJson = orderData.userOrderDetails
        removeCart()
        router.push(`${origin}/${lang}/checkout/congratulations/${orderId}`);

    }

    const setupData = async () => {
        var paydata: any = slugStr?.split('-')
        await setpaymentmethod(paydata[0])
        await settype(paydata[1])
        await setorderId(getOrderId())

    }

    const pushGTMEvent = () => {
    if (typeof window === 'undefined' || !window.dataLayer) return;
        window.dataLayer.push({ ecommerce: null });

        window.dataLayer.push({
            event: "payment_failed",
            platform: deviceType,
            method: paymentmethod,
            reason: "insufficent balance", // currency
            
        });
    }

    const submitProcess = async () => {
        if (paymentmethod == 'hyperpay') {
            const orderData = await hyperpayUpdate(orderId, searchParams.id);
            const responseJson = orderData.userOrderDetails
            if (responseJson.status === true) {
                await setpaymentid(searchParams.id)
            }
            else {
                pushGTMEvent();
                router.push(`${origin}/${lang}/checkout`);
            }

        }
        else if (paymentmethod == 'clickpay' || paymentmethod == 'clickpay_applepay') {
            if (searchParams?.respStatus == 'A') {
                await setpaymentid(searchParams?.tranRef)
            }
            else {
                pushGTMEvent();
                router.push(`${origin}/${lang}/checkout`);
            }
        }
        else if (paymentmethod == 'mispay') {
            const orderData = await misspayUpdate(orderId, searchParams._);
            const responseJson = orderData.userOrderDetails
            if (responseJson.status === true) {
                await setpaymentid(responseJson.id)
            }
            else {
                pushGTMEvent();
                router.push(`${origin}/${lang}/checkout`);
            }
        }
        else {
            if (type != 'success') {
                pushGTMEvent();
                router.push(`${origin}/${lang}/checkout`);
            }
            else {
                if (paymentmethod == 'tamara') {
                    await setpaymentid(searchParams.orderId)
                }
                if (paymentmethod == 'tabby') {
                    await setpaymentid(searchParams.payment_id)
                }
                if (paymentmethod == 'madfu') {
                    await setpaymentid('madfu')
                }
            }
        }
    }

    return (
        <>
            <FullPageLoader loader={loaderStatus} Text={lang === 'ar' ? '' : `Please wait!`} TextTwo={lang === 'ar' ? '' : `While We Are Confirming Your Transaction ...`} />
        </>
    )
}
