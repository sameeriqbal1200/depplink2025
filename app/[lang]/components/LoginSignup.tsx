'use client'

import React, { useState, useEffect, useRef, Fragment } from 'react'
import Image from 'next/image'
import MaskedInput from 'react-text-mask'
import { RadioGroup } from '@headlessui/react'
import { Dialog, Transition } from '@headlessui/react'
import { useRouter, usePathname } from "next/navigation"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { postLoginSignup } from '@/lib/components/component.client'
import { postUserLogin } from '@/lib/components/component.client'
import { postCheckOtp } from '@/lib/components/component.client'
import { postRegOtp } from '@/lib/components/component.client'
import { postRegCheckPhone } from '@/lib/components/component.client'
import { postUserRegister } from '@/lib/components/component.client'
import { postResendOtp } from '@/lib/components/component.client'

export default function LoginSingup(props: any) {
    const NewMedia = props?.NewMedia;
    const router = useRouter()
    const path = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [signUp, setSignUp] = useState(false)
    const [selected, setSelected] = useState([])
    const [phoneNumber, setPhoneNumber] = useState<any>(false)
    const [userid, setUserid] = useState<any>(false)
    const [loginBtnStatus, setLoginBtnStatus] = useState<boolean>(true)
    const [loginBtnLoading, setLoginBtnLoading] = useState<boolean>(false)
    const [loginErrorStatus, setLoginErrorStatus] = useState<boolean>(false)
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [dateOfBirth, setDateOfBirth] = useState<string>('')
    const [genderStatus, setGenderStatus] = useState<number>(0)
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [otpError, setOtpError] = useState<any>(null);
    const otpBoxReference = useRef<any>([]);
    const correctOTP = "392939" // validate from your server
    const [login, setLogin] = useState(false)
    const [register, setRegister] = useState(false)
    const [otpbox, setOtpBox] = useState(false)
    const [registerotpbox, setRegisterOtpBox] = useState(false)
    const [otptype, setOtpType] = useState(login)
    const [resendotpmessage, setResendOtpMsssage] = useState(true)
    const [seconds, setSeconds] = useState<number>(59);
    const [minutes, setMinutes] = useState<number>(1);

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

    useEffect(() => {
        let timeInterval = setTimeout(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(timeInterval);
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000);
        return () => {
            clearInterval(timeInterval);
        };

    });

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

    useEffect(() => {
        getUser()
        if (otp.join("") !== "" && otp.join("") !== correctOTP) {
            setOtpError("❌ Wrong OTP Please Check Again")
            setOtpError(null)
        } else {
            setOtpError(null)
        }
    }, [location, otp]);

    const optConfirmation: any = () => {
        router.push(`/${props.lang}`);
    }

    function handleChange(value: any, index: any) {
        let newArr = [...otp];
        newArr[index] = value;
        setOtp(newArr);
        if (value && index < 6 - 1) {
            otpBoxReference.current[index + 1].focus()
            console.log(value)
        }
    }

    function handleBackspaceAndEnter(e: any, index: any) {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            otpBoxReference.current[index - 1].focus()
        }
        if (e.key === "Enter" && e.target.value && index < 6 - 1) {
            otpBoxReference.current[index + 1].focus()
        }
    }

    const getUser: any = () => {
        if (localStorage.getItem("userid")) {
            setUserid(localStorage.getItem("userid"))
            setIsOpen(false)
        }
    }

    const checkLoginPhoneNumber: any = (value: any) => {
        let phone = value.replace('(966)-', '');
        phone = phone.replace(/[^0-9\.]+/g, '')
        if (phone.length == 9) {
            setPhoneNumber(phone)
            setLoginBtnStatus(false)
        }
    }

    const quicklogin: any = async () => {
        var data = {
            phone_number: phoneNumber,
        };
        const dataUpd = await postLoginSignup(data);
        if (dataUpd?.loignSignupData?.success) {
            localStorage.setItem("userid", dataUpd?.loignSignupData?.user?.id.toString());
            setUserid(localStorage.getItem("userid"))
        } else {
            setLoginErrorStatus(true)
            setLoginBtnLoading(false)
        }
    }

    function CheckIcon(props: any) {
        return (
            <svg viewBox="0 0 24 24" fill="none" {...props}>
                <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
                <path
                    d="M7 13l3 3 7-7"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        )
    }

    const CheckPhoneNumber = async () => {
        var data = {
            phone_number: phoneNumber,
        }
        const Login = await postUserLogin(data);
        if (Login?.userLogin?.success === true) {
            setLoginBtnLoading(false)
            setOtpBox(true)
        }
        else {
            setRegister(true)
            setOtpType(register)
            setLoginBtnLoading(false)
        }
    }

    const CheckOtp = async () => {

        setSeconds(59)
        setMinutes(1)
        var dataotp = {
            phone_number: phoneNumber,
            otp_code: otp.join('')
        }
        const checkOtp = await postCheckOtp(dataotp);
        if (checkOtp?.checkOtpLogin?.success === true) {
            localStorage.setItem("userid", checkOtp?.checkOtpLogin?.user_id.toString())
            if (!localStorage.getItem('profileImg') && checkOtp?.checkOtpLogin?.user?.profile_img != null) {
                localStorage.setItem('profileImg', `${NewMedia}${checkOtp?.checkOtpLogin?.user?.profile_img?.toString()}`)
            } else {
                localStorage.removeItem('profileImg')
                localStorage.setItem('profileImg', `${NewMedia}${checkOtp?.checkOtpLogin?.user?.profile_img?.toString()}`)
            }
            setLoginBtnLoading(false)
            props.onClose()
            setPhoneNumber(false)
            setOtpBox(false)
            router.push(path + '?refresh=' + Math.random(), { scroll: false })
            router.refresh()
        }
        else {
            setLoginBtnLoading(false)
            topMessageAlartDanger(props?.dict?.login?.WrongOtp)
        }
    }

    const CheckRegisterOtp = async () => {

        var dataotp = {
            phone_number: phoneNumber,
            otp_code: otp.join('')
        }
        const otpRegisterCheck = await postRegOtp(dataotp);
        if (otpRegisterCheck?.checkRegOtp?.success === true) {
            Register()
            setLoginBtnLoading(false)
        }
        else {
            setLoginBtnLoading(false)
            topMessageAlartDanger(props?.dict?.login?.WrongOtp)
        }
    }

    const CheckRegisterPhone = async () => {
        var data = {
            phone_number: phoneNumber,
        }
        const phoneRegisterCheck = await postRegCheckPhone(data);
        if (phoneRegisterCheck?.checkRegPhone?.success === true) {
            setRegisterOtpBox(true)
            setLoginBtnLoading(false)
        }
        else {
            setOtpType(register)
            setRegister(true)
            setLoginBtnLoading(false)
        }
    }

    const Register = async () => {
        var data = {
            phone_number: phoneNumber,
            first_name: firstName,
            last_name: lastName,
            email: email,
            date_of_birth: dateOfBirth,
            gender: selected,
        }
        const registrationUser = await postUserRegister(data);
        if (registrationUser?.userReg?.success === true) {
            localStorage.setItem("userid", registrationUser?.userReg?.user?.id.toString())
            props.onClose()
            topMessageAlartSuccess(props?.dict?.login.Register)
            router.push(path + '?refresh=' + Math.random(), { scroll: false })
            router.refresh()
            // alert('User Registered Successfully!')
        }
        else {
            setLoginBtnLoading(false)
            topMessageAlartDanger(props?.dict?.login?.UserExists)
        }
    }

    const ResendOtp = async () => {
        var data = {
            phone_number: phoneNumber,
        }
        setSeconds(59)
        setMinutes(1)
        const resendOtp = await postResendOtp(data);
        if (resendOtp?.resendingOtp?.success === true) {
            setResendOtpMsssage(true)
            topMessageAlartSuccess(props?.dict?.login.ResendOtpSuccess)
        }
        else {
            topMessageAlartDanger(props?.dict?.login?.ResendOtpfailed)
        }
    }

    return (
        <Transition appear show={props.show} as={Fragment}>
            <Dialog as="div" open={props.show} onClose={props.onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0" />
                </Transition.Child>
                <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel as="div" className="panel border-0 rounded-lg overflow-hidden max-w-lg p-0 relative">
                                <Image
                                    src="/images/loginPattren.webp"
                                    alt='popup_pattren'
                                    title='Blue Popup Pattren'
                                    quality={100}
                                    height={0}
                                    width={0}
                                    style={{
                                        objectFit: 'contain', // cover, contain, none
                                    }}
                                    className="h-full w-full mt-10 rounded-tl-xl rounded-tr-xl"
                                    loading='lazy'
                                    sizes="(max-width: 960px) 50vw, (max-width: 1024px) 50vw, (max-width: 1650px) 50vw, (max-width: 1920px) 60vw, 100vw"
                                />
                                <div className='absolute top-0 text-white text-center w-full'>
                                    <div className='bg-white rounded-full w-20 flex items-center justify-center h-20 m-auto'>
                                        <svg enableBackground="new 0 0 520 520" height="50" viewBox="0 0 520 520" width="50" xmlns="http://www.w3.org/2000/svg" id="fi_2847017"><g id="_x37_6_x2C__Account_x2C__Authorize_x2C__Login_x2C__Security"><g><g><path d="m263.161 82.665c-.017.049-.036.097-.053.146-35.913-2.559-70.205 10.849-94.718 36.078-.069-.039-.141-.075-.209-.114-45.686 47.079-45.141 122.105 1.34 168.495 21.722 21.764 51.754 35.23 84.935 35.23 63.29 0 115.13-48.99 119.67-111.13-.057-.02-.111-.042-.168-.061 4.965-67.106-45.632-123.883-110.797-128.644z" fill="#3f4751"></path><path d="m297.986 186.03c-2.761 0-5-2.239-5-5v-21.18c0-20.595-16.76-37.35-37.36-37.35-20.595 0-37.35 16.755-37.35 37.35v21.18c0 2.761-2.239 5-5 5-2.762 0-5-2.239-5-5v-21.18c0-26.109 21.241-47.35 47.35-47.35 26.115 0 47.36 21.241 47.36 47.35v21.18c0 2.761-2.238 5-5 5z" fill="#a0b5c5"></path><path d="m302.807 181.03h-4.82-84.71-4.82c-6.43 0-11.649 5.21-11.649 11.65v73.169c0 6.44 5.22 11.65 11.649 11.65h94.351c6.43 0 11.649-5.21 11.649-11.65v-73.169c-.001-6.44-5.221-11.65-11.65-11.65z" fill="#d0dce7"></path><path d="m399.456 322.5c41.42 0 75 33.58 75 75 0 41.493-33.661 75-75 75h-290c-41.42 0-75-33.58-75-75 0-41.491 33.66-75 75-75z" fill="#757d8c"></path><path d="m444.456 252.5c11.04 0 20 8.95 20 20s-8.96 20-20 20c-11.05 0-20-8.95-20-20s8.95-20 20-20z" fill="#ffd400"></path><circle cx="74.456" cy="112.5" fill="#ffd400" r="30"></circle><path d="m219.836 201.94h71.591v54.64h-71.591z" fill="#a0b5c5"></path><path d="m460.255 161.318c.841-4.396 1.116-7.991 1.182-12.408-.23-.896 1.558-25.868-19.44-46.769-26.051-25.906-67.809-25.401-93.314.225l-.005-.005c-9.389 9.388-16.343 22.212-18.513 36.911-6.181 42.202 28.689 79.316 71.499 75.329 29.641-2.772 53.226-24.993 58.591-53.283z" fill="#313a52"></path><path d="m481.156 84.19c5.85 5.86 5.85 15.35 0 21.2l-23 23-35.31 35.31-21.2 21.2-21.2-21.2-10.61-10.6c-2.93-2.92-4.39-6.76-4.39-10.6s1.46-7.68 4.39-10.6c5.86-5.86 15.351-5.86 21.2 0l10.61 10.6 40.35-40.36 17.95-17.95c2.93-2.93 6.771-4.39 10.6-4.39 3.841 0 7.681 1.46 10.61 4.39z" fill="#07cc66"></path><g fill="#f88f19"><circle cx="471.956" cy="215" r="7.5"></circle><circle cx="391.956" cy="280" r="7.5"></circle><circle cx="341.956" cy="55" r="7.5"></circle><circle cx="131.956" cy="55" r="7.5"></circle><circle cx="106.956" cy="280" r="7.5"></circle><circle cx="56.956" cy="195" r="7.5"></circle></g><g><g><g><path d="m134.456 392.5h-17.932l12.678-12.675c1.952-1.952 1.952-5.118 0-7.07-1.953-1.953-5.118-1.953-7.071 0l-12.675 12.671v-17.926c0-2.762-2.238-5-5-5-2.761 0-5 2.238-5 5v17.936l-12.685-12.682c-1.953-1.951-5.119-1.952-7.071.001s-1.951 5.119.002 7.071l12.677 12.674h-17.923c-2.761 0-5 2.238-5 5s2.239 5 5 5h17.923l-12.677 12.674c-1.953 1.952-1.954 5.118-.002 7.071.977.977 2.256 1.465 3.536 1.465 1.279 0 2.559-.488 3.535-1.464l12.685-12.682v17.936c0 2.762 2.239 5 5 5 2.762 0 5-2.238 5-5v-17.926l12.675 12.671c.977.977 2.256 1.465 3.535 1.465 1.28 0 2.56-.488 3.536-1.465 1.952-1.952 1.952-5.118 0-7.07l-12.678-12.675h17.932c2.762 0 5-2.238 5-5s-2.238-5-5-5z" fill="#bce4ff"></path></g><g><path d="m214.456 392.5h-17.932l12.678-12.675c1.952-1.952 1.952-5.118 0-7.07-1.953-1.953-5.118-1.953-7.071 0l-12.675 12.671v-17.926c0-2.762-2.238-5-5-5-2.761 0-5 2.238-5 5v17.936l-12.685-12.682c-1.953-1.951-5.119-1.952-7.071.001s-1.951 5.119.002 7.071l12.677 12.674h-17.923c-2.761 0-5 2.238-5 5s2.239 5 5 5h17.923l-12.677 12.674c-1.953 1.952-1.954 5.118-.002 7.071.977.977 2.256 1.465 3.536 1.465 1.279 0 2.559-.488 3.535-1.464l12.685-12.682v17.936c0 2.762 2.239 5 5 5 2.762 0 5-2.238 5-5v-17.926l12.675 12.671c.977.977 2.256 1.465 3.535 1.465 1.28 0 2.56-.488 3.536-1.465 1.952-1.952 1.952-5.118 0-7.07l-12.678-12.675h17.932c2.762 0 5-2.238 5-5s-2.238-5-5-5z" fill="#bce4ff"></path></g><g><path d="m294.456 392.5h-17.932l12.678-12.675c1.952-1.952 1.952-5.118 0-7.07-1.953-1.953-5.118-1.953-7.071 0l-12.675 12.671v-17.926c0-2.762-2.238-5-5-5-2.761 0-5 2.238-5 5v17.936l-12.685-12.682c-1.953-1.951-5.119-1.952-7.071.001s-1.951 5.119.002 7.071l12.677 12.674h-17.923c-2.761 0-5 2.238-5 5s2.239 5 5 5h17.923l-12.677 12.674c-1.953 1.952-1.954 5.118-.002 7.071.977.977 2.256 1.465 3.536 1.465 1.279 0 2.559-.488 3.535-1.464l12.685-12.682v17.936c0 2.762 2.239 5 5 5 2.762 0 5-2.238 5-5v-17.926l12.675 12.671c.977.977 2.256 1.465 3.535 1.465 1.28 0 2.56-.488 3.536-1.465 1.952-1.952 1.952-5.118 0-7.07l-12.678-12.675h17.932c2.762 0 5-2.238 5-5s-2.238-5-5-5z" fill="#bce4ff"></path></g><g><path d="m374.456 392.5h-17.929l12.675-12.675c1.952-1.952 1.952-5.118 0-7.07-1.953-1.953-5.118-1.953-7.071 0l-12.675 12.675v-17.93c0-2.762-2.238-5-5-5-2.761 0-5 2.238-5 5v17.93l-12.674-12.675c-1.953-1.953-5.118-1.953-7.071 0-1.953 1.952-1.953 5.118 0 7.07l12.675 12.675h-17.93c-2.761 0-5 2.238-5 5s2.239 5 5 5h17.93l-12.675 12.675c-1.953 1.952-1.953 5.118 0 7.07.977.977 2.256 1.465 3.535 1.465 1.28 0 2.56-.488 3.536-1.465l12.674-12.675v17.93c0 2.762 2.239 5 5 5 2.762 0 5-2.238 5-5v-17.93l12.675 12.675c.977.977 2.256 1.465 3.535 1.465 1.28 0 2.56-.488 3.536-1.465 1.952-1.952 1.952-5.118 0-7.07l-12.675-12.675h17.929c2.762 0 5-2.238 5-5s-2.238-5-5-5z" fill="#bce4ff"></path></g></g></g></g></g></g></svg>
                                    </div>
                                    <h3 className="text-xl mt-8 font-bold">
                                        {props.lang == 'ar' ? 'مرحبا بك في تمكين للأجهزة المنزلية' : 'Welcome to Tamkeen Stores'}
                                    </h3>
                                    <p className="text-xs font-regular mt-1.5">
                                        {props.lang == 'ar' ? '5x ادخل رقم هاتفك لمتابعة طلبك . الهاتف يجب ان يبدأ ب' : 'This is English'}
                                    </p>
                                </div>

                                {/* Login */}
                                <div className="bg-white px-3 w-full py-5" dir='ltr'>
                                    <div className={` ${otpbox == false && register == false ? 'flex items-center justify-center' : 'hidden'}`}>
                                        <div>
                                            <div className="flex items-center rounded-md border py-1 px-3 w-80 text-md font-medium focus-visible:outline-none focus-visible:border-[#20831E] gap-x-3">
                                                <svg id="fi_14063267" enableBackground="new 0 0 64 64" height="32" viewBox="0 0 64 64" width="32" xmlns="http://www.w3.org/2000/svg"><g><g><path d="m63 47.2c0 3.4-2.7 6.1-6 6.1h-50c-3.3 0-6-2.7-6-6.1v-30.4c0-3.4 2.7-6.1 6-6.1h50c3.3 0 6 2.7 6 6.1z" fill="#096"></path><path d="m7 10.7h50c3.3 0 6 2.7 6 6.1v30.4c0 3.4-2.7 6.1-6 6.1" fill="#038e5c"></path><g fill="#007a54"><path d="m63 47.2c0 3.4-2.7 6.1-6 6.1h-50c-3.3 0-6-2.7-6-6.1"></path><path d="m7 10.7h50c3.3 0 6 2.7 6 6.1v11.1"></path></g></g><g><g fill="#fff"><path d="m8.6 20.4c.4-.3.4.5 0 1.4.2-.3.6-1 .5-1.5-.1-.7-.5-.6-.8-.2-.2.3-.1.5.3.3z"></path><path d="m8.7 26.1c.5-.9.3-1.6.7-2.9.3-.8.3-.2.3.3-.2 1.3-.1 3.4 1.7 3.3.1 1.2.4 3.3.4 4.1 0 .7.1.5.3.1s.1-.9.1-1.5-.1-1.7-.2-3.2c.2-.2.5-.5.6-.7.2-.5.3-.4.4 0 .2.8 1 1.3 2 .5 1-.7.6-2.1.1-3.6.4.1.5-.2.3-.6-.1-.2-.3-.4-.4-.6-.2-.2-.3-.4-.5-.2s-.3.4-.4.5-.1.3 0 .6c.4.9.6 1.9.7 2.4s-.1.6-.5.6c-.3 0-.8-.1-1-.9s-.3-1.1-.2-1.7c0-.5.1-.9-.3-1.4s-.4-.4-.5-.2c-.1.3-.2.7-.1 1.2.2.7.3 1.3.4 1.7.1.3-.2.9-.7 1.2-.1-1-.2-2.2-.3-3.3.6-.2.3-.9-.2-1.7-.3-.6-.5-.4-.7 0s-.1.6.1.9c-.1.3.1.7.2 1.4.1.5.2 1.8.2 2.9-.4 0-.7-.3-.9-.7-.3-.8-.3-1.6-.1-2 .2-.5.3-1.2 0-1.4s-.6 0-.8.4c-.4.6-.8 1.4-.8 2.3 0 .3-.1 1-.3 1.3-.1.3-.4.3-.6-.1-.4-.6-.5-2.2-.5-3 0-.4-.1-.5-.2 0-.4 1.6.1 3.2.4 3.9.5.9 1 .7 1.3.1z"></path><path d="m13.5 20.9c.2-.2.2-.2.3 0s.4.2.5 0 .2-.3.1-.6c-.1-.2-.1-.1-.2.1-.1.4-.5.3-.5-.2s-.1-.2-.3.1c-.2.5-.5.4-.5-.1 0-.3-.1-.6-.3-.2-.1.3 0 .6.1.8.3.3.6.3.8.1z"></path><path d="m10.5 28.4c.3-.1.3-.1.3-.5s-.2-.2-.6-.1c-.6.2-1.8.8-2.7 1.9-.4.5-.1.3.2.1.5-.4 2-1.2 2.8-1.4z"></path><path d="m8.5 34.8c-.3.5-.9-.2-.5-1.5.1-.3.2-.5.2-.7s0-.4 0-.7c0-.2-.2.1-.3.5-.1.6-.5.9-.4 2.8.1 1.1 1.4 1.1 1.5-.3 0-.6-.2-.6-.5-.1z"></path><path d="m17.4 30.6c0-.5-.1-1-.1-1.5.1 0 .1-.1.2-.1.3.9 1.6.7 2 .1.2-.3.2-.3.4 0 .3.4 1.3.6 1.5 0s.2-1.2.1-1.6c-.1-.5-.2-.4-.5-.2s-.1.3 0 .6c.1 1.2-.9 1.1-1-.1-.1-.8-.2-.5-.3-.1-.5 1.5-1.8 1.8-1.6 0 0-.5-.3-.3-.5-.1-.1.1-.3.3-.4.4-.1-1.4-.2-3-.4-5 .4.5.8-.1.5-.6-.2-.4-.5-1.4-.7-1.9s-.3-.4-.7.1c-.4.4-.3.5-.2 1 0 .6 0 1.1.2 2.2.1.8.3 2.5.5 4.6-.2.1-.5.3-.7.4-.1-.4-.4-.6-.8-1-.6-.6-1-.6-1.5.1s-.4.8-.4 1.5c0 .6-.1.8.4 1s.7.1 1 0c.2-.1.5-.2.9-.3.1.3 0 .7-.2.9-1.2 1.4-3 2.5-3.8 1.5-.4-.5-.6-1.3-.5-2.3.1-.8-.1-.4-.2-.2-.3.9-.4 2.3 0 3 .5 1 1.4 1.4 2.8.7 1.4-.6 2.7-1.7 2.7-3.2 0-.3 0-.5 0-.7.2-.1.4-.2.5-.3v1.7c.1 1.6-.6 2.1-1.2 2.6-.8.6-1.9 1.1-2.9 1.2-2.2.3-2.7-1.1-2.7-3 0-.3.1-.5.1-.9 0-.8-.1-.7-.4.1-.2.8-.5 2.6.2 4.1.8 1.5 3.4 1.1 5.4.1 2.2-1.1 2.4-2.9 2.3-4.8zm-2.8-1.5c-.5.2-.7-.1-.6-.4 0-.3.1-.5.5-.3.2.1.4.3.6.6-.3.1-.4.1-.5.1z"></path><path d="m19.7 32.3c.2-.4.3-.8.2-1.3-.1-.3 0-.4-.3-.6-.3-.1-.4.1-.5.3-.1.3.1.7.5.5.1.2 0 .7-.1 1-.1.4 0 .5.2.1z"></path><path d="m20.5 24.2c-.4.5-.7 1.2-.1 1.6.3.2.9-.1 1.1-.5.2-.5.1-.6-.3-.1-.5.6-1.1.1-.5-.8.4-.6.1-.7-.2-.2z"></path><path d="m18.8 24.3c1.4-.6 2.2-1.4 2.6-2.1.4.1.5-.2.3-.5.1-.3.2-.5.3-.7.3-1.3-1-1.4-1.3-.4-.2.5-.2 1 .2 1.3-.6.8-1.4 1.5-2.4 2.1-.4.4-.3.6.3.3zm2.4-3.5c.1-.3.3-.1.3.1 0 .1-.1.3-.2.4-.2-.1-.2-.3-.1-.5z"></path></g><path d="m20.7 20.6c-.2.5-.2 1 .2 1.3-.1.1-.2.3-.3.4l.5.4c.1-.2.3-.3.4-.5.4.1.5-.2.3-.5.1-.3.2-.5.3-.7.2-1.3-1-1.4-1.4-.4zm.8.3c0 .1-.1.3-.2.4-.2-.1-.2-.3-.1-.5.1-.3.3-.1.3.1z" fill="#cfe7e8"></path><path d="m22.2 32.3c-.2.1-.5.4-.7.6 0-.4.1-1 .1-1.2 0-.3-.1-.4-.3-.1-.3.6-.6 1.4-.7 2-1.3.9-2.9 1.8-4 2.3-.5.2-.2.4.2.3 1.5-.5 2.7-.9 3.8-1.4.1.9.4 1.5 1.2 1.7 1.5.4 3-.9 4.7-3.2.4 1.1 1.4 2.6 4 3 1.1.2 1 .1 1.2-.5.1-.5.3-.6-.6-.8-1.1-.4-1.5-1.2-.4-1.7s2.6-.9 3.6-1.1c.7-.1.9-.1 1.1-.7.2-.7.3-.8-.4-.7-.8.1-4.6.2-5.6.1.8-.4 1.9-.8 2.7-1.1.3.2.4.1.3-.1.3-.1.6-.2.9-.4.9-.5 1.3-1.6.3-2.3s-1.8-.9-2.3-.2c-.4.6-.8 1.2-.2 2-.9.3-1.7.6-2.5.9-.6.2-.9.3-1.1 1.1s-.3.8.5.9c1.1 0 2.1 0 2.8.6-1.1.4-1.9 1.2-1.5 2.3-.5-.1-1-.3-1.4-.7-.8-.8-.8-2.2-1.1-3.8s-1-3-1.3-3.6c-.2-.6-.3-.3-.5.1s-.4.6-.2 1.2c.4 1 1 3 1.3 4.2-.6 1.4-2.2 3.1-3.5 3.3-1 .2-1.3-.4-1.2-.9.7-.4 1.3-.9 1.9-1.5 1.2-1.3 1.4-2.3.6-4.4.5.1.4-.3-.3-1.2-.5-.6-.6-.5-.9.1-.2.5-.4.9.2 1.1.1.3.3.7.6 1.2.6 1.3-.4 1.8-1.3 2.6zm9.5-4.4c0-.3.1-.3.6 0s.9.4.2.5c-.2.1-.5.1-.7.2 0-.3 0-.5-.1-.7z" fill="#fff"></path><g fill="#cfe7e8"><path d="m34.9 30.8c-.5 0-2.7.1-4.2.1l2 1.7c.5-.2 1.1-.3 1.5-.4.7-.1.9-.1 1.1-.7.2-.7.3-.8-.4-.7z"></path><path d="m25.1 26.1.2.2c0-.2-.1-.2-.2-.2z"></path><path d="m30.2 30.4c.6-.3 1.3-.5 1.8-.7.3.2.4.1.3-.1.3-.1.6-.2.9-.4.9-.5 1.3-1.6.3-2.3s-1.8-.9-2.3-.2c-.4.6-.8 1.2-.2 2-.7.2-1.3.4-1.9.7zm2.2-2.5c.5.3.9.4.2.5-.2.1-.5.1-.7.2-.1-.3-.1-.5-.1-.6-.1-.4.1-.4.6-.1z"></path></g><path d="m34 36c.3-.1.8-.4 1.2-.7.4-.4.1-.3-.2-.2s-.6.3-1 .4c-.4.2-.5 0-.3-.7.2-.6 0-.6-.3-.5s-.4.3-.7.5c-.2.1-.2.3.3.1.4-.2.3 0 .2.5-.2.5.1.8.8.6z" fill="#fff"></path><g fill="#cfe7e8"><path d="m24.7 25.1c.3-.7.5-1.4.7-1.9s.4-.4.3.1c-.1.9-.1 2.3.8 2.9.9.5 2.3-.4 2.8-1.4 1.5 1.9 2.8 1 2.9-.8 0-.6-.2-1.8-.4-2.2s0-.4.2-.2.6.4.4-.3c-.2-.6-.5-1-.8-1.3s-.4-.1-.5.1-.1.3-.3.5-.1.3 0 .6c.6 1.4 1.1 3.5.2 3.7-.8.2-1.3-1.6-1.3-2.4 0-1-.2-1.9-.4-2.5s-.3-.6-.5-.3c-.1.2-.1.4-.3.6-.1.2 0 .3.1.7.5 2.3.4 3.3-.6 3.9s-1.6 0-1.6-.7 0-1.6.1-2.2.2-.8 0-1.1-.4-.2-.7.2c-.6.9-1.3 2.4-1.5 3.1s-.7.5-1-.1c-.4-.7-.3-2-.2-2.6.1-.5.1-.7-.2-.2-.5 1.4-.5 2.8.6 4 .5.9.9.5 1.2-.2z"></path><path d="m27.5 22.4c0 .3 0 .7.2.1.1-.6.1-1.4-.1-1.9s-.3-.6-.5-.4-.2.3 0 .5c.2.3.5 1 .4 1.7z"></path><path d="m29.6 27.1c0 .8-.2.8-.5 0-.1-.3-.2-.3-.3.1 0 .7-.3.8-.5.1-.1-.3-.1-.6-.2-.1-.1.4 0 .7.2 1 .2.2.5.2.6-.1s.2-.3.4-.1 1 0 .6-1.1c-.2-.4-.3-.3-.3.2z"></path><path d="m37.7 20.8c.3.2.6.7.5 1.3-.1.5 0 .8.3.1s.1-1.5-.2-2-.4-.3-.6-.1c-.2.3-.3.6 0 .7z"></path><path d="m32.6 21.1c0 .3.1.5.5.6.8 1.1 1.7 2.3 2.5 3.4.1 1 .3 2 .4 2.9.2 2 .6 4.7.3 5.9-.2.9 0 1.2.4-.1s.4-2.6.1-4.5c-.1-.8-.1-1.7-.2-2.7 1.3 2.1 2.6 4.1 3.1 5.5.3.8.6.9.3-.1-.3-1.4-1.6-3.8-3.6-6.8-.1-.8-.1-1.6-.1-2.2.3.3.5.1.4-.3-.2-.8-.5-1.4-.8-2.2-.1-.4-.5-.4-.7.1-.2.6-.2.7 0 1.1 0 .5.1 1.2.2 1.9-.3-.5-.8-1.2-1.2-1.7.5.2.9.1.4-.5-.5-.5-1.2-1.1-1.6-1.5s-.6-.1-.6.2c.2.5.3.7.2 1z"></path><path d="m38.3 23.9c-.1.5-.3.3-.4-.1-.1-.2-.2-.1-.2.3.1.4.2.7.5.4.2-.2.2-.2.5 0 .2.2.4 0 .5-.1 0-.1.1-.3 0-.8s-.2-.2-.3.2-.3.5-.4 0c0-.4-.2-.3-.2.1z"></path><path d="m40.6 30.4c.1 1.8.3 2.6-.8 3.9-1.2 1.3-2 1.7-2.5 1.8-.7.2-.9.5.1.4 1.5-.1 1.7-.1 3-1.6.7-.8 1-1.8 1-4.2-.1-4.2-.6-6-.6-8.3.2.2.5.2.4-.2-.2-.5-.3-1.1-.4-1.6-.2-.5-.3-.7-.5-.4s-.4.4-.5.6-.2.5 0 .8c.6 4.9.7 7 .8 8.8z"></path><path d="m43.2 30.9c.1 1 .3 1.7 0 2.9-.1.3.1.5.3 0 .9-1.7.3-3.2.2-4.2-.1-1.5-.7-5.4-.8-7l.1.1c.4.2.9.4.6-.2-.3-.5-.6-1.4-.8-2s-.3-.6-.6-.1c-.6.8-.2 1.6 0 2.6.4 3.4.9 6.9 1 7.9z"></path><path d="m45.3 25.3c.3.3.5.9.7 1.2.2.5.4.1.4-.2s-.1-1.2 0-1.5c.2-.5.5.2.6-.1.1-.2-.1-.3-.2-.5-.1-.3-.2-.2-.4-.1-.2.2-.3.4-.3.5v1.1c0 .4-.1.4-.2.2-.1-.3-.4-1-.6-1.2s-.5-.1-.5.2v.5c0 .2.4.2.5-.1z"></path><path d="m45.1 29.2c0 .3.4-.1.7-.3s1.2-.8 1.6-1 .3-.3.2-.7c0-.4-.3-.1-.6.2s-1.2.9-1.5 1.2-.4.4-.4.6z"></path><path d="m43 34.6c-.4-.8-.4-1.6-.4-2.3 0-.6-.1-1.1-.3-.1-.6 2.4-.2 2.9.4 3.4.8.7 1.1.8 1.5.1.8-1.2 1.1-2.2 1.5-2.8.4-.5.4-.1.6.1.5.6.9.8 1.6.9s1.9-.5 1.8-2.7c-.1-1.4-.2-3.2-.3-5.2.7.9 1.2 1.7 1.7 2.4.2 1.3.3 2.5.3 3.4-.1 1.1.2 1.1.4 0 .1-.4.1-1.4 0-2.5.9 1.2 1.4 1.9 1.7 2.5.4.7.6 1.2.5-.1 0-.5-.2-.9-.8-1.8-.6-.8-1.1-1.6-1.6-2.4-.2-1.9-.4-4-.4-5.1.3.2.5 0 .3-.4-.1-.4-.4-1.6-.6-2s-.4-.4-.6.1c-.2.4-.4.6-.3.9.1 1.9.3 3.7.6 5.3-.5-.7-1-1.4-1.4-2 0-.7-.1-1.4-.1-2.1.3.2.4.2.3-.3-.1-.4-.5-1.4-.7-1.8s-.3-.4-.5-.1c-.3.5-.4.9-.1 1.4 0 .5.1.9.1 1.4-.3-.4-.5-.8-.8-1.1.3.1.5-.1.2-.4s-.9-.8-1.2-1.1c-.3-.4-.5-.3-.5 0v.9c0 .3 0 .5.3 1 .7.9 1.5 1.8 2.1 2.7.3 3.2.4 5.3.4 6.6 0 .8-.3 1.2-.7 1.3s-.8-.1-1.2-.7c-.7-1-1-.8-1.5.1s-.9 1.6-1.2 2.2c-.2.6-.7 1.1-1.1.3z"></path><path d="m52.6 23.5c0 .6.2.5.3 0s.1-1.5-.2-2.1c-.3-.7-.4-.4-.5-.2-.2.3-.2.4.1.7.1.3.3 1 .3 1.6z"></path><path d="m55.3 29.7c-.2-4.2-.7-6-.6-7.6.4.3.5.2.3-.3s-.5-1.1-.7-1.7c-.2-.5-.3-.4-.6 0s-.3.7-.2.9c.6 5.1.9 7.8 1 9.4.1 2.2-.4 3.5-2.6 5-.7.5-1.5 1 .2.6 1.6-.5 3.4-1.6 3.2-6.3z"></path><path d="m49.7 34.1c-.3.4.4.6.5.3.2.3 0 .8-.3 1.1-.5.4-.2.5.1.2.3-.2 1.1-1.1.6-1.7-.3-.2-.7-.2-.9.1z"></path></g><path d="m47.5 41.5c-1.3 0-2.5 0-3.8.1v-.4c.4-.5.3-.5 0-1-.1-.2-.2-.4-.5 0s-.3.5.1 1v.4c-9.9.1-20.8 0-30.2-.1 1 1.7 4.4 1.6 7.5 1.6 2.8 0 11.2 0 22.6-.3v.5c-.4.5-.3.5 0 1 .3.4.4.2.5 0 .1-.1.1-.2.1-.2h1.5c0 .2.3.3.4.3s.4-.1.4-.3h1.7c.2.3.4.4.7.4.6 0 .9-.7.8-1.6-.1-1.3-.6-1.5-1.8-1.4zm-1.4 2c0-.2-.3-.3-.4-.3s-.4.1-.4.3h-1.5c0-.1-.1-.2-.3-.4v-.5c1.3 0 2.7-.1 4.1-.1-.1.3-.1.6-.1.9z" fill="#fff"></path><path d="m47.5 41.5c-1.3 0-2.5 0-3.8.1v-.4c.4-.5.3-.5 0-1-.1-.2-.2-.4-.5 0s-.3.5.1 1v.4s0 0-.1 0l1.4 1.2c1 0 2.1-.1 3.1-.1-.1.3-.1.6-.1.9h-1.5c0-.2-.3-.3-.4-.3s-.3.1-.3.2l.7.6v-.1h1.7c.2.3.4.4.7.4.6 0 .9-.7.8-1.6-.1-1.2-.6-1.4-1.8-1.3z" fill="#cfe7e8"></path></g></g></svg>
                                                <div className="h-5 w-[1px] bg-primary opacity-20" />
                                                <MaskedInput
                                                    id="phoneMask"
                                                    type="text"
                                                    placeholder="(966) - __ - ___ - ____"
                                                    className="w-full focus-visible:outline-none"
                                                    mask={['(', '9', '6', '6', ')', '-', /[5]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                                                    onChange={(e: any) => {
                                                        setPhoneNumber(e.target.value)
                                                        checkLoginPhoneNumber(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-center mt-1">{props.lang == 'ar' ? `If you don't have a account please click on` : `If you don't have a account please click on`}{' '}
                                                <button onClick={() => { setRegister(true), setOtpType(register), setOtpBox(false), setSignUp(true), setIsOpen(false) }} className="focus-visible:outline-none font-bold underline">{props.lang == 'ar' ? 'Sign Up' : 'Sign Up'}</button></p>
                                            {loginErrorStatus ?
                                                <p>
                                                    This account hasn't found!
                                                </p>
                                                : null}
                                        </div>
                                    </div>

                                    {/* OTP */}
                                    <div className={` ${otpbox == true || registerotpbox == true ? '' : 'hidden'}`}>
                                        <div className={` ${resendotpmessage == true ? 'text-center mb-5' : 'hidden'}`}>
                                            <h2 className="text-lg font-bold uppercase">{props.lang == 'ar' ? 'التحقق من هاتفك' : 'Verify your phone'}</h2>
                                            <p className="text-sm mt-1">{props.lang == 'ar' ? 'تم إرسال OTP إلى' : 'OTP has been sent to'} <br /><span className="text-[#004B7A]">+966{phoneNumber}</span> <br /> {props.lang == 'ar' ? 'عبر الرسائل القصيرة' : 'via SMS'}</p>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <form>
                                                <div className='flex items-center gap-2'>
                                                    {otp.map((digit, index) => (
                                                        <input
                                                            key={index}
                                                            value={digit}
                                                            maxLength={1}
                                                            onChange={(e: any) => handleChange(e.target.value, index)}
                                                            onKeyUp={(e: any) => handleBackspaceAndEnter(e, index)}
                                                            ref={(reference: any) => (otpBoxReference.current[index] = reference)}
                                                            className={`border border-[#D0D5DD] w-14 h-auto text-primary p-2 rounded-md focus:border-[#f0660c] outline-none focus-visible:outline-none appearance-none text-center  font-semibold text-lg`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className={`text-xs text-[#fb4a4a] mt-4 ${otpError ? 'error-show' : ''}`}>{otpError}</p>
                                                <div className="text-center">
                                                    <button type="button" className="focus-visible:outline-none rounded-md bg-[#fb4a4a] text-white text-sm py-1 px-5" onClick={
                                                        () => {
                                                            if (minutes == 0 && seconds == 0) {
                                                                ResendOtp()
                                                            }
                                                        }
                                                    }>
                                                        {props.lang == 'ar' ? 'إعادة إرسال كلمة المرور' : 'Resend Otp'}
                                                    </button>
                                                    <h4 onClick={
                                                        () => {
                                                            if (minutes == 0 && seconds == 0) {
                                                                ResendOtp()
                                                            }
                                                        }
                                                    }
                                                        className={` font-semibold mt-2 cursor-pointer ${minutes == 0 && seconds == 0 ? 'text-[#D1D1D8]' : 'text-[#B15533]'} underline`}>{props.lang === 'ar' ? `اعادة ارسال رمز التاكيد في ${minutes}:${seconds} ثانية` : `Re-send the confirmation code in ${minutes}:${seconds} seconds`}</h4>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                    {/* Signup */}
                                    <div className={`${register == true ? 'flex items-center justify-center' : 'hidden'}`}>
                                        <div className="w-full">
                                            <div className="flex items-center rounded-md border border-[#dfdfdf] focus-visible:outline-[#004B7A] fill-primary p-2.5 text-sm gap-x-3 w-full mb-3">
                                                <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" id="fi_9308008"><g><path d="m12 12.75c-3.17 0-5.75-2.58-5.75-5.75s2.58-5.75 5.75-5.75 5.75 2.58 5.75 5.75-2.58 5.75-5.75 5.75zm0-10c-2.34 0-4.25 1.91-4.25 4.25s1.91 4.25 4.25 4.25 4.25-1.91 4.25-4.25-1.91-4.25-4.25-4.25z"></path><path d="m20.5901 22.75c-.41 0-.75-.34-.75-.75 0-3.45-3.5199-6.25-7.8399-6.25-4.32005 0-7.84004 2.8-7.84004 6.25 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-4.27 4.18999-7.75 9.34004-7.75 5.15 0 9.3399 3.48 9.3399 7.75 0 .41-.34.75-.75.75z"></path></g></svg>
                                                <div className="h-5 w-[1px] bg-primary opacity-20" />
                                                <input id="iconLeft" type="text" placeholder={props.langlang == 'ar' ? 'First Name' : 'First Name'} className="focus-visible:outline-none w-full font-regular"
                                                    value={firstName}
                                                    onChange={(e: any) => {
                                                        setFirstName(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center rounded-md border border-[#dfdfdf] focus-visible:outline-[#004B7A] fill-primary p-2.5 text-sm gap-x-3 w-full mb-3">
                                                <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" id="fi_9308008"><g><path d="m12 12.75c-3.17 0-5.75-2.58-5.75-5.75s2.58-5.75 5.75-5.75 5.75 2.58 5.75 5.75-2.58 5.75-5.75 5.75zm0-10c-2.34 0-4.25 1.91-4.25 4.25s1.91 4.25 4.25 4.25 4.25-1.91 4.25-4.25-1.91-4.25-4.25-4.25z"></path><path d="m20.5901 22.75c-.41 0-.75-.34-.75-.75 0-3.45-3.5199-6.25-7.8399-6.25-4.32005 0-7.84004 2.8-7.84004 6.25 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-4.27 4.18999-7.75 9.34004-7.75 5.15 0 9.3399 3.48 9.3399 7.75 0 .41-.34.75-.75.75z"></path></g></svg>
                                                <div className="h-5 w-[1px] bg-primary opacity-20" />
                                                <input id="iconLeft" type="text" placeholder={props.lang == 'ar' ? 'Last Name' : 'Last Name'} className="focus-visible:outline-none w-full font-regular"
                                                    value={lastName}
                                                    onChange={(e: any) => {
                                                        setLastName(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center rounded-md border border-[#dfdfdf] focus-visible:outline-[#004B7A] py-1 px-3 text-sm gap-x-3 w-full mb-3">
                                                <svg id="fi_14063267" enableBackground="new 0 0 64 64" height="32" viewBox="0 0 64 64" width="32" xmlns="http://www.w3.org/2000/svg"><g><g><path d="m63 47.2c0 3.4-2.7 6.1-6 6.1h-50c-3.3 0-6-2.7-6-6.1v-30.4c0-3.4 2.7-6.1 6-6.1h50c3.3 0 6 2.7 6 6.1z" fill="#096"></path><path d="m7 10.7h50c3.3 0 6 2.7 6 6.1v30.4c0 3.4-2.7 6.1-6 6.1" fill="#038e5c"></path><g fill="#007a54"><path d="m63 47.2c0 3.4-2.7 6.1-6 6.1h-50c-3.3 0-6-2.7-6-6.1"></path><path d="m7 10.7h50c3.3 0 6 2.7 6 6.1v11.1"></path></g></g><g><g fill="#fff"><path d="m8.6 20.4c.4-.3.4.5 0 1.4.2-.3.6-1 .5-1.5-.1-.7-.5-.6-.8-.2-.2.3-.1.5.3.3z"></path><path d="m8.7 26.1c.5-.9.3-1.6.7-2.9.3-.8.3-.2.3.3-.2 1.3-.1 3.4 1.7 3.3.1 1.2.4 3.3.4 4.1 0 .7.1.5.3.1s.1-.9.1-1.5-.1-1.7-.2-3.2c.2-.2.5-.5.6-.7.2-.5.3-.4.4 0 .2.8 1 1.3 2 .5 1-.7.6-2.1.1-3.6.4.1.5-.2.3-.6-.1-.2-.3-.4-.4-.6-.2-.2-.3-.4-.5-.2s-.3.4-.4.5-.1.3 0 .6c.4.9.6 1.9.7 2.4s-.1.6-.5.6c-.3 0-.8-.1-1-.9s-.3-1.1-.2-1.7c0-.5.1-.9-.3-1.4s-.4-.4-.5-.2c-.1.3-.2.7-.1 1.2.2.7.3 1.3.4 1.7.1.3-.2.9-.7 1.2-.1-1-.2-2.2-.3-3.3.6-.2.3-.9-.2-1.7-.3-.6-.5-.4-.7 0s-.1.6.1.9c-.1.3.1.7.2 1.4.1.5.2 1.8.2 2.9-.4 0-.7-.3-.9-.7-.3-.8-.3-1.6-.1-2 .2-.5.3-1.2 0-1.4s-.6 0-.8.4c-.4.6-.8 1.4-.8 2.3 0 .3-.1 1-.3 1.3-.1.3-.4.3-.6-.1-.4-.6-.5-2.2-.5-3 0-.4-.1-.5-.2 0-.4 1.6.1 3.2.4 3.9.5.9 1 .7 1.3.1z"></path><path d="m13.5 20.9c.2-.2.2-.2.3 0s.4.2.5 0 .2-.3.1-.6c-.1-.2-.1-.1-.2.1-.1.4-.5.3-.5-.2s-.1-.2-.3.1c-.2.5-.5.4-.5-.1 0-.3-.1-.6-.3-.2-.1.3 0 .6.1.8.3.3.6.3.8.1z"></path><path d="m10.5 28.4c.3-.1.3-.1.3-.5s-.2-.2-.6-.1c-.6.2-1.8.8-2.7 1.9-.4.5-.1.3.2.1.5-.4 2-1.2 2.8-1.4z"></path><path d="m8.5 34.8c-.3.5-.9-.2-.5-1.5.1-.3.2-.5.2-.7s0-.4 0-.7c0-.2-.2.1-.3.5-.1.6-.5.9-.4 2.8.1 1.1 1.4 1.1 1.5-.3 0-.6-.2-.6-.5-.1z"></path><path d="m17.4 30.6c0-.5-.1-1-.1-1.5.1 0 .1-.1.2-.1.3.9 1.6.7 2 .1.2-.3.2-.3.4 0 .3.4 1.3.6 1.5 0s.2-1.2.1-1.6c-.1-.5-.2-.4-.5-.2s-.1.3 0 .6c.1 1.2-.9 1.1-1-.1-.1-.8-.2-.5-.3-.1-.5 1.5-1.8 1.8-1.6 0 0-.5-.3-.3-.5-.1-.1.1-.3.3-.4.4-.1-1.4-.2-3-.4-5 .4.5.8-.1.5-.6-.2-.4-.5-1.4-.7-1.9s-.3-.4-.7.1c-.4.4-.3.5-.2 1 0 .6 0 1.1.2 2.2.1.8.3 2.5.5 4.6-.2.1-.5.3-.7.4-.1-.4-.4-.6-.8-1-.6-.6-1-.6-1.5.1s-.4.8-.4 1.5c0 .6-.1.8.4 1s.7.1 1 0c.2-.1.5-.2.9-.3.1.3 0 .7-.2.9-1.2 1.4-3 2.5-3.8 1.5-.4-.5-.6-1.3-.5-2.3.1-.8-.1-.4-.2-.2-.3.9-.4 2.3 0 3 .5 1 1.4 1.4 2.8.7 1.4-.6 2.7-1.7 2.7-3.2 0-.3 0-.5 0-.7.2-.1.4-.2.5-.3v1.7c.1 1.6-.6 2.1-1.2 2.6-.8.6-1.9 1.1-2.9 1.2-2.2.3-2.7-1.1-2.7-3 0-.3.1-.5.1-.9 0-.8-.1-.7-.4.1-.2.8-.5 2.6.2 4.1.8 1.5 3.4 1.1 5.4.1 2.2-1.1 2.4-2.9 2.3-4.8zm-2.8-1.5c-.5.2-.7-.1-.6-.4 0-.3.1-.5.5-.3.2.1.4.3.6.6-.3.1-.4.1-.5.1z"></path><path d="m19.7 32.3c.2-.4.3-.8.2-1.3-.1-.3 0-.4-.3-.6-.3-.1-.4.1-.5.3-.1.3.1.7.5.5.1.2 0 .7-.1 1-.1.4 0 .5.2.1z"></path><path d="m20.5 24.2c-.4.5-.7 1.2-.1 1.6.3.2.9-.1 1.1-.5.2-.5.1-.6-.3-.1-.5.6-1.1.1-.5-.8.4-.6.1-.7-.2-.2z"></path><path d="m18.8 24.3c1.4-.6 2.2-1.4 2.6-2.1.4.1.5-.2.3-.5.1-.3.2-.5.3-.7.3-1.3-1-1.4-1.3-.4-.2.5-.2 1 .2 1.3-.6.8-1.4 1.5-2.4 2.1-.4.4-.3.6.3.3zm2.4-3.5c.1-.3.3-.1.3.1 0 .1-.1.3-.2.4-.2-.1-.2-.3-.1-.5z"></path></g><path d="m20.7 20.6c-.2.5-.2 1 .2 1.3-.1.1-.2.3-.3.4l.5.4c.1-.2.3-.3.4-.5.4.1.5-.2.3-.5.1-.3.2-.5.3-.7.2-1.3-1-1.4-1.4-.4zm.8.3c0 .1-.1.3-.2.4-.2-.1-.2-.3-.1-.5.1-.3.3-.1.3.1z" fill="#cfe7e8"></path><path d="m22.2 32.3c-.2.1-.5.4-.7.6 0-.4.1-1 .1-1.2 0-.3-.1-.4-.3-.1-.3.6-.6 1.4-.7 2-1.3.9-2.9 1.8-4 2.3-.5.2-.2.4.2.3 1.5-.5 2.7-.9 3.8-1.4.1.9.4 1.5 1.2 1.7 1.5.4 3-.9 4.7-3.2.4 1.1 1.4 2.6 4 3 1.1.2 1 .1 1.2-.5.1-.5.3-.6-.6-.8-1.1-.4-1.5-1.2-.4-1.7s2.6-.9 3.6-1.1c.7-.1.9-.1 1.1-.7.2-.7.3-.8-.4-.7-.8.1-4.6.2-5.6.1.8-.4 1.9-.8 2.7-1.1.3.2.4.1.3-.1.3-.1.6-.2.9-.4.9-.5 1.3-1.6.3-2.3s-1.8-.9-2.3-.2c-.4.6-.8 1.2-.2 2-.9.3-1.7.6-2.5.9-.6.2-.9.3-1.1 1.1s-.3.8.5.9c1.1 0 2.1 0 2.8.6-1.1.4-1.9 1.2-1.5 2.3-.5-.1-1-.3-1.4-.7-.8-.8-.8-2.2-1.1-3.8s-1-3-1.3-3.6c-.2-.6-.3-.3-.5.1s-.4.6-.2 1.2c.4 1 1 3 1.3 4.2-.6 1.4-2.2 3.1-3.5 3.3-1 .2-1.3-.4-1.2-.9.7-.4 1.3-.9 1.9-1.5 1.2-1.3 1.4-2.3.6-4.4.5.1.4-.3-.3-1.2-.5-.6-.6-.5-.9.1-.2.5-.4.9.2 1.1.1.3.3.7.6 1.2.6 1.3-.4 1.8-1.3 2.6zm9.5-4.4c0-.3.1-.3.6 0s.9.4.2.5c-.2.1-.5.1-.7.2 0-.3 0-.5-.1-.7z" fill="#fff"></path><g fill="#cfe7e8"><path d="m34.9 30.8c-.5 0-2.7.1-4.2.1l2 1.7c.5-.2 1.1-.3 1.5-.4.7-.1.9-.1 1.1-.7.2-.7.3-.8-.4-.7z"></path><path d="m25.1 26.1.2.2c0-.2-.1-.2-.2-.2z"></path><path d="m30.2 30.4c.6-.3 1.3-.5 1.8-.7.3.2.4.1.3-.1.3-.1.6-.2.9-.4.9-.5 1.3-1.6.3-2.3s-1.8-.9-2.3-.2c-.4.6-.8 1.2-.2 2-.7.2-1.3.4-1.9.7zm2.2-2.5c.5.3.9.4.2.5-.2.1-.5.1-.7.2-.1-.3-.1-.5-.1-.6-.1-.4.1-.4.6-.1z"></path></g><path d="m34 36c.3-.1.8-.4 1.2-.7.4-.4.1-.3-.2-.2s-.6.3-1 .4c-.4.2-.5 0-.3-.7.2-.6 0-.6-.3-.5s-.4.3-.7.5c-.2.1-.2.3.3.1.4-.2.3 0 .2.5-.2.5.1.8.8.6z" fill="#fff"></path><g fill="#cfe7e8"><path d="m24.7 25.1c.3-.7.5-1.4.7-1.9s.4-.4.3.1c-.1.9-.1 2.3.8 2.9.9.5 2.3-.4 2.8-1.4 1.5 1.9 2.8 1 2.9-.8 0-.6-.2-1.8-.4-2.2s0-.4.2-.2.6.4.4-.3c-.2-.6-.5-1-.8-1.3s-.4-.1-.5.1-.1.3-.3.5-.1.3 0 .6c.6 1.4 1.1 3.5.2 3.7-.8.2-1.3-1.6-1.3-2.4 0-1-.2-1.9-.4-2.5s-.3-.6-.5-.3c-.1.2-.1.4-.3.6-.1.2 0 .3.1.7.5 2.3.4 3.3-.6 3.9s-1.6 0-1.6-.7 0-1.6.1-2.2.2-.8 0-1.1-.4-.2-.7.2c-.6.9-1.3 2.4-1.5 3.1s-.7.5-1-.1c-.4-.7-.3-2-.2-2.6.1-.5.1-.7-.2-.2-.5 1.4-.5 2.8.6 4 .5.9.9.5 1.2-.2z"></path><path d="m27.5 22.4c0 .3 0 .7.2.1.1-.6.1-1.4-.1-1.9s-.3-.6-.5-.4-.2.3 0 .5c.2.3.5 1 .4 1.7z"></path><path d="m29.6 27.1c0 .8-.2.8-.5 0-.1-.3-.2-.3-.3.1 0 .7-.3.8-.5.1-.1-.3-.1-.6-.2-.1-.1.4 0 .7.2 1 .2.2.5.2.6-.1s.2-.3.4-.1 1 0 .6-1.1c-.2-.4-.3-.3-.3.2z"></path><path d="m37.7 20.8c.3.2.6.7.5 1.3-.1.5 0 .8.3.1s.1-1.5-.2-2-.4-.3-.6-.1c-.2.3-.3.6 0 .7z"></path><path d="m32.6 21.1c0 .3.1.5.5.6.8 1.1 1.7 2.3 2.5 3.4.1 1 .3 2 .4 2.9.2 2 .6 4.7.3 5.9-.2.9 0 1.2.4-.1s.4-2.6.1-4.5c-.1-.8-.1-1.7-.2-2.7 1.3 2.1 2.6 4.1 3.1 5.5.3.8.6.9.3-.1-.3-1.4-1.6-3.8-3.6-6.8-.1-.8-.1-1.6-.1-2.2.3.3.5.1.4-.3-.2-.8-.5-1.4-.8-2.2-.1-.4-.5-.4-.7.1-.2.6-.2.7 0 1.1 0 .5.1 1.2.2 1.9-.3-.5-.8-1.2-1.2-1.7.5.2.9.1.4-.5-.5-.5-1.2-1.1-1.6-1.5s-.6-.1-.6.2c.2.5.3.7.2 1z"></path><path d="m38.3 23.9c-.1.5-.3.3-.4-.1-.1-.2-.2-.1-.2.3.1.4.2.7.5.4.2-.2.2-.2.5 0 .2.2.4 0 .5-.1 0-.1.1-.3 0-.8s-.2-.2-.3.2-.3.5-.4 0c0-.4-.2-.3-.2.1z"></path><path d="m40.6 30.4c.1 1.8.3 2.6-.8 3.9-1.2 1.3-2 1.7-2.5 1.8-.7.2-.9.5.1.4 1.5-.1 1.7-.1 3-1.6.7-.8 1-1.8 1-4.2-.1-4.2-.6-6-.6-8.3.2.2.5.2.4-.2-.2-.5-.3-1.1-.4-1.6-.2-.5-.3-.7-.5-.4s-.4.4-.5.6-.2.5 0 .8c.6 4.9.7 7 .8 8.8z"></path><path d="m43.2 30.9c.1 1 .3 1.7 0 2.9-.1.3.1.5.3 0 .9-1.7.3-3.2.2-4.2-.1-1.5-.7-5.4-.8-7l.1.1c.4.2.9.4.6-.2-.3-.5-.6-1.4-.8-2s-.3-.6-.6-.1c-.6.8-.2 1.6 0 2.6.4 3.4.9 6.9 1 7.9z"></path><path d="m45.3 25.3c.3.3.5.9.7 1.2.2.5.4.1.4-.2s-.1-1.2 0-1.5c.2-.5.5.2.6-.1.1-.2-.1-.3-.2-.5-.1-.3-.2-.2-.4-.1-.2.2-.3.4-.3.5v1.1c0 .4-.1.4-.2.2-.1-.3-.4-1-.6-1.2s-.5-.1-.5.2v.5c0 .2.4.2.5-.1z"></path><path d="m45.1 29.2c0 .3.4-.1.7-.3s1.2-.8 1.6-1 .3-.3.2-.7c0-.4-.3-.1-.6.2s-1.2.9-1.5 1.2-.4.4-.4.6z"></path><path d="m43 34.6c-.4-.8-.4-1.6-.4-2.3 0-.6-.1-1.1-.3-.1-.6 2.4-.2 2.9.4 3.4.8.7 1.1.8 1.5.1.8-1.2 1.1-2.2 1.5-2.8.4-.5.4-.1.6.1.5.6.9.8 1.6.9s1.9-.5 1.8-2.7c-.1-1.4-.2-3.2-.3-5.2.7.9 1.2 1.7 1.7 2.4.2 1.3.3 2.5.3 3.4-.1 1.1.2 1.1.4 0 .1-.4.1-1.4 0-2.5.9 1.2 1.4 1.9 1.7 2.5.4.7.6 1.2.5-.1 0-.5-.2-.9-.8-1.8-.6-.8-1.1-1.6-1.6-2.4-.2-1.9-.4-4-.4-5.1.3.2.5 0 .3-.4-.1-.4-.4-1.6-.6-2s-.4-.4-.6.1c-.2.4-.4.6-.3.9.1 1.9.3 3.7.6 5.3-.5-.7-1-1.4-1.4-2 0-.7-.1-1.4-.1-2.1.3.2.4.2.3-.3-.1-.4-.5-1.4-.7-1.8s-.3-.4-.5-.1c-.3.5-.4.9-.1 1.4 0 .5.1.9.1 1.4-.3-.4-.5-.8-.8-1.1.3.1.5-.1.2-.4s-.9-.8-1.2-1.1c-.3-.4-.5-.3-.5 0v.9c0 .3 0 .5.3 1 .7.9 1.5 1.8 2.1 2.7.3 3.2.4 5.3.4 6.6 0 .8-.3 1.2-.7 1.3s-.8-.1-1.2-.7c-.7-1-1-.8-1.5.1s-.9 1.6-1.2 2.2c-.2.6-.7 1.1-1.1.3z"></path><path d="m52.6 23.5c0 .6.2.5.3 0s.1-1.5-.2-2.1c-.3-.7-.4-.4-.5-.2-.2.3-.2.4.1.7.1.3.3 1 .3 1.6z"></path><path d="m55.3 29.7c-.2-4.2-.7-6-.6-7.6.4.3.5.2.3-.3s-.5-1.1-.7-1.7c-.2-.5-.3-.4-.6 0s-.3.7-.2.9c.6 5.1.9 7.8 1 9.4.1 2.2-.4 3.5-2.6 5-.7.5-1.5 1 .2.6 1.6-.5 3.4-1.6 3.2-6.3z"></path><path d="m49.7 34.1c-.3.4.4.6.5.3.2.3 0 .8-.3 1.1-.5.4-.2.5.1.2.3-.2 1.1-1.1.6-1.7-.3-.2-.7-.2-.9.1z"></path></g><path d="m47.5 41.5c-1.3 0-2.5 0-3.8.1v-.4c.4-.5.3-.5 0-1-.1-.2-.2-.4-.5 0s-.3.5.1 1v.4c-9.9.1-20.8 0-30.2-.1 1 1.7 4.4 1.6 7.5 1.6 2.8 0 11.2 0 22.6-.3v.5c-.4.5-.3.5 0 1 .3.4.4.2.5 0 .1-.1.1-.2.1-.2h1.5c0 .2.3.3.4.3s.4-.1.4-.3h1.7c.2.3.4.4.7.4.6 0 .9-.7.8-1.6-.1-1.3-.6-1.5-1.8-1.4zm-1.4 2c0-.2-.3-.3-.4-.3s-.4.1-.4.3h-1.5c0-.1-.1-.2-.3-.4v-.5c1.3 0 2.7-.1 4.1-.1-.1.3-.1.6-.1.9z" fill="#fff"></path><path d="m47.5 41.5c-1.3 0-2.5 0-3.8.1v-.4c.4-.5.3-.5 0-1-.1-.2-.2-.4-.5 0s-.3.5.1 1v.4s0 0-.1 0l1.4 1.2c1 0 2.1-.1 3.1-.1-.1.3-.1.6-.1.9h-1.5c0-.2-.3-.3-.4-.3s-.3.1-.3.2l.7.6v-.1h1.7c.2.3.4.4.7.4.6 0 .9-.7.8-1.6-.1-1.2-.6-1.4-1.8-1.3z" fill="#cfe7e8"></path></g></g></svg>
                                                <div className="h-5 w-[1px] bg-primary opacity-20" />
                                                <MaskedInput
                                                    id="phoneMask"
                                                    type="text"
                                                    placeholder="(966) - __ - ___ - ____"
                                                    className="w-full focus-visible:outline-none"
                                                    // value={phoneNumber}
                                                    mask={['(', '9', '6', '6', ')', '-', /[5]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                                                    onChange={(e: any) => {
                                                        checkLoginPhoneNumber(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center rounded-md border border-[#dfdfdf] focus-visible:outline-[#004B7A] fill-primary p-2.5 text-sm gap-x-3 w-full mb-3">
                                                <svg id="fi_11502423" enableBackground="new 0 0 512 512" height="22" viewBox="0 0 512 512" width="22" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="m462.88 337.781c0 43.236-35.17 78.351-78.351 78.351h-257.057c-43.181 0-78.352-35.116-78.352-78.351v-163.562c0-14.43 3.951-27.983 10.809-39.615l125.428 125.428c18.765 18.82 43.894 29.19 70.67 29.19 26.721 0 51.85-10.37 70.615-29.19l125.428-125.428c6.859 11.632 10.809 25.184 10.809 39.615v163.562zm-78.352-241.913h-257.056c-17.832 0-34.293 6.035-47.461 16.076l126.69 126.745c13.114 13.058 30.616 20.301 49.326 20.301 18.655 0 36.158-7.243 49.271-20.301l126.69-126.745c-13.167-10.041-29.627-16.076-47.46-16.076zm0-30.232h-257.056c-59.861 0-108.584 48.723-108.584 108.584v163.562c0 59.916 48.723 108.584 108.584 108.584h257.056c59.861 0 108.584-48.668 108.584-108.584v-163.563c0-59.861-48.723-108.583-108.584-108.583z" fillRule="evenodd"></path></svg>
                                                <div className="h-5 w-[1px] bg-primary opacity-20" />
                                                <input id="iconLeft" type="text" placeholder={props.lang == 'ar' ? 'Email' : 'Email'} className="focus-visible:outline-none w-full font-regular" value={email} onChange={(e: any) => {
                                                    setEmail(e.target.value)
                                                }} />
                                            </div>
                                            <div className="flex items-center rounded-md border border-[#dfdfdf] focus-visible:outline-[#004B7A] fill-[#004B7A] p-2.5 text-sm gap-x-3 w-full mb-3">
                                                <svg id="fi_2983723" enableBackground="new 0 0 512 512" height="20" viewBox="0 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg"><g><path d="m144 249h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m144 313h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m144 377h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m272 249h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m272 313h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m272 377h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m400 249h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m400 313h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m400 377h-32c-8.284 0-15 6.716-15 15s6.716 15 15 15h32c8.284 0 15-6.716 15-15s-6.716-15-15-15z"></path><path d="m467 65h-36v-25c0-8.284-6.716-15-15-15s-15 6.716-15 15v25h-130v-25c0-8.284-6.716-15-15-15s-15 6.716-15 15v25h-130v-25c0-8.284-6.716-15-15-15s-15 6.716-15 15v25h-36c-24.813 0-45 20.187-45 45v332c0 24.813 20.187 45 45 45h422c24.813 0 45-20.187 45-45 0-9.682 0-323.575 0-332 0-24.813-20.187-45-45-45zm-437 45c0-8.271 6.729-15 15-15h36v25c0 8.284 6.716 15 15 15s15-6.716 15-15v-25h130v25c0 8.284 6.716 15 15 15s15-6.716 15-15v-25h130v25c0 8.284 6.716 15 15 15s15-6.716 15-15v-25h36c8.271 0 15 6.729 15 15v59h-452zm437 347h-422c-8.271 0-15-6.729-15-15v-243h452v243c0 8.271-6.729 15-15 15z"></path></g></svg>
                                                <div className="h-5 w-[1px] bg-primary opacity-20" />
                                                <input id="iconLeft" type="date" placeholder={props.lang == 'ar' ? 'Date Of Birth' : 'Date Of Birth'} className="focus-visible:outline-none w-full font-regular"
                                                    value={dateOfBirth} onChange={(e) => {
                                                        setDateOfBirth(e.target.value)
                                                    }} />
                                            </div>
                                            <RadioGroup value={selected} onChange={setSelected}>
                                                <h6 className="text-sm font-bold mb-1 mt-4">Please Select the Gender</h6>
                                                <RadioGroup.Option
                                                    value={1}
                                                    className={({ active, checked }) =>
                                                        `${checked
                                                            ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                                                            : ''
                                                        }   
                                                                    ${checked ? 'bg-[#219EBC] text-white border' : 'bg-[#FFFFFF] border border-[#219EBC80] text-primary'}
                                                                        relative flex cursor-pointer rounded-lg py-2 px-3 shadow-md focus:outline-none border-[#219EBC80] mb-2`
                                                    }
                                                >
                                                    {({ active, checked }) => (
                                                        <>
                                                            <div className="flex items-center justify-between w-full">
                                                                <div className="flex items-center gap-x-2">
                                                                    {checked ?
                                                                        <>
                                                                            <div className="shrink-0 text-white">
                                                                                <CheckIcon className="h-5 w-5" />
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <div className='bg-primary h-5 w-5 border p-2 rounded-full opacity-10 border-primary'></div>
                                                                    }
                                                                    <p className="text-sm">Male</p>
                                                                </div>
                                                                <svg id="fi_4140048" enableBackground="new 0 0 512 512" height="31" viewBox="0 0 512 512" width="31" xmlns="http://www.w3.org/2000/svg"><g><path d="m470.135 386.1c19.654-35.26 30.867-75.869 30.867-119.102 0-135.311-109.691-245.002-245.002-245.002s-245.002 109.691-245.002 245.002c0 43.233 11.213 83.842 30.867 119.102z" fill="#ff4155"></path><path d="m330.102 315.01c.004-.003.007-.007.007-.007-.59-.166-1.191-.318-1.788-.476-.198-.052-.394-.109-.592-.161l-.004.003c-2.013-.529-4.036-1.04-6.084-1.513-10.152-10.152-12.726-29.399-13.189-42.865-5.298 6.171-10.858 11.333-16.171 15.458-10.352 8.039-23.125 12.405-36.281 12.405s-25.93-4.366-36.281-12.405c-5.313-4.125-10.874-9.288-16.172-15.458-.464 13.466-3.037 32.713-13.19 42.865-2.076.479-4.128.999-6.169 1.535 0 0-.002-.002-.004-.003-.189.049-.376.103-.565.153-.604.16-1.212.314-1.814.479 0 0 .008.007.011.01-9.355 2.562-18.383 5.695-27.206 9.394v23.865c16.447 22.481 38.453 36.497 51.049 41.791 5.661 2.379 11.695 3.585 17.936 3.585h17.684l4.325 1.5h20.79l4.325-1.5h17.684c6.24 0 12.274-1.207 17.935-3.585 12.525-5.265 34.355-19.151 50.772-41.411v-24.359c-8.759-3.656-17.722-6.759-27.008-9.3z" fill="#ffaa7b"></path><path d="m219.719 285.451c-5.313-4.126-10.874-9.288-16.172-15.459-.464 13.466-3.037 32.713-13.189 42.865-2.077.479-4.128.999-6.169 1.536 0 0-.002-.002-.004-.003-.189.05-.376.103-.565.154-.604.16-1.212.314-1.814.479 0 0 .008.007.012.01-3.651 1-7.239 2.113-10.798 3.287 9.912 23.667 30.718 64.424 52.73 53.135 30.549-15.667 32.25-73.6 32.25-73.6-13.156 0-25.93-4.366-36.281-12.404z" fill="#fc9460"></path><path d="m343.885 363.085c-13.616 12.583-28.181 20.062-37.546 23.998-5.661 2.379-11.695 3.585-17.935 3.585h-17.684l-4.325 1.5c-7.442 0-13.348 0-20.79 0l-4.325-1.5h-17.684c-6.24 0-12.274-1.207-17.936-3.585-2.013-.846-4.277-1.867-6.71-3.056v74.424s-19.073 18.838-5.026 45.6c19.827 5.178 40.626 7.949 62.076 7.949 59.505 0 114.05-21.22 156.496-56.498 0-1.223 0-2.436 0-3.622 0-37.255-44.651-72.541-68.611-88.795z" fill="#ffc839"></path><path d="m200.95 458.451v-73.466c-9.133-4.277-21.278-11.238-32.767-21.838-23.911 16.212-68.583 51.48-68.583 88.719v3.718c27.721 23.016 60.599 40.034 96.643 49.07-14.655-27.081 4.707-46.203 4.707-46.203z" fill="#ffb332"></path><path d="m470.135 386.1c-.214-.413-.423-.832-.639-1.24-8.001-15.05-21.438-26.485-37.47-32.275l-67.829-24.496c1.249 2.519 2.099 6.246-.318 10.351-6.323 10.743-14.078 19.469-22.049 26.497 22.402 14.931 67.781 49.715 67.781 86.497v6.417c24.495-19.74 45.109-44.095 60.524-71.751z" fill="#ffdd40"></path><path d="m148.12 338.441c-2.417-4.105-1.566-7.832-.318-10.351l-67.829 24.496c-16.031 5.79-29.468 17.225-37.469 32.275-.217.408-.426.827-.639 1.24 15.415 27.655 36.028 52.011 60.524 71.751 0-2.193 0-4.339 0-6.417 0-36.782 45.378-71.565 67.78-86.497-7.971-7.028-15.725-15.754-22.049-26.497z" fill="#ffc839"></path><path d="m371.142 293.231c-7.411-17.292-31.448-27.399-63.093-37.994l-2.171 17.329s19.971 78.808-39.483 119.602h28.918c8.1 0 16.111-1.703 23.49-5.046 9.276-4.204 22.284-11.037 33.878-20.512 21.67-17.71 29.486-47.655 18.461-73.379z" fill="#fee77f"></path><path d="m208.384 341.28c-11.013-2.834-39.25-6.531-46.772 27.154 10.988 8.532 22.916 14.759 31.585 18.688 7.378 3.344 15.389 5.046 23.489 5.046h28.918c-20.47-14.046-31.523-32.598-37.22-50.888z" fill="#fee77f"></path><path d="m206.122 272.566-2.171-17.329c-31.645 10.595-55.682 20.701-63.093 37.994-11.025 25.724-3.209 55.669 18.462 73.378 1.298 1.061 2.615 2.083 3.941 3.077 7.511-40.209 46.221-25.082 46.221-25.082l.001-.007c-12.494-35.964-3.361-72.031-3.361-72.031z" fill="#ffdd40"></path><path d="m200.95 458.451c-4.693 0-8.532-3.839-8.532-8.532v-70.083c0-4.693 3.839-8.532 8.532-8.532 4.693 0 8.532 3.839 8.532 8.532v70.083c0 4.693-3.839 8.532-8.532 8.532z" fill="#deeeff"></path><path d="m310.772 458.451c-4.693 0-8.532-3.839-8.532-8.532v-70.083c0-4.693 3.839-8.532 8.532-8.532 4.693 0 8.532 3.839 8.532 8.532v70.083c0 4.693-3.839 8.532-8.532 8.532z" fill="#deeeff"></path><path d="m411.6 77.746c-17.771 12.145-31.22 30.742-26.537 58.7 12.27 73.253-44.248 110.625 44.083 149.899 31.405 13.964 51.185 30.3 63.502 44.267 5.444-20.286 8.354-41.61 8.354-63.615 0-76.224-34.812-144.316-89.402-189.251z" fill="#ff7186"></path><path d="m100.4 77.746c17.771 12.145 31.22 30.742 26.537 58.7-12.27 73.253 44.248 110.625-44.083 149.899-31.405 13.964-51.185 30.3-63.502 44.267-5.444-20.286-8.354-41.61-8.354-63.615 0-76.224 34.812-144.316 89.402-189.251z" fill="#ff7186"></path><path d="m351.433 158.082c6.504-26.523 11.816-66.265-2.247-99.333-27.193-63.944-101.2-60.002-120.812-57.75-2.059.236-3.092 2.585-1.921 4.294 11.756 17.162-34.301 1.613-59.334 54.123-15.866 33.279-11.879 72.461-6.079 98.667h190.393z" fill="#945230"></path><path d="m254.926 70.454s-7.372-16.954 11.297-30.954c18.644-13.982-9.149-39.103-9.221-39.168-12.505-.792-22.894.008-28.628.667-2.059.237-3.092 2.585-1.921 4.294 11.756 17.162-34.301 1.613-59.334 54.123-15.866 33.28-11.879 72.462-6.079 98.667h43.521l13.824-5.492z" fill="#753616"></path><path d="m355.256 154.721c-4.103-3.76-13.276-1.854-16.81.448.774 4.821.818 9.753.15 14.623l-4.17 30.372c0 2.448-.077 4.85-.219 7.21 10.169 3.067 16.22-6.062 17.071-12.327.366-2.697.965-5.355 1.796-7.949 2.704-8.446 12.462-22.956 2.182-32.377z" fill="#ffaa7b"></path><path d="m156.744 154.721c4.103-3.76 13.276-1.854 16.81.448-.774 4.821-.818 9.753-.149 14.623l4.17 30.372c0 2.448.077 4.85.219 7.21-10.169 3.067-16.22-6.062-17.071-12.327-.366-2.697-.965-5.355-1.796-7.949-2.705-8.446-12.463-22.956-2.183-32.377z" fill="#fc9460"></path><path d="m333.324 138.518c-4.621-7.249-3.09-13.17-3.015-20.103 0 0 3.898-31.917-35.411-43.25-11.38-3.281-27.439-5.243-43.894-4.612-11.451 8.073-18.992 19.919-18.992 36.705 0 7.715 1.663 13.744-3.072 21.566-5.105 8.435-8.076 20.602-6.389 33.542l4.249 32.589c0 46.852 23.748 78.697 43.949 95.217 2.874 2.35 5.941 4.383 9.14 6.131 4.393-1.934 8.559-4.404 12.391-7.38 19.831-15.4 43.144-45.085 43.144-88.758l4.17-30.372c1.645-11.967-1.207-23.331-6.27-31.275z" fill="#ffc7ab"></path><path d="m270.955 288.264c-19.831-16.218-43.145-47.48-43.145-93.475l-4.171-31.993c-1.656-12.702 1.26-24.647 6.272-32.928 4.647-7.679 3.015-13.597 3.015-21.172 0-18.073 8.888-30.329 21.999-38.243-34.936.483-73.235 12.325-73.235 47.962 0 7.192 1.633 12.812-3.015 20.104-5.012 7.863-7.928 19.205-6.272 31.267l4.171 30.379c0 43.674 23.313 73.359 43.145 88.758 10.351 8.038 23.125 12.404 36.281 12.404 9.051 0 17.92-2.066 25.944-5.973-3.878-1.926-7.568-4.292-10.989-7.09z" fill="#ffaa7b"></path><path d="m312.145 235.343c-2.319-13.828-12.296-27.674-25.616-30.695l-20.359-5.981c-3.539-1.039-7.082.776-8.507 3.858-.26.563-1.047.563-1.308 0-1.426-3.082-4.969-4.897-8.508-3.858l-20.359 5.981c-.505.115-1.003.249-1.498.394h.19c-2.157 5.074-5.885 17.675 4.727 27.302 3.427-1.749 7.093-3.088 10.941-3.938l3.636-.803c5.3-1.17 9.399-6.344 10.902-11.857.172-.633 1.072-.633 1.245 0 1.503 5.513 5.601 10.687 10.902 11.857l3.637.803c10.452 2.307 19.61 8.156 26.088 16.331-1.341 5.962-5.546 15.022-18.578 19.627-8.744 3.089-18.286-2.41-19.406-11.512-.014-.118-.028-.236-.041-.356-.184-1.697-1.605-3.002-3.335-3.002-1.729 0-3.151 1.305-3.335 3.002-.013.12-.027.238-.041.356-.602 4.893-3.648 8.727-7.685 10.764-1.122 4.448-2.611 14.038 2.032 23.35 3.358 6.735 9.253 11.947 17.556 15.56 4.206-.849 8.327-2.249 12.236-4.239 20.375-10.373 47.464-28.395 56.129-74.759.712-3.812 1.074-7.688 1.074-11.567-3.299 8.14-10.155 17.932-22.719 23.382z" fill="#945230"></path><path d="m234.194 298.276c10.52 5.361 22.545 6.573 33.757 3.67-27.398-10.62-21.735-34.541-20.244-39.447-3.756 2.657-8.79 3.562-13.591 1.866-12.031-4.251-17.206-12.302-19.431-18.205 4.566-6.246 10.648-11.249 17.676-14.528-11.553-9.99-6.07-23.528-4.288-27.155l-.585.172c-13.583 3.08-23.696 17.417-25.751 31.513-13.897-5.24-21.131-15.636-24.6-24.2v.004c0 3.873.361 7.744 1.072 11.551 8.649 46.355 35.608 64.375 55.985 74.759z" fill="#753616"></path></g></svg>
                                                            </div>
                                                        </>
                                                    )}
                                                </RadioGroup.Option>
                                                <RadioGroup.Option
                                                    value={2}
                                                    className={({ active, checked }) =>
                                                        `${checked
                                                            ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                                                            : ''
                                                        }   
                                                                    ${checked ? 'bg-[#219EBC] text-white border' : 'bg-[#FFFFFF] border border-[#219EBC80] text-primary'}
                                                                        relative flex cursor-pointer rounded-lg py-2 px-3 shadow-md focus:outline-none border-[#219EBC80] mb-2`
                                                    }
                                                >
                                                    {({ active, checked }) => (
                                                        <>
                                                            <div className="flex items-center justify-between w-full">
                                                                <div className="flex items-center gap-x-2">
                                                                    {checked ?
                                                                        <>
                                                                            <div className="shrink-0 text-white">
                                                                                <CheckIcon className="h-5 w-5" />
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <div className='bg-primary h-5 w-5 border p-2 rounded-full opacity-10 border-primary'></div>
                                                                    }
                                                                    <p className="text-sm">Female</p>
                                                                </div>
                                                                <svg id="fi_6997662" enableBackground="new 0 0 128 128" height="30" viewBox="0 0 128 128" width="30" xmlns="http://www.w3.org/2000/svg"><g><circle id="XMLID_11062_" cx="64" cy="64" fill="#ee4b68" r="64"></circle><path id="XMLID_2717_" d="m128 64c0 23.9-13.1 44.7-32.4 55.7-2.7 1.5-5.5 2.9-8.5 4-.7.3-1.4.5-2.1.8-6.6 2.3-13.6 3.5-21 3.5-1.2 0-2.4 0-3.6-.1-.4 0-.8-.1-1.2-.1-.8 0-1.5-.1-2.2-.2-.1 0-.1 0-.1 0-1.1-.1-2.2-.3-3.2-.4-3.4-.6-6.8-1.4-10-2.5-.9-.3-1.8-.6-2.7-1-.1 0-.2-.1-.3-.1-.7-.3-1.3-.5-2-.8-1.4-.6-2.8-1.3-4.2-2-12.6-6.6-22.8-17.2-28.7-30.2-3.8-8.1-5.8-17.1-5.8-26.6 0-35.3 28.7-64 64-64s64 28.7 64 64z" fill="#ee4b68"></path><g id="XMLID_58_"><path id="XMLID_159_" d="m101.8 91.1c-26.9 21.5-48.8 21.5-75.6 0 9.9-17.5 10.7-36.8 13-57.7 1.1-13.6 10.9-22.1 24.5-22.1h.5c13.7.1 23.4 8.5 24.5 22.1 2.4 20.9 3.2 40.2 13.1 57.7z" fill="#343843"></path><ellipse id="XMLID_158_" cx="43.1" cy="47.3" fill="#f8cfa3" rx="4.2" ry="7.9" transform="matrix(.975 -.222 .222 .975 -9.422 10.766)"></ellipse><path id="XMLID_157_" d="m44.4 53.3c-1 0-2.9-2-3.7-5.5-.8-3.6.1-6.4 1.1-6.6h.1c1 0 2.9 2 3.7 5.5.4 1.8.4 3.6.1 4.9-.3.9-.7 1.6-1.1 1.7-.1 0-.2 0-.2 0z" fill="#f1b97c"></path><ellipse id="XMLID_156_" cx="84.9" cy="47.3" fill="#f8cfa3" rx="7.9" ry="4.2" transform="matrix(.222 -.975 .975 .222 19.938 119.506)"></ellipse><path id="XMLID_155_" d="m83.6 53.3h-.1c-.4-.1-.9-.8-1.1-1.7-.4-1.4-.3-3.1.1-4.9.8-3.6 2.9-5.7 3.9-5.5s1.9 3 1.1 6.6c-1 3.6-2.9 5.5-3.9 5.5z" fill="#f1b97c"></path><path id="XMLID_153_" d="m50.4 77.9 1.4-6.3 2.3-1.2 19.9-.2 4.4 5.9-1.1 1.8z" fill="#e7e7e8"></path><path id="XMLID_105_" d="m108.5 100.4v9.5c-11.5 11.2-27.2 18.1-44.5 18.1s-33-6.9-44.5-18v-9.5c1.2-13.2 9.3-15 13-15.1 2.1-.1 4.1-.3 6.1-.8 15.7-3.9 15.8-13.4 15.8-13.4v-9h19.2v9s.1 9.5 15.8 13.4c2 .5 4 .7 6.1.8 3.7.1 11.8 1.9 13 15z" fill="#f1b97c"></path><path id="XMLID_81_" d="m108.5 100.4v9.5c-11.5 11.2-27.2 18.1-44.5 18.1s-33-6.9-44.5-18v-9.5c1.2-13.2 9.3-15 13-15.1 2.1-.1 4.1-.3 6.1-.8 6.7-1.7 10.6-4.4 12.8-6.9l4 8.4 8.6 20.9 10-22.9 3.4-5.6c2.3 2.3 6.1 4.6 12.1 6.1 2 .5 4 .7 6.1.8 3.6.1 11.7 1.9 12.9 15z" fill="#e9bb06"></path><path id="XMLID_150_" d="m85.2 44.7c0 12.8-9.5 28.2-21.2 28.2s-21.2-15.4-21.2-28.2 9.5-23.1 21.2-23.1 21.2 10.3 21.2 23.1z" fill="#f8cfa3"></path><path id="XMLID_130_" d="m76 80.3c-2.3 14.3-10.9 28.9-11.9 30.6 0 .1-.1.1-.2 0-1-1.7-9.6-16.3-11.9-30.6l1.3-.4 1.9 1.5 1.7 2.5s3.7 10.9 7 18.9c3.4-8 7-18.9 7-18.9l1.7-2.5 1.9-1.5z" fill="#e7e7e8"></path><path id="XMLID_125_" d="m85.2 84.2 1 7.7s-3.4-5.1-7-8.7c-2.3-2.4-6.2-2.2-8.2.5 0 0 0 .1-.1.1 0 0 .5-1.8 3.2-5.1.7-.8 1.1-1.7 1.2-2.6.3-1.9-.3-3.9-1.9-5.1v-1.3c1.5.4 3.4 1.2 5.4 2.9 3.6 3 5.8 7.2 6.4 11.6z" fill="#fcfcfc"></path><path id="XMLID_117_" d="m57 83.8s0-.1-.1-.1c-2-2.7-5.9-2.9-8.2-.5-3.5 3.7-7 8.7-7 8.7l1-7.7c.6-4.5 2.8-8.6 6.2-11.6 2-1.7 3.8-2.5 5.4-2.9v1.3c-1.5 1.2-2.2 3.2-1.9 5.1.2.9.6 1.8 1.2 2.6 2.9 3.3 3.4 5.1 3.4 5.1z" fill="#fcfcfc"></path><path id="XMLID_114_" d="m89.7 48.7c.2-.2.4-.4.6-.6-.4-3.5-.7-7-1.1-10.5-1-1.3-2-2.5-2.7-3.6l-3.2-5.6-9.7-11.9-8.7-5.3c-.2 0-.4 0-.7 0-.2 0-.3 0-.5 0-13.6.1-23.4 8.5-24.5 22.1-.4 3.9-.8 7.8-1.2 11.6 6.8-3.4 14.1-9.7 18.1-21.6 8.8 26.2 33.6 25.4 33.6 25.4z" fill="#343843"></path><g fill="#454652"><path id="XMLID_112_" d="m78.7 41.4c1 .5 3.5 1.8 8.6 2.8-1.3-.5-4.7-1.5-8.7-3.7 3.7 1.7 5.7 2.1 8 2.6-1.2-.4-4.4-1.4-8.1-3.5 3.6 1.7 5.6 2 7.4 2.3-1.1-.4-4.1-1.3-7.5-3.2 3.4 1.6 5.4 1.9 6.8 2.1-1.3-.5-4.1-1.3-8-3.7 3.4 1.9 6 2.4 8.1 2.8-1.3-.5-4-1.3-7.7-3.6 3.6 2 6.5 2.4 7.7 2.7-1.6-.6-3.9-1.3-7.3-3.4 3.2 1.7 5.8 2.2 7.3 2.5-2.3-.9-3.7-1.3-7-3.3 3.1 1.7 5.1 2 7 2.4-7.5-3-13.4-7.3-16.9-14.9-.1-.3-.3-.5-.3-.7-.1-.2-.1-.3-.1-.3s0 .1.1.3c.6 2.7 2.3 5.7 3.1 6.7-1.2-1.4-3.4-5-4-6.9.2 1.6 1.4 4.7 3.3 7.4-2-2.5-3.7-5.8-4.3-7.4.3 1.6 1.4 4.6 3.5 7.8-2.2-2.9-3.9-6.1-4.5-7.7.2 1.4 1.3 4.7 3.7 8.2-2.4-3.2-4-6.2-4.7-8.1.2 1.4 1.2 4.1 2.5 6.3-1.8-2.6-3.1-5.4-3.6-6.9.3 1.5 1.3 4.4 2.7 6.8-1.9-2.8-3.3-5.8-3.9-7.4.3 1.6 1.5 4.8 3 7.4-1.5-2.3-3.3-5.6-4.1-8 .3 1.6 1.5 5.1 3.3 8-1.6-2.4-3.5-5.9-4.4-8.5 1 5.5 8.3 22 28.3 26-1.9-.6-5.1-1.5-9.3-3.9z"></path><path id="XMLID_106_" d="m51.3 28.3c.9-2.2 1.3-3.9 1.5-6.2-.7 2.6-1 3.7-2.1 6 .9-2.1 1.2-3.7 1.4-5.9-.7 2.6-.9 3.4-2 5.7.8-2 1.1-3.4 1.3-5.7-1.8 6.2-4.5 11.7-11.1 14.8 1.3-.3 3.7-1.6 5.2-3-1.2 1.2-3.8 3.1-5.1 3.7 1.2-.3 3.4-1.4 5.5-3.2-1.9 1.9-4.3 3.4-5.4 3.9 1.3-.3 3.5-1.4 5.8-3.4-2 1.9-4.3 3.5-5.7 4.1 1.4-.4 3.7-1.5 6.1-3.6-1 .9 5.8-3.7 6.7-13.5-.6 3-1 4.1-2.1 6.3z"></path></g></g></g></svg>
                                                            </div>
                                                        </>
                                                    )}
                                                </RadioGroup.Option>
                                            </RadioGroup>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center">
                                        {otpbox == true ?
                                            <button
                                                type="button"
                                                disabled={loginBtnStatus}
                                                onClick={
                                                    () => {
                                                        setLoginBtnLoading(true)
                                                        CheckOtp()
                                                        setIsOpen(false)
                                                        setSignUp(true)
                                                    }
                                                }
                                                className={`${loginBtnStatus === true ? 'opacity-30' : "opacity-100"} focus-visible:outline-none bg-[#004B7A] border border-[#004B7A] hover:bg-[#00446f] hover:border-[#00446f] text-white w-80 rounded-md p-2.5 text-sm mt-14 font-medium flex items-center justify-center`}>
                                                {loginBtnLoading ? <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 mr-3 fill-white" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg> : null}
                                                {loginBtnLoading == false ? props.lang == 'ar' ? 'استمرار' : 'Verify Otp' : null}
                                            </button>
                                            :
                                            <>
                                                {register == true ?
                                                    <button
                                                        type="button"
                                                        disabled={loginBtnStatus}
                                                        onClick={
                                                            () => {
                                                                setLoginBtnLoading(true)
                                                                setRegister(false)
                                                                CheckRegisterPhone()
                                                                setIsOpen(false)
                                                                setSignUp(true)
                                                            }
                                                        }
                                                        className={`${loginBtnStatus === true ? 'opacity-30' : "opacity-100"} focus-visible:outline-none bg-[#004B7A] border border-[#004B7A] hover:bg-[#00446f] hover:border-[#00446f] text-white w-80 rounded-md p-2.5 text-sm mt-14 font-medium flex items-center justify-center`}>
                                                        {loginBtnLoading ? <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 mr-3 fill-white" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg> : null}
                                                        {loginBtnLoading == false ? props.lang == 'ar' ? 'استمرار' : 'Register' : null}
                                                    </button>
                                                    :
                                                    <>
                                                        {registerotpbox == true ?
                                                            <button
                                                                type="button"
                                                                disabled={loginBtnStatus}
                                                                onClick={
                                                                    () => {
                                                                        setLoginBtnLoading(true)
                                                                        CheckRegisterOtp()
                                                                        setIsOpen(false)
                                                                        setSignUp(true)
                                                                    }
                                                                }
                                                                className={`${loginBtnStatus === true ? 'opacity-30' : "opacity-100"} focus-visible:outline-none bg-[#004B7A] border border-[#004B7A] hover:bg-[#00446f] hover:border-[#00446f] text-white w-80 rounded-md p-2.5 text-sm mt-14 font-medium flex items-center justify-center`}>
                                                                {loginBtnLoading ? <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 mr-3 fill-white" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg> : null}
                                                                {loginBtnLoading == false ? props.lang == 'ar' ? 'استمرار' : 'Register' : null}
                                                            </button>
                                                            :
                                                            <button
                                                                type="button"
                                                                disabled={loginBtnStatus}
                                                                onClick={
                                                                    () => {
                                                                        setLoginBtnLoading(true)
                                                                        CheckPhoneNumber()
                                                                        setIsOpen(false)
                                                                        setSignUp(true)
                                                                    }
                                                                }
                                                                className={`${loginBtnStatus === true ? 'opacity-30' : "opacity-100"} focus-visible:outline-none bg-[#004B7A] border border-[#004B7A] hover:bg-[#00446f] hover:border-[#00446f] text-white w-80 rounded-md p-2.5 text-sm mt-14 font-medium flex items-center justify-center`}>
                                                                {loginBtnLoading ? <svg height="24" viewBox="0 0 24 24" className="animate-spin h-6 w-6 mr-3 fill-white" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_7235860"><path d="m12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8v-2c-5.421 0-10 4.58-10 10 0 5.421 4.579 10 10 10z"></path></svg> : null}
                                                                {loginBtnLoading == false ? props.lang == 'ar' ? 'استمرار' : 'Login' : null}
                                                            </button>
                                                        }
                                                    </>
                                                }
                                            </>
                                        }
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
