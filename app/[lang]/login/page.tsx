"use client"; // This is a client component 👈🏽

import React, { useEffect, useRef, useState, useContext } from 'react'
import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import MaskedInput from 'react-text-mask'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import GlobalContext from '../../GlobalContext';
import ReCAPTCHA from 'react-google-recaptcha';
import { useApp } from "@/app/_ctx/AppContext";
import { getSignUpData } from '@/lib/footerpages/signup.client';
import { postCheckResendOtpData, postCheckUserOtpData, postUserLoginData } from '@/lib/login/login.client';
import { getContactUserProfileData } from '@/lib/footerpages/contact-us.client';
import { ErrorTracker } from '../utils/errorTracker';

const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA
const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function Login(searchParams: any) {
    const { t, lang, deviceType, origin } = useApp();
    const router = useRouter()
    const [notificationsListing, setNotificationsListing] = useState<any>([])
    const [isOpen, setIsOpen] = useState(false)
    const [signUp, setSignUp] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState<any>(false)
    const [userid, setUserid] = useState<any>(false)
    const [loginBtnStatus, setLoginBtnStatus] = useState<boolean>(true)
    const [loginBtnLoading, setLoginBtnLoading] = useState<boolean>(false)
    const [loginErrorStatus, setLoginErrorStatus] = useState<boolean>(false)
    const [captchaErrorStatus, setcaptchaErrorStatus] = useState<boolean>(false)
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState<any>(null);
    const correctOTP = "392939" // validate from your server
    const [otpbox, setOtpBox] = useState(false)
    const [resendotpmessage, setResendOtpMsssage] = useState(true)
    const [seconds, setSeconds] = useState<number>(59);
    const [minutes, setMinutes] = useState<number>(1);
    const { updateUser, setUpdateUser } = useContext(GlobalContext);
    const { updateOrder, setUpdateOrder } = useContext(GlobalContext);
    const { updateWishlist, setUpdateWishlist } = useContext(GlobalContext);
    const { updateCompare, setUpdateCompare } = useContext(GlobalContext);
    const [expanded, setExpanded] = useState(false);
    const recaptchaRef = useRef<any>(null);

    useEffect(() => {
        getSignUpData().then((data: any) => {
            setNotificationsListing(data?.latestnotification?.data ?? []);
        })
    }, [])

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
            position: lang === 'ar' ? 'top-start' : 'top-end',
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

    useEffect(() => {
        let timeInterval = setTimeout(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(timeInterval);
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000);
        return () => {
            clearInterval(timeInterval);
        };
    });

    const topMessageAlartDanger = (title: any) => {
        MySwal.fire({
            icon: "error",
            title:
                <div className="text-xs">
                    <div className="uppercase">{title}</div>
                </div>
            ,
            toast: true,
            position: lang === 'ar' ? 'top-start' : 'top-end',
            showConfirmButton: false,
            timer: 15000,
            showCloseButton: true,
            background: '#DC4E4E',
            color: '#FFFFFF',
            timerProgressBar: true,
        });
    };

    useEffect(() => {
        getUser()
        if (otp !== "" && otp !== correctOTP) {
            setOtpError("❌ Wrong OTP Please Check Again")
            setOtpError(null)
        } else {
            setOtpError(null)
        }
    }, [otp]);

    const optConfirmation: any = () => {
        router.push(`${origin}/${lang}`);
    }
    const getUser: any = () => {
        if (localStorage.getItem("userid")) {
            setUserid(localStorage.getItem("userid"))
            setIsOpen(false)
            router.push(`${origin}/${lang}`)
        }
    }

    const checkLoginPhoneNumber: any = (value: any) => {
        let phone = value.replace('(966)-', '');
        phone = phone.replace(/[^0-9\.]+/g, '')
        if (phone.length == 9) {
            setPhoneNumber(phone)
            setLoginBtnStatus(false)
        }
    }

    function CheckIcon(params: any) {
        return (
            <svg viewBox="0 0 24 24" fill="none" {...params}>
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

    const CheckPhoneNumber = async () => {
        try {
            const recaptchaValue = recaptchaRef.current.getValue();
            if (!recaptchaValue) {
                setLoginBtnLoading(false)
                setcaptchaErrorStatus(true)
                ErrorTracker.trackCustomError(
                    'Recaptcha validation failed',
                    'frontend',
                    400,
                    deviceType,
                    'Login Page'
                );
                return false
            }
            const token = recaptchaValue;
            let phone = phoneNumber.replace('(966)-', '');
            phone = phone.replace(/[^0-9\.]+/g, '')
            if (phone == '' || phone.length < 9) {
                setLoginBtnLoading(false)
                ErrorTracker.trackCustomError(
                    lang === 'ar' ? "الرجاء إضافة بيانات الحقول!" : "please add fields data!",
                    'frontend',
                    400,
                    deviceType,
                    'Login Page'
                );
                return topMessageAlartDanger(lang === 'ar' ? "الرجاء إضافة بيانات الحقول!" : "please add fields data!")
            }
            var data = {
                phone_number: phoneNumber,
                lang: lang,
                token: token
            }

            const res = await postUserLoginData(data);
            localStorage.setItem('phoneNumber', data?.phone_number.toString())
            if (res?.userLoginUpdate?.success === true) {
                setOtpBox(true)
                setLoginBtnLoading(false)
            }
            else {
                if (searchParams?.type) {
                    router.push(`${origin}/${lang}/signup?type=${searchParams?.type}`)
                }
                else {
                    router.push(`${origin}/${lang}/signup`)
                }
                setLoginBtnLoading(false)
            }
        } catch (e) {
            console.error("login failed:", e);
            topMessageAlartDanger(lang === "ar" ? "حدث خطأ غير متوقع" : "Unexpected error");
        }
    }

    const CheckOtp = async () => {
        try {
            var dataotp = {
                phone_number: phoneNumber,
                otp_code: otp,
                device: 'desktop',
            }
            const res = await postCheckUserOtpData(dataotp);
            if (res?.usercheckOtpData?.success === true) {
                localStorage.setItem("userid", res?.usercheckOtpData?.user_id.toString())
                if (!localStorage.getItem('profileImg') && res?.usercheckOtpData?.user?.profile_img != null) {
                    localStorage.setItem('profileImg', `${NewMedia}${res?.usercheckOtpData?.user?.profile_img?.toString()}`)
                } else {
                    localStorage.removeItem('profileImg')
                    localStorage.setItem('profileImg', `${NewMedia}${res?.usercheckOtpData?.user?.profile_img?.toString()}`)
                }
                if (lang == "ar") {
                    localStorage.setItem('default_address', 'yes')
                    localStorage.setItem("globalcity", res?.usercheckOtpData?.user?.shipping_address_data_default?.state_data?.name_arabic.toString());
                }
                else {
                    localStorage.setItem('default_address', 'yes')
                    localStorage.setItem("globalcity", res?.usercheckOtpData?.user?.shipping_address_data_default?.state_data?.name.toString());
                }
                localStorage.removeItem('userCompare')
                localStorage.removeItem('userWishlist')

                const status = res?.usercheckOtpData.success == true
                    ? 'Login Success'
                    : 'Login Failed: Invalid username or password. Please try again.';

                    const responseData = await getContactUserProfileData();
                    localStorage.setItem('eMail', responseData?.userData?.user?.email.toString())
                    localStorage.setItem('fullName', responseData?.userData?.user?.full_name.toString())
                    localStorage.setItem('phoneNumber', responseData?.userData?.user?.phone_number.toString())
                    localStorage.setItem('loyaltyCount', responseData?.userData?.user?.loyaltypoints.toString())
                    localStorage.setItem('compareCount', responseData?.userData?.user?.compares_count.toString())
                    localStorage.setItem('wishlistCount', responseData?.userData?.user?.wishlists_count.toString())
                    localStorage.setItem('orderCount', responseData?.userData?.user?.confirmed_orders_data_count.toString())
                    setUpdateUser(updateUser == 0 ? 1 : 0)
                    setUpdateOrder(updateOrder == 0 ? 1 : 0)
                    setUpdateWishlist(updateWishlist == 0 ? 1 : 0)
                    setUpdateCompare(updateCompare == 0 ? 1 : 0)

                    // Generate and store new userId if not present
                    const fullName = responseData?.userData?.user?.full_name?.toString() || '';
                    const [firstname, ...lastnameParts] = fullName?.trim().split(' ') || [];
                    const lastname = lastnameParts.join(' ');

                    var wind: any = typeof window !== "undefined" ? window.dataLayer : "";
                    wind = wind || [];
                    // if (!genUserId) {
                    let genUserId = crypto.randomUUID();
                    // localStorage.setItem('webengageUserId', genUserId);
                    const gender = responseData?.userData?.user?.gender === 1 ? 'male' : 'female';

                    wind.push({
                        event: 'login',
                        platform: deviceType,
                        gender: gender,
                        email: responseData?.userData?.user?.email?.toString() || '',
                        phone: `966${responseData?.userData?.user?.phone_number?.toString() || ''}`,
                        user_id: genUserId, // Use generated UUID as userId
                        status: status, // Or "Login Success"
                        method: 'otp_login', // Can be "email", "gmail", "fb", etc.
                        first_name: firstname,
                        last_name: lastname
                    });
                    const userEmail = responseData?.userData?.user?.email?.toString() || '';
                    const userPhone: any = `966${responseData?.userData?.user?.phone_number?.toString() || ''}`;
                    const userProfileAtt: any = {
                        "account_creation_date": responseData?.userData?.user_webengage_data?.account_creation_date ? dayjs(responseData?.userData?.user_webengage_data?.account_creation_date).locale('en').format('DD-MM-YYYY hh:mm A') : '',
                        "backend_user_id": `${responseData?.userData?.user_webengage_data?.backend_user_id ?? ''}`,
                        "last_purchase_date": responseData?.userData?.user_webengage_data?.last_purchase_date ? dayjs(responseData?.userData?.user_webengage_data?.last_purchase_date).locale('en').format('DD-MM-YYYY hh:mm A') : '',
                        "store_language": responseData?.userData?.user_webengage_data?.store_language ?? 'ar',
                        "total_purchases": responseData?.userData?.user_webengage_data?.total_purchases ?? 0,
                        "total_revenue": responseData?.userData?.user_webengage_data?.total_revenue ?? 0,
                        "user_data_source": deviceType ? deviceType : 'desktop'
                    };
                    wind.push({
                        event: "global_variables",
                        account_creation_date: dayjs(userProfileAtt?.account_creation_date, 'DD-MM-YYYY hh:mm A').isValid() ? dayjs(userProfileAtt.account_creation_date, 'DD-MM-YYYY hh:mm A').locale('en').format('DD-MM-YYYY hh:mm A') : '',
                        user_id: String(userProfileAtt?.backend_user_id ?? ''),
                        email: userEmail ?? '',
                        phone: userPhone ?? '',
                        last_purchase_date: dayjs(userProfileAtt?.last_purchase_date, 'DD-MM-YYYY hh:mm A').isValid() ? dayjs(userProfileAtt.last_purchase_date, 'DD-MM-YYYY hh:mm A').locale('en').format('DD-MM-YYYY hh:mm A') : '',
                        store_language: userProfileAtt?.store_language ?? 'ar',
                        total_purchases: Number(userProfileAtt?.total_purchases ?? 0),
                        total_revenue: Number(userProfileAtt?.total_revenue ?? 0),
                        user_data_source: deviceType,
                        platform: deviceType
                    });
                    localStorage.setItem('userProfileData', JSON.stringify(userProfileAtt));
                if (searchParams?.type) {
                    router.push(`${origin}/${lang}/${searchParams?.type}`, { scroll: false })
                }
                else {
                    const returnTo = sessionStorage.getItem('preLoginRoute') || '/'
                    router.push(returnTo, { scroll: false })
                }
                router.refresh()

                setTimeout(() => {
                    setLoginBtnLoading(false)
                    setPhoneNumber(false)
                }, 2000);
            }
            else {
                setLoginBtnLoading(false)
                topMessageAlartDanger(t('login.WrongOtp'))
                ErrorTracker.trackCustomError(
                    t('login.WrongOtp'),
                    'frontend',
                    400,
                    deviceType,
                    'Login Page'
                );
            }
        } catch (e) {
            console.error("login failed:", e);
            topMessageAlartDanger(lang === "ar" ? "حدث خطأ غير متوقع" : "Unexpected error");
        }
    }

    const ResendOtp = async () => {
        try {
            var data = {
                phone_number: phoneNumber,
            }
            setSeconds(59)
            setMinutes(1)

            const res = await postCheckResendOtpData(data);
            localStorage.setItem('phoneNumber', data?.phone_number.toString())
            if (res?.userResendcheckOtpData?.success === true) {
                setResendOtpMsssage(true)
                topMessageAlartSuccess(t('login.ResendOtpSuccess'))
            }
            else {
                topMessageAlartDanger(t('login?.ResendOtpfailed'))
                ErrorTracker.trackCustomError(
                    t('login?.ResendOtpfailed'),
                    'frontend',
                    400,
                    deviceType,
                    'Login Page'
                );
            }
        } catch (e) {
            console.error("login failed:", e);
            topMessageAlartDanger(lang === "ar" ? "حدث خطأ غير متوقع" : "Unexpected error");
        }
    }

    const maxLengthCheck = (object: any, length: number) => {
        if (object.length > length) {
            object = object.slice(0, length)
        }
        setOtp(object)
    }

    return (
        <>
            <MobileHeader type="Third" lang={lang} pageTitle={lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'} />
            <div className="container py-16 md:py-4 md:mt-16">
                <div className="w-full md:w-[80%] xl:w-1/2 mx-auto my-4">
                    <div className="md:grid md:grid-cols-2 items-center gap-6">
                        <div>
                            {/* OTP BOX */}
                            {otpbox == true ?
                                <>
                                    <h1 className="text-xl font-bold text-center">{lang === 'ar' ? 'التحقق من هاتفك' : 'Verify your phone'}</h1>
                                    <p className="text-xs font-normal mt-1 text-[#5D686F] text-center">{lang === 'ar' ? 'تم إرسال OTP إلى' : 'OTP has been sent to'} <br /><span className="text-[#004B7A]">+966{phoneNumber}</span> <br /> {lang === 'ar' ? 'عبر الرسائل القصيرة' : 'via SMS'}</p>
                                    <div className="flex w-80 mx-auto gap-2">
                                        <input
                                            value={otp}
                                            onChange={(e: any) => maxLengthCheck(e.target.value, 6)}
                                            autoFocus={true}
                                            type="tel"
                                            className={`border border-[#D0D5DD] direction:ltr w-full mt-3 h-auto text-primary p-2 rounded-md focus:border-[#f0660c] outline-none focus-visible:outline-none appearance-none text-center font-semibold text-lg`}
                                        />
                                    </div>
                                    <p className={`text-xs text-[#fb4a4a] mt-4 ${otpError ? 'error-show' : ''}`}>{otpError}</p>
                                    <div className="text-center">
                                        {minutes == 0 && seconds == 0 ?
                                            <button className="text-secondary text-xs underline font-bold text-center mx-auto w-full" onClick={
                                                () => {
                                                    ResendOtp()
                                                }
                                            }>
                                                {lang === 'ar' ? 'تسجيل الدخول' : 'Re-Send Validation Code'}
                                            </button>
                                            :
                                            <p className="text-xs font-normal text-center text-[#5D686F]">{lang === 'ar' ? 'الكود صالح لـ ' + minutes + ': ' + seconds + ' دقائق' : 'The code is valid for ' + minutes + ':' + seconds + ' Mins'}</p>
                                        }
                                        <button className={`${loginBtnStatus === true ? 'opacity-30' : "opacity-100"} focus-visible:outline-none btn border border-[#004B7A] bg-[#004B7A] p-3.5 rounded-md w-full text-center text-white fill-white font-bold text-base mt-4`}
                                            disabled={loginBtnStatus}
                                            onClick={
                                                () => {
                                                    setLoginBtnLoading(true)
                                                    CheckOtp()
                                                    setIsOpen(false)
                                                    setSignUp(true)
                                                }
                                            }
                                        >
                                            {loginBtnLoading ? <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 fill-white mx-auto" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg> : null}
                                            {loginBtnLoading == false ? lang === 'ar' ? 'استمرار' : 'Verify Otp' : null}
                                        </button>
                                    </div>
                                </>
                                :
                                <>
                                    {/* LOGIN BOX */}
                                    <h1 className="text-xl font-bold">{lang === 'ar' ? 'لديك حساب؟ سجل الدخول' : 'Already a member? Sign in!'}</h1>
                                    <p className="text-xs font-normal mt-1 text-[#5D686F]">{lang === 'ar' ? 'قم بتسجيل الدخول حتى تتبع طلباتك وتصل بسهولة إلى قائمة مفضلاتك.' : 'Get access to your orders, wishlist and recommendations to products you are interested in!'}</p>
                                    <div className="pb-3 pt-2.5 px-3 bg-white rounded-md border flex items-center border-[#5D686F30] gap-x-2 text-sm font-medium focus-visible:outline-none focus-visible:border-[#20831E] mt-10">
                                        <svg id="fi_14063267" enableBackground="new 0 0 64 64" height="32" viewBox="0 0 64 64" width="32" xmlns="http://www.w3.org/2000/svg"><g><g><path d="m63 47.2c0 3.4-2.7 6.1-6 6.1h-50c-3.3 0-6-2.7-6-6.1v-30.4c0-3.4 2.7-6.1 6-6.1h50c3.3 0 6 2.7 6 6.1z" fill="#096"></path><path d="m7 10.7h50c3.3 0 6 2.7 6 6.1v30.4c0 3.4-2.7 6.1-6 6.1" fill="#038e5c"></path><g fill="#007a54"><path d="m63 47.2c0 3.4-2.7 6.1-6 6.1h-50c-3.3 0-6-2.7-6-6.1"></path><path d="m7 10.7h50c3.3 0 6 2.7 6 6.1v11.1"></path></g></g><g><g fill="#fff"><path d="m8.6 20.4c.4-.3.4.5 0 1.4.2-.3.6-1 .5-1.5-.1-.7-.5-.6-.8-.2-.2.3-.1.5.3.3z"></path><path d="m8.7 26.1c.5-.9.3-1.6.7-2.9.3-.8.3-.2.3.3-.2 1.3-.1 3.4 1.7 3.3.1 1.2.4 3.3.4 4.1 0 .7.1.5.3.1s.1-.9.1-1.5-.1-1.7-.2-3.2c.2-.2.5-.5.6-.7.2-.5.3-.4.4 0 .2.8 1 1.3 2 .5 1-.7.6-2.1.1-3.6.4.1.5-.2.3-.6-.1-.2-.3-.4-.4-.6-.2-.2-.3-.4-.5-.2s-.3.4-.4.5-.1.3 0 .6c.4.9.6 1.9.7 2.4s-.1.6-.5.6c-.3 0-.8-.1-1-.9s-.3-1.1-.2-1.7c0-.5.1-.9-.3-1.4s-.4-.4-.5-.2c-.1.3-.2.7-.1 1.2.2.7.3 1.3.4 1.7.1.3-.2.9-.7 1.2-.1-1-.2-2.2-.3-3.3.6-.2.3-.9-.2-1.7-.3-.6-.5-.4-.7 0s-.1.6.1.9c-.1.3.1.7.2 1.4.1.5.2 1.8.2 2.9-.4 0-.7-.3-.9-.7-.3-.8-.3-1.6-.1-2 .2-.5.3-1.2 0-1.4s-.6 0-.8.4c-.4.6-.8 1.4-.8 2.3 0 .3-.1 1-.3 1.3-.1.3-.4.3-.6-.1-.4-.6-.5-2.2-.5-3 0-.4-.1-.5-.2 0-.4 1.6.1 3.2.4 3.9.5.9 1 .7 1.3.1z"></path><path d="m13.5 20.9c.2-.2.2-.2.3 0s.4.2.5 0 .2-.3.1-.6c-.1-.2-.1-.1-.2.1-.1.4-.5.3-.5-.2s-.1-.2-.3.1c-.2.5-.5.4-.5-.1 0-.3-.1-.6-.3-.2-.1.3 0 .6.1.8.3.3.6.3.8.1z"></path><path d="m10.5 28.4c.3-.1.3-.1.3-.5s-.2-.2-.6-.1c-.6.2-1.8.8-2.7 1.9-.4.5-.1.3.2.1.5-.4 2-1.2 2.8-1.4z"></path><path d="m8.5 34.8c-.3.5-.9-.2-.5-1.5.1-.3.2-.5.2-.7s0-.4 0-.7c0-.2-.2.1-.3.5-.1.6-.5.9-.4 2.8.1 1.1 1.4 1.1 1.5-.3 0-.6-.2-.6-.5-.1z"></path><path d="m17.4 30.6c0-.5-.1-1-.1-1.5.1 0 .1-.1.2-.1.3.9 1.6.7 2 .1.2-.3.2-.3.4 0 .3.4 1.3.6 1.5 0s.2-1.2.1-1.6c-.1-.5-.2-.4-.5-.2s-.1.3 0 .6c.1 1.2-.9 1.1-1-.1-.1-.8-.2-.5-.3-.1-.5 1.5-1.8 1.8-1.6 0 0-.5-.3-.3-.5-.1-.1.1-.3.3-.4.4-.1-1.4-.2-3-.4-5 .4.5.8-.1.5-.6-.2-.4-.5-1.4-.7-1.9s-.3-.4-.7.1c-.4.4-.3.5-.2 1 0 .6 0 1.1.2 2.2.1.8.3 2.5.5 4.6-.2.1-.5.3-.7.4-.1-.4-.4-.6-.8-1-.6-.6-1-.6-1.5.1s-.4.8-.4 1.5c0 .6-.1.8.4 1s.7.1 1 0c.2-.1.5-.2.9-.3.1.3 0 .7-.2.9-1.2 1.4-3 2.5-3.8 1.5-.4-.5-.6-1.3-.5-2.3.1-.8-.1-.4-.2-.2-.3.9-.4 2.3 0 3 .5 1 1.4 1.4 2.8.7 1.4-.6 2.7-1.7 2.7-3.2 0-.3 0-.5 0-.7.2-.1.4-.2.5-.3v1.7c.1 1.6-.6 2.1-1.2 2.6-.8.6-1.9 1.1-2.9 1.2-2.2.3-2.7-1.1-2.7-3 0-.3.1-.5.1-.9 0-.8-.1-.7-.4.1-.2.8-.5 2.6.2 4.1.8 1.5 3.4 1.1 5.4.1 2.2-1.1 2.4-2.9 2.3-4.8zm-2.8-1.5c-.5.2-.7-.1-.6-.4 0-.3.1-.5.5-.3.2.1.4.3.6.6-.3.1-.4.1-.5.1z"></path><path d="m19.7 32.3c.2-.4.3-.8.2-1.3-.1-.3 0-.4-.3-.6-.3-.1-.4.1-.5.3-.1.3.1.7.5.5.1.2 0 .7-.1 1-.1.4 0 .5.2.1z"></path><path d="m20.5 24.2c-.4.5-.7 1.2-.1 1.6.3.2.9-.1 1.1-.5.2-.5.1-.6-.3-.1-.5.6-1.1.1-.5-.8.4-.6.1-.7-.2-.2z"></path><path d="m18.8 24.3c1.4-.6 2.2-1.4 2.6-2.1.4.1.5-.2.3-.5.1-.3.2-.5.3-.7.3-1.3-1-1.4-1.3-.4-.2.5-.2 1 .2 1.3-.6.8-1.4 1.5-2.4 2.1-.4.4-.3.6.3.3zm2.4-3.5c.1-.3.3-.1.3.1 0 .1-.1.3-.2.4-.2-.1-.2-.3-.1-.5z"></path></g><path d="m20.7 20.6c-.2.5-.2 1 .2 1.3-.1.1-.2.3-.3.4l.5.4c.1-.2.3-.3.4-.5.4.1.5-.2.3-.5.1-.3.2-.5.3-.7.2-1.3-1-1.4-1.4-.4zm.8.3c0 .1-.1.3-.2.4-.2-.1-.2-.3-.1-.5.1-.3.3-.1.3.1z" fill="#cfe7e8"></path><path d="m22.2 32.3c-.2.1-.5.4-.7.6 0-.4.1-1 .1-1.2 0-.3-.1-.4-.3-.1-.3.6-.6 1.4-.7 2-1.3.9-2.9 1.8-4 2.3-.5.2-.2.4.2.3 1.5-.5 2.7-.9 3.8-1.4.1.9.4 1.5 1.2 1.7 1.5.4 3-.9 4.7-3.2.4 1.1 1.4 2.6 4 3 1.1.2 1 .1 1.2-.5.1-.5.3-.6-.6-.8-1.1-.4-1.5-1.2-.4-1.7s2.6-.9 3.6-1.1c.7-.1.9-.1 1.1-.7.2-.7.3-.8-.4-.7-.8.1-4.6.2-5.6.1.8-.4 1.9-.8 2.7-1.1.3.2.4.1.3-.1.3-.1.6-.2.9-.4.9-.5 1.3-1.6.3-2.3s-1.8-.9-2.3-.2c-.4.6-.8 1.2-.2 2-.9.3-1.7.6-2.5.9-.6.2-.9.3-1.1 1.1s-.3.8.5.9c1.1 0 2.1 0 2.8.6-1.1.4-1.9 1.2-1.5 2.3-.5-.1-1-.3-1.4-.7-.8-.8-.8-2.2-1.1-3.8s-1-3-1.3-3.6c-.2-.6-.3-.3-.5.1s-.4.6-.2 1.2c.4 1 1 3 1.3 4.2-.6 1.4-2.2 3.1-3.5 3.3-1 .2-1.3-.4-1.2-.9.7-.4 1.3-.9 1.9-1.5 1.2-1.3 1.4-2.3.6-4.4.5.1.4-.3-.3-1.2-.5-.6-.6-.5-.9.1-.2.5-.4.9.2 1.1.1.3.3.7.6 1.2.6 1.3-.4 1.8-1.3 2.6zm9.5-4.4c0-.3.1-.3.6 0s.9.4.2.5c-.2.1-.5.1-.7.2 0-.3 0-.5-.1-.7z" fill="#fff"></path><g fill="#cfe7e8"><path d="m34.9 30.8c-.5 0-2.7.1-4.2.1l2 1.7c.5-.2 1.1-.3 1.5-.4.7-.1.9-.1 1.1-.7.2-.7.3-.8-.4-.7z"></path><path d="m25.1 26.1.2.2c0-.2-.1-.2-.2-.2z"></path><path d="m30.2 30.4c.6-.3 1.3-.5 1.8-.7.3.2.4.1.3-.1.3-.1.6-.2.9-.4.9-.5 1.3-1.6.3-2.3s-1.8-.9-2.3-.2c-.4.6-.8 1.2-.2 2-.7.2-1.3.4-1.9.7zm2.2-2.5c.5.3.9.4.2.5-.2.1-.5.1-.7.2-.1-.3-.1-.5-.1-.6-.1-.4.1-.4.6-.1z"></path></g><path d="m34 36c.3-.1.8-.4 1.2-.7.4-.4.1-.3-.2-.2s-.6.3-1 .4c-.4.2-.5 0-.3-.7.2-.6 0-.6-.3-.5s-.4.3-.7.5c-.2.1-.2.3.3.1.4-.2.3 0 .2.5-.2.5.1.8.8.6z" fill="#fff"></path><g fill="#cfe7e8"><path d="m24.7 25.1c.3-.7.5-1.4.7-1.9s.4-.4.3.1c-.1.9-.1 2.3.8 2.9.9.5 2.3-.4 2.8-1.4 1.5 1.9 2.8 1 2.9-.8 0-.6-.2-1.8-.4-2.2s0-.4.2-.2.6.4.4-.3c-.2-.6-.5-1-.8-1.3s-.4-.1-.5.1-.1.3-.3.5-.1.3 0 .6c.6 1.4 1.1 3.5.2 3.7-.8.2-1.3-1.6-1.3-2.4 0-1-.2-1.9-.4-2.5s-.3-.6-.5-.3c-.1.2-.1.4-.3.6-.1.2 0 .3.1.7.5 2.3.4 3.3-.6 3.9s-1.6 0-1.6-.7 0-1.6.1-2.2.2-.8 0-1.1-.4-.2-.7.2c-.6.9-1.3 2.4-1.5 3.1s-.7.5-1-.1c-.4-.7-.3-2-.2-2.6.1-.5.1-.7-.2-.2-.5 1.4-.5 2.8.6 4 .5.9.9.5 1.2-.2z"></path><path d="m27.5 22.4c0 .3 0 .7.2.1.1-.6.1-1.4-.1-1.9s-.3-.6-.5-.4-.2.3 0 .5c.2.3.5 1 .4 1.7z"></path><path d="m29.6 27.1c0 .8-.2.8-.5 0-.1-.3-.2-.3-.3.1 0 .7-.3.8-.5.1-.1-.3-.1-.6-.2-.1-.1.4 0 .7.2 1 .2.2.5.2.6-.1s.2-.3.4-.1 1 0 .6-1.1c-.2-.4-.3-.3-.3.2z"></path><path d="m37.7 20.8c.3.2.6.7.5 1.3-.1.5 0 .8.3.1s.1-1.5-.2-2-.4-.3-.6-.1c-.2.3-.3.6 0 .7z"></path><path d="m32.6 21.1c0 .3.1.5.5.6.8 1.1 1.7 2.3 2.5 3.4.1 1 .3 2 .4 2.9.2 2 .6 4.7.3 5.9-.2.9 0 1.2.4-.1s.4-2.6.1-4.5c-.1-.8-.1-1.7-.2-2.7 1.3 2.1 2.6 4.1 3.1 5.5.3.8.6.9.3-.1-.3-1.4-1.6-3.8-3.6-6.8-.1-.8-.1-1.6-.1-2.2.3.3.5.1.4-.3-.2-.8-.5-1.4-.8-2.2-.1-.4-.5-.4-.7.1-.2.6-.2.7 0 1.1 0 .5.1 1.2.2 1.9-.3-.5-.8-1.2-1.2-1.7.5.2.9.1.4-.5-.5-.5-1.2-1.1-1.6-1.5s-.6-.1-.6.2c.2.5.3.7.2 1z"></path><path d="m38.3 23.9c-.1.5-.3.3-.4-.1-.1-.2-.2-.1-.2.3.1.4.2.7.5.4.2-.2.2-.2.5 0 .2.2.4 0 .5-.1 0-.1.1-.3 0-.8s-.2-.2-.3.2-.3.5-.4 0c0-.4-.2-.3-.2.1z"></path><path d="m40.6 30.4c.1 1.8.3 2.6-.8 3.9-1.2 1.3-2 1.7-2.5 1.8-.7.2-.9.5.1.4 1.5-.1 1.7-.1 3-1.6.7-.8 1-1.8 1-4.2-.1-4.2-.6-6-.6-8.3.2.2.5.2.4-.2-.2-.5-.3-1.1-.4-1.6-.2-.5-.3-.7-.5-.4s-.4.4-.5.6-.2.5 0 .8c.6 4.9.7 7 .8 8.8z"></path><path d="m43.2 30.9c.1 1 .3 1.7 0 2.9-.1.3.1.5.3 0 .9-1.7.3-3.2.2-4.2-.1-1.5-.7-5.4-.8-7l.1.1c.4.2.9.4.6-.2-.3-.5-.6-1.4-.8-2s-.3-.6-.6-.1c-.6.8-.2 1.6 0 2.6.4 3.4.9 6.9 1 7.9z"></path><path d="m45.3 25.3c.3.3.5.9.7 1.2.2.5.4.1.4-.2s-.1-1.2 0-1.5c.2-.5.5.2.6-.1.1-.2-.1-.3-.2-.5-.1-.3-.2-.2-.4-.1-.2.2-.3.4-.3.5v1.1c0 .4-.1.4-.2.2-.1-.3-.4-1-.6-1.2s-.5-.1-.5.2v.5c0 .2.4.2.5-.1z"></path><path d="m45.1 29.2c0 .3.4-.1.7-.3s1.2-.8 1.6-1 .3-.3.2-.7c0-.4-.3-.1-.6.2s-1.2.9-1.5 1.2-.4.4-.4.6z"></path><path d="m43 34.6c-.4-.8-.4-1.6-.4-2.3 0-.6-.1-1.1-.3-.1-.6 2.4-.2 2.9.4 3.4.8.7 1.1.8 1.5.1.8-1.2 1.1-2.2 1.5-2.8.4-.5.4-.1.6.1.5.6.9.8 1.6.9s1.9-.5 1.8-2.7c-.1-1.4-.2-3.2-.3-5.2.7.9 1.2 1.7 1.7 2.4.2 1.3.3 2.5.3 3.4-.1 1.1.2 1.1.4 0 .1-.4.1-1.4 0-2.5.9 1.2 1.4 1.9 1.7 2.5.4.7.6 1.2.5-.1 0-.5-.2-.9-.8-1.8-.6-.8-1.1-1.6-1.6-2.4-.2-1.9-.4-4-.4-5.1.3.2.5 0 .3-.4-.1-.4-.4-1.6-.6-2s-.4-.4-.6.1c-.2.4-.4.6-.3.9.1 1.9.3 3.7.6 5.3-.5-.7-1-1.4-1.4-2 0-.7-.1-1.4-.1-2.1.3.2.4.2.3-.3-.1-.4-.5-1.4-.7-1.8s-.3-.4-.5-.1c-.3.5-.4.9-.1 1.4 0 .5.1.9.1 1.4-.3-.4-.5-.8-.8-1.1.3.1.5-.1.2-.4s-.9-.8-1.2-1.1c-.3-.4-.5-.3-.5 0v.9c0 .3 0 .5.3 1 .7.9 1.5 1.8 2.1 2.7.3 3.2.4 5.3.4 6.6 0 .8-.3 1.2-.7 1.3s-.8-.1-1.2-.7c-.7-1-1-.8-1.5.1s-.9 1.6-1.2 2.2c-.2.6-.7 1.1-1.1.3z"></path><path d="m52.6 23.5c0 .6.2.5.3 0s.1-1.5-.2-2.1c-.3-.7-.4-.4-.5-.2-.2.3-.2.4.1.7.1.3.3 1 .3 1.6z"></path><path d="m55.3 29.7c-.2-4.2-.7-6-.6-7.6.4.3.5.2.3-.3s-.5-1.1-.7-1.7c-.2-.5-.3-.4-.6 0s-.3.7-.2.9c.6 5.1.9 7.8 1 9.4.1 2.2-.4 3.5-2.6 5-.7.5-1.5 1 .2.6 1.6-.5 3.4-1.6 3.2-6.3z"></path><path d="m49.7 34.1c-.3.4.4.6.5.3.2.3 0 .8-.3 1.1-.5.4-.2.5.1.2.3-.2 1.1-1.1.6-1.7-.3-.2-.7-.2-.9.1z"></path></g><path d="m47.5 41.5c-1.3 0-2.5 0-3.8.1v-.4c.4-.5.3-.5 0-1-.1-.2-.2-.4-.5 0s-.3.5.1 1v.4c-9.9.1-20.8 0-30.2-.1 1 1.7 4.4 1.6 7.5 1.6 2.8 0 11.2 0 22.6-.3v.5c-.4.5-.3.5 0 1 .3.4.4.2.5 0 .1-.1.1-.2.1-.2h1.5c0 .2.3.3.4.3s.4-.1.4-.3h1.7c.2.3.4.4.7.4.6 0 .9-.7.8-1.6-.1-1.3-.6-1.5-1.8-1.4zm-1.4 2c0-.2-.3-.3-.4-.3s-.4.1-.4.3h-1.5c0-.1-.1-.2-.3-.4v-.5c1.3 0 2.7-.1 4.1-.1-.1.3-.1.6-.1.9z" fill="#fff"></path><path d="m47.5 41.5c-1.3 0-2.5 0-3.8.1v-.4c.4-.5.3-.5 0-1-.1-.2-.2-.4-.5 0s-.3.5.1 1v.4s0 0-.1 0l1.4 1.2c1 0 2.1-.1 3.1-.1-.1.3-.1.6-.1.9h-1.5c0-.2-.3-.3-.4-.3s-.3.1-.3.2l.7.6v-.1h1.7c.2.3.4.4.7.4.6 0 .9-.7.8-1.6-.1-1.2-.6-1.4-1.8-1.3z" fill="#cfe7e8"></path></g></g></svg>
                                        <div className="h-5 w-[1px] bg-primary opacity-20" />
                                        <MaskedInput
                                            id="phoneMask"
                                            type="tel"
                                            placeholder="(966) - _______"
                                            className="w-full focus-visible:outline-none"
                                            mask={['(', '9', '6', '6', ')', '-', /[5]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                                            // mask={['(', '9', '6', '6', ')', '-', /[5]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                                            onChange={(e: any) => {
                                                setPhoneNumber(e.target.value)
                                                checkLoginPhoneNumber(e.target.value)
                                            }}
                                            autoFocus={true}
                                        />
                                    </div>
                                    {/* <div id="recaptcha" className='mt-4'></div>
                                    <GoogleReCaptcha
                                        onVerify={onVerify}
                                        // reCaptchaKey={'6LcJPEoqAAAAACYmbfaa2BxNXFSWAxMr0RG0aIlJ'}
                                        // refreshReCaptcha={refreshReCaptcha}
                                    /> */}
                                    <div className='mt-4'>
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            hl={lang}
                                            sitekey="6Ld5cE0qAAAAAKPmWqf1qAYpffArghXy1xOdQ4XL" // Replace with your site key
                                        />
                                    </div>
                                    {captchaErrorStatus ?
                                        <p className='font-semibold text-sm'>
                                            {lang === 'ar' ? 'يرجى تحديد المربع للتحقق من أنك إنسان.' : 'Please check the box to verify that you are human.'}
                                        </p>
                                        : null}
                                    {loginErrorStatus ?
                                        <p>
                                            {lang === 'ar' ? 'لم يتم العثور على هذا الحساب' : 'This account has not found!'}
                                        </p>
                                        : null}
                                    <button className={`${loginBtnStatus === true ? 'opacity-30' : "opacity-100"} text-center focus-visible:outline-none btn border border-[#004B7A] bg-[#004B7A] p-2.5 rounded-md w-full text-white fill-white font-bold text-base mt-4`}
                                        disabled={loginBtnStatus}
                                        onClick={
                                            () => {
                                                setLoginBtnLoading(true)
                                                CheckPhoneNumber()
                                                setIsOpen(false)
                                                setSignUp(true)
                                            }
                                        }
                                    >
                                        {loginBtnLoading ? <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 fill-white mx-auto" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg> : null}
                                        {loginBtnLoading == false ? lang === 'ar' ? 'تسجيل الدخول' : 'Sign In' : null}
                                    </button>
                                </>
                            }
                            <hr className="my-4 opacity-10" />
                            <h2 className="text-xs text-center mt-1">{lang === 'ar' ? `سجل الآن في حال عدم وجود حساب لديك` : `If you don't have a account please click on`}{' '}
                                <button className="focus-visible:outline-none font-bold underline" onClick={() => {
                                    router.push(`/${lang}/signup`)
                                }}>{lang === 'ar' ? 'تسجيل الآن' : 'Sign Up'}</button>
                            </h2>
                        </div>
                        <div className="w-full md:w-80 md:ml-auto mt-10 md:mt-0">
                            <div className="bg-white rounded-md shadow-md">
                                <div>
                                    <Link href={`/${lang}/${notificationsListing?.link}`} className="focus-visible:outline-none w-full ltr:text-left rtl:text-right">
                                        {notificationsListing?.image ?
                                            <Image priority={true} src={notificationsListing?.image} alt={lang === 'ar' ? notificationsListing?.title_arabic : notificationsListing?.title} title={lang === 'ar' ? notificationsListing?.title_arabic : notificationsListing?.title} height={0} width={0} className="h-auto w-full rounded-tl-md rounded-tr-md" sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw" />
                                            :
                                            <div className="animate-pulse">
                                                <div className="rounded-md bg-dark/10 p-2.5 h-[194px] mt-2"></div>
                                            </div>
                                        }
                                        <div className="px-5 pt-3">
                                            <h6 className="font-bold text-sm text-[#004B7A] mb-3">{lang === 'ar' ? notificationsListing?.title_arabic : notificationsListing?.title}</h6>
                                            <small className="font-medium text-[#000000] mb-1">
                                                {expanded ?
                                                    (lang === 'ar' ? notificationsListing?.message_arabic : notificationsListing?.message)
                                                    :
                                                    lang === 'ar'
                                                        ? String(notificationsListing?.message_arabic || '').slice(0, 120)+'...'
                                                        : String(notificationsListing?.message || '').slice(0, 120)+'...'
                                                }
                                            </small>
                                            {notificationsListing?.message_arabic?.length >= 120 && (
                                                <div
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button
                                                        onClick={(e:any) => {setExpanded(!expanded); e.preventDefault(); e.stopPropagation()}}
                                                        className="text-[#004B7A] font-semibold text-xs hover:underline"
                                                    >
                                                        {expanded ? (lang === 'ar' ? "اقرأ أقل" : "Read Less") : (lang === 'ar' ? "اقرأ المزيد" : "Read More") }
                                                    </button>
                                                </div>
                                            )}
                                            {notificationsListing?.message_arabic?.length >= 120 && !expanded ?
                                                '' : 
                                                <small className="font-medium text-[#5D686F] text-xs">{dayjs(notificationsListing?.created_at?.split('T')[0]).format('MMMM Do, YYYY | h:mm A')}</small>
                                            }
                                        </div>
                                    </Link>
                                </div>
                                <div className="px-5 pb-5">
                                    <hr className="my-4 opacity-10" />
                                    <div className="mt-4">
                                        <h3 className="font-semibold text-sm">{lang === 'ar' ? 'هل انت جديد في معارض تمكين؟ سجل الآن' : 'New to Tamkeen Stores? Register!'}</h3>
                                        <div className="mt-4">
                                            <div className="flex items-center gap-2 mb-3 fill-[#004B7A]">
                                                <svg id="fi_9252729" height="24" viewBox="0 0 100 100" width="24" xmlns="http://www.w3.org/2000/svg"><path id="Return" d="m73.76 38.48v23.07a1.74 1.74 0 0 1 -1.27 1.71l-21.8 7.65a1.59 1.59 0 0 1 -1.38 0l-21.9-7.65a1.73 1.73 0 0 1 -1.17-1.71l-.11-23.07a1.83 1.83 0 0 1 1.38-1.7l21.91-7.65a1.14 1.14 0 0 1 1.16 0l22 7.65a1.73 1.73 0 0 1 1.17 1.7zm-44.55 51.46a1.81 1.81 0 0 1 1.71-3.19 41.41 41.41 0 0 0 51.35-62.75.41.41 0 0 0 -.75.32l.32 1.28c.64 2.34-2.87 3.19-3.51 1l-2.55-9.79a1.74 1.74 0 0 1 2.22-2.14l9.68 2.55a1.82 1.82 0 0 1 -1 3.51l-1.91-.53c-.43-.11-.75.32-.43.63a45.06 45.06 0 0 1 -55.13 69.11zm42.64-79.31c2.12 1.17.32 4.36-1.7 3.19a41.43 41.43 0 0 0 -52.42 62.18.44.44 0 0 0 .75-.42l-.32-1.17c-.64-2.34 2.87-3.19 3.51-1l2.55 9.78a1.75 1.75 0 0 1 -2.22 2.18l-9.68-2.55c-2.34-.64-1.38-4.15.85-3.51l2 .53c.43.11.75-.32.43-.74-15.09-17.65-13.92-44.44 2.56-60.92a45.07 45.07 0 0 1 53.69-7.55zm-20.1 37.1v18.4a.47.47 0 0 0 .64.42l17.54-6.17c.11-.1.32-.21.32-.42v-18.39c0-.22-.32-.43-.63-.32l-17.55 6.06c-.21.1-.32.21-.32.42zm-3.61 18.4v-18.4a.55.55 0 0 0 -.21-.42l-7.13-2.45a.47.47 0 0 0 -.63.43v6.8a1.8 1.8 0 0 1 -1.81 1.81 1.86 1.86 0 0 1 -1.81-1.81v-8.4a.55.55 0 0 0 -.21-.42l-6-2c-.31-.11-.63.1-.63.32v18.41c0 .21.1.32.32.42l17.54 6.17c.32.11.53-.11.53-.42zm-13.5-27.22 4.68 1.59a.19.19 0 0 0 .31 0l15.21-5.31c.21 0 .32-.21.32-.43a.35.35 0 0 0 -.32-.32l-4.68-1.7h-.32l-15.2 5.32a.44.44 0 0 0 0 .85zm11.48 4 3.72 1.27h.32l15.2-5.31a.44.44 0 0 0 0-.85l-3.82-1.38h-.32l-15.1 5.46c-.43.1-.43.64 0 .85zm19.56 12.27a1.8 1.8 0 0 1 1.17 3.4l-5.95 2.12a1.8 1.8 0 0 1 -1.17-3.4z"></path></svg>
                                                <label className="text-xs font-normal">{lang === 'ar' ? 'سهولة في تقييم المنتجات وتتبع الطلبات' : 'Easily review products and track your orders.'}</label>
                                            </div>
                                            <div className="flex items-center gap-2 mb-3 fill-[#004B7A]">
                                                <svg id="fi_3870922" height="22" viewBox="0 0 512 512" width="22" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m489.864 101.1a130.755 130.755 0 0 0 -60.164-50.89c-28.112-11.8-59.687-13.924-91.309-6.127-28.978 7.146-57.204 22.645-82.391 45.129-25.189-22.486-53.418-37.986-82.4-45.131-31.623-7.8-63.2-5.674-91.312 6.134a130.755 130.755 0 0 0 -60.161 50.9c-15.02 23.744-22.661 52.619-22.097 83.5 2.504 137.285 207.006 262.122 247.976 285.755a16 16 0 0 0 15.989 0c40.974-23.636 245.494-148.495 247.976-285.779.558-30.879-7.086-59.751-22.107-83.491zm-9.887 82.916c-.8 44.388-30.39 96.139-85.563 149.655-51.095 49.558-109.214 86.912-138.414 104.293-29.2-17.378-87.31-54.727-138.4-104.287-55.176-53.512-84.766-105.259-85.576-149.646-.884-48.467 22.539-87.462 62.656-104.313a106.644 106.644 0 0 1 41.511-8.238c36.795 0 75.717 17.812 108.4 51.046a16 16 0 0 0 22.815 0c45.406-46.17 102.85-62.573 149.9-42.811 40.121 16.845 63.547 55.834 62.671 104.298z"></path></svg>
                                                <label className="text-xs font-normal">{lang === 'ar' ? 'الوصول إلى قائمة المفضلات وحفظ المنتجات' : 'Access to wishlist, save the items you like!'}</label>
                                            </div>
                                            <div className="flex items-center gap-2 mb-3 fill-[#004B7A]">
                                                <svg height="24" viewBox="0 -16 512 512" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_1322236"><path d="m266 390c0 5.523438-4.476562 10-10 10s-10-4.476562-10-10 4.476562-10 10-10 10 4.476562 10 10zm0 0"></path><path d="m479 300c0-33.085938-26.914062-60-60-60s-60 26.914062-60 60 26.914062 60 60 60 60-26.914062 60-60zm-60 40c-22.054688 0-40-17.945312-40-40s17.945312-40 40-40 40 17.945312 40 40-17.945312 40-40 40zm0 0"></path><path d="m419 360c-25.199219 0-50.328125 10.460938-67.445312 27.421875-22.53125-29.609375-57.273438-47.421875-95.554688-47.421875-36.660156 0-72.183594 16.726562-95.550781 47.421875-17.121094-16.957031-42.246094-27.421875-67.449219-27.421875-50.410156 0-93 41.214844-93 90v20c0 5.523438 4.476562 10 10 10h492c5.523438 0 10-4.476562 10-10v-20c0-48.785156-42.589844-90-93-90zm-399 90c0-37.945312 33.429688-70 73-70 21.652344 0 43.125 9.59375 56.417969 24.84375-8.789063 16.976562-13.417969 35.898438-13.417969 55.15625h-116zm236-90c55.644531 0 100 45.148438 100 100h-200c0-55.582031 45.261719-100 100-100zm236 100h-116c0-19.257812-4.628906-38.179688-13.417969-55.15625 13.292969-15.25 34.765625-24.84375 56.417969-24.84375 39.570312 0 73 32.054688 73 70zm0 0"></path><path d="m153 300c0-33.085938-26.914062-60-60-60s-60 26.914062-60 60 26.914062 60 60 60 60-26.914062 60-60zm-60 40c-22.054688 0-40-17.945312-40-40s17.945312-40 40-40 40 17.945312 40 40-17.945312 40-40 40zm0 0"></path><path d="m336 260c0-44.113281-35.886719-80-80-80s-80 35.886719-80 80 35.886719 80 80 80 80-35.886719 80-80zm-80 60c-33.085938 0-60-26.914062-60-60s26.914062-60 60-60 60 26.914062 60 60-26.914062 60-60 60zm0 0"></path><path d="m335.140625 58.160156c-1.175781-3.621094-4.304687-6.257812-8.074219-6.804687l-43.132812-6.261719-19.3125-39.484375c-1.675782-3.433594-5.160156-5.609375-8.980469-5.609375s-7.304687 2.175781-8.984375 5.605469l-19.308594 39.488281-43.132812 6.257812c-3.769532.546876-6.898438 3.1875-8.074219 6.808594s-.195313 7.59375 2.53125 10.25l31.234375 30.441406-7.371094 42.988282c-.644531 3.75.898438 7.542968 3.980469 9.777344 3.0625 2.226562 7.140625 2.542968 10.53125.761718l38.59375-20.292968 38.609375 20.292968c3.367188 1.773438 7.449219 1.476563 10.53125-.761718 3.078125-2.238282 4.621094-6.027344 3.976562-9.78125l-7.378906-42.984376 31.230469-30.441406c2.726563-2.65625 3.707031-6.628906 2.53125-10.25zm-51.492187 30.039063c-2.355469 2.296875-3.433594 5.609375-2.875 8.851562l4.839843 28.199219-25.320312-13.3125c-2.914063-1.53125-6.394531-1.53125-9.308594 0l-25.3125 13.3125 4.835937-28.199219c.554688-3.246093-.523437-6.554687-2.878906-8.851562l-20.484375-19.964844 28.300781-4.109375c3.273438-.472656 6.097657-2.535156 7.546876-5.503906l12.648437-25.859375 12.644531 25.859375c1.453125 2.972656 4.277344 5.03125 7.546875 5.503906l28.304688 4.109375zm0 0"></path><path d="m484.609375 133.109375c-1.175781-3.621094-4.304687-6.257813-8.074219-6.804687l-29.222656-4.246094-13.066406-26.484375c-1.683594-3.414063-5.15625-5.574219-8.964844-5.574219 0 0 0 0-.003906 0-3.804688 0-7.28125 2.160156-8.964844 5.574219l-13.074219 26.484375-29.226562 4.246094c-3.765625.546874-6.894531 3.183593-8.070313 6.804687-1.179687 3.621094-.199218 7.59375 2.527344 10.25l21.144531 20.621094-4.992187 29.101562c-.640625 3.75.898437 7.539063 3.980468 9.777344 3.078126 2.238281 7.160157 2.535156 10.527344.765625l26.148438-13.738281 26.140625 13.738281c3.367187 1.769531 7.453125 1.472656 10.53125-.765625 3.078125-2.234375 4.617187-6.027344 3.976562-9.777344l-4.992187-29.101562 21.148437-20.621094c2.726563-2.65625 3.703125-6.628906 2.527344-10.25zm-41.398437 20.222656c-2.359376 2.296875-3.433594 5.605469-2.875 8.847657l2.453124 14.3125-12.855468-6.753907c-2.914063-1.53125-6.394532-1.53125-9.304688 0l-12.867187 6.757813 2.457031-14.316406c.554688-3.242188-.519531-6.550782-2.875-8.847657l-10.40625-10.148437 14.378906-2.085938c3.257813-.472656 6.074219-2.519531 7.53125-5.46875l6.429688-13.027344 6.425781 13.023438c1.457031 2.953125 4.273437 5 7.53125 5.472656l14.378906 2.085938zm0 0"></path><path d="m144.609375 133.109375c-1.175781-3.621094-4.304687-6.257813-8.074219-6.804687l-29.222656-4.246094-13.066406-26.484375c-1.683594-3.414063-5.15625-5.574219-8.964844-5.574219s-7.285156 2.160156-8.96875 5.574219l-13.074219 26.484375-29.226562 4.246094c-3.765625.546874-6.894531 3.183593-8.070313 6.804687-1.179687 3.621094-.199218 7.59375 2.527344 10.25l21.144531 20.621094-4.988281 29.101562c-.644531 3.75.898438 7.539063 3.976562 9.777344 3.078126 2.238281 7.160157 2.535156 10.53125.765625l26.144532-13.738281 26.140625 13.738281c3.390625 1.78125 7.46875 1.460938 10.53125-.765625 3.078125-2.234375 4.621093-6.027344 3.976562-9.777344l-4.992187-29.101562 21.148437-20.621094c2.726563-2.65625 3.703125-6.628906 2.527344-10.25zm-41.402344 20.222656c-2.355469 2.296875-3.429687 5.605469-2.875 8.847657l2.457031 14.3125-12.859374-6.753907c-2.910157-1.53125-6.390626-1.53125-9.300782 0l-12.871094 6.757813 2.457032-14.316406c.558594-3.242188-.519532-6.550782-2.875-8.847657l-10.40625-10.148437 14.382812-2.085938c3.253906-.472656 6.070313-2.519531 7.527344-5.46875l6.429688-13.027344 6.425781 13.023438c1.457031 2.953125 4.273437 5 7.53125 5.472656l14.378906 2.085938zm0 0"></path><path d="m299.820312 393.09375c-4.617187-3.035156-10.816406-1.75-13.847656 2.867188-3.035156 4.613281-1.75 10.8125 2.867188 13.847656 9.246094 6.074218 16.636718 14.542968 21.371094 24.488281 2.367187 4.980469 8.328124 7.109375 13.324218 4.730469 4.988282-2.371094 7.105469-8.339844 4.734375-13.324219-6.304687-13.25-16.144531-24.527344-28.449219-32.609375zm0 0"></path></svg>
                                                <label className="text-xs font-normal">{lang === 'ar' ? 'الحصول على كل الإشعارات بجديدنا أثناء رحلتك في تمكين' : 'Get all these alerts on the go with our app experience!'}</label>
                                            </div>
                                        </div>
                                        <button className="focus-visible:outline-none btn border border-[#004B7A] hover:bg-[#004B7A] text-[#004B7A] p-3 rounded-full w-full hover:text-white fill-white font-semibold text-sm mt-4"
                                            onClick={() => { router.push(`/${lang}/signup`) }}>
                                            {lang === 'ar' ? 'سجل الآن' : 'Register'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
