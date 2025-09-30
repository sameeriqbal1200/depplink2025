"use client"; // This is a client component 👈🏽

import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { RadioGroup } from '@headlessui/react';
import { useApp } from "@/app/_ctx/AppContext";

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function Setting() {
    const router = useRouter()
    const { lang, deviceType } = useApp();
    const [selected, setSelected] = useState(lang)
    const [notificationEnabled, setNotificationEnabled] = useState<any>(true)
    const path = usePathname();
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [cityData, setCityData] = useState<any>('')
    const [location, setLocation] = useState();
    const [BtnLoader, setBtnLoader] = useState(false)


    const changeLang = (lang: string) => {
        // var url = path.replace(`/${lang}`, `/${lang}`);
        setGtmUserProfileAttr(lang)
        router.push(`/${lang}`)
        router.refresh()
    };

    useEffect(() => {
        if (localStorage.getItem('globalcity')) {
            setCityData(localStorage.getItem('globalcity'))
        }
        if (localStorage.getItem('globalNotification')) {
            setNotificationEnabled(localStorage.getItem('globalNotification') == '1' ? true : false)
        }
    }, [])

    const getLocation = () => {
        setBtnLoader(true)
        if ('geolocation' in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                setLatitude(coords.latitude)
                setLongitude(coords.longitude)
                const latitude = coords.latitude;
                const longitude = coords.longitude;
                fetchApiData({ latitude, longitude })
            })
        }
        if (location) {
            fetchApiData(location);
        }
    }

    const fetchApiData = async ({ latitude, longitude }: { latitude: number, longitude: number }) => {
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=${lang}&sensor=true&key=AIzaSyB3ekz5eMwuRZGvFy2HUADZVhxAzTWV5Ok`);
        const data = await res?.json();

        for (var a = 0; a < data?.results[0]["address_components"]?.length; a++) {
            if (
                data?.results[0]["address_components"][a]?.types[0] ==
                "administrative_area_level_2" &&
                data?.results[0]["address_components"][a]?.types[1] == "political"
            ) {
                setCityData(data?.results[0]["address_components"][a]["long_name"]);
                localStorage.setItem("globalcity", data?.results[0]["address_components"][a]["long_name"].toString());
            }
        };
        setBtnLoader(false)
    };

    const setGtmUserProfileAttr = (lang: any) => {
        var wind: any = typeof window !== "undefined" ? window.dataLayer : "";
        wind = wind || [];

        try {
            const storedProfile = localStorage.getItem('userProfileData');
            let userProfileAtt = storedProfile ? JSON.parse(storedProfile) : {};
            const newLanguage = lang || 'ar'; // Default to 'ar' if lang is not provided
            userProfileAtt = {
                ...userProfileAtt,
                store_language: newLanguage
            };
            const fullName = localStorage.getItem('fullName');
            const userEmail = localStorage.getItem('eMail');
            const userPhone: any = `966${localStorage.getItem('phoneNumber')}`;
            const [firstname, ...lastname] = fullName?.trim().split(' ') || [];
            const platform = deviceType
            localStorage.setItem('userProfileData', JSON.stringify(userProfileAtt));
            wind.push({
                event: "global_variables",
                account_creation_date: dayjs(userProfileAtt?.account_creation_date, 'DD-MM-YYYY hh:mm A').isValid() ? dayjs(userProfileAtt.account_creation_date, 'DD-MM-YYYY hh:mm A').locale('en').format('DD-MM-YYYY hh:mm A') : '',
                user_id: String(userProfileAtt?.backend_user_id ?? ''),
                email: userEmail ?? '',
                phone: userPhone ?? '',
                last_purchase_date: dayjs(userProfileAtt?.last_purchase_date, 'DD-MM-YYYY hh:mm A').isValid() ? dayjs(userProfileAtt.last_purchase_date, 'DD-MM-YYYY hh:mm A').locale('en').format('DD-MM-YYYY hh:mm A') : '',
                store_language: userProfileAtt?.store_language ?? 'ar',
                total_purchases: userProfileAtt?.total_purchases ?? 0,
                total_revenue: userProfileAtt?.total_revenue ?? 0,
                user_data_source: platform,
                platform: platform
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    return (
        <div>
            <MobileHeader type="Third" pageTitle={lang == 'ar' ? 'شحن إلى' : 'Setting'} lang={lang} />
            <div className="container py-16 md:py-4">
                <div className="mt-4">
                    <h2 className="font-semibold text-base">{lang === 'ar' ? 'لغة' : 'Language'}</h2>
                    <RadioGroup value={selected} onChange={(e) => {
                        changeLang(e)
                        setSelected(e)
                    }}>
                        <div className="space-y-3 mt-1.5">
                            <RadioGroup.Option
                                value={'en'}
                                className={({ active, checked }) => `${checked ? 'border border-[#219EBC]' : 'border border-[#00000000]'} relative cursor-pointer rounded-md px-5 py-4 shadow-md focus:outline-none bg-white `}
                            >
                                {({ active, checked }) => (
                                    <>
                                        <div className="flex w-full items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <svg height="32" viewBox="0 0 64 64" width="32" xmlns="http://www.w3.org/2000/svg" id="fi_3373318"><g id="Layer_50" data-name="Layer 50"><path d="m4 44.55h56v2.79h-56z" fill="#fff"></path><path d="m4 38.97h56v2.79h-56z" fill="#fff"></path><path d="m4 33.39h56v2.79h-56z" fill="#fff"></path><path d="m4 27.82h56v2.79h-56z" fill="#fff"></path><path d="m4 22.24h56v2.79h-56z" fill="#fff"></path><path d="m4 16.66h56v2.79h-56z" fill="#fff"></path><path d="m4 47.34h56v2.79h-56z" fill="#bd3d44"></path><path d="m4 41.76h56v2.79h-56z" fill="#bd3d44"></path><path d="m4 36.18h56v2.79h-56z" fill="#bd3d44"></path><path d="m4 30.61h56v2.79h-56z" fill="#bd3d44"></path><path d="m4 25.03h56v2.79h-56z" fill="#bd3d44"></path><path d="m4 19.45h56v2.79h-56z" fill="#bd3d44"></path><path d="m4 13.87h56v2.79h-56z" fill="#bd3d44"></path><path d="m4 13.87h23.61v16.46h-23.61z" fill="#192f5d"></path><g fill="#fff"><path d="m5.64 16.48.56-.41.56.41-.21-.66.56-.4h-.69l-.22-.66-.21.66h-.69l.56.4z"></path><path d="m6.2 18.01-.21.66h-.69l.56.4-.22.66.56-.41.56.41-.21-.66.56-.4h-.69z"></path><path d="m6.2 21.26-.21.66h-.69l.56.4-.22.66.56-.41.56.41-.21-.66.56-.4h-.69z"></path><path d="m6.2 24.51-.21.65h-.69l.56.41-.22.66.56-.41.56.41-.21-.66.56-.41h-.69z"></path><path d="m6.42 28.41-.22-.65-.21.65h-.69l.56.41-.22.66.56-.41.56.41-.21-.66.56-.41z"></path><path d="m9.29 16.48.56-.41.55.41-.21-.66.56-.4h-.69l-.21-.66-.22.66h-.69l.56.4z"></path><path d="m9.85 18.01-.22.66h-.69l.56.4-.21.66.56-.41.55.41-.21-.66.56-.4h-.69z"></path><path d="m9.85 21.26-.22.66h-.69l.56.4-.21.66.56-.41.55.41-.21-.66.56-.4h-.69z"></path><path d="m9.85 24.51-.22.65h-.69l.56.41-.21.66.56-.41.55.41-.21-.66.56-.41h-.69z"></path><path d="m10.06 28.41-.21-.65-.22.65h-.69l.56.41-.21.66.56-.41.55.41-.21-.66.56-.41z"></path><path d="m12.93 16.48.56-.41.55.41-.21-.66.56-.4h-.69l-.21-.66-.22.66h-.69l.56.4z"></path><path d="m13.49 18.01-.22.66h-.69l.56.4-.21.66.56-.41.55.41-.21-.66.56-.4h-.69z"></path><path d="m13.49 21.26-.22.66h-.69l.56.4-.21.66.56-.41.55.41-.21-.66.56-.4h-.69z"></path><path d="m13.49 24.51-.22.65h-.69l.56.41-.21.66.56-.41.55.41-.21-.66.56-.41h-.69z"></path><path d="m13.7 28.41-.21-.65-.22.65h-.69l.56.41-.21.66.56-.41.55.41-.21-.66.56-.41z"></path><path d="m16.57 16.48.56-.41.56.41-.22-.66.56-.4h-.69l-.21-.66-.22.66h-.68l.55.4z"></path><path d="m17.13 18.01-.22.66h-.68l.55.4-.21.66.56-.41.56.41-.22-.66.56-.4h-.69z"></path><path d="m17.13 21.26-.22.66h-.68l.55.4-.21.66.56-.41.56.41-.22-.66.56-.4h-.69z"></path><path d="m17.13 24.51-.22.65h-.68l.55.41-.21.66.56-.41.56.41-.22-.66.56-.41h-.69z"></path><path d="m17.34 28.41-.21-.65-.22.65h-.68l.55.41-.21.66.56-.41.56.41-.22-.66.56-.41z"></path><path d="m20.21 16.48.56-.41.56.41-.22-.66.56-.4h-.69l-.21-.66-.21.66h-.69l.56.4z"></path><path d="m20.77 18.01-.21.66h-.69l.56.4-.22.66.56-.41.56.41-.22-.66.56-.4h-.69z"></path><path d="m20.77 21.26-.21.66h-.69l.56.4-.22.66.56-.41.56.41-.22-.66.56-.4h-.69z"></path><path d="m20.77 24.51-.21.65h-.69l.56.41-.22.66.56-.41.56.41-.22-.66.56-.41h-.69z"></path><path d="m20.98 28.41-.21-.65-.21.65h-.69l.56.41-.22.66.56-.41.56.41-.22-.66.56-.41z"></path><path d="m23.86 16.48.55-.41.56.41-.21-.66.56-.4h-.69l-.22-.66-.21.66h-.69l.56.4z"></path><path d="m24.41 18.01-.21.66h-.69l.56.4-.21.66.55-.41.56.41-.21-.66.56-.4h-.69z"></path><path d="m24.41 21.26-.21.66h-.69l.56.4-.21.66.55-.41.56.41-.21-.66.56-.4h-.69z"></path><path d="m24.41 24.51-.21.65h-.69l.56.41-.21.66.55-.41.56.41-.21-.66.56-.41h-.69z"></path><path d="m24.63 28.41-.22-.65-.21.65h-.69l.56.41-.21.66.55-.41.56.41-.21-.66.56-.41z"></path><path d="m7.47 18.27.55-.41.56.41-.21-.66.56-.41h-.69l-.22-.65-.21.65h-.69l.56.41z"></path><path d="m8.02 19.8-.21.65h-.69l.56.41-.21.65.55-.4.56.4-.21-.65.56-.41h-.69z"></path><path d="m8.02 23.05-.21.65h-.69l.56.41-.21.65.55-.4.56.4-.21-.65.56-.41h-.69z"></path><path d="m8.02 26.3-.21.65h-.69l.56.41-.21.65.55-.4.56.4-.21-.65.56-.41h-.69z"></path><path d="m11.11 18.27.56-.41.55.41-.21-.66.56-.41h-.69l-.21-.65-.22.65h-.69l.56.41z"></path><path d="m11.67 19.8-.22.65h-.69l.56.41-.21.65.56-.4.55.4-.21-.65.56-.41h-.69z"></path><path d="m11.67 23.05-.22.65h-.69l.56.41-.21.65.56-.4.55.4-.21-.65.56-.41h-.69z"></path><path d="m11.67 26.3-.22.65h-.69l.56.41-.21.65.56-.4.55.4-.21-.65.56-.41h-.69z"></path><path d="m14.75 18.27.56-.41.56.41-.22-.66.56-.41h-.69l-.21-.65-.21.65h-.7l.56.41z"></path><path d="m15.31 19.8-.21.65h-.7l.56.41-.21.65.56-.4.56.4-.22-.65.56-.41h-.69z"></path><path d="m15.31 23.05-.21.65h-.7l.56.41-.21.65.56-.4.56.4-.22-.65.56-.41h-.69z"></path><path d="m15.31 26.3-.21.65h-.7l.56.41-.21.65.56-.4.56.4-.22-.65.56-.41h-.69z"></path><path d="m18.39 18.27.56-.41.56.41-.22-.66.56-.41h-.69l-.21-.65-.21.65h-.69l.56.41z"></path><path d="m18.95 19.8-.21.65h-.69l.56.41-.22.65.56-.4.56.4-.22-.65.56-.41h-.69z"></path><path d="m18.95 23.05-.21.65h-.69l.56.41-.22.65.56-.4.56.4-.22-.65.56-.41h-.69z"></path><path d="m18.95 26.3-.21.65h-.69l.56.41-.22.65.56-.4.56.4-.22-.65.56-.41h-.69z"></path><path d="m22.03 18.27.56-.41.56.41-.21-.66.55-.41h-.69l-.21-.65-.21.65h-.69l.56.41z"></path><path d="m22.59 19.8-.21.65h-.69l.56.41-.22.65.56-.4.56.4-.21-.65.55-.41h-.69z"></path><path d="m22.59 23.05-.21.65h-.69l.56.41-.22.65.56-.4.56.4-.21-.65.55-.41h-.69z"></path><path d="m22.59 26.3-.21.65h-.69l.56.41-.22.65.56-.4.56.4-.21-.65.55-.41h-.69z"></path></g></g></svg>
                                                <label className="font-semibold text-sm">English</label>
                                            </div>
                                            {checked ?
                                                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                                                    <circle cx={12} cy={12} r={12} fill="#219EBC" opacity="0.2" />
                                                    <path
                                                        d="M7 13l3 3 7-7"
                                                        stroke="#219EBC"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                :
                                                <svg viewBox="0 0 24 24" fill="#219EBC60" className="h-6 w-6">
                                                    <circle cx={12} cy={12} r={12} fill="#219EBC60" opacity={0.2} />
                                                </svg>
                                            }
                                        </div>
                                    </>
                                )}
                            </RadioGroup.Option>
                            <RadioGroup.Option
                                value={'ar'}
                                className={({ active, checked }) => `${checked ? 'border border-[#219EBC]' : 'border border-[#00000000]'} relative cursor-pointer rounded-md px-5 py-4 shadow-md focus:outline-none mb-3 bg-white `}>
                                {({ active, checked }) => (
                                    <>
                                        <div className="flex w-full items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <svg id="fi_14063267" enableBackground="new 0 0 64 64" height="28" viewBox="0 0 64 64" width="28" xmlns="http://www.w3.org/2000/svg"><g><g><path d="m63 47.2c0 3.4-2.7 6.1-6 6.1h-50c-3.3 0-6-2.7-6-6.1v-30.4c0-3.4 2.7-6.1 6-6.1h50c3.3 0 6 2.7 6 6.1z" fill="#096"></path><path d="m7 10.7h50c3.3 0 6 2.7 6 6.1v30.4c0 3.4-2.7 6.1-6 6.1" fill="#038e5c"></path><g fill="#007a54"><path d="m63 47.2c0 3.4-2.7 6.1-6 6.1h-50c-3.3 0-6-2.7-6-6.1"></path><path d="m7 10.7h50c3.3 0 6 2.7 6 6.1v11.1"></path></g></g><g><g fill="#fff"><path d="m8.6 20.4c.4-.3.4.5 0 1.4.2-.3.6-1 .5-1.5-.1-.7-.5-.6-.8-.2-.2.3-.1.5.3.3z"></path><path d="m8.7 26.1c.5-.9.3-1.6.7-2.9.3-.8.3-.2.3.3-.2 1.3-.1 3.4 1.7 3.3.1 1.2.4 3.3.4 4.1 0 .7.1.5.3.1s.1-.9.1-1.5-.1-1.7-.2-3.2c.2-.2.5-.5.6-.7.2-.5.3-.4.4 0 .2.8 1 1.3 2 .5 1-.7.6-2.1.1-3.6.4.1.5-.2.3-.6-.1-.2-.3-.4-.4-.6-.2-.2-.3-.4-.5-.2s-.3.4-.4.5-.1.3 0 .6c.4.9.6 1.9.7 2.4s-.1.6-.5.6c-.3 0-.8-.1-1-.9s-.3-1.1-.2-1.7c0-.5.1-.9-.3-1.4s-.4-.4-.5-.2c-.1.3-.2.7-.1 1.2.2.7.3 1.3.4 1.7.1.3-.2.9-.7 1.2-.1-1-.2-2.2-.3-3.3.6-.2.3-.9-.2-1.7-.3-.6-.5-.4-.7 0s-.1.6.1.9c-.1.3.1.7.2 1.4.1.5.2 1.8.2 2.9-.4 0-.7-.3-.9-.7-.3-.8-.3-1.6-.1-2 .2-.5.3-1.2 0-1.4s-.6 0-.8.4c-.4.6-.8 1.4-.8 2.3 0 .3-.1 1-.3 1.3-.1.3-.4.3-.6-.1-.4-.6-.5-2.2-.5-3 0-.4-.1-.5-.2 0-.4 1.6.1 3.2.4 3.9.5.9 1 .7 1.3.1z"></path><path d="m13.5 20.9c.2-.2.2-.2.3 0s.4.2.5 0 .2-.3.1-.6c-.1-.2-.1-.1-.2.1-.1.4-.5.3-.5-.2s-.1-.2-.3.1c-.2.5-.5.4-.5-.1 0-.3-.1-.6-.3-.2-.1.3 0 .6.1.8.3.3.6.3.8.1z"></path><path d="m10.5 28.4c.3-.1.3-.1.3-.5s-.2-.2-.6-.1c-.6.2-1.8.8-2.7 1.9-.4.5-.1.3.2.1.5-.4 2-1.2 2.8-1.4z"></path><path d="m8.5 34.8c-.3.5-.9-.2-.5-1.5.1-.3.2-.5.2-.7s0-.4 0-.7c0-.2-.2.1-.3.5-.1.6-.5.9-.4 2.8.1 1.1 1.4 1.1 1.5-.3 0-.6-.2-.6-.5-.1z"></path><path d="m17.4 30.6c0-.5-.1-1-.1-1.5.1 0 .1-.1.2-.1.3.9 1.6.7 2 .1.2-.3.2-.3.4 0 .3.4 1.3.6 1.5 0s.2-1.2.1-1.6c-.1-.5-.2-.4-.5-.2s-.1.3 0 .6c.1 1.2-.9 1.1-1-.1-.1-.8-.2-.5-.3-.1-.5 1.5-1.8 1.8-1.6 0 0-.5-.3-.3-.5-.1-.1.1-.3.3-.4.4-.1-1.4-.2-3-.4-5 .4.5.8-.1.5-.6-.2-.4-.5-1.4-.7-1.9s-.3-.4-.7.1c-.4.4-.3.5-.2 1 0 .6 0 1.1.2 2.2.1.8.3 2.5.5 4.6-.2.1-.5.3-.7.4-.1-.4-.4-.6-.8-1-.6-.6-1-.6-1.5.1s-.4.8-.4 1.5c0 .6-.1.8.4 1s.7.1 1 0c.2-.1.5-.2.9-.3.1.3 0 .7-.2.9-1.2 1.4-3 2.5-3.8 1.5-.4-.5-.6-1.3-.5-2.3.1-.8-.1-.4-.2-.2-.3.9-.4 2.3 0 3 .5 1 1.4 1.4 2.8.7 1.4-.6 2.7-1.7 2.7-3.2 0-.3 0-.5 0-.7.2-.1.4-.2.5-.3v1.7c.1 1.6-.6 2.1-1.2 2.6-.8.6-1.9 1.1-2.9 1.2-2.2.3-2.7-1.1-2.7-3 0-.3.1-.5.1-.9 0-.8-.1-.7-.4.1-.2.8-.5 2.6.2 4.1.8 1.5 3.4 1.1 5.4.1 2.2-1.1 2.4-2.9 2.3-4.8zm-2.8-1.5c-.5.2-.7-.1-.6-.4 0-.3.1-.5.5-.3.2.1.4.3.6.6-.3.1-.4.1-.5.1z"></path><path d="m19.7 32.3c.2-.4.3-.8.2-1.3-.1-.3 0-.4-.3-.6-.3-.1-.4.1-.5.3-.1.3.1.7.5.5.1.2 0 .7-.1 1-.1.4 0 .5.2.1z"></path><path d="m20.5 24.2c-.4.5-.7 1.2-.1 1.6.3.2.9-.1 1.1-.5.2-.5.1-.6-.3-.1-.5.6-1.1.1-.5-.8.4-.6.1-.7-.2-.2z"></path><path d="m18.8 24.3c1.4-.6 2.2-1.4 2.6-2.1.4.1.5-.2.3-.5.1-.3.2-.5.3-.7.3-1.3-1-1.4-1.3-.4-.2.5-.2 1 .2 1.3-.6.8-1.4 1.5-2.4 2.1-.4.4-.3.6.3.3zm2.4-3.5c.1-.3.3-.1.3.1 0 .1-.1.3-.2.4-.2-.1-.2-.3-.1-.5z"></path></g><path d="m20.7 20.6c-.2.5-.2 1 .2 1.3-.1.1-.2.3-.3.4l.5.4c.1-.2.3-.3.4-.5.4.1.5-.2.3-.5.1-.3.2-.5.3-.7.2-1.3-1-1.4-1.4-.4zm.8.3c0 .1-.1.3-.2.4-.2-.1-.2-.3-.1-.5.1-.3.3-.1.3.1z" fill="#cfe7e8"></path><path d="m22.2 32.3c-.2.1-.5.4-.7.6 0-.4.1-1 .1-1.2 0-.3-.1-.4-.3-.1-.3.6-.6 1.4-.7 2-1.3.9-2.9 1.8-4 2.3-.5.2-.2.4.2.3 1.5-.5 2.7-.9 3.8-1.4.1.9.4 1.5 1.2 1.7 1.5.4 3-.9 4.7-3.2.4 1.1 1.4 2.6 4 3 1.1.2 1 .1 1.2-.5.1-.5.3-.6-.6-.8-1.1-.4-1.5-1.2-.4-1.7s2.6-.9 3.6-1.1c.7-.1.9-.1 1.1-.7.2-.7.3-.8-.4-.7-.8.1-4.6.2-5.6.1.8-.4 1.9-.8 2.7-1.1.3.2.4.1.3-.1.3-.1.6-.2.9-.4.9-.5 1.3-1.6.3-2.3s-1.8-.9-2.3-.2c-.4.6-.8 1.2-.2 2-.9.3-1.7.6-2.5.9-.6.2-.9.3-1.1 1.1s-.3.8.5.9c1.1 0 2.1 0 2.8.6-1.1.4-1.9 1.2-1.5 2.3-.5-.1-1-.3-1.4-.7-.8-.8-.8-2.2-1.1-3.8s-1-3-1.3-3.6c-.2-.6-.3-.3-.5.1s-.4.6-.2 1.2c.4 1 1 3 1.3 4.2-.6 1.4-2.2 3.1-3.5 3.3-1 .2-1.3-.4-1.2-.9.7-.4 1.3-.9 1.9-1.5 1.2-1.3 1.4-2.3.6-4.4.5.1.4-.3-.3-1.2-.5-.6-.6-.5-.9.1-.2.5-.4.9.2 1.1.1.3.3.7.6 1.2.6 1.3-.4 1.8-1.3 2.6zm9.5-4.4c0-.3.1-.3.6 0s.9.4.2.5c-.2.1-.5.1-.7.2 0-.3 0-.5-.1-.7z" fill="#fff"></path><g fill="#cfe7e8"><path d="m34.9 30.8c-.5 0-2.7.1-4.2.1l2 1.7c.5-.2 1.1-.3 1.5-.4.7-.1.9-.1 1.1-.7.2-.7.3-.8-.4-.7z"></path><path d="m25.1 26.1.2.2c0-.2-.1-.2-.2-.2z"></path><path d="m30.2 30.4c.6-.3 1.3-.5 1.8-.7.3.2.4.1.3-.1.3-.1.6-.2.9-.4.9-.5 1.3-1.6.3-2.3s-1.8-.9-2.3-.2c-.4.6-.8 1.2-.2 2-.7.2-1.3.4-1.9.7zm2.2-2.5c.5.3.9.4.2.5-.2.1-.5.1-.7.2-.1-.3-.1-.5-.1-.6-.1-.4.1-.4.6-.1z"></path></g><path d="m34 36c.3-.1.8-.4 1.2-.7.4-.4.1-.3-.2-.2s-.6.3-1 .4c-.4.2-.5 0-.3-.7.2-.6 0-.6-.3-.5s-.4.3-.7.5c-.2.1-.2.3.3.1.4-.2.3 0 .2.5-.2.5.1.8.8.6z" fill="#fff"></path><g fill="#cfe7e8"><path d="m24.7 25.1c.3-.7.5-1.4.7-1.9s.4-.4.3.1c-.1.9-.1 2.3.8 2.9.9.5 2.3-.4 2.8-1.4 1.5 1.9 2.8 1 2.9-.8 0-.6-.2-1.8-.4-2.2s0-.4.2-.2.6.4.4-.3c-.2-.6-.5-1-.8-1.3s-.4-.1-.5.1-.1.3-.3.5-.1.3 0 .6c.6 1.4 1.1 3.5.2 3.7-.8.2-1.3-1.6-1.3-2.4 0-1-.2-1.9-.4-2.5s-.3-.6-.5-.3c-.1.2-.1.4-.3.6-.1.2 0 .3.1.7.5 2.3.4 3.3-.6 3.9s-1.6 0-1.6-.7 0-1.6.1-2.2.2-.8 0-1.1-.4-.2-.7.2c-.6.9-1.3 2.4-1.5 3.1s-.7.5-1-.1c-.4-.7-.3-2-.2-2.6.1-.5.1-.7-.2-.2-.5 1.4-.5 2.8.6 4 .5.9.9.5 1.2-.2z"></path><path d="m27.5 22.4c0 .3 0 .7.2.1.1-.6.1-1.4-.1-1.9s-.3-.6-.5-.4-.2.3 0 .5c.2.3.5 1 .4 1.7z"></path><path d="m29.6 27.1c0 .8-.2.8-.5 0-.1-.3-.2-.3-.3.1 0 .7-.3.8-.5.1-.1-.3-.1-.6-.2-.1-.1.4 0 .7.2 1 .2.2.5.2.6-.1s.2-.3.4-.1 1 0 .6-1.1c-.2-.4-.3-.3-.3.2z"></path><path d="m37.7 20.8c.3.2.6.7.5 1.3-.1.5 0 .8.3.1s.1-1.5-.2-2-.4-.3-.6-.1c-.2.3-.3.6 0 .7z"></path><path d="m32.6 21.1c0 .3.1.5.5.6.8 1.1 1.7 2.3 2.5 3.4.1 1 .3 2 .4 2.9.2 2 .6 4.7.3 5.9-.2.9 0 1.2.4-.1s.4-2.6.1-4.5c-.1-.8-.1-1.7-.2-2.7 1.3 2.1 2.6 4.1 3.1 5.5.3.8.6.9.3-.1-.3-1.4-1.6-3.8-3.6-6.8-.1-.8-.1-1.6-.1-2.2.3.3.5.1.4-.3-.2-.8-.5-1.4-.8-2.2-.1-.4-.5-.4-.7.1-.2.6-.2.7 0 1.1 0 .5.1 1.2.2 1.9-.3-.5-.8-1.2-1.2-1.7.5.2.9.1.4-.5-.5-.5-1.2-1.1-1.6-1.5s-.6-.1-.6.2c.2.5.3.7.2 1z"></path><path d="m38.3 23.9c-.1.5-.3.3-.4-.1-.1-.2-.2-.1-.2.3.1.4.2.7.5.4.2-.2.2-.2.5 0 .2.2.4 0 .5-.1 0-.1.1-.3 0-.8s-.2-.2-.3.2-.3.5-.4 0c0-.4-.2-.3-.2.1z"></path><path d="m40.6 30.4c.1 1.8.3 2.6-.8 3.9-1.2 1.3-2 1.7-2.5 1.8-.7.2-.9.5.1.4 1.5-.1 1.7-.1 3-1.6.7-.8 1-1.8 1-4.2-.1-4.2-.6-6-.6-8.3.2.2.5.2.4-.2-.2-.5-.3-1.1-.4-1.6-.2-.5-.3-.7-.5-.4s-.4.4-.5.6-.2.5 0 .8c.6 4.9.7 7 .8 8.8z"></path><path d="m43.2 30.9c.1 1 .3 1.7 0 2.9-.1.3.1.5.3 0 .9-1.7.3-3.2.2-4.2-.1-1.5-.7-5.4-.8-7l.1.1c.4.2.9.4.6-.2-.3-.5-.6-1.4-.8-2s-.3-.6-.6-.1c-.6.8-.2 1.6 0 2.6.4 3.4.9 6.9 1 7.9z"></path><path d="m45.3 25.3c.3.3.5.9.7 1.2.2.5.4.1.4-.2s-.1-1.2 0-1.5c.2-.5.5.2.6-.1.1-.2-.1-.3-.2-.5-.1-.3-.2-.2-.4-.1-.2.2-.3.4-.3.5v1.1c0 .4-.1.4-.2.2-.1-.3-.4-1-.6-1.2s-.5-.1-.5.2v.5c0 .2.4.2.5-.1z"></path><path d="m45.1 29.2c0 .3.4-.1.7-.3s1.2-.8 1.6-1 .3-.3.2-.7c0-.4-.3-.1-.6.2s-1.2.9-1.5 1.2-.4.4-.4.6z"></path><path d="m43 34.6c-.4-.8-.4-1.6-.4-2.3 0-.6-.1-1.1-.3-.1-.6 2.4-.2 2.9.4 3.4.8.7 1.1.8 1.5.1.8-1.2 1.1-2.2 1.5-2.8.4-.5.4-.1.6.1.5.6.9.8 1.6.9s1.9-.5 1.8-2.7c-.1-1.4-.2-3.2-.3-5.2.7.9 1.2 1.7 1.7 2.4.2 1.3.3 2.5.3 3.4-.1 1.1.2 1.1.4 0 .1-.4.1-1.4 0-2.5.9 1.2 1.4 1.9 1.7 2.5.4.7.6 1.2.5-.1 0-.5-.2-.9-.8-1.8-.6-.8-1.1-1.6-1.6-2.4-.2-1.9-.4-4-.4-5.1.3.2.5 0 .3-.4-.1-.4-.4-1.6-.6-2s-.4-.4-.6.1c-.2.4-.4.6-.3.9.1 1.9.3 3.7.6 5.3-.5-.7-1-1.4-1.4-2 0-.7-.1-1.4-.1-2.1.3.2.4.2.3-.3-.1-.4-.5-1.4-.7-1.8s-.3-.4-.5-.1c-.3.5-.4.9-.1 1.4 0 .5.1.9.1 1.4-.3-.4-.5-.8-.8-1.1.3.1.5-.1.2-.4s-.9-.8-1.2-1.1c-.3-.4-.5-.3-.5 0v.9c0 .3 0 .5.3 1 .7.9 1.5 1.8 2.1 2.7.3 3.2.4 5.3.4 6.6 0 .8-.3 1.2-.7 1.3s-.8-.1-1.2-.7c-.7-1-1-.8-1.5.1s-.9 1.6-1.2 2.2c-.2.6-.7 1.1-1.1.3z"></path><path d="m52.6 23.5c0 .6.2.5.3 0s.1-1.5-.2-2.1c-.3-.7-.4-.4-.5-.2-.2.3-.2.4.1.7.1.3.3 1 .3 1.6z"></path><path d="m55.3 29.7c-.2-4.2-.7-6-.6-7.6.4.3.5.2.3-.3s-.5-1.1-.7-1.7c-.2-.5-.3-.4-.6 0s-.3.7-.2.9c.6 5.1.9 7.8 1 9.4.1 2.2-.4 3.5-2.6 5-.7.5-1.5 1 .2.6 1.6-.5 3.4-1.6 3.2-6.3z"></path><path d="m49.7 34.1c-.3.4.4.6.5.3.2.3 0 .8-.3 1.1-.5.4-.2.5.1.2.3-.2 1.1-1.1.6-1.7-.3-.2-.7-.2-.9.1z"></path></g><path d="m47.5 41.5c-1.3 0-2.5 0-3.8.1v-.4c.4-.5.3-.5 0-1-.1-.2-.2-.4-.5 0s-.3.5.1 1v.4c-9.9.1-20.8 0-30.2-.1 1 1.7 4.4 1.6 7.5 1.6 2.8 0 11.2 0 22.6-.3v.5c-.4.5-.3.5 0 1 .3.4.4.2.5 0 .1-.1.1-.2.1-.2h1.5c0 .2.3.3.4.3s.4-.1.4-.3h1.7c.2.3.4.4.7.4.6 0 .9-.7.8-1.6-.1-1.3-.6-1.5-1.8-1.4zm-1.4 2c0-.2-.3-.3-.4-.3s-.4.1-.4.3h-1.5c0-.1-.1-.2-.3-.4v-.5c1.3 0 2.7-.1 4.1-.1-.1.3-.1.6-.1.9z" fill="#fff"></path><path d="m47.5 41.5c-1.3 0-2.5 0-3.8.1v-.4c.4-.5.3-.5 0-1-.1-.2-.2-.4-.5 0s-.3.5.1 1v.4s0 0-.1 0l1.4 1.2c1 0 2.1-.1 3.1-.1-.1.3-.1.6-.1.9h-1.5c0-.2-.3-.3-.4-.3s-.3.1-.3.2l.7.6v-.1h1.7c.2.3.4.4.7.4.6 0 .9-.7.8-1.6-.1-1.2-.6-1.4-1.8-1.3z" fill="#cfe7e8"></path></g></g></svg>
                                                <label className="font-semibold text-sm">الموقع العربي</label>
                                            </div>
                                            {checked ?
                                                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                                                    <circle cx={12} cy={12} r={12} fill="#219EBC" opacity="0.2" />
                                                    <path
                                                        d="M7 13l3 3 7-7"
                                                        stroke="#219EBC"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                :
                                                <svg viewBox="0 0 24 24" fill="#219EBC60" className="h-6 w-6">
                                                    <circle cx={12} cy={12} r={12} fill="#219EBC60" opacity={0.2} />
                                                </svg>
                                            }
                                        </div>
                                    </>
                                )}
                            </RadioGroup.Option>
                        </div>
                    </RadioGroup>
                </div>
                <div className="mt-8">
                    <h3 className="font-semibold text-base">{lang === 'ar' ? 'تحديد المكان' : 'Set Location'}</h3>
                    <p className="text-xs mb-3 text-[#5D686F]">{lang === 'ar' ? 'المدينة الحالية' : 'Current City'}: <span className='font-bold'>{cityData}</span></p>
                    {BtnLoader ?
                        <button disabled={BtnLoader} className="btn border border-[#004B7A] bg-[#004B7A] p-2.5 rounded-md w-full text-white fill-white flex items-center justify-center font-medium gap-x-2">
                            {lang === 'ar' ? 'تحميل...' : 'Loading...'}
                        </button>
                        :
                        <button onClick={() => { getLocation() }} className="btn border border-[#004B7A] bg-[#004B7A] p-2.5 rounded-md w-full text-white fill-white flex items-center justify-center font-medium gap-x-2">
                            {lang === 'ar' ? 'احصل على الموقع' : 'Get Location'}
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}
