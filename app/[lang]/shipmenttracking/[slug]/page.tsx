"use client"; // This is a client component 👈🏽
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { useState, Fragment, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { getDictionary } from "../../dictionaries"
import { useSlot } from '@/app/_ctx/ClientDataRegistry';
import { useApp } from '@/app/_ctx/AppContext';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import UserIcon from '../../components/Icons/UserIcon';
import LocationPinIcon from '../../components/Icons/PinLocationIcon';
import PhoneIcon from '../../components/Icons/PhoneIcon';
import ChatIcon from '../../components/Icons/ChatIcon';
import NetworkIcon from '../../components/Icons/NetworkIcon';

export default function ShipmentTracking() {
    const { lang, origin } = useApp();
    const shipmentTracking = useSlot<any>("shipmentTracking");
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
            const translationdata = await getDictionary(lang as any);
            setDict(translationdata);
        })();
        if (shipmentTracking?.data) {
            setShipmentNumber(shipmentTracking?.data?.shipment_no || '');
            setFirstName(shipmentTracking?.data?.shipping_address_showroom_order?.first_name || '');
            setLastName(shipmentTracking?.data?.shipping_address_showroom_order?.last_name || '');
            setAddress(shipmentTracking?.data?.shipping_address_showroom_order?.address || '');
            setPhoneNumber(shipmentTracking?.data?.shipping_address_showroom_order?.phone_number || '');
            setStateCity(shipmentTracking?.data?.shipping_address_showroom_order?.state_data?.name || '');
            setStateCityArabic(shipmentTracking?.data?.shipping_address_showroom_order?.state_data?.name_arabic || '');
            setRiderFirstName(shipmentTracking?.data?.rider_data?.first_name || '')
            setRiderLastName(shipmentTracking?.data?.rider_data?.last_name || '')
            setRiderNumber(shipmentTracking?.data?.rider_data?.phone_number || '');
            setProducts(shipmentTracking?.data?.s_odetails);
            setPickup(shipmentTracking?.data?.warehouse?.name || '');
            setPickupArabic(shipmentTracking?.data?.warehouse?.name_arabic || '');
            setStatus(shipmentTracking?.data?.status || 0);
            setOrderType(shipmentTracking?.data?.order_type || '');
            setOnlineProducts(shipmentTracking?.data?.shipment_order?.details)
            setOnlineFirstName(shipmentTracking?.data?.shipment_order?.address?.first_name || '')
            setOnlineLastName(shipmentTracking?.data?.shipment_order?.address?.last_name || '')
            setOnlineAddress(shipmentTracking?.data?.shipment_order?.address?.address || '')
            setOnlinePhoneNumber(shipmentTracking?.data?.shipment_order?.address?.phone_number || '')
            setOnlineCity(shipmentTracking?.data?.shipment_order?.address?.state_data?.name || '')
            setOnlineCityArabic(shipmentTracking?.data?.shipment_order?.address?.state_data?.name_arabic || '')
            setCurrentLocation(JSON.parse(shipmentTracking?.data?.current_location) || '');
        } else {
            setShipmentFound(true);
        }
    }, [shipmentTracking?.data])

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

    // const handleSaveLocation = async (location: any) => {
    //     if (location) {
    //         setLoadingSave(true);
    //         try {
    //             const response = await fetch(`${Api}shipment-tracking/location/${shipmentnumber}`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     current_location: {
    //                         latitude: location.lat,
    //                         longitude: location.lng,
    //                     },
    //                 }),
    //             });

    //             if (!response.ok) {
    //                 throw new Error('Failed to update location');
    //             }

    //             topMessageAlartSuccess(lang === 'ar' ? 'تمت إضافة الموقع بنجاح!' : 'Location Added successfully!');
    //             setisOpen(false);
    //             setButtonHide(true);
    //             router.refresh()
    //         } catch (err) {
    //             console.error('Error saving location:', err);
    //             topMessageAlartDanger(lang === 'ar' ? 'خطأ في حفظ الموقع' : 'Error Saving Location!');
    //         } finally {
    //             setLoadingSave(false);
    //         }
    //     }
    // };

    // const handleCurrentLocation = () => {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             async (position) => {
    //                 const { latitude, longitude } = position.coords;
    //                 try {
    //                     const response = await fetch(`${Api}shipment-tracking/location/${shipmentnumber}`, {
    //                         method: 'POST',
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                         },
    //                         body: JSON.stringify({
    //                             current_location: {
    //                                 latitude,
    //                                 longitude,
    //                             },
    //                         }),
    //                     });

    //                     if (!response.ok) {
    //                         throw new Error('Failed to update location');
    //                     }

    //                     const data = await response.json();
    //                     topMessageAlartSuccess(lang === 'ar' ? 'تمت إضافة الموقع بنجاح!' : 'Location Added successfully!');
    //                 } catch (err) {
    //                     console.error('Error saving location:', err);
    //                     topMessageAlartDanger(lang === 'ar' ? 'خطأ في حفظ الموقع' : 'Error Saving Location!');
    //                     setError('Error saving location');
    //                 }
    //             },
    //             (error) => {
    //                 if (error.code === error.PERMISSION_DENIED) {
    //                     setLocationStatus(
    //                         'Geolocation permission has been blocked. Please reset it in your browser settings. For instructions, see the documentation.'
    //                     );
    //                     setError('Geolocation permission has been blocked.');
    //                 } else if (error.code === error.POSITION_UNAVAILABLE) {
    //                     setLocationStatus('Position unavailable. Ensure you have location services enabled.');
    //                     setError('Position unavailable.');
    //                 } else if (error.code === error.TIMEOUT) {
    //                     setLocationStatus('The request to get user location timed out.');
    //                     setError('Request timed out.');
    //                 } else {
    //                     setLocationStatus('Error getting location.');
    //                     setError('Error getting location.');
    //                 }
    //             },
    //             {
    //                 enableHighAccuracy: true,
    //                 timeout: 5000,
    //                 maximumAge: 0
    //             }
    //         );
    //         setIsLocationAllowed(true);
    //         setButtonHide(true);
    //     } else {
    //         alert('Geolocation is not supported by this browser.');
    //         setIsLocationAllowed(false);
    //     }
    // };

    return (
        <>
            <div className="sht_303mainDiv">
                <div className="container">
                    <div className="sht_303mainInnerSecDiv">
                        <Link prefetch={false} scroll={false} href={`${origin}/${lang}`} as={`${origin}/${lang}`}>
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
                        <Link prefetch={false} scroll={false} href={`${origin}/${lang}`} as={`${origin}/${lang}`} className="btn sht_303mainContinueShopBtn">
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
                                        <UserIcon size={12} color='#1C274C' />
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
                                        <LocationPinIcon size={16} color='#1C274C' />
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
                                        <PhoneIcon size={16} color="#1C274C" />
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
                                        <NetworkIcon size={16} color="#1C274C" />
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
                                        <button className="bg-secondary flex items-center justify-center text-white text-sm w-full p-2.5 rounded-md mx-auto" /*onClick={handleCurrentLocation}*/>
                                            <i className="fas fa-map-marker-alt mr-2"></i>
                                            {lang == 'ar' ? 'الموقع الحالي' : 'Current Location'}
                                            {error && <p className="text-red-500">{error}</p>}
                                            {isLocationAllowed === false && <p className="text-red-500">{lang == 'ar' ? "الطلب مرفوض او العنوان غير متاح" : "Permission denied or location not available."}</p>}
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
                                <div className={`relative after:absolute after:-bottom-[15px] after:left-1/2 after:top-[38px] after:h-[28px] after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 ${shipmentTracking?.data?.status >= 2 ? 'after:border-primary' : 'after:border-[#D9D9D9]'}`}>
                                    <div className={`sht_303mainInnenSSTDiv bg-primary absolute top-[14px] left-1/2 -translate-x-1/2 `}></div>
                                </div>
                                <div className="self-center p-4 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                    <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">{lang === 'ar' ? 'تم إنشاء الشحنة' : 'Shipment Created'}</p>
                                </div>
                            </div>
                            <div className="flex">
                                <div className={`relative after:absolute after:-bottom-[15px] after:left-1/2 after:top-[38px] after:h-[28px] after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 ${shipmentTracking?.data?.status >= 3 ? 'after:border-primary' : 'after:border-[#D9D9D9]'}`}>
                                    <div className={`sht_303mainInnenSSTDiv absolute top-[14px] left-1/2 -translate-x-1/2 ${status >= 2 ? 'bg-primary' : 'bg-[#D9D9D9]'}`}></div>
                                </div>
                                <div className="self-center p-4 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                    <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">{lang === 'ar' ? 'في العبور' : '⁠In Transit'}</p>
                                </div>
                            </div> */}
                            <div className="flex">
                                <div className={`relative after:absolute after:-bottom-[15px] after:left-1/2 after:top-[38px] after:h-[28px] after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 ${shipmentTracking?.data?.status == 4 ? 'after:border-primary' : 'after:border-[#D9D9D9]'}`}>
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
                                                <UserIcon size={12} color='#1C274C' />
                                                {riderName ? (
                                                    `${riderName} ${riderlastName}`
                                                ) : (
                                                    lang === 'ar' ? 'لم يتم تعيين متسابق' : 'No Rider Assigned'
                                                )}
                                            </p>
                                            <p className="sht_303mainInnerSecPara text-sm">
                                                <LocationPinIcon size={16} color='#1C274C' />
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
                                            <PhoneIcon size={24} color="#1C274C" />
                                        </Link>
                                        <Link prefetch={false} scroll={false} href="" className="">
                                           <ChatIcon size={24} color="#1C274C" />
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
                            {lang == 'ar' ? 'لم يتم العثور على شحنة' : 'No Shipment Found'}
                        </h4>
                    </div>
                </>}
                <Transition appear show={isOpen} as={Fragment}>
                        <Dialog as="div" open={isOpen} onClose={() => setisOpen(false)}>
                            <TransitionChild
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
                                        <TransitionChild
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 scale-95"
                                            enterTo="opacity-100 scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 scale-100"
                                            leaveTo="opacity-0 scale-95"
                                        >
                                            <DialogPanel className="sht_303mainDialogPanelDiv">
                                                <div className="sht_303mainModalThirdDiv">
                                                    <h5 className="sht_303mainLgHeading">{lang === 'ar' ? 'رسم خريطة' : 'Map'}</h5>
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
                                                        // onClick={() => handleSaveLocation(position)}
                                                        disabled={!position || loadingsave}
                                                    >
                                                        {loadingsave ? (
                                                            <button disabled type="button" className="sht_303mainInnerSaveBtn">
                                                                <svg aria-hidden="true" role="status" className="w-4 h-4 mr-2 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                                                </svg>
                                                                {lang === 'ar' ? '...توفير' : 'Saving...'}
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-save mr-2"></i>
                                                                {lang === 'ar' ? 'حفظ الموقع' : 'Save Location'}
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </DialogPanel>
                                        </TransitionChild>
                                    </div>
                                </div>
                            </TransitionChild>
                        </Dialog>
                    </Transition>
            <div className='h-32'></div>
        </>
    )
}