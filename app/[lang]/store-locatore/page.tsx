"use client"; // This is a client component 👈🏽

import React, { useEffect, useRef, useState, useId, useMemo } from 'react'
import Link from 'next/link'
import Select from 'react-select';
import GoogleMap from 'google-maps-react-markers'
import Marker from './Marker'
import dynamic from 'next/dynamic';
import { RadioGroup } from '@headlessui/react'
import { useApp } from "@/app/_ctx/AppContext";
import { post } from "@/lib/api/apiCalls";
import { getStoreLocatorData } from '@/lib/footerpages/storeLocatore.client';

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function StoreLocator(searchParams: any) {
    const { lang } = useApp();
    const [storesdata, setStoresData] = useState<any>([]);
    const [citiesData, setCitiesData] = useState<any>([]);
    const [city, setCity] = useState<any>('')
    const [type, setType] = useState<String>('all')

    useEffect(() => {
        getStoreLocatorData(lang).then((mainDataCombination: any) => {
            setStoresData(mainDataCombination?.storesLocatorDataCore)
            setCitiesData(mainDataCombination?.storesLocatorDataCore?.regions)
            if (searchParams?.notifications?.length) {
                notificationCount()
            }
        })
    }, [])

    const notificationCount = () => {
        if (searchParams?.notifications?.length) {
            var data = {
                id: searchParams?.notifications,
                mobileapp: true,
            }
            post('notificationsCounts', data).then((responseJson: any) => {
                if (responseJson?.success) {
                }
            })
        }
    }

    useEffect(() => {
        FilterStores()
    }, [city]);

    const FilterStores = () => {
        if (city != null && city != '') {
            var data = {
                city: city,
            }
            post('filter-stores', data).then((responseJson: any) => {
                setStoresData(responseJson)
            })
        }
    }

    const mapRef = useRef(null)
    const [mapReady, setMapReady] = useState(false)

    /**
     * @description This function is called when the map is ready
     * @param {Object} map - reference to the map instance
     * @param {Object} maps - reference to the maps library
     */
    const onGoogleApiLoaded = ({ map, maps }: any) => {
        mapRef.current = map
        setMapReady(true)
    }
    // ...inside your component render:
    const rid = useId(); // stable across SSR/CSR
    const selectInstanceId = useMemo(
        () => `store-city-${rid.replace(/:/g, "")}`,
        [rid]
    );
    const selectInputId = `${selectInstanceId}-input`;
    return (
        <>
            <MobileHeader type="Third" lang={lang} pageTitle={lang === 'ar' ? 'فروعنا' : 'Store Locator'} />
            <div className="container py-8">
                <div className="w-full">
                    <div className="flex items-center mb-3 gap-x-3">
                        <Select
                            // 🔒 Make SSR/CSR IDs stable
                            instanceId={selectInstanceId}
                            inputId={selectInputId}

                            styles={{
                                control: (provided: any, state: any) => ({
                                    ...provided,
                                    background: '#fff',
                                    borderColor: '#dfdfdf',
                                    minHeight: '44px',
                                    height: '42px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: state.isFocused ? null : null,
                                }),
                                valueContainer: (provided: any, state: any) => ({
                                    ...provided,
                                    height: '42px',
                                    padding: '0 0.5rem',
                                    overflow: 'visible',
                                }),
                                input: (provided: any, state: any) => ({
                                    ...provided,
                                    margin: '0px',
                                }),
                                indicatorSeparator: (state: any) => ({
                                    alignSelf: 'stretch',
                                    width: '1px',
                                    backgroundColor: 'hsl(0, 0%, 80%)',
                                    marginBottom: '12px',
                                    marginTop: '12px',
                                    boxSizing: 'border-box',
                                }),
                                indicatorsContainer: (provided: any, state: any) => ({
                                    ...provided,
                                    height: '42px',
                                }),
                            }}
                            placeholder={lang === 'ar' ? 'اختر المنطقة' : 'Select City'}
                            options={citiesData}
                            isSearchable={true}
                            value={city}
                            className="text-primary font-regular text-sm focus-visible:outline-none w-full"
                            classNamePrefix="react-select"
                            onChange={(e: any) => {
                                setCity(e);
                                // FilterStores()
                            }}
                        />
                    </div>
                    <RadioGroup value={type} onChange={(e) => {
                        setType(e)
                        if (e == 'my_city') {
                            if (localStorage.getItem('globalcity') != '' && localStorage.getItem('globalcity') != undefined) {
                                var cityGet = citiesData?.filter((item: { label: string | null; }) => item.label == localStorage.getItem('globalcity'))[0]
                                if (cityGet) {
                                    setCity(cityGet)
                                }
                                else {
                                    setCity({ value: 10000, label: localStorage.getItem('globalcity') })
                                }
                            }
                        }
                        if (e == 'all') {
                            setCity('')
                        }
                    }} className="flex items-center mb-3 gap-x-3 text-xs">
                        <RadioGroup.Option value="my_city">
                            {({ active, checked }) => (
                                <button className={`${checked ? `focus-visible:outline-none border border-[#219EBC] bg-[#219EBC] text-white` : `border border-[#219EBC60] text-[#219EBC80]`} py-1.5 px-2 rounded-md flex items-center gap-x-2`}>
                                    {checked ?
                                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                                            <circle cx={12} cy={12} r={12} fill="#FFFFFF" />
                                            <path
                                                d="M7 13l3 3 7-7"
                                                stroke="#219EBC"
                                                strokeWidth={1.5}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        :
                                        <svg viewBox="0 0 24 24" fill="#5D686F60" className="h-4 w-4">
                                            <circle cx={12} cy={12} r={12} fill="#5D686F60" opacity={0.2} />
                                        </svg>
                                    }
                                    {lang === 'ar' ? 'مدينتي' : 'My City'}
                                </button>
                            )
                            }
                        </RadioGroup.Option>
                        <RadioGroup.Option value="all">
                            {({ active, checked }) => (
                                <button className={`${checked ? `focus-visible:outline-none border border-[#219EBC] bg-[#219EBC] text-white` : `border border-[#219EBC60] text-[#219EBC80]`} py-1.5 px-2 rounded-md flex items-center gap-x-2`}>
                                    {checked ?
                                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                                            <circle cx={12} cy={12} r={12} fill="#FFFFFF" />
                                            <path
                                                d="M7 13l3 3 7-7"
                                                stroke="#219EBC"
                                                strokeWidth={1.5}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        :
                                        <svg viewBox="0 0 24 24" fill="#5D686F60" className="h-4 w-4">
                                            <circle cx={12} cy={12} r={12} fill="#5D686F60" opacity={0.2} />
                                        </svg>
                                    }
                                    {lang === 'ar' ? 'إظهار الكل' : 'Show All'}
                                </button>
                            )
                            }
                        </RadioGroup.Option>
                    </RadioGroup>
                    {storesdata?.stores?.map((item: any, i: any) => {
                        // stable, unique key per store row (prefers item.id)
                        const rowKey =
                            item?.id ??
                            `${item?.name ?? "store"}-${item?.lat ?? "x"}-${item?.lng ?? "y"}-${i}`;

                        let timings: any = [];
                        if (item.id == 4 || item.id == 7 || item.id == 39 || item.id == 16 || item.id == 43) {
                            timings = [
                                (lang === 'ar' ? '((صباح))' : '(Morning)') + ' ' + '12:30 ' + (lang === 'ar' ? '(صباح)ا' : 'AM') + ' - 05:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' ' + (lang === 'ar' ? '(مساء)' : '(Evening)') + ' ' + '09:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' - 02:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM'),
                                (lang === 'ar' ? '(صباح)' : '(Morning)') + ' ' + '12:30 ' + (lang === 'ar' ? '(صباح)ا' : 'AM') + ' - 05:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' ' + (lang === 'ar' ? '(مساء)' : '(Evening)') + ' ' + '09:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' - 02:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM'),
                                (lang === 'ar' ? '(صباح)' : '(Morning)') + ' ' + '12:30 ' + (lang === 'ar' ? '(صباح)ا' : 'AM') + ' - 05:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' ' + (lang === 'ar' ? '(مساء)' : '(Evening)') + ' ' + '09:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' - 02:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM'),
                                (lang === 'ar' ? '(صباح)' : '(Morning)') + ' ' + '12:30 ' + (lang === 'ar' ? '(صباح)ا' : 'AM') + ' - 05:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' ' + (lang === 'ar' ? '(مساء)' : '(Evening)') + ' ' + '09:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' - 02:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM'),
                                (lang === 'ar' ? '(صباح)' : '(Morning)') + ' ' + '12:30 ' + (lang === 'ar' ? '(صباح)ا' : 'AM') + ' - 05:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' ' + (lang === 'ar' ? '(مساء)' : '(Evening)') + ' ' + '09:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' - 02:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM'),
                                (lang === 'ar' ? '(صباح)' : '(Morning)') + ' ' + '12:30 ' + (lang === 'ar' ? '(صباح)ا' : 'AM') + ' - 05:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' ' + (lang === 'ar' ? '(مساء)' : '(Evening)') + ' ' + '09:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' - 02:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM'),
                                (lang === 'ar' ? '(صباح)' : '(Morning)') + ' ' + '01:30 ' + (lang === 'ar' ? '(صباح)ا' : 'AM') + ' - 05:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' ' + (lang === 'ar' ? '(مساء)' : '(Evening)') + ' ' + '09:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' - 02:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM'),
                            ];
                        } else {
                            timings = [
                                (lang === 'ar' ? '(صباح)' : '(Morning)') + ' ' + '01:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM') + ' - 05:30 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' ' + (lang === 'ar' ? '(مساء)' : '(Evening)') + ' ' + '09:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' - 02:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM'),
                                (lang === 'ar' ? '(صباح)' : '(Morning)') + ' ' + '01:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM') + ' - 05:30 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' ' + (lang === 'ar' ? '(مساء)' : '(Evening)') + ' ' + '09:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' - 02:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM'),
                                (lang === 'ar' ? '(صباح)' : '(Morning)') + ' ' + '01:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM') + ' - 05:30 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' ' + (lang === 'ar' ? '(مساء)' : '(Evening)') + ' ' + '09:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' - 02:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM'),
                                (lang === 'ar' ? '(صباح)' : '(Morning)') + ' ' + '01:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM') + ' - 05:30 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' ' + (lang === 'ar' ? '(مساء)' : '(Evening)') + ' ' + '09:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' - 02:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM'),
                                (lang === 'ar' ? '(صباح)' : '(Morning)') + ' ' + '01:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM') + ' - 05:30 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' ' + (lang === 'ar' ? '(مساء)' : '(Evening)') + ' ' + '09:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' - 02:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM'),
                                (lang === 'ar' ? '(صباح)' : '(Morning)') + ' ' + '01:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM') + ' - 05:30 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' ' + (lang === 'ar' ? '(مساء)' : '(Evening)') + ' ' + '09:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' - 02:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM'),
                                (lang === 'ar' ? '(صباح)' : '(Morning)') + ' ' + '02:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM') + ' - 05:30 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' ' + (lang === 'ar' ? '(مساء)' : '(Evening)') + ' ' + '09:00 ' + (lang === 'ar' ? '(صباح)ا' : 'PM') + ' - 02:00 ' + (lang === 'ar' ? '(صباح)ا' : 'AM'),
                            ];
                        }

                        return (
                            <div key={rowKey} className="shadow-md bg-white rounded mb-4">
                                {item.lat && item.lng ? (
                                    <GoogleMap
                                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY!}
                                        defaultCenter={{ lat: Number(item.lat), lng: Number(item.lng) }}
                                        defaultZoom={15}
                                        options={{
                                            isFractionalZoomEnabled: false,
                                            mapTypeControl: false,
                                            rotateControl: false,
                                            scaleControl: false,
                                            streetViewControl: false,
                                            zoomControl: false,
                                            fullscreenControl: false,
                                        }}
                                        mapMinHeight="200px"
                                        onGoogleApiLoaded={onGoogleApiLoaded}
                                    />
                                ) : null}
                                <div className='md:flex items-center justify-between p-3'>
                                    <div>
                                        <h2 className=" font-semibold text-sm mb-1 text-[#004B7A]">{lang === 'ar' ? item?.name_arabic : item?.name}</h2>
                                        {item?.id != 44 ?
                                            <>
                                                <h3 className="font-semibold text-xs mt-2 mb-1">{lang === 'ar' ? 'مواعيد عمل المعارض' : 'Showroom Timings'}</h3>
                                                <ul className="text-xs mb-2 ltr:ml-4 rtl:mr-4 flex items-center text-[#515567]">
                                                    <div>
                                                        <li className='mb-1'>{lang === 'ar' ? 'السبت' : 'Saturday'}:</li>
                                                        <li className='mb-1'>{lang === 'ar' ? 'الأحد' : 'Sunday'}:</li>
                                                        <li className='mb-1'>{lang === 'ar' ? 'الإثنين' : 'Monday'}:</li>
                                                        <li className='mb-1'>{lang === 'ar' ? 'الثلاثاء' : 'Tuesday'}:</li>
                                                        <li className='mb-1'>{lang === 'ar' ? 'الأربعاء' : 'Wednesday'}:</li>
                                                        <li className='mb-1'>{lang === 'ar' ? 'الخميس' : 'Thursday'}:</li>
                                                        <li className='mb-1'>{lang === 'ar' ? 'الجمعة' : 'Friday'}:</li>
                                                    </div>
                                                    <div className="ltr:ml-5 rtl:mr-5">
                                                        {timings?.map((time: any, index: any) => (
                                                            <li key={`${rowKey}-t-${index}`} className='mb-1'>{time}</li>
                                                        ))}
                                                    </div>
                                                </ul>
                                            </>
                                            : null}
                                        <p className="text-[#adafb3] font-medium text-xs">{item?.address} | {lang === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</p>
                                    </div>
                                    <div className="flex items-center gap-x-3 mt-6 md:mt-0">
                                        <Link href={item?.direction_button} target="_blank">
                                            <svg height="22" viewBox="0 0 64 64" width="22" xmlns="http://www.w3.org/2000/svg" id="fi_3177361" className="fill-[#004B7A]"><g id="Pin"><path d="m32 0a24.0319 24.0319 0 0 0 -24 24c0 17.23 22.36 38.81 23.31 39.72a.99.99 0 0 0 1.38 0c.95-.91 23.31-22.49 23.31-39.72a24.0319 24.0319 0 0 0 -24-24zm0 35a11 11 0 1 1 11-11 11.0066 11.0066 0 0 1 -11 11z"></path></g></svg>
                                        </Link>
                                        <Link href={`tel:${item?.phone_number}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" version="1.1" viewBox="0 0 640.00027 640" width="20" id="fi_1082334">
                                                <g id="surface1" className="fill-[#004B7A]">
                                                    <path d="M 476.417969 640 C 427.671875 640 367.871094 617.554688 301.988281 573.328125 C 168.78125 483.941406 12.894531 300.492188 0.8125 176.535156 C -3.050781 136.890625 6.890625 104.902344 30.367188 81.425781 L 111.792969 0 L 277.59375 165.800781 L 264.335938 179.058594 C 243.1875 200.210938 208.53125 234.792969 183.753906 259.402344 C 206.546875 292.875 250.546875 342.339844 283.011719 374.804688 C 313.742188 405.507812 349.300781 433.457031 381.347656 454.863281 C 404.433594 431.625 435.507812 400.457031 460.921875 374.988281 L 474.199219 361.71875 L 640 527.554688 L 559.5625 607.992188 C 538.15625 629.398438 509.902344 640 476.417969 640 Z M 476.417969 640 "></path>
                                                </g>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* </div> */}
            </div>
        </>
    )
}
