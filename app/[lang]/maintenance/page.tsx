"use client"; // This is a client component 👈🏽

import React, { useState, Fragment } from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'
import { Dialog, Transition, RadioGroup, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import dynamic from 'next/dynamic'
import { useRouter } from 'next-nprogress-bar'
import { useApp } from "@/app/_ctx/AppContext";
import { useSlot } from '@/app/_ctx/ClientDataRegistry';
import { getUserData, getUserOrderDetails, getMaintainanceProductDetails } from '@/lib/footerpages/maintainance.client';
import { postMaintenanceData } from '@/lib/footerpages/maintenance.client';

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })

export default function Maintenance() {
    const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA;
    const { t, lang, origin } = useApp();
    const footer = useSlot<any>("footer");
    const router = useRouter()
    const [activeTab1, setActiveTab1] = useState<boolean>(true);
    const [activeTab2, setActiveTab2] = useState<boolean>(false);
    const [activeTab3, setActiveTab3] = useState<boolean>(false);
    const [show, setShow] = useState<any>(false)
    const [radioval, setRadioVal] = useState<any>('')
    const [orderNo, setOrderNo] = useState<any>(false)
    const [selected, setSelected] = useState<any>(false)
    const [selectedProduct, setSelectedProduct] = useState<any>(false)
    const [subjectData, setSubjectData] = useState<any>('')
    const [commentData, setCommentData] = useState<any>('')
    const [selectedTime, setSelectedTime] = useState<any>(false)
    const [orderDetails, setOrderDetails] = useState<any>([])
    const [orderListing, setOrderListing] = useState<any>([])
    const [checkMaintenanceData, setCheckMaintenanceData] = useState<any>([])

    const checkUser = async () => {
        if (localStorage.getItem('userid')) {
            getUserData().then((ordersData: any) => {
                setOrderListing(ordersData?.userData)
                setShow(true)
            })
        } else {
            router.push(`${origin}/${lang}/login`)
        }
    }

    const getOrderDetailsData = async (orderid: string) => {
        getUserOrderDetails(orderid).then((specificOrderDetails: any) => {
            setOrderDetails(specificOrderDetails?.userOrderDetails)
        })
        getMaintainanceProductDetails(orderid).then((maintainanceProduct: any) => {
            setCheckMaintenanceData(maintainanceProduct?.maintainanceProductDetails)
        })
    }

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


    const SubmitData = async () => {
        try {
            var data = {
            order_no: orderNo,
            orderdetail_id: selected,
            product_id: selectedProduct,
            subject: subjectData,
            comment: commentData,
            time: selectedTime,
            user_id: localStorage.getItem('userid'),
            }

            const res = await postMaintenanceData(data);
            if (res?.maintenanceData?.success === true) {
                setShow(false)
                topMessageAlartSuccess(t('maintenanceAdded'))
                setOrderNo(false)
                setSelected(false)
                setSelectedProduct(false)
                setSubjectData('')
                setCommentData('')
                setSelectedTime(false)
                setActiveTab1(true)
                setActiveTab3(false)
                setActiveTab2(false)
            } else {
                topMessageAlartDanger(t('somethingwentwrong'))
            }
        } catch (e) {
            console.error("updateProfileData failed:", e);
            topMessageAlartDanger(lang === "ar" ? "حدث خطأ غير متوقع" : "Unexpected error");
        }
    }
    return (
        <>
            <MobileHeader type="Third" lang={lang} pageTitle={lang == 'ar' ? 'صيانة تمكين' : 'Tamkeen Maintenance'} />

            <div className="container md:py-4 py-16">

                <div className="my-6">
                    <h1 className="font-semibold text-lg 2xl:text-xl md:block hidden">{lang == 'ar' ? 'صيانة تمكين' : 'Tamkeen Maintenance'}</h1>
                    <div className="text-sm text-[#5D686F] md:mt-3" dangerouslySetInnerHTML={{ __html: lang == 'ar' ? footer?.data?.page_content_ar : footer?.data?.page_content_en }}></div>

                    <div className="my-6 text-[#515567] font-normal text-xs">
                        <h2 className="font-bold text-sm md:text-xl text-[#004B7A]">Maintenance and After-sales</h2>
                        <p className="mt-2">The company has expanded specialized centers to provide services, both stand-alone and mobility to meet the needs of customers after sales. Our coverage areas reach from the North to South, East to West.</p>
                        <p className="mt-2">Tamkeen Stores proudly provides maintenance after-sales service for all types of global brands. All of the warranty services and repairs provided by Tamkeen Stores are under authorization from the manufacturer. All your devices will be handled by professional and certified technicians and repaired using genuine spare parts and components. Moreover, the Product Warranty covers spare parts and labor costs during the warranty period. Below is a list of Maintenance centers across the kingdom. Maximum repair time of up to 15 days from the maintenance request date.</p>
                    </div>
                </div>

                <div className="text-sm font-medium flex items-center gap-x-3 mb-10 md:mb-0">
                    <button
                        className="focus-visible:outline-none bg-[#219EBC] text-white border-[#219EBC] border py-3 px-9 rounded-md max-md:w-1/2"
                        type="button" aria-label={lang == 'ar' ? 'فتح تذكرة' : 'Open Ticket'}
                        onClick={() => {
                            checkUser()
                        }}
                    >
                        {lang == 'ar' ? 'فتح تذكرة' : 'Open Ticket'}
                    </button>
                    <button className="focus-visible:outline-none border-[#219EBC] border text-[#219EBC] py-3 px-8 rounded-md hover:bg-[#219EBC] hover:text-white max-md:w-1/2" type="button" aria-label={lang == 'ar' ? 'تواصل معنا' : 'Contact with Us'}
                        onClick={() => {
                            router.push(`${origin}/${lang}/contact-us`)
                        }}
                    >{lang == 'ar' ? 'تواصل معنا' : 'Contact with Us'}</button>
                </div>
            </div>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-20" onClose={() => setShow(false)}>
                    <div className="fixed inset-0 bg-dark/40" aria-hidden="true" />
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex md:min-h-full h-full items-center justify-center md:p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-3xl max-md:h-screen h-full transform overflow-hidden rounded-md bg-white text-left align-middle shadow-xl transition-all">
                                    <DialogTitle
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 container"
                                    >
                                        <div className="py-3.5 border-b mb-3 border-[#9CA4AB50]">
                                            <div className="flex items-center justify-between ">
                                                <DialogTitle
                                                    as="h4"
                                                    className="text-lg font-bold leading-6 text-gray-900"
                                                >
                                                    {lang == 'ar' ? "اختر طلبا" : "Select Order"}
                                                </DialogTitle>
                                                <button onClick={() => setShow(false)} className="focus-visible:outline-none">
                                                    <svg height="16" viewBox="0 0 329.26933 329" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_1828778"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </DialogTitle>


                                    <div className="mt-2 overflow-y-auto h-full pb-40">
                                        {activeTab1 === true ?
                                            <div className="container">
                                                {orderListing?.orderdata?.orders_data?.map((data: any, i: any) => {
                                                    if (data?.status === 4) {
                                                        return (
                                                            <div className="grid grid-cols-3 md:grid-cols-6 bg-white px-3 md:p-5 shadow-md rounded-md mb-3 text-sm" key={i}>
                                                                <div className="text-[#1C262D85] max-md:my-4">
                                                                    <h4 className="font-medium text-xs mb-1">{lang == 'ar' ? 'رقم الطلب' : 'Order Number'}:</h4>
                                                                    <p className="font-medium text-[#004B7A]">{data?.order_no}</p>
                                                                </div>
                                                                <div className="text-[#1C262D85] max-md:my-4">
                                                                    <h4 className="font-medium text-xs mb-1">{lang == 'ar' ? 'تاريخ الطلب' : 'Order Date'}:</h4>
                                                                    <p className="font-medium text-[#004B7A]">{dayjs(data?.created_at).locale(lang == 'ar' ? 'ar' : 'en').format("MMM  DD, YYYY")}</p>
                                                                </div>
                                                                <div className="text-[#1C262D85] max-md:my-4">
                                                                    <h4 className="font-medium text-xs mb-1">{lang == 'ar' ? 'عدد المنتجات' : 'No. of Products'}:</h4>
                                                                    <p className="font-medium text-[#004B7A]">({data?.details_count}) {lang == 'ar' ? 'منتجات' : 'Items'}</p>
                                                                </div>
                                                                <div className="text-[#1C262D85] max-md:my-4">
                                                                    <h4 className="font-medium text-xs mb-1">{lang == 'ar' ? 'إجمالي القيمة' : 'Total Value'}:</h4>
                                                                    <p className="font-medium text-[#004B7A]">{lang == 'ar' ? '' : 'SR'} {Intl.NumberFormat('en-US').format(data?.ordersummary[0]?.price)} {lang == 'ar' ? 'ريال' : ''}</p>
                                                                </div>
                                                                <div className="text-[#1C262D85] max-md:my-4">
                                                                    <h4 className="font-medium text-xs mb-1">{lang == 'ar' ? 'رقم الهاتف' : 'Order Status'}:</h4>
                                                                    <p className="font-medium text-[#20831E]">{lang == 'ar' ? 'أجل تسليم' : 'Delivered'}</p>
                                                                </div>
                                                                <div className="flex items-center justify-center underline text-[#B15533]">
                                                                    <button className="focus-visible:overflow-hidden" onClick={() => { setActiveTab2(true), setActiveTab1(false), getOrderDetailsData(data?.id) }}>{lang == 'ar' ? 'رقم الهاتف' : 'View Details'}</button>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                                }
                                            </div>
                                            :
                                            activeTab2 === true ?
                                                <div className="container">
                                                    {orderDetails?.orderdata?.status ?
                                                        <div className="grid grid-cols-3 md:grid-cols-5 bg-white px-3 md:p-5 shadow-md rounded-md mb-3 text-sm">
                                                            <div className="text-[#1C262D85] max-md:my-4">
                                                                <h4 className="font-medium text-xs mb-1">{lang == 'ar' ? 'رقم الطلب' : 'Order Number'}:</h4>
                                                                <p className="font-medium text-[#004B7A]">{orderDetails?.orderdata?.order_no}</p>
                                                            </div>
                                                            <div className="text-[#1C262D85] max-md:my-4">
                                                                <h4 className="font-medium text-xs mb-1">{lang == 'ar' ? 'تاريخ الطلب' : 'Order Date'}:</h4>
                                                                <p className="font-medium text-[#004B7A]">{dayjs(orderDetails?.orderdata?.created_at).locale(lang == 'ar' ? 'ar' : 'en').format("MMM  DD, YYYY")}</p>
                                                            </div>
                                                            <div className="text-[#1C262D85] max-md:my-4">
                                                                <h4 className="font-medium text-xs mb-1">{lang == 'ar' ? 'عدد المنتجات' : 'No. of Products'}:</h4>
                                                                <p className="font-medium text-[#004B7A]">({orderDetails?.orderdata?.details_count}) {lang == 'ar' ? 'منتجات' : 'Items'}</p>
                                                            </div>
                                                            <div className="text-[#1C262D85] max-md:my-4">
                                                                <h4 className="font-medium text-xs mb-1">{lang == 'ar' ? 'إجمالي القيمة' : 'Total Value'}:</h4>
                                                                <p className="font-medium text-[#004B7A]">{lang == 'ar' ? '' : 'SR'} {Intl.NumberFormat('en-US').format(orderDetails?.orderdata?.ordersummary[0]?.price)} {lang == 'ar' ? 'ريال' : ''}</p>
                                                            </div>
                                                            <div className="text-[#1C262D85] max-md:my-4">
                                                                <h4 className="font-medium text-xs mb-1">{lang == 'ar' ? 'رقم الهاتف' : 'Order Status'}:</h4>
                                                                <p className="font-medium text-[#20831E]">{lang == 'ar' ? 'أجل تسليم' : 'Delivered'}</p>
                                                            </div>
                                                        </div>
                                                        : null
                                                    }
                                                    <div className="flex items-center justify-between">
                                                        <h2 className="font-bold text-base">{lang == 'ar' ? 'محتوي الطلب' : 'Products'}</h2>
                                                    </div>
                                                    <div className="mt-1 max-md:pb-32">
                                                        <RadioGroup value={selected} onChange={(e) => {
                                                            setSelected(e)
                                                            setSubjectData('')
                                                            setCommentData('')
                                                        }}>
                                                            <div className="space-y-2">
                                                                {orderDetails?.orderdata?.details?.map((data: any, i: React.Key | null | undefined) => {
                                                                    // console.log(checkMaintenanceData)
                                                                    if (data?.total != "0") {
                                                                        return (
                                                                            <RadioGroup.Option
                                                                                key={i}
                                                                                value={data?.id}
                                                                                className={({ active, checked }) => ` ${checked ? '' : ''} relative focus:outline-none`}
                                                                                disabled={checkMaintenanceData[data?.id] ? true : false}
                                                                            >
                                                                                {({ active, checked }) => (
                                                                                    <>
                                                                                        <div className={`bg-white rounded-md shadow-md flex items-center gap-x-4 mb-4 p-2 max-md:relative border ${checked ? 'border-[#219EBC]' : 'border-transparent'}`} key={i}>
                                                                                            <div className="md:relative md:w-44 flex items-center">
                                                                                                {checked || checkMaintenanceData[data?.id] ?
                                                                                                    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 max-md:absolute max-md:top-2 right-2">
                                                                                                        <circle cx={12} cy={12} r={12} fill="#219EBC" opacity="0.2" />
                                                                                                        <path
                                                                                                            d="M7 13l3 3 7-7"
                                                                                                            stroke="#219EBC"
                                                                                                            strokeWidth={2}
                                                                                                            strokeLinecap="round"
                                                                                                            strokeLinejoin="round"
                                                                                                        />
                                                                                                    </svg>
                                                                                                    :
                                                                                                    <svg viewBox="0 0 24 24" fill="#219EBC60" className="h-6 w-6 max-md:absolute max-md:top-2 right-2">
                                                                                                        <circle cx={12} cy={12} r={12} fill="#219EBC60" opacity={0.2} />
                                                                                                    </svg>

                                                                                                }
                                                                                                <Image
                                                                                                    src={data?.product_data?.featured_image?.image ? NewMedia + data?.product_data?.featured_image?.image : 'https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                                                                                    alt={lang == 'ar' ? data?.product_data?.name_arabic : data?.product_data?.name}
                                                                                                    title={lang == 'ar' ? data?.product_data?.name_arabic : data?.product_data?.name}
                                                                                                    height='40'
                                                                                                    width='40'
                                                                                                    loading='lazy'
                                                                                                    className="mx-auto scale-150"
                                                                                                />
                                                                                            </div>
                                                                                            <div className="p-3 w-full">
                                                                                                <h4 className="text-primary text-xs md:text-sm">{lang == 'ar' ? data?.product_data?.name_arabic : data?.product_data?.name}</h4>
                                                                                                <div className="text-[#5D686F] text-sm flex items-center gap-x-2 mt-2 justify-between">
                                                                                                    <h2 className="text-sm md:text-base font-semibold text-dark">{lang == 'ar' ? `${Intl.NumberFormat('en-US').format(data?.product_data?.sale_price)} ر.س` : `SR ${Intl.NumberFormat('en-US').format(data?.product_data?.sale_price)}`}{'  '}<span className="text-xs text-[#DC4E4E] line-through decoration-[#DC4E4E] decoration-2 font-medium">{lang == 'ar' ? `${Intl.NumberFormat('en-US').format(data?.product_data?.price)} ر.س` : `SR ${Intl.NumberFormat('en-US').format(data?.product_data?.price)}`}</span></h2>
                                                                                                    <p className="font-bold text-xs">{lang == 'ar' ? 'عدد' : 'Qty'} {data?.quantity}</p>
                                                                                                </div>
                                                                                                <div className="mt-3">
                                                                                                    <div className="pb-3 pt-2.5 px-3 bg-white rounded-md border flex items-center border-[#5D686F30] gap-x-2 mb-1.5">
                                                                                                        <input disabled={selected == data?.id ? false : true} className="focus-visible:outline-none w-full text-xs font-normal" placeholder={lang === 'ar' ? '' : 'Subject'} type="text"
                                                                                                            value={checkMaintenanceData[data?.id] ? checkMaintenanceData[data?.id].subject : selected == data?.id ? subjectData : ''}

                                                                                                            onChange={(e) => {
                                                                                                                setSubjectData(e.target.value)
                                                                                                                setOrderNo(data?.order_id)
                                                                                                                setSelectedProduct(data?.product_id)
                                                                                                            }} />
                                                                                                    </div>
                                                                                                    <div className="pb-3 pt-2.5 px-3 bg-white rounded-md border flex items-center border-[#5D686F30] gap-x-2 w-full">
                                                                                                        <textarea className="focus-visible:outline-none w-full text-xs font-normal" placeholder={lang === 'ar' ? '' : 'Describe the problem of product...'}
                                                                                                            value={checkMaintenanceData[data?.id] ? checkMaintenanceData[data?.id].comment : selected == data?.id ? commentData : ''}
                                                                                                            onChange={(e) => {
                                                                                                                setCommentData(e.target.value)
                                                                                                                setOrderNo(data?.order_id)
                                                                                                                setSelectedProduct(data?.product_id)
                                                                                                            }} />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>
                                                                                )}
                                                                            </RadioGroup.Option>
                                                                        )
                                                                    }
                                                                })
                                                                }
                                                            </div>
                                                        </RadioGroup>
                                                    </div>
                                                </div>
                                                :
                                                activeTab3 === true ?
                                                    <div className="container">
                                                        <p className="text-xs font-medium mt-1 text-[#5D686F]">{lang == 'ar' ? 'يرجي اختيار اليوم والوقت المناسب من الجدول التالي حيث سيتم التواصل معكم وتحديد الوقت المتاح لديكم' : 'Please choose the appropriate day and time from the following table, where we will contact you and determine the time you have available.'}</p>
                                                        <div className="grid grid-cols-5 mt-4 w-full">
                                                            <div className="text-xs text-[#004B7A] font-medium text-center">
                                                                <p className="p-4 bg-[#D9D9D960]">{lang == 'ar' ? 'السبت' : 'Saturday'}</p>
                                                                <p className="p-4">{lang == 'ar' ? 'الاحد' : 'Sunday'}</p>
                                                                <p className="p-4 bg-[#D9D9D960]">{lang == 'ar' ? 'الاثنين' : 'Monday'}</p>
                                                                <p className="p-4">{lang == 'ar' ? 'الثلاثاء' : 'Tuesday'}</p>
                                                                <p className="p-4 bg-[#D9D9D960]">{lang == 'ar' ? 'الثلاثاء' : 'Wednesday'}</p>
                                                                <p className="p-4">{lang == 'ar' ? 'الخميس' : 'Thursday'}</p>
                                                                <p className="p-4 bg-[#D9D9D960]">{lang == 'ar' ? 'الجمعة' : 'Friday'}</p>
                                                            </div>
                                                            <div className="col-span-4 text-xs text-[#5D686F] font-medium">
                                                                <div className="p-4 bg-[#D9D9D960] grid grid-cols-2">
                                                                    <label className="inline-flex gap-x-2">
                                                                        <input type="radio" name="default_radio" className="form-radio" value="Sat 9AM to 5PM" checked={radioval === 'Sat 9AM to 5PM'}
                                                                            onChange={(e: any) => {
                                                                                setRadioVal(e.target.value)
                                                                                setSelectedTime(e.target.value)
                                                                            }} />
                                                                        <span>{lang == 'ar' ? 'مـن 09:00 صباحا - الـي 05:00 مسـاءا' : 'From 09:00 AM - to 05:00 PM'}</span>
                                                                    </label>
                                                                    <label className="inline-flex gap-x-2">
                                                                        <input type="radio" name="default_radio" className="form-radio" value="Sat 5PM to 12PM" checked={radioval === 'Sat 5PM to 12PM'}
                                                                            onChange={(e: any) => {
                                                                                setRadioVal(e.target.value)
                                                                                setSelectedTime(e.target.value)
                                                                            }} />
                                                                        <span>{lang == 'ar' ? 'مـن 05:00 مساءا - الـي 12:00 مسـاءا' : 'From 05:00 pm - to 12:00 pm'}</span>
                                                                    </label>
                                                                </div>
                                                                <div className="p-4 grid grid-cols-2">
                                                                    <label className="inline-flex gap-x-2">
                                                                        <input type="radio" name="default_radio" className="form-radio" value="Sun 9AM to 5PM" checked={radioval === 'Sun 9AM to 5PM'}
                                                                            onChange={(e: any) => {
                                                                                setRadioVal(e.target.value)
                                                                                setSelectedTime(e.target.value)
                                                                            }} />
                                                                        <span>{lang == 'ar' ? 'مـن 09:00 صباحا - الـي 05:00 مسـاءا' : 'From 09:00 AM - to 05:00 PM'}</span>
                                                                    </label>
                                                                    <label className="inline-flex gap-x-2">
                                                                        <input type="radio" name="default_radio" className="form-radio" value="Sun 5PM to 12PM" checked={radioval === 'Sun 5PM to 12PM'}
                                                                            onChange={(e: any) => {
                                                                                setRadioVal(e.target.value)
                                                                                setSelectedTime(e.target.value)
                                                                            }} />
                                                                        <span>{lang == 'ar' ? 'مـن 05:00 مساءا - الـي 12:00 مسـاءا' : 'From 05:00 pm - to 12:00 pm'}</span>
                                                                    </label>
                                                                </div>
                                                                <div className="p-4 bg-[#D9D9D960] grid grid-cols-2">
                                                                    <label className="inline-flex gap-x-2">
                                                                        <input type="radio" name="default_radio" className="form-radio" value="Mon 9AM to 5PM" checked={radioval === 'Mon 9AM to 5PM'}
                                                                            onChange={(e: any) => {
                                                                                setRadioVal(e.target.value)
                                                                                setSelectedTime(e.target.value)
                                                                            }} />
                                                                        <span>{lang == 'ar' ? 'مـن 09:00 صباحا - الـي 05:00 مسـاءا' : 'From 09:00 AM - to 05:00 PM'}</span>
                                                                    </label>
                                                                    <label className="inline-flex gap-x-2">
                                                                        <input type="radio" name="default_radio" className="form-radio" value="Mon 5PM to 12PM" checked={radioval === 'Mon 5PM to 12PM'}
                                                                            onChange={(e: any) => {
                                                                                setRadioVal(e.target.value)
                                                                                setSelectedTime(e.target.value)
                                                                            }} />
                                                                        <span>{lang == 'ar' ? 'مـن 05:00 مساءا - الـي 12:00 مسـاءا' : 'From 05:00 pm - to 12:00 pm'}</span>
                                                                    </label>
                                                                </div>
                                                                <div className="p-4 grid grid-cols-2">
                                                                    <label className="inline-flex gap-x-2">
                                                                        <input type="radio" name="default_radio" className="form-radio" value="Tue 9AM to 5PM" checked={radioval === 'Tue 9AM to 5PM'}
                                                                            onChange={(e: any) => {
                                                                                setRadioVal(e.target.value)
                                                                                setSelectedTime(e.target.value)
                                                                            }} />
                                                                        <span>{lang == 'ar' ? 'مـن 09:00 صباحا - الـي 05:00 مسـاءا' : 'From 09:00 AM - to 05:00 PM'}</span>
                                                                    </label>
                                                                    <label className="inline-flex gap-x-2">
                                                                        <input type="radio" name="default_radio" className="form-radio" value="Tue 5PM to 12PM" checked={radioval === 'Tue 5PM to 12PM'}
                                                                            onChange={(e: any) => {
                                                                                setRadioVal(e.target.value)
                                                                                setSelectedTime(e.target.value)
                                                                            }} />
                                                                        <span>{lang == 'ar' ? 'مـن 05:00 مساءا - الـي 12:00 مسـاءا' : 'From 05:00 pm - to 12:00 pm'}</span>
                                                                    </label>
                                                                </div>
                                                                <div className="p-4 bg-[#D9D9D960] grid grid-cols-2">
                                                                    <label className="inline-flex gap-x-2">
                                                                        <input type="radio" name="default_radio" className="form-radio" value="Wed 9AM to 5PM" checked={radioval === 'Wed 9AM to 5PM'}
                                                                            onChange={(e: any) => {
                                                                                setRadioVal(e.target.value)
                                                                                setSelectedTime(e.target.value)
                                                                            }} />
                                                                        <span>{lang == 'ar' ? 'مـن 09:00 صباحا - الـي 05:00 مسـاءا' : 'From 09:00 AM - to 05:00 PM'}</span>
                                                                    </label>
                                                                    <label className="inline-flex gap-x-2">
                                                                        <input type="radio" name="default_radio" className="form-radio" value="Wed 5PM to 12PM" checked={radioval === 'Wed 5PM to 12PM'}
                                                                            onChange={(e: any) => {
                                                                                setRadioVal(e.target.value)
                                                                                setSelectedTime(e.target.value)
                                                                            }} />
                                                                        <span>{lang == 'ar' ? 'مـن 05:00 مساءا - الـي 12:00 مسـاءا' : 'From 05:00 pm - to 12:00 pm'}</span>
                                                                    </label>
                                                                </div>
                                                                <div className="p-4 grid grid-cols-2">
                                                                    <label className="inline-flex gap-x-2">
                                                                        <input type="radio" name="default_radio" className="form-radio" value="Thu 9AM to 5PM" checked={radioval === 'Thu 9AM to 5PM'}
                                                                            onChange={(e: any) => {
                                                                                setRadioVal(e.target.value)
                                                                                setSelectedTime(e.target.value)
                                                                            }} />
                                                                        <span>{lang == 'ar' ? 'مـن 09:00 صباحا - الـي 05:00 مسـاءا' : 'From 09:00 AM - to 05:00 PM'}</span>
                                                                    </label>
                                                                    <label className="inline-flex gap-x-2">
                                                                        <input type="radio" name="default_radio" className="form-radio" value="Thu 5PM to 12PM" checked={radioval === 'Thu 5PM to 12PM'}
                                                                            onChange={(e: any) => {
                                                                                setRadioVal(e.target.value)
                                                                                setSelectedTime(e.target.value)
                                                                            }} />
                                                                        <span>{lang == 'ar' ? 'مـن 05:00 مساءا - الـي 12:00 مسـاءا' : 'From 05:00 pm - to 12:00 pm'}</span>
                                                                    </label>
                                                                </div>
                                                                <div className="p-4 bg-[#D9D9D960] grid grid-cols-2">
                                                                    <label className="inline-flex gap-x-2">
                                                                        <input type="radio" name="default_radio" className="form-radio" value="Fri 9AM to 5PM" checked={radioval === 'Fri 9AM to 5PM'}
                                                                            onChange={(e: any) => {
                                                                                setRadioVal(e.target.value)
                                                                                setSelectedTime(e.target.value)
                                                                            }} />
                                                                        <span>{lang == 'ar' ? 'مـن 09:00 صباحا - الـي 05:00 مسـاءا' : 'From 09:00 AM - to 05:00 PM'}</span>
                                                                    </label>
                                                                    <label className="inline-flex gap-x-2">
                                                                        <input type="radio" name="default_radio" className="form-radio" value="Fri 5PM to 12PM" checked={radioval === 'Fri 5PM to 12PM'}
                                                                            onChange={(e: any) => {
                                                                                setRadioVal(e.target.value)
                                                                                setSelectedTime(e.target.value)
                                                                            }} />
                                                                        <span>{lang == 'ar' ? 'مـن 05:00 مساءا - الـي 12:00 مسـاءا' : 'From 05:00 pm - to 12:00 pm'}</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : null}

                                    </div>

                                    {activeTab1 === true ? null :
                                        <div className="fixed bottom-0 py-3 bg-white w-full border-t border-[#00000010] flex items-center justify-between container gap-2">
                                            {activeTab2 === true || activeTab3 === true ?
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (activeTab2 === true) {
                                                            setActiveTab2(false)
                                                            setActiveTab1(true)
                                                        } if (activeTab3 === true) {
                                                            setActiveTab2(true)
                                                            setActiveTab3(false)
                                                        }
                                                    }}
                                                    className="w-1/4 focus-visible:outline-none border border-[#004B7A] hover:bg-[#004B7A] hover:text-white text-[#004B7A] text-xs font-semibold px-3.5 py-3 rounded-md shadow-md hover:shadow-none"
                                                >
                                                    {lang == 'ar' ? 'الغاء الطلب' : "Back"}
                                                </button>
                                                : null}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (activeTab2 === true) {
                                                        if (subjectData == '' || commentData == '') {
                                                            return topMessageAlartDanger(lang === 'ar' ? "الرجاء إضافة بيانات الحقول!" : "please add fields data!")
                                                        }
                                                        setActiveTab3(true)
                                                        setActiveTab2(false)
                                                    } if (activeTab3 === true) {
                                                        if (selectedTime === false) {
                                                            return topMessageAlartDanger(lang === 'ar' ? "يرجى تحديد الوقت!" : "please select time!")
                                                        }
                                                        SubmitData()
                                                        // setShow(false)
                                                    }
                                                }}
                                                disabled={selected == false ? true : false}
                                                className={`${selected == false ? 'border-[#219EBC] bg-[#219EBC] text-white' : 'border-[#004B7A] bg-[#004B7A] text-white'} w-1/3 focus-visible:outline-none border text-xs font-semibold px-3.5 py-3 rounded-md shadow-md hover:shadow-none`}
                                            >
                                                {lang == 'ar' ? 'الغاء الطلب' : "Proceed to Next Step"}
                                            </button>
                                        </div>
                                    }
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>

        </>
    )
}
