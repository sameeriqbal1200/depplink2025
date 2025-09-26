"use client";

import React, { useState } from "react";
import Image from "next/image";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { postSubmitNewsLetter } from "@/lib/components/component.client";


export default function NewsLetter(props: any) {
    const lang = props?.lang;
    const isArabic = props?.isArabic;
    const [newslatter, setnewslatter] = useState(true);
    const [loader, setLoader] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [email, setemail] = useState('');
    const MySwal = withReactContent(Swal);

    const getLocalizedText = (arText: any, enText: any) => (isArabic ? arText : enText);
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
    return (
        <>
            {/* Subscription Section */}
            <div className="bg-white block pb-24">
                <div className={`container pt-3 items-center`}>
                    <div>
                        <h3 className="headingHomeMain">
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
                    <div>
                        <Image
                            src="/images/newsLetter.webp"
                            alt="newsletter"
                            title="News Letter"
                            height={0}
                            width={0}
                            quality={100}
                            loading="lazy"
                            className="mx-auto w-full h-full"
                            sizes='100vw'
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
