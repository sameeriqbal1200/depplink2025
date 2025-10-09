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
import LocationAddressIcon from '../../components/Icons/LocationAdressIcon';
import EditIcon from '../../components/Icons/EditIcon';
import TrashIcon from '../../components/Icons/TrashIcon';

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
                                <LocationAddressIcon size={22} color="#004B7A" className="" />
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
                                            <LocationAddressIcon size={28} color={`${data?.make_default == 1 ? '#FFFFFF' : '#004B7A'}`} />
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
                                                    <EditIcon size={22} color={`${data?.make_default == 1 ? '#fff' : '#004B7A'}`} className="" />
                                                </button>
                                                :
                                                <>
                                                    <button className={`focus-visible:outline-none btn ${data?.make_default == 1 ? 'fill-white' : 'fill-[#EB5757]'}`} onClick={() => DeleteAddress(data?.id)}>
                                                        <TrashIcon size={20} color={`${data?.make_default == 1 ? '#fff' : '#EB5757'}`} />
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