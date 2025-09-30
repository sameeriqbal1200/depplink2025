"use client"; // This is a client component 👈🏽

import React from 'react'
import Image from 'next/image';
import dynamic from 'next/dynamic'
import { useApp } from "@/app/_ctx/AppContext";
import { useSlot } from '@/app/_ctx/ClientDataRegistry';
import { Disclosure, DisclosureButton } from "@headlessui/react";

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function InstallmentServiceMethods() {
    const { lang } = useApp();
    const footer = useSlot<any>("footer");

    return (
        <>
            <MobileHeader type="Third" lang={lang} pageTitle={lang === 'ar' ? 'اختر مزود خدمة التقسيط' : 'Installment Service'} />
            <div className="container py-16 md:py-4">
                <div className="my-2">
                    <div className="text-sm text-[#5D686F] mt-3" dangerouslySetInnerHTML={{ __html: lang == 'ar' ? footer?.data?.page_content_ar : footer?.data?.page_content_en }}></div>
                    <h1 className=" font-semibold text-base 2xl:text-lg">{lang === 'ar' ? 'اختر مزود خدمة التقسيط' : 'Choose Installment Service Provider'}</h1>
                    <div className="text-sm text-[#5D686F] my-4 space-y-3">
                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton>
                                        <Image 
                                        src="/images/mispaybanner.webp" 
                                        alt='Mispay' 
                                        title='Mispay' 
                                        height={0} 
                                        width={0} 
                                        className="h-full w-full rounded-t-md" 
                                        sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw'
                                        />
                                        <div className="flex w-full justify-between items-center rounded-b-md text-left text-lg font-medium ocus-visible:outline-none bg-[#EEF8FC] px-2 py-4 md:p-3 mb-3 text-[#004B7A]">
                                            <div className="gap-2 md:gap-10 flex">
                                                <span>{lang === "ar" ? "Mispay" : "Mispay"}</span>
                                                <span>{lang === "ar" ? "تقسيط اربع اشهر" : "4 Months Installment"}</span>
                                            </div>
                                        </div>
                                    </DisclosureButton>
                                    {lang === "ar" ?
                                        <Image 
                                            src="/images/mispayAr.webp" 
                                            alt='BaseetaAr' 
                                            title='Baseeta-Ar' 
                                            height={0} 
                                            width={0} 
                                            className="h-full w-full rounded-t-md" 
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
                                        />
                                        :
                                        <Image 
                                            src="/images/mispayEng.webp" 
                                            alt='BaseetaAr' 
                                            title='Baseeta-Ar' 
                                            height={0} 
                                            width={0} 
                                            className="h-full w-full rounded-t-md" 
                                            sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw'
                                        />
                                    }
                                </>
                            )}
                        </Disclosure>
                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton>
                                        <Image
                                         src="/images/Madfu banner.webp" 
                                         alt='Madfu' 
                                         title='Madfu' 
                                         height={0} 
                                         width={0} 
                                         className="h-full w-full rounded-t-md" 
                                         sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw'
                                        />
                                        <div className="flex w-full justify-between items-center rounded-b-md text-left text-lg font-medium ocus-visible:outline-none bg-[#EEF8FC] px-2 py-4 md:p-3 mb-3 text-[#004B7A]">
                                            <div className="gap-2 md:gap-10 flex">
                                                <span>{lang === "ar" ? "مدفوع" : "Madfu"}</span>
                                                <span>{lang === "ar" ? "تقسيط اربع اشهر" : "4 Months Installment"}</span>
                                            </div>
                                        </div>
                                    </DisclosureButton>
                                    {lang === "ar" ?
                                        <Image 
                                            src="/images/MadfuTC_Arabic.webp" 
                                            alt='BaseetaAr' 
                                            title='Baseeta-Ar' 
                                            height={0} 
                                            width={0} 
                                            className="h-full w-full rounded-t-md" 
                                            sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw'
                                        />
                                        :
                                        <Image 
                                            src="/images/MadfuTC_Eng.webp" 
                                            alt='BaseetaAr' 
                                            title='Baseeta-Ar' 
                                            height={0} 
                                            width={0} 
                                            className="h-full w-full rounded-t-md" 
                                            sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw'
                                        />
                                    }
                                </>
                            )}
                        </Disclosure>
                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton>
                                        <Image 
                                            src="https://images.tamkeenstores.com.sa/assets/new-media/c441dffe5d6d6d30a26c0253b282da6c1716289368.webp" 
                                            alt='Tamara' 
                                            title='Tamara' 
                                            height={0} 
                                            width={0} 
                                            className="h-full w-full rounded-t-md" 
                                            sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw'
                                        />
                                        <div className="flex w-full justify-between items-center rounded-b-md text-left text-lg font-medium ocus-visible:outline-none bg-[#EEF8FC] px-2 py-4 md:p-3 mb-3 text-[#004B7A]">
                                            <div className="gap-2 md:gap-8 flex">
                                                <span>{lang === "ar" ? "تمارا" : "Tamara"}</span>
                                                <span>{lang === "ar" ? "تقسيط اربع اشهر" : "4 Months Installment"}</span>
                                            </div>
                                        </div>
                                    </DisclosureButton>
                                    {lang === "ar" ?
                                        <div className="py-2">
                                            <ul className="text-xs text-dark">
                                                <li className="my-2">- الدفع باستخدام تمارا متاح بجميع معارض  وعلى موقع  الإلكتروني وتطبيق  بالمملكة العربية السعودية.</li>
                                                <li className="my-2">- الدفع باستخدام تمارا متاح على جميع المنتجات ماعدا بطاقات الهدايا.</li>
                                                <li className="my-2">- يمكن للعميل تقسيم قيمة الفاتورة على 4 دفعات عند الدفع باستخدام تمارا.</li>
                                                <li className="my-2">- لاستخدام تمارا للدفع يجب أن يكون الحد الأدنى لقيمة الفاتورة 200 ريال والحد الأقصى 9,000 ريال.</li>
                                                <li className="my-2">- المنتجات التي يتم شراؤها باستخدام تمارا لا يمكن استرجاع قيمتها نقداً أو عن طريق بطاقات الهدايا، الإرجاع يتم من خلال تمارا.</li>
                                                <li className="my-2">- تطبق سياسة الإرجاع والاستبدال الخاصة ب عند الشراء باستخدام تمارا.</li>
                                                <li className="my-2">-  لن تكون مسؤولة عن أي التزامات أو مطالبات من أي نوع قد يتعرض لها العميل والتي قد تكون مرتبطة بحساب العميل أو بالسداد في تطبيق تمارا. للمشاكل التقنية في تطبيق أو موقع تمارا، يرجى التواصل مع فريق خدمة عملاء تمارا.</li>
                                                <li className="my-2">- ﻻ ﻳﻤﻜﻦ اﻟﺠﻤﻊ ﺑﻴﻦ ﺧﻴﺎر اﻟﺪﻓﻊ ﺑﺘﻤﺎرا وأي ﺧﻴﺎر دﻓﻊ آﺧﺮ. في حالة اختيار تمارا كطريقة للدفع، ﻳﺠﺐ دﻓﻊ ﻗﻴﻤﺔ اﻟﻔﺎﺗﻮرة ﺑﺎﻟﻜﺎﻣﻞ ﺑﺎﺳﺘﺨﺪام ﺗﻤﺎرا ﻓﻘﻂ.</li>
                                                <li className="my-2">- قد يتم تقسيم قيمة الفاتورة على 4 دفعات غير متساوية بناء على التاريخ الائتماني والتقييم الائتماني للعميل. يمكنك التواصل مع تمارا للمزيد من المعلومات.</li>
                                                <li className="my-2">- يجب على العميل استخدام رقم الجوال المسجل في أبشر لإتمام عملية الشراء باستخدام تمارا.</li>
                                                <li className="my-2">- يجب على العميل تسوية جميع الدفعات مستحقة السداد مع تمارا.</li>
                                                <li className="my-2">- يحق للعملاء بعمر 18 عام أو أكبر الشراء باستخدام تمارا كما هو موضح أدناه:</li>
                                            </ul>
                                            <table className="border-collapse border border-[#5D686F30] my-6 w-full">
                                                <thead className="bg-primary">
                                                    <tr className="text-xs text-white">
                                                        <th className="font-semibold p-3 border border-[#5D686F30]">العمر</th>
                                                        <th className="font-semibold p-3 border border-[#5D686F30]">الأهلية</th>
                                                        <th className="font-semibold p-3 border border-[#5D686F30]">الحد الأدنى للفاتورة</th>
                                                        <th className="font-semibold p-3 border border-[#5D686F30]">الحد الأقصى للفاتورة</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-center text-xs">
                                                    <tr className=''>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">أقل من 18 عام</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">غير مؤهل</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">من 18 إلى 21 عام</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">أكبر من 21 عام</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">0 ريال</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">مؤهل</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">200 ريال</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">200 ريال</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">0 ريال</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">مؤهل</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">1,500 ريال</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">9,000 ريال</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <ul className="text-xs text-dark">
                                                <li className="my-2">- تحتفظ  بالحق في تعليق أو إلغاء أو تعديل أي من هذه الشروط والأحكام في أي وقت.</li>
                                                <li className="my-2">- تخضع هذه الشروط والأحكام الخاصة وتعديلاتها من وقت لآخر لقوانين المملكة العربية السعودية وتخضع حصريًا للاختصاص القضائي لمحاكمها.</li>
                                            </ul>
                                        </div>
                                        :
                                        <div className="py-2">
                                            <ul className="text-xs text-dark">
                                                <li className="my-2">- Pay with Tamara option is valid in all Tamkeen Stores stores and on Tamkeen Stores.com & mobile app in The Kingdom of Saudi Arabia.</li>
                                                <li className="my-2">- Pay with Tamara is available for all product categories excluding gift cards.</li>
                                                <li className="my-2">- Customers can split the invoice in 4 when they pay using Tamara.</li>
                                                <li className="my-2">- Minimum invoice value is 200 SR, and maximum invoice value is 9,000 SR to be eligible to pay with Tamara.</li>
                                                <li className="my-2">- Items bought with Tamara can’t be refunded in cash or gift cards, refund can be through Tamara only.</li>
                                                <li className="my-2">- Tamkeen Stores return & exchange policy applies for items purchased using Tamara.</li>
                                                <li className="my-2">- Tamkeen Stores will not have any obligations or liabilities for issues related to accounts, payments in Tamara app or web. For all technical-related issues please contact Tamara.</li>
                                                <li className="my-2">- Tamara payment option cannot be combined with any other payment option. In case of choosing Tamara as a payment method, the invoice value must be fully paid using Tamara only.</li>
                                                <li className="my-2">- Payment split might be on 4 non-equal splits based one customer's credit history and credit score. You can contact Tamara for more information.</li>
                                                <li className="my-2">- Customer must use the mobile number registered with Absher to complete the purchase using Tamara.</li>
                                                <li className="my-2">- Customer must settle all overdue payments with Tamara.</li>
                                                <li className="my-2">- Customers of Age 18 Years and older are Eligible to Pay with Tamara as follows:</li>
                                            </ul>
                                            <table className="border-collapse border border-[#5D686F30] my-6 w-full">
                                                <thead className="bg-primary">
                                                    <tr className="text-xs text-white">
                                                        <th className="font-semibold p-3 border border-[#5D686F30]">Age</th>
                                                        <th className="font-semibold p-3 border border-[#5D686F30]">Eligibility</th>
                                                        <th className="font-semibold p-3 border border-[#5D686F30]">Minimum Invoice Value</th>
                                                        <th className="font-semibold p-3 border border-[#5D686F30]">Maximum Invoice Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-center text-xs">
                                                    <tr className=''>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">Below 18 Years</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">Not Eligible</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">18-21 Years</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">Above 21 Years</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">SR 0</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">Eligible</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">SR 200</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">SR 200</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">SR 0</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">Eligible</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">SR 1,500</td>
                                                        <td className="font-normal p-3 border border-[#5D686F30]">SR 9,000</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <ul className="text-xs text-dark">
                                                <li className="my-2">- Customer must settle all overdue payments with Tamara.</li>
                                                <li className="my-2">- Customers of Age 18 Years and older are Eligible to Pay with Tamara as follows:</li>
                                            </ul>
                                        </div>
                                    }
                                </>
                            )}
                        </Disclosure>
                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton>
                                        <Image 
                                            src="https://images.tamkeenstores.com.sa/assets/new-media/fe4736f61bc0caab22719078aeffac4a1716289368.webp" 
                                            alt='Tabby' 
                                            title='Tabby' 
                                            height={0} 
                                            width={0} 
                                            className="h-full w-full rounded-t-md" 
                                            sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw'
                                        />
                                        <div className="flex w-full justify-between items-center rounded-b-md text-left text-lg font-medium ocus-visible:outline-none bg-[#EEF8FC] px-2 py-4 md:p-3 mb-3 text-[#004B7A]">
                                            <div className="gap-2 md:gap-10 flex">
                                                <span>{lang === "ar" ? "تابي" : "Tabby"}</span>
                                                <span>{lang === "ar" ? "تقسيط اربع اشهر" : "4 Months Installment"}</span>
                                            </div>
                                        </div>
                                    </DisclosureButton>
                                    {lang === "ar" ?
                                        <div className="py-2">
                                            <ul className="text-xs text-dark">
                                                <li className="my-2">- الدفع باستخدام تابي متاح بجميع معارض تمكين وعلى موقع معارض تمكين الإلكتروني وتطبيق معارض تمكين بالمملكة العربية السعودية.</li>
                                                <li className="my-2">- الدفع باستخدام تابي متاح على جميع المنتجات ماعدا بطاقات الهدايا.</li>
                                                <li className="my-2">- يمكن للعميل تقسيم قيمة الفاتورة بالكامل على 4 دفعات بدون رسوم أو فوائد عند الدفع باستخدام تابي.</li>
                                                <li className="my-2">- لاستخدام تابي للدفع يجب أن يكون الحد الأدنى لقيمة الفاتورة 200 ريال والحد الأقصى 9,000 ريال</li>
                                                <li className="my-2">- المنتجات التي يتم شراؤها باستخدام تابي لا يمكن استرجاع قيمتها نقداً أو عن طريق بطاقات الهدايا، الإرجاع يتم من خلال تابي.</li>
                                                <li className="my-2">- تطبق سياسة الإرجاع والاستبدال الخاصة بمعارض تمكين عند الشراء باستخدام تابي.</li>
                                                <li className="my-2">- معارض تمكين لن تكون مسؤولة عن أي التزامات أو مطالبات من أي نوع قد يتعرض لها العميل والتي قد تكون مرتبطة بحساب العميل أو بالسداد في تطبيق تابي. للمشاكل التقنية في تطبيق أو موقع تابي، يرجى التواصل مع فريق خدمة عملاء تابي.</li>
                                                <li className="my-2">- ﻻ ﻳﻤﻜﻦ اﻟﺠﻤﻊ ﺑﻴﻦ ﺧﻴﺎر اﻟﺪﻓﻊ ﺑﺘابي وأي ﺧﻴﺎر دﻓﻊ آﺧﺮ. في حالة اختيار تابي كطريقة للدفع، ﻳﺠﺐ دﻓﻊ ﻗﻴﻤﺔ اﻟﻔﺎﺗﻮرة ﺑﺎﻟﻜﺎﻣﻞ ﺑﺎﺳﺘﺨﺪام تابي ﻓﻘﻂ.</li>
                                                <li className="my-2">- قد يتم تقسيم قيمة الفاتورة على 4 دفعات غير متساوية بناء على تاريخ الائتماني والتقييم الائتماني للعميل. يمكنك التواصل مع تابي للمزيد من المعلومات.</li>
                                                <li className="my-2">- يجب على العميل استخدام رقم الجوال المسجل في أبشر لإتمام عميلة الشراء باستخدام تابي.</li>
                                                <li className="my-2">- يجب على العميل تسوية جميع الدفعات مستحقة السداد مع تابي.</li>
                                                <li className="my-2">- يعتمد قبول الطلب على عدد من العوامل بما في ذلك نوع المنتجات التي تشتريها وتاريخ سدادك لدفعات تابي السابقة.</li>
                                                <li className="my-2">- يحق للعملاء بالمملكة العربية السعودية بعمر 18 عام أو أكبر الشراء باستخدام تابي.</li>
                                                <li className="my-2">- تحتفظ معارض تمكين بالحق في تعليق أو إلغاء أو تعديل أي من هذه الشروط والأحكام في أي وقت.</li>
                                                <li className="my-2">- تخضع هذه الشروط والأحكام الخاصة وتعديلاتها من وقت لآخر لقوانين المملكة العربية السعودية وتخضع حصريًا للاختصاص القضائي لمحاكمها.</li>
                                            </ul>
                                        </div>
                                        :
                                        <div className="py-2">
                                            <ul className="text-xs text-dark">
                                                <li className="my-2">- Pay with Tabby Option is valid in all Tamkeen Stores Stores and on <a href="https://tamkeenstores.com.sa" className="underline">Tamkeen Stores</a> & mobile app in The Kingdom of Saudi Arabia.</li>
                                                <li className="my-2">- Pay with Tabby is available for all Product Categories excluding Gift Cards.</li>
                                                <li className="my-2">- Customers can split the total invoice payment in 4 without interest or fees when they pay using Tabby.</li>
                                                <li className="my-2">- Minimum invoice value is 200 SR, and maximum invoice value is 9,000 SR to be eligible to pay with Tabby.</li>
                                                <li className="my-2">- Items bought with Tabby can’t be refunded in cash or gift cards, refund can be through Tabby only.</li>
                                                <li className="my-2">- Tamkeen Stores’s return & exchange policy applies for items purchased using Tabby.</li>
                                                <li className="my-2">- Tamkeen Stores will not have any obligations or liabilities for issues related to Accounts, Payments in Tabby App or Web. For all technical-related issues Please Contact Tabby.</li>
                                                <li className="my-2">- Tabby payment option cannot be combined with any other payment option. In case of choosing Tabby as a payment method, the invoice value must be fully paid using Tabby only.</li>
                                                <li className="my-2">- Payment split might be on 4 non-equal splits based one customer's credit history and credit score. You can contact Tabby for more information.</li>
                                                <li className="my-2">- Customer must use the mobile number registered with Absher to complete the purchase using Tabby.</li>
                                                <li className="my-2">- Customer must settle all overdue payments with Tabby.</li>
                                                <li className="my-2">- To keep shopping safe, spending limits are based on a number of factors including the type of products you're buying, and your history with Tabby.</li>
                                                <li className="my-2">- Customers in The Kingdom of Saudi Arabia of Age 18 Years and older are Eligible to Pay with Tabby.</li>
                                                <li className="my-2">- Tamkeen Stores reserves the right to suspend, cancel or amend any of these terms and conditions at any time.</li>
                                                <li className="my-2">- These special Terms and Conditions and its amendments from time to time shall be governed by the laws of Kingdom of Saudi Arabia and subject exclusively jurisdiction of its courts.</li>
                                            </ul>
                                        </div>
                                    }
                                </>
                            )}
                        </Disclosure>
                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton>
                                        <Image 
                                            src="https://images.tamkeenstores.com.sa/assets/new-media/7df3b6cf7ed89268ed3b605dbd9d2dac1716289368.webp" 
                                            alt='Baseeta' 
                                            title='Baseeta' 
                                            height={0} 
                                            width={0} 
                                            className="h-full w-full rounded-t-md" 
                                            sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw'
                                        />
                                        <div className="flex w-full justify-between items-center rounded-b-md text-left text-lg font-medium ocus-visible:outline-none bg-[#EEF8FC] px-2 py-4 md:p-3 mb-3 text-[#004B7A]">
                                            <div className="gap-2 md:gap-10 flex">
                                                <span>{lang === "ar" ? "بسيطة" : "Baseeta"}</span>
                                                <span>{lang === "ar" ? "تقسيط على 36 شهر" : "36 Months Installment"}</span>
                                            </div>
                                        </div>
                                    </DisclosureButton>
                                    {lang === "ar" ?
                                        <Image 
                                            src="https://images.tamkeenstores.com.sa/assets/new-media/baseeta_ar.webp" 
                                            alt='BaseetaAr' 
                                            title='Baseeta-Ar' 
                                            height={0} 
                                            width={0} 
                                            className="h-full w-full rounded-t-md" 
                                            sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw'
                                        />
                                        :
                                        <Image 
                                            src="https://images.tamkeenstores.com.sa/assets/new-media/1a59ef48ac2e95e6dabb768c1b8278cb1717486312.webp" 
                                            alt='BaseetaAr' 
                                            title='Baseeta-Ar'
                                            height={0} 
                                            width={0} 
                                            className="h-full w-full rounded-t-md" 
                                            sizes='(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw'
                                        />
                                    }
                                </>
                            )}
                        </Disclosure>
                    </div>
                </div>
            </div >
        </>
    )
}
