'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from "next/navigation"
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { post } from '../api/ApiCalls';
import { postSubmitNewsLetter } from '@/lib/components/component.client';

export default function Footer(props: any) {
    const path = usePathname();
    const lang = props?.lang;
    const origin = props?.origin;
    const [newslatter, setnewslatter] = useState(true);
    const [loader, setLoader] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [email, setemail] = useState('');

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
            position: props.lang == 'ar' ? 'top-start' : 'top-end',
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
            position: props.lang == 'ar' ? 'top-start' : 'top-end',
            showConfirmButton: false,
            timer: 15000,
            showCloseButton: true,
            background: '#DC4E4E',
            color: '#FFFFFF',
            timerProgressBar: true,
        });
    };

    const submitNewslatter = async () => {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var data = {
            email: email
        }

        if (!email) {
            setErrorMsg('Error! Please add email to subscribe !')
            topMessageAlartDanger(errorMsg)
            setLoader(false)
            return false;
        }
        else if (!email.match(validRegex)) {
            setErrorMsg('Error! Please add correct email to subscribe !')
            topMessageAlartDanger(errorMsg)
            setLoader(false)
            return false;
        }
        setLoader(true)
        const dataUpd = await postSubmitNewsLetter(data);
        if (dataUpd?.newsLetterData?.success) {
            setemail('')
            topMessageAlartSuccess('Success! You have subscribed our newslatter successfully !')
            setnewslatter(true)
            setLoader(false)
        }
        else {
            setLoader(false)
            if (dataUpd?.newsLetterData?.message != '') {
                topMessageAlartDanger(dataUpd?.newsLetterData?.message)
            }
            else {
                topMessageAlartDanger('Something Went Wrong. Please try again later')
            }
        }
    }


    const excludedPaths = [
        'serviceappointment',
        'shipmenttracking',
        'login',
        'otpconfirmation',
        '/paymentstatus',
        'resetpassword',
        'resetusername',
        'signup',
        'checkout',
    ];

    const isExcludedPath = excludedPaths.some(pathSegment => path.includes(pathSegment));
    const getLocalizedText = (arText: any, enText: any) => (lang === 'ar' ? arText : enText);

    const socialMediaLinks = [
        { href: "https://facebook.com/tamkeenstores/", iconId: "fi_3128208", label: "Facebook Tamkeen Stores" },
        { href: "https://www.tiktok.com/@tamkeenstores", iconId: "fi_3046120", label: "TikTok Tamkeen Stores" },
        { href: "https://instagram.com/tamkeenstores/", iconId: "fi_2111491", label: "Instagram Tamkeen Stores" },
        { href: "https://twitter.com/TamkeenStores", iconId: "fi_3128212", label: "Twitter Tamkeen Stores" },
        { href: "https://wa.me/9668002444464", iconId: "fi_2111774", label: "Whatsapp Tamkeen Stores" },
        { href: "https://linkedin.com/company/tamkeenstoresksa", iconId: "fi_3536569", label: "LinkedIn Tamkeen Stores" },
        { href: "https://youtube.com/channel/UCPDfOGtCcn7wenYC1xW9iGA", iconId: "fi_1384028", label: "YouTube Tamkeen Stores" },
    ];

    const certificates = [
        { href: "https://media.tamkeenstores.com.sa/pr0_tam/VAT.pdf", src: "https://images.tamkeenstores.com.sa/assets/new-media/e5c754e0462e49eff70525ee6a0ce8381718877392.svg", alt: "VAT Certificate" },
        { href: "https://maroof.sa/businesses/details/213361", src: "https://images.tamkeenstores.com.sa/assets/new-media/91b55e1d094fc0e944a3b906b33ffec71718877392.svg", alt: "Maroof Certificate" },
        { href: "https://images.tamkeenstores.com.sa/assets/pdf/E-Commerce-Authentication-Certificate.pdf", src: "https://images.tamkeenstores.com.sa/assets/new-media/0df1dfcf0ce7e8c4b9db91cb1c0dfa291718877392.svg", alt: "Saudi Business Center Certificate" },
    ];

    if (!isExcludedPath) {
        return (
            <>
                {/* Subscription Section */}
                <div className="bg-white block h-80">
                    <div className={`container pt-3 items-center`}>
                        <div>
                            <h3 className={`font-bold leading-tight text-primary text-md`}>
                                {getLocalizedText('النشرة الاخبارية', 'Unlock Premium Benefits Today!')}
                            </h3>
                            <p className={`mt-1 text-[0.75rem] text-[#4D545B] `}>
                                {getLocalizedText( 
                                    'اشترك في النشره الاخبارية للحصول علي كل ما هو جديد من العروض والتحديثات الخاصة بمتجر تمكين',
                                    'Enhance Your Home Appliance Experience with Our Subscription Service, Unveiling Exclusive discounts and cashback Rewards'
                                )}
                            </p>
                            <div className={`mt-5`}>
                                <p className="text-xs text-[#585141]">
                                    {getLocalizedText('اكتب بريدك الالكتروني واشترك الان', 'Enter your E-mail ID')}
                                </p>
                                <div className={`mt-2 w-full space-y-2`}>
                                    <input
                                        type="email"
                                        name="shipping-charge"
                                        className={`focus-visible:outline-none font-normal text-sm w-full border rounded-md p-3 border-[#4D545B30] active:border-primary focus-within:border-[#004B7A]`}
                                        placeholder={getLocalizedText('اكتب البريد هنا...', 'Write your email here...')}
                                        onChange={(e) => {
                                            setemail(e.target.value);
                                            if (e.target.value.length >= 5) {
                                                setnewslatter(false);
                                            }
                                        }}
                                        value={email}
                                    />
                                    <button
                                        className={`focus-visible:outline-none w-full btn btn-primary hover:text-white hover:bg-[#004B7A] border-[#004B7A] border text-primary py-2 rounded-md px-8 font-semibold text-sm`}
                                        disabled={newslatter}
                                        onClick={submitNewslatter}
                                    >
                                        {loader ? (
                                            <svg
                                                height="24"
                                                viewBox="0 0 24 24"
                                                className="animate-spin h-6 w-6"
                                                xmlns="http://www.w3.org/2000/svg"
                                                id="fi_7235860"
                                            >
                                                <path d="M12 22c5.421 0 10-4.579 10-10H20c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path>
                                            </svg>
                                        ) : (
                                            getLocalizedText('اشترك', 'Subscribe')
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-primary py-8 hidden md:block">
                    <div className={`container grid grid-cols-5 gap-x-10`}>
                        {/* Logo and Contact */}
                        <div>
                            <Image
                                src="/images/fo_logo.png"
                                alt="Tamkeen Logo"
                                title="Tamkeen Logo"
                                quality={100}
                                height={0}
                                width={140}
                                loading="lazy"
                            />
                            <Link href="tel:8002444464" className="text-white flex items-center gap-x-2 mt-8 font-light text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" className="fill-white">
                                    <path d="M 476.417969 640 C 427.671875 640 367.871094 617.554688 301.988281 573.328125 C 168.78125 483.941406 12.894531 300.492188 0.8125 176.535156 ..."></path>
                                </svg>
                                8002444464
                            </Link>
                            <Link href="mail:contact@tamkeenstores.com.sa" className="text-white flex items-center gap-x-2 mt-2 font-light text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" className="fill-white">
                                    <path d="..."></path>
                                </svg>
                                contact@tamkeenstores.com.sa
                            </Link>
                        </div>

                        {/* Sections */}
                        {[
                            {
                                title: getLocalizedText('الاقسام', 'Sections'),
                                links: [
                                    { href: `${origin}/${lang}/category/air-conditioners`, text: getLocalizedText('المكيفات', 'Air Conditioners') },
                                    { href: `${origin}/${lang}/category/cooking`, text: getLocalizedText('الافران', 'Cookers') },
                                    { href: `${origin}/${lang}/category/washing-machine`, text: getLocalizedText('الغسالات', 'Washing Machines') },
                                    { href: `${origin}/${lang}/category/television`, text: getLocalizedText('الشاشات', 'Televisions') },
                                    { href: `${origin}/${lang}/category/refrigerators`, text: getLocalizedText('الثلاجات', 'Refrigerators') },
                                ],
                            },
                            {
                                title: getLocalizedText('عــن تمكين', 'About Tamkeen'),
                                links: [
                                    { href: `${origin}/${lang}/about-us`, text: getLocalizedText('عن شركة تمكين', 'About Tamkeen Stores') },
                                    { href: `${origin}/${lang}/store-locatore`, text: getLocalizedText('فروعنا', 'Our Branches') },
                                    { href: `${origin}/${lang}/contact-us`, text: getLocalizedText('تواصل معنا', 'Contact Us') },
                                    { href: `${origin}/${lang}/maintenance`, text: getLocalizedText('صيانة تمكين', 'Tamkeen Maintenance') },
                                ],
                            },
                            {
                                title: getLocalizedText('الدعم والتواصل', 'Support and Communication'),
                                links: [
                                    { href: "https://forms.gle/ZLug14w6XVB7euju8", text: getLocalizedText('انضم إلينا', 'Join Us') },
                                    { href: `${origin}/${lang}/terms-and-conditions`, text: getLocalizedText('الشروط والاحكام', 'Terms & Conditions') },
                                    { href: `${origin}/${lang}/privacy-policy`, text: getLocalizedText('سياسة الخصوصة', 'Privacy Policies') },
                                    { href: `${origin}/${lang}/faqs`, text: getLocalizedText('الاسئلة والاجوبة', 'FAQs') },
                                    { href: `${origin}/${lang}/returnexchange`, text: getLocalizedText('سياسة الاستبدال والاسترجاع', 'Exchange & Return Policy') },
                                ],
                            },
                        ].map((section, index) => (
                            <div key={index} className="text-white">
                                <div className="font-semibold text-sm">{section.title}</div>
                                <ul className="mt-5 text-xs">
                                    {section.links.map((link, idx) => (
                                        <li key={idx} className="mt-3 hover:underline">
                                            <Link href={link.href} className="font-light text-sm">{link.text}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* App Links and Certificates */}
                        <div className="text-white">
                            <div className="font-semibold text-sm">{getLocalizedText('حمل تطبيق تمكين', 'Download the Tamkeen application')}</div>
                            <div className="grid grid-cols-2 gap-2 mt-5">
                                <Link href="https://apps.apple.com/sa/app/tamkeen-stores/id1546482321" target="_blank" aria-label="Apple Pay Tamkeen Stores">
                                    <Image src="/images/appstore.png" alt="App Store" height={30} width={130} loading="lazy" />
                                </Link>
                                <Link href="https://play.google.com/store/apps/details?id=com.tamkeen.tamkeenstores" target="_blank" aria-label="Google Play Tamkeen Stores">
                                    <Image src="/images/googleplay.png" alt="Google Play" height={30} width={130} loading="lazy" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mt-5">
                                {certificates.map((cert, idx) => (
                                    <Link key={idx} href={cert.href} target="_blank" aria-label={cert.alt}>
                                        <Image src={cert.src} alt={cert.alt} height={60} width={60} loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className={'container'}>
                        <hr className="border-white my-8" />
                        <div className="grid grid-cols-2">
                            <div className="font-light text-xs text-white">{getLocalizedText('كل حقوق الملكية محفوظة إلى شركة تمكين الدولية للأجهزة المنزلية', 'All rights reserved to Tamkeen International For Home Appliances 2024')}</div>
                            <div className="flex items-center justify-end gap-x-3 text-white fill-white">
                                <div className="font-light text-sm">{getLocalizedText('تابعنا علي التواصل الاجتماعي', 'Follow us on social media')}</div>
                                {socialMediaLinks.map((media, idx) => (
                                    <a key={idx} href={media.href} target="_blank" aria-label={media.label}>
                                        {media.iconId == "fi_3128208" ?
                                            <svg id="fi_3128208" enableBackground="new 0 0 100 100" height="22" viewBox="0 0 100 100" width="22" xmlns="http://www.w3.org/2000/svg"><g id="_x30_1._Facebook" className="fill-white hover:fill-secondary"><path id="Icon_11_" d="m40.4 55.2c-.3 0-6.9 0-9.9 0-1.6 0-2.1-.6-2.1-2.1 0-4 0-8.1 0-12.1 0-1.6.6-2.1 2.1-2.1h9.9c0-.3 0-6.1 0-8.8 0-4 .7-7.8 2.7-11.3 2.1-3.6 5.1-6 8.9-7.4 2.5-.9 5-1.3 7.7-1.3h9.8c1.4 0 2 .6 2 2v11.4c0 1.4-.6 2-2 2-2.7 0-5.4 0-8.1.1-2.7 0-4.1 1.3-4.1 4.1-.1 3 0 5.9 0 9h11.6c1.6 0 2.2.6 2.2 2.2v12.1c0 1.6-.5 2.1-2.2 2.1-3.6 0-11.3 0-11.6 0v32.6c0 1.7-.5 2.3-2.3 2.3-4.2 0-8.3 0-12.5 0-1.5 0-2.1-.6-2.1-2.1 0-10.5 0-32.4 0-32.7z"></path></g></svg>
                                            :
                                            media.iconId == "fi_3046120" ?
                                                <svg id="fi_3046120" enableBackground="new 0 0 512 512" height="20" viewBox="0 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg" className="fill-white hover:fill-secondary"><g><path d="m480.32 128.39c-29.22 0-56.18-9.68-77.83-26.01-24.83-18.72-42.67-46.18-48.97-77.83-1.56-7.82-2.4-15.89-2.48-24.16h-83.47v228.08l-.1 124.93c0 33.4-21.75 61.72-51.9 71.68-8.75 2.89-18.2 4.26-28.04 3.72-12.56-.69-24.33-4.48-34.56-10.6-21.77-13.02-36.53-36.64-36.93-63.66-.63-42.23 33.51-76.66 75.71-76.66 8.33 0 16.33 1.36 23.82 3.83v-62.34-22.41c-7.9-1.17-15.94-1.78-24.07-1.78-46.19 0-89.39 19.2-120.27 53.79-23.34 26.14-37.34 59.49-39.5 94.46-2.83 45.94 13.98 89.61 46.58 121.83 4.79 4.73 9.82 9.12 15.08 13.17 27.95 21.51 62.12 33.17 98.11 33.17 8.13 0 16.17-.6 24.07-1.77 33.62-4.98 64.64-20.37 89.12-44.57 30.08-29.73 46.7-69.2 46.88-111.21l-.43-186.56c14.35 11.07 30.04 20.23 46.88 27.34 26.19 11.05 53.96 16.65 82.54 16.64v-60.61-22.49c.02.02-.22.02-.24.02z"></path></g></svg>
                                                :
                                                media.iconId == "fi_2111491" ?
                                                    <svg id="fi_2111491" enableBackground="new 0 0 24 24" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" className="fill-white hover:fill-secondary"><path d="m12.004 5.838c-3.403 0-6.158 2.758-6.158 6.158 0 3.403 2.758 6.158 6.158 6.158 3.403 0 6.158-2.758 6.158-6.158 0-3.403-2.758-6.158-6.158-6.158zm0 10.155c-2.209 0-3.997-1.789-3.997-3.997s1.789-3.997 3.997-3.997 3.997 1.789 3.997 3.997c.001 2.208-1.788 3.997-3.997 3.997z"></path><path d="m16.948.076c-2.208-.103-7.677-.098-9.887 0-1.942.091-3.655.56-5.036 1.941-2.308 2.308-2.013 5.418-2.013 9.979 0 4.668-.26 7.706 2.013 9.979 2.317 2.316 5.472 2.013 9.979 2.013 4.624 0 6.22.003 7.855-.63 2.223-.863 3.901-2.85 4.065-6.419.104-2.209.098-7.677 0-9.887-.198-4.213-2.459-6.768-6.976-6.976zm3.495 20.372c-1.513 1.513-3.612 1.378-8.468 1.378-5 0-7.005.074-8.468-1.393-1.685-1.677-1.38-4.37-1.38-8.453 0-5.525-.567-9.504 4.978-9.788 1.274-.045 1.649-.06 4.856-.06l.045.03c5.329 0 9.51-.558 9.761 4.986.057 1.265.07 1.645.07 4.847-.001 4.942.093 6.959-1.394 8.453z"></path><circle cx="18.406" cy="5.595" r="1.439"></circle></svg>
                                                    :
                                                    media.iconId == "fi_3128212" ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="22" height="22" viewBox="0 0 24 24" className="fill-white hover:fill-secondary"><path d="M 2.3671875 3 L 9.4628906 13.140625 L 2.7402344 21 L 5.3808594 21 L 10.644531 14.830078 L 14.960938 21 L 21.871094 21 L 14.449219 10.375 L 20.740234 3 L 18.140625 3 L 13.271484 8.6875 L 9.2988281 3 L 2.3671875 3 z M 6.2070312 5 L 8.2558594 5 L 18.033203 19 L 16.001953 19 L 6.2070312 5 z"></path></svg>
                                                        :
                                                        media.iconId == "fi_2111774" ?
                                                            <svg id="fi_2111774" enableBackground="new 0 0 24 24" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" className="fill-white hover:fill-secondary"><path d="m17.507 14.307-.009.075c-2.199-1.096-2.429-1.242-2.713-.816-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.293-.506.32-.578.878-1.634.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.576-.05-.997-.042-1.368.344-1.614 1.774-1.207 3.604.174 5.55 2.714 3.552 4.16 4.206 6.804 5.114.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z"></path><path d="m20.52 3.449c-7.689-7.433-20.414-2.042-20.419 8.444 0 2.096.549 4.14 1.595 5.945l-1.696 6.162 6.335-1.652c7.905 4.27 17.661-1.4 17.665-10.449 0-3.176-1.24-6.165-3.495-8.411zm1.482 8.417c-.006 7.633-8.385 12.4-15.012 8.504l-.36-.214-3.75.975 1.005-3.645-.239-.375c-4.124-6.565.614-15.145 8.426-15.145 2.654 0 5.145 1.035 7.021 2.91 1.875 1.859 2.909 4.35 2.909 6.99z"></path></svg>
                                                            :
                                                            media.iconId == "fi_3536569" ?
                                                                <svg height="22" viewBox="0 0 176 176" width="22" xmlns="http://www.w3.org/2000/svg" id="fi_3536569" className="fill-white hover:fill-secondary"><g id="Layer_2" data-name="Layer 2"><g id="linkedin"><path id="icon" d="m152 0h-128a24 24 0 0 0 -24 24v128a24 24 0 0 0 24 24h128a24 24 0 0 0 24-24v-128a24 24 0 0 0 -24-24zm-92 139.28a3.71 3.71 0 0 1 -3.71 3.72h-15.81a3.71 3.71 0 0 1 -3.72-3.72v-66.28a3.72 3.72 0 0 1 3.72-3.72h15.81a3.72 3.72 0 0 1 3.71 3.72zm-11.62-76.28a15 15 0 1 1 15-15 15 15 0 0 1 -15 15zm94.26 76.54a3.41 3.41 0 0 1 -3.42 3.42h-17a3.41 3.41 0 0 1 -3.42-3.42v-31.05c0-4.64 1.36-20.32-12.13-20.32-10.45 0-12.58 10.73-13 15.55v35.86a3.42 3.42 0 0 1 -3.37 3.42h-16.42a3.41 3.41 0 0 1 -3.41-3.42v-66.87a3.41 3.41 0 0 1 3.41-3.42h16.42a3.42 3.42 0 0 1 3.42 3.42v5.78c3.88-5.83 9.63-10.31 21.9-10.31 27.18 0 27 25.38 27 39.32z"></path></g></g></svg>
                                                                :
                                                                media.iconId == "fi_1384028" ?
                                                                    <svg height="28" viewBox="-21 -117 682.66672 682" width="28" xmlns="http://www.w3.org/2000/svg" id="fi_1384028" className="fill-white hover:fill-secondary"><path d="m626.8125 64.035156c-7.375-27.417968-28.992188-49.03125-56.40625-56.414062-50.082031-13.703125-250.414062-13.703125-250.414062-13.703125s-200.324219 0-250.40625 13.183593c-26.886719 7.375-49.03125 29.519532-56.40625 56.933594-13.179688 50.078125-13.179688 153.933594-13.179688 153.933594s0 104.378906 13.179688 153.933594c7.382812 27.414062 28.992187 49.027344 56.410156 56.410156 50.605468 13.707031 250.410156 13.707031 250.410156 13.707031s200.324219 0 250.40625-13.183593c27.417969-7.378907 49.03125-28.992188 56.414062-56.40625 13.175782-50.082032 13.175782-153.933594 13.175782-153.933594s.527344-104.382813-13.183594-154.460938zm-370.601562 249.878906v-191.890624l166.585937 95.945312zm0 0"></path></svg>
                                                                    : null}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}