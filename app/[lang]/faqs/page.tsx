"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { useApp } from "@/app/_ctx/AppContext";
import { useSlot } from '@/app/_ctx/ClientDataRegistry';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function Faqs() {
    const { lang } = useApp();
    const footer = useSlot<any>("footer");
    return (
        <>
            <div className="py-4">
                <MobileHeader type="Third" lang={lang} pageTitle={lang == 'ar' ? 'أسئلة مكررة' : 'FAQs'} />
                <div className="container md:py-4 py-16">
                    <div className="text-sm text-[#5D686F] mt-3" dangerouslySetInnerHTML={{ __html: lang == 'ar' ? footer?.data?.page_content_ar : footer?.data?.page_content_en }}></div>
                    <div className="my-6">
                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar" ? "كيفية التسوق والطلب لدى تمكين" : "How do I place an order on Tamkeen?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "(https://tamkeenstores.com.sa/ar/store-locatore) الذهاب الى الموقع الالكتروني  او زيارة احدى فروع تمكين " : "Go to the Tamkeen website or visit our  Showrooms(https://tamkeenstores.com.sa/en/store-locatore)"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "اختيار احدى المنتجات من خلال شريط البحث او الاختيار من قائمة التصنيفات " : "Select any product from the search or select from categories"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "اختيار المنتج المطلوب ثم الضغط على زر اضف الى العربة " : "Select the products then click on add to cart button"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "سوف يتم بعد ذلك توجيهك الى صفحة اتمام الطلب والدفع " : "You will be redirected to the check-out page"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "يتم بعد ذلك تعبئة البيانات المطلوبة , ثم اختيار طريقة الدفع واتمام الطلب" : "Enter the required details, select the payment method, and then places the order"}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "كيفية الغاء الطلب ؟"
                                            : "How to Cancel the Order?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "فتح الحساب ثم الذهاب الى قسم الاسترجاع " : "Open the account and go to the return section"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "اختيار زر انشاء طلب ارجاع جديد" : "Click on the “Create a New Return Request” button "}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "سوف يتم بعد ذلك توجيهك الى صفحة الطلب الخاصة بك " : "You will be redirected to the order section."}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "اختر الطلب ثم قم بإرسال امر  الالغاء " : "Select the order then send the request to cancel the order "}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "كيفية تتبع الطلب ؟"
                                            : "How do I track Orders?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "الذهاب الى الحساب الشخصي" : "Go to my account "}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "اختيار خانة الطلبات " : "click on the order section"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "يمكنك بعدها مشاهدة حالة الطلب" : "you can see the order status"}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "رسوم الشحن والتوصيل ؟"
                                            : "Shipping & Delivery charges?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <span>
                                            {lang === "ar"
                                                ? "لكل طلب رسوم توصيل مختلفة  بناءً على الموقع ، عند تقديم الطلب ، ستظهر رسوم الشحن / التسليم على صفحة عربة التسوق قبل اتمام عملية الشراء "
                                                : "Every order has different delivery charges based on location, when placing the order the shipping/delivery charges will appear on the cart page before complete the order "}
                                        </span>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "ماهي طرق الدفع المتاحة ؟"
                                            : "What are the payment methods available?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <span>
                                            {lang === "ar"
                                                ? "نحن نوفر خدمة الدفع عبر  مدى باي ، بطاقة الائتمان / بطاقة الخصم (فيزا وماستر كارد) ، آبل باي ، تسهيل ، كذلك تابي ، وتمارا (0٪ تقسيط)"
                                                : "We are offering Mada Pay, credit card/Debit card (Visa & Master card), Apple Pay, Tasheel, Tabby, and Tamara (0% Installment payment)"}
                                        </span>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "هل الشراء عبر الإنترنت آمن في تمكين؟"
                                            : "Is buying online safe at Tamkeen?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <span>
                                            {lang === "ar"
                                                ? "نعم  ، تسوق آمن 100٪ في متاجر تمكين. نحن نستخدم أفضل التقنيات في موقع الويب ، وأفضل أدوات الأمان التي ستحمي معلوماتك الخاصة القيمة من الاحتيال عبر الإنترنت والبرامج الضارة ، وما إلى ذلك. نحن لا نخزن تفاصيل الدفع الخاصة بك أو نحفظها. نقوم بتخزين البيانات الشخصية فقط لشحن البضائع ولأغراض الترويج"
                                                : "Yes, 100% safe shopping at tamkeen stores. We use the best technologies in the website, the best security tools that will protect your valuable information from online fraud and malware, etc. We don’t store or save your payment details. We store only personal details for shipping goods and promotion purposes"}
                                        </span>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "هل التسجيل وفتح حساب  في موقع  تمكين مجاني ؟"
                                            : "Is it free to register for a Tamkeen account?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "نعم ، فتح حساب والتسجيل  على موقع تمكين مجاني 100٪. " : "Yes, its 100% free to open an account on the tamkeen website."}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "باستخدام البريد الإلكتروني أو رقم الهاتف المحمول الخاص بك ، يمكنك فتح حساب على موقعنا." : "With your email id or mobile number you open an account on our website."}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "انتقل إلى الموقع  في الجزء العلوي الأيسر  من الصفحة هناك حسابي" : "Go to the website in the right-top of the website there is “My Account"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "أدخل التفاصيل المطلوبة ثم سيتم فتح حسابك" : "Click and enter the required details then your account will be open"}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "?في حال فقدان كلمة المرور"
                                            : "What if I forgot my Password?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "يمكنك إعادة تعيين كلمة المرور من خلال رقم هاتفك المحمول" : "You can reset the password through your mobile number"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "انتقل إلى حسابي أعلى الصفحة " : "go to “my account” right-top of the website"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "انتقل إلى حسابي أعلى الصفحة " : "go to “my account” right-top of the website "}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "أدخل رقم هاتفك المحمول وستحصل على OTP ، أدخل OTP ثم سيتم تسجيل دخولك" : "Enter your mobile number you will get an OTP, enter OTP then you will be logged in"}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "هل يمكن لشخص غيري استخدام حساب تمكين الخاص بي؟"
                                            : "Can someone other than me use my Tamkeen account?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <span>
                                            {lang === "ar"
                                                ? "نعم ، يمكن لشخص آخر استخدام حسابك إذا منحته الصلاحية لاستخدامه ، دون موافقتك ، لا يمكن لأي شخص استخدام حسابك. إذا كنت تمنح صلاحية استخدام حسابك ، فستكون مسؤولاً (ملاحظة: نقترح عدم إعطاء تفاصيل تسجيل الدخول الخاصة بك إلى شخص آخر)"
                                                : "Yes, someone else can use your account if you give them authority to use it, without your consent no one can use your account. If you are giving authority to use your account, then you will be responsible (Note: we suggest not to give your login details to someone else)"}
                                        </span>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "كيف يمكنني إزالة (حذف) حسابي من تمكين؟"
                                            : "How can I get my name removed(deleted) from the Tamkeen?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "يمكنك إرسال طلب إلى تمكين لحذف أو إزالة حساب من الموقع" : "You can send a request to Tamkeen to delete or remove an account from the website"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "أرسل طلبًا عبر  البريد الإلكتروني أو إلى حساب WhatsApp الرسمي الخاص بنا" : "Send a request to our email id or to our official WhatsApp account"}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "هل يمكنني الذهاب إلى الفرع  وشراء المنتج هناك بنفسي؟"
                                            : "Can I go to your showroom and buy the item there myself?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "نعم ، يمكنك الذهاب مباشرة إلى احدى الفروع  وشراء المنتج الذي تريده" : "Yes, you can directly go to any of the showrooms and purchase any item which you want"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "قائمة بمواقع فروع تمكين :https://tamkeenstores.com.sa/en/store-locatore/" : "list of showroom: https://tamkeenstores.com.sa/en/store-locatore/"}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>
                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "هل يمكن الشراء من الموقع الالكتروني ثم الاستلام من الفرع ؟"
                                            : "Can I buy online and pickup from the showroom?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "نعم ، يمكنك تقديم الطلب عبر الموقع الالكتروني ثم الاستلام من احدى الفروع " : "Yes, you can place the order online and pick it up from the showroom"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "قبل زيارة أي فرع ، يرجى الاتصال بخدمة العملاء لدينا حتى نتمكن من ترتيب منتجك في الفرع المطلوب" : "before you visit any showroom please make contact our customer care so we can arrange your product for that particular showroom"}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "ما هي طرق الدفع التي يمكنني استخدامها ؟"
                                            : "What payment methods can I use to pay for my order?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "نقدم جميع أنواع طرق الدفع مثل بطاقات الائتمان / بطاقات الخصم العائدة لجميع البنوك في المملكة العربية السعودية" : "We offer all types of payment methods such as credit card/debit cards belonging to all banks from Saudi Arabia."}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "نقدم أيضًا طرق دفع أخرى: تطبيق ابل باي  و تسهيل و تمارا  و تابي  والدفع نقدًا عند الاستلام " : "We also offer other payment methods: Apply Pay, Tasheel, Tamara, Tabby, and cash on delivery (COD)"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "حاليا خدمة الدفع عند الاستلام متوفرة لدى مدينة جدة فقط" : "Currently Cash on Delivery (COD) Avialble only in Jeddah city"}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "ماهي رسوم  خدمة التوصيل الخاصة بي؟"
                                            : "How much do I need to pay for my delivery service?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "هذا يعتمد على نوع المنتجات والموقع الذي تحدده ، والمكان الذي تريد التسليم فيه." : "This is depending on the type of products and location you select, where you want to deliver. "}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "ستظهر رسوم التوصيل على صفحة  السلة الخاصة بك أثناء شرائك للمنتج وقبل اتمام عملية الشراء " : "Delivery charges will appear on the cart while you purchasing the product"}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "ماهي المناطق المغطاة بها خدمة التوصيل ؟"
                                            : "What are the areas or locations covered for delivery?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <span>
                                            {lang === "ar"
                                                ? "نحن نغطي جميع أنحاء المملكة العربية السعودية ، ونقوم بالشحن إلى جميع المواقع (المناطق والمدن) في المملكة العربية السعودية. بالنسبة لخدمة الدفع عند الاستلام متاحة داخل مدينة جدة فقط (COD)."
                                                : "We cover all over Saudi Arabia, we ship to all the locations (regions, cities) of Saudi Arabia. In Jeddah only we offer cash on delivery (COD)."}
                                        </span>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "ماهي رسوم خدمة التركيب ؟"
                                            : "How much do I need to pay for my installation service?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul>
                                            <li className="my-1">-{' '}{lang === "ar" ? "تكلفة خدمة تركيب مكيف الهواء الاسبليت 200 ريال (بالإضافة إلى ذلك يتم احتساب سعر الأنبوب لكل متر)" : "Spilt Air Condition Installation service cost of 200 SR (additionally Pipe will charge per meter)"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "تكلفة خدمة تركيب مكيف الشباك 50 ريال (بالإضافة إلى ذلك يتم احتساب سعر الأنبوب لكل متر)" : "Window Air Conditioner Installation 50 SR (additionally Pipe will charge per meter)"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "فك (إزالة) التكييف القديم 100 ريال" : "Replacing(removing) Old Air Conditioner 100 SR"}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "كيف يمكنني إرجاع أو استبدال المنتج بعد الشراء ؟"
                                            : "How can I return or exchange items I bought from Tamkeen?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "تسجيل الدخول الى الحساب " : "Login to your your account "}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "اختيار خانة المرتجعات " : "there is one option “return” "}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "ثم اختيار المنتج الذي ترغب بإسترجاعه" : "Click on it and see which items you want to return."}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "يمكنك ايظا رفع طلب استرجاع عن طريق ايقونة التذكرة " : "Also, you can open a return request ticket"}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "الاوراق والخطوات الازمة  للدفع بواسطة Tamara & Tabby؟"
                                            : "What’s required for me to pay with Tamara & Tabby?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "في حال الاستخدام للمره الاولى سوف يتطلب تسجيل (  بطاقة الهوية الوطنية  - هوية الاقامة للمقيمين )" : "For the first time, you will require (Saudi citizen – national id & Residents – iqama id)"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "حساب مصرفي صالح ببطاقة ائتمان / مدى " : "A valid bank account with credit/debit card"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "رقم جوال صالح لفتح الحساب" : "A valid mobile number to open the account"}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "الشحن المجاني من تمكين ؟"
                                            : "About free shipping from Tamkeen?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "فيما يتعلق بالشحن المجاني ، بالنسبة لبعض المنتجات لدينا شحن مجاني وقد تم ذكر ذلك" : "Regarding free shipping, for some of the products we have free shipping and we mentioned "}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "شحن مجاني للمنتج المعني ، أثناء شرائك للمنتج سوف تظهر ايقونة الشحن المجاني في الصفحة الخاصة  لسلة التسوق" : "free shipping on the respective product, while you purchase the product it will appear on the cartpage"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "في حال وجود شحن مجاني للمنتج سوف يتم توضيح ذلك  " : "if free shipping is applicable to that particular product"}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "هل خدمة الدفع عند الاستلام متاحة ؟"
                                            : "Is Cash on Delivery available?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "نعم ، الدفع عند الاستلام متاح فقط لمدينة جدة." : "Yes, currently cash-on-delivery is available only for Jeddah city. "}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "في القريب العاجل سنوسع خدمات الدفع عند الاستلام في جميع أنحاء المملكة العربية السعودية" : "Very Soon we will expand our cash-on-delivery services across Saudi Arabia"}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "هل تفاصيل الدفع والبطاقة الخاصة بي آمنة؟"
                                            : "Are my payment and card details safe?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "نعم ، الدفع والبطاقة آمنان بنسبة 100٪" : "Yes, your payment and card are 100% safe "}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "عملائنا الاعزاء  ، نحن (تمكين) لا نقوم أبدًا بتخزين أو حفظ تفاصيل بطاقتك / الدفع  على موقعنا الإلكتروني أو خادمنا." : "For your kind information we (Tamkeen) never store or save your card/payment details on our website or server."}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "نقوم فقط بتخزين بياناتك الشخصية لأغراض توصيل المنتجات والترويج لها" : "We only store your personal details for products Delivery and promotion purposes"}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex w-full justify-between rounded-md ltr:text-left rtl:text-right text-sm font-medium focus-visible:outline-none bg-[#EEF8FC] p-2 md:p-3 mb-3 text-[#004B7A]">
                                        {lang === "ar"
                                            ? "كيف يمكنني التقدم بطلب لاسترداد المبلغ المالي ؟"
                                            : "How do I apply for a refund?"}
                                        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_10486749" className={`transform ${open ? '-rotate-180' : ''} fill-[#004B7A] transition duration-150 ease-in-out`}><path clipRule="evenodd" d="m2.58579 7.58579c.78104-.78105 2.04738-.78105 2.82842 0l6.58579 6.58581 6.5858-6.58581c.781-.78105 2.0474-.78105 2.8284 0 .7811.78104.7811 2.04738 0 2.82841l-8 8c-.781.7811-2.0474.7811-2.8284 0l-8.00001-8c-.78105-.78103-.78105-2.04737 0-2.82841z" fillRule="evenodd"></path></svg>
                                    </DisclosureButton>
                                    <DisclosurePanel className="text-xs mb-3">
                                        <ul className="ltr:ml-5 rtl:mr-5">
                                            <li className="my-1">-{' '}{lang === "ar" ? "لطلبات الموقع الالكتروني :" : "Online Order through Tamkeen Stores Website:"}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "يمكنك التواصل معنا من خلال رقم خدمة العملاء الموحد 8002444464، أو التواصل معنا من خلال أي منصات  التواصل الاجتماعي ." : "You can contact us through our UAN number, 800 444 2444, or connect with us through any social media platform."}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "أدخل رقم طلبك مع ذكر سبب استرداد المبلغ وإرجاع المنتج" : "Provide your Order number & explain the reason for the refund and return the product."}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "سيقوم مشرف خدمة العملاء لدينا بمراجعة الطلب الخاص بك , وستتلقى رسالة نصية قصيرة لطلبك." : "Our customer care manager will make a refund Ticket & you will receive an SMS of your request."}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "في حال تم توصيل و استلام  المنتج بالفعل ، فسيبدأ إجراءات الالغاء عند اعادة المنتج مرة أخرى في مستودعاتنا." : "If the product is already delivered, the procedure starts when we received the product back on our warehouse."}
                                            </li>
                                            <li className="my-1">-{' '}{lang === "ar" ? "تستغرق إجراءات استرداد المبلغ من 10 إلى 15 يوم عمل." : "The amount refund procedure takes 10-15 working days."}
                                            </li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>
                    </div>
                </div>
            </div >
        </>
    )
}
