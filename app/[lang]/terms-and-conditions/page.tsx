"use client"; // This is a client component 👈🏽

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { useApp } from "@/app/_ctx/AppContext";

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function TermsandConditions() {
    const { lang } = useApp();
    return (
        <div>
            <MobileHeader type="Third" lang={lang} pageTitle={lang === 'ar' ? 'الاسئلة والاجوبة' : 'Terms and Conditions'} />
            <div className="container py-16">
                <div className="my-6 text-[#5D686F]">
                    <p className="text-xs md:text-sm mb-3 leading-5">
                        {lang === 'ar' ?
                            `مرحبا بكم في www.tamkeenstores.com.sa تمكين الدولية للأجهزة المنزلية (يشار إليها باسم “الموقع / الخدمة عبر الإنترنت) ان هذا الموقع ومحتوياته تابع لشركة تمكين للأجهزة المنزلية الواقعة بالمملكة العربية السعودية وتتولى تشغيله بشكل كامل .كمستخدم للموقع يجب عليك الاطلاع علي الشروط والأحكام الواردة أدناه والإقرار بها. من خلال الشراء عبر الموقع، فإنك توافق على الالتزام بالشروط والأحكام. يرجي الاطلاع عليها بعناية قبل استخدام الخدمة عبر الإنترنت..  وعليه يرجى منك مراجعة قائمة الشروط والأحكام بدقة قبل البدء باستخدام الموقع الالكتروني، مع العلم أننا نحتفظ بحق تعديلها من قبلنا في أي وقت، واستمرارك باستخدام الموقع الالكتروني بعد تعديلها يعد موافقة على الالتزام بالشروط والأحكام التي تم تعديلها.`
                            :
                            "Welcome to www.tamkeenstores.com.sa Tamkeen International for Home Appliances (referred to as the “Site/Online Service”) This site and its contents belong to Tamkeen Home Appliances Company located in the Kingdom of Saudi Arabia and are fully operated by it. As a user of the site, you must read and acknowledge the terms and conditions stated below. By purchasing through the Site, you agree to be bound by the Terms and Conditions. Please review carefully before using the online service. Accordingly, you are kindly requested to review the list of terms and conditions carefully before starting to use the website, knowing that we reserve the right to amend them at any time, and your continued use of the website after they are amended constitutes an agreement to abide by the amended terms and conditions."
                        }
                    </p>
                    <p className="underline text-semibold text-xs md:text-sm text-dark">
                        {lang === 'ar' ?
                            "اضغط على العنوان لقراءة الشروط:"
                            :
                            "Click on the title to read the terms and conditions:"
                        }
                    </p>
                    <div className="grid md:grid-cols-2 md:gap-4 mt-3">
                        <div>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "شروط و أحكام العروض الحالية" : "Terms and conditions for current offers"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">

                                            <div className='mb-2.5'>
                                                <p className="mb-2.5">{lang === 'ar' ? `يسري هذا العرض من تاريخ 10 فبراير – الى تاريخ 04 مارس.` : 'This offer is valid from February 10 till March 04.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'عرض الضريبة علينا على منتجات جنرال سوبريم و كريازي و جولد تك.' : 'VAT On Us Promotion on General Supreme, Kiriazi, Gold Tech Products.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'خصم اضافي 5% و 10% على أكثر من 470 صنف من منتجات أخرى.' : 'Additional discounts of 05% and 10% on more than 470 products.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'تركيب مكيف مجاني على الموديلات المختارة.' : 'Free AC installation on selected models.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'هدايا مجانية ادوات المطبخ من Luminarc وايضا من جنرال سوبريم عند شراء ب 1499 ريال و أكثر من منتجات جنرال سوبريم.(يطبق العرض في الموقع و الفروع)' : 'Gifts from Luminarc kitchenware and from General Supreme on purchases of 1499 SR and above from General Supreme products. (This offer is valid Online & Branches).'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'هدية مجانية مريلة الطبخ عند شراء الافران و الأجهزة المدمجة من منتجات جنرال سوبريم. (يطبق العرض عبر الفروع فقط)' : 'Free Apron gift when purchasing free-standing cookers and built-in products of General Supreme (Offer applies across branches only)'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'في حالة الشراء من المتجر الالكتروني يرجي مراجعة الشروط و الأحكام الخاصة بالاسترجاع.' : 'Free gifts from Hommer when purchasing 999 Riyals or more of General Supreme products. (Offer applies across branches only)'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'هدايا مجانية من شركة هومر عند شراء ب 999 ريال و أكثر من منتجات جنرال سوبريم. (يطبق العرض عبر الفروع فقط)' : 'Free Starz Play subscription when purchasing General Supreme products. ((The offer applies via the website only and also until sock last)'}</p>

                                                <p className="mb-2.5">{lang === 'ar' ? 'اشتراكات استارز بلاي مجانية عند شراء منتجات جنرال سوبريم. (يطبق العرض عبر الموقع فقط و ايضا حتى نفاذ الكمية)' : 'If you purchase from the online store, please review the terms and conditions regarding returns.'}</p>

                                                <p className="mb-2.5">{lang === 'ar' ? 'لا يسري العرض المذكور مع أي عرض آخر' : 'The mentioned offer cannot be combined with any other offers.'}</p>

                                                <p className="mb-2.5">{lang === 'ar' ? 'تسعى معارض تمكين على التوصيل المنزلي خلال ٢٤ ساعة في مدن جدة - مكة المكرمة - الرياض - الخبر والدمام - الإحساء - أبها وخميس مشيط - نطاق مدين نجران - نطاق مدينة جيزان ما دامت المنتجات متوفرة في المستودعات الرئيسية لهذه المدن ولم يشر مسؤول المعرض بغير ذلك على أصل الفاتورة' : 'Tamkeen Exhibitions aims for home delivery within 24 hours in the cities of Jeddah, Makkah, Riyadh, Khobar, Dammam, Al-Ahsa, Abha, and Khamis Mushait, as well as in the regions of Najran and Jizan, provided the products are available in the main warehouses of these cities and unless stated otherwise by the exhibition representative on the original invoice.'}</p>

                                                <p className="mb-2.5">{lang === 'ar' ? 'في حالة الشراء من المتجر الالكتروني سيتم التوصيل خلال 48 ساعة في مدن جدة - مكة المكرمة - الرياض - الخبر والدمام - الإحساء - أبها وخميس مشيط - نطاق مدينة نجران - نطاق مدينة جيزان ما دامت المنتجات متوفرة في المستودعات الرئيسية لهذه المدن و يرجي مراجعه الشروط و الاحكام الخاصة بتوصيل و تسليم المنتجات' : 'For purchases from the online store, delivery will be within 48 hours in the cities of Jeddah, Makkah, Riyadh, Khobar, Dammam, Al-Ahsa, Abha, and Khamis Mushait, as well as in the regions of Najran and Jizan, provided the products are available in the main warehouses of these cities. Please review the terms and conditions related to the delivery and shipment of products.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? '.عرض التوصيل المجاني يشمل المدن الآتية: جدة،مكة،الرياض،الدمام،الخبر على جميع المنتجات خلال فترة العرض' : 'The free delivery offer includes the following cities: Jeddah, Makkah, Riyadh, Dammam, and Khobar for all products during the promotional period.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'خدمة التركيب المجاني للمكيفات اسبليت و شباك متاحة في المدن التالية: (جدة،مكة،الرياض،الدمام،الخبر،حفر الباطن،جيزان،نجران،ابها،خميس مشيط،ابوعريش،ينبع)' : 'Free installation service for split and window air conditioners is available in the following cities: Jeddah, Makkah, Riyadh, Dammam, Khobar, Hafr Al-Batin, Jizan, Najran, Abha, Khamis Mushait, Abu Arish, and Yanbu.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'خدمة التركيب المجاني للمكيفات اسبليت و شباك متاحة في المدن التالية: (جدة،مكة،الرياض،الدمام،الخبر،حفر الباطن،جيزان،نجران،ابها،خميس مشيط،ابوعريش،ينبع)' : 'Installment payment options are available through Madfooa, Misbai, Tamara, and Tabby, noting that the number of installments and their amounts are determined by the installment service companies according to their credit policies, with no intervention or responsibility from Tamkeen. Invoices can only be issued upon approval of the order status from the installment service provider'}</p>
                                            </div>
                                            {/*<div className='mb-2.5'>
                                                <p className="mb-2.5">{lang === 'ar' ? `يسري هذا العرض من تاريخ 23 – نوفمبر وحتى 30 – نوفمبر أو حتى نفاذ الكمية` : 'This offer is valid from November 23 to November 30, or until stocks run out.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'تخفيضات تبدأ من 20% و تصل الى 55%' : 'Discounts start from 20% and go up to 55%'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'خصومات إضافية تصل الى 15% على العديد من المنتجات المختارة' : 'Additional discounts of up to 15% on many selected products.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'اشترِ منتج و احصل على الاخر ب 11 ريال فقط' : 'Buy one product and get another for only 11 Riyals.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? '(عند شراءك جهاز من تشكيلة واسعة من الأجهزة الكبيرة  يمكنك الحصول على جهاز من الأجهزة الصغيرة فقط بسعر  11 ريا ل) على منتجات مختارة' : '(When you purchase a large appliance, you can get a small appliance for just 11 Riyals.)On selected products'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'خصم اضافي 10% على جميع الأجهزة المنزلية الصغيرة ومنتجات العناية الشخصية' : 'An additional 10% discount on all small appliances and personal care products.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'في حالة الشراء من المتجر الالكتروني يرجي مراجعة الشروط و الأحكام الخاصة بالاسترجاع' : 'If you purchase from the online store, please review the terms and conditions regarding returns.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'لا يسري العرض المذكور مع أي عرض آخر' : 'The mentioned offer cannot be combined with any other offers.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'تسعى معارض تمكين على التوصيل المنزلي خلال ٢٤ ساعة في مدن جدة - مكة المكرمة - الرياض - الخبر والدمام - الإحساء - أبها وخميس مشيط - نطاق مدين نجران - نطاق مدينة جيزان ما دامت المنتجات متوفرة في المستودعات الرئيسية لهذه المدن ولم يشر مسؤول المعرض بغير ذلك على أصل الفاتورة' : 'Tamkeen Exhibitions aims for home delivery within 24 hours in the cities of Jeddah, Makkah, Riyadh, Khobar, Dammam, Al-Ahsa, Abha, and Khamis Mushait, as well as in the regions of Najran and Jizan, provided the products are available in the main warehouses of these cities and unless stated otherwise by the exhibition representative on the original invoice.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'في حالة الشراء من المتجر الالكتروني سيتم التوصيل خلال 48 ساعة في مدن جدة - مكة المكرمة - الرياض - الخبر والدمام - الإحساء - أبها وخميس مشيط - نطاق مدينة نجران - نطاق مدينة جيزان ما دامت المنتجات متوفرة في المستودعات الرئيسية لهذه المدن و يرجي مراجعه الشروط و الاحكام الخاصة بتوصيل و تسليم المنتجات' : 'For purchases from the online store, delivery will be within 48 hours in the cities of Jeddah, Makkah, Riyadh, Khobar, Dammam, Al-Ahsa, Abha, and Khamis Mushait, as well as in the regions of Najran and Jizan, provided the products are available in the main warehouses of these cities. Please review the terms and conditions related to the delivery and shipment of products.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'عرض التوصيل المجاني يشمل المدن الآتية: جدة،مكة،الرياض،الدمام،الخبر على جميع المنتجات خلال فترة العرض' : 'The free delivery offer includes the following cities: Jeddah, Makkah, Riyadh, Dammam, and Khobar for all products during the promotional period.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'خدمة التركيب المجاني للمكيفات اسبليت و شباك متاحة في المدن التالية: (جدة،مكة،الرياض،الدمام،الخبر،حفر الباطن،جيزان،نجران،ابها،خميس مشيط،ابوعريش،ينبع' : 'Free installation service for split and window air conditioners is available in the following cities: Jeddah, Makkah, Riyadh, Dammam, Khobar, Hafr Al-Batin, Jizan, Najran, Abha, Khamis Mushait, Abu Arish, and Yanbu.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'يتوفر طرق التقسيط من خلال مدفوع – ميس باي – تمارا – تابي مع الاشارة إلى ان عدد الاقساط المتاحة وقيم الاقساط من شأن شركات التقسيط مقدمة الخدمة و حسب سياستها الائتمانية دون ادنى تدخل او مسؤولية من تمكين ولا يمكن إصدار الفاتورة إلا' : 'Installment payment options are available through Madfooa, Misbai, Tamara, and Tabby, noting that the number of installments and their amounts are determined by the installment service companies according to their credit policies, with no intervention or responsibility from Tamkeen. Invoices can only be issued upon approval of the order status from the installment service provider.'}</p>
                                            </div>
                                            <div className='mb-2.5'>
                                                <p className="mb-2.5">{lang === 'ar' ? `11/11 offers يسري هذا العرض من تاريخ 23 – نوفمبر وحتى 30 – نوفمبر أو حتى نفاذ الكمية` : 'This offer is valid from November 23 to November 30, or until stocks run out.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'تخفيضات تبدأ من 20% و تصل الى 55%' : 'Discounts start from 20% and go up to 55%.  '}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'خصومات إضافية تصل الى 15% على العديد من المنتجات المختارة' : 'Additional discounts of up to 15% on many selected products.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'الضريبة علينا على منتجات مختارة' : 'VAT on Us for selected products.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'اشترِ منتج و احصل على الاخر ب 11 ريال فقط' : 'Buy one product and get another for only 11 Riyals.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? '(عند شراءك جهاز من تشكيلة واسعة من الأجهزة الكبيرة  يمكنك الحصول على جهاز من الأجهزة الصغيرة فقط بسعر  11 ريا ل) على منتجات مختارة' : '(When you purchase a large appliance, you can get a small appliance for just 11 Riyals.) On selected products  '}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'خصم اضافي 10% على جميع الأجهزة المنزلية الصغيرة ومنتجات العناية الشخصية' : 'An additional 10% discount on all small appliances and personal care products.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'في حالة الشراء من المتجر الالكتروني يرجي مراجعة الشروط و الأحكام الخاصة بالاسترجاع' : 'If you purchase from the online store, please review the terms and conditions regarding returns.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'لا يسري العرض المذكور مع أي عرض آخر' : 'The mentioned offer cannot be combined with any other offers.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'تسعى معارض تمكين على التوصيل المنزلي خلال ٢٤ ساعة في مدن جدة - مكة المكرمة - الرياض - الخبر والدمام - الإحساء - أبها وخميس مشيط - نطاق مدين نجران - نطاق مدينة جيزان ما دامت المنتجات متوفرة في المستودعات الرئيسية لهذه المدن ولم يشر مسؤول المعرض بغير ذلك على أصل الفاتورة' : 'Tamkeen Exhibitions aims for home delivery within 24 hours in the cities of Jeddah, Makkah, Riyadh, Khobar, Dammam, Al-Ahsa, Abha, and Khamis Mushait, as well as in the regions of Najran and Jizan, provided the products are available in the main warehouses of these cities and unless stated otherwise by the exhibition representative on the original invoice.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'في حالة الشراء من المتجر الالكتروني سيتم التوصيل خلال 48 ساعة في مدن جدة - مكة المكرمة - الرياض - الخبر والدمام - الإحساء - أبها وخميس مشيط - نطاق مدينة نجران - نطاق مدينة جيزان ما دامت المنتجات متوفرة في المستودعات الرئيسية لهذه المدن و يرجي مراجعه الشروط و الاحكام الخاصة بتوصيل و تسليم المنتجات' : 'For purchases from the online store, delivery will be within 48 hours in the cities of Jeddah, Makkah, Riyadh, Khobar, Dammam, Al-Ahsa, Abha, and Khamis Mushait, as well as in the regions of Najran and Jizan, provided the products are available in the main warehouses of these cities. Please review the terms and conditions related to the delivery and shipment of products.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? '.عرض التوصيل المجاني يشمل المدن الآتية: جدة،مكة،الرياض،الدمام،الخبر على جميع المنتجات خلال فترة العرض' : 'The free delivery offer includes the following cities: Jeddah, Makkah, Riyadh, Dammam, and Khobar for all products during the promotional period.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'خدمة التركيب المجاني للمكيفات اسبليت و شباك متاحة في المدن التالية: (جدة،مكة،الرياض،الدمام،الخبر،حفر الباطن،جيزان،نجران،ابها،خميس مشيط،ابوعريش،ينبع' : 'Free installation service for split and window air conditioners is available in the following cities: Jeddah, Makkah, Riyadh, Dammam, Khobar, Hafr Al-Batin, Jizan, Najran, Abha, Khamis Mushait, Abu Arish, and Yanbu.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? `يتوفر طرق التقسيط من خلال مدفوع – ميس باي – تمارا – تابي مع الاشارة إلى ان عدد الاقساط المتاحة وقيم الاقساط من شأن شركات التقسيط مقدمة الخدمة و حسب سياستها الائتمانية دون ادنى تدخل او مسؤولية من تمكين ولا يمكن إصدار الفاتورة إلا بالموافقة على حالة الطلب من شركة مقدمة خدمة التقسيط` : 'Installment payment options are available through Madfooa, Misbai, Tamara, and Tabby, noting that the number of installments and their amounts are determined by the installment service companies according to their credit policies, with no intervention or responsibility from Tamkeen. Invoices can only be issued upon approval of the order status from the installment service provider.'}</p>
                                            </div>
                                            <div className='mb-2.5'>
                                                <p className="mb-2.5">{lang === 'ar' ? 'عروض مذهلة' : 'November Offers'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'يسري هذا العرض من تاريخ 05 – نوفمبر وحتى 20 – نوفمبر أو حتى نفاذ الكمية' : 'This offer is valid from November 5th to November 20th or until supplies last.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'احصل على استرداد نقدي 50 ريال لكل عملية شراء بمبلغ 999 على منتجات مختار من الشاشات و المكيفات و الأجهزة المنزلية الكبيرة' : 'Get 50 riyals cashback for every 999-riyal purchase on selected products, including screens, air conditioners, and large home appliances.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'احصل على استرداد نقدي 10% على الأجهزة المنزلية الصغير ومنتجات العناية الشخصية' : 'Get 10% cashback on small home appliances and personal care products'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'و في حالة الشراء من المتجر الالكتروني يرجي مراجعة يرجي مراجعة الشروط و الأحكام الخاصة بالاسترجاع' : 'If you purchase from the online store, please review the terms and conditions for return'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'لا يسري العرض المذكور مع أي عرض آخر' : 'The mentioned offer is not valid with any other offer'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'تسعى معارض تمكين على التوصيل المنزلي خلال ٢٤ ساعة في مدن جدة - مكة المكرمة - الرياض - الخبر والدمام - الإحساء - أبها وخميس مشيط - نطاق مدين نجران - نطاق مدينة جيزان ما دامت المنتجات متوفرة في المستودعات الرئيسية لهذه المدن ولم يشر مسؤول المعرض بغير ذلك على أصل الفاتورة' : 'Tamkeen showrooms aim to deliver within 24 hours in the cities of Jeddah, Makkah, Riyadh, Khobar, Dammam, Al-Ahsa, Abha, and Khamis Mushait, within the city limits of Najran and Jazan, as long as the products are available in the main warehouses of these cities and no other instructions are given by the showroom manager on the original invoice.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'في حالة الشراء من المتجر الالكتروني سيتم التوصيل خلال 48 ساعة في مدن جدة - مكة المكرمة - الرياض - الخبر والدمام - الإحساء - أبها وخميس مشيط - نطاق مدينة نجران - نطاق مدينة جيزان ما دامت المنتجات متوفرة في المستودعات الرئيسية لهذه المدن و يرجي مراجعه الشروط و الاحكام الخاصة بتوصيل و تسليم المنتجات' : 'For online purchases, delivery will take place within 48 hours in the cities of Jeddah, Makkah, Riyadh, Khobar, Dammam, Al-Ahsa, Abha, and Khamis Mushait, within the city limits of Najran and Jazan, as long as the products are available in the main warehouses of these cities. Please review the terms and conditions for product delivery.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? '.عرض التوصيل المجاني يشمل المدن الآتية: جدة،مكة،الرياض،الدمام،الخبر على جميع المنتجات خلال فترة العرض' : 'Installment plans are available through Madfua, mispay, Tamara, and Tabby, noting that the number of installments and the installment amounts are determined by the installment service provider and according to their credit policy, without any intervention or responsibility from Tamkeen. The invoice can only be issued upon approval of the request by the installment service provider.'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'خدمة التركيب المجاني للمكيفات اسبليت و شباك متاحة في المدن التالية: (جدة،مكة،الرياض،الدمام،الخبر،حفر الباطن،جيزان،نجران،ابها،خميس مشيط،ابوعريش،ينبع' : 'The free delivery offer applies to all products during the promotional period in the following cities: Jeddah, Mecca, Riyadh, Dammam, and Khobar'}</p>
                                                <p className="mb-2.5">{lang === 'ar' ? 'يتوفر طرق التقسيط من خلال مدفوع – ميس باي – تمارا – تابي مع الاشارة إلى ان عدد الاقساط المتاحة وقيم الاقساط من شأن شركات التقسيط مقدمة الخدمة و حسب سياستها الائتمانية دون ادنى تدخل او مسؤولية من تمكين ولا يمكن إصدار الفاتورة إلا بالموافقة على حالة الطلب من شركة مقدمة خدمة التقسيط' : 'The free installation service for split and window air conditioners is available in the following cities: (Jeddah, Mecca, Riyadh, Dammam, Khobar, Hafar Al-Batin, Jizan, Najran, Abha, Khamis Mushait, Abu Arish, Yanbu).'}</p>
                                            </div>*/}
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "شروط الاستخدام" : "TERMS of use"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? 'تحميل التطبيق' : 'Download the application'}</p>
                                            <p className="mb-2.5">
                                                {lang === 'ar' ?
                                                    'يتاح استخدام الموقع فقط للأشخاص الذين يمكنهم تكوين عقود ملزمة قانونا بموجب القانون المعمول به. لا يحق للأشخاص الذين لا يتمتعون بالأهلية للتعاقد حسب قوانين العقود المحلية استخدام الموقع.'
                                                    :
                                                    'Use of the Site is available only to persons who can form legally binding contracts under applicable law. Persons who do not have the capacity to contract under local contract laws are not entitled to use the Site.'
                                                }
                                            </p>
                                            <p className="mb-2.5">
                                                {lang === 'ar' ?
                                                    'يتاح استخدام الموقع فقط للأشخاص الذين يمكنهم تكوين عقود ملزمة قانونا بموجب القانون المعمول به. لا يحق للأشخاص الذين لا يتمتعون بالأهلية للتعاقد حسب قوانين العقود المحلية استخدام الموقع.'
                                                    :
                                                    'Use of the Site is available only to persons who can form legally binding contracts under applicable law. Persons who do not have the capacity to contract under local contract laws are not entitled to use the Site.'
                                                }
                                            </p>
                                            <p className="mb-2.5">
                                                {lang === 'ar' ?
                                                    'يتاح استخدام الموقع فقط للأشخاص الذين يمكنهم تكوين عقود ملزمة قانونا بموجب القانون المعمول به. لا يحق للأشخاص الذين لا يتمتعون بالأهلية للتعاقد حسب قوانين العقود المحلية استخدام الموقع.'
                                                    :
                                                    'Use of the Site is available only to persons who can form legally binding contracts under applicable law. Persons who do not have the capacity to contract under local contract laws are not entitled to use the Site.'
                                                }
                                            </p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "الحماية الأمنية للموقع الإلكتروني" : "Website security"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "يحظر عليك انتهاك أو محاولة انتهاك أمن الموقع، بما في ذلك على سبيل المثال لا الحصر:"
                                                :
                                                "You are prohibited from violating or attempting to violate the security of the Site, including without limitation:"}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "الوصول إلى البيانات غير المخصصة لك أو تسجيل الدخول إلى خادم أو حساب غير مصرح لك بالوصول إليه"
                                                :
                                                "Access data not intended for you or log into a server or account that you are not authorized to access."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "محاولة التحقيق في ضعف النظام أو الشبكة أو مسحها أو اختبارها أو الإخلال بتدابير الأمن أو التوثيق دون الحصول علي إذن مناسب."
                                                :
                                                "Attempting to investigate, scan, or test the vulnerability of a system or network, or to breach security or authentication measures, without obtaining appropriate authorization."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "محاولة التدخل في الخدمة لأي مستخدم أو مضيف أو شبكة أخرى، بما في ذلك، على سبيل المثال لا الحصر، عن طريق تقديم فيروس إلى موقع الويب، أو التحميل الزائد، “البريد غير المرغوب فيه، “تفجير البريد ” أو تعطيله”."
                                                :
                                                "Attempting to interfere with service to any other user, host or network, including, without limitation, by submitting a virus to the Website, overloading, “spamming,” “mail bombing” or crashing."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "إرسال بريد إلكتروني غير مرغوب فيه، بما في ذلك العروض الترويجية و/أو الإعلان عن المنتجات أو الخدمات."
                                                :
                                                "Sending unsolicited email, including promotions and/or advertising of products or services."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                " تزوير أي رأسية لحزمة بروتوكول الإنترنت/ بروتوكول التحكم بالنقل أو أي جزء من معلومات الرأسية في أي بريد إلكتروني أو نشر مجموعة أخبار. قد تؤدي انتهاكات أمن النظام أو الشبكة إلى المساءلة المدنية أو الجنائية."
                                                :
                                                "Forge any IP/TCP packet header or any part of the header information in any e-mail or newsgroup posting. Violations of system or network security may result in civil or criminal liability."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "نك توافق على عدم استخدام أي جهاز أو برنامج أو روتين للتدخل أو محاولة التدخل في العمل السليم للموقع أو أي نشاط يتم إجراؤه على الموقع. وسيحقق الموقع الشبكي في الحوادث التي قد تنطوي على مثل هذه الانتهاكات، وقد يتضمن ذلك سلطات إنفاذ القانون والتعاون معها لمقاضاة المستخدمين المتورطين في هذه الانتهاكات"
                                                :
                                                "You agree not to use any device, software or routine to interfere or attempt to interfere with the proper working of the Site or any activity conducted on the Site. The Website will investigate incidents that may involve such violations, and this may involve and cooperate with law enforcement authorities to prosecute users who are involved in such violations."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "سياسة الخصوصية" : "Privacy Policy"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "نعتبر حماية خصوصيتك مبدأ مجتمعي مهم للغاية. نتفهم بوضوح أنك ومعلوماتك تشكلان واحدة من أهم أصولنا. نقوم بتخزين ومعالجة معلوماتك على خوادمنا الموجودة في المملكة العربية السعودية والمحمية بواسطة أجهزة الأمن المادية والتكنولوجية. ونستخدم أطرافًا ثالثة للتحقق من مبادئ الخصوصية الخاصة بنا والتصديق عليها. في حالة اعتراضك على نقل معلوماتك أو استخدامها بأي شكل من الأشكال، يرجى إرسال طلبك contact@tamkeenstores.com.sa أو عدم استخدام الموقع."
                                                :
                                                "We consider protecting your privacy a very important community principle. We clearly understand that you and your information constitute one of our most important assets. We store and process your information on our servers located in the Kingdom of Saudi Arabia and protected by physical and technological security devices. We use third parties to verify and certify our privacy principles. If you object to your information being transferred or used in any way, please send your request to contact@tamkeenstores.com.sa or do not use the website."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "نلتزم بعدم بيع أو تأجير معلوماتك إلى أي طرف ثالث دون الحصول على موافقتك الصريحة."
                                                :
                                                "We are committed not to sell or rent your information to any third party without obtaining your express consent."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "طبقاً لنظام حماية البيانات الشخصية بالمملكة العربية السعودية، تمكين تحصل على عنوان العميل من العميل شخصياً بغرض استخدامه للتوصيل المنزلي لطلبات العميل أو لتنفيذ زيارات الصيانة المنزلية فقط."
                                                :
                                                "In accordance with the personal data protection system in the Kingdom of Saudi Arabia, Tamkeen obtains the customer’s address from the customer personally for the purpose of using it for home delivery of the customer’s orders or to carry out home maintenance visits only."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "التسجيل – حسابي" : "Registration - your account"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "يشمل التسجيل المعلومات (معلوماتك) التي تحتاج إلى تزويدنا بها للتعامل معنا وكذلك للاتصال بك. إنك توافق على أنه يجوز لنا استخدام (وتحديث) معلوماتك لإدارة تسجيلك والتحكم في هويتك أثناء عملية الدفع عبر الإنترنت."
                                                :
                                                "Registration includes the information (your information) that you need to provide to us in order to deal with us and to contact you. You agree that we may use (and update) your information to manage your registration and control your identity during the online checkout process."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                " نلتزم بحماية البيانات التي تقدمها أثناء التسجيل وفقًا لسياسة الخصوصية الخاصة بنا. ستشكل معلوماتك جزءًا من سجل تعاملاتك معنا. إذا كنت تستخدم موقع الويب، فإنك تتحمل المسؤولية عن الحفاظ على سرية حسابك وكلمة المرور الخاصة بك وتقييد الوصول إلى جهاز الكمبيوتر الخاص بك، وتوافق على قبول المسؤولية عن جميع الأنشطة التي تحدث بموجب حسابك أو كلمة المرور الخاصة بك."
                                                :
                                                "We are committed to protecting the data you provide during registration in accordance with our Privacy Policy. Your information will form part of the record of your dealings with us. If you use the Website, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "لا يتحمل الموقع أي مسؤولية تجاه أي شخص عن أي خسارة أو ضرر قد ينشأ نتيجة لأي إخفاق من جانبك في حماية كلمة المرور أو الحساب الخاص بك. سيتم الإخطار بأي أنشطة مشبوهة على حسابك عن طريق الاتصال بنا على الفور من خلال أي وسيلة من وسائل الاتصال بنا."
                                                :
                                                "The site does not bear any responsibility to anyone for any loss or damage that may arise as a result of any failure on your part to protect your password or account. Any suspicious activities on your account will be notified by contacting us immediately through any of our contact methods."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "مراجعات المنتجات و البائعين" : "Product & Seller Reviews"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? "يلتزم العملاء الذين يكملون مراجعات المنتج و/ أو البائعين بتزويد tamkeenstores.com.sa بالملكية الكاملة والترخيص لإعادة إنتاج مراجعاتهم في أي مواد تسويقية ونشرها على الموقع الإلكتروني وفي المواد التسويقية دون الحاجة إلي موافقة إضافية من العملاء استنادًا إلى تقديم المراجعة." : "Customers who complete product and/or seller reviews are obligated to provide tamkeenstores.com.sa with full ownership and licence to reproduce their reviews in any marketing materials and publish them on the website and in marketing materials without the need for additional consent from customers based on submitting the review."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "عربة التسوق الخاصة بك" : "Your shopping cart"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "نحتفظ بالحق، وفقًا تقديرنا الخاص، في الحد من كمية العناصر المختارة لكل شخص"
                                                :
                                                "We reserve the right, at our sole discretion, to limit the quantity of items selected per person."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "قد تنطبق القيود المذكورة على الطلبات المقدمة من نفس الحساب، ونفس بطاقة الائتمان / بطاقة مدى، وكذلك على الطلبات التي تستخدم نفس عنوان الفوترة و/أو الشحن. وسوف نقدم إشعارا للعميل في حالة تطبيق مثل هذه القيود."
                                                :
                                                "The aforementioned restrictions may apply to orders placed from the same account, the same credit card/mada card, as well as to orders using the same billing and/or shipping address. We will provide notice to the customer if such restrictions apply."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "معلومات المنتجات والمخزون والتسعير" : "Product information, stock, and pricing"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "في حين يسعى الموقع جاهدا لتوفير معلومات دقيقة عن المنتجات (مثل توافر المخزون والتسعير وميزات المنتجات والصور والمواصفات) ومعلومات الخدمات ، قد تحدث أخطاء مطبعية."
                                                :
                                                "While the Site strives to provide accurate product information (such as stock availability, pricing, product features, images, and specifications) and Services information, typographical errors may occur."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "سيتم عرض ألوان منتجاتنا التي تظهر على الموقع بأكبر قدر ممكن من الدقة. ومع ذلك ، نظرًا لأن الألوان الفعلية التي تراها ستعتمد على الشاشة ، لا يمكننا ضمان أن عرض الشاشة لأي لون سيكون دقيقًا."
                                                :
                                                "The colors of our products that appear on the Site will be displayed as accurately as possible. However, because the actual colors you see will depend on your monitor, we cannot guarantee that your monitor's display of any color will be accurate."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "لا يضمن نشر أي شكل من أشكال معلومات المنتج / الخدمة (بما في ذلك -على سبيل المثال لا الحصر – عرض التسويق والإعلانات والعروض والمجلات والنشرات) على الموقع توفر المخزون والعرض والسعر عبر الإنترنت أو في المتجر."
                                                :
                                                "The posting of any form of product/service information (including but not limited to display marketing, advertisements, offers, magazines and flyers) on the Site does not guarantee the availability of stock, display and price online or in-store."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "قد تحدث أخطاء في عملية توفير المنتج / الخدمة ومعلومات التسعير على الموقع. لا يمكن للموقع تأكيد التسعير والتكلفة الإجمالية للمنتج / الخدمة حتى يتم الانتهاء من الدفع عبر الإنترنت. في حالة إدراج منتج/خدمة والفوترة بسعر غير صحيح أو بمعلومات غير صحيحة بسبب خطأ في التسعير أو معلومات المنتج/الخدمة، يحق للموقع، إما الاتصال بك للحصول على تعليمات أو إلغاء طلبك و إعلامك بهذا الإلغاء. في حالة قبولنا لطلبك ومعالجته عبر الإنترنت، سيتم خصم التكلفة الإجمالية لحساب بطاقة الائتمان الخاصة بك / بطاقة مدى وإخطارك عن طريق البريد الإلكتروني بأنه تم معالجة الدفع."
                                                :
                                                "Errors may occur in the process of providing product/service and pricing information on the website. The Site cannot confirm pricing and total cost of the product/service until payment has been completed online. In the event that a product/service is listed and billed at an incorrect price or with incorrect information due to an error in pricing or product/service information, the Site has the right to either contact you for instructions or cancel your order and notify you of such cancellation. If we accept your order and process it online, the total cost will be debited to your credit card/mada account and you will be notified by email that the payment has been processed."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "ومع ذلك ، في جهودنا لتقديم أقل سعر في المملكة العربية السعودية ، قد تختلف أسعار المتاجر في بعض الأحيان عن أسعار الموقع. نسعى جاهدين لتزويدك بأفضل الأسعار الممكنة على الموقع الإلكتروني، وكذلك في جميع متاجرنا. ومع ذلك ، في بعض الأحيان، قد لا يتطابق السعر عبر الإنترنت مع السعر في المتجر. لا ينطبق ” ضمان أدنى سعر” على المبيعات عبر الإنترنت والأسعار عبر الإنترنت."
                                                :
                                                "However, in our efforts to provide the lowest price in Saudi Arabia, store prices may sometimes differ from website prices. We strive to provide you with the best possible prices on the website, as well as in all our stores. However, sometimes, the online price may not match the in-store price. The Lowest Price Guarantee does not apply to online sales and online pricing."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "سياسة التوصيل والتسليم" : "Delivery terms and conditions"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "تعتمد تواريخ معالجة الشحن على طلبك والموقع وطريقة الدفع. يرجى ملاحظة أن الطلبات المسبقة غير مشمولة في الجدول الزمني القياسي للشحن أدناه."
                                                :
                                                "Shipping processing dates depend on your order, location, and payment method. Please note that pre-orders are not included in the standard shipping schedule below."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "شركاؤنا في التوصيل هم Naqel و Aramex كذلك فريق توصيل تمكين . بعد تقديم الطلب عبر الإنترنت "
                                                :
                                                "Our delivery partners are Naqel and Aramex, as well as the Tamkeen delivery team. After submitting the application online,"}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "يتم توصيل الطلب للعملاء في جدة ومكة والرياض خلال 74 ساعة عمل من وقت إتمام الطلب بشرط توفر المنتج في نفس موقع العميل او في اقرب منطقة لموقع العميل ولا تنطبق هذه الخدمة على طلبات الخاصة بالتركيب المجاني للمكيفات."
                                                :
                                                "Orders are delivered to customers in Jeddah, Mecca, and Riyadh within 24 working hours from the time of order completion, provided the product is available at the same location as the customer or in the nearest area to the customer. This service does not apply to orders for free air conditioner installation (verify before adding)."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "و لباقي المدن من المقدر أن يستغرق التوصيل ما بين 2-10 أيام عمل ،وفي فترات العروض والمواسم قد يستغرق من 15 يوم الى 30 يوم عمل و في ظروف استثنائية "
                                                :
                                                "For other cities, delivery is estimated to take between 2-10 working days, and during promotional periods and seasons, it may take from 15 to 30 working days, and in exceptional and uncontrollable circumstances."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "يرجى تذكر أن الموعد المقدر للتسليم قابلة للتغيير ويمكن العثور عليها في صفحة المنتج ، والتي يتم تحديثها بانتظام بأحدث المعلومات. يعتمد التسليم على قبول العميل و ترتيبات التسليم مع شركاء أو فريق التوصيل في تمكين إذا تعذر الاتصال بالعميل  فقد يتأخر التسليم دون مسؤولية تجاه تمكين"
                                                :
                                                "Please remember that the estimated delivery date is subject to change and can be found on the product page, which is regularly updated with the latest information. Delivery depends on the customer's acceptance and delivery arrangements with Tamkeen's partners or delivery team. If the customer cannot be contacted, delivery may be delayed without responsibility towards Tamkeen."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "يرجى تذكر أن الموعد المقدر للتسليم قابلة للتغيير ويمكن العثور عليها في صفحة المنتج ، والتي يتم تحديثها بانتظام بأحدث المعلومات. يعتمد التسليم على قبول العميل و ترتيبات التسليم مع شركاء أو فريق التوصيل في تمكين إذا تعذر الاتصال بالعميل  فقد يتأخر التسليم دون مسؤولية تجاه تمكين"
                                                :
                                                "To ensure successful delivery, please be punctual. If you need to reschedule your appointment, please call our customer service number at least one day in advance between the hours of 9am-6pm. Otherwise, standard fees will apply as per the policy."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "قد تختلف رسوم التوصيل حسب الموقع أو عدد المنتجات المطلوبة. ستبلغك خدمة العملاء بأي تغييرات."
                                                :
                                                "Delivery fees may vary depending on location or number of products ordered. Customer Service will inform you of any changes."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "شروط وأحكام التوصيل السريع" : "Terms and conditions of express delivery"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "يتوفر خيار التوصيل السريع للمنتجات المختارة التي تم شراؤها في المدن المختارة مع الأخذ في الاعتبار شروط وأحكام تغطية التوصيل المنزلي."
                                                :
                                                "Express delivery option is available for selected products purchased in selected cities taking into consideration the terms and conditions of home delivery cover."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "يلتزم تمكين بتسليم المنتجات المشتراة إلى جهة الاتصال المسجلة التي تم تسجيلها أثناء عملية الشراء عبر الإنترنت، أو معلومات محصل مطلوبة إن وجدت."
                                                :
                                                "Tamkeen is committed to delivering the purchased products to the registered contact that was registered during the online purchase process, or required collector information, if any."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "المدفوعات" : "Payments"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "يوفر الموقع إمكانية شراء المنتج (المنتجات) و / أو الخدمة (الخدمات) عبر الإنترنت وتسوية الدفع عبر الإنترنت أو في المتجر على أساس طريقة الشحن ، والتسليم المتاحة في المملكة العربية السعودية. ستكون معاملات الدفع بما في ذلك التوكيلات والتسويات بالريال السعودي."
                                                :
                                                "The website provides the possibility of purchasing the product(s) and/or service(s) online and settling the payment online or in-store based on the shipping method, and delivery available in the Kingdom of Saudi Arabia. Payment transactions including agencies and settlements will be in Saudi Riyals."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "نقبل طرق الدفع التالية:"
                                                :
                                                "We accept the following payment methods:"}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "لمعاملات الدفع في المتجر: بطاقات الائتمان المصرفية / بطاقات مدى، وبطاقات السحب الآلي، الشبكة السعودية للمدفوعات، والنقدية أو بطاقات هدايا وقسائم"
                                                :
                                                "For in-store payment transactions: bank credit cards/mada cards, debit cards, Saudi Payment Network,  cash or gift cards and vouchers"}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "بالنسبة لمعاملات الدفع عبر الإنترنت: نظام سداد للدفع، وبطاقات الإئتمان المصرفية (فيزا وماستركارد)، وبطاقات مدى فقط لتلك البطاقات الصادرة عن بنوك المملكة العربية السعودية من خلال مزود خدمة بوابة الدفع عبر الإنترنت. يمكن للعميل استخدام بطاقة مدى الصادرة عن البنوك التالية (الراجحي،البلاد،بنك الرياض،بنك الجزيرة، سامبا )، لا يسمح باسترداد المبلغ الجزئي على بطاقات مدى."
                                                :
                                                "For online payment transactions: SADAD payment system, bank credit cards (Visa and MasterCard), and Mada cards only for those cards issued by banks in the Kingdom of Saudi Arabia through the online payment gateway service provider. The customer can use the mada card issued by the following banks (Al-Rajhi, Al-Bilad, Riyad Bank, Al-Jazira Bank, Samba). Partial refunds are not allowed on mada cards."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "بالنسبة لمعاملات الدفع عبر الإنترنت، سيتلقى العميل إقرارًا بالطلب بمجرد التصريح بالدفع. لا يمكننا تحمل أي مسؤولية إذا تم رفض الدفع أو إنكاره من قبل مورد بطاقة الائتمان / بطاقة مدى لأي سبب من الأسباب. يجب عليك مراجعة بطاقتك الائتمانية المصرفية / مورد بطاقة مدى لذلك."
                                                :
                                                "For online payment transactions, the customer will receive an order acknowledgment once the payment has been authorized. We cannot accept any responsibility if payment is refused or denied by the credit card/mada card supplier for any reason. You should check with your bank credit card/mada card supplier for this."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "إننا لا نخزن بيانات بطاقتك الائتمانية / بطاقة مدى على الموقع. يتم تشفير جميع بيانات الدفع التي يتم إدخالها من خلال بوابة الدفع الخاصة بموقع الويب عند إدخالها. يتم تشفير الاتصالات من وإلى موقع مزود الخدمة."
                                                :
                                                "We do not store your credit card/mada card data on the website. All payment data entered through the website's payment gateway is encrypted when entered. Communications to and from the service provider's website are encrypted."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "لا يمكننا تقديم أي من معلومات الدفع الخاصة بك التي تم الحصول عليها عبر الويب إلى شركات أو أفراد آخرين ما لم يكن ذلك مطلوبًا بموجب القانون. تتم معالجة هذه المعلومات من قبل تاجر الدفع لدينا. ستكون بيانات بطاقة الائتمان / بطاقة مدى التي تقدمها للاستفادة من الخدمة عبر الإنترنت صحيحة وسارية ودقيقة ويجب عليك استخدام بطاقة الائتمان المملوكة لك بشكل قانوني. لن يتم استخدام المعلومات المذكورة ومشاركتها من قبل الخدمة عبر الإنترنت مع أي من الأطراف الثالثة ما لم يكن ذلك مطلوبًا للتحقق من الاحتيال أو بموجب القانون أو اللوائح أو أمر المحكمة. لن تتحمل الخدمة عبر الإنترنت المسئولية عن أي احتيال على بطاقات الائتمان. ستقع على عاتقك المسؤولية عن استخدام بطاقة بصورة احتيالية و ستقع على عاتقك كذلك المسؤولية عن إثبات خلاف ذلك حصراً."
                                                :
                                                "We cannot provide any of your payment information obtained over the web to other companies or individuals unless required by law. This information is processed by our payment merchant. The credit card/mada card data you provide to avail the online service will be true, valid and accurate and you must use the credit card legally owned by you. The said information will not be used and shared by the online service with any third parties unless required for fraud verification or by law, regulation or court order. The online service will not be held liable for any credit card fraud. It will be your responsibility to use a card fraudulently and it will be solely your responsibility to prove otherwise."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "في حالة عدم تمكننا من توفير كامل أو جزء من الطلب، سنبلغك وفقًا لذلك. سيتم الاسترداد الكامل أو الجزئي – من خلال بطاقة الائتمان / بطاقة مدى – حيث تم تحصيل رسوم منك بالفعل."
                                                :
                                                "In the event that we are unable to supply all or pzart of an order, we will inform you accordingly. A full or partial refund will be made – via credit card/mada card – as you have already been charged."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "يشير استخدام تسهيلات المدفوعات عبر الإنترنت للموقع إلى أنك تقبل هذه الشروط. إذا كنت لا تقبل هذه الشروط، لا تستخدم هذه التسهيلات."
                                                :
                                                "Use of the website's online payments facilities indicates that you accept these terms. If you do not accept these terms, do not use these facilities."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "الدفع عن طريق بسيطه من تسهيل" : " Payment via Baseeta"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "يكون استخدام البطاقة من قبل صاحبها مقدم الطلب، ولا ينبغي استخدامها من قبل أي شخص آخر."
                                                :
                                                "The card should be used only by its owner, the applicant, and should not be used by anyone else."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "البطاقة ليست سوى طريقة دفع لاتفاقية التمويل المعتمدة من قبل العميل في وقت تسليم البطاقة."
                                                :
                                                "The card is merely a payment method for the financing agreement approved by the customer at the time of the card's delivery."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "يمكن استخدام البطاقة فقط في أي من معارض تمكين أو موقع tamkeenstores.com.sa للمشتريات عبر الإنترنت في المملكة العربية السعودية فقط."
                                                :
                                                "The card can only be used at any Tamkeen exhibition or on the tamkeenstores.com.sa website for online purchases in Saudi Arabia only."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "المنتجات التي يتم شرائها بواسطة بطاقة / محفظة تسهيل سواء شرائها من الموقع الإلكتروني أو من المعرض، لا يمكن استرداد قيمتها نقداً في حالة الإرجاع، ويمكن إرجاع أو استبدال المنتج حسب الشروط والأحكام المتعلقة الإرجاع والاستبدال."
                                                :
                                                "Products purchased by a Tasheel card/wallet, whether bought from the website or the exhibition, cannot be refunded in cash in case of return, and the product can be returned or exchanged according to the terms and conditions related to return and exchange."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "هذه البطاقة ليست بطاقة ائتمان / خصم أو بطاقة مسبقة الدفع."
                                                :
                                                "This card is not a credit/debit or a prepaid card."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "هذه البطاقة غير قابلة لإعادة الشحن."
                                                :
                                                "This card is not rechargeable."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "البطاقة صالحة من تاريخ توقيع اتفاقية التمويل."
                                                :
                                                "The card is valid from the date of signing the financing agreement."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "الرصيد المتبقي على البطاقة لا يمكن استرداده نقداً."
                                                :
                                                "The remaining balance on the card cannot be refunded in cash."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "الأسعار مضمونة لليوم الذي تم فيه توقيع العقد."
                                                :
                                                "Prices are guaranteed for the day the contract was signed."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "نحن غير مسؤولون عن المشتريات التي تتم بواسطة البطاقات المفقودة أو المسروقة أو التالفة."
                                                :
                                                "We are not responsible for purchases made with lost, stolen, or damaged cards."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "قد يتغير سعر التمويل الظاهر في الموقع الإلكتروني بناءً على المنتج الذي تم شراؤه عبر تسهيل للتمويل."
                                                :
                                                "The displayed financing price on the website may change based on the product purchased through Tasheel financing."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "أقساط بطاقة الائتمان" : " Credit card installments"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "يتميز متجر تمكين بوجود مختلف خطط خيارات تقسيط بطاقة الائتمان، حيث تتغير الخطط بانتظام وتستند إلى تمكين والعروض الترويجية"
                                                :
                                                "Tamkeen stores features various credit card installment options plans, as the plans change regularly and are based on Tamkeen and bank promotions."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "المصرفية. يرجي العلم أن بعض خطط التقسيط حصرية عبر الإنترنت وغير متوفرة في المتجر."
                                                :
                                                "Please note that some installment plans are exclusive online and not available in store."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "تخضع جميع الخطط لرسوم المعاملات، يرجى الاطلاع على طلب الخروج لمزيد من التفاصيل"
                                                :
                                                "All plans are subject to transaction fees, please see your checkout request for more details."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "تتوفر أحدث الخطط والبنوك المشاركة عند تسجيل الخروج، انقر على الدفع عن طريق تقسيط بطاقة الائتمان للاطلاع على الخطط."
                                                :
                                                "Latest plans and participating banks available At checkout, click Pay by Credit Card Installments to view plans."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "لا يلزم إجراء مكالمة هاتفية للبنك لتحديدها في عملية الدفع؛ ومع ذلك، سيتم حظر إجمالي مبلغ الطلب حتى يتم إكمال خطة التقسيط الخاصة بك من قبل البنك. وفقا للسياسات المصرفية لا يمكن معالجة أي من المبالغ المستردة على أي طلبات بالقسط."
                                                :
                                                "A phone call to the bank is not required to be selected in the payment process; However, the total order amount will be blocked until your installment plan is completed by the bank. As per banking policies no refunds can be processed on any installment orders"}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "تكون لجميع الأقساط الحد الأدنى من قيمة الطلب، يرجى الاطلاع على الخروج لمزيد من التفاصيل"
                                                :
                                                "All installments will have a minimum order value, please see checkout for more details."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "لن يكون .تمكين مسئولاً عن خطة التقسيط أو الحل المالي للقسط – وتعتبر هذه مسؤولية العميل والبنك"
                                                :
                                                "Tamkeen will not be responsible for the installment plan or financial solution for the installment – ​​this is the responsibility of the customer and the bank."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ?
                                                "لا يقبل تمكين أي مسؤولية أو مطالبة فيما يتعلق بالتسوية المالية ومعالجة القسط"
                                                :
                                                "Tamkeen does not accept any responsibility or claim regarding the financial settlement and processing of the installment."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                        </div>
                        <div>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "بطاقات الهدايا الترويجية بين الشركات ومن الشركة إلي المستهلك" : "Promotional & B2B gift cards"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? "هذه ليست بطاقة ائتمان." : "This is not a credit card."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "هذه البطاقة قابلة لإعادة الشحن." : "This card is reloadable."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "بدون استرداد نقدي مقابل بطاقة الهدايا." : "No cash back for the gift card."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "تخلي شركة تمكين الدولية مسئوليتها عن البطاقات المفقودة أو المسروقة أو التالفة." : "Tamkeen International disclaims any responsibility for lost, stolen or damaged cards."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "هذه البطاقة صالحة لدى جميع متاجر شركة تمكين الدولية في المملكة العربية السعودية فقط." : "This card is valid at all Tamkeen International Company stores in the Kingdom of Saudi Arabia only."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "إلغاء الطلب" : "Order Cancellation"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? "الإلغاء من قبل متجر تمكين : يحتفظ تمكين بالحق في إلغاء الطلب لأي من الأسباب التالية" : "Cancellation by Tamkeen store: Tamkeen reserves the right to cancel the order for any of the following reasons:"}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "رفض الدفع." : "Payment refused."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "تأخر العميل لأكثر من 48 ساعة لتسوية الدفع لرقم الفواتير المرجعية من قبل سداد." : "The customer is late for more than 48 hours to settle the payment for the invoice number referenced by SADAD."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "الخطأ في عنوان التوصيل الذي قدمه العميل أو خطأ بيانات الاتصال أو بسبب عدم إمكانية الوصول للعميل." : "Error in the delivery address provided by the customer, error in contact information, or due to the inability to reach the customer."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "يلتزم تمكين بتقديم أفضل خدمة عملاء ممكنة لعملائنا ، سيتم إلغاء أي أوامر مجمعة من نفس وحدة المخزون أو العرض الترويجي / العرض لنفس العميل أو أوامر العمل وفقًا لتقدير الإدارة." : "Tamkeen is committed to providing the best possible customer service to our customers, any bulk orders of the same stock unit, promotion/offer for the same customer or work orders will be canceled at the discretion of management."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "في حالة رغبة العميل في الإعادة بسبب عيب التصنيع أو أنه لا يريد المنتج وهناك هدية مجانية مع عنصره وقد تم استخدامه سيتم خصم مبلغ الهدية من العميل." : "If the customer wants to return due to a manufacturing defect or he does not want the product and there is a free gift with his item and it has been used, the gift amount will be deducted from the customer."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "الإلغاء من قبل العميل: لمعالجة إلغاء الطلب، يرجى الاتصال بنا. يمكنك إلغاء الطلب لأي من الأسباب التالية:" : "Cancellation by Customer: To process an order cancellation, please contact us. You may cancel an order for any of the following reasons:"}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "لم يتم شحن المنتج / الخدمة (الخدمات) بعد إليك. في حالة الإلغاء، بعد شحن الطلب إليك، سيتم تطبيق رسوم الإلغاء. نتمتع بالحق الكامل في إثبات ما إذا كان قد تم شحن الطلب إليك بحلول وقت طلب الإلغاء الخاص بك." : "The product/service(s) has not yet been shipped to you. In the event of cancellation, after the order has been shipped to you, cancellation fees will apply. We have full right to prove whether the order has been shipped to you by the time of your cancellation request."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "الإسترجاع / التبديل / استرداد الأموال" : "Return / Exchange / Refund"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? "في حال لم تكن راضيًا عن منتجك (منتجاتك) أو وجود عيب بالمنتج (المنتجات)، يمكنك طلب “التفويض المسبق لإرجاع المواد” لإعادة المنتج (المنتجات) الى تمكين في غضون (7) أيام من تاريخ استلام طلبك." : "In the event that you are not satisfied with your product(s) or there is a defect in the product(s), you can request a “Return Materials Authorization” to return the product(s) to Tamkeen within (7) days.From the date of receipt of your application."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "على العميل الحفاظ على غلاف المنتج والكرتون و الاغراض الاخرى و عدم تلفها وإلا سوف يتم خصم 40% من قيمة المنتج في حال استرجاع المنتج او الاستبدال." : "The customer must preserve the product packaging, carton, and other items and not damage them, otherwise 40% of the product value will be deducted in the event of a product return or exchange."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "يرجى الاتصال بنا للحصول على التفويض المسبق لإرجاع المواد قبل معالجة الإعادة. يسري التفويض المسبق لإرجاع المواد لمدة (٧) أيام من تاريخ الإصدار." : "Please contact us to pre-authorize returns before processing your return. The pre-authorization for returns is valid for (7) days from the date of issue."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "في حالة الإعادة نتيجة لعطل في المنتج أو عيب في التصنيع ، أو تلف عند التسليم أو تسليم المنتج الخطأ ، لن يتم فرض رسوم على العميل مقابل أي رسوم شحن قياسية أو / ورسوم التحويل البنكي. في حالة الإعادة لأسباب أخرى (أي أن العميل يحتاج إلى التبديل أو أن العميل غير رأيه) سيتم فرض رسوم الشحن أو / وسيتم فرض رسوم التحويل المصرفي على العميل." : "In the event of a return as a result of a product malfunction or manufacturing defect, damage upon delivery, or the wrong product being delivered, the customer will not be charged for any standard shipping and/or bank transfer fees. In the event of a return for other reasons (i.e. the customer needs to exchange or the customer has changed their mind) shipping fees will be charged and/and the customer will be charged a bank transfer fee."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "للدفع مع التقسيط، في حالة الإعادة نتيجة لعطل في المنتج أو عيب في التصنيع، والتلف عند التسليم أو تسليم المنتج الخطأ، لن يتم فرض رسوم على العميل عن أي رسوم تقسيط. في حالة الإعادة لأسباب أخرى (أي أن العميل يحتاج إلى التبديل أو أن العميل غير رأيه) سيتم فرض رسوم التقسيط على العميل." : "To pay in installments, in the event of a return due to a product malfunction or manufacturing defect, damage on delivery or delivery of the wrong product, the customer will not be charged for any installment fees. In the event of a return for other reasons (i.e. the customer needs to exchange or the customer changed his mind) the customer will be charged an installment fee."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "أثناء التحضير للإعادة ، يكون المنتج في عبوته الأصلية مع مجموعة كاملة من الملحقات والكتيبات المضمنة. لا نقبل إعادة المنتجات التي بها خدوش، والتي تضررت نتيجة لسوء الاستخدام، أو عطل بسبب خطأ توصيلات الجهد. وفقًا لتقديرنا الخاص، قد نعتبر أن الإعادة لا تفي بالمعايير المذكورة أعلاه." : "While preparing for return, the product is in its original packaging with a full set of accessories and manuals included. We do not accept returns of products that have scratches, damage due to misuse, or failure due to faulty voltage connections. At our sole discretion, we may consider that a return does not meet the above criteria."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "على العميل التأكد من سلامة المنتج من اي مشكلة او كسر او ضرر قبل التوقيع على ايصال الاستلام او بوليصة الشحن حيث ان شركة تمكين الدولية للأجهزة المنزلية لا تتحمل اي مسؤولية في حال التوقيع و عدم فحص المنتج و التأكد من سلامته." : "The customer must ensure the product is free from any defects, breakages, or damages before signing the delivery receipt or the shipping bill, as Tamkeen International Company for Home Appliances will not be liable once the receipt is signed and the product is not inspected and verified to be intact."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "استرداد السداد" : "Payment Return"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? "وفقًا لشروط التحويلات المصرفية الداخلية لمؤسسة النقد العربي السعودي (معاملات الاسترداد)، يجب مطابقة معلومات العميل الخاصة بالمستفيد مع معلومات الحساب المصرفي للعميل (الاسم الكامل، الهوية أو معرف الإقامة واسم البنك ورقم حساب البنك – رقم الحساب المصرفي- الأيبان)، وذلك لتجنب أي تأخير أو رفض قد يتم الإبلاغ عنه من قبل البنك الذي نريد تحويل المبلغ المسترد إليه (الوجهة)، حيث في حالة عدم تطابق معلومات العميل مع معلومات الحساب المصرفي للمستفيد، سيقع تأخير أو قد تتطلب إعادة معالجتها مرة أخرى بعد تقديم البيانات الصحيحة وفقاً للأحكام القانونية في المملكة العربية السعودية." : "According to the terms of internal bank transfers of the Saudi Arabian Monetary Agency (refund transactions), the beneficiary’s customer information must be matched with the customer’s bank account information (full name, ID or residence ID, bank name, bank account number - bank account number - IBAN), in order to avoid any delays. Or a refusal may be reported by the bank to which we want to transfer the refund (destination). In the event that the customer’s information does not match the beneficiary’s bank account information, a delay will occur or it may require reprocessing again after providing the correct data in accordance with the legal provisions in the Kingdom. Saudi Arab."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "الضمان / الصيانة والإصلاح" : "Warranty / Maintenance and Repair"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? "المنتجات التي تباع من قبلنا مشمولة بضمان لمدة (عامين) من الشركة المصنعة. يسري ضمان الشركة المصنعة الأقل من تاريخ الشراء. تتوفر خدمات الضمان الموسعة تمكين (التي تسمى أيضًا عقد خدمات القوة على مدار ٢٤/٧ ( للعديد من فئات المنتجات التي نبيعها." : "Products sold by us are covered by a (two-year) manufacturer's warranty. The manufacturer's warranty is valid from the date of purchase. Tamkeen Extended Warranty Services (also called 24/7 Power Contract) are available for many of the product categories we sell."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "يجب عليك التحقق والاطلاع على دليل المالك قبل استخدام المنتج للتأكد من أنه يلبي جميع متطلبات السلامة والأمن والمتطلبات المحلية الكهربائية." : "You should check and review the owner's manual before using the product to ensure that it meets all safety, security, and local electrical requirements."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "ما لم يتم تحديدها ، تم تصميم المنتجات الكهربائية للعمل على جهد ٢٤٠-٢٢٠ فولت. إذا لم يكن لديك التركيبات المناسبة للعمل بهذا الجهد الكهربائي، فإننا لا ننصح باستخدام المنتج. لن يتم قبول المنتجات التالفة بسبب استخدامها مع مصادر كهربائية و / أو امدادات خاطئة بموجب شروط وأحكام ضمان الشركة المصنعة." : "Unless specified, electrical products are designed to operate on 220-240V. If you do not have the proper fixtures to work at this voltage, we do not recommend using the product. Products damaged due to use with faulty electrical sources and/or supplies will not be accepted under the terms and conditions of the manufacturer's warranty."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "حصلت جميع المنتجات التي تباع من قبلنا على موافقات مراقبة الجودة وتعتبر وظيفية عندما يتم شحنها من قبلنا. عند وجود أي مشكلة في المنتج الذي تم شراؤه بعد (7) أيام من تاريخ استلام المنتج ، فمن المستحسن الاتصال بمركز الخدمة المعتمد مباشرة من الشركة المصنعة في المملكة العربية السعودية لإصلاح المنتج." : "All products sold by us have obtained quality control approvals and are considered functional when shipped by us. When there is any problem with the purchased product after (7) days from the date of receiving the product, it is recommended to contact the authorized service center directly from the manufacturer in the Kingdom of Saudi Arabia to repair the product."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "يمكنك الاتصال بنا للحصول على مواقع مراكز الخدمة المعتمدة من الشركة المصنعة وبيانات الاتصال." : "You can contact us for manufacturer authorized service center locations and contact information."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "خدمات الضمان عن طريق الخطأ" : "Accidently warranty services"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? "تستبعد الحالات التالية من نطاق عقد خدمة الحماية من الأضرار العرضية:" : "The following cases are excluded from the scope of the accidental damage protection service contract: Repair or replacement of devices performed outside of enable."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "إصلاح أو استبدال الجهاز الذي يتم إجراؤه خارج تمكين." : "Any force majeure events."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "أي أحداث قوة قاهرة." : "Incidental damages or losses occurring outside the Kingdom of Saudi Arabia."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "الأضرار أو الخسائر العرضية التي تحدث خارج المملكة العربية السعودية." : "Normal wear and tear, aging, corrosion and rust, even when this involves fading or loss of the enamel coating on the screen."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "البلى العادي، والتقادم، و التآكل والصدأ، حتى عندما ينطوي ذلك على تلاشي أو فقدان طلاء المينا على الشاشة." : "Minor damage to the protected device, including but not limited to chips at edges or minimal damage such as scratches, dents and any other purely cosmetic damage that does not impair the visibility and normal use of the terminal. Minor damage may not include cracking the screen."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "الضرر الطفيف للجهاز المحمي، بما في ذلك على سبيل المثال لا الحصر الرقائق عند الحواف أو الحد الأدنى من الضرر مثل الخدوش والطعجات وأي أضرار تجميلية بحتة أخرى لا تضعف الرؤية والاستخدام العادي للمحطة. لا يجوز أن يشتمل الضرر الطفيف تكسير الشاشة." : "Malfunctions caused by mishandling or insufficient use, including but not limited to: heat or cold exceeding the manufacturer's indications, and voltage changes."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "الأعطال الناجمة عن سوء المعالجة أو الاستخدام غير الكافي، بما في ذلك على سبيل المثال لا الحصر: الحرارة أو البرد الذي يتجاوز مؤشرات الشركة المصنعة، وتغيرات الجهد." : "Accidental damage to accessories, such as remote controls, adapters, batteries, hands-free equipment, chargers, converters, external cables or any consumable parts."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "الأضرار العرضية للملحقات، مثل أجهزة التحكم عن بعد، والمحولات، والبطاريات، والمعدات غير اليدوية، وأجهزة الشحن، والمحولات، والكابلات الخارجية أو أي أجزاء استهلاكية." : "Loss or malfunction of software (including operating systems) or user settings configurations or data backup or recovery process, loss, corruption or corruption of data operating systems and damage caused by viruses or any type of software and software problems installed in the device that causes If the protected device does not turn on."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "فقدان أو تعطل البرامج (بما في ذلك أنظمة التشغيل) أو تكوينات إعدادات المستخدم أو عملية النسخ الاحتياطي أو استرداد البيانات أو فقدان أو فساد أو تلف أنظمة تشغيل البيانات والأضرار الناجمة عن الفيروسات أو أي نوع من مشاكل البرمجيات وبرامج البرمجيات التي يتم تركيبها في الجهاز الذي يتسبب في عدم تشغيل الجهاز المحمي." : "Intentional damage or damage caused by negligence or misuse."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "الضرر المتعمد أو الضرر الناجم عن الإهمال أو سوء الاستخدام." : "Loss, theft or misplacement of the protected device"}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "فقدان أو سرقة أو سوء وضع الجهاز المحمي" : "Repairs, replacements or modifications made to a device not authorized by a technician or any type of self-repair or attempted self-repair or use of the device not in accordance with the manufacturer's instructions or not authorized by the manufacturer or enablingDamages that are not attributable to a single specific event as stated in the service contract."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "الإصلاحات أو الاستبدالات أو التعديلات التي أدخلت على جهاز فني غير مصرح به أو أي نوع من الإصلاح الذاتي أو محاولة الإصلاح الذاتي أو استخدام الجهاز بما لا يتفق مع تعليمات الشركة المصنعة أو غير المصرح به من قبل الشركة المصنعة أو تمكين" : "Loss or damage caused by incorrect storage, poor maintenance, willful neglect, incorrect installation, or incorrect setup, unless otherwise confirmed by an authorized service center representative with due proof."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "الأضرار التي لا تعزى إلى حدث واحد محدد على النحو الوارد في عقد الخدمة." : "Loss or damage is covered by the supplier, dealer, or manufacturer's warranty."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "الخسارة أو الضرر الناجم عن التخزين غير الصحيح، وسوء الصيانة، والإهمال المتعمد، والتركيب غير الصحيح، والإعداد غير صحيح، ما لم يؤكد ممثل مركز الخدمة المعتمد خلاف ذلك مع الإثبات الواجب الخسارة أو الضرر الذي يغطيه المورد أو التاجر أو ضمان المصنع." : "The Accidental Damage Service Contract does not apply if the model number, NME or serial number sticker (previously registered) of the protected device has been removed, altered, damaged, defaced, smudged or erased, or if a different model, NME or number is stated The serial number other than that found in the service contract. Consequential damages of any kind."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "لا ينطبق عقد خدمة التلف العرضي إذا تمت إزالة رقم الطراز أو الهوية الوطنية للأجهزة المتنقلة أو ملصق الرقم التسلسلي (المسجل سابقًا) للجهاز المحمي أو تغييره أو تلفه أو تشويهه أو تلطيخه أو محوه، أو إذا تم ذكر طراز مختلف أو الهوية الوطنية للأجهزة المتنقلة أو الرقم التسلسلي آخر بخلاف ذلك الموجود في عقد الخدمة. الأضرار التبعية من أي نوع." : ""}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "صفقات اليوم/ عروض عطلة نهاية الأسبوع واليوم الخاص" : "Deals of the day, special day and weekend offer"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? "تتوفر صفقات اليوم عروض عطلة نهاية الأسبوع حتى آخر المخزون." : "Today's deals and weekend deals are available while stocks last."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "تتاح عبر الإنترنت للتسليم المنزلي وغير متوفرة في المتجر أو الاستلام في المتجر." : "Available online for home delivery and not available in store or in-store pickup."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "تقتصر على وحدات معينة للعميل طوال مدة صفقة اليوم وعرض عطلة نهاية الأسبوع، إذا تبين أن العميل طلب أكثر من الوحدات المسموح بها من عنصر العرض، سيتم إلغاء الطلبات اللاحقة." : "Limited to a customer's specific units for the duration of the Deal of the Day and Weekend Offer, if the customer is found to have ordered more than the allowed units of the offer item, subsequent orders will be cancelled."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "تقديم الطلب ليس التزاما بالتعاقد." : "Submitting an application is not a contractual obligation."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "يتمتع تمكين بالحق في سحب العرض الترويجي في أي وقت." : "Tamkeen has the right to withdraw the promotion at any time."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "سيتم تسليم جميع بنود صفقات اليوم في غضون 7 يوم عمل." : "All Today's Deals items will be delivered within 7 business days."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? " الطلبات المسبقة" : "Product reservation policy"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? "تكون الطلبات المسبقة مضمونة من حيث أوامر العملاء، بمجرد تأكيد الدفع،يضمن تمكين جهاز الطلب المسبق الخاص بك أو البند ولكن تستند أوقات التسليم إلى أوقات العميل ولا يمكن ضمانها." : "Pre-orders are guaranteed on customer orders, once payment is confirmed, your pre-order device or item is guaranteed to be enabled but delivery times are based on customer times and cannot be guaranteed."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "قد تختلف تواريخ تسليم الطلب المسبق والتحصيل من تواريخ المتجر بناءً على تسليم المورد ومدينة تسليم أو تحصيل العميل. سيتم إرسال التواريخ والوقت النهائي إلى العميل بمجرد وصول مخزون المورد عن طريق الرسائل القصيرة أو البريد الإلكتروني أو الهاتف للعميل. تعتبر التواريخ المقدرة تقديرات تستند إلى تسليم الموردين بالمملكة العربية السعودية وليس تواريخ تسليم العملاء على مستوى البلاد." : "Pre-order delivery and collection dates may vary from store dates based on supplier delivery and customer delivery or collection city. The final dates and time will be communicated to the customer once the supplier's stock arrives via SMS, email or phone to the customer. Estimated dates are estimates based on supplier delivery in Saudi Arabia and not customer delivery dates nationwide."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "نحتفظ بالحق، لإلغاء أي طلب مسبق بسبب عدم التسليم من موردينا. سيبذل تمكين دائماً قصارى جهده للوفاء بجميع الطلبات المسبقة والتسليم في غضون وقت التسليم المقدر، ولكن يستند الوقت المقدر للتسليم على المهلة الزمنية من المورد وليس تاريخ التسليم المؤكد." : "We reserve the right, to cancel any pre-order due to non-delivery from our suppliers. Tamkeen will always make every effort to fulfill all pre-orders and deliver within the estimated delivery time, but the estimated delivery time is based on the lead time from the supplier and not the confirmed delivery date."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "سيبذل تمكين دائما قصارى جهده لتلبية جميع الطلبات المسبقة والحصول عليها من المتجر وإتاحة الطلب في أقرب وقت ممكن على أساس تسليم المورد وأوقات فتح المتجر ولكن يستند الوقت المقدر للاستلام إلى المهلة الزمنية من المورد وليس تاريخ الاستلام المؤكد. سيتم إرسال التواريخ والموعد النهائي إلى العميل بمجرد وصول مخزون المورد عن طريق الرسائل القصيرة أو البريد الإلكتروني أو الهاتف إلى العميل." : "Tamkeen will always make every effort to fulfil all pre-orders and pick them up from the store and make the order available as soon as possible based on the supplier's delivery and store opening times but the estimated time of pickup is based on the lead time from the supplier and not the confirmed pickup date. "}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "سيتلقى جميع عملاء الطلب المسبق تحديثات من تمكين إذا تغير تاريخ التسليم و بمجرد تلقي تمكين المزيد من معلومات التسليم من المورد." : "The dates and deadline will be communicated to the customer as soon as the supplier's stock arrives via SMS, email or phone to the customer. All pre-order customers will receive updates from Tamkeen if the delivery date changes and once Tamkeen receives more delivery information from the supplier."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? " سياسة حجز المنتج" : "Product reservation policy Pre-Order"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? "في حالة عدم استلام الصنف المباع في غضون 30 يومًا كحد أقصى من تاريخ الفاتورة ، لن يكون tamkeenstores.com.sa مسئولاً عن الاحتفاظ بالصنف في مستودعاتها وسيكون ملزماً ، للأسف ، بإلغاء الفاتورة. يحق للعميل استرداد كامل المبلغ فقط وفقاً لسياسة الاسترداد العادية." : "In the event that the sold item is not received within a maximum of 30 days from the date of the invoice, tamkeenstores.com.sa will not be responsible for keeping the item in its warehouses and will, unfortunately, be obligated to cancel the invoice. The customer is entitled to a full refund only in accordance with the standard refund policy."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "تركيب مكيفات الهواء" : "Air conditioner installation"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? "*إذا طلب العميل تمديدًا للأمتار: الزيادة لعشرة أمتار للعداد 18 ألف، و15 متر للعداد 24 ألف، قد تؤدي إلى ضعف نظام التبريد." : "*If the customer requests an extension of the meters: an increase of ten meters for the 18K meter, and 15 meters for the 24K meter, may lead to a weakening of the cooling system."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*يجب موافقة العميل على هذه الزيادة مقابل رسوم لا تقل عن 50 ريال سعودي." : "*The customer must agree to this increase for a fee of no less than 50 Saudi riyals."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*إذا احتاج العميل سقالة أو سلمًا يزيد عن 2.50 متر، يجب دفع مبلغ لا يقل عن 100 ريال سعودي لكل طابق." : "*If the customer requires scaffolding or a ladder exceeding 2.50 metres, an amount of no less than 100 Saudi riyals must be paid per floor."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*الحاجة إلى ونش تتطلب دفع مبلغ لا يقل عن 250 ريال سعودي في الساعة، ويمكن زيادة الرسوم حسب نوع الونش ومنطقة التركيب." : "*The need for a winch requires paying an amount of no less than 250 Saudi riyals per hour, and fees may increase depending on the type of winch and installation area."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*إذا كان الارتفاع عند تركيب مكيفات الهواء أكثر من 2.5 متر، قد تكون هناك حاجة إلى سقالة." : "*If the height when installing the air conditioners is more than 2.5 meters, scaffolding may be required."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*إذا اختلف قطاع الأنابيب عن المطلوب لتركيب مكيف الهواء، يتم فرض رسوم 50 ريال سعودي على كل مكيف." : "*If the pipe section differs from what is required for installing the air conditioner, a fee of 50 Saudi riyals will be charged for each air conditioner."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*التركيب على لوح جداري من الجبسون يتطلب دفع تكاليف إضافية في حال وجود تكسير أو صدع." : "*Installation on a gypsum wallboard requires additional costs in the event of cracks or cracks."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*يجب أن تكون المساحة المتاحة لا تقل عن 2×2 متر، و العميل مسؤول عن توفير المساحة الكافية." : "*The available space must be no less than 2 x 2 meters, and the customer is responsible for providing sufficient space."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*يجب على العميل التحقق مما إذا كانت الأنابيب مرفقة بالجهاز أو متوفرة قبل الشراء." : "*Customer must check if tubing is included with the device or provided before purchase."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "فريق التركيب لا يتحمل مسؤولية الأداء إذا كانت وحدة التيار مترددة أو عن التمديدات الكهربائية والصرف في الموقع." : "*The installation team does not bear responsibility for the performance if the AC unit is powered or for the electrical installations and drainage on site."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*الشركة لا تتحمل مسؤولية تكسير الجدران الخرسانية أو الأعمدة، ويتم ذلك بالاتفاق مع العميل." : "*The company does not bear responsibility for breaking concrete walls or columns. This is done in agreement with the customer."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*يجب مراجعة الأسعار والنقاط المذكورة من قبل العميل وقسم التركيب." : "*The prices and points mentioned must be reviewed by the customer and the installation department."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*العميل له الحق في إلغاء الاتفاقية أو تغيير المواعيد إذا لم تكن مناسبة." : "*The customer has the right to cancel the agreement or change the dates if they are not suitable."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*يشمل الضمان سنة واحدة من تاريخ التركيب، لا يشمل عيوب التصنيع أو ضعف كفاءة التبريد الناتج عن تركيب العميل." : "*The warranty includes one year from the date of installation and does not include manufacturing defects or poor cooling efficiency resulting from the customer’s installation."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*الضمان لا يشمل تسرب المياه أو الصرف الصحي الناجم عن أنابيب غير نظيفة." : "*Warranty does not include water or sewage leakage caused by unclean pipes. Refusal to exchange or return:"}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "رفض التبادل أو الإعادة:" : "*Tamkeen has the right to refuse to exchange or return the air conditioner after installation."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*تمكين يحق لها رفض تبادل أو إعادة المكيف بعد التركيب." : "*The air conditioner is subject to the supplier’s warranty after installation and he is responsible for any service or repair during the warranty period."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*مكيف الهواء يخضع لضمان المورد بعد التركيب وهو مسؤول عن أي خدمة أو إصلاح خلال فترة الضمان." : "Preparing for installation:"}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*يجب على العميل تجهيز موقع التركيب مع الأخذ في الاعتبار العمل المدني، الديكور، وتوفير الكهرباء المناسبة." : "*The customer must prepare the installation site taking into account civil work, decoration, and the provision of appropriate electricity."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "التحضير للتركيب:" : "Installation limitations:"}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "قيود التركيب" : "*Installation will not take place if there is a concrete wall that requires opening a hole, as this responsibility lies with the customer."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*لن يتم التركيب في حالة وجود جدار خرساني يتطلب فتح حفرة، حيث تقع هذه المسؤولية على العميل." : "The Tamkeen installation team is not responsible for the electrical wiring nor the cooling efficiency if the size of the site is not compatible with the capacity of the air conditioner."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "*خدمات التركيب المجاني: متوفرة فقط في مدن محددة مثل جدة، مكة، الرياض،الدمام،الخبر،جيزان،ابوعريش،نجران،حفرالباطن،الاحساء،الهفوف،ابها،خميس مشيط ولا تنطبق خدمات التركيب المجاني في غير هذه المدن." : "*Free installation services: Available only in specific cities such as Jeddah, Mecca, Riyadh, Dammam, Khobar, Jazan, Abu Arish, Najran, Hafar Al-Batin, Al-Ahsa, Hofuf, Abha, Khamis Mushait. Free installation services do not apply outside these cities. (Review before modification)"}</p>
                                            <div className='mb-2.5'>
                                                <p className="font-bold">{lang === 'ar' ? ':تركيب مكيفات الهواء -' : '-Air conditioner installation:'}</p>
                                                <p className="">{lang === 'ar' ? 'خدمة التركيب متاحة في المدن التالية: ( جدة،مكة،الرياض،الدمام،الخبر،حفر الباطن،جيزان،نجران،ابها،خميس مشيط،ابوعريش،ينبع)' : 'Installation service is available in the following cities: (Jeddah, Mecca, Riyadh, Dammam, Khobar, Hafar Al-Batin, Jizan, Najran, Abha, Khamis Mushait, Abu Arish, Yanbu).'}</p>
                                            </div>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "الإتصالات الإلكترونية" : "Electronic communication"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? "إنك توافق على أننا يجوز لنا التواصل معك عن طريق البريد الإلكتروني أو عن طريق نشر إشعارات على الموقع. إنك توافق على أن جميع الاتفاقيات والإشعارات والافصاحات وغيرها من الاتصالات التي نقدمها لك إلكترونيًا تفي بأي شرط قانوني بأن تكون هذه الاتصالات مكتوبة. يتطلب تمكين موافقتك أثناء عملية التسجيل أن ترسل إليك رسائل بريد إلكتروني ترويجية لإعلامك بأي تغييرات أو ميزات أو أنشطة ترويجية جديدة تضاف إلى الموقع. إذا قررت في أي وقت أنك لا ترغب في تلقي رسائل البريد الإلكتروني الترويجية، يمكنك إلغاء الاشتراك في تلقي مثل هذه الرسائل الترويجية عبر النقر على الرابط الموجود أسفل أي بريد إلكتروني ترويجي." : "You agree that we may communicate with you by email or by posting notices on the Site. You agree that all agreements, notices, disclosures and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing. Enabling your consent during the registration process requires that we send you promotional emails to notify you of any new changes, features or promotional activities added to the Site. If you decide at any time that you do not wish to receive promotional emails, you may opt out of receiving such promotional emails by clicking on the link at the bottom of any promotional email."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "القواعد الأساسية للنشر على الموقع" : "Basic rules for publishing on the site"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? "تجنب النشر في فئات أو مناطق غير مخصصة لذلك على الموقع." : "Avoid posting in categories or areas on the site that are not designated for this."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "يمنع نشر أي عناصر ليست لديك الحقوق القانونية لربطها أو تضمينها." : "Do not post any items that you do not have the legal rights to link or embed."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "يحظر نشر عناصر معروضة للبيع في ذات الوقت على مواقع أخرى." : "Posting items for sale at the same time on other sites is prohibited."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "لا تقم بنشر معلومات قد تعتبر بموجب تقديرنا الخاص غير صحيحة أو مضللة أو مسيئة." : "Do not post information that may be considered in our sole discretion to be untrue, misleading or offensive."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "المحتوى والتعليقات" : "Content and comments"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? "يمنع نشر التعليقات أو الأسئلة أو الإجابات التي تعد غير واقعية أو تحمل طابعًا تمييزيًا أو تحقيريًا." : "It is prohibited to post comments, questions or answers that are unrealistic or have a discriminatory or derogatory nature."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "الابتعاد عن نشر محتوى يخل بالآداب العامة أو يعتبر فاحشًا." : "Avoid posting content that violates public morals or is considered obscene."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "تجنب نشر أي معلومات قد تعتبر مسيئة سياسيًا أو ثقافيًا أو دينيًا." : "Avoid publishing any information that may be considered politically, culturally or religiously offensive."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "الامتناع عن نشر أي محتوى يخالف الشريعة الإسلامية والأعراف المحلية." : "Refrain from publishing any content that violates Islamic law or local customs."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "المخالفات والعقوبات" : "Violations and penalties"}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "يمنع استخدام الكلمات الرئيسية بشكل يضلل المستخدمين أو يشتت انتباههم عن المحتوى الرئيسي." : "It is prohibited to use keywords in a way that misleads users or distracts them from the main content."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "الالتزام بتسليم المدفوعات و البضائع المباعة ما لم يكن هناك تغيير جوهري من قبل البائع." : "Commitment to deliver payments and goods sold unless there is a fundamental change by the seller."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "يحظر محاولة إجراء أي معاملات خارج الموقع أو التلاعب بأسعار العناصر." : "Attempting to conduct any off-site transactions or manipulating the prices of items is prohibited."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "الأمن والمسؤولية" : "Security and responsibility"}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور." : "You are responsible for maintaining the confidentiality of your account and password information."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "الموقع لا يتحمل مسؤولية أي خسائر قد تنتج عن إهمالك في حماية حسابك." : "The site does not bear responsibility for any losses that may result from your negligence in protecting your account."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "حقوق الملكية الفكرية" : "Intellectual property rights"}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "جميع المحتويات المعروضة على الموقع محمية بحقوق الملكية الفكرية، بما في ذلك النصوص والصور والعلامات التجارية." : "All content displayed on the Site is protected by intellectual property rights, including text, images and trademarks."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "استخدام العلامات التجارية للموقع يجب أن يكون بما لا يضر بسمعة الموقع أو يشوهها." : "The use of the site's trademarks must be in a way that does not harm or distort the site's reputation."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "إجراءات التقييد والإنهاء" : "Restriction and termination procedures"}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "يحق للموقع اتخاذ إجراءات فورية لتقييد نشاطك أو حتى إنهاء حسابك إذا خرقت شروط الاستخدام." : "The Site has the right to take immediate action to restrict your activity or even terminate your account if you violate the Terms of Use."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "يمكن للموقع أيضًا أن يحجب الوصول إلى الخدمات أو يقوم بإزالة محتوى دون تحمل المسؤولية إذا تطلب الأمر." : "The Site may also block access to the Services or remove content without liability if necessary."}</p>
                                            <p className="mb-2.5">{lang === 'ar' ? "هذه النسخة تقدم تفاصيل واضحة وشاملة حول الشروط والأحكام لاستخدام الموقع، مما يساعد المستخدمين على فهم ما يمكن وما لا يمكن فعله أثناء استخدام الموقع." : "This version provides clear and comprehensive details about the terms and conditions for using the site, which helps users understand what they can and cannot do while using the site."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <div>
                                        <DisclosureButton className="flex w-full justify-between rounded-md text-left text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-1 text-[#004B7A] ltr:text-left rtl:text-right">
                                            {lang === 'ar' ? "سياسة الشكاوي" : "Complaints policy"}
                                            <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                        </DisclosureButton>
                                        <DisclosurePanel className="text-xs mb-3">
                                            <p className="mb-2.5">{lang === 'ar' ? "يمكنك تقديم شكوى عند التأخر عن موعد التوصيل المنصوص عليه في الطلب أو خدمة التوصيل المنزلي، أو عدم استكمال خدمة الصيانة التي قمت بطلبها في المواعيد المتفق عليها حسب الشروط والأحكام المعلنة مسبقاً، أو الخطأ في المنتج المطلوب أو مواصفاته المعلنة على الموقع الإلكتروني، وذلك عن طريق التواصل مع مركز خدمة العملاء عبر الرقم الموحد 8002444464 الأوقات التالية (طوال أيام الأسبوع من الساعة 9 صباحاً وحتى 5 مساءً ماعدا الجمعة)  عند تسجيل الشكوى، ستستلم رسالة نصية مباشرةً تحتوي على الرقم المرجعي للشكوى يمكنك متابعة حالة الشكوى باستخدام هذا الرقم مع موظفي مركز الاتصال وخدمة العملاء" : "You can file a complaint when you are late for the delivery time stipulated in the order or the home delivery service, or if you do not complete the maintenance service that you requested on the agreed upon dates according to the previously announced terms and conditions, or there is an error in the requested product or its specifications announced on the website, for How to contact the customer service center via the unified number 8002444464 at the following times (all days of the week from 9 am to 5 pm except Friday) When registering a complaint, you will receive a direct text message containing the complaint reference number. You can follow up on the status of the complaint using this number with the call center and customer service employees."}</p>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
