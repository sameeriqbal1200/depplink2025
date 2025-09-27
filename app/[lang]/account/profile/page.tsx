"use client"; // This is a client component 👈🏽

import React, { useEffect, useState, Fragment, useRef, ChangeEvent } from 'react'
import 'dayjs/locale/ar'
import dayjs from 'dayjs'
import Link from 'next/link'
import Swal from 'sweetalert2'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import MaskedInput from 'react-text-mask'
import { useRouter } from "next/navigation"
import { Api, NewMedia } from "@/lib/api/apiLinks";
import { useApp } from '@/app/_ctx/AppContext';
import withReactContent from 'sweetalert2-react-content'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { getUserProfileData, postUserProfileUpdate } from '@/lib/accounts/profile.client';

const MobileHeader = dynamic(() => import('../../components/MobileHeader'), { ssr: true })

export default function Profile() {
    const router = useRouter();
    const { lang, deviceType, origin } = useApp();
    const [updateProfile, setupdateProfile] = useState(false)
    const [firstWord, setFirstWord] = useState<any>(false)
    const [secondWord, setSecondWord] = useState<any>(false)
    const [profileData, setProfileData] = useState<any>([])
    const [genderStatus, setGenderStatus] = useState<number>(0)
    const [loginBtnStatus, setLoginBtnStatus] = useState<boolean>(false)
    const [loginBtnLoading, setLoginBtnLoading] = useState<boolean>(false)
    const [imgUpload, setimgUpload] = useState<boolean>(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [dateOfBirthDisabled, setDateOfBirthDisabled] = useState(false)
    const [ProfileImage, setProfileImage] = useState('/images/profile-image.png')
    const [ProfileImageStore, setProfileImageStore] = useState('')
    const [errormsg, setErrorMsg] = useState<any>('')
    const hiddenFileInput: any = useRef(null);
    const handleClick = (event: any) => {
        hiddenFileInput.current.click();
    };
    // CURRENCY SYMBOL //
    const currencySymbol = <svg className="riyal-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39" width="11" height="12">
        <path fill="currentColor" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"></path>
        <path fill="currentColor" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
    </svg>;

    const getUserProfile = async () => {
        try {
            const userId = typeof window !== "undefined" ? localStorage.getItem("userid") : null;
            if (!userId) { router.push(`/ ${lang} `); return; }

            const res: any = await getUserProfileData();
            const core = res?.profileDataCore;
            const u = core?.userdata ?? {};

            setFirstName(u.first_name ?? "");
            setLastName(u.last_name ?? "");
            setEmail(u.email ?? "");
            setGenderStatus(u.gender ?? "");
            setDateOfBirth(u.date_of_birth ?? "");
            setDateOfBirthDisabled(!!u.date_of_birth);

            const profileImgUrl = u.profile_img ? NewMedia + u.profile_img : "/images/profile-image.png";
            setProfileImageStore(u.profile_image ?? null);
            setProfileImage(profileImgUrl);

            if (typeof window !== "undefined") {
                const fullName = `${u.first_name ?? ""} ${u.last_name ?? ""} `.trim();
                localStorage.setItem("fullName", fullName);
                localStorage.setItem("profileImg", profileImgUrl);
            }

            setProfileData(core);
            setimgUpload(true);

            const fi = (u.first_name ?? "").trim().charAt(0);
            const li = (u.last_name ?? "").trim().charAt(0);
            if (fi) setFirstWord(fi);
            if (li) setSecondWord(li);
        } catch (err) {
            console.error("getUserProfile failed:", err);
            // optional: show toast / set error state
        }
    };

    // const getUserProfile = async () => {
    //     if (localStorage.getItem('userid')) {
    //         getUserProfileData().then((profileDataCore: any) => {
    //             const profileDataCoreConst = profileDataCore?.profileDataCore
    //             setFirstName(profileDataCoreConst?.userdata?.first_name)
    //             setLastName(profileDataCoreConst?.userdata?.last_name)
    //             setEmail(profileDataCoreConst?.userdata?.email)
    //             setGenderStatus(profileDataCoreConst?.userdata?.gender)
    //             setDateOfBirth(profileDataCoreConst?.userdata?.date_of_birth)
    //             if (profileDataCoreConst?.userdata?.date_of_birth) {
    //                 setDateOfBirthDisabled(true)
    //             }
    //             setProfileImageStore(profileDataCoreConst?.userdata?.profile_image)
    //             setProfileImage(profileDataCoreConst?.userdata?.profile_img != null ? NewMedia + profileDataCoreConst?.userdata?.profile_img : '/images/profile-image.png')
    //             localStorage.setItem('fullName', profileDataCoreConst?.userdata?.first_name + ' ' + profileDataCoreConst?.userdata?.last_name)
    //             localStorage.setItem('profileImg', profileDataCoreConst?.userdata?.profile_img != null ? NewMedia + profileDataCoreConst?.userdata?.profile_img : '/images/profile-image.png')
    //             setProfileData(profileDataCoreConst)
    //             setimgUpload(true)

    //             var firstlNameWord = profileDataCoreConst?.userdata?.first_name?.split(' ');
    //             if (firstlNameWord[0]) {
    //                 if (firstlNameWord[0]) {
    //                     setFirstWord(firstlNameWord[0].charAt(0))
    //                 }
    //             }

    //             var secondNameWord = profileDataCoreConst?.userdata?.last_name?.split(' ');
    //             if (secondNameWord[0]) {
    //                 if (secondNameWord[0]) {
    //                     setSecondWord(secondNameWord[0].charAt(0))
    //                 }
    //             }

    //         })
    //     } else {
    //         router.push(`/${lang}`)
    //     }
    // }

    const storedProfile = localStorage.getItem('userProfileData');
    let userProfileAtt = storedProfile ? JSON.parse(storedProfile) : {};
    const userEmail = localStorage.getItem('eMail') || '';
    const userPhone: any = `966${localStorage.getItem('phoneNumber') || ''}`;
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

    useEffect(() => {
        getUserProfile()
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(userProfileAttributes);
    }, [])

    const updateProfileData = async () => {
        try {
            const userId = typeof window !== "undefined" ? localStorage.getItem("userid") : null;
            if (!userId) { router.push(`/${lang}`); return; }

            const fn = (firstName ?? "").trim();
            const ln = (lastName ?? "").trim();
            const em = (email ?? "").trim();

            const missing: string[] = [];
            if (!fn) missing.push(lang === "ar" ? "الاسم الأول" : "First Name");
            if (!ln) missing.push(lang === "ar" ? "اسم العائلة" : "Last Name");
            if (!em) missing.push("Email");

            const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
            let msg = "";

            if (missing.length) {
                msg = (lang === "ar" ? "خطأ! يرجى تعبئة: " : "Error! Please fill: ") + missing.join(", ");
            } else if (!emailOk) {
                msg = lang === "ar" ? "بريد إلكتروني غير صالح" : "Invalid email";
            }

            if (msg) {
                setErrorMsg(msg);
                topMessageAlartDanger(msg);
                return;
            }

            setLoginBtnLoading(true);

            const payload = {
                user_id: userId,
                first_name: fn,
                last_name: ln,
                email: em,
                date_of_birth: dateOfBirth || null,
                gender: genderStatus || null,
                profile_image: ProfileImageStore ?? null,
            };

            const res = await postUserProfileUpdate(payload);

            if (res?.postProfileUpdate?.success) {
                setimgUpload(true);
                topMessageAlartSuccess(lang === "ar" ? "تم تحديث الملف الشخصي بنجاح!" : "Success! Your profile was updated.");
                await getUserProfile();
                setupdateProfile(false);
            } else {
                topMessageAlartDanger(
                    res?.postProfileUpdate?.message || (lang === "ar" ? "حدث خطأ. حاول لاحقًا." : "Error! Something went wrong. Please try again later.")
                );
            }
        } catch (e) {
            console.error("updateProfileData failed:", e);
            topMessageAlartDanger(lang === "ar" ? "حدث خطأ غير متوقع" : "Unexpected error");
        } finally {
            setLoginBtnLoading(false);
        }
    };

    // const updateProfileData = async () => {
    //     var data = {
    //         user_id: localStorage.getItem('userid'),
    //         first_name: firstName,
    //         last_name: lastName,
    //         email: email,
    //         date_of_birth: dateOfBirth,
    //         gender: genderStatus,
    //         profile_image: ProfileImageStore
    //     }
    //     setErrorMsg('Error! Please fill ' + (!firstName ? 'First Name, ' : '') + (!lastName ? 'Last Name, ' : '') + (!email ? 'Email, ' : '') + '!')
    //     if (!firstName || !lastName || !email) {
    //         topMessageAlartDanger(errormsg)
    //         setLoginBtnLoading(false)
    //         return false;
    //     }
    //     setLoginBtnLoading(true)
    //     postUserProfileUpdate(data).then(async (postProfileUpdate: any) => {
    //         if (postProfileUpdate?.postProfileUpdate?.success) {
    //             setimgUpload(true)
    //             topMessageAlartSuccess('Success! Your profile successfully updated.!')
    //             getUserProfile()
    //             setLoginBtnLoading(false)
    //             setupdateProfile(false)
    //         }
    //         else {
    //             topMessageAlartDanger('Error! something went wrong. Please check data and try again later.!')
    //             setLoginBtnLoading(false)
    //         }
    //     })
    // }

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

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            setimgUpload(false);

            const file = e.target.files?.[0];
            if (!file) return;

            // basic validation
            if (!file.type.startsWith("image/")) return;
            const MAX_MB = 5;
            if (file.size > MAX_MB * 1024 * 1024) return;

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`${Api}user-img`, { method: "POST", body: formData });
            if (!res.ok) throw new Error("upload failed");

            const json = await res.json();
            if (!json?.img) throw new Error("no image key in response");

            const url = `${NewMedia}${json.img}`;
            setProfileImage(url);
            setProfileImageStore(json.img);

            if (typeof window !== "undefined") {
                localStorage.setItem("profileImg", url);
            }
        } catch (err) {
            console.error("handleChange error:", err);
        } finally {
            setimgUpload(true);
            // allow selecting the same file again
            e.target.value = "";
        }
    };


    // const handleChange = async (event: any) => {
    //     setimgUpload(false)
    //     const fileUploaded = event.target.files[0];
    //     const formData = new FormData();
    //     formData.append("file", fileUploaded);
    //     const data = await fetch(Api + 'user-img', {
    //         method: "post",
    //         body: formData,
    //     });
    //     const uploadedImage = await data.json();
    //     if (uploadedImage?.img) {
    //         setProfileImage(NewMedia + uploadedImage?.img)
    //         if (!localStorage.getItem('profileImg')) {
    //             localStorage.setItem('profileImg', NewMedia + uploadedImage?.img)
    //         } else {
    //             localStorage.removeItem('profileImg')
    //             localStorage.setItem('profileImg', NewMedia + uploadedImage?.img)
    //         }
    //         setProfileImageStore(uploadedImage?.img)
    //     } else {
    //         // console.log("Error Found");
    //     }
    // };

    const genderMap: Record<0 | 1, { ar: string; en: string }> = {
        1: { ar: "ذكر", en: "Male" },
        0: { ar: "أنثى", en: "Female" },
    };

    const g = profileData?.userdata?.gender as 0 | 1 | undefined;
    const genderLabel = g !== undefined ? (lang === "ar" ? genderMap[g].ar : genderMap[g].en) : null;

    const statusMap: Record<number, { ar: string; en: string; color: string }> = {
        0: { ar: "تم الإستلام", en: "Received", color: "#20831E" },
        1: { ar: "تم التأكيد", en: "Confirmed", color: "#219EBC" },
        2: { ar: "قيد التنفيذ", en: "Processing", color: "#20831E" },
        3: { ar: "خرج للتوصيل", en: "Out for Delivery", color: "#219EBC" },
        4: { ar: "تم التوصيل", en: "Delivered", color: "#20831E" },
        5: { ar: "ملغي", en: "Cancel", color: "#DC4E4E" },
        6: { ar: "تم الإرجاع", en: "Refunded", color: "#DC4E4E" },
        7: { ar: "فشل", en: "Failed", color: "#DC4E4E" },
        8: { ar: "في انتظار الدفع", en: "Pending", color: "#004B7A95" },
    };

    const fmt = (n: number) => Intl.NumberFormat("en-US").format(n);
    const getTotal = (d: any) =>
        d?.ordersummary?.find((x: any) => x?.name === "total")?.price ??
        d?.ordersummary?.[0]?.price ??
        0;

    return (
        <>
            <MobileHeader type="Third" lang={lang} pageTitle={lang === 'ar' ? 'حساب تعريفي' : 'Profile'} />
            <div className="container md:py-4 py-16">
                <div className="flex items-start my-4 gap-x-5">
                    <div className="w-full">
                        <div className='flex items-center justify-between mb-1  font-semibold text-sm md:text-base'>
                            <h2>{lang == 'ar' ? 'بيانات حسابك' : 'Profile'}</h2>
                            <button
                                onClick={() => setupdateProfile(true)}
                                className='focus-visible:outline-none text-[#219EBC] hover:underline text-sm'>{lang == 'ar' ? 'تغــيــيـر' : 'Edit'}</button>
                        </div>

                        <div className="bg-white rounded-md shadow-md md:flex items-center mb-4 p-5">
                            <div className="text-center md:w-60">
                                <div className="w-16 h-16 rounded-full m-auto border-2 border-[#219EBC] flex justify-center items-center bg-[#219EBC]">
                                    <p className='text-white font-bold'>{firstWord}{' '}{secondWord}</p>
                                </div>
                                <button onClick={() => { setupdateProfile(true) }} className='focus-visible:outline-none text-[#1C262D] text-xs underline'>{lang == 'ar' ? 'تغـيــير الصـورة' : 'Edit'}</button>
                            </div>
                            <div className="h-28 w-[2px] bg-primary opacity-10 max-md:hidden" />
                            <div className="w-full md:px-12 max-md:mt-8">
                                <div className="md:grid grid-cols-2">
                                    <div className="text-sm font-bold">
                                        <div className="flex items-center gap-x-2 md:block">
                                            <h4 className="font-medium text-xs md:mb-1">{lang == 'ar' ? 'الاسم' : 'Name'}:</h4>
                                            <p>{profileData?.userdata?.full_name}</p>
                                        </div>
                                        <div className="flex items-center gap-x-2 md:block md:mt-6 mt-3">
                                            <h4 className="font-medium text-xs md:mb-1">{lang == 'ar' ? 'البريد الالكتروني' : 'Email Address'}:</h4>
                                            <p>{profileData?.userdata?.email}</p>
                                        </div>
                                        <div className="flex items-center gap-x-2 md:block md:mt-6 mt-3">
                                            <h4 className="font-medium text-xs md:mb-1">{lang == 'ar' ? 'رقم الهاتف' : 'Phone'}:</h4>
                                            <p dir='ltr' className="rtl:text-right">{`(966) ${profileData?.userdata?.phone_number}`}</p>
                                        </div>
                                    </div>

                                    <div className="text-sm font-bold max-md:mt-3">
                                        <div className="flex items-center gap-x-2 md:block">
                                            <h4 className="font-medium text-xs md:mb-1">{lang == 'ar' ? 'الجنس' : 'Gender'}:</h4>
                                            <p>
                                                {genderLabel ?? (
                                                    <button
                                                        type="button"
                                                        className="focus-visible:outline-none text-[#219EBC] hover:underline text-sm"
                                                        onClick={() => setupdateProfile(true)}
                                                    >
                                                        {lang === "ar" ? "تعديل" : "Edit"}
                                                    </button>
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-x-2 md:block md:mt-6 mt-3">
                                            <h4 className="font-medium text-xs md:mb-1">{lang == 'ar' ? 'رقم الهاتف' : 'Date of Birth'}:</h4>
                                            <p dir='ltr' className="rtl:text-right">{profileData?.userdata?.date_of_birth ? dayjs(profileData?.userdata?.date_of_birth).locale(lang == 'ar' ? 'ar' : 'en').format("YYYY, MMM  DD") : <button className="text-[#219EBC] hover:underline text-sm" onClick={() => { setupdateProfile(true) }}>{lang === 'ar' ? 'يحرر' : 'Edit'}</button>}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Details */}
                        <div className='flex items-center justify-between mb-1  font-semibold text-sm md:text-base mt-4'>
                            <h2>{lang == 'ar' ? 'عنوانك الاساسي الحالي' : 'Primary Address'}</h2>
                            <Link href={`${origin}/${lang}/account/addressbook`} className='text-[#219EBC] hover:underline text-sm'>{lang == 'ar' ? 'تغــيــيـر' : 'Edit'}</Link>
                        </div>

                        <div className="bg-white rounded-md shadow-md flex items-center mb-4 p-5">
                            <div className="flex items-center gap-x-3 text-[#004B7A] fill-[#004B7A] font-regular text-sm">
                                <svg id="fi_3514361" height="28" viewBox="0 0 256 256" width="28" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m128 138.184a5 5 0 0 1 -3.607-1.538c-2.075-2.16-50.808-53.259-50.808-82.228a54.415 54.415 0 1 1 108.83 0c0 28.969-48.733 80.068-50.808 82.228a5 5 0 0 1 -3.607 1.538zm0-128.184a44.465 44.465 0 0 0 -44.415 44.418c0 19.07 29.312 54.978 44.414 71.451 15.1-16.478 44.416-52.4 44.416-71.451a44.465 44.465 0 0 0 -44.415-44.418z"></path><path d="m128 76.153a21.735 21.735 0 1 1 21.735-21.735 21.759 21.759 0 0 1 -21.735 21.735zm0-33.47a11.735 11.735 0 1 0 11.735 11.735 11.748 11.748 0 0 0 -11.735-11.735z"></path><path d="m128.126 256a4.992 4.992 0 0 1 -2.5-.67l-77.175-44.559a5 5 0 0 1 -2.5-4.331v-38.385a5 5 0 0 1 10 0v35.5l72.175 41.67 72.174-41.67v-35.88a5 5 0 0 1 10 0v38.765a5 5 0 0 1 -2.5 4.331l-77.174 44.556a4.992 4.992 0 0 1 -2.5.673z"></path><path d="m128.126 166.884a4.992 4.992 0 0 1 -2.5-.67l-77.175-44.557a5 5 0 1 1 5-8.66l74.675 43.113 74.674-43.11a5 5 0 1 1 5 8.66l-77.174 44.557a4.992 4.992 0 0 1 -2.5.667z"></path><path d="m160.933 198.291a5 5 0 0 1 -3.459-1.389l-32.806-31.402a5 5 0 0 1 6.916-7.224l30.1 28.813 68.154-39.349-27.558-26.382-27.359-15.744a5 5 0 1 1 4.988-8.667l27.885 16.047a4.988 4.988 0 0 1 .964.721l32.806 31.407a5 5 0 0 1 -.958 7.942l-77.174 44.557a4.993 4.993 0 0 1 -2.499.67z"></path><path d="m95.067 198.525a4.985 4.985 0 0 1 -2.5-.67l-77.173-44.555a5 5 0 0 1 -.957-7.942l33.057-31.642a4.967 4.967 0 0 1 .957-.718l27.634-15.955a5 5 0 1 1 5 8.66l-27.112 15.653-27.807 26.616 68.154 39.348 30.349-29.048a5 5 0 1 1 6.914 7.224l-33.058 31.641a4.991 4.991 0 0 1 -3.458 1.388z"></path></svg>
                                <div>
                                    <p className="font-bold">{profileData?.userdata?.shipping_address_data_default?.address_label === 0 ? lang == 'ar' ? 'الــمنـــزل' : 'Home' : lang == 'ar' ? 'مكتب' : 'Office'}</p>
                                    <label className="text-dark">{profileData?.userdata?.shipping_address_data_default?.address}, {lang == 'ar' ? profileData?.userdata?.shipping_address_data_default?.state_data?.name_arabic : profileData?.userdata?.shipping_address_data_default?.state_data?.name}, {lang == 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</label>
                                </div>
                            </div>
                        </div>

                        {/* Latest Order listing */}
                        <div className='flex items-center justify-between mb-1  font-semibold text-sm md:text-base mt-4'>
                            <h2>{lang == 'ar' ? 'اخر طلباتك' : 'Your Latest Orders'}</h2>
                            <Link href={`${origin}/${lang}/account/orderlisting`} className='text-[#219EBC] hover:underline text-sm'>{lang == 'ar' ? 'عـرض كـل الطلبـات' : 'View All Orders'}</Link>
                        </div>

                        {(profileData?.userdata?.orders_data ?? []).map((d: any) => {
                            const total = getTotal(d);
                            const st = statusMap[Number(d?.status)];

                            return (
                                <div
                                    key={d?.id ?? d?.order_no}
                                    className="grid grid-cols-3 md:grid-cols-6 bg-white px-3 md:p-5 shadow-md rounded-md mb-3 text-sm"
                                >
                                    <div className="text-[#1C262D85] max-md:my-4">
                                        <h4 className="font-medium text-xs mb-1">{lang === "ar" ? "رقم الطلب" : "Order Number"}:</h4>
                                        <p className="font-medium text-[#004B7A]">{d?.order_no}</p>
                                    </div>

                                    <div className="text-[#1C262D85] max-md:my-4">
                                        <h4 className="font-medium text-xs mb-1">{lang === "ar" ? "تاريخ الطلب" : "Order Date"}:</h4>
                                        <p className="font-medium text-[#004B7A]">
                                            {dayjs(d?.created_at).locale(lang === "ar" ? "ar" : "en").format("MMM DD, YYYY")}
                                        </p>
                                    </div>

                                    <div className="text-[#1C262D85] max-md:my-4">
                                        <h4 className="font-medium text-xs mb-1">{lang === "ar" ? "عدد المنتجات" : "No. of Products"}:</h4>
                                        <p className="font-medium text-[#004B7A]">
                                            ({d?.details_count}) {lang === "ar" ? "منتجات" : "Items"}
                                        </p>
                                    </div>

                                    <div className="text-[#1C262D85] max-md:my-4">
                                        <h4 className="font-medium text-xs mb-1">{lang === "ar" ? "إجمالي القيمة" : "Total Value"}:</h4>
                                        <p className="font-medium text-[#004B7A] flex items-center gap-1">
                                            {fmt(total)} {currencySymbol}
                                        </p>
                                    </div>

                                    <div className="text-[#1C262D85] max-md:my-4">
                                        <h4 className="font-medium text-xs mb-1">{lang === "ar" ? "حالة الطلب" : "Order Status"}:</h4>
                                        <p className="font-medium" style={{ color: st?.color ?? "#004B7A95" }}>
                                            {st ? (lang === "ar" ? st.ar : st.en) : "---"}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-center underline text-[#B15533]">
                                        <Link href={`${origin}/${lang}/account/orderdetails/${d?.id}`} prefetch replace={false}>
                                            {lang === "ar" ? "إظهار التفاصيل" : "View Details"}
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Transition appear show={updateProfile} as={Fragment}>
                <Dialog as="div" open={updateProfile} onClose={() => setupdateProfile(false)}>
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
                                <DialogPanel as="div" className="panel border-0 rounded-lg overflow-hidden max-w-lg p-0 relative">
                                    <Image
                                        src="/images/loginPattren.webp"
                                        alt='popup_pattren'
                                        title='Blue Popup Pattren'
                                        quality={100}
                                        height={0}
                                        width={0}
                                        style={{
                                            objectFit: 'contain', // cover, contain, none
                                        }}
                                        className="h-full w-full mt-10 rounded-tl-xl rounded-tr-xl"
                                        loading='lazy'
                                        sizes="(max-width: 960px) 50vw, (max-width: 1024px) 50vw, (max-width: 1650px) 50vw, (max-width: 1920px) 60vw, 100vw"
                                    />
                                    <div className='absolute top-0 text-white text-center w-full'>
                                        <input
                                            type="file"
                                            onChange={handleChange}
                                            accept="image/*"
                                            ref={hiddenFileInput}
                                            style={{ display: 'none' }} // Make the file input element invisible
                                        />
                                        <button onClick={handleClick}>
                                            <div className='focus-visible:outline-none bg-white rounded-full w-20 flex items-center justify-center h-20 m-auto'>
                                                <Image
                                                    src={ProfileImage}
                                                    alt='profile-image'
                                                    title='profile-image'
                                                    quality={100}
                                                    height={34}
                                                    width={34}
                                                    className="h-full w-full rounded-tl-xl rounded-tr-xl"
                                                    loading='lazy'
                                                    style={{ width: '34px', height: '34px' }}
                                                    sizes="(max-width: 960px) 50vw, (max-width: 1024px) 50vw, (max-width: 1650px) 50vw, (max-width: 1920px) 60vw, 100vw"
                                                />
                                                {/* <svg id="fi_5319951" height="34" viewBox="0 0 20 20" width="34" xmlns="http://www.w3.org/2000/svg" data-name="Layer 2"><circle cx="10" cy="5" r="4"></circle><path d="m10 11a7.008 7.008 0 0 0 -7 7 1 1 0 0 0 1 1h12a1 1 0 0 0 1-1 7.008 7.008 0 0 0 -7-7z"></path></svg> */}
                                            </div>
                                        </button>
                                        <h3 className="text-xl mt-8 font-bold">{lang == 'ar' ? 'قم بإنشاء حساب الأن' : 'Edit Profile'}</h3>
                                        <p className="text-xs font-regular mt-1.5">{lang == 'ar' ? 'برجاء ادخال بياناتك بالحقول التالية' : 'You can add or update data in your profile'}</p>
                                    </div>
                                    <div className="bg-white p-3 w-full flex items-center justify-center">
                                        <div className="w-full">
                                            <div className="flex items-center rounded-md border border-[#dfdfdf] focus-visible:outline-[#004B7A] fill-primary p-2.5 text-sm gap-x-3 w-full mb-3">
                                                <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" id="fi_9308008"><g><path d="m12 12.75c-3.17 0-5.75-2.58-5.75-5.75s2.58-5.75 5.75-5.75 5.75 2.58 5.75 5.75-2.58 5.75-5.75 5.75zm0-10c-2.34 0-4.25 1.91-4.25 4.25s1.91 4.25 4.25 4.25 4.25-1.91 4.25-4.25-1.91-4.25-4.25-4.25z"></path><path d="m20.5901 22.75c-.41 0-.75-.34-.75-.75 0-3.45-3.5199-6.25-7.8399-6.25-4.32005 0-7.84004 2.8-7.84004 6.25 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-4.27 4.18999-7.75 9.34004-7.75 5.15 0 9.3399 3.48 9.3399 7.75 0 .41-.34.75-.75.75z"></path></g></svg>
                                                <div className="h-5 w-[1px] bg-primary opacity-20" />
                                                <input id="iconLeft" type="text" placeholder={lang == 'ar' ? 'First Name' : 'First Name'} className="focus-visible:outline-none w-full font-regular"
                                                    value={firstName} onChange={(e: any) => {
                                                        setFirstName(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center rounded-md border border-[#dfdfdf] focus-visible:outline-[#004B7A] fill-primary p-2.5 text-sm gap-x-3 w-full mb-3">
                                                <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" id="fi_9308008"><g><path d="m12 12.75c-3.17 0-5.75-2.58-5.75-5.75s2.58-5.75 5.75-5.75 5.75 2.58 5.75 5.75-2.58 5.75-5.75 5.75zm0-10c-2.34 0-4.25 1.91-4.25 4.25s1.91 4.25 4.25 4.25 4.25-1.91 4.25-4.25-1.91-4.25-4.25-4.25z"></path><path d="m20.5901 22.75c-.41 0-.75-.34-.75-.75 0-3.45-3.5199-6.25-7.8399-6.25-4.32005 0-7.84004 2.8-7.84004 6.25 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-4.27 4.18999-7.75 9.34004-7.75 5.15 0 9.3399 3.48 9.3399 7.75 0 .41-.34.75-.75.75z"></path></g></svg>
                                                <div className="h-5 w-[1px] bg-primary opacity-20" />
                                                <input id="iconLeft" type="text" placeholder={lang == 'ar' ? 'Last Name' : 'Last Name'} className="focus-visible:outline-none w-full font-regular"
                                                    value={lastName} onChange={(e: any) => {
                                                        setLastName(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center rounded-md border border-[#dfdfdf] focus-visible:outline-[#004B7A] py-1 px-3 text-sm gap-x-3 w-full mb-3">
                                                <svg id="fi_14063267" enableBackground="new 0 0 64 64" height="32" viewBox="0 0 64 64" width="32" xmlns="http://www.w3.org/2000/svg"><g><g><path d="m63 47.2c0 3.4-2.7 6.1-6 6.1h-50c-3.3 0-6-2.7-6-6.1v-30.4c0-3.4 2.7-6.1 6-6.1h50c3.3 0 6 2.7 6 6.1z" fill="#096"></path><path d="m7 10.7h50c3.3 0 6 2.7 6 6.1v30.4c0 3.4-2.7 6.1-6 6.1" fill="#038e5c"></path><g fill="#007a54"><path d="m63 47.2c0 3.4-2.7 6.1-6 6.1h-50c-3.3 0-6-2.7-6-6.1"></path><path d="m7 10.7h50c3.3 0 6 2.7 6 6.1v11.1"></path></g></g><g><g fill="#fff"><path d="m8.6 20.4c.4-.3.4.5 0 1.4.2-.3.6-1 .5-1.5-.1-.7-.5-.6-.8-.2-.2.3-.1.5.3.3z"></path><path d="m8.7 26.1c.5-.9.3-1.6.7-2.9.3-.8.3-.2.3.3-.2 1.3-.1 3.4 1.7 3.3.1 1.2.4 3.3.4 4.1 0 .7.1.5.3.1s.1-.9.1-1.5-.1-1.7-.2-3.2c.2-.2.5-.5.6-.7.2-.5.3-.4.4 0 .2.8 1 1.3 2 .5 1-.7.6-2.1.1-3.6.4.1.5-.2.3-.6-.1-.2-.3-.4-.4-.6-.2-.2-.3-.4-.5-.2s-.3.4-.4.5-.1.3 0 .6c.4.9.6 1.9.7 2.4s-.1.6-.5.6c-.3 0-.8-.1-1-.9s-.3-1.1-.2-1.7c0-.5.1-.9-.3-1.4s-.4-.4-.5-.2c-.1.3-.2.7-.1 1.2.2.7.3 1.3.4 1.7.1.3-.2.9-.7 1.2-.1-1-.2-2.2-.3-3.3.6-.2.3-.9-.2-1.7-.3-.6-.5-.4-.7 0s-.1.6.1.9c-.1.3.1.7.2 1.4.1.5.2 1.8.2 2.9-.4 0-.7-.3-.9-.7-.3-.8-.3-1.6-.1-2 .2-.5.3-1.2 0-1.4s-.6 0-.8.4c-.4.6-.8 1.4-.8 2.3 0 .3-.1 1-.3 1.3-.1.3-.4.3-.6-.1-.4-.6-.5-2.2-.5-3 0-.4-.1-.5-.2 0-.4 1.6.1 3.2.4 3.9.5.9 1 .7 1.3.1z"></path><path d="m13.5 20.9c.2-.2.2-.2.3 0s.4.2.5 0 .2-.3.1-.6c-.1-.2-.1-.1-.2.1-.1.4-.5.3-.5-.2s-.1-.2-.3.1c-.2.5-.5.4-.5-.1 0-.3-.1-.6-.3-.2-.1.3 0 .6.1.8.3.3.6.3.8.1z"></path><path d="m10.5 28.4c.3-.1.3-.1.3-.5s-.2-.2-.6-.1c-.6.2-1.8.8-2.7 1.9-.4.5-.1.3.2.1.5-.4 2-1.2 2.8-1.4z"></path><path d="m8.5 34.8c-.3.5-.9-.2-.5-1.5.1-.3.2-.5.2-.7s0-.4 0-.7c0-.2-.2.1-.3.5-.1.6-.5.9-.4 2.8.1 1.1 1.4 1.1 1.5-.3 0-.6-.2-.6-.5-.1z"></path><path d="m17.4 30.6c0-.5-.1-1-.1-1.5.1 0 .1-.1.2-.1.3.9 1.6.7 2 .1.2-.3.2-.3.4 0 .3.4 1.3.6 1.5 0s.2-1.2.1-1.6c-.1-.5-.2-.4-.5-.2s-.1.3 0 .6c.1 1.2-.9 1.1-1-.1-.1-.8-.2-.5-.3-.1-.5 1.5-1.8 1.8-1.6 0 0-.5-.3-.3-.5-.1-.1.1-.3.3-.4.4-.1-1.4-.2-3-.4-5 .4.5.8-.1.5-.6-.2-.4-.5-1.4-.7-1.9s-.3-.4-.7.1c-.4.4-.3.5-.2 1 0 .6 0 1.1.2 2.2.1.8.3 2.5.5 4.6-.2.1-.5.3-.7.4-.1-.4-.4-.6-.8-1-.6-.6-1-.6-1.5.1s-.4.8-.4 1.5c0 .6-.1.8.4 1s.7.1 1 0c.2-.1.5-.2.9-.3.1.3 0 .7-.2.9-1.2 1.4-3 2.5-3.8 1.5-.4-.5-.6-1.3-.5-2.3.1-.8-.1-.4-.2-.2-.3.9-.4 2.3 0 3 .5 1 1.4 1.4 2.8.7 1.4-.6 2.7-1.7 2.7-3.2 0-.3 0-.5 0-.7.2-.1.4-.2.5-.3v1.7c.1 1.6-.6 2.1-1.2 2.6-.8.6-1.9 1.1-2.9 1.2-2.2.3-2.7-1.1-2.7-3 0-.3.1-.5.1-.9 0-.8-.1-.7-.4.1-.2.8-.5 2.6.2 4.1.8 1.5 3.4 1.1 5.4.1 2.2-1.1 2.4-2.9 2.3-4.8zm-2.8-1.5c-.5.2-.7-.1-.6-.4 0-.3.1-.5.5-.3.2.1.4.3.6.6-.3.1-.4.1-.5.1z"></path><path d="m19.7 32.3c.2-.4.3-.8.2-1.3-.1-.3 0-.4-.3-.6-.3-.1-.4.1-.5.3-.1.3.1.7.5.5.1.2 0 .7-.1 1-.1.4 0 .5.2.1z"></path><path d="m20.5 24.2c-.4.5-.7 1.2-.1 1.6.3.2.9-.1 1.1-.5.2-.5.1-.6-.3-.1-.5.6-1.1.1-.5-.8.4-.6.1-.7-.2-.2z"></path><path d="m18.8 24.3c1.4-.6 2.2-1.4 2.6-2.1.4.1.5-.2.3-.5.1-.3.2-.5.3-.7.3-1.3-1-1.4-1.3-.4-.2.5-.2 1 .2 1.3-.6.8-1.4 1.5-2.4 2.1-.4.4-.3.6.3.3zm2.4-3.5c.1-.3.3-.1.3.1 0 .1-.1.3-.2.4-.2-.1-.2-.3-.1-.5z"></path></g><path d="m20.7 20.6c-.2.5-.2 1 .2 1.3-.1.1-.2.3-.3.4l.5.4c.1-.2.3-.3.4-.5.4.1.5-.2.3-.5.1-.3.2-.5.3-.7.2-1.3-1-1.4-1.4-.4zm.8.3c0 .1-.1.3-.2.4-.2-.1-.2-.3-.1-.5.1-.3.3-.1.3.1z" fill="#cfe7e8"></path><path d="m22.2 32.3c-.2.1-.5.4-.7.6 0-.4.1-1 .1-1.2 0-.3-.1-.4-.3-.1-.3.6-.6 1.4-.7 2-1.3.9-2.9 1.8-4 2.3-.5.2-.2.4.2.3 1.5-.5 2.7-.9 3.8-1.4.1.9.4 1.5 1.2 1.7 1.5.4 3-.9 4.7-3.2.4 1.1 1.4 2.6 4 3 1.1.2 1 .1 1.2-.5.1-.5.3-.6-.6-.8-1.1-.4-1.5-1.2-.4-1.7s2.6-.9 3.6-1.1c.7-.1.9-.1 1.1-.7.2-.7.3-.8-.4-.7-.8.1-4.6.2-5.6.1.8-.4 1.9-.8 2.7-1.1.3.2.4.1.3-.1.3-.1.6-.2.9-.4.9-.5 1.3-1.6.3-2.3s-1.8-.9-2.3-.2c-.4.6-.8 1.2-.2 2-.9.3-1.7.6-2.5.9-.6.2-.9.3-1.1 1.1s-.3.8.5.9c1.1 0 2.1 0 2.8.6-1.1.4-1.9 1.2-1.5 2.3-.5-.1-1-.3-1.4-.7-.8-.8-.8-2.2-1.1-3.8s-1-3-1.3-3.6c-.2-.6-.3-.3-.5.1s-.4.6-.2 1.2c.4 1 1 3 1.3 4.2-.6 1.4-2.2 3.1-3.5 3.3-1 .2-1.3-.4-1.2-.9.7-.4 1.3-.9 1.9-1.5 1.2-1.3 1.4-2.3.6-4.4.5.1.4-.3-.3-1.2-.5-.6-.6-.5-.9.1-.2.5-.4.9.2 1.1.1.3.3.7.6 1.2.6 1.3-.4 1.8-1.3 2.6zm9.5-4.4c0-.3.1-.3.6 0s.9.4.2.5c-.2.1-.5.1-.7.2 0-.3 0-.5-.1-.7z" fill="#fff"></path><g fill="#cfe7e8"><path d="m34.9 30.8c-.5 0-2.7.1-4.2.1l2 1.7c.5-.2 1.1-.3 1.5-.4.7-.1.9-.1 1.1-.7.2-.7.3-.8-.4-.7z"></path><path d="m25.1 26.1.2.2c0-.2-.1-.2-.2-.2z"></path><path d="m30.2 30.4c.6-.3 1.3-.5 1.8-.7.3.2.4.1.3-.1.3-.1.6-.2.9-.4.9-.5 1.3-1.6.3-2.3s-1.8-.9-2.3-.2c-.4.6-.8 1.2-.2 2-.7.2-1.3.4-1.9.7zm2.2-2.5c.5.3.9.4.2.5-.2.1-.5.1-.7.2-.1-.3-.1-.5-.1-.6-.1-.4.1-.4.6-.1z"></path></g><path d="m34 36c.3-.1.8-.4 1.2-.7.4-.4.1-.3-.2-.2s-.6.3-1 .4c-.4.2-.5 0-.3-.7.2-.6 0-.6-.3-.5s-.4.3-.7.5c-.2.1-.2.3.3.1.4-.2.3 0 .2.5-.2.5.1.8.8.6z" fill="#fff"></path><g fill="#cfe7e8"><path d="m24.7 25.1c.3-.7.5-1.4.7-1.9s.4-.4.3.1c-.1.9-.1 2.3.8 2.9.9.5 2.3-.4 2.8-1.4 1.5 1.9 2.8 1 2.9-.8 0-.6-.2-1.8-.4-2.2s0-.4.2-.2.6.4.4-.3c-.2-.6-.5-1-.8-1.3s-.4-.1-.5.1-.1.3-.3.5-.1.3 0 .6c.6 1.4 1.1 3.5.2 3.7-.8.2-1.3-1.6-1.3-2.4 0-1-.2-1.9-.4-2.5s-.3-.6-.5-.3c-.1.2-.1.4-.3.6-.1.2 0 .3.1.7.5 2.3.4 3.3-.6 3.9s-1.6 0-1.6-.7 0-1.6.1-2.2.2-.8 0-1.1-.4-.2-.7.2c-.6.9-1.3 2.4-1.5 3.1s-.7.5-1-.1c-.4-.7-.3-2-.2-2.6.1-.5.1-.7-.2-.2-.5 1.4-.5 2.8.6 4 .5.9.9.5 1.2-.2z"></path><path d="m27.5 22.4c0 .3 0 .7.2.1.1-.6.1-1.4-.1-1.9s-.3-.6-.5-.4-.2.3 0 .5c.2.3.5 1 .4 1.7z"></path><path d="m29.6 27.1c0 .8-.2.8-.5 0-.1-.3-.2-.3-.3.1 0 .7-.3.8-.5.1-.1-.3-.1-.6-.2-.1-.1.4 0 .7.2 1 .2.2.5.2.6-.1s.2-.3.4-.1 1 0 .6-1.1c-.2-.4-.3-.3-.3.2z"></path><path d="m37.7 20.8c.3.2.6.7.5 1.3-.1.5 0 .8.3.1s.1-1.5-.2-2-.4-.3-.6-.1c-.2.3-.3.6 0 .7z"></path><path d="m32.6 21.1c0 .3.1.5.5.6.8 1.1 1.7 2.3 2.5 3.4.1 1 .3 2 .4 2.9.2 2 .6 4.7.3 5.9-.2.9 0 1.2.4-.1s.4-2.6.1-4.5c-.1-.8-.1-1.7-.2-2.7 1.3 2.1 2.6 4.1 3.1 5.5.3.8.6.9.3-.1-.3-1.4-1.6-3.8-3.6-6.8-.1-.8-.1-1.6-.1-2.2.3.3.5.1.4-.3-.2-.8-.5-1.4-.8-2.2-.1-.4-.5-.4-.7.1-.2.6-.2.7 0 1.1 0 .5.1 1.2.2 1.9-.3-.5-.8-1.2-1.2-1.7.5.2.9.1.4-.5-.5-.5-1.2-1.1-1.6-1.5s-.6-.1-.6.2c.2.5.3.7.2 1z"></path><path d="m38.3 23.9c-.1.5-.3.3-.4-.1-.1-.2-.2-.1-.2.3.1.4.2.7.5.4.2-.2.2-.2.5 0 .2.2.4 0 .5-.1 0-.1.1-.3 0-.8s-.2-.2-.3.2-.3.5-.4 0c0-.4-.2-.3-.2.1z"></path><path d="m40.6 30.4c.1 1.8.3 2.6-.8 3.9-1.2 1.3-2 1.7-2.5 1.8-.7.2-.9.5.1.4 1.5-.1 1.7-.1 3-1.6.7-.8 1-1.8 1-4.2-.1-4.2-.6-6-.6-8.3.2.2.5.2.4-.2-.2-.5-.3-1.1-.4-1.6-.2-.5-.3-.7-.5-.4s-.4.4-.5.6-.2.5 0 .8c.6 4.9.7 7 .8 8.8z"></path><path d="m43.2 30.9c.1 1 .3 1.7 0 2.9-.1.3.1.5.3 0 .9-1.7.3-3.2.2-4.2-.1-1.5-.7-5.4-.8-7l.1.1c.4.2.9.4.6-.2-.3-.5-.6-1.4-.8-2s-.3-.6-.6-.1c-.6.8-.2 1.6 0 2.6.4 3.4.9 6.9 1 7.9z"></path><path d="m45.3 25.3c.3.3.5.9.7 1.2.2.5.4.1.4-.2s-.1-1.2 0-1.5c.2-.5.5.2.6-.1.1-.2-.1-.3-.2-.5-.1-.3-.2-.2-.4-.1-.2.2-.3.4-.3.5v1.1c0 .4-.1.4-.2.2-.1-.3-.4-1-.6-1.2s-.5-.1-.5.2v.5c0 .2.4.2.5-.1z"></path><path d="m45.1 29.2c0 .3.4-.1.7-.3s1.2-.8 1.6-1 .3-.3.2-.7c0-.4-.3-.1-.6.2s-1.2.9-1.5 1.2-.4.4-.4.6z"></path><path d="m43 34.6c-.4-.8-.4-1.6-.4-2.3 0-.6-.1-1.1-.3-.1-.6 2.4-.2 2.9.4 3.4.8.7 1.1.8 1.5.1.8-1.2 1.1-2.2 1.5-2.8.4-.5.4-.1.6.1.5.6.9.8 1.6.9s1.9-.5 1.8-2.7c-.1-1.4-.2-3.2-.3-5.2.7.9 1.2 1.7 1.7 2.4.2 1.3.3 2.5.3 3.4-.1 1.1.2 1.1.4 0 .1-.4.1-1.4 0-2.5.9 1.2 1.4 1.9 1.7 2.5.4.7.6 1.2.5-.1 0-.5-.2-.9-.8-1.8-.6-.8-1.1-1.6-1.6-2.4-.2-1.9-.4-4-.4-5.1.3.2.5 0 .3-.4-.1-.4-.4-1.6-.6-2s-.4-.4-.6.1c-.2.4-.4.6-.3.9.1 1.9.3 3.7.6 5.3-.5-.7-1-1.4-1.4-2 0-.7-.1-1.4-.1-2.1.3.2.4.2.3-.3-.1-.4-.5-1.4-.7-1.8s-.3-.4-.5-.1c-.3.5-.4.9-.1 1.4 0 .5.1.9.1 1.4-.3-.4-.5-.8-.8-1.1.3.1.5-.1.2-.4s-.9-.8-1.2-1.1c-.3-.4-.5-.3-.5 0v.9c0 .3 0 .5.3 1 .7.9 1.5 1.8 2.1 2.7.3 3.2.4 5.3.4 6.6 0 .8-.3 1.2-.7 1.3s-.8-.1-1.2-.7c-.7-1-1-.8-1.5.1s-.9 1.6-1.2 2.2c-.2.6-.7 1.1-1.1.3z"></path><path d="m52.6 23.5c0 .6.2.5.3 0s.1-1.5-.2-2.1c-.3-.7-.4-.4-.5-.2-.2.3-.2.4.1.7.1.3.3 1 .3 1.6z"></path><path d="m55.3 29.7c-.2-4.2-.7-6-.6-7.6.4.3.5.2.3-.3s-.5-1.1-.7-1.7c-.2-.5-.3-.4-.6 0s-.3.7-.2.9c.6 5.1.9 7.8 1 9.4.1 2.2-.4 3.5-2.6 5-.7.5-1.5 1 .2.6 1.6-.5 3.4-1.6 3.2-6.3z"></path><path d="m49.7 34.1c-.3.4.4.6.5.3.2.3 0 .8-.3 1.1-.5.4-.2.5.1.2.3-.2 1.1-1.1.6-1.7-.3-.2-.7-.2-.9.1z"></path></g><path d="m47.5 41.5c-1.3 0-2.5 0-3.8.1v-.4c.4-.5.3-.5 0-1-.1-.2-.2-.4-.5 0s-.3.5.1 1v.4c-9.9.1-20.8 0-30.2-.1 1 1.7 4.4 1.6 7.5 1.6 2.8 0 11.2 0 22.6-.3v.5c-.4.5-.3.5 0 1 .3.4.4.2.5 0 .1-.1.1-.2.1-.2h1.5c0 .2.3.3.4.3s.4-.1.4-.3h1.7c.2.3.4.4.7.4.6 0 .9-.7.8-1.6-.1-1.3-.6-1.5-1.8-1.4zm-1.4 2c0-.2-.3-.3-.4-.3s-.4.1-.4.3h-1.5c0-.1-.1-.2-.3-.4v-.5c1.3 0 2.7-.1 4.1-.1-.1.3-.1.6-.1.9z" fill="#fff"></path><path d="m47.5 41.5c-1.3 0-2.5 0-3.8.1v-.4c.4-.5.3-.5 0-1-.1-.2-.2-.4-.5 0s-.3.5.1 1v.4s0 0-.1 0l1.4 1.2c1 0 2.1-.1 3.1-.1-.1.3-.1.6-.1.9h-1.5c0-.2-.3-.3-.4-.3s-.3.1-.3.2l.7.6v-.1h1.7c.2.3.4.4.7.4.6 0 .9-.7.8-1.6-.1-1.2-.6-1.4-1.8-1.3z" fill="#cfe7e8"></path></g></g></svg>
                                                <div className="h-5 w-[1px] bg-primary opacity-20" />
                                                <MaskedInput
                                                    id="phoneMask"
                                                    type="text"
                                                    placeholder="(966) - __ - ___ - ____"
                                                    className="w-full focus-visible:outline-none"
                                                    mask={['(', '9', '6', '6', ')', '-', /[5]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                                                    value={profileData?.userdata?.phone_number}
                                                    disabled
                                                />
                                            </div>
                                            <div className="flex items-center rounded-md border border-[#dfdfdf] focus-visible:outline-[#004B7A] fill-primary p-2.5 text-sm gap-x-3 w-full mb-3">
                                                <svg id="fi_11502423" enableBackground="new 0 0 512 512" height="22" viewBox="0 0 512 512" width="22" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="m462.88 337.781c0 43.236-35.17 78.351-78.351 78.351h-257.057c-43.181 0-78.352-35.116-78.352-78.351v-163.562c0-14.43 3.951-27.983 10.809-39.615l125.428 125.428c18.765 18.82 43.894 29.19 70.67 29.19 26.721 0 51.85-10.37 70.615-29.19l125.428-125.428c6.859 11.632 10.809 25.184 10.809 39.615v163.562zm-78.352-241.913h-257.056c-17.832 0-34.293 6.035-47.461 16.076l126.69 126.745c13.114 13.058 30.616 20.301 49.326 20.301 18.655 0 36.158-7.243 49.271-20.301l126.69-126.745c-13.167-10.041-29.627-16.076-47.46-16.076zm0-30.232h-257.056c-59.861 0-108.584 48.723-108.584 108.584v163.562c0 59.916 48.723 108.584 108.584 108.584h257.056c59.861 0 108.584-48.668 108.584-108.584v-163.563c0-59.861-48.723-108.583-108.584-108.583z" fillRule="evenodd"></path></svg>
                                                <div className="h-5 w-[1px] bg-primary opacity-20" />
                                                <input id="iconLeft" type="text" placeholder={lang == 'ar' ? 'Email' : 'Email'} className="focus-visible:outline-none w-full font-regular"
                                                    value={email} onChange={(e: any) => {
                                                        setEmail(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center rounded-md border border-[#dfdfdf] focus-visible:outline-[#004B7A] fill-[#004B7A] p-2.5 text-sm gap-x-3 w-full mb-3">
                                                <svg id="fi_2983723" enableBackground="new 0 0 512 512" height="20" viewBox="0 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg"><g><path d="m144 249h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m144 313h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m144 377h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m272 249h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m272 313h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m272 377h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m400 249h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m400 313h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m400 377h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m467 65h-36v-25c0-8.284-6.716-15-15-15s-15 6.716-15 15v25h-130v-25c0-8.284-6.716-15-15-15s-15 6.716-15 15v25h-130v-25c0-8.284-6.716-15-15-15s-15 6.716-15 15v25h-36c-24.813 0-45 20.187-45 45v332c0 24.813 20.187 45 45 45h422c24.813 0 45-20.187 45-45 0-9.682 0-323.575 0-332 0-24.813-20.187-45-45-45zm-437 45c0-8.271 6.729-15 15-15h36v25c0 8.284 6.716 15 15 15s15-6.716 15-15v-25h130v25c0 8.284 6.716 15 15 15s15-6.716 15-15v-25h130v25c0 8.284 6.716 15 15 15s15-6.716 15-15v-25h36c8.271 0 15 6.729 15 15v59h-452zm437 347h-422c-8.271 0-15-6.729-15-15v-243h452v243c0 8.271-6.729 15-15 15z"></path></g></svg>
                                                <div className="h-5 w-[1px] bg-primary opacity-20" />
                                                <input id="iconLeft" type="date" placeholder={lang == 'ar' ? 'Date Of Birth' : 'Date Of Birth'} className="focus-visible:outline-none w-full font-regular"
                                                    value={dateOfBirth}
                                                    onChange={(e: any) => {
                                                        setDateOfBirth(e.target.value)
                                                    }}
                                                    disabled={dateOfBirthDisabled ? true : false}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between gap-x-3 mt-3">
                                                <h6 className="text-sm font-bold">Please select the gender:</h6>
                                                <div className="flex items-center gap-x-3 text-sm">
                                                    <label className="inline-flex items-center gap-x-2 cursor-pointer">
                                                        <input type="radio" name="default_text_color" className="form-radio peer"
                                                            checked={genderStatus == 1 ? true : false} value={1} onChange={(e: any) => {
                                                                setGenderStatus(1)
                                                            }}
                                                        />
                                                        <span className="peer-checked:text-primary">{lang == 'ar' ? 'ذكر' : 'Male'}</span>
                                                    </label>
                                                    <div className="h-5 w-[1px] bg-primary opacity-20" />
                                                    <label className="inline-flex items-center gap-x-2 cursor-pointer">
                                                        <input type="radio" name="default_text_color" className="form-radio text-success" checked={genderStatus == 0 ? true : false} value={0} onChange={(e: any) => {
                                                            setGenderStatus(0)
                                                        }} />
                                                        <span className="peer-checked:text-success">{lang == 'ar' ? 'أنثى' : 'Female'}</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                disabled={loginBtnStatus}
                                                onClick={
                                                    () => {
                                                        setLoginBtnLoading(true)
                                                        updateProfileData()
                                                    }
                                                }
                                                className={`${loginBtnStatus === true ? 'focus-visible:outline-none opacity-30' : "opacity-100"} bg-[#004B7A] border border-[#004B7A] hover:bg-[#00446f] hover:border-[#00446f] text-white w-80 rounded-md p-2.5 text-sm mt-14 font-medium flex items-center justify-center m-auto`}>
                                                {loginBtnLoading ? <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 mr-3 fill-white" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg> : null}
                                                {loginBtnLoading == false ? lang == 'ar' ? 'استمرار' : 'Update' : null}
                                            </button>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>

        </>
    )
}