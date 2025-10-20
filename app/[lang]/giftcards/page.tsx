"use client"; // This is a client component 👈🏽

import Image from 'next/image'
import { useRouter } from 'next-nprogress-bar'
import React, { useEffect, useState, use } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MaskedInput from 'react-text-mask'
import dynamic from 'next/dynamic';
import { useApp } from '@/app/_ctx/AppContext';
import { getUserProfile } from '@/lib/giftcards/giftcards.client';
import { ErrorTracker } from '../utils/errorTracker';

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function GiftCards(
    props: { searchParams: Promise<any> }
) {
    const { deviceType, lang} = useApp();
    const searchParams = use(props.searchParams);
    const router = useRouter()
    const [selectedCard, setSelectedCard] = useState<any>(500);
    const [mySelf, setMySelf] = useState<any>(0);
    const [userName, setUserName] = useState<any>('');
    const [userEmail, setUserEmail] = useState<any>('');
    const [userPhoneNumber, setUserPhoneNumber] = useState<any>('');
    const [receiverName, setReceiverName] = useState<any>('');
    const [receiverEmail, setReceiverEmail] = useState<any>('');
    const [receiverPhoneNumber, setReceiverPhoneNumber] = useState<any>('');

    useEffect(() => {
        if (searchParams?.selected) {
            setSelectedCard(searchParams?.selected)
        }
        checkLogin()
        if (!deviceType){
            router.refresh()
        }
    }, [])



    const checkLogin = async () => {
        try {
            const userId = typeof window !== "undefined" ? localStorage.getItem("userid") : null;
            if (!userId) { router.push(`${origin}/${lang}`); return; }

            const res: any = await getUserProfile();

            localStorage.setItem('eMail', res?.userProfilesData?.user?.email.toString())
            localStorage.setItem('fullName', res?.userProfilesData?.user?.full_name.toString())
            localStorage.setItem('phoneNumber', res?.userProfilesData?.user?.phone_number.toString())
            setUserEmail(localStorage.getItem('eMail'))
            setUserName(localStorage.getItem('fullName'))
            setUserPhoneNumber(localStorage.getItem('phoneNumber'))
        } catch (err) {
            console.error("getUserProfile failed:", err);
            // optional: show toast / set error state
        }
    }


    const MySwal = withReactContent(Swal);
    const topMessageAlartSuccess = (title: any, viewcart: boolean = false) => {
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

    const proceedToBut = () => {
        if (mySelf) {
            if (userName == '' || userEmail == '' || userPhoneNumber == '') {
                ErrorTracker.trackCustomError(
                    lang === 'ar' ? "الرجاء إضافة بيانات الحقول!" : "please add fields data!",
                    'frontend',
                    400,
                    deviceType,
                    'Gift Card Page'
                );
                return topMessageAlartDanger(lang === 'ar' ? "الرجاء إضافة بيانات الحقول!" : "please add fields data!")
            }
        } else {
            if (receiverName == '' || receiverEmail == '' || receiverPhoneNumber == '') {
                ErrorTracker.trackCustomError(
                    lang === 'ar' ? "الرجاء إضافة بيانات الحقول!" : "please add fields data!",
                    'frontend',
                    400,
                    deviceType,
                    'Gift Card Page'
                );
                return topMessageAlartDanger(lang === 'ar' ? "الرجاء إضافة بيانات الحقول!" : "please add fields data!")
            }
        }

        var data: any = {
            username: mySelf ? userName : receiverName,
            useremail: mySelf ? userEmail : receiverEmail,
            userphonenumber: mySelf ? userPhoneNumber : receiverPhoneNumber,
            usermyself: mySelf ? 1 : 0,
            usergiftcard: selectedCard,
        }
        localStorage.setItem('giftcarddata', JSON.stringify(data))
        router.push(`/${lang}/giftcards/buy`);
    }

    return (
        <>
            <MobileHeader type="Third" lang={lang} pageTitle={lang == 'ar' ? 'بطاقات الهدايا' : 'Gift Cards'} />
            <div className="container py-4 max-md:pt-20">
                <div className="md:my-8 mx-auto">
                    <div className="flex items-center gap-x-3 text-base font-semibold w-full">
                        <h2 className="md:w-[480px] w-1/2">{lang === 'ar' ? "الثيم المحدد" : "Selected theme"}</h2>
                        <h3 className="md:w-full md:pl-2 w-1/2 rtl:text-left ltr:text-right">{lang === 'ar' ? "تفاصيل بطاقة الهدايا" : "Gift Card Details"}</h3>
                    </div>
                    <div className="md:flex items-start gap-x-3 mt-3">
                        <div className="md:w-[480px]">
                            <div className="shadow-lg rounded-lg">
                                <Image
                                    src={`/images/${selectedCard}.webp`}
                                    alt="giftCard"
                                    title="Gift Cards"
                                    height={450}
                                    width={450}
                                    className="rounded-md h-auto"
                                />
                            </div>
                        </div>
                        <div className='h-[650px] border border-l border-[#dfdfdf70] hidden md:block'></div>
                        <div className="w-full max-md:mt-4">
                            <div className="mb-3">
                                <h3 className="text-sm font-medium mb-2">{lang === 'ar' ? "الثيم المحدد" : "Selected theme"}</h3>
                                <div className="flex items-center gap-x-3">
                                    <button className={`focus-visible:outline-none p-0.5 md:p-1.5 ${selectedCard == 500 ? 'border-[#004B7A]' : 'border-[#dfdfdf70]'} border rounded-md hover:border-[#004B7A]`}
                                        onClick={(e) => {
                                            setSelectedCard(500)
                                        }}
                                    >
                                        <Image
                                            src="/images/500.webp"
                                            alt="giftCard"
                                            title="Gift Cards"
                                            height={450}
                                            width={450}
                                            loading='lazy'
                                            className="rounded-md"
                                        />
                                    </button>
                                    <button className={`focus-visible:outline-none p-1.5 ${selectedCard == 1000 ? 'border-[#004B7A]' : 'border-[#dfdfdf70]'} border rounded-md hover:border-[#004B7A]`}
                                        onClick={(e) => {
                                            setSelectedCard(1000)
                                        }}
                                    >
                                        <Image
                                            src="/images/1000.webp"
                                            alt="giftCard"
                                            title="Gift Cards"
                                            height={450}
                                            width={450}
                                            loading='lazy'
                                            className="rounded-md"
                                        />
                                    </button>
                                    <button className={`focus-visible:outline-none p-1.5 ${selectedCard == 1500 ? 'border-[#004B7A]' : 'border-[#dfdfdf70]'} border rounded-md hover:border-[#004B7A]`}
                                        onClick={(e) => {
                                            setSelectedCard(1500)
                                        }}
                                    >
                                        <Image
                                            src="/images/1500.webp"
                                            alt="giftCard"
                                            title="Gift Cards"
                                            height={450}
                                            width={450}
                                            loading='lazy'
                                            className="rounded-md"
                                        />
                                    </button>
                                    <button className={`focus-visible:outline-none p-1.5 ${selectedCard == 3000 ? 'border-[#004B7A]' : 'border-[#dfdfdf70]'} border rounded-md hover:border-[#004B7A]`}
                                        onClick={(e) => {
                                            setSelectedCard(3000)
                                        }}
                                    >
                                        <Image
                                            src="/images/3000.webp"
                                            alt="giftCard"
                                            title="Gift Cards"
                                            height={450}
                                            width={450}
                                            loading='lazy'
                                            className="rounded-md"
                                        />
                                    </button>
                                    <button className={`focus-visible:outline-none p-1.5 ${selectedCard == 5000 ? 'border-[#004B7A]' : 'border-[#dfdfdf70]'} border rounded-md hover:border-[#004B7A]`}
                                        onClick={(e) => {
                                            setSelectedCard(5000)
                                        }}
                                    >
                                        <Image
                                            src="/images/5000.webp"
                                            alt="giftCard"
                                            title="Gift Cards"
                                            height={450}
                                            width={450}
                                            loading='lazy'
                                            className="rounded-md"
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className="mb-3">
                                <h3 className="text-sm font-medium mb-2">{lang === 'ar' ? "حدد المبلغ" : "Select amount"}</h3>
                                <div className="flex items-center gap-x-3">
                                    <button
                                        className={`focus-visible:outline-none text-xs font-normal border ${selectedCard == 500 ? 'border-[#004B7A]' : 'border-[#dfdfdf70]'} py-2 px-5 hover:border-[#004B7A] hover:text-[#004B7A] rounded-md bg-white`}
                                        onClick={(e) => {
                                            setSelectedCard(500)
                                        }}
                                    >
                                        500
                                    </button>
                                    <button
                                        className={`focus-visible:outline-none text-xs font-normal border ${selectedCard == 1000 ? 'border-[#004B7A]' : 'border-[#dfdfdf70]'} py-2 px-5 hover:border-[#004B7A] hover:text-[#004B7A] rounded-md bg-white`}
                                        onClick={(e) => {
                                            setSelectedCard(1000)
                                        }}
                                    >
                                        1000
                                    </button>
                                    <button
                                        className={`focus-visible:outline-none text-xs font-normal border ${selectedCard == 1500 ? 'border-[#004B7A]' : 'border-[#dfdfdf70]'} py-2 px-5 hover:border-[#004B7A] hover:text-[#004B7A] rounded-md bg-white`}
                                        onClick={(e) => {
                                            setSelectedCard(1500)
                                        }}
                                    >
                                        1500
                                    </button>
                                    <button
                                        className={`focus-visible:outline-none text-xs font-normal border ${selectedCard == 3000 ? 'border-[#004B7A]' : 'border-[#dfdfdf70]'} py-2 px-5 hover:border-[#004B7A] hover:text-[#004B7A] rounded-md bg-white`}
                                        onClick={(e) => {
                                            setSelectedCard(3000)
                                        }}
                                    >
                                        3000
                                    </button>
                                    <button
                                        className={`focus-visible:outline-none text-xs font-normal border ${selectedCard == 5000 ? 'border-[#004B7A]' : 'border-[#dfdfdf70]'} py-2 px-5 hover:border-[#004B7A] hover:text-[#004B7A] rounded-md bg-white`}
                                        onClick={(e) => {
                                            setSelectedCard(5000)
                                        }}
                                    >
                                        5000
                                    </button>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="mt-3 flex items-center gap-x-2">
                                    <input type="checkbox" id="myself" className="h-4 w-4" onChange={(e) => {
                                        setMySelf(e.target.checked)
                                    }} />
                                    <label className="text-sm font-medium text-[#344054]" htmlFor='myself'>{lang === 'ar' ? 'بشتريها لنفسي' : 'Buying for myself'}</label>
                                </div>
                            </div>
                            <div className='w-full border border-[#dfdfdf70] my-2'></div>
                            <form className="">
                                <div className=''>
                                    <label className="text-sm font-medium text-[#344054]">{lang == 'ar' ? 'الاسم بالكامل' : `Receiver's Name`}</label>
                                    <div className="border border-[#dfdfdf70] focus-visible:outline-none hover:border-[#004B7A] bg-white rounded p-2">
                                        <div className="flex items-center gap-3 fill-[#004B7A]">
                                            <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" id="fi_9308008"><g><path d="m12 12.75c-3.17 0-5.75-2.58-5.75-5.75s2.58-5.75 5.75-5.75 5.75 2.58 5.75 5.75-2.58 5.75-5.75 5.75zm0-10c-2.34 0-4.25 1.91-4.25 4.25s1.91 4.25 4.25 4.25 4.25-1.91 4.25-4.25-1.91-4.25-4.25-4.25z"></path><path d="m20.5901 22.75c-.41 0-.75-.34-.75-.75 0-3.45-3.5199-6.25-7.8399-6.25-4.32005 0-7.84004 2.8-7.84004 6.25 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-4.27 4.18999-7.75 9.34004-7.75 5.15 0 9.3399 3.48 9.3399 7.75 0 .41-.34.75-.75.75z"></path></g></svg>
                                            <input id="iconLeft" type="text" placeholder={lang == 'ar' ? 'الاسم بالكامل' : 'Full Name'} className="text-xs focus-visible:outline-none w-full" value={mySelf ? userName : receiverName} onChange={(e) => {
                                                setReceiverName(e.target.value)
                                            }}
                                                disabled={mySelf}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <label className="text-sm font-medium text-[#344054]">{lang == 'ar' ? 'بريد إلكتروني' : `Receiver's E-mail`}</label>
                                    <div className="border border-[#dfdfdf70] focus-visible:outline-none hover:border-[#004B7A] bg-white rounded p-2">
                                        <div className="flex items-center gap-3 fill-[#004B7A]">
                                            <svg id="fi_2549872" height="22" viewBox="0 0 125 125" width="22" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m105.182 97.82h-85.364a10.477 10.477 0 0 1 -10.465-10.466v-52.72a10.477 10.477 0 0 1 10.465-10.466h85.364a10.477 10.477 0 0 1 10.465 10.466v52.72a10.477 10.477 0 0 1 -10.465 10.466zm-85.364-69.652a6.472 6.472 0 0 0 -6.465 6.466v52.72a6.472 6.472 0 0 0 6.465 6.466h85.364a6.472 6.472 0 0 0 6.465-6.466v-52.72a6.472 6.472 0 0 0 -6.465-6.466z"></path><path d="m62.5 72.764a2 2 0 0 1 -1.324-.5l-48.2-42.548 2.647-3 46.877 41.384 46.879-41.379 2.647 3-48.2 42.548a1.994 1.994 0 0 1 -1.326.495z"></path><path d="m5.012 72.393h49.061v4h-49.061z" transform="matrix(.66 -.752 .752 .66 -45.859 47.529)"></path><path d="m93.454 49.862h4v49.062h-4z" transform="matrix(.752 -.66 .66 .752 -25.361 81.43)"></path></svg>
                                            <input id="iconLeft" type="text" placeholder={lang == 'ar' ? 'بريد إلكتروني' : 'E-mail'} className="text-xs focus-visible:outline-none w-full" value={mySelf ? userEmail : receiverEmail} onChange={(e) => {
                                                setReceiverEmail(e.target.value)
                                            }}
                                                disabled={mySelf}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <label className="text-sm font-medium text-[#344054]">{lang == 'ar' ? 'رقم التليفون' : `Receiver's Phone Number`}</label>
                                    <div className="border border-[#dfdfdf70] focus-visible:outline-none hover:border-[#004B7A] bg-white rounded p-2">
                                        <div className="flex items-center gap-3 fill-[#004B7A]">
                                            <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg" id="fi_3059407"><g id="Layer_3" data-name="Layer 3"><path d="m30.035 22.594c-.053-.044-6.042-4.33-7.667-4.049-.781.138-1.228.67-2.123 1.737-.144.172-.491.583-.759.876a12.458 12.458 0 0 1 -1.651-.672 13.7 13.7 0 0 1 -6.321-6.321 12.458 12.458 0 0 1 -.672-1.651c.294-.269.706-.616.882-.764 1.061-.89 1.593-1.337 1.731-2.119.283-1.619-4.005-7.613-4.049-7.667a2.289 2.289 0 0 0 -1.706-.964c-1.738 0-6.7 6.436-6.7 7.521 0 .063.091 6.467 7.988 14.5 8.024 7.888 14.428 7.979 14.491 7.979 1.085 0 7.521-4.962 7.521-6.7a2.287 2.287 0 0 0 -.965-1.706zm-6.666 6.4c-.874-.072-6.248-.781-12.967-7.382-6.635-6.755-7.326-12.144-7.395-12.979a27.054 27.054 0 0 1 4.706-5.561c.04.04.093.1.161.178a35.391 35.391 0 0 1 3.574 6.063 11.886 11.886 0 0 1 -1.016.911 10.033 10.033 0 0 0 -1.512 1.422l-.243.34.072.411a11.418 11.418 0 0 0 .965 2.641 15.71 15.71 0 0 0 7.248 7.247 11.389 11.389 0 0 0 2.641.966l.411.072.34-.243a10.117 10.117 0 0 0 1.428-1.518c.313-.374.732-.873.89-1.014a35.163 35.163 0 0 1 6.078 3.578c.083.07.141.124.18.159a27.031 27.031 0 0 1 -5.561 4.707z"></path></g></svg>
                                            <MaskedInput
                                                id="phoneMask"
                                                type='tel'
                                                placeholder="(966) - __ - ___ - ____"
                                                className="text-xs focus-visible:outline-none w-full"
                                                mask={['(', '9', '6', '6', ')', '-', /[5]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                                                onChange={(e: any) => {
                                                    setReceiverPhoneNumber(e.target.value)
                                                }}
                                                value={mySelf ? '966-' + userPhoneNumber : receiverPhoneNumber}
                                                disabled={mySelf}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="fill-[#5D686F90] flex items-center gap-1 mt-1 text-[#5D686F90]">
                                <svg height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg" id="fi_9446643"><g><path d="m12.75 11c0-.4142-.3358-.75-.75-.75s-.75.3358-.75.75v6c0 .4142.3358.75.75.75s.75-.3358.75-.75z"></path><path clipRule="evenodd" d="m12 1.25c-5.93706 0-10.75 4.81294-10.75 10.75 0 5.9371 4.81294 10.75 10.75 10.75 5.9371 0 10.75-4.8129 10.75-10.75 0-5.93706-4.8129-10.75-10.75-10.75zm-9.25 10.75c0-5.10863 4.14137-9.25 9.25-9.25 5.1086 0 9.25 4.14137 9.25 9.25 0 5.1086-4.1414 9.25-9.25 9.25-5.10863 0-9.25-4.1414-9.25-9.25z" fillRule="evenodd"></path><path d="m13 8c0 .55228-.4477 1-1 1s-1-.44772-1-1 .4477-1 1-1 1 .44772 1 1z"></path></g></svg>
                                <label className="text-[11px]">{lang === 'ar' ? "بطاقات الهدايا صالحة لمدة عام واحد من تاريخ الشراء" : "Gift Cards are valid for 1 year from the date of purchase"}</label>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
                <div className="fixed bottom-[0px] w-full p-3 bg-white shadow-md border-t border-[#5D686F26]">
                    <button
                        onClick={(e) => { proceedToBut() }}
                        className="focus-visible:outline-none btn border border-[#004B7A] bg-[#004B7A] p-2.5 rounded-md w-full text-white fill-white flex items-center justify-center font-medium gap-x-2">
                        {lang === 'ar' ? 'الشروع في الشراء' : 'Proceed to Buy'}
                    </button>
                </div>
                
        </>
    )
}
