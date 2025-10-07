"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next-nprogress-bar';
import { RadioGroup } from '@headlessui/react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useSearchParams } from 'next/navigation'
import { useApp } from "@/app/_ctx/AppContext";
import { getCitiesList, getUserAddress, getUserEditAddress, postAddAddress, postUpdateAddress, userDeleteAddress } from '@/lib/accounts/addressBook.client';

const MobileHeader = dynamic(() => import('../../components/MobileHeader'), { ssr: true })
const Select = dynamic(() => import('react-select'), { ssr: false })

export default function AddressBook() {
    const { t, lang } = useApp();
    const searchParams = useSearchParams()
    const AddressShippingId = searchParams.get('AddressShippingId')
    const addAddressCheckout = searchParams.get('addAddressCheckout')
    const [typeHouse, setTypeHouse] = useState<String>('Home')
    const [isactive, setActive] = useState(false)
    const [addAddress, setAddAddress] = useState(false)
    // const [regions, setRegions] = useState<any>([])
    const [selectedRegion, setSelectedRegion] = useState<any>([])
    const [cities, setCities] = useState<any>([])
    const [selectedCity, setSelectedCity] = useState<any>([])
    const [address, setAddress] = useState<any>('')
    const [shippinginstructions, setShippingInstructions] = useState<any>('')
    const [dataid, setId] = useState<any>('')
    const [primaryAddress, setPrimaryAddress] = useState<any>(false)
    const [addresslabel, setAddressLabel] = useState(false)
    const [editdata, seteditdata] = useState(false)
    const [city, setCity] = useState<any>('')
    const [errormsg, setErrorMsg] = useState<any>('')

    const [addressData, setAddressData] = useState<any>([])
    const [loader, setLoader] = useState(false)

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
            position: lang === 'ar' ? 'top-start' : 'top-end',
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
            position: lang === 'ar' ? 'top-start' : 'top-end',
            showConfirmButton: false,
            timer: 15000,
            showCloseButton: true,
            background: '#DC4E4E',
            color: '#FFFFFF',
            timerProgressBar: true,
        });
    };

    const getCustomerAddressData = async () => {
        try {
            const userId = localStorage.getItem("userid");
            if (!userId) {
                router.push(`/${lang}`);
                return;
            }
            const userAddressBook = await getUserAddress();
            setAddressData(userAddressBook?.userAddressBook);
            if (AddressShippingId) {
                setAddAddress(true);
                EditAddress(AddressShippingId);
                seteditdata(true);
            } else if (addAddressCheckout) {
                await getCities(lang);
                seteditdata(false);
                setAddAddress(true);
            }
        } catch (error) {
            console.error("Failed to load customer address data:", error);
            // optionally show toast or fallback UI
        }
    };

    useEffect(() => {
        getCustomerAddressData()
        getCities(lang)
    }, [])

    const router = useRouter();

    const AddAddress = async () => {
    if (isactive == true) {
      localStorage.setItem("globalcity", selectedCity?.label?.toString());
    }
    var data = {
      user_id: localStorage.getItem("userid"),
      address: address,
      state_id: city?.value,
      shippinginstractions: shippinginstructions,
      make_default: isactive == true ? 1 : 0,
      address_label: typeHouse == "Home" ? 0 : 1,
    };
    if (!address || !city || !shippinginstructions) {
      const missingFields =
        (!address ? (lang === "ar" ? "العنوان، " : "Address, ") : "") +
        (!city ? (lang === "ar" ? "المدينة، " : "City, ") : "") +
        (!shippinginstructions
          ? lang === "ar"
            ? "تعليمات الشحن"
            : "Shipping Instructions"
          : "");

      setErrorMsg(
        lang === "ar"
          ? `خطأ! يرجى إدخال ${missingFields}!`
          : `Error! Please fill ${missingFields}!`
      );

      topMessageAlartDanger(errormsg);
      setLoader(false);
      return false;
    }
    const AddAddress = await postAddAddress(data);
    if (addAddressCheckout && AddAddress?.addNewAddress?.success) {
      setLoader(false);
      setAddAddress(false);
      DataGo();
      getCustomerAddressData();
      topMessageAlartSuccess(t("address.AddAddress"));
      router.push(`/${lang}/checkout`);
    }
    if (AddAddress?.addNewAddress?.success) {
      setLoader(false);
      DataGo();
      setAddAddress(false);
      getCustomerAddressData();
      topMessageAlartSuccess(t("address.AddAddress"));
    } else {
      setLoader(false);
      topMessageAlartDanger(t("somethingwentwrong"));
    }
  };

    const UpdateAddress = async (dataid: any) => {
        if (isactive == true) {
            localStorage.setItem('globalcity', selectedCity?.label?.toString())
        }
        var data = {
            user_id: localStorage.getItem("userid"),
            address: address,
            state_id: selectedCity?.value,
            shippinginstractions: shippinginstructions,
            make_default: isactive == true ? 1 : 0,
            address_label: typeHouse == 'Home' ? 0 : 1,
        }
        if (!address || !selectedCity || !shippinginstructions) {
            const missingFields =
                (!address ? (lang === "ar" ? "العنوان، " : "Address, ") : "") +
                (!selectedCity ? (lang === "ar" ? "المدينة، " : "City, ") : "") +
                (!shippinginstructions
                ? lang === "ar"
                    ? "تعليمات الشحن"
                    : "Shipping Instructions"
                : "");
            setErrorMsg(
                lang === "ar"
                ? `خطأ! يرجى إدخال ${missingFields}!`
                : `Error! Please fill ${missingFields}!`
            );
            topMessageAlartDanger(errormsg);
            setLoader(false);
            return false;
        }

        const updateUseraddress = await postUpdateAddress(dataid, data);
            if (
            AddressShippingId == dataid &&
            updateUseraddress?.updateAddressPost?.success
            ) {
            setLoader(false);
            getCustomerAddressData();
            DataGo();
            topMessageAlartSuccess(t("address.UpdateAddress"));
            router.push(`/${lang}/checkout`);
            }
            if (updateUseraddress?.updateAddressPost?.success) {
            setLoader(false);
            setAddAddress(false);
            getCustomerAddressData();
            DataGo();
            topMessageAlartSuccess(t("address.UpdateAddress"));
            } else {
            setLoader(false);
            topMessageAlartDanger(t("somethingwentwrong"));
        }
    }

    async function EditAddress(id: any) {
        const getEditAddress = await getUserEditAddress(id);
        // if (lang === 'ar') {
        //     setRegions(responseJson?.arabicregions)
        // }
        // else {
        //     setRegions(responseJson?.regions)
        // }
        setAddress(getEditAddress?.userEditAddress?.address?.address);
        setShippingInstructions(
        getEditAddress?.userEditAddress?.address?.shippinginstractions
        );
        setPrimaryAddress(getEditAddress?.userEditAddress?.address?.make_default);
        if (getEditAddress?.userEditAddress?.address?.make_default == 1) {
        setActive(true);
        } else {
        setActive(false);
        }
        if (getEditAddress?.userEditAddress?.address?.address_label == 0) {
        setTypeHouse("Home");
        } else {
        setTypeHouse("Office");
        }
        setId(getEditAddress?.userEditAddress?.address?.id);

        // if (lang === 'ar') {
        //     const parentData = getEditAddress?.userEditAddress.arabicregions?.filter((item: { value: any; }) => item?.value === getEditAddress?.userEditAddress?.address?.state_data?.region?.id);
        //     setSelectedRegion(parentData[0])
        // }
        // else {
        //     const parentData = getEditAddress?.userEditAddress.regions?.filter((item: { value: any; }) => item?.value === getEditAddress?.userEditAddress?.address?.state_data?.region?.id);
        //     setSelectedRegion(parentData[0])
        // }

        if (lang === "ar") {
        const CityData = getEditAddress?.userEditAddress.arabiccities?.filter(
            (item: { value: any }) =>
            item?.value === getEditAddress?.userEditAddress?.address?.state_id
        );
        setSelectedCity(CityData[0]);
        } else {
        const CityData = getEditAddress?.userEditAddress.cities?.filter(
            (item: { value: any }) =>
            item?.value === getEditAddress?.userEditAddress?.address?.state_id
        );
        setSelectedCity(CityData[0]);
    }
  }

    async function DeleteAddress(id: any) {
        const deleteAddress = await userDeleteAddress(id);
        if (deleteAddress?.deleteAddress?.success) {
        getCustomerAddressData();
        topMessageAlartSuccess(t("address.DeleteAddress"));
        } else {
        topMessageAlartDanger(t("somethingwentwrong"));
        }
    }

    async function getCities(lang: string) {
        const getAllCities = await getCitiesList(lang);
        setCities(getAllCities?.listOfCities?.data);
        var selectcity = getAllCities?.listOfCities?.data?.filter(
        (item: { label: string | null }) =>
            item.label == localStorage.getItem("globalcity")
        )[0];
        if (selectcity) {
        setCity(selectcity);
        }
    }

    const DataGo = () => {
        setAddress('')
        setShippingInstructions('')
        setAddressLabel(false)
        setSelectedRegion([])
        setSelectedCity([])
        setId('')
    }

    async function handleSave() {
        if (loader) return;              // debounce: ignore extra clicks while loading
        setLoader(true);
        try {
            if (editdata) {
                // EDIT FLOW
                await UpdateAddress(dataid);
            } else {
                // ADD FLOW
                // If AddAddress needs city list first, await it here:
                await getCities(lang);
                await AddAddress();
            }
            // TODO: success toast / close modal / refresh data
        } catch (err) {
            console.error(err);
            // TODO: show error toast
        } finally {
            setLoader(false);
        }
    }

    return (
        <>
            <MobileHeader type="Third" lang={lang} pageTitle={lang === 'ar' ? 'عناويني' : 'Addresses'} />
            <div className="container md:py-4 py-16">
                <div className="flex items-start my-4 gap-x-5">
                    <div className={`w-full ${addAddress == true ? 'block' : 'hidden'}`}>
                        <div className={`pb-3 ${addAddress == true ? 'block' : 'hidden'}`}>
                            <div className="flex items-center rounded-md border border-[#dfdfdf] focus-visible:outline-[#00243c] fill-primary p-2.5 text-sm gap-x-3 w-full mb-3 bg-white">
                                <svg id="fi_3514361" height="22" viewBox="0 0 256 256" width="22" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m128 138.184a5 5 0 0 1 -3.607-1.538c-2.075-2.16-50.808-53.259-50.808-82.228a54.415 54.415 0 1 1 108.83 0c0 28.969-48.733 80.068-50.808 82.228a5 5 0 0 1 -3.607 1.538zm0-128.184a44.465 44.465 0 0 0 -44.415 44.418c0 19.07 29.312 54.978 44.414 71.451 15.1-16.478 44.416-52.4 44.416-71.451a44.465 44.465 0 0 0 -44.415-44.418z"></path><path d="m128 76.153a21.735 21.735 0 1 1 21.735-21.735 21.759 21.759 0 0 1 -21.735 21.735zm0-33.47a11.735 11.735 0 1 0 11.735 11.735 11.748 11.748 0 0 0 -11.735-11.735z"></path><path d="m128.126 256a4.992 4.992 0 0 1 -2.5-.67l-77.175-44.559a5 5 0 0 1 -2.5-4.331v-38.385a5 5 0 0 1 10 0v35.5l72.175 41.67 72.174-41.67v-35.88a5 5 0 0 1 10 0v38.765a5 5 0 0 1 -2.5 4.331l-77.174 44.556a4.992 4.992 0 0 1 -2.5.673z"></path><path d="m128.126 166.884a4.992 4.992 0 0 1 -2.5-.67l-77.175-44.557a5 5 0 1 1 5-8.66l74.675 43.113 74.674-43.11a5 5 0 1 1 5 8.66l-77.174 44.557a4.992 4.992 0 0 1 -2.5.667z"></path><path d="m160.933 198.291a5 5 0 0 1 -3.459-1.389l-32.806-31.402a5 5 0 0 1 6.916-7.224l30.1 28.813 68.154-39.349-27.558-26.382-27.359-15.744a5 5 0 1 1 4.988-8.667l27.885 16.047a4.988 4.988 0 0 1 .964.721l32.806 31.407a5 5 0 0 1 -.958 7.942l-77.174 44.557a4.993 4.993 0 0 1 -2.499.67z"></path><path d="m95.067 198.525a4.985 4.985 0 0 1 -2.5-.67l-77.173-44.555a5 5 0 0 1 -.957-7.942l33.057-31.642a4.967 4.967 0 0 1 .957-.718l27.634-15.955a5 5 0 1 1 5 8.66l-27.112 15.653-27.807 26.616 68.154 39.348 30.349-29.048a5 5 0 1 1 6.914 7.224l-33.058 31.641a4.991 4.991 0 0 1 -3.458 1.388z"></path></svg>
                                <div className="h-5 w-[1px] bg-primary opacity-20" />
                                <input id="iconLeft" value={address} type="text" placeholder={lang === 'ar' ? 'رقم الشقة / رقم المبنى / المنطقة أو أقرب معلم' : 'Flat Number / Building Number / Area or Nearest Land Mark'} className="focus-visible:outline-none w-full font-regular"
                                    onChange={(e: any) => {
                                        setAddress(e.target.value)
                                    }} />
                            </div>
                            <div className="md:flex items-center mb-3 gap-x-3">
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
                                    placeholder={lang === 'ar' ? 'اختر المنطقة' : 'Select City'}
                                    options={cities}
                                    isSearchable={true}
                                    value={editdata ? selectedCity : city}
                                    className="text-primary font-regular text-sm focus-visible:outline-none w-full"
                                    classNamePrefix="react-select"
                                    onChange={(e: any) => {
                                        setCity(e)
                                        setSelectedCity(e)
                                    }}
                                />
                            </div>
                            <div className="rounded-md border border-[#dfdfdf] focus-visible:outline-[#00243c] p-2.5 text-sm w-full mb-3 bg-white">
                                <textarea id="iconLeft" rows={3} value={shippinginstructions || ''} placeholder={lang === 'ar' ? 'تعليمات الشحن' : 'Shipping Instructions'} className="focus-visible:outline-none w-full font-regular"
                                    onChange={(e: any) => {
                                        setShippingInstructions(e.target.value)
                                    }} />
                            </div>
                            <div className="md:flex items-center justify-between">
                                <RadioGroup value={typeHouse} onChange={setTypeHouse} className="flex items-center justify-end gap-x-3 text-xs">
                                    <RadioGroup.Option value="Home">
                                        {({ active, checked }) => (
                                            <button className={`${checked ? `focus-visible:outline-none border border-[#219EBC] bg-[#219EBC] text-white` : `border border-[#219EBC60] text-[#219EBC80]`} py-1.5 px-2 rounded-md flex items-center gap-x-2`}>
                                                {checked ?
                                                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                                                        <circle cx={12} cy={12} r={12} fill="#FFFFFF" />
                                                        <path
                                                            d="M7 13l3 3 7-7"
                                                            stroke="#219EBC"
                                                            strokeWidth={1.5}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    :
                                                    <svg viewBox="0 0 24 24" fill="#5D686F60" className="h-4 w-4">
                                                        <circle cx={12} cy={12} r={12} fill="#5D686F60" opacity={0.2} />
                                                    </svg>
                                                }
                                                {lang === 'ar' ? 'الــمنـــزل' : 'Home'}
                                            </button>
                                        )
                                        }
                                    </RadioGroup.Option>
                                    <RadioGroup.Option value="Office">
                                        {({ active, checked }) => (
                                            <button className={`${checked ? `focus-visible:outline-nonecborder border-[#219EBC] bg-[#219EBC] text-white` : `border border-[#219EBC60] text-[#219EBC80]`} py-1.5 px-2 rounded-md flex items-center gap-x-2`}>
                                                {checked ?
                                                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                                                        <circle cx={12} cy={12} r={12} fill="#FFFFFF" />
                                                        <path
                                                            d="M7 13l3 3 7-7"
                                                            stroke="#219EBC"
                                                            strokeWidth={1.5}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    :
                                                    <svg viewBox="0 0 24 24" fill="#5D686F60" className="h-4 w-4">
                                                        <circle cx={12} cy={12} r={12} fill="#5D686F60" opacity={0.2} />
                                                    </svg>
                                                }
                                                {lang === 'ar' ? 'مكتب' : 'Office'}
                                            </button>
                                        )
                                        }
                                    </RadioGroup.Option>
                                </RadioGroup>
                            </div>

                        </div>
                    </div>

                    <div className={`w-full ${addAddress == true ? 'hidden' : 'block'}`}>
                        <h2 className="font-bold text-base mb-4 max-md:hidden">{lang === 'ar' ? 'قائـمة العـناويـن الخاصـة بـك' : 'Address Book'}</h2>

                        {addressData?.addresses?.map((data: any, i: any) => {
                            return (
                                <div
                                    key={data.id}
                                    className={
                                        `${data?.make_default == 1
                                            ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                                            : ''
                                        } ${data?.make_default == 1 ? 'bg-[#219EBC] text-white border' : 'bg-[#FFFFFF] border border-[#219EBC80]'} relative flex cursor-pointer rounded-lg p-3 shadow-md focus:outline-none border-[#219EBC80] mb-3`
                                    }>
                                    <div className="flex w-full items-center justify-between">
                                        <div className={`flex items-center gap-x-3 ${data?.make_default == 1 ? 'fill-[#FFFFFF]' : 'fill-[#004B7A]'}`}>
                                            <svg id="fi_3514361" height="28" viewBox="0 0 256 256" width="28" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m128 138.184a5 5 0 0 1 -3.607-1.538c-2.075-2.16-50.808-53.259-50.808-82.228a54.415 54.415 0 1 1 108.83 0c0 28.969-48.733 80.068-50.808 82.228a5 5 0 0 1 -3.607 1.538zm0-128.184a44.465 44.465 0 0 0 -44.415 44.418c0 19.07 29.312 54.978 44.414 71.451 15.1-16.478 44.416-52.4 44.416-71.451a44.465 44.465 0 0 0 -44.415-44.418z"></path><path d="m128 76.153a21.735 21.735 0 1 1 21.735-21.735 21.759 21.759 0 0 1 -21.735 21.735zm0-33.47a11.735 11.735 0 1 0 11.735 11.735 11.748 11.748 0 0 0 -11.735-11.735z"></path><path d="m128.126 256a4.992 4.992 0 0 1 -2.5-.67l-77.175-44.559a5 5 0 0 1 -2.5-4.331v-38.385a5 5 0 0 1 10 0v35.5l72.175 41.67 72.174-41.67v-35.88a5 5 0 0 1 10 0v38.765a5 5 0 0 1 -2.5 4.331l-77.174 44.556a4.992 4.992 0 0 1 -2.5.673z"></path><path d="m128.126 166.884a4.992 4.992 0 0 1 -2.5-.67l-77.175-44.557a5 5 0 1 1 5-8.66l74.675 43.113 74.674-43.11a5 5 0 1 1 5 8.66l-77.174 44.557a4.992 4.992 0 0 1 -2.5.667z"></path><path d="m160.933 198.291a5 5 0 0 1 -3.459-1.389l-32.806-31.402a5 5 0 0 1 6.916-7.224l30.1 28.813 68.154-39.349-27.558-26.382-27.359-15.744a5 5 0 1 1 4.988-8.667l27.885 16.047a4.988 4.988 0 0 1 .964.721l32.806 31.407a5 5 0 0 1 -.958 7.942l-77.174 44.557a4.993 4.993 0 0 1 -2.499.67z"></path><path d="m95.067 198.525a4.985 4.985 0 0 1 -2.5-.67l-77.173-44.555a5 5 0 0 1 -.957-7.942l33.057-31.642a4.967 4.967 0 0 1 .957-.718l27.634-15.955a5 5 0 1 1 5 8.66l-27.112 15.653-27.807 26.616 68.154 39.348 30.349-29.048a5 5 0 1 1 6.914 7.224l-33.058 31.641a4.991 4.991 0 0 1 -3.458 1.388z"></path></svg>
                                            <div className="w-64 md:w-full">

                                                <div className="flex items-center justify-between w-full mb-3">
                                                    <p className={`text-[#004B7A] flex items-center gap-x-2 text-sm font-bold ${data?.make_default == 1 ? 'text-white' : ''}`}>
                                                        {data?.address_label == 0 ? lang === 'ar' ? 'الــمنـــزل' : 'Home' : lang === 'ar' ? 'مكتب' : 'Office'}
                                                        {data?.make_default == 1 ?
                                                            <span className={`px-2 py-1 bg-[#219EBC30] text-xs rounded-sm text-[#219EBC] ${data?.make_default == 1 ? 'text-white bg-[#FFFFFF30]' : ''}`}>{lang === 'ar' ? 'العنوان الرئيسي' : 'Primary Address'} </span>
                                                            : null}
                                                    </p>
                                                    <button className={`focus-visible:outline-none btn text-sm underline absolute ltr:right-4 rtl:left-4 font-semibold ${data?.make_default == 1 ? 'text-[#004B7A]' : 'text-[#FF671F]'}`} onClick={() => { setAddAddress(true), EditAddress(data?.id), seteditdata(true) }}>
                                                        {lang === 'ar' ? 'تغــيــيـر' : 'Edit'}
                                                    </button>
                                                </div>

                                                <p className={`mt-1 text-xs text-[#5D686F] ${data?.make_default == 1 ? 'text-white' : ''}`}>{data?.address}</p>
                                                <p className={`mt-1.5 text-xs text-[#5D686F] font-bold ${data?.make_default == 1 ? 'text-white' : ''}`}>{lang === 'ar' ? data?.state_data?.region?.name_arabic : data?.state_data?.region?.name}, {lang === 'ar' ? data?.state_data?.name_arabic : data?.state_data?.name} | {lang === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</p>
                                                <div className="mt-3">
                                                    <p className={`mt-3 text-xs text-[#5D686F] font-bold ${data?.make_default == 1 ? 'text-white' : ''}`}>{lang === 'ar' ? 'تعليمات الشحن' : 'Shipping Instructions'}:</p>
                                                    <p className={`mt-1 text-xs text-[#5D686F] font-light ${data?.make_default == 1 ? 'text-white' : ''}`}>{data?.shippinginstractions}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-x-3">
                                            {data?.make_default == 1 ?
                                                <button className={`focus-visible:outline-none btn ${data?.make_default == 1 ? 'fill-white' : 'fill-[#004B7A]'}`} onClick={() => { setAddAddress(true), EditAddress(data?.id), seteditdata(true) }}>
                                                    <svg clipRule="evenodd" fillRule="evenodd" width="22" height="22" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="fi_10426353"><g id="Icon"><path d="m22.099 6.429c-2.126 2.126-7.116 7.115-8.333 8.328-.263.262-.576.469-.912.604-.976.405-3.357 1.339-4.057 1.386-.417.028-.826-.126-1.122-.422s-.45-.705-.422-1.122c.047-.7.981-3.079 1.379-4.051.139-.345.346-.658.609-.92l8.33-8.331c.403-.403.951-.63 1.521-.63s1.118.227 1.521.63l1.486 1.486c.403.403.63.951.63 1.521s-.227 1.118-.63 1.521zm-13.343 8.815c.684-.086 2.683-.92 3.523-1.269.003-.001.006-.002.008-.003.157-.063.299-.157.418-.276l.001-.001c1.219-1.213 6.207-6.201 8.332-8.327.122-.122.191-.287.191-.46s-.069-.338-.191-.46l-1.486-1.486c-.122-.122-.287-.191-.46-.191s-.338.069-.46.191l-8.331 8.331c-.12.119-.214.262-.277.419l-.002.004c-.345.842-1.18 2.843-1.266 3.528z"></path><path d="m20.118 7.349c.292.293.292.768 0 1.061-.293.293-.768.293-1.061 0l-3.467-3.467c-.293-.293-.293-.768 0-1.061.293-.292.768-.292 1.061 0z"></path><path d="m13.997 13.47c.293.292.293.768 0 1.06-.292.293-.768.293-1.06 0l-3.467-3.467c-.293-.292-.293-.768 0-1.06.292-.293.768-.293 1.06 0z"></path><path d="m8.5 3.25c.414 0 .75.336.75.75s-.336.75-.75.75h-3.5c-1.243 0-2.25 1.007-2.25 2.25v12c0 .597.237 1.169.659 1.591s.994.659 1.591.659h13c.597 0 1.169-.237 1.591-.659s.659-.994.659-1.591v-3.5c0-.414.336-.75.75-.75s.75.336.75.75v3.5c0 .995-.395 1.948-1.098 2.652-.704.703-1.657 1.098-2.652 1.098h-13c-.995 0-1.948-.395-2.652-1.098-.703-.704-1.098-1.657-1.098-2.652v-12c0-2.071 1.679-3.75 3.75-3.75z"></path></g></svg>
                                                </button>
                                                :
                                                <>
                                                    <button className={`focus-visible:outline-none btn ${data?.make_default == 1 ? 'fill-white' : 'fill-[#EB5757]'}`} onClick={() => DeleteAddress(data?.id)}>
                                                        <svg height="20" viewBox="-40 0 427 427.00131" width="20" xmlns="http://www.w3.org/2000/svg" id="fi_1214428"><path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"></path><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path></svg>
                                                    </button>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 w-full p-3 bg-white shadow-md border-t border-[#5D686F26]">
                <button
                    type="button"
                    onClick={() => { seteditdata(false), getCities(lang), setAddAddress(true) }}
                    className={`focus-visible:outline-none bg-[#004B7A] border border-[#004B7A] hover:bg-[#00446f] hover:border-[#00446f] text-white w-full rounded-md p-2.5 text-sm font-medium flex items-center justify-center ${addAddress == true ? 'hidden' : ''}`}>
                    {lang === 'ar' ? 'اضـافـة عنوان جديد' : 'Add New Address'}
                </button>
            </div>
            {addAddress && (
                <div>
                    <div className="fixed bottom-0 w-full p-3 bg-white shadow-md border-t border-[#5D686F26]">
                        <div className="flex items-center justify-between mb-3.5">
                            <label htmlFor="deafultAddress" className="focus-visible:outline-[#00243c] fill-primary text-sm w-full items-center flex gap-x-2">
                                <input type="checkbox" className="h-5 w-5 hidden" id="deafultAddress" name="deafultAddress" onClick={(e: any) => { setActive(!isactive) }}
                                    onChange={(e: any) => {
                                        setPrimaryAddress(e.value)
                                    }} />
                                <svg viewBox="0 0 24 24" className="h-5 w-5">
                                    <circle
                                        cx={12}
                                        cy={12}
                                        r={12}
                                        fill={isactive ? "#219EBC" : "#5D686F60"}
                                        opacity={isactive ? 1 : 0.2}
                                    />
                                    {isactive && (
                                        <path
                                            d="M7 13l3 3 7-7"
                                            stroke="#fff"
                                            strokeWidth={1.5}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    )}
                                </svg>
                                {lang === 'ar' ? 'اجعله عنوانًا افتراضيًا' : 'Make as primary address'}
                            </label>
                            <button onClick={() => { setAddAddress(false) }} className='text-[#219EBC] hover:underline text-sm'>{lang === 'ar' ? 'خلف' : 'Back'}</button>
                        </div>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={loader}
                            aria-busy={loader}
                            className={`focus-visible:outline-none bg-[#004B7A] border border-[#004B7A] 
                hover:bg-[#00446f] hover:border-[#00446f] text-white w-full 
                rounded-md p-2.5 text-sm font-medium flex items-center justify-center 
                disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                            {loader ? (
                                <svg
                                    height="24"
                                    width="24"
                                    viewBox="0 0 24 24"
                                    className="animate-spin h-6 w-6 fill-white mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z" />
                                </svg>
                            ) : null}
                            {lang === "ar" ? "استمرار" : editdata ? "Save" : "Save"}
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}