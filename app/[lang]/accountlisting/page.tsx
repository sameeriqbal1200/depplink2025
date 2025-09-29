"use client"; // This is a client component 👈🏽

import React, { useEffect, useState, Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image';
import dynamic from 'next/dynamic'
import { useRouter, usePathname } from 'next/navigation'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { useApp } from '@/app/_ctx/AppContext';
import { getUserProfileData } from '@/lib/accounts/profile.client';
import { postDeleteUser } from '@/lib/accountListing/accountListing.client';

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function AccountListing() {
    const { t, lang, origin } = useApp();
    const path = usePathname()
    const router = useRouter()
    const [firstWord, setFirstWord] = useState<any>(false)
    const [secondWord, setSecondWord] = useState<any>(false)
    const [userid, setUserid] = useState<any>(false)
    const [confirmationPopup, setConfirmationPopup] = useState<any>(false)
    const [fullName, setfullName] = useState('')

    useEffect(() => {
        getUser()
        UserDataLocalStorage()
    }, [])
    // useEffect(() => {
    //     const loyaltyPointsDB: any = loyaltyData?.t_loyaltypoints || 0;
    //     const loyaltyAmount = loyaltyPointsDB / 100;
    //     setloyaltyPoints(loyaltyPointsDB)
    //     setloyaltyAmount(loyaltyAmount)
    // }, [loyaltyData])

    const getUser: any = () => {
        if (localStorage.getItem("userid")) {
            setUserid(localStorage.getItem("userid"))
        }
    }

    const UserDataLocalStorage = async () => {
        try {
            if (typeof window === "undefined") return;
            const userId = localStorage.getItem("userid");
            if (!userId) return;

            const res: any = await getUserProfileData();
            const u = res?.profileDataCore?.userdata ?? {};

            const fullName =
                (u.full_name ?? `${u.first_name ?? ""} ${u.last_name ?? ""}`)
                    .trim()
                    .replace(/\s+/g, " ");

            setfullName(fullName);

            const parts = fullName.split(" ").filter(Boolean);
            const firstInitial = parts[0]?.charAt(0) ?? "";
            const secondInitial = (parts.length > 1 ? parts[parts.length - 1] : parts[0])?.charAt(0) ?? "";

            if (firstInitial) setFirstWord(firstInitial);
            if (secondInitial) setSecondWord(secondInitial);

            // Optional cache
            localStorage.setItem("fullName", fullName);
            localStorage.setItem("initials", `${firstInitial}${secondInitial}`);
        } catch (e) {
            console.error("userDataLocalStorage failed:", e);
        }
    };

    const deleteUser = async () => {
        try {
            if (typeof window === "undefined") return;
            const userId = localStorage.getItem("userid");
            if (!userId) { router.push(`${origin}/${lang}`); return; }

            const res: any = await postDeleteUser({ user_id: userId });

            if (res?.deleteUserData?.success) {
                setConfirmationPopup(false);
                topMessageAlartDanger(lang === "ar" ? "لقد تم حذف حسابك!" : "Your account has been deleted!");
                await handleLogout?.(); // ensure this clears auth/localStorage & redirects
            } else {
                setConfirmationPopup(false);
                topMessageAlartDanger(
                    res?.deleteUserData?.message || (lang === "ar" ? "حدث خطأ، حاول لاحقًا." : "Error! Something went wrong!")
                );
            }
        } catch (e) {
            console.error("deleteUser failed:", e);
            setConfirmationPopup(false);
            topMessageAlartDanger(lang === "ar" ? "حدث خطأ غير متوقع" : "Unexpected error");
        }
    };


    const handleLogout = () => {
        localStorage.removeItem("userid")
        localStorage.removeItem('eMail')
        localStorage.removeItem('fullName')
        localStorage.removeItem('phoneNumber')
        localStorage.removeItem('loyaltyCount')
        localStorage.removeItem('compareCount')
        localStorage.removeItem('wishlistCount')
        localStorage.removeItem('orderCount')
        localStorage.removeItem('userWishlist')
        setUserid(false)
        UserDataLocalStorage()
        router.push(path + '?refresh=' + Math.random(), { scroll: false })
        router.refresh()
    };

    const MySwal = withReactContent(Swal);

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

    return (
        <>
            <MobileHeader type="Third" lang={lang} pageTitle={lang === 'ar' ? 'حساب تعريفي' : 'Profile'} />
            <div className="py-16 md:py-4">
                <div className="container">
                    {userid ? (
                        <Link
                            href={`${origin}/${lang}/account/profile`}
                            className="bg-white shadow-md rounded-md p-3 flex items-center gap-3"
                        >
                            <div className="w-14 h-14 rounded-full border-2 border-[#219EBC] flex justify-center items-center bg-[#219EBC]">
                            <p className="text-white font-bold">{firstWord} {secondWord}</p>
                            </div>

                            <div>
                            <label className="text-sm font-medium">
                                {lang === "ar" ? "مرحباً" : "Welcome"}
                            </label>
                            <h1 className="text-base font-semibold text-[#004B7A]">
                                {userid && fullName !== "" ? fullName : t("header?.loginSignup")}
                            </h1>
                            </div>
                        </Link>
                        ) : (
                        <Link
                            href={`${origin}/${lang}/login`}
                            className="bg-white shadow-md rounded-md p-3 flex items-center gap-3"
                        >
                            <svg
                            height="26"
                            width="26"
                            version="1.1"
                            id="fi_709579"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            viewBox="0 0 512 512"
                            enableBackground="new 0 0 512 512"
                            >
                            <path d="M256,288.389c-153.837,0-238.56,72.776-238.56,204.925c0,10.321,8.365,18.686,18.686,18.686h439.747
                                c10.321,0,18.686-8.365,18.686-18.686C494.56,361.172,409.837,288.389,256,288.389z M55.492,474.628
                                c7.35-98.806,74.713-148.866,200.508-148.866s193.159,50.06,200.515,148.866H55.492z"></path>
                            <path d="M256,0c-70.665,0-123.951,54.358-123.951,126.437c0,74.19,55.604,134.54,123.951,134.54s123.951-60.35,123.951-134.534
                                C379.951,54.358,326.665,0,256,0z M256,223.611c-47.743,0-86.579-43.589-86.579-97.168c0-51.611,36.413-89.071,86.579-89.071
                                c49.363,0,86.579,38.288,86.579,89.071C342.579,180.022,303.743,223.611,256,223.611z"></path>
                            </svg>

                            <div>
                            <label className="text-sm font-medium">
                                {lang === "ar" ? "مرحباً" : "Welcome"}
                            </label>
                            <div className="text-sm underline font-semibold text-primary">
                                {lang === "ar" ? "Login" : "Sign In / Sign Up"}
                            </div>
                            </div>
                        </Link>
                        )}

                </div>
                <div className="mt-2 bg-white pb-32">
                    {/* <Link href={`${origin}/${lang}/account/loyaltyusagehistory`} className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]">
                    <div className="flex items-center gap-x-2">
                        <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width={23} fill="#004B7A"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0 0h48v48H0z" fill="none"></path> <g id="Shopicon"> <path d="M40,14h-8V4L4,14v26c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4V18C44,15.8,42.2,14,40,14z M36,29c0,1.105-0.895,2-2,2 c-1.105,0-2-0.895-2-2c0-1.105,0.895-2,2-2C35.105,27,36,27.895,36,29z M28,9.676V14H15.893L28,9.676z"></path> </g> </g></svg>
                        <h2 className="text-sm font-semibold">
                            {
                                <>
                                {lang === 'ar' ? "لديك" : "You have"} {" "}
                                {/* <span className="h-3.5 font-bold text-blue-500 number-animation items-center"> */}
                    {/* <span className="h-3.5 font-bold text-blue-500 items-center">
                                {/* <span className="font-bold text-blue-500 inline-flex items-center h-full">{parseInt(loyaltyAmount)?.toLocaleString('EN-US')}</span> */}
                    {/* <span className="font-bold text-blue-500 inline-flex items-center h-full">{parseInt(loyaltyPoints)?.toLocaleString('EN-US')}</span>
                                </span> {lang === 'ar' ? "في محفظتك." : "in your wallet."}  */}
                    {/* </> */}
                    {/* } */}
                    {/* </h2>
                    </div>
                    <svg height="26" viewBox="0 0 24 24" width="26" className="rotate-180" xmlns="http://www.w3.org/2000/svg" id="fi_2722991"><g id="_17" data-name="17"><path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z"></path></g></svg> */}
                    {/* // </Link>  */}
                    <Link prefetch={false} scroll={false} href={`${origin}/${lang}/account/wishlist`} className="border-b border-[#9CA4AB50] px-4 py-3 align__center text-[#004B7A] fill-[#004B7A]">
                        <div className="flex items-center gap-x-2">
                            <svg
                                width="26"
                                height="26"
                                viewBox="0 0 22 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M19.9315 6.12525C19.3836 5.25647 18.5812 4.57773 17.6336 4.18153C16.5598 3.73084 15.3538 3.64971 14.146 3.94751C13.0392 4.22045 11.9612 4.81243 10.9992 5.67119C10.0371 4.81235 8.95889 4.22034 7.85193 3.94744C6.6441 3.64952 5.43803 3.73072 4.36431 4.18172C3.41667 4.57804 2.61428 5.25691 2.06649 6.12582C1.4928 7.03272 1.20096 8.13558 1.2225 9.31507C1.31814 14.5586 9.129 19.3267 10.6938 20.2294C10.7867 20.2829 10.892 20.3111 10.9992 20.3111C11.1064 20.3111 11.2117 20.2829 11.3045 20.2294C12.8695 19.3266 20.6811 14.5577 20.7759 9.31415C20.7972 8.13474 20.5052 7.03199 19.9315 6.12525ZM19.5539 9.29219C19.5233 10.9876 18.3931 12.9642 16.2858 15.0082C14.3343 16.901 12.1144 18.3278 10.9992 18.9916C9.88388 18.3279 7.66439 16.9013 5.71304 15.0084C3.60561 12.9646 2.47544 10.9881 2.4445 9.29276C2.41073 7.44159 3.30537 5.95219 4.83762 5.30858C5.33977 5.09879 5.87889 4.9918 6.42311 4.99393C7.82848 4.99393 9.31509 5.67425 10.5634 6.94361C10.6203 7.00144 10.6881 7.04736 10.7629 7.07871C10.8377 7.11006 10.918 7.12621 10.9991 7.12621C11.0802 7.12621 11.1605 7.11006 11.2353 7.07871C11.3101 7.04736 11.3779 7.00144 11.4348 6.94361C13.1691 5.18017 15.3631 4.55366 17.1602 5.30846C18.6926 5.95185 19.5873 7.44102 19.5539 9.29208V9.29219Z"
                                    fill="#004b7a"
                                />
                            </svg>
                            {/* <h2 className="text-sm font-semibold">{lang === 'ar' ? `لديك ${parseInt(discountAmount)?.toLocaleString('EN-US')} في محفظتك.` : `You have ${parseInt(discountAmount)?.toLocaleString('EN-US')} in your wallet.`}</h2> */}
                            <h2 className="text-sm font-semibold">
                                {lang === 'ar' ? 'المفضلة' : 'Wishlist'}
                            </h2>

                        </div>
                        <svg height="26" viewBox="0 0 24 24" width="26" className={lang === 'ar' ? "" : "rotate-180"} xmlns="http://www.w3.org/2000/svg" id="fi_2722991"><g id="_17" data-name="17"><path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z"></path></g></svg>
                    </Link>
                    {
                        userid ?
                            <>
                                <Link href={`${origin}/${lang}/account/addressbook`} className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004b7a] fill-[#004B7A]">
                                    <div className="flex items-center gap-x-2">
                                        <svg viewBox="0 0 1024 1024" width="25" fill="#004b7a" className={`icon`} version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 1012.8c-253.6 0-511.2-54.4-511.2-158.4 0-92.8 198.4-131.2 283.2-143.2h3.2c12 0 22.4 8.8 24 20.8 0.8 6.4-0.8 12.8-4.8 17.6-4 4.8-9.6 8.8-16 9.6-176.8 25.6-242.4 72-242.4 96 0 44.8 180.8 110.4 463.2 110.4s463.2-65.6 463.2-110.4c0-24-66.4-70.4-244.8-96-6.4-0.8-12-4-16-9.6-4-4.8-5.6-11.2-4.8-17.6 1.6-12 12-20.8 24-20.8h3.2c85.6 12 285.6 50.4 285.6 143.2 0.8 103.2-256 158.4-509.6 158.4z m-16.8-169.6c-12-11.2-288.8-272.8-288.8-529.6 0-168 136.8-304.8 304.8-304.8S816 145.6 816 313.6c0 249.6-276.8 517.6-288.8 528.8l-16 16-16-15.2zM512 56.8c-141.6 0-256.8 115.2-256.8 256.8 0 200.8 196 416 256.8 477.6 61.6-63.2 257.6-282.4 257.6-477.6C768.8 172.8 653.6 56.8 512 56.8z m0 392.8c-80 0-144.8-64.8-144.8-144.8S432 160 512 160c80 0 144.8 64.8 144.8 144.8 0 80-64.8 144.8-144.8 144.8zM512 208c-53.6 0-96.8 43.2-96.8 96.8S458.4 401.6 512 401.6c53.6 0 96.8-43.2 96.8-96.8S564.8 208 512 208z" fill=""></path></g></svg>
                                        <h2 className="text-sm font-semibold text-[#004b7a]">{lang === 'ar' ? 'عناويني' : 'My Addresses'}</h2>
                                    </div>
                                    <svg height="26" viewBox="0 0 24 24" width="26" className={lang === 'ar' ? "" : "rotate-180"} xmlns="http://www.w3.org/2000/svg" id="fi_2722991"><g id="_17" data-name="17"><path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z"></path></g></svg>
                                </Link>
                                <Link href={`${origin}/${lang}/account/orderlisting`} className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]">
                                    <div className="flex items-center gap-x-2">
                                        <svg viewBox="0 -2 1028 1028" width="24" fill="#004b7a" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M91.448447 896c-50.086957 0-91.428571-40.546584-91.428571-91.428571V91.428571C0.019876 41.341615 40.56646 0 91.448447 0h671.006211c50.086957 0 91.428571 40.546584 91.428572 91.428571v337.093168l-3.180124-0.795031c-13.515528-3.975155-26.236025-5.565217-40.546584-5.565217h-0.795031l-0.795031-2.385093h-2.385094V91.428571c0-23.055901-20.670807-43.726708-43.726708-43.726708H91.448447c-23.055901 0-43.726708 20.670807-43.726708 43.726708v713.142858c0 23.055901 20.670807 43.726708 43.726708 43.726708h352.198758l0.795031 0.795031c8.745342 11.925466 3.975155 20.670807 0.795031 27.031056-3.180124 5.565217-4.770186 9.540373 0.795031 15.10559l4.770186 4.770186H91.448447z" fill=""></path><path d="M143.125466 174.906832c-8.745342 0-15.900621-11.130435-15.900621-24.645962 0-13.515528 7.15528-24.645963 15.900621-24.645963h270.310559c8.745342 0 15.900621 11.130435 15.900621 24.645963 0 13.515528-7.15528 24.645963-15.900621 24.645962h-270.310559z" fill=""></path><path d="M413.436025 128h-270.310559c-7.15528 0-13.515528 9.540373-13.515528 22.26087s6.360248 22.26087 13.515528 22.260869h270.310559c7.15528 0 13.515528-9.540373 13.515528-22.260869s-5.565217-22.26087-13.515528-22.26087zM139.945342 302.111801c-7.15528 0-12.720497-10.335404-12.720497-24.645962s5.565217-24.645963 12.720497-24.645963h193.987577c7.15528 0 12.720497 10.335404 12.720497 24.645963s-5.565217 24.645963-12.720497 24.645962H139.945342z" fill=""></path><path d="M333.932919 255.204969H139.945342c-5.565217 0-9.540373 9.540373-9.540373 22.26087s3.975155 22.26087 9.540373 22.260869h193.987577c5.565217 0 9.540373-9.540373 9.540373-22.260869s-4.770186-22.26087-9.540373-22.26087zM734.628571 1024c-27.826087 0-58.037267-1.590062-96.993788-4.770186-56.447205-4.770186-108.124224-31.006211-158.211181-79.503106L253.634783 718.708075c-52.47205-50.881988-54.857143-117.664596-7.950311-168.546584 19.875776-20.670807 50.881988-33.391304 84.273292-33.391305 33.391304 0 63.602484 12.720497 82.68323 34.981367 0.795031 0.795031 2.385093 2.385093 5.565217 3.975155 0.795031 0.795031 2.385093 1.590062 3.180124 2.385093V451.57764v-52.47205c0-40.546584 0-81.888199 0.795031-122.434783 0.795031-60.42236 47.701863-106.534161 109.714286-106.534161h0.795031c59.627329 0 104.944099 43.726708 108.124224 103.354037 0.795031 13.515528 0.795031 27.826087 0 42.136646v18.285714h11.925466c41.341615 0 73.142857 14.310559 96.198757 44.52174 0.795031 1.590062 5.565217 3.180124 11.925466 3.180124 2.385093 0 4.770186 0 6.360249-0.795031 7.15528-0.795031 14.310559-1.590062 20.670807-1.590062 31.801242 0 59.627329 12.720497 83.478261 38.956521 3.975155 3.975155 12.720497 7.15528 20.670807 7.15528h3.180125c5.565217-0.795031 11.925466-1.590062 17.490683-1.590062 59.627329 0 107.329193 42.136646 108.124224 96.993789 2.385093 100.968944 3.975155 200.347826-7.15528 298.931677-13.515528 119.254658-77.118012 182.857143-201.142857 198.757764-23.055901 3.975155-49.291925 5.565217-77.913044 5.565217zM325.982609 562.086957c-16.695652 0-32.596273 6.360248-44.521739 17.490683-14.310559 14.310559-22.26087 31.006211-22.26087 49.291925 0 19.080745 8.745342 38.161491 24.645963 54.062112l30.21118 30.21118c65.987578 65.192547 134.360248 131.975155 202.732919 197.962733 33.391304 31.801242 71.552795 52.47205 113.689441 60.42236 32.596273 6.360248 65.192547 9.540373 96.993789 9.540373 28.621118 0 57.242236-2.385093 85.068323-7.950311 100.968944-18.285714 147.080745-66.782609 156.621118-160.596273 8.745342-89.838509 7.950311-182.062112 6.360248-271.10559v-14.310559c-0.795031-32.596273-23.850932-54.857143-56.447205-54.857143-8.745342 0-16.695652 1.590062-25.440993 4.770187V601.043478c0 11.130435 0 32.596273-22.26087 32.596274h-0.795031c-7.15528 0-12.720497-1.590062-15.900621-5.565218-6.360248-6.360248-7.15528-18.285714-7.15528-27.826087v-4.770186c0-36.571429 0.795031-73.937888 0-111.304348-0.795031-32.596273-23.850932-55.652174-55.652174-55.652174-7.950311 0-15.900621 1.590062-23.0559 3.975155v128.795031c0 11.130435-2.385093 19.875776-7.950311 25.440994-3.975155 3.975155-9.540373 6.360248-16.695652 6.360249h-0.795031c-21.465839-0.795031-21.465839-23.055901-21.465838-31.006211v-52.47205-66.782609c0-15.10559-6.360248-31.006211-18.285715-42.931677-11.130435-11.130435-26.236025-17.490683-41.341615-17.490683-6.360248 0-13.515528 0.795031-19.875776 3.180124V442.832298c0 27.031056 0 55.652174-1.590062 83.478261-0.795031 7.15528-7.15528 12.720497-13.515528 18.285714-2.385093 2.385093-5.565217 4.770186-7.950311 7.15528l-2.385093 2.385093-1.590062-3.975155c-1.590062-2.385093-3.975155-4.770186-6.360248-6.360249-4.770186-5.565217-10.335404-11.130435-13.515528-17.490683-2.385093-4.770186-1.590062-10.335404-1.590062-15.10559v-6.360249-69.167701c0-50.881988 0-103.354037-0.795032-155.031056 0-38.161491-24.645963-63.602484-60.42236-64.397516-38.956522 0-65.192547 27.826087-65.192546 68.372671v374.459627l-10.335404 6.360249-0.795031-1.590062c-7.15528-7.950311-15.10559-15.900621-22.26087-23.850932-16.695652-17.490683-34.186335-36.571429-51.677018-54.062112-15.900621-15.10559-35.776398-23.850932-56.447205-23.850931z" fill=""></path></g></svg>
                                        <h2 className="text-sm font-semibold">{lang === 'ar' ? 'طلباتي' : 'My Orders'}</h2>
                                    </div>
                                    <svg height="26" viewBox="0 0 24 24" width="26" className={lang === 'ar' ? "" : "rotate-180"} xmlns="http://www.w3.org/2000/svg" id="fi_2722991"><g id="_17" data-name="17"><path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z"></path></g></svg>
                                </Link>
                            </>
                            : null
                    }
                    <Link href={`${origin}/${lang}/projectsales`} className="border-b border-[#9CA4AB50] pl-3 pr-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]">
                        <div className="flex items-center gap-1">
                            <svg width={33} viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="0.00024000000000000003"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.43200000000000005"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M6.75 6L7.5 5.25H16.5L17.25 6V19.3162L12 16.2051L6.75 19.3162V6ZM8.25 6.75V16.6838L12 14.4615L15.75 16.6838V6.75H8.25Z" fill="#004B7A"></path> </g></svg>
                            <h2 className="text-sm font-semibold">{lang === 'ar' ? 'مبيعات المشاريع' : 'Project Sales'}</h2>
                        </div>
                        <svg height="26" viewBox="0 0 24 24" width="26" className={lang === 'ar' ? "" : "rotate-180"} xmlns="http://www.w3.org/2000/svg" id="fi_2722991"><g id="_17" data-name="17"><path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z"></path></g></svg>
                    </Link>
                    <Link href={`${origin}/${lang}/maintenance`} className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]">
                        <div className="flex items-center gap-x-2">
                            <svg viewBox="0 0 24 24" width={23} fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M9.29289 1.29289C9.48043 1.10536 9.73478 1 10 1H18C19.6569 1 21 2.34315 21 4V20C21 21.6569 19.6569 23 18 23H6C4.34315 23 3 21.6569 3 20V8C3 7.73478 3.10536 7.48043 3.29289 7.29289L9.29289 1.29289ZM18 3H11V8C11 8.55228 10.5523 9 10 9H5V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V4C19 3.44772 18.5523 3 18 3ZM6.41421 7H9V4.41421L6.41421 7ZM7 13C7 12.4477 7.44772 12 8 12H16C16.5523 12 17 12.4477 17 13C17 13.5523 16.5523 14 16 14H8C7.44772 14 7 13.5523 7 13ZM7 17C7 16.4477 7.44772 16 8 16H16C16.5523 16 17 16.4477 17 17C17 17.5523 16.5523 18 16 18H8C7.44772 18 7 17.5523 7 17Z" fill="#004B7A"></path> </g></svg>
                            <h2 className="text-sm font-semibold">{lang === 'ar' ? 'طلبات الصيانة' : 'Maintainance Request'}</h2>
                        </div>
                        <svg height="26" viewBox="0 0 24 24" width="26" className={lang === 'ar' ? "" : "rotate-180"} xmlns="http://www.w3.org/2000/svg" id="fi_2722991"><g id="_17" data-name="17"><path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z"></path></g></svg>
                    </Link>
                    <Link href={`${origin}/${lang}/store-locatore`} className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]">
                        <div className="flex items-center gap-1">
                            <svg viewBox="0 0 24 24" width={23} fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="#004B7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" stroke="#004B7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                            <h2 className="text-sm font-semibold">{lang === 'ar' ? 'فروع تمكين' : 'Tamkeen Showrooms'}</h2>
                        </div>
                        <svg height="26" viewBox="0 0 24 24" width="26" className={lang === 'ar' ? "" : "rotate-180"} xmlns="http://www.w3.org/2000/svg" id="fi_2722991"><g id="_17" data-name="17"><path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z"></path></g></svg>
                    </Link>
                    <Link href={`${origin}/${lang}/faqs`} className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]">
                        <div className="flex items-center gap-x-2">
                            <svg viewBox="0 0 24 24" width={23} fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#004B7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M9 9C9 5.49997 14.5 5.5 14.5 9C14.5 11.5 12 10.9999 12 13.9999" stroke="#004B7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 18.01L12.01 17.9989" stroke="#004B7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                            <h2 className="text-sm font-semibold">{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'}</h2>
                        </div>
                        <svg height="26" viewBox="0 0 24 24" width="26" className={lang === 'ar' ? "" : "rotate-180"} xmlns="http://www.w3.org/2000/svg" id="fi_2722991"><g id="_17" data-name="17"><path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z"></path></g></svg>
                    </Link>
                    <Link href={`${origin}/${lang}/contact-us`} className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]">
                        <div className="flex items-center gap-x-2">
                            <svg viewBox="0 0 24 24" width={23} fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clipPath="url(#clip0_429_11119)"> <path d="M21 15V12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12V15" stroke="#004B7A" strokeWidth="2.5" strokeLinecap="round"></path> <path d="M3 15H6C6.55228 15 7 15.4477 7 16V19C7 20.1046 6.10457 21 5 21V21C3.89543 21 3 20.1046 3 19V15Z" stroke="#004B7A" strokeWidth="2.5" strokeLinecap="round"></path> <path d="M17 16C17 15.4477 17.4477 15 18 15H21V19C21 20.1046 20.1046 21 19 21V21C17.8954 21 17 20.1046 17 19V16Z" stroke="#004B7A" strokeWidth="2.5" strokeLinecap="round"></path> </g> <defs> <clipPath id="clip0_429_11119"> <rect width="24" height="24" fill="white"></rect> </clipPath> </defs> </g></svg>
                            <h2 className="text-sm font-semibold">{lang === 'ar' ? 'اتصل بنا' : 'Call Us'}</h2>
                        </div>
                        <svg height="26" viewBox="0 0 24 24" width="26" className={lang === 'ar' ? "" : "rotate-180"} xmlns="http://www.w3.org/2000/svg" id="fi_2722991"><g id="_17" data-name="17"><path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z"></path></g></svg>
                    </Link>
                    <Link href={`${origin}/${lang}/terms-and-conditions`} className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]">
                        <div className="flex items-center gap-x-2">
                            <svg viewBox="0 0 512 512" width={23} version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#004B7A"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>about</title> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="about-white" fill="#004B7A" transform="translate(42.666667, 42.666667)"> <path d="M213.333333,3.55271368e-14 C95.51296,3.55271368e-14 3.55271368e-14,95.51168 3.55271368e-14,213.333333 C3.55271368e-14,331.153707 95.51296,426.666667 213.333333,426.666667 C331.154987,426.666667 426.666667,331.153707 426.666667,213.333333 C426.666667,95.51168 331.154987,3.55271368e-14 213.333333,3.55271368e-14 Z M213.333333,384 C119.227947,384 42.6666667,307.43872 42.6666667,213.333333 C42.6666667,119.227947 119.227947,42.6666667 213.333333,42.6666667 C307.44,42.6666667 384,119.227947 384,213.333333 C384,307.43872 307.44,384 213.333333,384 Z M240.04672,128 C240.04672,143.46752 228.785067,154.666667 213.55008,154.666667 C197.698773,154.666667 186.713387,143.46752 186.713387,127.704107 C186.713387,112.5536 197.99616,101.333333 213.55008,101.333333 C228.785067,101.333333 240.04672,112.5536 240.04672,128 Z M192.04672,192 L234.713387,192 L234.713387,320 L192.04672,320 L192.04672,192 Z" id="Shape"> </path> </g> </g> </g></svg>
                            <h2 className="text-sm font-semibold">{lang == 'ar' ? 'الشروط والاحكام' : 'Terms & Conditions'}</h2>
                        </div>
                        <svg height="26" viewBox="0 0 24 24" width="26" className={lang === 'ar' ? "" : "rotate-180"} xmlns="http://www.w3.org/2000/svg" id="fi_2722991"><g id="_17" data-name="17"><path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z"></path></g></svg>
                    </Link>
                    <Link href={`${origin}/${lang}/returnexchange`} className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]">
                        <div className="flex items-center gap-x-2">
                            <svg viewBox="0 0 512 512" width={23} version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#004B7A"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>about</title> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="about-white" fill="#004B7A" transform="translate(42.666667, 42.666667)"> <path d="M213.333333,3.55271368e-14 C95.51296,3.55271368e-14 3.55271368e-14,95.51168 3.55271368e-14,213.333333 C3.55271368e-14,331.153707 95.51296,426.666667 213.333333,426.666667 C331.154987,426.666667 426.666667,331.153707 426.666667,213.333333 C426.666667,95.51168 331.154987,3.55271368e-14 213.333333,3.55271368e-14 Z M213.333333,384 C119.227947,384 42.6666667,307.43872 42.6666667,213.333333 C42.6666667,119.227947 119.227947,42.6666667 213.333333,42.6666667 C307.44,42.6666667 384,119.227947 384,213.333333 C384,307.43872 307.44,384 213.333333,384 Z M240.04672,128 C240.04672,143.46752 228.785067,154.666667 213.55008,154.666667 C197.698773,154.666667 186.713387,143.46752 186.713387,127.704107 C186.713387,112.5536 197.99616,101.333333 213.55008,101.333333 C228.785067,101.333333 240.04672,112.5536 240.04672,128 Z M192.04672,192 L234.713387,192 L234.713387,320 L192.04672,320 L192.04672,192 Z" id="Shape"> </path> </g> </g> </g></svg>
                            <h2 className="text-sm font-semibold">{lang === 'ar' ? 'سياسة الاستبدال و الاسترجاع' : 'Exchange & Return Policy'}</h2>
                        </div>
                        <svg height="26" viewBox="0 0 24 24" width="26" className={lang === 'ar' ? "" : "rotate-180"} xmlns="http://www.w3.org/2000/svg" id="fi_2722991"><g id="_17" data-name="17"><path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z"></path></g></svg>
                    </Link>
                    <Link href={`${origin}/${lang}/setting`} className="border-b border-[#9CA4AB50] pl-3 pr-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]">
                        <div className="flex items-center gap-1">
                            <svg viewBox="0 0 24 24" width={33} fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M11.0175 19C10.6601 19 10.3552 18.7347 10.297 18.373C10.2434 18.0804 10.038 17.8413 9.76171 17.75C9.53658 17.6707 9.31645 17.5772 9.10261 17.47C8.84815 17.3365 8.54289 17.3565 8.30701 17.522C8.02156 17.7325 7.62943 17.6999 7.38076 17.445L6.41356 16.453C6.15326 16.186 6.11944 15.7651 6.33361 15.458C6.49878 15.2105 6.52257 14.8914 6.39601 14.621C6.31262 14.4332 6.23906 14.2409 6.17566 14.045C6.08485 13.7363 5.8342 13.5051 5.52533 13.445C5.15287 13.384 4.8779 13.0559 4.87501 12.669V11.428C4.87303 10.9821 5.18705 10.6007 5.61601 10.528C5.94143 10.4645 6.21316 10.2359 6.33751 9.921C6.37456 9.83233 6.41356 9.74433 6.45451 9.657C6.61989 9.33044 6.59705 8.93711 6.39503 8.633C6.1424 8.27288 6.18119 7.77809 6.48668 7.464L7.19746 6.735C7.54802 6.37532 8.1009 6.32877 8.50396 6.625L8.52638 6.641C8.82735 6.84876 9.21033 6.88639 9.54428 6.741C9.90155 6.60911 10.1649 6.29424 10.2375 5.912L10.2473 5.878C10.3275 5.37197 10.7536 5.00021 11.2535 5H12.1115C12.6248 4.99976 13.0629 5.38057 13.1469 5.9L13.1625 5.97C13.2314 6.33617 13.4811 6.63922 13.8216 6.77C14.1498 6.91447 14.5272 6.87674 14.822 6.67L14.8707 6.634C15.2842 6.32834 15.8528 6.37535 16.2133 6.745L16.8675 7.417C17.1954 7.75516 17.2366 8.28693 16.965 8.674C16.7522 8.99752 16.7251 9.41325 16.8938 9.763L16.9358 9.863C17.0724 10.2045 17.3681 10.452 17.7216 10.521C18.1837 10.5983 18.5235 11.0069 18.525 11.487V12.6C18.5249 13.0234 18.2263 13.3846 17.8191 13.454C17.4842 13.5199 17.2114 13.7686 17.1083 14.102C17.0628 14.2353 17.0121 14.3687 16.9562 14.502C16.8261 14.795 16.855 15.1364 17.0323 15.402C17.2662 15.7358 17.2299 16.1943 16.9465 16.485L16.0388 17.417C15.7792 17.6832 15.3698 17.7175 15.0716 17.498C14.8226 17.3235 14.5001 17.3043 14.2331 17.448C14.0428 17.5447 13.8475 17.6305 13.6481 17.705C13.3692 17.8037 13.1636 18.0485 13.1099 18.346C13.053 18.7203 12.7401 18.9972 12.3708 19H11.0175Z" stroke="#004B7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path fillRule="evenodd" clipRule="evenodd" d="M13.9747 12C13.9747 13.2885 12.9563 14.333 11.7 14.333C10.4437 14.333 9.42533 13.2885 9.42533 12C9.42533 10.7115 10.4437 9.66699 11.7 9.66699C12.9563 9.66699 13.9747 10.7115 13.9747 12Z" stroke="#004B7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                            <h2 className="text-sm font-semibold">{lang === 'ar' ? 'الاعدادات' : 'Settings'}</h2>
                        </div>
                        <svg height="26" viewBox="0 0 24 24" width="26" className={lang === 'ar' ? "" : "rotate-180"} xmlns="http://www.w3.org/2000/svg" id="fi_2722991"><g id="_17" data-name="17"><path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z"></path></g></svg>
                    </Link>

                    <div className='grid grid-cols-5 gap-2 mt-5 pl-5'>
                        <Link href="https://media.tamkeenstores.com.sa/pr0_tam/VAT.pdf" target='_blank' aria-label="Vat Certificate">
                            <Image
                                src="https://images.tamkeenstores.com.sa/assets/new-media/e5c754e0462e49eff70525ee6a0ce8381718877392.svg"
                                alt='Vat Certificate'
                                title='Vat Certificate'
                                height={80}
                                width={80}
                                loading='lazy'
                            />
                        </Link>
                        <Link href="https://maroof.sa/businesses/details/213361" target='_blank' aria-label="Maroof Certificate">
                            <Image
                                src="https://images.tamkeenstores.com.sa/assets/new-media/91b55e1d094fc0e944a3b906b33ffec71718877392.svg"
                                alt='Maroof Certificate'
                                title='Maroof Certificate'
                                height={80}
                                width={80}
                                loading='lazy'
                            />
                        </Link>
                        <Link href="https://images.tamkeenstores.com.sa/assets/pdf/E-Commerce-Authentication-Certificate.pdf" target='_blank' aria-label="Saudi Business Center Certificate">
                            <Image
                                src="https://images.tamkeenstores.com.sa/assets/new-media/0df1dfcf0ce7e8c4b9db91cb1c0dfa291718877392.svg"
                                alt='Saudi Business Center Certificate'
                                title='Saudi Business Center Certificate'
                                height={80}
                                width={80}
                                loading='lazy'
                            />
                        </Link>
                        {/*<Link href="https://images.tamkeenstores.com.sa/assets/pdf/Online_COC-23Nov.pdf" target='_blank' aria-label="">
                            <Image
                                src="https://images.tamkeenstores.com.sa/assets/new-media/12e57a08dbe89d8b6397ea6ad66488f21718877392.svg"
                                alt=''
                                title=''
                                height={80}
                                width={80}
                                loading='lazy'
                            />
                        </Link>*/}
                    </div>
                </div >
                <div className="fixed bottom-[77px] w-full p-3 bg-white shadow-md border-t border-[#5D686F26]">
                    {userid ?
                        <button onClick={() => handleLogout()} className="focus-visible:outline-none btn border border-[#DC4E4E] bg-[#DC4E4E] p-2.5 rounded-md w-full text-white fill-white flex items-center justify-center font-medium gap-x-2">
                            {lang === 'ar' ? 'تسجيل خروج' : 'Log Out'}
                        </button>
                        :
                        <button onClick={() => router.push(`/${lang}/login`)} className="focus-visible:outline-none btn border border-[#004B7A] bg-[#004B7A] p-2.5 rounded-md w-full text-white fill-white flex items-center justify-center font-medium gap-x-2">
                            {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
                        </button>
                    }
                </div>
            </div >


            <Transition appear show={confirmationPopup} as={Fragment}>
                <Dialog as="div" open={confirmationPopup} onClose={() => setConfirmationPopup(false)}>
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
                                <DialogPanel as="div" className="panel border-0 p-5 rounded-lg overflow-hidden w-full h-auto max-w-5xl my-8 text-black bg-white relative">
                                    <button type="button" className="focus-visible:outline-none text-dark hover:text-dark fill-dark absolute top-5 z-40 right-5" onClick={() => setConfirmationPopup(false)}>
                                        <svg height="16" viewBox="0 0 329.26933 329" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_1828778"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"></path></svg>
                                    </button>
                                    <div className="text-center">
                                        <h2 className="text-md font-semibold">{lang === 'ar' ? 'هل تريد حذف هذا الحساب؟' : 'Do you want to delete this account?'}</h2>

                                        <div className="flex items-center justify-center mt-3">
                                            <button
                                                onClick={() => deleteUser()}
                                                className="mx-1 focus-visible:outline-none btn border border-[#DC4E4E] bg-[#DC4E4E] p-2.5 rounded-md text-white fill-white flex items-center justify-center font-medium gap-x-2"
                                            >
                                                {lang === 'ar' ? 'يتأكد' : 'Confirm'}
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
