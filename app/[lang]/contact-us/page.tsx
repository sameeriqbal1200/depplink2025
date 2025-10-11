"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import MaskedInput from 'react-text-mask';
import dynamic from 'next/dynamic';
import { useApp } from '@/app/_ctx/AppContext';
import { getContactUserProfileData, postContactUsData } from '@/lib/footerpages/contact-us.client';
import { useRouter } from 'next-nprogress-bar';
import { ErrorTracker } from '../utils/errorTracker';

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function ContactUs() {
    const router = useRouter();
    const { t, lang, deviceType, origin } = useApp();
    const [fullName, setfullName] = useState('');
    const [email, setemail] = useState('');
    const [phoneNumber, setphoneNumber] = useState('');
    const [notes, setnotes] = useState('');
    const [fullNameError, setfullNameError] = useState(false);
    const [emailError, setemailError] = useState(false);
    const [phoneNumberError, setphoneNumberError] = useState(false);
    const [notesError, setnotesError] = useState(false);
    const [Message, setMessage] = useState('');
    const [reason, setreason] = useState('');
    const [complain, setcomplain] = useState('');
    const [loading, setloading] = useState(false);

    useEffect(() => {
        getUser()
    }, [])

    const MySwal = withReactContent(Swal);
    const topMessageAlartSuccess = (title: any) => {
        MySwal.fire({
            icon: "success",
            title: title,
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
            title: title,
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

    const checkLoginPhoneNumber: any = (value: any) => {
        let phone = value.replace('(966)-', '');
        phone = phone.replace(/[^0-9\.]+/g, '')
        if (phone.length == 9) {
            setphoneNumber(phone)
        }
    }

    const handleOnChange = (e: any) => {
        setemail(e.target.value);
    }

    const getUser = async () => {
        try {
            const userId = typeof window !== "undefined" ? localStorage.getItem("userid") : null;
            if (!userId) { router.push(`${origin}/${lang}`); return; }

            const res: any = await getContactUserProfileData();
            setfullName(res?.userData?.user?.full_name)
            setemail(res?.userData?.user?.email)
            setphoneNumber(res?.userData?.user?.phone_number)

        } catch (err) {
            console.error("getUserProfile failed:", err);
            // optional: show toast / set error state
        }
    }

    const submitData = async () => {
        try {
            const data = {
                full_name: fullName,
                email: email,
                phone_number: phoneNumber,
                notes: notes,
                reason: reason,
                complain: complain
            }

            if (!fullName || !email || !phoneNumber || !notes) {
                const regEx: any = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
                topMessageAlartDanger(t('contactUsDataRequired'))
                ErrorTracker.trackCustomError(
                    t('contactUsDataRequired'),
                    'frontend',
                    400,
                    deviceType,
                    'Contact-us Page'
                );
                if (!fullName) {
                    setfullNameError(true)
                    setTimeout(function () {
                        setfullNameError(false)
                    }, 3000)
                }

                if (!regEx.test(email) && email !== "") {
                    setMessage("Please enter valid email");
                    ErrorTracker.trackCustomError(
                        "Please enter valid email",
                        'frontend',
                        400,
                        deviceType,
                        'Contact-us Page'
                    );
                    setTimeout(function () {
                        setMessage('')
                    }, 3000)
                }
                if (!email) {
                    setemailError(true)
                    setTimeout(function () {
                        setemailError(false)
                    }, 3000)
                }
                if (!phoneNumber) {
                    setphoneNumberError(true)
                    setTimeout(function () {
                        setphoneNumberError(false)
                    }, 3000)
                }
                if (!notes) {
                    setnotesError(true)
                    setTimeout(function () {
                        setnotesError(false)
                    }, 3000)
                }
                return false
            }
            setloading(true)
            const res = await postContactUsData(data);
            if (res?.contactUsFormData?.success === true) {
                setloading(false)
                topMessageAlartSuccess(t('contactUsSuccess'))
                if (!localStorage.getItem("userid")) {
                    setfullName('')
                    setemail('')
                    setphoneNumber('')
                }
                setreason('')
                setcomplain('')
                setnotes('')
            } else {
                setloading(false)
                topMessageAlartDanger(t('somethingwentwrong'))
            }
        } catch (e) {
            console.error("updateProfileData failed:", e);
            topMessageAlartDanger(lang === "ar" ? "حدث خطأ غير متوقع" : "Unexpected error");
        }
    }

    return (
        <>
            <MobileHeader type="Third" lang={lang} pageTitle={lang == 'ar' ? 'تواصل معنا' : 'Contact Us'} />
            <div className="container py-16 md:py-4">
                <div className="mb-6 md:my-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="">
                            <h1 className=" font-semibold text-xl hidden md:block">{lang == 'ar' ? 'تـواصـل مـعـنــا' : 'Contact Us'}</h1>
                            <p className='text-[#5D686F] text-xs mb-3'>{lang == 'ar' ? 'يرجي ادخال واكمال البيانات التالية والضغط علي ارسال وسيتم التواصل معك في اقرب وقت' : 'Please enter and complete the following information and click submit and we will contact you as soon as possible'}</p>
                            <div className='mb-2'>
                                <label className="text-sm font-medium text-[#344054]">{lang == 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                                <div className={`border border-[#${fullNameError ? 'dc4e4e' : '004B7A'}] focus-visible:outline-none hover:border-primary bg-white rounded p-3`}>
                                    <div className="flex items-center gap-3 fill-[#004B7A]">
                                        <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" id="fi_9308008"><g><path d="m12 12.75c-3.17 0-5.75-2.58-5.75-5.75s2.58-5.75 5.75-5.75 5.75 2.58 5.75 5.75-2.58 5.75-5.75 5.75zm0-10c-2.34 0-4.25 1.91-4.25 4.25s1.91 4.25 4.25 4.25 4.25-1.91 4.25-4.25-1.91-4.25-4.25-4.25z"></path><path d="m20.5901 22.75c-.41 0-.75-.34-.75-.75 0-3.45-3.5199-6.25-7.8399-6.25-4.32005 0-7.84004 2.8-7.84004 6.25 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-4.27 4.18999-7.75 9.34004-7.75 5.15 0 9.3399 3.48 9.3399 7.75 0 .41-.34.75-.75.75z"></path></g></svg>
                                        <input id="iconLeft" type="text" placeholder={lang == 'ar' ? 'الاسم بالكامل' : 'Full Name'} className="text-sm focus-visible:outline-none w-full"
                                            onChange={(e: any) => {
                                                setfullName(e.target?.value)
                                            }}
                                            value={fullName}
                                        />
                                    </div>
                                </div>
                                {fullNameError ? (
                                    <label
                                        htmlFor="invalid"
                                        className="text-sm font-medium text-[#dc4e4e]"
                                    >
                                        {lang == 'ar' ? 'يرجى إضافة الاسم' : 'Please fill name'}
                                    </label>
                                ) : null}
                            </div>
                            <div className='mb-2'>
                                <label className="text-sm font-medium text-[#344054]">{lang == 'ar' ? 'بريد إلكتروني' : 'E-mail'}</label>
                                <div className={`border border-[#${emailError ? 'dc4e4e' : '004B7A'}] focus-visible:outline-none hover:border-primary bg-white rounded p-3`}>
                                    <div className="flex items-center gap-3 fill-[#004B7A]">
                                        <svg id="fi_2549872" height="22" viewBox="0 0 125 125" width="22" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m105.182 97.82h-85.364a10.477 10.477 0 0 1 -10.465-10.466v-52.72a10.477 10.477 0 0 1 10.465-10.466h85.364a10.477 10.477 0 0 1 10.465 10.466v52.72a10.477 10.477 0 0 1 -10.465 10.466zm-85.364-69.652a6.472 6.472 0 0 0 -6.465 6.466v52.72a6.472 6.472 0 0 0 6.465 6.466h85.364a6.472 6.472 0 0 0 6.465-6.466v-52.72a6.472 6.472 0 0 0 -6.465-6.466z"></path><path d="m62.5 72.764a2 2 0 0 1 -1.324-.5l-48.2-42.548 2.647-3 46.877 41.384 46.879-41.379 2.647 3-48.2 42.548a1.994 1.994 0 0 1 -1.326.495z"></path><path d="m5.012 72.393h49.061v4h-49.061z" transform="matrix(.66 -.752 .752 .66 -45.859 47.529)"></path><path d="m93.454 49.862h4v49.062h-4z" transform="matrix(.752 -.66 .66 .752 -25.361 81.43)"></path></svg>
                                        <input id="iconLeft" type="mail" placeholder={lang == 'ar' ? 'بريد إلكتروني' : 'E-mail'} className="text-sm focus-visible:outline-none w-full"
                                            onChange={handleOnChange}
                                            value={email}
                                        />
                                    </div>
                                </div>
                                {emailError ? (
                                    <label
                                        htmlFor="invalid"
                                        className="text-sm font-medium text-[#dc4e4e]"
                                    >
                                        {lang == 'ar' ? 'يرجى إضافة البريد الإلكتروني' : 'Please fill email'}
                                    </label>
                                ) : null}
                                <label
                                    htmlFor="invalid"
                                    className="text-sm font-medium text-[#dc4e4e]"
                                >
                                    {Message}
                                </label>
                            </div>
                            <div className='mb-2'>
                                <label className="text-sm font-medium text-[#344054]">{lang == 'ar' ? 'رقم التليفون' : 'Phone Number'}</label>
                                <div className={`border border-[#${phoneNumberError ? 'dc4e4e' : '004B7A'}] focus-visible:outline-none hover:border-primary bg-white rounded p-3`}>
                                    <div className="flex items-center gap-3 fill-[#004B7A]">
                                        <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg" id="fi_3059407"><g id="Layer_3" data-name="Layer 3"><path d="m30.035 22.594c-.053-.044-6.042-4.33-7.667-4.049-.781.138-1.228.67-2.123 1.737-.144.172-.491.583-.759.876a12.458 12.458 0 0 1 -1.651-.672 13.7 13.7 0 0 1 -6.321-6.321 12.458 12.458 0 0 1 -.672-1.651c.294-.269.706-.616.882-.764 1.061-.89 1.593-1.337 1.731-2.119.283-1.619-4.005-7.613-4.049-7.667a2.289 2.289 0 0 0 -1.706-.964c-1.738 0-6.7 6.436-6.7 7.521 0 .063.091 6.467 7.988 14.5 8.024 7.888 14.428 7.979 14.491 7.979 1.085 0 7.521-4.962 7.521-6.7a2.287 2.287 0 0 0 -.965-1.706zm-6.666 6.4c-.874-.072-6.248-.781-12.967-7.382-6.635-6.755-7.326-12.144-7.395-12.979a27.054 27.054 0 0 1 4.706-5.561c.04.04.093.1.161.178a35.391 35.391 0 0 1 3.574 6.063 11.886 11.886 0 0 1 -1.016.911 10.033 10.033 0 0 0 -1.512 1.422l-.243.34.072.411a11.418 11.418 0 0 0 .965 2.641 15.71 15.71 0 0 0 7.248 7.247 11.389 11.389 0 0 0 2.641.966l.411.072.34-.243a10.117 10.117 0 0 0 1.428-1.518c.313-.374.732-.873.89-1.014a35.163 35.163 0 0 1 6.078 3.578c.083.07.141.124.18.159a27.031 27.031 0 0 1 -5.561 4.707z"></path></g></svg>
                                        <MaskedInput
                                            id="phoneMask"
                                            type="text"
                                            placeholder="(966) - __ - ___ - ____"
                                            className="w-full focus-visible:outline-none"
                                            mask={['(', '9', '6', '6', ')', '-', /[5]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                                            onChange={(e: any) => {
                                                setphoneNumber(e.target.value)
                                                checkLoginPhoneNumber(e.target.value)
                                            }}
                                            value={phoneNumber}
                                        />
                                    </div>
                                </div>
                                {phoneNumberError ? (
                                    <label htmlFor="invalid" className="text-sm font-medium text-[#dc4e4e]">
                                        {lang == 'ar' ? 'يرجى إضافة رقم الجوال' : 'Please fill phone number'}
                                    </label>
                                ) : null}
                            </div>
                            <div className='mb-2'>
                                <label className="text-sm font-medium text-[#344054]">{lang == 'ar' ? 'نوع الشكوى' : 'Subject'}</label>
                                <div className={`border border-[#004B7A] focus-visible:outline-none hover:border-primary bg-white rounded p-3`}>
                                    <div className="flex items-center gap-3 fill-[#004B7A]">
                                        <input id="iconLeft" type="text" placeholder={lang == 'ar' ? 'نوع الشكوى' : 'Subject'} className="text-sm focus-visible:outline-none w-full"
                                            onChange={(e: any) => {
                                                setreason(e.target?.value)
                                            }}
                                            value={reason}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='mb-2'>
                                <label className="text-sm font-medium text-[#344054]">{lang == 'ar' ? 'تفاصيل الشكوى' : 'Details'}</label>
                                <div className={`border border-[#004B7A] focus-visible:outline-none hover:border-primary bg-white rounded p-3`}>
                                    <div className="flex items-center gap-3 fill-[#004B7A]">
                                        <input id="iconLeft" type="text" placeholder={lang == 'ar' ? 'تفاصيل الشكوى' : 'Details'} className="text-sm focus-visible:outline-none w-full"
                                            onChange={(e: any) => {
                                                setcomplain(e.target?.value)
                                            }}
                                            value={complain}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='mb-2'>
                                <label className="text-sm font-medium text-[#344054]">{lang == 'ar' ? 'رقم الهاتف' : 'Note'}</label>
                                <div className={`border border-[#${notesError ? 'dc4e4e' : '004B7A'}] focus-visible:outline-none hover:border-primary bg-white rounded p-3`}>
                                    <div className="flex items-start gap-3 fill-[#004B7A]">
                                        <svg id="fi_3253339" enableBackground="new 0 0 512 512" height="20" viewBox="0 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg"><g><path d="m391.99 512h-317c-12.407 0-22.5-10.093-22.5-22.5v-7.5h-7.5c-12.407 0-22.5-10.093-22.5-22.5v-225c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5v225c0 4.136 3.365 7.5 7.5 7.5h317c4.136 0 7.5-3.364 7.5-7.5v-168.665l-25.797-74.098c-1.088-3.125-1.64-6.387-1.64-9.694v-56.083c0-6.077 3.708-11.295 9.448-13.293 5.738-2 11.886-.212 15.662 4.552l2.327 2.937v-122.656c0-4.136-3.364-7.5-7.5-7.5h-317c-4.135 0-7.5 3.364-7.5 7.5v182c0 4.142-3.358 7.5-7.5 7.5s-7.5-3.358-7.5-7.5v-182c0-12.407 10.093-22.5 22.5-22.5h317c12.407 0 22.5 10.093 22.5 22.5v7.5h7.5c12.407 0 22.5 10.093 22.5 22.5v106.841c0 4.142-3.358 7.5-7.5 7.5s-7.5-3.358-7.5-7.5v-106.841c0-4.136-3.364-7.5-7.5-7.5h-7.5v119.087l17.501 22.089c2.055 2.594 3.648 5.493 4.735 8.616l81.859 235.13c4.186 12.023-6.207 25.808-24.174 32.063s-34.672 1.905-38.859-10.119l-11.062-31.775v69.409c0 12.407-10.093 22.5-22.5 22.5zm-324.5-30v7.5c0 4.136 3.365 7.5 7.5 7.5h317c4.136 0 7.5-3.364 7.5-7.5v-112.494l-15-43.085v125.579c0 12.407-10.093 22.5-22.5 22.5zm292.869-263.016 79.36 227.951c.7 2.009 8.49 4.808 19.762.884 11.271-3.924 15.64-10.956 14.94-12.966l-79.36-227.951zm-3.305-29.502v14.77l31.448-10.948-9.172-11.576zm0-35.869v19.987l12.412-4.321zm-40.064 268.387h-227c-4.142 0-7.5-3.358-7.5-7.5s3.358-7.5 7.5-7.5h227c4.142 0 7.5 3.358 7.5 7.5s-3.358 7.5-7.5 7.5zm0-45h-227c-4.142 0-7.5-3.358-7.5-7.5s3.358-7.5 7.5-7.5h227c4.142 0 7.5 3.358 7.5 7.5s-3.358 7.5-7.5 7.5zm0-45h-227c-4.142 0-7.5-3.358-7.5-7.5s3.358-7.5 7.5-7.5h227c4.142 0 7.5 3.358 7.5 7.5s-3.358 7.5-7.5 7.5zm-20-45h-207c-4.142 0-7.5-3.358-7.5-7.5s3.358-7.5 7.5-7.5h207c4.142 0 7.5 3.358 7.5 7.5s-3.358 7.5-7.5 7.5zm20-45h-227c-4.142 0-7.5-3.358-7.5-7.5s3.358-7.5 7.5-7.5h227c4.142 0 7.5 3.358 7.5 7.5s-3.358 7.5-7.5 7.5zm0-45h-227c-4.142 0-7.5-3.358-7.5-7.5s3.358-7.5 7.5-7.5h227c4.142 0 7.5 3.358 7.5 7.5s-3.358 7.5-7.5 7.5zm-227-45c-4.131 0-7.486-3.341-7.5-7.475-.014-4.142 3.333-7.511 7.475-7.525l149-.5c4.172-.018 7.511 3.333 7.525 7.475s-3.333 7.511-7.475 7.525l-149 .5c-.008 0-.017 0-.025 0zm187.475-75h-147.95c-4.142 0-7.5-3.358-7.5-7.5s3.358-7.5 7.5-7.5h147.95c4.142 0 7.5 3.358 7.5 7.5s-3.358 7.5-7.5 7.5z"></path></g></svg>
                                        <textarea placeholder={lang == 'ar' ? 'رقم الهاتف' : 'Note'} rows={3} wrap="soft" className="focus-visible:outline-none text-sm w-full" value={notes} id="message2" onChange={(e: any) => setnotes(e.target.value)}></textarea>
                                    </div>
                                </div>
                                {notesError ? (
                                    <label
                                        htmlFor="invalid"
                                        className="text-sm font-medium text-[#dc4e4e]"
                                    >
                                        {lang == 'ar' ? 'يرجى إضافة الملاحظات' : 'Please fill notes'}
                                    </label>
                                ) : null}
                            </div>
                        </div>
                        <Image alt={lang == 'ar' ? 'تـواصـل مـعـنــا' : 'Contact Us'} title={lang == 'ar' ? 'تـواصـل مـعـنــا' : 'Contact Us'} src="/images/ContactUs.jpeg" width={0} height={0} className="w-full h-auto hidden md:block" />
                    </div>
                    <h2 className="text-base mb-2 font-semibold mt-8">{lang == 'ar' ? 'بيـانـات التواصــل ومــعلومـــات الموقع' : 'Contact Information'}</h2>
                    <div className="bg-white p-3 boder rounded-md shadow-md">
                        <div className="flex items-center gap-2 mb-2">
                            <label className="font-semibold text-xs md:w-1/12">{lang == 'ar' ? 'البريد الالكتروني:' : 'E-mail:'}</label>
                            <Link href="mailto:contact@tamkeenstores.com.sa" className="text-xs font-semibold underline">contact@tamkeenstores.com.sa</Link>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <label className="font-semibold text-xs md:w-1/12">{lang == 'ar' ? 'رقم التليفون:' : 'Phone Number:'}</label>
                            <Link href="tel:8002444464" className="text-xs font-semibold underline">8002444464</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 w-full px-4 py-3 bg-white shadow-md border-t border-[#5D686F26]">
                <button onClick={() => { submitData() }} disabled={loading} className="focus-visible:outline-none btn border border-[#004B7A] bg-[#004B7A] p-2.5 rounded-md w-full text-white fill-white font-medium">
                    {loading ?
                        <>
                            {lang == 'ar' ? 'تحميل...' : 'Loading...'}
                        </>
                        :
                        <>
                            {lang == 'ar' ? 'ارسال' : 'Send'}
                        </>
                    }
                </button>
            </div>
        </>
    )
}
