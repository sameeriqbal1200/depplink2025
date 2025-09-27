"use client"; // This is a client component 👈🏽
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Api } from "@/lib/api/apiLinks";
import React, { useState, useRef, useEffect, Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useUserAgent } from 'next-useragent'
import { getDictionary } from "../../dictionaries"
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next-nprogress-bar'

export default function ShipmentTracking({ params }: { params: { lang: string, data: any, devicetype: any } }) {
    const router = useRouter()
    const [dict, setDict] = useState<any>([]);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [address, setAddress] = useState<any>(null);
    const [phonenumber, setPhoneNumber] = useState<any>(null);
    const [statecity, setStateCity] = useState<any>(null);
    const [statecityArabic, setStateCityArabic] = useState<any>(null);
    const [shipmentnumber, setShipmentNumber] = useState<any>(null);
    const [riderName, setRiderFirstName] = useState<any>(null);
    const [riderlastName, setRiderLastName] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [onlineproducts, setOnlineProducts] = useState<any[]>([]);
    const [onlinefirstName, setOnlineFirstName] = useState<string>('');
    const [onlinelastName, setOnlineLastName] = useState<string>('');
    const [onlineaddress, setOnlineAddress] = useState<string>('');
    const [onlinePhoneNumber, setOnlinePhoneNumber] = useState<string>('');
    const [onlineCity, setOnlineCity] = useState<string>('');
    const [onlineCityArabic, setOnlineCityArabic] = useState<string>('');
    const [pickup, setPickup] = useState<any[]>([]);
    const [pickupArabic, setPickupArabic] = useState<any[]>([]);
    const [riderNumber, setRiderNumber] = useState<any[]>([]);
    const [ordertype, setOrderType] = useState<number | null>(null);
    const [status, setStatus] = useState<number>(0);
    const [currentLocation, setCurrentLocation] = useState<any>(0);
    const [error, setError] = useState<string | null>(null);
    const [isLocationAllowed, setIsLocationAllowed] = useState<boolean | null>(null);
    const [locationStatus, setLocationStatus] = useState<string | null>(null);

    const [buttonhide, setButtonHide] = useState(false);
    const [loadingsave, setLoadingSave] = useState(false);
    const [shipmentFound, setShipmentFound] = useState<any>(false);
    const [isOpen, setisOpen] = useState(false);
    const [position, setPosition] = useState<{ lat: number, lng: number } | null>(null);

    useEffect(() => {
        (async () => {
            const translationdata = await getDictionary(lang);
            setDict(translationdata);
        })();
        if (params?.data?.data) {
            setShipmentNumber(params?.data?.data?.shipment_no || '');
            setFirstName(params?.data?.data?.shipping_address_showroom_order?.first_name || '');
            setLastName(params?.data?.data?.shipping_address_showroom_order?.last_name || '');
            setAddress(params?.data?.data?.shipping_address_showroom_order?.address || '');
            setPhoneNumber(params?.data?.data?.shipping_address_showroom_order?.phone_number || '');
            setStateCity(params?.data?.data?.shipping_address_showroom_order?.state_data?.name || '');
            setStateCityArabic(params?.data?.data?.shipping_address_showroom_order?.state_data?.name_arabic || '');
            setRiderFirstName(params?.data?.data?.rider_data?.first_name || '')
            setRiderLastName(params?.data?.data?.rider_data?.last_name || '')
            setRiderNumber(params?.data?.data?.rider_data?.phone_number || '');
            setProducts(params?.data?.data?.s_odetails);
            setPickup(params?.data?.data?.warehouse?.name || '');
            setPickupArabic(params?.data?.data?.warehouse?.name_arabic || '');
            setStatus(params?.data?.data?.status || 0);
            setOrderType(params?.data?.data?.order_type || '');
            setOnlineProducts(params?.data?.data?.shipment_order?.details)
            setOnlineFirstName(params?.data?.data?.shipment_order?.address?.first_name || '')
            setOnlineLastName(params?.data?.data?.shipment_order?.address?.last_name || '')
            setOnlineAddress(params?.data?.data?.shipment_order?.address?.address || '')
            setOnlinePhoneNumber(params?.data?.data?.shipment_order?.address?.phone_number || '')
            setOnlineCity(params?.data?.data?.shipment_order?.address?.state_data?.name || '')
            setOnlineCityArabic(params?.data?.data?.shipment_order?.address?.state_data?.name_arabic || '')
            setCurrentLocation(JSON.parse(params?.data?.data?.current_location) || '');
        } else {
            setShipmentFound(true);
        }
    }, [params?.data])

    const mapContainerStyle = {
        height: '400px',
        width: '100%',
        border: '2px solid #007bff',
        borderRadius: '8px',
    };
    const mapContainerStyle2 = {
        height: '200px',
        width: '100%',
        border: '2px solid #007bff',
        borderRadius: '8px',
    };

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            setPosition({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            });
        }
    };
    const MySwal = withReactContent(Swal);
    const topMessageAlartSuccess = (title: any) => {
        MySwal.fire({
            icon: "success",
            title:
                <div className="text-xs">
                    <div className="uppercase">{title}</div>
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
            timerProgressBar: true,
        });
    };

    const handleSaveLocation = async (location: any) => {
        if (location) {
            setLoadingSave(true);
            try {
                const response = await fetch(`${Api}shipment-tracking/location/${shipmentnumber}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        current_location: {
                            latitude: location.lat,
                            longitude: location.lng,
                        },
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update location');
                }

                topMessageAlartSuccess(lang === 'ar' ? 'تمت إضافة الموقع بنجاح!' : 'Location Added successfully!');
                setisOpen(false);
                setButtonHide(true);
                router.refresh()
            } catch (err) {
                console.error('Error saving location:', err);
                topMessageAlartDanger(lang === 'ar' ? 'خطأ في حفظ الموقع' : 'Error Saving Location!');
            } finally {
                setLoadingSave(false);
            }
        }
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(`${Api}shipment-tracking/location/${shipmentnumber}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                current_location: {
                                    latitude,
                                    longitude,
                                },
                            }),
                        });

                        if (!response.ok) {
                            throw new Error('Failed to update location');
                        }

                        const data = await response.json();
                        topMessageAlartSuccess(lang === 'ar' ? 'تمت إضافة الموقع بنجاح!' : 'Location Added successfully!');
                    } catch (err) {
                        console.error('Error saving location:', err);
                        topMessageAlartDanger(lang === 'ar' ? 'خطأ في حفظ الموقع' : 'Error Saving Location!');
                        setError('Error saving location');
                    }
                },
                (error) => {
                    if (error.code === error.PERMISSION_DENIED) {
                        setLocationStatus(
                            'Geolocation permission has been blocked. Please reset it in your browser settings. For instructions, see the documentation.'
                        );
                        setError('Geolocation permission has been blocked.');
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        setLocationStatus('Position unavailable. Ensure you have location services enabled.');
                        setError('Position unavailable.');
                    } else if (error.code === error.TIMEOUT) {
                        setLocationStatus('The request to get user location timed out.');
                        setError('Request timed out.');
                    } else {
                        setLocationStatus('Error getting location.');
                        setError('Error getting location.');
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
            setIsLocationAllowed(true);
            setButtonHide(true);
        } else {
            alert('Geolocation is not supported by this browser.');
            setIsLocationAllowed(false);
        }
    };

    const userAgent: any =
        typeof window !== 'undefined' && window.location.origin
            ? useUserAgent(window.navigator.userAgent)
            : false;

    const origin =
        typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : '';

    return (
        <>
            {userAgent?.isMobile || userAgent?.isTablet ?
                <>
                    <div className="sht_303mainDiv">
                        <div className="container">
                            <div className="sht_303mainInnerSecDiv">
                                <Link prefetch={false} scroll={false} href={`${origin}/${params?.lang}`} as={`${origin}/${params?.lang}`}>
                                    <Image
                                        alt="logo"
                                        title="Tamkeen Logo"
                                        loading="lazy"
                                        width={100}
                                        height={100}
                                        decoding="async"
                                        data-nimg="1"
                                        src="/images/logo.webp"
                                    />
                                </Link>
                                <Link prefetch={false} scroll={false} href={`${origin}/${params?.lang}`} as={`${origin}/${params?.lang}`} className="btn sht_303mainContinueShopBtn">
                                    {lang == 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
                                </Link>
                            </div>
                            {!shipmentFound ?
                                <>
                                    <hr className="sht_303mainInnerHr" />
                                    <div className="sht_303mainInnerThirdDiv">
                                        <svg width="14%" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.50626 15.2647C7.61657 15.6639 8.02965 15.8982 8.4289 15.7879C8.82816 15.6776 9.06241 15.2645 8.9521 14.8652L7.50626 15.2647ZM6.07692 7.27442L6.79984 7.0747V7.0747L6.07692 7.27442ZM4.7037 5.91995L4.50319 6.64265L4.7037 5.91995ZM3.20051 4.72457C2.80138 4.61383 2.38804 4.84762 2.2773 5.24675C2.16656 5.64589 2.40035 6.05923 2.79949 6.16997L3.20051 4.72457ZM20.1886 15.7254C20.5895 15.6213 20.8301 15.2118 20.7259 14.8109C20.6217 14.41 20.2123 14.1695 19.8114 14.2737L20.1886 15.7254ZM10.1978 17.5588C10.5074 18.6795 9.82778 19.8618 8.62389 20.1747L9.00118 21.6265C10.9782 21.1127 12.1863 19.1239 11.6436 17.1594L10.1978 17.5588ZM8.62389 20.1747C7.41216 20.4896 6.19622 19.7863 5.88401 18.6562L4.43817 19.0556C4.97829 21.0107 7.03196 22.1383 9.00118 21.6265L8.62389 20.1747ZM5.88401 18.6562C5.57441 17.5355 6.254 16.3532 7.4579 16.0403L7.08061 14.5885C5.10356 15.1023 3.89544 17.0911 4.43817 19.0556L5.88401 18.6562ZM7.4579 16.0403C8.66962 15.7254 9.88556 16.4287 10.1978 17.5588L11.6436 17.1594C11.1035 15.2043 9.04982 14.0768 7.08061 14.5885L7.4579 16.0403ZM8.9521 14.8652L6.79984 7.0747L5.354 7.47414L7.50626 15.2647L8.9521 14.8652ZM4.90421 5.19725L3.20051 4.72457L2.79949 6.16997L4.50319 6.64265L4.90421 5.19725ZM6.79984 7.0747C6.54671 6.15847 5.8211 5.45164 4.90421 5.19725L4.50319 6.64265C4.92878 6.76073 5.24573 7.08223 5.354 7.47414L6.79984 7.0747ZM11.1093 18.085L20.1886 15.7254L19.8114 14.2737L10.732 16.6332L11.1093 18.085Z" fill="#1C274C" />
                                            <path opacity="0.5" d="M9.56541 8.73049C9.0804 6.97492 8.8379 6.09714 9.24954 5.40562C9.66119 4.71409 10.5662 4.47889 12.3763 4.00849L14.2962 3.50955C16.1062 3.03915 17.0113 2.80394 17.7242 3.20319C18.4372 3.60244 18.6797 4.48023 19.1647 6.2358L19.6792 8.09786C20.1642 9.85343 20.4067 10.7312 19.995 11.4227C19.5834 12.1143 18.6784 12.3495 16.8683 12.8199L14.9484 13.3188C13.1384 13.7892 12.2333 14.0244 11.5203 13.6252C10.8073 13.2259 10.5648 12.3481 10.0798 10.5926L9.56541 8.73049Z" stroke="#1C274C" strokeWidth="1.5" />
                                        </svg>
                                        <h1 className="sht_303mainInnerFirstXsHeading">{lang == 'ar' ? 'طلبك محدد للتسليم بحلول' : 'Your order is schedule for delivery by '}<span className="sht_303mainInnerSpan">{lang == 'ar' ? 'تمكين متاجر' : 'Tamkeen Stores'}</span> {lang == 'ar' ? 'شحنتك لا' : 'your shipment number is '} <span className="sht_303mainInnerSpan">{shipmentnumber}</span></h1>
                                    </div>
                                </>
                                : null}
                        </div>
                    </div>
                    <div className='h-32'></div>
                    {!shipmentFound ?
                        <>
                            <div className="sht_303mainInnerFourthDiv">
                                <div className="container">
                                    <div>
                                        <h2 className="sht_303mainInnerSecXsHeading">{lang == 'ar' ? 'الشحنات تفاصيل التوصيل' : 'Shipment Delivery Details'}</h2>
                                        <div className="sht_303mainInnerSeventhDiv">
                                            <p className="sht_303mainInnerPara text-sm">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="6" r="4" stroke="#1C274C" strokeWidth="1.5" />
                                                    <path d="M15 20.6151C14.0907 20.8619 13.0736 21 12 21C8.13401 21 5 19.2091 5 17C5 14.7909 8.13401 13 12 13C15.866 13 19 14.7909 19 17C19 17.3453 18.9234 17.6804 18.7795 18" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                                {ordertype === 1 ? (
                                                    <>
                                                        {firstName ? (
                                                            <>{firstName} {lastName}</>
                                                        ) : (
                                                            '-----'
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {onlinefirstName ? (
                                                            <>{onlinefirstName} {onlinelastName}</>
                                                        ) : (
                                                            '-----'
                                                        )}
                                                    </>
                                                )}
                                            </p>
                                            <p className="sht_303mainInnerSecPara text-sm">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12.5 7.04148C12.3374 7.0142 12.1704 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10C15 9.82964 14.9858 9.6626 14.9585 9.5" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M5 15.2161C4.35254 13.5622 4 11.8013 4 10.1433C4 5.64588 7.58172 2 12 2C16.4183 2 20 5.64588 20 10.1433C20 14.6055 17.4467 19.8124 13.4629 21.6744C12.5343 22.1085 11.4657 22.1085 10.5371 21.6744C9.26474 21.0797 8.13831 20.1439 7.19438 19" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                                {ordertype === 1 ? (
                                                    <>
                                                        {address ? (
                                                            <>{address}</>
                                                        ) : (
                                                            '-----'
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {onlineaddress ? (
                                                            <>{onlineaddress}</>
                                                        ) : (
                                                            '-----'
                                                        )}
                                                    </>
                                                )}
                                            </p>
                                            <p className="sht_303mainInnerThirdPara text-sm">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.00659 6.93309C5.04956 5.7996 5.70084 4.77423 6.53785 3.93723C7.9308 2.54428 10.1532 2.73144 11.0376 4.31617L11.6866 5.4791C12.2723 6.52858 12.0372 7.90533 11.1147 8.8278M17.067 18.9934C18.2004 18.9505 19.2258 18.2992 20.0628 17.4622C21.4558 16.0692 21.2686 13.8468 19.6839 12.9624L18.5209 12.3134C17.4715 11.7277 16.0947 11.9628 15.1722 12.8853" stroke="#1C274C" strokeWidth="1.5" />
                                                    <path opacity="0.5" d="M5.00655 6.93311C4.93421 8.84124 5.41713 12.0817 8.6677 15.3323C11.9183 18.5829 15.1588 19.0658 17.0669 18.9935M15.1722 12.8853C15.1722 12.8853 14.0532 14.0042 12.0245 11.9755C9.99578 9.94676 11.1147 8.82782 11.1147 8.82782" stroke="#1C274C" strokeWidth="1.5" />
                                                </svg>
                                                <Link prefetch={false} scroll={false} href="">
                                                    {ordertype === 1 ? (
                                                        <>
                                                            {phonenumber ? (
                                                                <>
                                                                    {lang === 'ar' ? (
                                                                        <span>{phonenumber} 966+</span>
                                                                    ) : (
                                                                        <span>+966 {phonenumber}</span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                '-----'
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {onlinePhoneNumber ? (
                                                                <>
                                                                    {lang === 'ar' ? (
                                                                        <span>{onlinePhoneNumber} 966+</span>
                                                                    ) : (
                                                                        <span>+966 {onlinePhoneNumber}</span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                '-----'
                                                            )}
                                                        </>
                                                    )}
                                                </Link>
                                            </p>
                                            <p className="sht_303mainInnerSecPara text-sm">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2 5.25732C2 3.45835 3.567 2 5.5 2C7.433 2 9 3.45835 9 5.25732C9 7.04219 7.88292 9.12496 6.14003 9.86978C5.73374 10.0434 5.26626 10.0434 4.85997 9.86978C3.11708 9.12496 2 7.04219 2 5.25732Z" stroke="#1C274C" strokeWidth="1.5" />
                                                    <path d="M15 17.2573C15 15.4584 16.567 14 18.5 14C20.433 14 22 15.4584 22 17.2573C22 19.0422 20.8829 21.125 19.14 21.8698C18.7337 22.0434 18.2663 22.0434 17.86 21.8698C16.1171 21.125 15 19.0422 15 17.2573Z" stroke="#1C274C" strokeWidth="1.5" />
                                                    <path d="M19.5 17.5C19.5 18.0523 19.0523 18.5 18.5 18.5C17.9477 18.5 17.5 18.0523 17.5 17.5C17.5 16.9477 17.9477 16.5 18.5 16.5C19.0523 16.5 19.5 16.9477 19.5 17.5Z" fill="#1C274C" />
                                                    <path d="M6.5 5.5C6.5 6.05228 6.05228 6.5 5.5 6.5C4.94772 6.5 4.5 6.05228 4.5 5.5C4.5 4.94772 4.94772 4.5 5.5 4.5C6.05228 4.5 6.5 4.94772 6.5 5.5Z" fill="#1C274C" />
                                                    <path d="M12 4.25C11.5858 4.25 11.25 4.58579 11.25 5C11.25 5.41421 11.5858 5.75 12 5.75V4.25ZM12 19L12.5303 19.5303C12.8232 19.2374 12.8232 18.7626 12.5303 18.4697L12 19ZM17.2056 8.68732L17.6083 9.32007L17.2056 8.68732ZM6.79434 15.3127L7.197 15.9454H7.197L6.79434 15.3127ZM11.0303 16.9697C10.7374 16.6768 10.2625 16.6768 9.96964 16.9697C9.67675 17.2626 9.67675 17.7374 9.96964 18.0303L11.0303 16.9697ZM9.96964 19.9697C9.67675 20.2626 9.67675 20.7374 9.96964 21.0303C10.2625 21.3232 10.7374 21.3232 11.0303 21.0303L9.96964 19.9697ZM10.8312 13.6327C11.1807 13.4104 11.2837 12.9468 11.0613 12.5973C10.8389 12.2479 10.3753 12.1449 10.0259 12.3673L10.8312 13.6327ZM13.1687 10.3673C12.8193 10.5896 12.7163 11.0532 12.9387 11.4027C13.161 11.7521 13.6246 11.8551 13.9741 11.6327L13.1687 10.3673ZM16.1319 4.25H12V5.75H16.1319V4.25ZM12 18.25H7.86809V19.75H12V18.25ZM12.5303 18.4697L11.0303 16.9697L9.96964 18.0303L11.4696 19.5303L12.5303 18.4697ZM11.4696 18.4697L9.96964 19.9697L11.0303 21.0303L12.5303 19.5303L11.4696 18.4697ZM7.86809 18.25C6.61754 18.25 6.14195 16.6168 7.197 15.9454L6.39169 14.6799C4.07059 16.157 5.11685 19.75 7.86809 19.75V18.25ZM16.1319 5.75C17.3824 5.75 17.858 7.38318 16.803 8.05458L17.6083 9.32007C19.9294 7.843 18.8831 4.25 16.1319 4.25V5.75ZM10.0259 12.3673L6.39169 14.6799L7.197 15.9454L10.8312 13.6327L10.0259 12.3673ZM16.803 8.05458L13.1687 10.3673L13.9741 11.6327L17.6083 9.32007L16.803 8.05458Z" fill="#1C274C" />
                                                </svg>
                                                {ordertype === 1 ? (
                                                    <>
                                                        {statecity ? (
                                                            <>
                                                                {lang === 'ar' ? (
                                                                    <span>{statecityArabic}, المملكة العربية السعودية</span>
                                                                ) : (
                                                                    <span>{statecity}, Saudi Arabia</span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            '-----'
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {onlineCity ? (
                                                            <>
                                                                {lang === 'ar' ? (
                                                                    <span>{onlineCityArabic}, المملكة العربية السعودية</span>
                                                                ) : (
                                                                    <span>{onlineCity}, Saudi Arabia</span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            '-----'
                                                        )}
                                                    </>
                                                )}
                                            </p>
                                            {currentLocation || buttonhide === true ? (
                                                <p className="sht_303mainInnerAddressPara">
                                                    {lang == 'ar' ? 'لقد أضفت عنوانًا' : 'You Added Address'}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="sht_303mainInnerEightDiv mt-5">
                                        <button className="w-full mt-2 rounded-md">
                                        {currentLocation ? 
                                            <LoadScript googleMapsApiKey="AIzaSyB3ekz5eMwuRZGvFy2HUADZVhxAzTWV5Ok">
                                                <GoogleMap
                                                    mapContainerStyle={mapContainerStyle2}
                                                    center={{ lat: currentLocation?.latitude, lng: currentLocation?.longitude }}
                                                    zoom={13}
                                                    // onClick={handleMapClick}
                                                >
                                                    <Marker position={{ lat: currentLocation?.latitude, lng: currentLocation?.longitude }} />
                                                </GoogleMap>
                                            </LoadScript>
                                        :  
                                        <iframe src={currentLocation ? `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.485802976811!2d${currentLocation?.longitude}!3d${currentLocation?.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d1a697918559%3A0x23e0a0172940216a!2sYour%20Location!5e0!3m2!1sen!2ssa!4v1722844665143!5m2!1sen!2ssa` : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.485802976811!2d39.20758947568789!3d21.566952269075532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d1a697918559%3A0x23e0a0172940216a!2zSkRTQjMyMTTYjCAzMjE0INin2YTZh9iw2KfZhNmK2YTYjCA2NTI4LCBBcyBTYWZhIERpc3RyaWN0LCBKZWRkYWggMjM0NTE!5e0!3m2!1sen!2ssa!4v1722844665143!5m2!1sen!2ssa"} width="100%" height="280" className="rounded-md w-full" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                        }
                                        </button>
                                    </div>
                                    <div className="sht_303mainInnerEightDiv mt-3 gap-3">
                                        {!currentLocation && buttonhide === false ? (
                                            <>
                                                <button className="bg-secondary flex items-center justify-center text-white text-sm w-full p-2.5 rounded-md mx-auto" onClick={handleCurrentLocation}>
                                                    <i className="fas fa-map-marker-alt mr-2"></i>
                                                    {lang == 'ar' ? 'الموقع الحالي' : 'Current Location'}
                                                    {error && <p className="text-red-500">{error}</p>}
                                                    {isLocationAllowed === false && <p className="text-red-500">{params?.lang == 'ar' ? "الطلب مرفوض او العنوان غير متاح" : "Permission denied or location not available."}</p>}
                                                </button>

                                                <button
                                                    className="bg-primary flex items-center justify-center text-white text-sm w-full p-2.5 rounded-md mx-auto"
                                                    onClick={() => setisOpen(true)}
                                                >
                                                    <i className="fas fa-cog mr-2"></i>
                                                    {lang == 'ar' ? 'موقع الإعداد' : 'Setup Location'}
                                                </button>
                                            </>
                                        ) : null}
                                    </div>
                                    {/* <hr className="sht_303mainInnerHr" />
                            <div className="sht_303mainInnerNineDiv">
                                <p className="font-normal">{lang == 'ar' ? 'تريد تغيير التسليم الخاص بك' : 'You want to change your delivery'} <span className="font-bold">{lang == 'ar' ? 'وقت' : 'Time'}</span> & <span className="font-bold">{lang == 'ar' ? 'تاريخ' : 'date'}</span>?</p>
                                <button className="sht_303mainInnerXsTextBtn">{lang == 'ar' ? 'اختر وقت التسليم والتاريخ المفضل' : 'Choose Preferred Delivery Time and Date'}</button>
                            </div>
                            <hr className="sht_303mainInnerHr" />
                            <div className="sht_303mainInnerTenDiv">
                                <p className="font-normal">{lang == 'ar' ? 'للتحقق من هويتك، قم بإعطاء' : 'To verify your identity, give the'} <span className="font-bold capitalize">{lang == 'ar' ? 'شفرة' : 'code'} </span>{lang == 'ar' ? 'إلى موظف التسليم لدينا:' : 'to our delivery associate:'}</p>
                                <button className="sht_303mainInnerXsTextBtn">{lang == 'ar' ? 'إظهار الرمز' : 'Show Code'}</button>
                            </div> */}
                                </div>
                            </div>

                            <div className="sht_303mainInnerElevenDiv">
                                <div className="sht_303mainInnerTwelveDiv">
                                    <div className="flex">
                                        <div className="relative after:absolute after:-bottom-[15px] after:left-1/2 after:top-[38px] after:h-[28px] after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 after:border-primary">
                                            <div className={`sht_303mainInnenSSTDiv bg-primary absolute top-[14px] left-1/2 -translate-x-1/2`}></div>
                                        </div>
                                        <div className="self-center p-4 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                            <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">{lang === 'ar' ? 'يعالج' : 'Processing'}</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="relative after:absolute after:-bottom-[15px] after:left-1/2 after:top-[38px] after:h-[28px] after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 after:border-primary">
                                            <div className={`sht_303mainInnenSSTDiv bg-primary absolute top-[14px] left-1/2 -translate-x-1/2`}></div>
                                        </div>
                                        <div className="self-center p-4 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                            <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">{lang === 'ar' ? 'تلقى' : 'Received'}</p>
                                        </div>
                                    </div>
                                    {/* <div className="flex">
                                        <div className={`relative after:absolute after:-bottom-[15px] after:left-1/2 after:top-[38px] after:h-[28px] after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 ${params?.data?.data?.status >= 2 ? 'after:border-primary' : 'after:border-[#D9D9D9]'}`}>
                                            <div className={`sht_303mainInnenSSTDiv bg-primary absolute top-[14px] left-1/2 -translate-x-1/2 `}></div>
                                        </div>
                                        <div className="self-center p-4 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                            <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">{lang === 'ar' ? 'تم إنشاء الشحنة' : 'Shipment Created'}</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className={`relative after:absolute after:-bottom-[15px] after:left-1/2 after:top-[38px] after:h-[28px] after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 ${params?.data?.data?.status >= 3 ? 'after:border-primary' : 'after:border-[#D9D9D9]'}`}>
                                            <div className={`sht_303mainInnenSSTDiv absolute top-[14px] left-1/2 -translate-x-1/2 ${status >= 2 ? 'bg-primary' : 'bg-[#D9D9D9]'}`}></div>
                                        </div>
                                        <div className="self-center p-4 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                            <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">{lang === 'ar' ? 'في العبور' : '⁠In Transit'}</p>
                                        </div>
                                    </div> */}
                                    <div className="flex">
                                        <div className={`relative after:absolute after:-bottom-[15px] after:left-1/2 after:top-[38px] after:h-[28px] after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 ${params?.data?.data?.status == 4 ? 'after:border-primary' : 'after:border-[#D9D9D9]'}`}>
                                            <div className={`sht_303mainInnenSSTDiv absolute top-[14px] left-1/2 -translate-x-1/2 ${status >= 3 ? 'bg-primary' : 'bg-[#D9D9D9]'}`}></div>
                                        </div>
                                        <div className="self-center p-4 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                            <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">{lang === 'ar' ? 'خارج للتسليم' : 'Out for delivery'}</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="relative">
                                            <div className={`sht_303mainInnenSSTDiv absolute top-[14px] left-1/2 -translate-x-1/2 ${status >= 4 ? 'bg-primary' : 'bg-[#D9D9D9]'}`}></div>
                                        </div>
                                        <div className="self-center p-4 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                            <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">{lang === 'ar' ? 'تم التوصيل' : 'Delivered'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {riderName ?
                                <>
                                    <div className="sht_303mainInnerFourthDiv">
                                        <div className="container">
                                            <div>
                                                <h2 className="sht_303mainInnerSecXsHeading">{lang == 'ar' ? 'تفاصيل الراكب' : 'Rider Details'}</h2>
                                                <div className="sht_303mainInnerSeventhDiv">
                                                    <p className="sht_303mainInnerPara !text-sm">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="12" cy="6" r="4" stroke="#1C274C" strokeWidth="1.5" />
                                                            <path d="M15 20.6151C14.0907 20.8619 13.0736 21 12 21C8.13401 21 5 19.2091 5 17C5 14.7909 8.13401 13 12 13C15.866 13 19 14.7909 19 17C19 17.3453 18.9234 17.6804 18.7795 18" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                                                        </svg>
                                                        {riderName ? (
                                                            `${riderName} ${riderlastName}`
                                                        ) : (
                                                            lang === 'ar' ? 'لم يتم تعيين متسابق' : 'No Rider Assigned'
                                                        )}
                                                    </p>
                                                    <p className="sht_303mainInnerSecPara text-sm">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12.5 7.04148C12.3374 7.0142 12.1704 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10C15 9.82964 14.9858 9.6626 14.9585 9.5" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path d="M5 15.2161C4.35254 13.5622 4 11.8013 4 10.1433C4 5.64588 7.58172 2 12 2C16.4183 2 20 5.64588 20 10.1433C20 14.6055 17.4467 19.8124 13.4629 21.6744C12.5343 22.1085 11.4657 22.1085 10.5371 21.6744C9.26474 21.0797 8.13831 20.1439 7.19438 19" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                                                        </svg>
                                                        {pickup ? (
                                                            lang === 'ar' ? (
                                                                `${pickupArabic}`
                                                            ) : (
                                                                `${pickup}`
                                                            )
                                                        ) : (
                                                            '-----'
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="sht_303mainInnenFourteenDiv text-sm">
                                                <Link prefetch={false} scroll={false} href="" className="">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M13.2596 1.88032C13.3258 1.47143 13.7124 1.19406 14.1212 1.26025C14.1466 1.2651 14.228 1.28032 14.2707 1.28982C14.356 1.30882 14.475 1.33808 14.6234 1.38131C14.9202 1.46775 15.3348 1.61015 15.8324 1.83829C16.8287 2.29505 18.1545 3.09405 19.5303 4.46985C20.9061 5.84565 21.7051 7.17146 22.1619 8.16774C22.39 8.66536 22.5324 9.07996 22.6188 9.37674C22.6621 9.52515 22.6913 9.64417 22.7103 9.7295C22.7198 9.77217 22.7268 9.80643 22.7316 9.83174L22.7374 9.86294C22.8036 10.2718 22.5287 10.6743 22.1198 10.7405C21.7121 10.8065 21.328 10.5305 21.2602 10.1235C21.2581 10.1126 21.2524 10.0833 21.2462 10.0556C21.2339 10.0002 21.2125 9.91236 21.1787 9.79621C21.111 9.56388 20.9935 9.21854 20.7983 8.79287C20.4085 7.94256 19.7075 6.76837 18.4696 5.53051C17.2318 4.29265 16.0576 3.59165 15.2073 3.20182C14.7816 3.00667 14.4363 2.88913 14.2039 2.82146C14.0878 2.78763 13.9418 2.75412 13.8864 2.74178C13.4794 2.67396 13.1936 2.28804 13.2596 1.88032Z" fill="#1C274C" />
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M13.4859 5.32978C13.5997 4.93151 14.0148 4.70089 14.413 4.81468L14.207 5.53583C14.413 4.81468 14.413 4.81468 14.413 4.81468L14.4145 4.8151L14.416 4.81554L14.4194 4.81651L14.4271 4.81883L14.4469 4.82499C14.462 4.82981 14.4808 4.83609 14.5033 4.84406C14.5482 4.85999 14.6075 4.88266 14.6803 4.91386C14.826 4.9763 15.0251 5.07272 15.2696 5.21743C15.7591 5.50711 16.4272 5.98829 17.2122 6.77326C17.9972 7.55823 18.4784 8.22642 18.768 8.71589C18.9128 8.9604 19.0092 9.15946 19.0716 9.30515C19.1028 9.37795 19.1255 9.43731 19.1414 9.48222C19.1494 9.50467 19.1557 9.5235 19.1605 9.53858L19.1666 9.55837L19.169 9.56612L19.1699 9.56945L19.1704 9.57098C19.1704 9.57098 19.1708 9.57243 18.4496 9.77847L19.1708 9.57242C19.2846 9.9707 19.054 10.3858 18.6557 10.4996C18.2608 10.6124 17.8493 10.3867 17.7315 9.99462L17.7278 9.98384C17.7224 9.96881 17.7114 9.93923 17.6929 9.89602C17.6559 9.80969 17.5888 9.66846 17.4772 9.47987C17.2542 9.10312 16.8515 8.53388 16.1516 7.83392C15.4516 7.13397 14.8823 6.73126 14.5056 6.5083C14.317 6.39668 14.1758 6.32958 14.0894 6.29258C14.0462 6.27407 14.0167 6.26303 14.0016 6.2577L13.9909 6.254C13.5988 6.13613 13.373 5.72468 13.4859 5.32978Z" fill="#1C274C" />
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M5.00745 4.40708C6.68752 2.72701 9.52266 2.85473 10.6925 4.95085L11.3415 6.11378C12.1054 7.4826 11.7799 9.20968 10.6616 10.3417C10.6467 10.3621 10.5677 10.477 10.5579 10.6778C10.5454 10.9341 10.6364 11.5269 11.5548 12.4453C12.4729 13.3635 13.0656 13.4547 13.3221 13.4422C13.5231 13.4325 13.6381 13.3535 13.6585 13.3386C14.7905 12.2203 16.5176 11.8947 17.8864 12.6587L19.0493 13.3077C21.1454 14.4775 21.2731 17.3126 19.5931 18.9927C18.6944 19.8914 17.4995 20.6899 16.0953 20.7431C14.0144 20.822 10.5591 20.2846 7.13735 16.8628C3.71556 13.441 3.17818 9.98579 3.25706 7.90486C3.3103 6.50066 4.10879 5.30574 5.00745 4.40708ZM9.38265 5.68185C8.78363 4.60851 7.17394 4.36191 6.06811 5.46774C5.29276 6.24309 4.7887 7.0989 4.75599 7.96168C4.6902 9.69702 5.11864 12.7228 8.19801 15.8021C11.2774 18.8815 14.3031 19.31 16.0385 19.2442C16.9013 19.2115 17.7571 18.7074 18.5324 17.932C19.6382 16.8262 19.3916 15.2165 18.3183 14.6175L17.1554 13.9685C16.432 13.5648 15.4158 13.7025 14.7025 14.4158C14.6325 14.4858 14.1864 14.902 13.395 14.9405C12.5847 14.9799 11.604 14.6158 10.4942 13.506C9.38395 12.3958 9.02003 11.4148 9.0597 10.6045C9.09846 9.81294 9.51468 9.36733 9.58432 9.29768C10.2976 8.58436 10.4354 7.56819 10.0317 6.84478L9.38265 5.68185Z" fill="#1C274C" />
                                                    </svg>
                                                </Link>
                                                <Link prefetch={false} scroll={false} href="" className="">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.98899 5.30778C10.169 2.90545 12.6404 1.25 15.5 1.25C19.5041 1.25 22.75 4.49594 22.75 8.5C22.75 9.57209 22.5168 10.5918 22.0977 11.5093C21.9883 11.7488 21.967 11.975 22.0156 12.1568L22.143 12.6328C22.5507 14.1566 21.1566 15.5507 19.6328 15.143L19.1568 15.0156C19.0215 14.9794 18.8616 14.982 18.6899 15.0307C18.1798 19.3775 14.4838 22.75 10 22.75C8.65003 22.75 7.36949 22.4438 6.2259 21.8963C5.99951 21.7879 5.7766 21.7659 5.59324 21.815L4.3672 22.143C2.84337 22.5507 1.44927 21.1566 1.857 19.6328L2.18504 18.4068C2.2341 18.2234 2.21211 18.0005 2.10373 17.7741C1.55623 16.6305 1.25 15.35 1.25 14C1.25 9.50945 4.63273 5.80897 8.98899 5.30778ZM10.735 5.28043C15.0598 5.64011 18.4914 9.14511 18.736 13.5016C18.9986 13.4766 19.2714 13.4935 19.5445 13.5666L20.0205 13.694C20.4293 13.8034 20.8034 13.4293 20.694 13.0205L20.5666 12.5445C20.4095 11.9571 20.5119 11.3708 20.7333 10.8861C21.0649 10.1602 21.25 9.35275 21.25 8.5C21.25 5.32436 18.6756 2.75 15.5 2.75C13.5181 2.75 11.7692 3.75284 10.735 5.28043ZM10 6.75C5.99594 6.75 2.75 9.99594 2.75 14C2.75 15.121 3.00392 16.1807 3.45667 17.1264C3.69207 17.6181 3.79079 18.2087 3.63407 18.7945L3.30602 20.0205C3.19664 20.4293 3.57066 20.8034 3.97949 20.694L5.20553 20.3659C5.79126 20.2092 6.38191 20.3079 6.87362 20.5433C7.81932 20.9961 8.87896 21.25 10 21.25C14.0041 21.25 17.25 18.0041 17.25 14C17.25 9.99594 14.0041 6.75 10 6.75Z" fill="#1C274C" />
                                                        <path d="M7.5 14C7.5 14.5523 7.05228 15 6.5 15C5.94772 15 5.5 14.5523 5.5 14C5.5 13.4477 5.94772 13 6.5 13C7.05228 13 7.5 13.4477 7.5 14Z" fill="#1C274C" />
                                                        <path d="M11 14C11 14.5523 10.5523 15 10 15C9.44772 15 9 14.5523 9 14C9 13.4477 9.44772 13 10 13C10.5523 13 11 13.4477 11 14Z" fill="#1C274C" />
                                                        <path d="M14.5 14C14.5 14.5523 14.0523 15 13.5 15C12.9477 15 12.5 14.5523 12.5 14C12.5 13.4477 12.9477 13 13.5 13C14.0523 13 14.5 13.4477 14.5 14Z" fill="#1C274C" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                : null}

                            <div className="sht_303mainInnerFourthDiv">
                                <div className="container">
                                    <div className="sht_303mainInnenFifteenDiv">
                                        <div>
                                            <h2 className="sht_303mainInnerSecXsHeading">{lang == 'ar' ? 'تفاصيل المنتج' : 'Product Details'}</h2>
                                            {ordertype == 1 ? (
                                                products.map((product, index) => (
                                                    <div key={index} className="sht_303mainInnenSixteenDiv">
                                                        <Image
                                                            alt="Product Image"
                                                            title={product.product_name}
                                                            loading="lazy"
                                                            width={80}
                                                            height={80}
                                                            decoding="async"
                                                            data-nimg="1"
                                                            src={product.product_image.replace('/public', '') || 'https://images.tamkeenstores.com.sa/assets/new-media/GS55WOST-1W.webp'}
                                                        />
                                                        <div>
                                                            <p className="font-semibold">{product.sku || 'N/A'}</p>
                                                            <p className="mt-0.5">{product.product_name || 'No product name available'}</p>
                                                            <p className="mt-3 font-semibold">{lang == 'ar' ? 'الكمية:' : 'QTY:'}  {product.quantity || 1}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                onlineproducts.map((product, index) => (
                                                    <div key={index} className="sht_303mainInnenSixteenDiv">
                                                        <Image
                                                            alt="Product Image"
                                                            title={lang === 'ar' ? product.product_data.name_arabic : product.product_data.name}
                                                            loading="lazy"
                                                            width={80}
                                                            height={80}
                                                            decoding="async"
                                                            data-nimg="1"
                                                            src={product.product_image.replace('/public', '') || 'https://images.tamkeenstores.com.sa/assets/new-media/GS55WOST-1W.webp'}
                                                        />
                                                        <div>
                                                            <p className="font-semibold">{product.product_data?.sku || 'N/A'}</p>
                                                            <p className="mt-0.5">{lang === 'ar' ? product.product_data.name_arabic : product.product_data.name}</p>
                                                            <p className="mt-3 font-semibold">{lang == 'ar' ? 'الكمية:' : 'QTY:'}  {product.quantity || 1}</p>
                                                            {product?.expressproduct == 1 ?
                                                            <Image
                                                                src={lang === 'ar' ? `/icons/express_logo/express_logo_ar.png` : `/icons/express_logo/express_logo_en.png`}
                                                                alt={lang === 'ar' ? "express delivery" : "express delivery"}
                                                                title={lang === 'ar' ? "express delivery" : "express delivery"}
                                                                height={65}
                                                                width={65}
                                                                loading='lazy'
                                                                className='rounded-md'
                                                                sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw'
                                                            />
                                                            : null}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className='mt-10'>
                                <h4 className="text-[#004B7A] text-center text-xl font-semibold">
                                    {params?.lang == 'ar' ? 'لم يتم العثور على شحنة' : 'No Shipment Found'}
                                </h4>
                            </div>
                        </>}
                    <div className='h-32'></div>
                </>
                :
                <>
                    <div className="sht_303mainInnenSeventeenDiv">
                        <div className="container">
                            <div className="sht_303mainInnenEighteenDiv">
                                <Link prefetch={false} scroll={false} href={`${origin}/${params?.lang}`} as={`${origin}/${params?.lang}`}>
                                    <Image
                                        alt="logo"
                                        title="Tamkeen Logo"
                                        loading="lazy"
                                        width={100}
                                        height={100}
                                        decoding="async"
                                        data-nimg="1"
                                        src="/images/logo.webp"
                                    />
                                </Link>
                                <Link prefetch={false} scroll={false} href={`${origin}/${params?.lang}`} as={`${origin}/${params?.lang}`} className="btn bg-primary text-xs font-semibold p-3 rounded-md text-white shadow-md hover:shadow-none">
                                    {lang == 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
                                </Link>
                            </div>
                            {!shipmentFound ?
                                <>
                                    <hr className="sht_303mainInnerHr" />
                                    <div className="sht_303mainInnenNineteenDiv">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.50626 15.2647C7.61657 15.6639 8.02965 15.8982 8.4289 15.7879C8.82816 15.6776 9.06241 15.2645 8.9521 14.8652L7.50626 15.2647ZM6.07692 7.27442L6.79984 7.0747V7.0747L6.07692 7.27442ZM4.7037 5.91995L4.50319 6.64265L4.7037 5.91995ZM3.20051 4.72457C2.80138 4.61383 2.38804 4.84762 2.2773 5.24675C2.16656 5.64589 2.40035 6.05923 2.79949 6.16997L3.20051 4.72457ZM20.1886 15.7254C20.5895 15.6213 20.8301 15.2118 20.7259 14.8109C20.6217 14.41 20.2123 14.1695 19.8114 14.2737L20.1886 15.7254ZM10.1978 17.5588C10.5074 18.6795 9.82778 19.8618 8.62389 20.1747L9.00118 21.6265C10.9782 21.1127 12.1863 19.1239 11.6436 17.1594L10.1978 17.5588ZM8.62389 20.1747C7.41216 20.4896 6.19622 19.7863 5.88401 18.6562L4.43817 19.0556C4.97829 21.0107 7.03196 22.1383 9.00118 21.6265L8.62389 20.1747ZM5.88401 18.6562C5.57441 17.5355 6.254 16.3532 7.4579 16.0403L7.08061 14.5885C5.10356 15.1023 3.89544 17.0911 4.43817 19.0556L5.88401 18.6562ZM7.4579 16.0403C8.66962 15.7254 9.88556 16.4287 10.1978 17.5588L11.6436 17.1594C11.1035 15.2043 9.04982 14.0768 7.08061 14.5885L7.4579 16.0403ZM8.9521 14.8652L6.79984 7.0747L5.354 7.47414L7.50626 15.2647L8.9521 14.8652ZM4.90421 5.19725L3.20051 4.72457L2.79949 6.16997L4.50319 6.64265L4.90421 5.19725ZM6.79984 7.0747C6.54671 6.15847 5.8211 5.45164 4.90421 5.19725L4.50319 6.64265C4.92878 6.76073 5.24573 7.08223 5.354 7.47414L6.79984 7.0747ZM11.1093 18.085L20.1886 15.7254L19.8114 14.2737L10.732 16.6332L11.1093 18.085Z" fill="#1C274C" />
                                            <path opacity="0.5" d="M9.56541 8.73049C9.0804 6.97492 8.8379 6.09714 9.24954 5.40562C9.66119 4.71409 10.5662 4.47889 12.3763 4.00849L14.2962 3.50955C16.1062 3.03915 17.0113 2.80394 17.7242 3.20319C18.4372 3.60244 18.6797 4.48023 19.1647 6.2358L19.6792 8.09786C20.1642 9.85343 20.4067 10.7312 19.995 11.4227C19.5834 12.1143 18.6784 12.3495 16.8683 12.8199L14.9484 13.3188C13.1384 13.7892 12.2333 14.0244 11.5203 13.6252C10.8073 13.2259 10.5648 12.3481 10.0798 10.5926L9.56541 8.73049Z" stroke="#1C274C" strokeWidth="1.5" />
                                        </svg>
                                        {/* <h1 className="text__txs text-dark">Your order is schedule for delivery by <span className="sht_303mainInnerSpan">Tamkeen Stores</span> your shipment number is <span className="sht_303mainInnerSpan">{shipmentnumber}</span></h1> */}
                                        <h1 className="text__txs text-dark">{lang == 'ar' ? 'طلبك محدد للتسليم بحلول' : 'Your order is schedule for delivery by '}<span className="sht_303mainInnerSpan">{lang == 'ar' ? 'تمكين متاجر' : 'Tamkeen Stores'}</span> {lang == 'ar' ? 'شحنتك لا' : 'your shipment number is '} <span className="sht_303mainInnerSpan">{shipmentnumber}</span></h1>
                                    </div>
                                </>
                                : null}
                        </div>
                    </div>
                    {!shipmentFound ?
                        <>
                            <div className="sht_303mainInnenTwTYDiv">
                                <div className="container">
                                    <div className="sht_303mainInnenFifteenDiv">
                                        <div>
                                            <h2 className="sht_303mainInnerSecXsHeading">{lang == 'ar' ? 'الشحنات تفاصيل التوصيل' : 'Shipment Delivery Details'}</h2>
                                            <div className="sht_303mainInnerSeventhDiv">
                                                <p className="sht_303mainInnerPara !text-sm">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="12" cy="6" r="4" stroke="#1C274C" strokeWidth="1.5" />
                                                        <path d="M15 20.6151C14.0907 20.8619 13.0736 21 12 21C8.13401 21 5 19.2091 5 17C5 14.7909 8.13401 13 12 13C15.866 13 19 14.7909 19 17C19 17.3453 18.9234 17.6804 18.7795 18" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                    {ordertype === 1 ? (
                                                        <>
                                                            {firstName ? (
                                                                <>{firstName} {lastName}</>
                                                            ) : (
                                                                '-----'
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {onlinefirstName ? (
                                                                <>{onlinefirstName} {onlinelastName}</>
                                                            ) : (
                                                                '-----'
                                                            )}
                                                        </>
                                                    )}
                                                </p>
                                                <p className="sht_303mainInnerSecPara text-sm">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12.5 7.04148C12.3374 7.0142 12.1704 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10C15 9.82964 14.9858 9.6626 14.9585 9.5" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M5 15.2161C4.35254 13.5622 4 11.8013 4 10.1433C4 5.64588 7.58172 2 12 2C16.4183 2 20 5.64588 20 10.1433C20 14.6055 17.4467 19.8124 13.4629 21.6744C12.5343 22.1085 11.4657 22.1085 10.5371 21.6744C9.26474 21.0797 8.13831 20.1439 7.19438 19" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                    {ordertype === 1 ? (
                                                        <>
                                                            {address ? (
                                                                <>{address}</>
                                                            ) : (
                                                                '-----'
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {onlineaddress ? (
                                                                <>{onlineaddress}</>
                                                            ) : (
                                                                '-----'
                                                            )}
                                                        </>
                                                    )}
                                                </p>
                                                <p className="sht_303mainInnerThirdPara">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5.00659 6.93309C5.04956 5.7996 5.70084 4.77423 6.53785 3.93723C7.9308 2.54428 10.1532 2.73144 11.0376 4.31617L11.6866 5.4791C12.2723 6.52858 12.0372 7.90533 11.1147 8.8278M17.067 18.9934C18.2004 18.9505 19.2258 18.2992 20.0628 17.4622C21.4558 16.0692 21.2686 13.8468 19.6839 12.9624L18.5209 12.3134C17.4715 11.7277 16.0947 11.9628 15.1722 12.8853" stroke="#1C274C" strokeWidth="1.5" />
                                                        <path opacity="0.5" d="M5.00655 6.93311C4.93421 8.84124 5.41713 12.0817 8.6677 15.3323C11.9183 18.5829 15.1588 19.0658 17.0669 18.9935M15.1722 12.8853C15.1722 12.8853 14.0532 14.0042 12.0245 11.9755C9.99578 9.94676 11.1147 8.82782 11.1147 8.82782" stroke="#1C274C" strokeWidth="1.5" />
                                                    </svg>
                                                    <Link prefetch={false} scroll={false} href="">
                                                        {ordertype === 1 ? (
                                                            <>
                                                                {phonenumber ? (
                                                                    <>
                                                                        {lang === 'ar' ? (
                                                                            <span>{phonenumber} 966+</span>
                                                                        ) : (
                                                                            <span>+966 {phonenumber}</span>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    '-----'
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {onlinePhoneNumber ? (
                                                                    <>
                                                                        {lang === 'ar' ? (
                                                                            <span>{onlinePhoneNumber} 966+</span>
                                                                        ) : (
                                                                            <span>+966 {onlinePhoneNumber}</span>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    '-----'
                                                                )}
                                                            </>
                                                        )}
                                                    </Link>
                                                </p>
                                                <p className="sht_303mainInnerSecPara text-sm">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2 5.25732C2 3.45835 3.567 2 5.5 2C7.433 2 9 3.45835 9 5.25732C9 7.04219 7.88292 9.12496 6.14003 9.86978C5.73374 10.0434 5.26626 10.0434 4.85997 9.86978C3.11708 9.12496 2 7.04219 2 5.25732Z" stroke="#1C274C" strokeWidth="1.5" />
                                                        <path d="M15 17.2573C15 15.4584 16.567 14 18.5 14C20.433 14 22 15.4584 22 17.2573C22 19.0422 20.8829 21.125 19.14 21.8698C18.7337 22.0434 18.2663 22.0434 17.86 21.8698C16.1171 21.125 15 19.0422 15 17.2573Z" stroke="#1C274C" strokeWidth="1.5" />
                                                        <path d="M19.5 17.5C19.5 18.0523 19.0523 18.5 18.5 18.5C17.9477 18.5 17.5 18.0523 17.5 17.5C17.5 16.9477 17.9477 16.5 18.5 16.5C19.0523 16.5 19.5 16.9477 19.5 17.5Z" fill="#1C274C" />
                                                        <path d="M6.5 5.5C6.5 6.05228 6.05228 6.5 5.5 6.5C4.94772 6.5 4.5 6.05228 4.5 5.5C4.5 4.94772 4.94772 4.5 5.5 4.5C6.05228 4.5 6.5 4.94772 6.5 5.5Z" fill="#1C274C" />
                                                        <path d="M12 4.25C11.5858 4.25 11.25 4.58579 11.25 5C11.25 5.41421 11.5858 5.75 12 5.75V4.25ZM12 19L12.5303 19.5303C12.8232 19.2374 12.8232 18.7626 12.5303 18.4697L12 19ZM17.2056 8.68732L17.6083 9.32007L17.2056 8.68732ZM6.79434 15.3127L7.197 15.9454H7.197L6.79434 15.3127ZM11.0303 16.9697C10.7374 16.6768 10.2625 16.6768 9.96964 16.9697C9.67675 17.2626 9.67675 17.7374 9.96964 18.0303L11.0303 16.9697ZM9.96964 19.9697C9.67675 20.2626 9.67675 20.7374 9.96964 21.0303C10.2625 21.3232 10.7374 21.3232 11.0303 21.0303L9.96964 19.9697ZM10.8312 13.6327C11.1807 13.4104 11.2837 12.9468 11.0613 12.5973C10.8389 12.2479 10.3753 12.1449 10.0259 12.3673L10.8312 13.6327ZM13.1687 10.3673C12.8193 10.5896 12.7163 11.0532 12.9387 11.4027C13.161 11.7521 13.6246 11.8551 13.9741 11.6327L13.1687 10.3673ZM16.1319 4.25H12V5.75H16.1319V4.25ZM12 18.25H7.86809V19.75H12V18.25ZM12.5303 18.4697L11.0303 16.9697L9.96964 18.0303L11.4696 19.5303L12.5303 18.4697ZM11.4696 18.4697L9.96964 19.9697L11.0303 21.0303L12.5303 19.5303L11.4696 18.4697ZM7.86809 18.25C6.61754 18.25 6.14195 16.6168 7.197 15.9454L6.39169 14.6799C4.07059 16.157 5.11685 19.75 7.86809 19.75V18.25ZM16.1319 5.75C17.3824 5.75 17.858 7.38318 16.803 8.05458L17.6083 9.32007C19.9294 7.843 18.8831 4.25 16.1319 4.25V5.75ZM10.0259 12.3673L6.39169 14.6799L7.197 15.9454L10.8312 13.6327L10.0259 12.3673ZM16.803 8.05458L13.1687 10.3673L13.9741 11.6327L17.6083 9.32007L16.803 8.05458Z" fill="#1C274C" />
                                                    </svg>
                                                    {ordertype === 1 ? (
                                                        <>
                                                            {statecity ? (
                                                                <>
                                                                    {lang === 'ar' ? (
                                                                        <span>{statecityArabic}, المملكة العربية السعودية</span>
                                                                    ) : (
                                                                        <span>{statecity}, Saudi Arabia</span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                '-----'
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {onlineCity ? (
                                                                <>
                                                                    {lang === 'ar' ? (
                                                                        <span>{onlineCityArabic}, المملكة العربية السعودية</span>
                                                                    ) : (
                                                                        <span>{onlineCity}, Saudi Arabia</span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                '-----'
                                                            )}
                                                        </>
                                                    )}
                                                </p>
                                                {currentLocation || buttonhide === true ? (
                                                    <p className="sht_303mainInnerAddressPara">
                                                        {lang == 'ar' ? 'لقد أضفت عنوانًا' : 'You Added Address'}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <div className='text-center'>
                                                <button className='w-full'>
                                                {currentLocation ? 
                                                        <LoadScript googleMapsApiKey="AIzaSyB3ekz5eMwuRZGvFy2HUADZVhxAzTWV5Ok">
                                                            <GoogleMap
                                                                mapContainerStyle={mapContainerStyle2}
                                                                center={{ lat: currentLocation?.latitude, lng: currentLocation?.longitude }}
                                                                zoom={13}
                                                                // onClick={handleMapClick}
                                                            >
                                                                <Marker position={{ lat: currentLocation?.latitude, lng: currentLocation?.longitude }} />
                                                            </GoogleMap>
                                                        </LoadScript>
                                                    :  
                                                    <iframe src={currentLocation ? `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.485802976811!2d${currentLocation?.longitude}!3d${currentLocation?.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d1a697918559%3A0x23e0a0172940216a!2sYour%20Location!5e0!3m2!1sen!2ssa!4v1722844665143!5m2!1sen!2ssa` : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.485802976811!2d39.20758947568789!3d21.566952269075532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d1a697918559%3A0x23e0a0172940216a!2zSkRTQjMyMTTYjCAzMjE0INin2YTZh9iw2KfZhNmK2YTYjCA2NTI4LCBBcyBTYWZhIERpc3RyaWN0LCBKZWRkYWggMjM0NTE!5e0!3m2!1sen!2ssa!4v1722844665143!5m2!1sen!2ssa"} width="100%" height="130" className='rounded-md' style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                                    }
                                                    {/* <p className="mt-3 underline capitalize text-primary px-1">setup delivery location</p> */}
                                                </button>
                                                {!currentLocation && buttonhide === false ? (
                                                    <>
                                                        <button disabled={status == 4} className="w-full mt-3 underline text-sm disabled:text-gray" onClick={handleCurrentLocation}>
                                                            <i className="fas fa-map-marker-alt mr-2"></i>
                                                            {lang == 'ar' ? 'الموقع الحالي' : 'Current Location'}
                                                            {error && <p className="text-red-500">{error}</p>}
                                                            {isLocationAllowed === false && <p className="text-red-500">{params?.lang == 'ar' ? "الطلب مرفوض او العنوان غير متاح" : "Permission denied or location not available."}</p>}
                                                        </button>

                                                        <button disabled={status == 4}
                                                            className="mt-2 bg-primary flex items-center justify-center disabled:bg-gray text-white text-sm w-48 p-2.5 rounded-md mx-auto"
                                                            onClick={() => setisOpen(true)}
                                                        >
                                                            <i className="fas fa-cog mr-2"></i>
                                                            {lang == 'ar' ? 'موقع الإعداد' : 'Setup Location'}
                                                        </button>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <hr className="sht_303mainInnerHr" />
                            <div className="sht_303mainInnenParaBtnDiv">
                                <p className="font-normal">{lang == 'ar' ? 'تريد تغيير التسليم الخاص بك' : 'You want to change your delivery'} <span className="font-bold">{lang == 'ar' ? 'وقت' : 'Time'}</span> & <span className="font-bold">{lang == 'ar' ? 'تاريخ' : 'date'}</span>?</p>
                                <button className="sht_303mainInnerXsTextBtn">{lang == 'ar' ? 'اختر وقت التسليم والتاريخ المفضل' : 'Choose Preferred Delivery Time and Date'}</button>
                            </div>
                            <hr className="sht_303mainInnerHr" />
                            <div className="sht_303mainInnenParaBtnSecDiv">
                                <p className="font-normal">{lang == 'ar' ? 'للتحقق من هويتك، قم بإعطاء' : 'To verify your identity, give the'} <span className="font-bold capitalize">{lang == 'ar' ? 'شفرة' : 'code'} </span>{lang == 'ar' ? 'إلى موظف التسليم لدينا:' : 'to our delivery associate:'}</p>
                                <button className="sht_303mainInnerXsTextBtn">{lang == 'ar' ? 'إظهار الرمز' : 'Show Code'}</button>
                            </div> */}
                                </div>
                            </div>

                            <div className="sht_303mainInnerElevenDiv">
                                <div className="sht_303mainInnerTwelveDiv">
                                    <div className={`sht_303mainInnenStatusDiv ${lang === 'ar' ? 'rtl-progress' : ''}`}>
                                        <div className={`p-[1px] ${lang === 'ar' ? 'mr-auto w-[50%]' : 'ml-auto w-[50%]'} bg-primary`}></div>
                                        <div className={`sht_303mainInnenFSTDiv bg-primary`}></div>
                                        <div className={`sht_303mainInnenFSTDiv ${status >= 3 ? 'bg-primary' : 'bg-[#D9D9D9]'}`}></div>
                                        {/* <div className={`sht_303mainInnenFSTDiv ${status >= 2 ? 'bg-primary' : 'bg-[#D9D9D9]'}`}></div>
                                        <div className={`sht_303mainInnenFSTDiv ${status >= 3 ? 'bg-primary' : 'bg-[#D9D9D9]'}`}></div> */}
                                        <div className={`p-[1px] ${lang === 'ar' ? 'ml-auto w-[43%]' : 'mr-auto w-[43%]'} ${status == 4 ? 'bg-primary' : 'bg-[#D9D9D9]'}`}></div>
                                    </div>
                                    <div className={`sht_303mainInnerFStatusDiv ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`sht_303mainInnenSSTDiv bg-primary`}></div>
                                        <div className={`sht_303mainInnenSSTDiv bg-primary`}></div>
                                        <div className={`sht_303mainInnenSSTDiv ${status >= 3 ? 'bg-primary' : 'bg-[#D9D9D9]'}`}></div>
                                        {/* <div className={`sht_303mainInnenSSTDiv ${status >= 2 ? 'bg-primary' : 'bg-[#D9D9D9]'}`}></div> */}
                                        {/* <div className={`sht_303mainInnenSSTDiv ${status >= 3 ? 'bg-primary' : 'bg-[#D9D9D9]'}`}></div> */}
                                        <div className={`sht_303mainInnenSSTDiv ${status == 4 ? 'bg-primary' : 'bg-[#D9D9D9]'}`}></div>
                                    </div>
                                    <div className="sht_303mainInnerSStatusDiv">
                                        <div className={`m-auto text-primary`}>{lang === 'ar' ? 'جاري معالجة طلبك' : 'Your Order Processing'}</div>
                                        <div className={`m-auto text-primary`}>{lang === 'ar' ? 'تم استلام طلبك' : 'Your Order Received'}</div>
                                        {/* <div className={`m-auto text-primary`}>{lang === 'ar' ? 'تم إنشاء الشحنة' : 'Shipment Created'}</div> */}
                                        {/* <div className={`m-auto ${status >= 2 ? 'text-primary' : 'text-[#D9D9D9]'}`}>{lang === 'ar' ? 'في العبور' : '⁠In Transit'}</div> */}
                                        <div className={`m-auto ${status >= 3 ? 'text-primary' : 'text-[#D9D9D9]'}`}>{lang === 'ar' ? 'طلبك خارج للتوصيل' : 'Out of Delivery'}</div>
                                        <div className={`m-auto ${status == 4 ? 'text-primary' : 'text-[#D9D9D9]'}`}>{lang === 'ar' ? 'تم التسليم' : 'Delivered'}</div>
                                    </div>
                                </div>
                            </div>

                            {riderName ?
                                <div className="sht_303mainInnenTwTYDiv">
                                    <div className="container">
                                        <div className="sht_303mainInnenFifteenDiv">
                                            <div>
                                                <h2 className="sht_303mainInnerSecXsHeading">{lang == 'ar' ? 'تفاصيل الراكب' : 'Rider Details'}</h2>
                                                <div className="sht_303mainInnerSeventhDiv">
                                                    <p className="sht_303mainInnerPara text-sm">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="12" cy="6" r="4" stroke="#1C274C" strokeWidth="1.5" />
                                                            <path d="M15 20.6151C14.0907 20.8619 13.0736 21 12 21C8.13401 21 5 19.2091 5 17C5 14.7909 8.13401 13 12 13C15.866 13 19 14.7909 19 17C19 17.3453 18.9234 17.6804 18.7795 18" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                                                        </svg>
                                                        {riderName ? (
                                                            `${riderName} ${riderlastName}`
                                                        ) : (
                                                            lang === 'ar' ? 'لم يتم تعيين متسابق' : 'No Rider Assigned'
                                                        )}
                                                    </p>
                                                    <p className="sht_303mainInnerSecPara text-sm">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12.5 7.04148C12.3374 7.0142 12.1704 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10C15 9.82964 14.9858 9.6626 14.9585 9.5" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path d="M5 15.2161C4.35254 13.5622 4 11.8013 4 10.1433C4 5.64588 7.58172 2 12 2C16.4183 2 20 5.64588 20 10.1433C20 14.6055 17.4467 19.8124 13.4629 21.6744C12.5343 22.1085 11.4657 22.1085 10.5371 21.6744C9.26474 21.0797 8.13831 20.1439 7.19438 19" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                                                        </svg>
                                                        {pickup ? (
                                                            lang === 'ar' ? (
                                                                `${pickupArabic}`
                                                            ) : (
                                                                `${pickup}`
                                                            )
                                                        ) : (
                                                            '-----'
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="sht_303mainTelLinkDiv">
                                                <Link prefetch={false} scroll={false} href={`tel:+966${riderNumber}`} className="">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M13.2596 1.88032C13.3258 1.47143 13.7124 1.19406 14.1212 1.26025C14.1466 1.2651 14.228 1.28032 14.2707 1.28982C14.356 1.30882 14.475 1.33808 14.6234 1.38131C14.9202 1.46775 15.3348 1.61015 15.8324 1.83829C16.8287 2.29505 18.1545 3.09405 19.5303 4.46985C20.9061 5.84565 21.7051 7.17146 22.1619 8.16774C22.39 8.66536 22.5324 9.07996 22.6188 9.37674C22.6621 9.52515 22.6913 9.64417 22.7103 9.7295C22.7198 9.77217 22.7268 9.80643 22.7316 9.83174L22.7374 9.86294C22.8036 10.2718 22.5287 10.6743 22.1198 10.7405C21.7121 10.8065 21.328 10.5305 21.2602 10.1235C21.2581 10.1126 21.2524 10.0833 21.2462 10.0556C21.2339 10.0002 21.2125 9.91236 21.1787 9.79621C21.111 9.56388 20.9935 9.21854 20.7983 8.79287C20.4085 7.94256 19.7075 6.76837 18.4696 5.53051C17.2318 4.29265 16.0576 3.59165 15.2073 3.20182C14.7816 3.00667 14.4363 2.88913 14.2039 2.82146C14.0878 2.78763 13.9418 2.75412 13.8864 2.74178C13.4794 2.67396 13.1936 2.28804 13.2596 1.88032Z" fill="#1C274C" />
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M13.4859 5.32978C13.5997 4.93151 14.0148 4.70089 14.413 4.81468L14.207 5.53583C14.413 4.81468 14.413 4.81468 14.413 4.81468L14.4145 4.8151L14.416 4.81554L14.4194 4.81651L14.4271 4.81883L14.4469 4.82499C14.462 4.82981 14.4808 4.83609 14.5033 4.84406C14.5482 4.85999 14.6075 4.88266 14.6803 4.91386C14.826 4.9763 15.0251 5.07272 15.2696 5.21743C15.7591 5.50711 16.4272 5.98829 17.2122 6.77326C17.9972 7.55823 18.4784 8.22642 18.768 8.71589C18.9128 8.9604 19.0092 9.15946 19.0716 9.30515C19.1028 9.37795 19.1255 9.43731 19.1414 9.48222C19.1494 9.50467 19.1557 9.5235 19.1605 9.53858L19.1666 9.55837L19.169 9.56612L19.1699 9.56945L19.1704 9.57098C19.1704 9.57098 19.1708 9.57243 18.4496 9.77847L19.1708 9.57242C19.2846 9.9707 19.054 10.3858 18.6557 10.4996C18.2608 10.6124 17.8493 10.3867 17.7315 9.99462L17.7278 9.98384C17.7224 9.96881 17.7114 9.93923 17.6929 9.89602C17.6559 9.80969 17.5888 9.66846 17.4772 9.47987C17.2542 9.10312 16.8515 8.53388 16.1516 7.83392C15.4516 7.13397 14.8823 6.73126 14.5056 6.5083C14.317 6.39668 14.1758 6.32958 14.0894 6.29258C14.0462 6.27407 14.0167 6.26303 14.0016 6.2577L13.9909 6.254C13.5988 6.13613 13.373 5.72468 13.4859 5.32978Z" fill="#1C274C" />
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M5.00745 4.40708C6.68752 2.72701 9.52266 2.85473 10.6925 4.95085L11.3415 6.11378C12.1054 7.4826 11.7799 9.20968 10.6616 10.3417C10.6467 10.3621 10.5677 10.477 10.5579 10.6778C10.5454 10.9341 10.6364 11.5269 11.5548 12.4453C12.4729 13.3635 13.0656 13.4547 13.3221 13.4422C13.5231 13.4325 13.6381 13.3535 13.6585 13.3386C14.7905 12.2203 16.5176 11.8947 17.8864 12.6587L19.0493 13.3077C21.1454 14.4775 21.2731 17.3126 19.5931 18.9927C18.6944 19.8914 17.4995 20.6899 16.0953 20.7431C14.0144 20.822 10.5591 20.2846 7.13735 16.8628C3.71556 13.441 3.17818 9.98579 3.25706 7.90486C3.3103 6.50066 4.10879 5.30574 5.00745 4.40708ZM9.38265 5.68185C8.78363 4.60851 7.17394 4.36191 6.06811 5.46774C5.29276 6.24309 4.7887 7.0989 4.75599 7.96168C4.6902 9.69702 5.11864 12.7228 8.19801 15.8021C11.2774 18.8815 14.3031 19.31 16.0385 19.2442C16.9013 19.2115 17.7571 18.7074 18.5324 17.932C19.6382 16.8262 19.3916 15.2165 18.3183 14.6175L17.1554 13.9685C16.432 13.5648 15.4158 13.7025 14.7025 14.4158C14.6325 14.4858 14.1864 14.902 13.395 14.9405C12.5847 14.9799 11.604 14.6158 10.4942 13.506C9.38395 12.3958 9.02003 11.4148 9.0597 10.6045C9.09846 9.81294 9.51468 9.36733 9.58432 9.29768C10.2976 8.58436 10.4354 7.56819 10.0317 6.84478L9.38265 5.68185Z" fill="#1C274C" />
                                                    </svg>
                                                </Link>
                                                <Link prefetch={false} scroll={false} href={`https://wa.me/966${riderNumber}?text=Hi`} className="">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.98899 5.30778C10.169 2.90545 12.6404 1.25 15.5 1.25C19.5041 1.25 22.75 4.49594 22.75 8.5C22.75 9.57209 22.5168 10.5918 22.0977 11.5093C21.9883 11.7488 21.967 11.975 22.0156 12.1568L22.143 12.6328C22.5507 14.1566 21.1566 15.5507 19.6328 15.143L19.1568 15.0156C19.0215 14.9794 18.8616 14.982 18.6899 15.0307C18.1798 19.3775 14.4838 22.75 10 22.75C8.65003 22.75 7.36949 22.4438 6.2259 21.8963C5.99951 21.7879 5.7766 21.7659 5.59324 21.815L4.3672 22.143C2.84337 22.5507 1.44927 21.1566 1.857 19.6328L2.18504 18.4068C2.2341 18.2234 2.21211 18.0005 2.10373 17.7741C1.55623 16.6305 1.25 15.35 1.25 14C1.25 9.50945 4.63273 5.80897 8.98899 5.30778ZM10.735 5.28043C15.0598 5.64011 18.4914 9.14511 18.736 13.5016C18.9986 13.4766 19.2714 13.4935 19.5445 13.5666L20.0205 13.694C20.4293 13.8034 20.8034 13.4293 20.694 13.0205L20.5666 12.5445C20.4095 11.9571 20.5119 11.3708 20.7333 10.8861C21.0649 10.1602 21.25 9.35275 21.25 8.5C21.25 5.32436 18.6756 2.75 15.5 2.75C13.5181 2.75 11.7692 3.75284 10.735 5.28043ZM10 6.75C5.99594 6.75 2.75 9.99594 2.75 14C2.75 15.121 3.00392 16.1807 3.45667 17.1264C3.69207 17.6181 3.79079 18.2087 3.63407 18.7945L3.30602 20.0205C3.19664 20.4293 3.57066 20.8034 3.97949 20.694L5.20553 20.3659C5.79126 20.2092 6.38191 20.3079 6.87362 20.5433C7.81932 20.9961 8.87896 21.25 10 21.25C14.0041 21.25 17.25 18.0041 17.25 14C17.25 9.99594 14.0041 6.75 10 6.75Z" fill="#1C274C" />
                                                        <path d="M7.5 14C7.5 14.5523 7.05228 15 6.5 15C5.94772 15 5.5 14.5523 5.5 14C5.5 13.4477 5.94772 13 6.5 13C7.05228 13 7.5 13.4477 7.5 14Z" fill="#1C274C" />
                                                        <path d="M11 14C11 14.5523 10.5523 15 10 15C9.44772 15 9 14.5523 9 14C9 13.4477 9.44772 13 10 13C10.5523 13 11 13.4477 11 14Z" fill="#1C274C" />
                                                        <path d="M14.5 14C14.5 14.5523 14.0523 15 13.5 15C12.9477 15 12.5 14.5523 12.5 14C12.5 13.4477 12.9477 13 13.5 13C14.0523 13 14.5 13.4477 14.5 14Z" fill="#1C274C" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : null}
                            <div className="sht_303mainInnenTwTYDiv">
                                <div className="container">
                                    <div className="sht_303mainInnenFifteenDiv">
                                        <div>
                                            <h2 className="sht_303mainInnerSecXsHeading">{lang == 'ar' ? 'تفاصيل المنتج' : 'Product Details'}</h2>
                                            {ordertype == 1 ? (
                                                products.map((product, index) => (
                                                    <div key={index} className="sht_303mainInnenSixteenDiv">
                                                        <Image
                                                            alt="Product Image"
                                                            title={product.product_name}
                                                            loading="lazy"
                                                            width={100}
                                                            height={100}
                                                            decoding="async"
                                                            data-nimg="1"
                                                            src={product.product_image.replace('/public', '') || 'https://images.tamkeenstores.com.sa/assets/new-media/GS55WOST-1W.webp'}
                                                        />
                                                        <div>
                                                            <p className="font-semibold">{product.sku || 'N/A'}</p>
                                                            <p className="mt-0.5">{lang === 'ar' ? product.product_data.name_arabic : product.product_data.name}</p>
                                                            <p className="mt-2">{lang == 'ar' ? 'الكمية:' : 'QTY:'} {product.quantity || 1}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                onlineproducts.map((product, index) => (
                                                    <div key={index} className="sht_303mainInnenSixteenDiv">
                                                        <Image
                                                            alt="Product Image"
                                                            title={lang === 'ar' ? product.product_data.name_arabic : product.product_data.name}
                                                            loading="lazy"
                                                            width={100}
                                                            height={100}
                                                            decoding="async"
                                                            data-nimg="1"
                                                            src={product.product_image.replace('/public', '') || 'https://images.tamkeenstores.com.sa/assets/new-media/GS55WOST-1W.webp'}
                                                        />
                                                        <div>
                                                            <p className="font-semibold">{product.product_data?.sku || 'N/A'}</p>
                                                            <p className="mt-0.5">{lang === 'ar' ? product.product_data.name_arabic : product.product_data.name}</p>
                                                            <p className="mt-2">{lang == 'ar' ? 'الكمية:' : 'QTY:'} {product.quantity || 1}</p>
                                                            {product?.expressproduct == 1 ?
                                                            <Image
                                                                src={lang === 'ar' ? `/icons/express_logo/express_logo_ar.png` : `/icons/express_logo/express_logo_en.png`}
                                                                alt={lang === 'ar' ? "express delivery" : "express delivery"}
                                                                title={lang === 'ar' ? "express delivery" : "express delivery"}
                                                                height={65}
                                                                width={65}
                                                                loading='lazy'
                                                                className='rounded-md'
                                                                sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw'
                                                            />
                                                            : null}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className='mt-10'>
                                <h4 className="text-[#004B7A] text-center text-xl font-semibold">
                                    {params?.lang == 'ar' ? 'لم يتم العثور على شحنة' : 'No Shipment Found'}
                                </h4>
                            </div>
                        </>
                    }
                    <Transition appear show={isOpen} as={Fragment}>
                        <Dialog as="div" open={isOpen} onClose={() => setisOpen(false)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="sht_303mainModalFirstDiv">
                                    <div className="sht_303mainModalSecDiv">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 scale-95"
                                            enterTo="opacity-100 scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 scale-100"
                                            leaveTo="opacity-0 scale-95"
                                        >
                                            <Dialog.Panel className="sht_303mainDialogPanelDiv">
                                                <div className="sht_303mainModalThirdDiv">
                                                    <h5 className="sht_303mainLgHeading">{lang == 'ar' ? 'رسم خريطة' : 'Map'}</h5>
                                                    <button
                                                        onClick={() => setisOpen(false)}
                                                        type="button"
                                                        className="text-white-dark hover:text-dark"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Google Map */}
                                                <div className="sht_303mainInnerMapDiv">
                                                    <LoadScript googleMapsApiKey="AIzaSyB3ekz5eMwuRZGvFy2HUADZVhxAzTWV5Ok">
                                                        <GoogleMap
                                                            mapContainerStyle={mapContainerStyle}
                                                            center={{ lat: 23.8859, lng: 45.0792 }}
                                                            zoom={13}
                                                            onClick={handleMapClick}
                                                        >
                                                            {position && <Marker position={position} />}
                                                        </GoogleMap>
                                                    </LoadScript>
                                                </div>

                                                {/* Modal Footer */}
                                                <div className="sht_303mainInnerMFooterDiv">
                                                    <button
                                                        className="sht_303mainInnerCloseBtn"
                                                        onClick={() => setisOpen(false)}
                                                    >
                                                        Close
                                                    </button>
                                                    <button
                                                        className="sht_303mainSaveBtn"
                                                        onClick={() => handleSaveLocation(position)}
                                                        disabled={!position || loadingsave}
                                                    >
                                                        {loadingsave ? (
                                                            <button disabled type="button" className="sht_303mainInnerSaveBtn">
                                                                <svg aria-hidden="true" role="status" className="w-4 h-4 mr-2 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                                                </svg>
                                                                {lang == 'ar' ? '...توفير' : 'Saving...'}
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-save mr-2"></i>
                                                                {lang == 'ar' ? 'حفظ الموقع' : 'Save Location'}
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Transition.Child>
                        </Dialog>
                    </Transition>
                </>
            }
        </>
    )
}