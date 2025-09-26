"use client"

import React, { useEffect, useState, useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import GlobalContext from '../GlobalContext'

export default function AccountSidebar(props: any) {

    const lang = props?.lang
    const origin = props?.origin
    const router = useRouter()

    const path = usePathname();
    const [fullName, setFullName] = useState<any>(false)
    const [loyaltyCount, setLoyaltyCount] = useState<any>(false)
    const [ProfileImage, setProfileImage] = useState<any>('/images/profile-image.png')
    const { updateUser, setUpdateUser } = useContext(GlobalContext);
    const { updateCart, setUpdateCart } = useContext(GlobalContext);
    const { updateWishlist, setUpdateWishlist } = useContext(GlobalContext);
    const { updateCompare, setUpdateCompare } = useContext(GlobalContext);
    const { updateOrder, setUpdateOrder } = useContext(GlobalContext);

    useEffect(() => {
        getData()
    }, [props])

    const getData = () => {
        setFullName(localStorage.getItem('fullName'))
        setLoyaltyCount(localStorage.getItem('loyaltyCount'))
        if (localStorage.getItem('profileImg') != null) {
            setProfileImage(localStorage.getItem('profileImg'))
        }
    }
    const handleLogout = () => {
        // window.localStorage.clear()
        localStorage.removeItem("userid")
        localStorage.removeItem('eMail')
        localStorage.removeItem('fullName')
        localStorage.removeItem('phoneNumber')
        localStorage.removeItem('loyaltyCount')
        localStorage.removeItem('compareCount')
        localStorage.removeItem('wishlistCount')
        localStorage.removeItem('orderCount')
        // localStorage.removeItem('userCompare')
        localStorage.removeItem('userWishlist')
        setUpdateUser(updateUser == 0 ? 1 : 0)
        setUpdateOrder(updateOrder == 0 ? 1 : 0)
        setUpdateWishlist(updateWishlist == 0 ? 1 : 0)
        setUpdateCompare(updateCompare == 0 ? 1 : 0)
        
        router.push('/' + props.lang + '/', { scroll: false })
        router.refresh()
    };
    
    return (
        <>
            <div className="w-1/2 2xl:w-1/3">
                <div className="bg-white rounded-lg shadow-md">
                    <div className='px-4 pt-4'>
                        <div className='flex items-center justify-start gap-x-3'>
                            <Image
                                src={ProfileImage}
                                alt='User Image'
                                title='User Image'
                                quality={100}
                                height={60}
                                width={60}
                                loading='lazy'
                                className="rounded-md"
                            />
                            <div className="text-sm">
                                <h3 className='text-[#5D686F]'>{props.lang == 'ar' ? 'مرحبا بـك' : 'Welcome'}</h3>
                                <h1 className='text-[#219EBC] text-base font-bold'>{fullName}</h1>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 text-xs">
                            <h3 className='text-[#B15533] font-semibold capitalize'>{props.lang == 'ar' ? `لديــك ${parseInt(loyaltyCount)?.toLocaleString('EN-US')} نقطة ولاء` : `${parseInt(loyaltyCount)?.toLocaleString('EN-US')} loyalty points available`}</h3>
                            <Link href={`${origin}/${props?.lang}/loyaltypoints`} className='text-[#5D686F] font-regular underline'>{props.lang == 'ar' ? 'اعــرف الـمزيد عن بـرنامج الولاء' : 'Learn More'}</Link>
                        </div>
                        <hr className="opacity-10 my-4" />
                    </div>
                    <div className='pb-4'>
                        <div className={`${props.path.indexOf('profile') > 1 ? 'border-[#FF671F] fill-[#004B7A] text-[#004B7A]' : 'border-transparent hover:border-[#FF671F] text-[#5D686F] fill-[#5D686F]'} hover:text-[#004B7A] hover:fill-[#004B7A] px-3 py-4 border-0 rtl:border-r-4 ltr:border-l-4 text-sm font-bold`}>
                            <Link href={`${origin}/${props?.lang}/account/profile`} className="flex items-center gap-x-2">
                                <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" id="fi_9308008"><g><path d="m12 12.75c-3.17 0-5.75-2.58-5.75-5.75s2.58-5.75 5.75-5.75 5.75 2.58 5.75 5.75-2.58 5.75-5.75 5.75zm0-10c-2.34 0-4.25 1.91-4.25 4.25s1.91 4.25 4.25 4.25 4.25-1.91 4.25-4.25-1.91-4.25-4.25-4.25z"></path><path d="m20.5901 22.75c-.41 0-.75-.34-.75-.75 0-3.45-3.5199-6.25-7.8399-6.25-4.32005 0-7.84004 2.8-7.84004 6.25 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-4.27 4.18999-7.75 9.34004-7.75 5.15 0 9.3399 3.48 9.3399 7.75 0 .41-.34.75-.75.75z"></path></g></svg>
                                {props.lang == 'ar' ? 'بيــانات حســابك' : 'Profile'}
                            </Link>
                        </div>

                        <div className={`${props.path.indexOf('wishlist') > 1 ? 'border-[#FF671F] fill-[#004B7A] text-[#004B7A]' : 'border-transparent hover:border-[#FF671F] text-[#5D686F] fill-[#5D686F]'} hover:text-[#004B7A] hover:fill-[#004B7A] px-3 py-5 border-0 rtl:border-r-4 ltr:border-l-4 text-sm font-bold`}>
                            <Link href={`${origin}/${props?.lang}/account/wishlist`} className="flex items-center gap-x-2">
                                <svg id="fi_3870922" height="20" viewBox="0 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m489.864 101.1a130.755 130.755 0 0 0 -60.164-50.89c-28.112-11.8-59.687-13.924-91.309-6.127-28.978 7.146-57.204 22.645-82.391 45.129-25.189-22.486-53.418-37.986-82.4-45.131-31.623-7.8-63.2-5.674-91.312 6.134a130.755 130.755 0 0 0 -60.161 50.9c-15.02 23.744-22.661 52.619-22.097 83.5 2.504 137.285 207.006 262.122 247.976 285.755a16 16 0 0 0 15.989 0c40.974-23.636 245.494-148.495 247.976-285.779.558-30.879-7.086-59.751-22.107-83.491zm-9.887 82.916c-.8 44.388-30.39 96.139-85.563 149.655-51.095 49.558-109.214 86.912-138.414 104.293-29.2-17.378-87.31-54.727-138.4-104.287-55.176-53.512-84.766-105.259-85.576-149.646-.884-48.467 22.539-87.462 62.656-104.313a106.644 106.644 0 0 1 41.511-8.238c36.795 0 75.717 17.812 108.4 51.046a16 16 0 0 0 22.815 0c45.406-46.17 102.85-62.573 149.9-42.811 40.121 16.845 63.547 55.834 62.671 104.298z"></path></svg>
                                {props.lang == 'ar' ? 'قائــمة الـمفـضلــة لديــك' : 'Wishlist'}
                            </Link>
                        </div>

                        <div className={`${props.path.indexOf('orderlisting') > 1 || props.path.indexOf('orderdetails') > 1 ? 'border-[#FF671F] fill-[#004B7A] text-[#004B7A]' : 'border-transparent hover:border-[#FF671F] text-[#5D686F] fill-[#5D686F]'} hover:text-[#004B7A] hover:fill-[#004B7A] px-3 py-5 border-0 rtl:border-r-4 ltr:border-l-4 text-sm font-bold`}>
                            <Link href={`${origin}/${props?.lang}/account/orderlisting`} className="flex items-center gap-x-2">
                                <svg id="fi_3624080" enableBackground="new 0 0 66 66" height="22" viewBox="0 0 66 66" width="22" xmlns="http://www.w3.org/2000/svg"><g><g><path d="m48.1 61.9c-.6 0-1 .4-1 1v1.1h-45.1v-51.5h10.1c-.5 1.6-.4 2.7-.4 3.8 0 .6.4 1 1 1h23.8c.6 0 1-.4 1-1 0-1.1.1-2.2-.4-3.8h10.1v6.9c0 .6.4 1 1 1s1-.4 1-1v-7.9c0-.6-.4-1-1-1h-12c-1-1.8-2.6-3.2-4.6-4.2-.2-3.5-3.3-6.4-7-6.4s-6.8 2.8-7 6.4c-2 .9-3.5 2.4-4.6 4.2h-12c-.6 0-1 .4-1 1v53.5c0 .6.4 1 1 1h47.1c.6 0 1-.4 1-1v-2.1c0-.5-.5-1-1-1zm-29.2-54c.4-.2.7-.6.6-1.2 0-2.6 2.2-4.7 5-4.7s5 2.1 5 4.7c-.1.6.2 1 .6 1.2 3.2 1.2 5.2 4.1 5.3 7.4h-21.7c0-3.2 2.1-6.1 5.2-7.4z"></path></g><g><path d="m24.5 11.7c2.1 0 3.9-1.7 3.9-3.9s-1.7-3.9-3.9-3.9c-2.1 0-3.9 1.7-3.9 3.9s1.8 3.9 3.9 3.9zm0-5.8c1 0 1.9.8 1.9 1.9s-.8 1.9-1.9 1.9c-1 0-1.9-.8-1.9-1.9s.9-1.9 1.9-1.9z"></path></g><g><path d="m14.7 23.3c0-.6-.4-1-1-1h-6.8c-.6 0-1 .4-1 1v7.3c0 .6.4 1 1 1h6.8c.6 0 1-.4 1-1zm-2 6.2h-4.8v-5.3h4.8z"></path></g><g><path d="m14.7 36.7c0-.6-.4-1-1-1h-6.8c-.6 0-1 .4-1 1v7.3c0 .6.4 1 1 1h6.8c.6 0 1-.4 1-1zm-2 6.3h-4.8v-5.3h4.8z"></path></g><g><path d="m13.7 49.2h-6.8c-.6 0-1 .4-1 1v7.3c0 .6.4 1 1 1h6.8c.6 0 1-.4 1-1v-7.3c0-.6-.5-1-1-1zm-1 7.3h-4.8v-5.3h4.8z"></path></g><g><path d="m65.4 32-18.2-9.9c-.3-.2-.7-.2-.9 0-1.2.6-15.7 8.4-18.1 9.7-.3.2-.5.6-.5.9v16c0 .3.2.7.5.8l18.1 11.4c.3.2.7.2 1 0l18.2-9.7c.3-.2.5-.5.5-.9v-17.4c0-.3-.2-.7-.6-.9zm-18.6-7.9 16.2 8.8-4.2 2.3-16.2-8.9zm8 13.8-16.8-9.1 2.4-1.3 17.3 9.5v4.9l-2.4 1.3v-4.4c0-.4-.2-.8-.5-.9zm-18.9-8 16.3 8.9-5.4 3-16.1-9.1zm-6.3 18.1v-13.7l16.1 9.1v14.8zm18.2 10.3v-14.8l5.5-3v4.4c0 .4.2.7.5.9s.7.2 1 0l4.4-2.4c.3-.2.5-.5.5-.9v-5.5l4.3-2.3v15.1z"></path></g><g><path d="m32.8 26.9c0-.6-.4-1-1-1h-14.3c-.6 0-1 .4-1 1s.4 1 1 1h14.3c.5 0 1-.4 1-1z"></path></g><g><path d="m25.7 39.4h-8.3c-.6 0-1 .4-1 1s.4 1 1 1h8.3c.6 0 1-.4 1-1s-.5-1-1-1z"></path></g><g><path d="m15.8 53.8c0 .6.4 1 1 1h13.1c.6 0 1-.4 1-1s-.4-1-1-1h-13.1c-.5 0-1 .5-1 1z"></path></g></g></svg>
                                {props.lang == 'ar' ? 'قائـمة طلبــاتك' : 'Orders'}
                            </Link>
                        </div>

                        <div className={`${props.path.indexOf('addressbook') > 1 ? 'border-[#FF671F] fill-[#004B7A] text-[#004B7A]' : 'border-transparent hover:border-[#FF671F] text-[#5D686F] fill-[#5D686F]'} hover:text-[#004B7A] hover:fill-[#004B7A] px-3 py-5 border-0 rtl:border-r-4 ltr:border-l-4 text-sm font-bold`}>
                            <Link href={`${origin}/${props?.lang}/account/addressbook`} className="flex items-center gap-x-2">
                                <svg id="fi_4969337" enableBackground="new 0 0 596.447 596.447" height="22" viewBox="0 0 596.447 596.447" width="22" xmlns="http://www.w3.org/2000/svg"><g><g><path d="m113.665 342.144c-4.991 0-9.037-4.046-9.037-9.037v-69.857c0-4.991 4.046-9.037 9.037-9.037s9.037 4.046 9.037 9.037v69.857c0 4.991-4.046 9.037-9.037 9.037z"></path></g><g><path d="m501.446 596.447h-352.446c-.102 0-.204-.001-.306-.005-24.901-.844-44.473-21.789-43.63-46.69l.016-.39v-44.099c0-4.991 4.046-9.037 9.037-9.037s9.037 4.046 9.037 9.037v44.281c0 .143-.004.287-.01.43l-.016.394c-.504 14.889 11.163 27.424 26.036 28.005h352.086l.179-.008c7.242-.349 13.907-3.493 18.775-8.855 4.868-5.361 7.356-12.297 7.008-19.531-.007-.144-.011-.29-.011-.435v-502.732c0-.128.002-.255.008-.382l.014-.333c.261-7.184-2.308-14.091-7.239-19.395-4.895-5.266-11.536-8.327-18.714-8.628h-352.544l-.18.008c-7.24.33-13.912 3.457-18.794 8.806s-7.389 12.278-7.059 19.513c.006.137.009.275.009.412v44.372c0 4.991-4.046 9.037-9.037 9.037s-9.037-4.046-9.037-9.037v-44.176c-.491-11.979 3.686-23.444 11.774-32.306 8.137-8.914 19.258-14.127 31.315-14.677l.529-.022c.1-.002.201-.004.302-.004h352.898c.11 0 .219.002.329.006 12.062.44 23.23 5.551 31.448 14.391s12.5 20.351 12.061 32.412l-.008.195v502.335c.518 11.973-3.629 23.443-11.691 32.322-8.113 8.936-19.22 14.177-31.276 14.758l-.492.022c-.125.004-.248.006-.371.006z"></path></g><g><path d="m113.665 221.227c-4.991 0-9.037-4.046-9.037-9.037v-69.856c0-4.991 4.046-9.037 9.037-9.037s9.037 4.046 9.037 9.037v69.856c0 4.991-4.046 9.037-9.037 9.037z"></path></g><g><path d="m113.665 463.15c-4.991 0-9.037-4.046-9.037-9.037v-69.856c0-4.991 4.046-9.037 9.037-9.037s9.037 4.046 9.037 9.037v69.856c0 4.99-4.046 9.037-9.037 9.037z"></path></g><g><path d="m143.036 151.461h-58.742c-18.288 0-33.166-14.878-33.166-33.166v-2.892c0-18.288 14.878-33.166 33.166-33.166h58.741c18.288 0 33.166 14.878 33.166 33.166v2.892c.001 18.288-14.878 33.166-33.165 33.166zm-58.742-51.15c-8.322 0-15.092 6.77-15.092 15.092v2.892c0 8.322 6.77 15.092 15.092 15.092h58.741c8.322 0 15.092-6.77 15.092-15.092v-2.892c0-8.322-6.77-15.092-15.092-15.092z"></path></g><g><path d="m143.036 272.378h-58.742c-18.288 0-33.166-14.878-33.166-33.166v-2.892c0-18.288 14.878-33.166 33.166-33.166h58.741c18.288 0 33.166 14.878 33.166 33.166v2.892c.001 18.287-14.878 33.166-33.165 33.166zm-58.742-51.151c-8.322 0-15.092 6.77-15.092 15.092v2.892c0 8.322 6.77 15.092 15.092 15.092h58.741c8.322 0 15.092-6.77 15.092-15.092v-2.892c0-8.322-6.77-15.092-15.092-15.092z"></path></g><g><path d="m143.036 393.293h-58.742c-18.288 0-33.166-14.878-33.166-33.166v-2.892c0-18.288 14.878-33.166 33.166-33.166h58.741c18.288 0 33.166 14.878 33.166 33.166v2.892c.001 18.289-14.878 33.166-33.165 33.166zm-58.742-51.149c-8.322 0-15.092 6.77-15.092 15.092v2.892c0 8.322 6.77 15.092 15.092 15.092h58.741c8.322 0 15.092-6.77 15.092-15.092v-2.892c0-8.322-6.77-15.092-15.092-15.092z"></path></g><g><path d="m143.036 514.3h-58.742c-18.288 0-33.166-14.878-33.166-33.166v-2.893c0-18.288 14.878-33.166 33.166-33.166h58.741c18.288 0 33.166 14.878 33.166 33.166v2.893c.001 18.289-14.878 33.166-33.165 33.166zm-58.742-51.15c-8.322 0-15.092 6.77-15.092 15.092v2.893c0 8.322 6.77 15.092 15.092 15.092h58.741c8.322 0 15.092-6.77 15.092-15.092v-2.893c0-8.322-6.77-15.092-15.092-15.092z"></path></g><g><path d="m343.659 274.547c-57.704 0-104.65-46.946-104.65-104.65s46.946-104.649 104.65-104.649 104.649 46.945 104.649 104.649-46.945 104.65-104.649 104.65zm0-191.225c-47.738 0-86.576 38.838-86.576 86.575 0 47.738 38.838 86.576 86.576 86.576s86.575-38.838 86.575-86.576c.001-47.738-38.837-86.575-86.575-86.575z"></path></g><g><path d="m343.659 197.189c-23.321 0-42.294-18.972-42.294-42.293s18.973-42.294 42.294-42.294c23.32 0 42.293 18.973 42.293 42.294s-18.973 42.293-42.293 42.293zm0-66.513c-13.355 0-24.22 10.865-24.22 24.22 0 13.354 10.865 24.219 24.22 24.219s24.219-10.865 24.219-24.219c0-13.355-10.864-24.22-24.219-24.22z"></path></g><g><path d="m269.636 239.394c-1.562 0-3.145-.406-4.588-1.258-4.298-2.539-5.723-8.081-3.185-12.377 4.075-6.898 9.018-13.266 14.69-18.926 37.073-36.991 97.329-36.925 134.322.149 5.579 5.669 10.453 11.947 14.532 18.702 2.58 4.273 1.207 9.828-3.065 12.407-4.27 2.58-9.828 1.208-12.407-3.064-3.35-5.548-7.354-10.703-11.899-15.323-29.905-29.974-78.696-30.028-108.716-.076-4.593 4.583-8.595 9.739-11.895 15.324-1.686 2.854-4.698 4.441-7.789 4.442z"></path></g><g><path d="m439.18 455.92h-191.134c-4.991 0-9.037-4.046-9.037-9.037s4.046-9.037 9.037-9.037h191.134c4.991 0 9.037 4.046 9.037 9.037s-4.046 9.037-9.037 9.037z"></path></g><g><path d="m439.18 509.782h-191.134c-4.991 0-9.037-4.046-9.037-9.037s4.046-9.037 9.037-9.037h191.134c4.991 0 9.037 4.046 9.037 9.037s-4.046 9.037-9.037 9.037z"></path></g></g></svg>
                                {props.lang == 'ar' ? 'قائـمة العـناويـن الخاصـة بـك' : 'Address Book'}
                            </Link>
                        </div>

                        <div className={`${props.path.indexOf('settings') > 1 ? 'border-[#FF671F] fill-[#004B7A] text-[#004B7A]' : 'border-transparent hover:border-[#FF671F] text-[#5D686F] fill-[#5D686F]'} hover:text-[#004B7A] hover:fill-[#004B7A] px-3 py-5 border-0 rtl:border-r-4 ltr:border-l-4 text-sm font-bold`}>
                            <button onClick={(e) => {
                                handleLogout()
                            }} className="focus-visible:outline-none flex items-center gap-x-2">
                                <svg id="fi_13371673" enableBackground="new 0 0 100 100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" height="22" width="22"><path id="Logout" d="m50 92h-24c-8.271 0-15-6.729-15-15v-54c0-8.271 6.729-15 15-15h24c1.658 0 3 1.342 3 3s-1.342 3-3 3h-24c-4.963 0-9 4.037-9 9v54c0 4.963 4.037 9 9 9h24c1.658 0 3 1.342 3 3s-1.342 3-3 3zm38.121-44.121-15-15c-1.172-1.172-3.07-1.172-4.242 0s-1.172 3.07 0 4.242l9.879 9.879h-40.758c-1.658 0-3 1.342-3 3s1.342 3 3 3h40.758l-9.879 9.879c-1.172 1.172-1.172 3.07 0 4.242.586.586 1.353.879 2.121.879s1.535-.293 2.121-.879l15-15c1.172-1.172 1.172-3.07 0-4.242z"></path></svg>
                                {props.lang == 'ar' ? 'تســجــيل الخروج' : 'Logout'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}