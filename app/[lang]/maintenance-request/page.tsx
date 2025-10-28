"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from "next/navigation"
import MaskedInput from 'react-text-mask'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ErrorTracker } from '../utils/errorTracker';
import { useApp } from '@/app/_ctx/AppContext';
import { postCheckUserTicket, postInternalTicketData, postTicketArea } from '@/lib/maintenance/maintenance-request.client';
import dynamic from 'next/dynamic';

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })
const Select = dynamic(() => import('react-select'), { ssr: false })
const CreatableSelect = dynamic(() => import('react-select/creatable'), { ssr: false })

export default function ServiceAppointment() {
    const { lang, origin, deviceType } = useApp();
    const router = useRouter();
    const path = usePathname();

    const [step, setStep] = useState<number>(0)
    const [userData, setUserData] = useState<any>([])
    const [phoneNumber, setPhoneNumber] = useState<any>('')
    const [ticketNumber, setTicketNumber] = useState<any>('')
    const [title, setTitle] = useState<any>('')
    const [deviceModelStatus, setDeviceModelStatus] = useState<any>(false)
    const [loader, setLoader] = useState<any>(false)
    const [loginBtnStatus, setLoginBtnStatus] = useState<boolean>(false)
    const [loginBtnLoading, setLoginBtnLoading] = useState<boolean>(false)
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [invoiceNumber, setInvoiceNumber] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [categories, setCategories] = useState<any>([])
    const [products, setProducts] = useState<any>([])
    const [cities, setCities] = useState<any>([])
    const [areas, setAreas] = useState<any>([])
    const [updatedares, setUpdatedAreas] = useState<any>([])
    const [selectedCategory, setSelectedCategory] = useState<any>(null)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [selectedCity, setSelectedCity] = useState<any>(null)
    const [selectedArea, setSelectedArea] = useState<any>(null)
    const [selectedNewArea, setSelectedNewArea] = useState<any>(null)
    const [newArea, setNewArea] = useState<any>(false)
    const [complain, setComplain] = useState<string>('')
    const [requestor, setRequestor] = useState<any>('')
    const [purchasing, setPurchasing] = useState<any>('')
    const [phoneErrorStatus, setPhoneErrorStatus] = useState<any>(false)
    const [firstNameErrorStatus, setFirstNameErrorStatus] = useState<any>(false)
    const [lastNameErrorStatus, setLastNameErrorStatus] = useState<any>(false)
    const [emailErrorStatus, setEmailErrorStatus] = useState<any>(false)
    const [selectedCityErrorStatus, setSelectedCityErrorStatus] = useState<any>(false)
    const [addressErrorStatus, setAddressErrorStatus] = useState<any>(false)

    const [selectedCategoryErrorStatus, setSelectedCategoryErrorStatus] = useState<any>(false)
    const [requesterErrorStatus, setRequesterErrorStatus] = useState<any>(false)
    const [purchasingErrorStatus, setPurchasingErrorStatus] = useState<any>(false)
    const [invoiceNumberErrorStatus, setInvoiceNumberErrorStatus] = useState<any>(false)
    const [complainErrorStatus, setComplainErrorStatus] = useState<any>(false)

    const [brands, setBrands] = useState<any>(false)
    const [selectedBrand, setSelectedBrand] = useState<any>(false)
    const [brandsErrorStatus, setBrandsErrorStatus] = useState<any>(false)
    const [continueProccess, setContinueProccess] = useState<any>(false)
    const [customerName, setCustomerName] = useState<any>('')

    const isMobileOrTablet =
    deviceType === "mobile" || deviceType === "tablet"
      ? true
      : false;


    useEffect(() => {
        // get('getallbrands').then((responseJson: any) => {
        //     if (responseJson?.success === true) {
        //         setBrands(responseJson?.data)
        //     }
        // })
        checkLocalstorage()
    }, [])

    useEffect(() => {
        // cleanup on unmount (when switching away from this page)
        return () => {
        Swal.close();
        };
    }, []);

    const checkLocalstorage = () => {
        setPhoneNumber(localStorage.getItem('phoneNumber'))
    }


    const changeLang = (lang: string) => {
        if (lang) {
            var url = '/' + lang + path.split(`/${lang}`)[1]
        } else {
            var url = origin + '/' + lang
        }

        router.push(url);
        router.refresh()
    };

    const deviceCategoryOptions = [
        { label: lang == 'ar' ? 'مكيفات اسبليت' : 'ACs SPLIT SVCs', value: 'ACS' },
        { label: lang == 'ar' ? 'مكيفات شباك' : 'ACs WINDOW SVCs', value: 'ACW' },
        { label: lang == 'ar' ? 'توصيل اجهزة' : 'HA DELIVERY', value: 'DLI' },
        { label: lang == 'ar' ? 'شاشات' : 'ELECTRONIC SVCs', value: 'ELE' },
        { label: lang == 'ar' ? 'شراء جديد' : 'NEWELY PURCHASED CUSTOMERS', value: 'EMR' },
        { label: lang == 'ar' ? 'تركيب اسبليت' : 'SPLIT INSTALLATION', value: 'INS' },
        { label: lang == 'ar' ? 'افران' : 'OVENs SVCs', value: 'OVN' },
        { label: lang == 'ar' ? 'ثلاجات وفريزرات' : 'REFRIGERATION SVCs', value: 'REF' },
        { label: lang == 'ar' ? 'جهاز منزلي صغير' : 'SMALL DOMESTIC APPLIANCES', value: 'SDA' },
        { label: lang == 'ar' ? 'غسالات ونشافات' : 'WASHERs SVCs', value: 'WAS' },
    ]

    const submit: any = async () => {
        if (!selectedCategory) {
            setSelectedCategoryErrorStatus(true)
            topMessageAlartDanger(lang == 'ar' ? 'خطأ! الرجاء تحديد فئة الجهاز!' : 'Error! Please select Device Category!')
            ErrorTracker.trackCustomError(
                lang == 'ar' ? 'خطأ! الرجاء تحديد فئة الجهاز!' : 'Error! Please select Device Category!',
                'frontend',
                400,
                deviceType,
                'Maintenance Request Page'
            );
        } else {
            setSelectedCategoryErrorStatus(false)
        }
        if (!requestor) {
            setRequesterErrorStatus(true)
            topMessageAlartDanger(lang == 'ar' ? 'خطأ! الرجاء اختيار فئة مقدم الطلب!' : 'Error! Please select Requester Category!')
            ErrorTracker.trackCustomError(
                lang == 'ar' ? 'خطأ! الرجاء تحديد فئة الجهاز!' : 'Error! Please select Device Category!',
                'frontend',
                400,
                deviceType,
                'Maintenance Request Page'
            );
        } else {
            setRequesterErrorStatus(false)
        }

        if (!purchasing) {
            setPurchasingErrorStatus(true)
            topMessageAlartDanger(lang == 'ar' ? 'خطأ! الرجاء اختيار مكان الشراء!' : 'Error! Please select Purchasing Channel!')
            ErrorTracker.trackCustomError(
                lang == 'ar' ? 'خطأ! الرجاء اختيار مكان الشراء!' : 'Error! Please select Purchasing Channel!',
                'frontend',
                400,
                deviceType,
                'Maintenance Request Page'
            );
        } else {
            setPurchasingErrorStatus(false)
        }

        if (!invoiceNumber) {
            setInvoiceNumberErrorStatus(true)
            topMessageAlartDanger(lang == 'ar' ? 'خطأ! الرجاء إضافة رقم الفاتورة!' : 'Error! Please add Inovice Number!')
            ErrorTracker.trackCustomError(
                lang == 'ar' ? 'خطأ! الرجاء إضافة رقم الفاتورة!' : 'Error! Please add Inovice Number!',
                'frontend',
                400,
                deviceType,
                'Maintenance Request Page'
            );
        } else {
            setInvoiceNumberErrorStatus(false)
        }

        if (!complain) {
            setComplainErrorStatus(true)
            ErrorTracker.trackCustomError(
                lang == 'ar' ? 'خطأ! الرجاء اختيار الشكوى!' : 'Error! Please select Complain!',
                'frontend',
                400,
                deviceType,
                'Maintenance Request Page'
            );
            topMessageAlartDanger(lang == 'ar' ? 'خطأ! الرجاء اختيار الشكوى!' : 'Error! Please select Complain!')
        } else {
            setComplainErrorStatus(false)
        }

        setLoader(false)
        if (!selectedCategory || !requestor || !purchasing || !invoiceNumber || !complain) {
            return false;
        }

        let phone = phoneNumber.replace('(966)-', '');
        phone = phone.replace(/[^0-9\.]+/g, '')

        var data = {
            phone_number: phone,
            title: title,
            first_name: firstName,
            last_name: lastName,
            address: address,
            city: selectedCity?.value,
            area: selectedArea?.value,
            invoice_number: invoiceNumber,
            complain: complain,
            purchasing_channel: purchasing?.value,
            requester_category: requestor?.value,
            device_category: selectedCategory?.value,
            device_model: deviceModelStatus ? null : selectedProduct?.value,
            device_model_status: deviceModelStatus
        }

        const dataRes = await postInternalTicketData(data)
        if(dataRes?.userTicketData?.success === true){
            setTicketNumber(dataRes?.userTicketData?.ticket_no ?? '')
            // topMessageAlartSuccess(lang == 'ar' ? `تم إنشاء التذكرة بنجاح! رقم التذكرة الخاص بك هو ${dataRes?.userTicketData?.ticket?.ticket_no}` : `Success! Ticket created! Your ticket number is ${dataRes?.userTicketData?.ticket?.ticket_no}`)
            topMessageAlartSuccess(lang == 'ar' ? `تم بنجاح! تم إنشاء التذكرة!` : `Success! Ticket has been created!`, "unlimited")
            setCustomerName(dataRes?.userTicketData?.customer_name ?? '')
            setStep(3)
            setSelectedBrand(false)
            setSelectedArea(null)
            setAddress('')
            setSelectedCategory(null)
            setSelectedProduct(null)
            setSelectedArea(null)
            setComplain('')
            setRequestor('')
            setPurchasing('')


        }
        else {
            topMessageAlartSuccess(lang == 'ar' ? `خطأ! حدث خطأ ما، يرجى المحاولة مرة أخرى!` : `Error! Something went wrong please try again!`)
        }
        setLoader(false)
    }
    const checkLoginPhoneNumber: any = async (value: any) => {

        let phone = value.replace('(966)-', '');
        phone = phone.replace(/[^0-9\.]+/g, '')

        if (phone.length != 9 || phone.length == 0) {
            topMessageAlartDanger(lang == 'ar' ? 'خطأ! الرجاء إضافة رقم صالح' : 'Error! Please Add Valid Number')
            ErrorTracker.trackCustomError(
                lang == 'ar' ? 'خطأ! الرجاء إضافة رقم صالح' : 'Error! Please Add Valid Number',
                'frontend',
                400,
                deviceType,
                'Maintenance Request Page'
            );
            setLoader(false)
            return false;
        }

        if (phone.length == 9) {
            var data: any = {
                phone_number: phone,
                lang: lang,
            }

            if (step != 1) {
                setPhoneErrorStatus(false)
                setFirstNameErrorStatus(false)
                setLastNameErrorStatus(false)
                // setEmailErrorStatus(false)
                setSelectedCityErrorStatus(false)
                setAddressErrorStatus(false)
                const ticketUserRes = await postCheckUserTicket(data)
                if(ticketUserRes?.checkUserTicket){

                    setCategories(ticketUserRes?.checkUserTicket?.categories)
                    setProducts(ticketUserRes?.checkUserTicket?.products)
                    setCities(ticketUserRes?.checkUserTicket?.cities)
                    setAreas(ticketUserRes?.checkUserTicket?.areas)
                    localStorage.setItem('phoneNumber', phone.toString())
                    var selectcityitem = ticketUserRes?.checkUserTicket?.cities?.filter((item: { label: string | null; }) => item.label == localStorage.getItem('globalcity'))[0]
                    if (selectcityitem) {
                        setSelectedCity(selectcityitem)
                        const updatedareslist: any = ticketUserRes?.checkUserTicket?.areas?.filter((item: any) => item?.city_id == selectcityitem.value)?.map((item: any) => ({
                            value: item.value,
                            label: item.label
                        }));
                        setUpdatedAreas(updatedareslist)
                    }
                    if (ticketUserRes?.checkUserTicket?.success === true) {
                        topMessageAlartSuccess(lang == 'ar' ? 'نجاح! لقد وجدنا الحساب!' : 'Success! We found the account!')
                        setFirstName(ticketUserRes?.checkUserTicket?.data?.first_name)
                        setLastName(ticketUserRes?.checkUserTicket?.data?.last_name)
                        setEmail(ticketUserRes?.checkUserTicket?.data?.email)
                        setLoginBtnLoading(false)
                        setLoginBtnStatus(true)
                        setUserData(ticketUserRes?.checkUserTicket?.data)
                    }
                    else {
                        setFirstName('')
                        setLastName('')
                        setEmail('')
                        setLoginBtnLoading(false)
                        setLoginBtnStatus(true)
                        setUserData([])
                    }

                    setStep(1)
                    setLoader(false)
                }
            }

            if (step === 1) {
                if (!firstName) {
                    setFirstNameErrorStatus(true)
                    ErrorTracker.trackCustomError(
                        lang == 'ar' ? 'خطأ! الرجاء إضافة الاسم الأول!' : 'Error! Please add First Name!',
                        'frontend',
                        400,
                        deviceType,
                        'Maintenance Request Page'
                    );
                    topMessageAlartDanger(lang == 'ar' ? 'خطأ! الرجاء إضافة الاسم الأول!' : 'Error! Please add First Name!')
                } else {
                    setFirstNameErrorStatus(false)
                }

                if (!lastName) {
                    setLastNameErrorStatus(true)
                    ErrorTracker.trackCustomError(
                        lang == 'ar' ? 'خطأ! الرجاء إضافة الاسم الأخير!' : 'Error! Please add Last Name!',
                        'frontend',
                        400,
                        deviceType,
                        'Maintenance Request Page'
                    );
                    topMessageAlartDanger(lang == 'ar' ? 'خطأ! الرجاء إضافة الاسم الأخير!' : 'Error! Please add Last Name!')
                } else {
                    setLastNameErrorStatus(false)
                }

                // if (!email) {
                //     setEmailErrorStatus(true)
                //     topMessageAlartDanger(lang == 'ar' ? 'خطأ! يرجى إضافة البريد الإلكتروني!' : 'Error! Please add Email!')
                // } else {
                //     setEmailErrorStatus(false)
                // }

                if (!selectedCity) {
                    setSelectedCityErrorStatus(true)
                    ErrorTracker.trackCustomError(
                        lang == 'ar' ? 'خطأ! الرجاء اختيار المدينة!' : 'Error! Please select the city!',
                        'frontend',
                        400,
                        deviceType,
                        'Maintenance Request Page'
                    );
                    topMessageAlartDanger(lang == 'ar' ? 'خطأ! الرجاء اختيار المدينة!' : 'Error! Please select the city!')
                } else {
                    setSelectedCityErrorStatus(false)
                }

                if (!address) {
                    setAddressErrorStatus(true)
                    ErrorTracker.trackCustomError(
                        lang == 'ar' ? 'خطأ! الرجاء إضافة العنوان!' : 'Error! Please add address!',
                        'frontend',
                        400,
                        deviceType,
                        'Maintenance Request Page'
                    );
                    topMessageAlartDanger(lang == 'ar' ? 'خطأ! الرجاء إضافة العنوان!' : 'Error! Please add address!')
                } else {
                    setAddressErrorStatus(false)
                }

                setLoader(false)
                // || !email
                if (!firstName || !lastName || !selectedCity || !address) {

                    return false;
                }
                setStep(2)
            }

        }
        setLoader(false)
    }

    const MySwal = withReactContent(Swal);
    const topMessageAlartSuccess = (title: any, timer:any = 5000) => {
        MySwal.fire({
            icon: "success",
            title:
                <div className="text-xs">
                    <div className="uppercase">{title}</div>
                </div>
            ,
            toast: true,
            position: lang == "ar" ? 'top-start' : 'top-end',
            showConfirmButton: false,
            timer: timer === "unlimited" ? undefined : timer,
            showCloseButton: false,
            background: '#20831E',
            color: '#FFFFFF',
            timerProgressBar: timer !== "unlimited",
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
            timer: 2500,
            showCloseButton: true,
            background: '#DC4E4E',
            color: '#FFFFFF',
            timerProgressBar: true,
        });
    };

    const PurchasingConst = [
        { label: 'Partners', value: '4' },
        { label: 'Wholesale', value: '3' },
        { label: 'Showroom Retail', value: '2' },
        { label: 'Project Sales', value: '1' },
        { label: 'E-commerce', value: '0' } 
    ];
    
    const PurchasingConstAr = [
        { label: 'شركاء', value: '4' },
        { label: 'الجملة', value: '3' },
        { label: 'تجزئة صالة العرض', value: '2' },
        { label: 'مبيعات المشاريع', value: '1' },
        { label: 'التجارة الإلكترونية', value: '0' }
    ];


    const RequestorConst = [
        { value: 1, label: 'Customer' },
        { value: 2, label: 'Sales Team' },
        { value: 3, label: 'Partners' }
    ];
    const RequestorConsAr = [
        { value: 1, label: 'عميل' },
        { value: 2, label: 'فريق المبيعات' },
        { value: 3, label: 'الشركاء' }
    ];

    const BrandsConst = [
        { value: 22, label: 'General Supreme' },
        { value: 23, label: 'Gold Tech' },
        { value: 42, label: 'Kiriyazi' },
        { value: 1, label: 'Other' },
    ];

    const BrandsConstAr = [
        { value: 22, label: 'جنرال سوبريم' },
        { value: 23, label: 'جولد تك' },
        { value: 42, label: 'كريازي' },
        { value: 1, label: 'آخر' },
    ];


    const handleChange = (e: any) => {
        const inputEmail = e;
        setEmail(inputEmail);
    };

    const validateEmail = (email: any) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <>
            <MobileHeader type="Third" lang={lang} pageTitle={lang == 'ar' ? 'طلب الصيانة' : 'Maintaince Request'} />
            {step === 3 ?
                <>
                    <section className="flex items-center justify-center h-screen shadow-md p-2 my-2 rounded-md">
                        <div className='text-center'>
                            <h2 className='text-base font-semibold text-[#00446f]'>{lang === 'ar' ? ' عزيزنا': 'Dear '} {customerName},</h2>
                           
                            <h3 className="text-lg font-bold text-secondary my-1">
                                {lang === 'ar' ? 'تذكرة رقم #' : 'Ticket No #'} {ticketNumber}
                            </h3>
                           
                            <h3 className="text-sm font-regular">
                            {lang === 'ar'
                                ? (
                                <>
                                    نود إبلاغكم بأنه سيتم إرسال رسالة لتأكيد الموعد قريبًا.<br />
                                    إذا كان لديكم أي استفسارات أو تعديلات ترغبون في مناقشتها قبل التأكيد، يُرجى التواصل معنا على الرقم ٨٠٠٢٤٤٤٤٦٤<br />
                                    <br />
                                    شكرًا لتعاونكم، ونتطلع لخدمتكم.<br />
                                    <br />
                                    مع أطيب التحيات،<br />
                                    شركة تمكين
                                </>
                                )
                                : (
                                <>
                                    We would like to inform you that a message confirming the appointment will be sent soon.<br />
                                    If you have any inquiries or modifications you wish to discuss before confirmation, please contact us at 8002444464.<br />
                                    <br />
                                    Thank you for your cooperation, and we look forward to serving you.<br />
                                    <br />
                                    Best regards,<br />
                                    Tamkeen Company
                                </>
                                )
                            }
                            </h3>

                        </div>
                        <div className='bg-white shadow-md p-2 rounded-md fixed bottom-0 w-full'>
                            <button
                                type="button"
                                onClick={() => {
                                    router.push('/');
                                    router.refresh()
                                }}
                                className={`focus-visible:outline-none bg-[#004B7A] border border-[#004B7A] hover:bg-[#00446f] hover:border-[#00446f] text-white w-full rounded-md p-2.5 text-sm my-3 font-medium flex items-center justify-center m-auto`}>
                                    {lang == 'ar' ? 'اذهب إلى الصفحة الرئيسية' : 'Go to Homepage'}
                            </button>
                        </div>
                    </section>

                    {/* <section className='container my-5 flex'>
                            
                        </section> */}
                </>
                :
                <>

                    {step === 0 ?
                        <section className='container my-5 pt-12'>
                            <div className='bg-white shadow-md p-2 my-2 rounded-md'>
                                <label className='text-xs font-semibold'>
                                    {lang === 'ar' ? 'اختر العلامة التجارية' : 'Select Brand'}
                                    <span className='text-[#DC4E4E]'>*</span>
                                    <Select
                                        styles={{
                                            control: (provided: any, state: any) => ({
                                                ...provided,
                                                background: '#fff',
                                                borderColor: '#dfdfdf',
                                                minHeight: '44px',
                                                height: '42px',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: state.isFocused ? null : null,
                                            }),
                                            valueContainer: (provided, state) => ({
                                                ...provided,
                                                height: '42px',
                                                padding: '0 0.5rem',
                                                overflow: 'visible',
                                            }),
                                            input: (provided, state) => ({
                                                ...provided,
                                                margin: '0px',
                                            }),
                                            indicatorSeparator: state => ({
                                                alignSelf: 'stretch',
                                                width: '1px',
                                                backgroundColor: 'hsl(0, 0%, 80%)',
                                                marginBottom: '12px',
                                                marginTop: '12px',
                                                boxSizing: 'border-box',
                                            }),
                                            indicatorsContainer: (provided, state) => ({
                                                ...provided,
                                                height: '42px',
                                            }),
                                        }}
                                        placeholder={lang === 'ar' ? 'اختر العلامة التجارية' : 'Select Brand'}
                                        options={lang === 'ar' ? BrandsConstAr : BrandsConst}
                                        isSearchable={true}
                                        value={selectedBrand}
                                        // className='border w-full rounded-md focus-visible:outline-none border-primary/50 border-primary hover:border-primary text-dark mt-0.5 mb-3'
                                        className={`${brandsErrorStatus == true ? 'border-[#DC4E4E]' : 'border-primary/50 border-primary hover:border-primary'} border w-full rounded-md focus-visible:outline-none hover:border-primary text-dark mt-0.5 mb-3`}
                                        classNamePrefix="react-select"
                                        onChange={(e: any) => {
                                            setSelectedBrand(e)
                                            if (e?.value == 22 || e?.value == 23 || e?.value == 42) {
                                                setContinueProccess(true)
                                            } else {
                                                setContinueProccess(false)
                                            }
                                            setBrandsErrorStatus(false)
                                        }}
                                    />
                                </label>
                            </div>
                        </section>
                        :
                        null
                    }
                    <section className={`container ${step != 0 ? 'mt-20' : ''} mb-16`}>
                        {continueProccess && selectedBrand ?
                            <>
                                <div className='flex items-center gap-x-2 justify-between'>
                                    <h1 className='text-base font-semibold'>
                                        {lang === 'ar' ? 'تفاصيل العميل' : 'Customer Details'}
                                    </h1>
                                    {step !== 0 ?
                                        <>
                                            <h2 className='text-xs font-semibold underline text-[#004B7A]'
                                                onClick={() => {
                                                    setStep(0)
                                                }}
                                            >
                                                {lang === 'ar' ? 'تفاصيل العميل' : 'Edit'}
                                            </h2>
                                        </>
                                        : null}
                                </div>

                                <div className='bg-white shadow-md p-2 my-2 rounded-md'>

                                    {step === 0 ?
                                        <>
                                            <label className='text-xs font-semibold'>
                                                {lang === 'ar' ? 'رقم التليفون' : 'Phone Number'}
                                                <span className='text-[#DC4E4E]'>*</span>
                                                {/* border-[#5D686F30] */}
                                                <div className={`${phoneErrorStatus == true ? 'border-[#DC4E4E]' : 'border-primary/50 border-primary hover:border-primary'} pb-3 pt-2.5 px-3 bg-white rounded-md border flex items-center  gap-x-2 text-sm font-medium focus-visible:outline-none focus-visible:border-[#20831E]`}>
                                                    <svg id="fi_14063267" enableBackground="new 0 0 64 64" height="32" viewBox="0 0 64 64" width="32" xmlns="http://www.w3.org/2000/svg"><g><g><path d="m63 47.2c0 3.4-2.7 6.1-6 6.1h-50c-3.3 0-6-2.7-6-6.1v-30.4c0-3.4 2.7-6.1 6-6.1h50c3.3 0 6 2.7 6 6.1z" fill="#096"></path><path d="m7 10.7h50c3.3 0 6 2.7 6 6.1v30.4c0 3.4-2.7 6.1-6 6.1" fill="#038e5c"></path><g fill="#007a54"><path d="m63 47.2c0 3.4-2.7 6.1-6 6.1h-50c-3.3 0-6-2.7-6-6.1"></path><path d="m7 10.7h50c3.3 0 6 2.7 6 6.1v11.1"></path></g></g><g><g fill="#fff"><path d="m8.6 20.4c.4-.3.4.5 0 1.4.2-.3.6-1 .5-1.5-.1-.7-.5-.6-.8-.2-.2.3-.1.5.3.3z"></path><path d="m8.7 26.1c.5-.9.3-1.6.7-2.9.3-.8.3-.2.3.3-.2 1.3-.1 3.4 1.7 3.3.1 1.2.4 3.3.4 4.1 0 .7.1.5.3.1s.1-.9.1-1.5-.1-1.7-.2-3.2c.2-.2.5-.5.6-.7.2-.5.3-.4.4 0 .2.8 1 1.3 2 .5 1-.7.6-2.1.1-3.6.4.1.5-.2.3-.6-.1-.2-.3-.4-.4-.6-.2-.2-.3-.4-.5-.2s-.3.4-.4.5-.1.3 0 .6c.4.9.6 1.9.7 2.4s-.1.6-.5.6c-.3 0-.8-.1-1-.9s-.3-1.1-.2-1.7c0-.5.1-.9-.3-1.4s-.4-.4-.5-.2c-.1.3-.2.7-.1 1.2.2.7.3 1.3.4 1.7.1.3-.2.9-.7 1.2-.1-1-.2-2.2-.3-3.3.6-.2.3-.9-.2-1.7-.3-.6-.5-.4-.7 0s-.1.6.1.9c-.1.3.1.7.2 1.4.1.5.2 1.8.2 2.9-.4 0-.7-.3-.9-.7-.3-.8-.3-1.6-.1-2 .2-.5.3-1.2 0-1.4s-.6 0-.8.4c-.4.6-.8 1.4-.8 2.3 0 .3-.1 1-.3 1.3-.1.3-.4.3-.6-.1-.4-.6-.5-2.2-.5-3 0-.4-.1-.5-.2 0-.4 1.6.1 3.2.4 3.9.5.9 1 .7 1.3.1z"></path><path d="m13.5 20.9c.2-.2.2-.2.3 0s.4.2.5 0 .2-.3.1-.6c-.1-.2-.1-.1-.2.1-.1.4-.5.3-.5-.2s-.1-.2-.3.1c-.2.5-.5.4-.5-.1 0-.3-.1-.6-.3-.2-.1.3 0 .6.1.8.3.3.6.3.8.1z"></path><path d="m10.5 28.4c.3-.1.3-.1.3-.5s-.2-.2-.6-.1c-.6.2-1.8.8-2.7 1.9-.4.5-.1.3.2.1.5-.4 2-1.2 2.8-1.4z"></path><path d="m8.5 34.8c-.3.5-.9-.2-.5-1.5.1-.3.2-.5.2-.7s0-.4 0-.7c0-.2-.2.1-.3.5-.1.6-.5.9-.4 2.8.1 1.1 1.4 1.1 1.5-.3 0-.6-.2-.6-.5-.1z"></path><path d="m17.4 30.6c0-.5-.1-1-.1-1.5.1 0 .1-.1.2-.1.3.9 1.6.7 2 .1.2-.3.2-.3.4 0 .3.4 1.3.6 1.5 0s.2-1.2.1-1.6c-.1-.5-.2-.4-.5-.2s-.1.3 0 .6c.1 1.2-.9 1.1-1-.1-.1-.8-.2-.5-.3-.1-.5 1.5-1.8 1.8-1.6 0 0-.5-.3-.3-.5-.1-.1.1-.3.3-.4.4-.1-1.4-.2-3-.4-5 .4.5.8-.1.5-.6-.2-.4-.5-1.4-.7-1.9s-.3-.4-.7.1c-.4.4-.3.5-.2 1 0 .6 0 1.1.2 2.2.1.8.3 2.5.5 4.6-.2.1-.5.3-.7.4-.1-.4-.4-.6-.8-1-.6-.6-1-.6-1.5.1s-.4.8-.4 1.5c0 .6-.1.8.4 1s.7.1 1 0c.2-.1.5-.2.9-.3.1.3 0 .7-.2.9-1.2 1.4-3 2.5-3.8 1.5-.4-.5-.6-1.3-.5-2.3.1-.8-.1-.4-.2-.2-.3.9-.4 2.3 0 3 .5 1 1.4 1.4 2.8.7 1.4-.6 2.7-1.7 2.7-3.2 0-.3 0-.5 0-.7.2-.1.4-.2.5-.3v1.7c.1 1.6-.6 2.1-1.2 2.6-.8.6-1.9 1.1-2.9 1.2-2.2.3-2.7-1.1-2.7-3 0-.3.1-.5.1-.9 0-.8-.1-.7-.4.1-.2.8-.5 2.6.2 4.1.8 1.5 3.4 1.1 5.4.1 2.2-1.1 2.4-2.9 2.3-4.8zm-2.8-1.5c-.5.2-.7-.1-.6-.4 0-.3.1-.5.5-.3.2.1.4.3.6.6-.3.1-.4.1-.5.1z"></path><path d="m19.7 32.3c.2-.4.3-.8.2-1.3-.1-.3 0-.4-.3-.6-.3-.1-.4.1-.5.3-.1.3.1.7.5.5.1.2 0 .7-.1 1-.1.4 0 .5.2.1z"></path><path d="m20.5 24.2c-.4.5-.7 1.2-.1 1.6.3.2.9-.1 1.1-.5.2-.5.1-.6-.3-.1-.5.6-1.1.1-.5-.8.4-.6.1-.7-.2-.2z"></path><path d="m18.8 24.3c1.4-.6 2.2-1.4 2.6-2.1.4.1.5-.2.3-.5.1-.3.2-.5.3-.7.3-1.3-1-1.4-1.3-.4-.2.5-.2 1 .2 1.3-.6.8-1.4 1.5-2.4 2.1-.4.4-.3.6.3.3zm2.4-3.5c.1-.3.3-.1.3.1 0 .1-.1.3-.2.4-.2-.1-.2-.3-.1-.5z"></path></g><path d="m20.7 20.6c-.2.5-.2 1 .2 1.3-.1.1-.2.3-.3.4l.5.4c.1-.2.3-.3.4-.5.4.1.5-.2.3-.5.1-.3.2-.5.3-.7.2-1.3-1-1.4-1.4-.4zm.8.3c0 .1-.1.3-.2.4-.2-.1-.2-.3-.1-.5.1-.3.3-.1.3.1z" fill="#cfe7e8"></path><path d="m22.2 32.3c-.2.1-.5.4-.7.6 0-.4.1-1 .1-1.2 0-.3-.1-.4-.3-.1-.3.6-.6 1.4-.7 2-1.3.9-2.9 1.8-4 2.3-.5.2-.2.4.2.3 1.5-.5 2.7-.9 3.8-1.4.1.9.4 1.5 1.2 1.7 1.5.4 3-.9 4.7-3.2.4 1.1 1.4 2.6 4 3 1.1.2 1 .1 1.2-.5.1-.5.3-.6-.6-.8-1.1-.4-1.5-1.2-.4-1.7s2.6-.9 3.6-1.1c.7-.1.9-.1 1.1-.7.2-.7.3-.8-.4-.7-.8.1-4.6.2-5.6.1.8-.4 1.9-.8 2.7-1.1.3.2.4.1.3-.1.3-.1.6-.2.9-.4.9-.5 1.3-1.6.3-2.3s-1.8-.9-2.3-.2c-.4.6-.8 1.2-.2 2-.9.3-1.7.6-2.5.9-.6.2-.9.3-1.1 1.1s-.3.8.5.9c1.1 0 2.1 0 2.8.6-1.1.4-1.9 1.2-1.5 2.3-.5-.1-1-.3-1.4-.7-.8-.8-.8-2.2-1.1-3.8s-1-3-1.3-3.6c-.2-.6-.3-.3-.5.1s-.4.6-.2 1.2c.4 1 1 3 1.3 4.2-.6 1.4-2.2 3.1-3.5 3.3-1 .2-1.3-.4-1.2-.9.7-.4 1.3-.9 1.9-1.5 1.2-1.3 1.4-2.3.6-4.4.5.1.4-.3-.3-1.2-.5-.6-.6-.5-.9.1-.2.5-.4.9.2 1.1.1.3.3.7.6 1.2.6 1.3-.4 1.8-1.3 2.6zm9.5-4.4c0-.3.1-.3.6 0s.9.4.2.5c-.2.1-.5.1-.7.2 0-.3 0-.5-.1-.7z" fill="#fff"></path><g fill="#cfe7e8"><path d="m34.9 30.8c-.5 0-2.7.1-4.2.1l2 1.7c.5-.2 1.1-.3 1.5-.4.7-.1.9-.1 1.1-.7.2-.7.3-.8-.4-.7z"></path><path d="m25.1 26.1.2.2c0-.2-.1-.2-.2-.2z"></path><path d="m30.2 30.4c.6-.3 1.3-.5 1.8-.7.3.2.4.1.3-.1.3-.1.6-.2.9-.4.9-.5 1.3-1.6.3-2.3s-1.8-.9-2.3-.2c-.4.6-.8 1.2-.2 2-.7.2-1.3.4-1.9.7zm2.2-2.5c.5.3.9.4.2.5-.2.1-.5.1-.7.2-.1-.3-.1-.5-.1-.6-.1-.4.1-.4.6-.1z"></path></g><path d="m34 36c.3-.1.8-.4 1.2-.7.4-.4.1-.3-.2-.2s-.6.3-1 .4c-.4.2-.5 0-.3-.7.2-.6 0-.6-.3-.5s-.4.3-.7.5c-.2.1-.2.3.3.1.4-.2.3 0 .2.5-.2.5.1.8.8.6z" fill="#fff"></path><g fill="#cfe7e8"><path d="m24.7 25.1c.3-.7.5-1.4.7-1.9s.4-.4.3.1c-.1.9-.1 2.3.8 2.9.9.5 2.3-.4 2.8-1.4 1.5 1.9 2.8 1 2.9-.8 0-.6-.2-1.8-.4-2.2s0-.4.2-.2.6.4.4-.3c-.2-.6-.5-1-.8-1.3s-.4-.1-.5.1-.1.3-.3.5-.1.3 0 .6c.6 1.4 1.1 3.5.2 3.7-.8.2-1.3-1.6-1.3-2.4 0-1-.2-1.9-.4-2.5s-.3-.6-.5-.3c-.1.2-.1.4-.3.6-.1.2 0 .3.1.7.5 2.3.4 3.3-.6 3.9s-1.6 0-1.6-.7 0-1.6.1-2.2.2-.8 0-1.1-.4-.2-.7.2c-.6.9-1.3 2.4-1.5 3.1s-.7.5-1-.1c-.4-.7-.3-2-.2-2.6.1-.5.1-.7-.2-.2-.5 1.4-.5 2.8.6 4 .5.9.9.5 1.2-.2z"></path><path d="m27.5 22.4c0 .3 0 .7.2.1.1-.6.1-1.4-.1-1.9s-.3-.6-.5-.4-.2.3 0 .5c.2.3.5 1 .4 1.7z"></path><path d="m29.6 27.1c0 .8-.2.8-.5 0-.1-.3-.2-.3-.3.1 0 .7-.3.8-.5.1-.1-.3-.1-.6-.2-.1-.1.4 0 .7.2 1 .2.2.5.2.6-.1s.2-.3.4-.1 1 0 .6-1.1c-.2-.4-.3-.3-.3.2z"></path><path d="m37.7 20.8c.3.2.6.7.5 1.3-.1.5 0 .8.3.1s.1-1.5-.2-2-.4-.3-.6-.1c-.2.3-.3.6 0 .7z"></path><path d="m32.6 21.1c0 .3.1.5.5.6.8 1.1 1.7 2.3 2.5 3.4.1 1 .3 2 .4 2.9.2 2 .6 4.7.3 5.9-.2.9 0 1.2.4-.1s.4-2.6.1-4.5c-.1-.8-.1-1.7-.2-2.7 1.3 2.1 2.6 4.1 3.1 5.5.3.8.6.9.3-.1-.3-1.4-1.6-3.8-3.6-6.8-.1-.8-.1-1.6-.1-2.2.3.3.5.1.4-.3-.2-.8-.5-1.4-.8-2.2-.1-.4-.5-.4-.7.1-.2.6-.2.7 0 1.1 0 .5.1 1.2.2 1.9-.3-.5-.8-1.2-1.2-1.7.5.2.9.1.4-.5-.5-.5-1.2-1.1-1.6-1.5s-.6-.1-.6.2c.2.5.3.7.2 1z"></path><path d="m38.3 23.9c-.1.5-.3.3-.4-.1-.1-.2-.2-.1-.2.3.1.4.2.7.5.4.2-.2.2-.2.5 0 .2.2.4 0 .5-.1 0-.1.1-.3 0-.8s-.2-.2-.3.2-.3.5-.4 0c0-.4-.2-.3-.2.1z"></path><path d="m40.6 30.4c.1 1.8.3 2.6-.8 3.9-1.2 1.3-2 1.7-2.5 1.8-.7.2-.9.5.1.4 1.5-.1 1.7-.1 3-1.6.7-.8 1-1.8 1-4.2-.1-4.2-.6-6-.6-8.3.2.2.5.2.4-.2-.2-.5-.3-1.1-.4-1.6-.2-.5-.3-.7-.5-.4s-.4.4-.5.6-.2.5 0 .8c.6 4.9.7 7 .8 8.8z"></path><path d="m43.2 30.9c.1 1 .3 1.7 0 2.9-.1.3.1.5.3 0 .9-1.7.3-3.2.2-4.2-.1-1.5-.7-5.4-.8-7l.1.1c.4.2.9.4.6-.2-.3-.5-.6-1.4-.8-2s-.3-.6-.6-.1c-.6.8-.2 1.6 0 2.6.4 3.4.9 6.9 1 7.9z"></path><path d="m45.3 25.3c.3.3.5.9.7 1.2.2.5.4.1.4-.2s-.1-1.2 0-1.5c.2-.5.5.2.6-.1.1-.2-.1-.3-.2-.5-.1-.3-.2-.2-.4-.1-.2.2-.3.4-.3.5v1.1c0 .4-.1.4-.2.2-.1-.3-.4-1-.6-1.2s-.5-.1-.5.2v.5c0 .2.4.2.5-.1z"></path><path d="m45.1 29.2c0 .3.4-.1.7-.3s1.2-.8 1.6-1 .3-.3.2-.7c0-.4-.3-.1-.6.2s-1.2.9-1.5 1.2-.4.4-.4.6z"></path><path d="m43 34.6c-.4-.8-.4-1.6-.4-2.3 0-.6-.1-1.1-.3-.1-.6 2.4-.2 2.9.4 3.4.8.7 1.1.8 1.5.1.8-1.2 1.1-2.2 1.5-2.8.4-.5.4-.1.6.1.5.6.9.8 1.6.9s1.9-.5 1.8-2.7c-.1-1.4-.2-3.2-.3-5.2.7.9 1.2 1.7 1.7 2.4.2 1.3.3 2.5.3 3.4-.1 1.1.2 1.1.4 0 .1-.4.1-1.4 0-2.5.9 1.2 1.4 1.9 1.7 2.5.4.7.6 1.2.5-.1 0-.5-.2-.9-.8-1.8-.6-.8-1.1-1.6-1.6-2.4-.2-1.9-.4-4-.4-5.1.3.2.5 0 .3-.4-.1-.4-.4-1.6-.6-2s-.4-.4-.6.1c-.2.4-.4.6-.3.9.1 1.9.3 3.7.6 5.3-.5-.7-1-1.4-1.4-2 0-.7-.1-1.4-.1-2.1.3.2.4.2.3-.3-.1-.4-.5-1.4-.7-1.8s-.3-.4-.5-.1c-.3.5-.4.9-.1 1.4 0 .5.1.9.1 1.4-.3-.4-.5-.8-.8-1.1.3.1.5-.1.2-.4s-.9-.8-1.2-1.1c-.3-.4-.5-.3-.5 0v.9c0 .3 0 .5.3 1 .7.9 1.5 1.8 2.1 2.7.3 3.2.4 5.3.4 6.6 0 .8-.3 1.2-.7 1.3s-.8-.1-1.2-.7c-.7-1-1-.8-1.5.1s-.9 1.6-1.2 2.2c-.2.6-.7 1.1-1.1.3z"></path><path d="m52.6 23.5c0 .6.2.5.3 0s.1-1.5-.2-2.1c-.3-.7-.4-.4-.5-.2-.2.3-.2.4.1.7.1.3.3 1 .3 1.6z"></path><path d="m55.3 29.7c-.2-4.2-.7-6-.6-7.6.4.3.5.2.3-.3s-.5-1.1-.7-1.7c-.2-.5-.3-.4-.6 0s-.3.7-.2.9c.6 5.1.9 7.8 1 9.4.1 2.2-.4 3.5-2.6 5-.7.5-1.5 1 .2.6 1.6-.5 3.4-1.6 3.2-6.3z"></path><path d="m49.7 34.1c-.3.4.4.6.5.3.2.3 0 .8-.3 1.1-.5.4-.2.5.1.2.3-.2 1.1-1.1.6-1.7-.3-.2-.7-.2-.9.1z"></path></g><path d="m47.5 41.5c-1.3 0-2.5 0-3.8.1v-.4c.4-.5.3-.5 0-1-.1-.2-.2-.4-.5 0s-.3.5.1 1v.4c-9.9.1-20.8 0-30.2-.1 1 1.7 4.4 1.6 7.5 1.6 2.8 0 11.2 0 22.6-.3v.5c-.4.5-.3.5 0 1 .3.4.4.2.5 0 .1-.1.1-.2.1-.2h1.5c0 .2.3.3.4.3s.4-.1.4-.3h1.7c.2.3.4.4.7.4.6 0 .9-.7.8-1.6-.1-1.3-.6-1.5-1.8-1.4zm-1.4 2c0-.2-.3-.3-.4-.3s-.4.1-.4.3h-1.5c0-.1-.1-.2-.3-.4v-.5c1.3 0 2.7-.1 4.1-.1-.1.3-.1.6-.1.9z" fill="#fff"></path><path d="m47.5 41.5c-1.3 0-2.5 0-3.8.1v-.4c.4-.5.3-.5 0-1-.1-.2-.2-.4-.5 0s-.3.5.1 1v.4s0 0-.1 0l1.4 1.2c1 0 2.1-.1 3.1-.1-.1.3-.1.6-.1.9h-1.5c0-.2-.3-.3-.4-.3s-.3.1-.3.2l.7.6v-.1h1.7c.2.3.4.4.7.4.6 0 .9-.7.8-1.6-.1-1.2-.6-1.4-1.8-1.3z" fill="#cfe7e8"></path></g></g></svg>
                                                    <div className="h-5 w-[1px] bg-primary opacity-20" />
                                                    <MaskedInput
                                                        id="phoneMask"
                                                        type="tel"
                                                        placeholder="(966) - __ - ___ - ____"
                                                        className="w-full focus-visible:outline-none"
                                                        mask={['(', '9', '6', '6', ')', '-', /[5]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                                                        onChange={(e: any) => {
                                                            setPhoneNumber(e.target.value)
                                                        }}
                                                        value={phoneNumber}
                                                        autoFocus={true}
                                                    />
                                                </div>

                                            </label>
                                        </>
                                        :
                                        null
                                    }

                                    {loginBtnStatus ?
                                        <>
                                            {step === 1 ?
                                                <>
                                                    <label className='text-xs font-semibold'>
                                                        {lang === 'ar' ? 'الاسم الأول' : 'First Name'}
                                                        <span className='text-[#DC4E4E]'>*</span>
                                                        <input
                                                            onChange={(e) => {
                                                                setFirstName(e.target.value)
                                                            }}
                                                            value={firstName}
                                                            type='text'
                                                            placeholder={lang === 'ar' ? 'الاسم الأول' : 'First Name'}
                                                            className={`${firstNameErrorStatus == true ? 'border-[#DC4E4E]' : 'border-primary/50 border-primary hover:border-primary'} border w-full rounded-md h-12 p-2.5 focus-visible:outline-none hover:border-primary text-dark mt-0.5 mb-3`}
                                                        />
                                                    </label>

                                                    <label className='text-xs font-semibold'>
                                                        {lang === 'ar' ? 'اسم العائلة' : 'Last Name'}
                                                        <span className='text-[#DC4E4E]'>*</span>
                                                        <input
                                                            onChange={(e) => {
                                                                setLastName(e.target.value)
                                                            }}
                                                            value={lastName}
                                                            type='text'
                                                            placeholder={lang === 'ar' ? 'اسم العائلة' : 'Last Name'}
                                                            className={`${lastNameErrorStatus == true ? 'border-[#DC4E4E]' : 'border-primary/50 border-primary hover:border-primary'} border w-full rounded-md h-12 p-2.5 focus-visible:outline-none hover:border-primary text-dark mt-0.5 mb-3`}
                                                        />
                                                    </label>

                                                    <label className='text-xs font-semibold'>
                                                        {lang === 'ar' ? 'بريد إلكتروني' : 'Email'}
                                                        <input
                                                            onChange={(e) => {
                                                                setEmail(e.target.value)
                                                                handleChange(e.target.value)
                                                            }}
                                                            value={email}
                                                            type='email'
                                                            placeholder={lang === 'ar' ? 'بريد إلكتروني' : 'Email'}
                                                            className={`${emailErrorStatus == true ? 'border-[#DC4E4E]' : 'border-primary/50 border-primary hover:border-primary'} border w-full rounded-md h-12 p-2.5 focus-visible:outline-none hover:border-primary text-dark mt-0.5 mb-3`}
                                                        />
                                                    </label>


                                                    <label className='text-xs font-semibold'>
                                                        {lang === 'ar' ? 'مدينة' : 'City'}
                                                        <span className='text-[#DC4E4E]'>*</span>
                                                        <Select
                                                            styles={{
                                                                control: (provided: any, state: any) => ({
                                                                    ...provided,
                                                                    background: '#fff',
                                                                    borderColor: '#dfdfdf',
                                                                    // minHeight: '44px',
                                                                    // height: '42px',
                                                                    borderRadius: '6px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    boxShadow: state.isFocused ? null : null,
                                                                }),
                                                                valueContainer: (provided, state) => ({
                                                                    ...provided,
                                                                    height: '42px',
                                                                    padding: '0 0.5rem',
                                                                    overflow: 'visible',
                                                                }),
                                                                input: (provided, state) => ({
                                                                    ...provided,
                                                                    margin: '0px',
                                                                }),
                                                                indicatorSeparator: state => ({
                                                                    alignSelf: 'stretch',
                                                                    width: '1px',
                                                                    backgroundColor: 'hsl(0, 0%, 80%)',
                                                                    marginBottom: '12px',
                                                                    marginTop: '12px',
                                                                    boxSizing: 'border-box',
                                                                }),
                                                                indicatorsContainer: (provided, state) => ({
                                                                    ...provided,
                                                                    height: '42px',
                                                                }),
                                                            }}
                                                            placeholder={lang === 'ar' ? 'اختر المدينة' : 'Select City'}
                                                            options={cities}
                                                            isSearchable={true}
                                                            value={selectedCity}
                                                            className={`${selectedCityErrorStatus == true ? 'border-[#DC4E4E]' : 'border-primary/50 border-primary hover:border-primary'} border w-full rounded-md focus-visible:outline-none hover:border-primary text-dark mt-0.5 mb-3`}
                                                            classNamePrefix="react-select"
                                                            onChange={(e: any) => {
                                                                setSelectedCity(e)
                                                                const updatedareslist: any = areas?.filter((item: any) => item?.city_id == e.value)?.map((item: any) => ({
                                                                    value: item.value,
                                                                    label: item.label
                                                                }));
                                                                setUpdatedAreas(updatedareslist)
                                                                setSelectedArea(null)
                                                            }}
                                                        />
                                                    </label>

                                                    <label className='text-xs font-semibold'>
                                                        {lang === 'ar' ? 'منطقة' : 'Area'}
                                                        <Select
                                                            styles={{
                                                                control: (provided: any, state: any) => ({
                                                                    ...provided,
                                                                    background: '#fff',
                                                                    borderColor: '#dfdfdf',
                                                                    // minHeight: '44px',
                                                                    // height: '42px',
                                                                    borderRadius: '6px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    boxShadow: state.isFocused ? null : null,
                                                                }),
                                                                valueContainer: (provided, state) => ({
                                                                    ...provided,
                                                                    height: '42px',
                                                                    padding: '0 0.5rem',
                                                                    overflow: 'visible',
                                                                }),
                                                                input: (provided, state) => ({
                                                                    ...provided,
                                                                    margin: '0px',
                                                                }),
                                                                indicatorSeparator: state => ({
                                                                    alignSelf: 'stretch',
                                                                    width: '1px',
                                                                    backgroundColor: 'hsl(0, 0%, 80%)',
                                                                    marginBottom: '12px',
                                                                    marginTop: '12px',
                                                                    boxSizing: 'border-box',
                                                                }),
                                                                indicatorsContainer: (provided, state) => ({
                                                                    ...provided,
                                                                    height: '42px',
                                                                }),
                                                            }}
                                                            placeholder={lang === 'ar' ? 'حدد المنطقة' : 'Select Area'}
                                                            options={updatedares}
                                                            value={selectedArea}
                                                            isSearchable={true}
                                                            className='border w-full rounded-md focus-visible:outline-none border-primary/50 border-primary hover:border-primary text-dark mt-0.5 mb-3'
                                                            classNamePrefix="react-select"
                                                            onChange={(e: any) => {
                                                                setSelectedArea(e)
                                                            }}
                                                        />
                                                    </label>

                                                    <label className='text-xs font-semibold'>
                                                        {lang === 'ar' ? 'عنوان' : 'Address'}
                                                        <span className='text-[#DC4E4E]'>*</span>
                                                        <textarea id="iconLeft" rows={6} value={address} placeholder={lang === 'ar' ? 'عنوان' : 'Address'}
                                                            className={`${addressErrorStatus == true ? 'border-[#DC4E4E]' : 'border-primary/50 border-primary hover:border-primary'} border w-full rounded-md p-2.5 focus-visible:outline-none text-dark mt-0.5 mb-3`}
                                                            onChange={(e: any) => {
                                                                setAddress(e.target.value)
                                                            }} />
                                                    </label>

                                                </>
                                                : step === 2 ?
                                                    <>

                                                        <label className='text-xs font-semibold'>
                                                            {lang === 'ar' ? 'فئة الجهاز' : 'Device Category'}
                                                            <span className='text-[#DC4E4E]'>*</span>
                                                            <Select
                                                                styles={{
                                                                    control: (provided: any, state: any) => ({
                                                                        ...provided,
                                                                        background: '#fff',
                                                                        borderColor: '#dfdfdf',
                                                                        minHeight: '44px',
                                                                        height: '42px',
                                                                        borderRadius: '6px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        boxShadow: state.isFocused ? null : null,
                                                                    }),
                                                                    valueContainer: (provided, state) => ({
                                                                        ...provided,
                                                                        height: '42px',
                                                                        padding: '0 0.5rem',
                                                                        overflow: 'visible',
                                                                    }),
                                                                    input: (provided, state) => ({
                                                                        ...provided,
                                                                        margin: '0px',
                                                                    }),
                                                                    indicatorSeparator: state => ({
                                                                        alignSelf: 'stretch',
                                                                        width: '1px',
                                                                        backgroundColor: 'hsl(0, 0%, 80%)',
                                                                        marginBottom: '12px',
                                                                        marginTop: '12px',
                                                                        boxSizing: 'border-box',
                                                                    }),
                                                                    indicatorsContainer: (provided, state) => ({
                                                                        ...provided,
                                                                        height: '42px',
                                                                    }),
                                                                }}
                                                                placeholder={lang === 'ar' ? 'حدد فئة الجهاز' : 'Select Device Category'}
                                                                options={deviceCategoryOptions}
                                                                isSearchable={true}
                                                                // className='border w-full rounded-md focus-visible:outline-none border-primary/50 border-primary hover:border-primary text-dark mt-0.5 mb-3'
                                                                className={`${selectedCategoryErrorStatus == true ? 'border-[#DC4E4E]' : 'border-primary/50 border-primary hover:border-primary'} border w-full rounded-md focus-visible:outline-none hover:border-primary text-dark mt-0.5 mb-3`}
                                                                classNamePrefix="react-select"
                                                                onChange={(e: any) => {
                                                                    setSelectedCategory(e)
                                                                }}
                                                            />
                                                        </label>

                                                        <label className='text-xs font-semibold'>
                                                            {lang === 'ar' ? 'طراز الجهاز' : 'Device Model'}
                                                            <Select
                                                                styles={{
                                                                    control: (provided: any, state: any) => ({
                                                                        ...provided,
                                                                        background: '#fff',
                                                                        borderColor: '#dfdfdf',
                                                                        // minHeight: '44px',
                                                                        // height: '42px',
                                                                        borderRadius: '6px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        boxShadow: state.isFocused ? null : null,
                                                                    }),
                                                                    valueContainer: (provided, state) => ({
                                                                        ...provided,
                                                                        height: '42px',
                                                                        padding: '0 0.5rem',
                                                                        overflow: 'visible',
                                                                    }),
                                                                    input: (provided, state) => ({
                                                                        ...provided,
                                                                        margin: '0px',
                                                                    }),
                                                                    indicatorSeparator: state => ({
                                                                        alignSelf: 'stretch',
                                                                        width: '1px',
                                                                        backgroundColor: 'hsl(0, 0%, 80%)',
                                                                        marginBottom: '12px',
                                                                        marginTop: '12px',
                                                                        boxSizing: 'border-box',
                                                                    }),
                                                                    indicatorsContainer: (provided, state) => ({
                                                                        ...provided,
                                                                        height: '42px',
                                                                    }),
                                                                }}
                                                                placeholder={lang === 'ar' ? 'حدد طراز الجهاز' : 'Select Device Model'}
                                                                options={products}
                                                                isSearchable={true}
                                                                // className="text-primary font-regular text-sm focus-visible:outline-none w-full"
                                                                className={`${deviceModelStatus ? 'border-primary/20' : 'border-primary/50 border-primary hover:border-primary'} border w-full rounded-md focus-visible:outline-none text-dark mt-0.5 mb-3`}
                                                                classNamePrefix="react-select"
                                                                isDisabled={deviceModelStatus}
                                                                onChange={(e: any) => {
                                                                    setSelectedProduct(e)
                                                                }}
                                                            />

                                                        </label>

                                                        <label htmlFor="dontHave" className="focus-visible:outline-[#004B7A] fill-primary text-xs font-semibold w-full items-center flex gap-x-2 mb-2">
                                                            <input type="checkbox" className="h-5 w-5 hidden" id="dontHave" checked={deviceModelStatus} name="dontHave"
                                                                onChange={(e: any) => {
                                                                    setDeviceModelStatus(e.target.checked)
                                                                }} />
                                                            {deviceModelStatus == true ?
                                                                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                                                                    <circle cx={12} cy={12} r={12} fill="#219EBC" />
                                                                    <path
                                                                        d="M7 13l3 3 7-7"
                                                                        stroke="#fff"
                                                                        strokeWidth={1.5}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                :
                                                                <svg viewBox="0 0 24 24" fill="#5D686F60" className="h-5 w-5">
                                                                    <circle cx={12} cy={12} r={12} fill="#5D686F60" opacity={0.2} />
                                                                </svg>
                                                            }
                                                            {lang === 'ar' ? 'لا أعرف طراز الجهاز' : `I don't know about the model`}
                                                        </label>



                                                        <label className='text-xs font-semibold'>
                                                            {lang === 'ar' ? 'فئة مقدم الطلب' : 'Requestor Category'}
                                                            <span className='text-[#DC4E4E]'>*</span>
                                                            <Select
                                                                styles={{
                                                                    control: (provided: any, state: any) => ({
                                                                        ...provided,
                                                                        background: '#fff',
                                                                        borderColor: '#dfdfdf',
                                                                        // minHeight: '44px',
                                                                        // height: '42px',
                                                                        borderRadius: '6px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        boxShadow: state.isFocused ? null : null,
                                                                    }),
                                                                    valueContainer: (provided, state) => ({
                                                                        ...provided,
                                                                        height: '42px',
                                                                        padding: '0 0.5rem',
                                                                        overflow: 'visible',
                                                                    }),
                                                                    input: (provided, state) => ({
                                                                        ...provided,
                                                                        margin: '0px',
                                                                    }),
                                                                    indicatorSeparator: state => ({
                                                                        alignSelf: 'stretch',
                                                                        width: '1px',
                                                                        backgroundColor: 'hsl(0, 0%, 80%)',
                                                                        marginBottom: '12px',
                                                                        marginTop: '12px',
                                                                        boxSizing: 'border-box',
                                                                    }),
                                                                    indicatorsContainer: (provided, state) => ({
                                                                        ...provided,
                                                                        height: '42px',
                                                                    }),
                                                                }}
                                                                placeholder={lang === 'ar' ? 'حدد فئة مقدم الطلب' : 'Select Requestor Category'}
                                                                options={lang === 'ar' ? RequestorConsAr : RequestorConst}
                                                                isSearchable={true}
                                                                value={requestor}
                                                                // className="text-primary font-regular text-sm focus-visible:outline-none w-full"
                                                                // className='border w-full rounded-md focus-visible:outline-none border-primary/50 border-primary hover:border-primary text-dark mt-0.5 mb-3'
                                                                className={`${requesterErrorStatus == true ? 'border-[#DC4E4E]' : 'border-primary/50 border-primary hover:border-primary'} border w-full rounded-md focus-visible:outline-none hover:border-primary text-dark mt-0.5 mb-3`}
                                                                classNamePrefix="react-select"
                                                                onChange={(e: any) => {
                                                                    setRequestor(e)
                                                                }}
                                                            />
                                                        </label>


                                                        <label className='text-xs font-semibold'>
                                                            {lang === 'ar' ? 'مكان الشراء' : 'Purchasing Channel'}
                                                            <span className='text-[#DC4E4E]'>*</span>
                                                            <Select
                                                                styles={{
                                                                    control: (provided: any, state: any) => ({
                                                                        ...provided,
                                                                        background: '#fff',
                                                                        borderColor: '#dfdfdf',
                                                                        // minHeight: '44px',
                                                                        // height: '42px',
                                                                        borderRadius: '6px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        boxShadow: state.isFocused ? null : null,
                                                                    }),
                                                                    valueContainer: (provided, state) => ({
                                                                        ...provided,
                                                                        height: '42px',
                                                                        padding: '0 0.5rem',
                                                                        overflow: 'visible',
                                                                    }),
                                                                    input: (provided, state) => ({
                                                                        ...provided,
                                                                        margin: '0px',
                                                                    }),
                                                                    indicatorSeparator: state => ({
                                                                        alignSelf: 'stretch',
                                                                        width: '1px',
                                                                        backgroundColor: 'hsl(0, 0%, 80%)',
                                                                        marginBottom: '12px',
                                                                        marginTop: '12px',
                                                                        boxSizing: 'border-box',
                                                                    }),
                                                                    indicatorsContainer: (provided, state) => ({
                                                                        ...provided,
                                                                        height: '42px',
                                                                    }),
                                                                }}
                                                                placeholder={lang === 'ar' ? 'حدد مكان الشراء' : 'Select Purchasing Channel'}
                                                                options={lang === 'ar' ? PurchasingConstAr : PurchasingConst}
                                                                isSearchable={true}
                                                                value={purchasing}
                                                                // className="text-primary font-regular text-sm focus-visible:outline-none w-full"
                                                                // className='border w-full rounded-md focus-visible:outline-none border-primary/50 border-primary hover:border-primary text-dark mt-0.5 mb-3'
                                                                className={`${purchasingErrorStatus == true ? 'border-[#DC4E4E]' : 'border-primary/50 border-primary hover:border-primary'} border w-full rounded-md focus-visible:outline-none hover:border-primary text-dark mt-0.5 mb-3`}
                                                                classNamePrefix="react-select"
                                                                onChange={(e: any) => {
                                                                    setPurchasing(e)
                                                                }}
                                                            />
                                                        </label>

                                                        <label className='text-xs font-semibold'>
                                                            {lang === 'ar' ? 'رقم الفاتورة' : 'Invoice Number'}
                                                            <span className='text-[#DC4E4E]'>*</span>
                                                            <input
                                                                onChange={(e) => {
                                                                    setInvoiceNumber(e.target.value)
                                                                }}
                                                                value={invoiceNumber}
                                                                type='text'
                                                                placeholder={lang === 'ar' ? 'رقم الفاتورة' : 'Invoice Number'}
                                                                className={`${invoiceNumberErrorStatus == true ? 'border-[#DC4E4E]' : 'border-primary/50 border-primary hover:border-primary'} border w-full rounded-md h-12 p-2.5 focus-visible:outline-none text-dark mt-0.5 mb-3`}
                                                            />
                                                        </label>

                                                        <label className='text-xs font-semibold'>
                                                            {lang === 'ar' ? 'موضوع الشكوى' : 'Subject of Complain'}
                                                            <input
                                                                onChange={(e) => {
                                                                    setTitle(e.target.value)
                                                                }}
                                                                value={title}
                                                                type='text'
                                                                placeholder={lang === 'ar' ? 'موضوع الشكوى' : 'Subject of Complain'}
                                                                className={`border-primary/50 border-primary hover:border-primary' border w-full rounded-md h-12 p-2.5 focus-visible:outline-none text-dark mt-0.5 mb-3`}
                                                            />
                                                        </label>

                                                        <label className='text-xs font-semibold'>
                                                            {lang === 'ar' ? 'الشكوي' : 'Complain'}
                                                            <span className='text-[#DC4E4E]'>*</span>
                                                            <textarea id="iconLeft" rows={6} value={complain} placeholder={lang === 'ar' ? 'الشكوي' : 'Complain'}
                                                                className={`${complainErrorStatus == true ? 'border-[#DC4E4E]' : 'border-primary/50 border-primary hover:border-primary'} border w-full rounded-md p-2.5 focus-visible:outline-none text-dark mt-0.5 mb-3`}
                                                                onChange={(e: any) => {
                                                                    setComplain(e.target.value)
                                                                }} />
                                                        </label>
                                                    </>
                                                    : null}

                                        </>
                                        :
                                        null
                                    }

                                </div>
                                <div className="h-10">&nbsp;</div>
                                <div className=' bg-white shadow-md p-2 rounded-md fixed bottom-0 w-full left-0 sm:left-1/2 sm:-translate-x-1/2 sm:container'>
                                    {step === 0 || step === 1 ?
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!phoneNumber) {
                                                        setPhoneErrorStatus(true)
                                                        topMessageAlartDanger(lang === 'ar' ? 'خطأ! الرجاء إضافة رقم صالح' : 'Error! Please Add Valid Number')
                                                        ErrorTracker.trackCustomError(
                                                            lang === 'ar' ? 'خطأ! الرجاء إضافة رقم صالح' : 'Error! Please Add Valid Number',
                                                            'frontend',
                                                            400,
                                                            deviceType,
                                                            'Maintenance Request Page'
                                                        );
                                                        return false;
                                                    } else {
                                                        setLoader(true)
                                                        checkLoginPhoneNumber(phoneNumber)
                                                    }

                                                }}
                                                className={`focus-visible:outline-none bg-[#004B7A] border border-[#004B7A] hover:bg-[#00446f] hover:border-[#00446f] text-white w-full rounded-md p-2.5 text-sm my-3 font-medium flex items-center justify-center m-auto z-10`}>
                                                {loader == true ?
                                                    <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 fill-white" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg>
                                                    :
                                                    lang === 'ar' ? 'أكمل' : 'Continue'
                                                }
                                            </button>
                                        </>
                                        :
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setLoader(true)
                                                    submit()
                                                }}
                                                className={`focus-visible:outline-none bg-[#004B7A] border border-[#004B7A] hover:bg-[#00446f] hover:border-[#00446f] text-white w-full rounded-md p-2.5 text-sm my-3 font-medium flex items-center justify-center m-auto z-10`}>
                                                {loader == true ?
                                                    <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 fill-white" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg>

                                                    : null}
                                                {lang === 'ar' ? 'قدم الطلب' : 'Submit'}
                                            </button>

                                        </>
                                    }
                                </div>
                            </>
                            :
                            <>
                                <div className='bg-white shadow-md p-2 rounded-md fixed bottom-0 w-full left-0 sm:left-1/2 sm:-translate-x-1/2 sm:container'>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!selectedBrand) {
                                                setBrandsErrorStatus(true)
                                                ErrorTracker.trackCustomError(
                                                    lang === 'ar' ? 'خطأ! الرجاء اختيار العلامة التجارية!' : 'Error! Please select the brand!',
                                                    'frontend',
                                                    400,
                                                    deviceType,
                                                    'Maintenance Request Page'
                                                );
                                                topMessageAlartDanger(lang === 'ar' ? 'خطأ! الرجاء اختيار العلامة التجارية!' : 'Error! Please select the brand!')
                                                return false;
                                            } else {
                                                setLoader(true)
                                                router.push(`/${lang}/maintenance`)
                                                router.refresh()
                                            }

                                        }}
                                        className={`focus-visible:outline-none bg-[#004B7A] border border-[#004B7A] hover:bg-[#00446f] hover:border-[#00446f] text-white w-full rounded-md p-2.5 text-sm my-3 font-medium flex items-center justify-center m-auto`}>
                                        {loader == true ?
                                            <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 fill-white" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg>
                                            :
                                            lang === 'ar' ? 'أكمل' : 'Continue'
                                        }
                                    </button>
                                </div>
                            </>
                        }
                    </section>
                </>
            }


        </>
    )
}