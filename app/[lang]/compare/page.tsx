"use client"; // This is a client component 👈🏽

import React, { useEffect, useState, Fragment, useContext } from 'react';
import Image from 'next/image'
import { useRouter } from 'next-nprogress-bar';
import Swal from 'sweetalert2'
import GlobalContext from '../../GlobalContext';
import { useApp } from '@/app/_ctx/AppContext';
import { setCartItems } from '../cartstorage/cart';
import { Dialog, Transition } from '@headlessui/react';
import withReactContent from 'sweetalert2-react-content';
import { removeUserCompareData, deleteUserAllCompareData, getCompareDataFunc, getExtraProductDataFunc } from '@/lib/footerpages/compare.client'
import { getCookie } from 'cookies-next';

export default function Compare() {
    const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA;
    const { lang } = useApp();
    const router = useRouter()
    const [comapareData, setCompareData] = useState<any>(false)
    const [ProExtraData, setProExtraData] = useState<any>([])
    const [extraData, setExtraData] = useState<any>([]);
    const [selectedGifts, setselectedGifts] = useState<any>({})
    const [allowed_gifts, setallowed_gifts] = useState(0)
    const [cartid, setcartid] = useState(false)
    const [cartkey, setcartkey] = useState<any>(false)
    const [isOpen, setIsOpen] = useState(false)
    const { updateCompare, setUpdateCompare } = useContext(GlobalContext);
    
    // CURRENCY SYMBOL //
    const currencySymbol = <svg className="riyal-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39" width="15" height="15">
        <path fill="currentColor" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"></path>
        <path fill="currentColor" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
    </svg>;

    const getCompareData = async () => {
        if (localStorage.getItem('userid')) {
            getCompareDataFunc().then((compareData: any) => {
                setCompareData(compareData?.compareData)
            })
        } else {
            router.push(`/${lang}`)
        }
    }

    useEffect(() => {
        extraproductdata()
    }, [comapareData])

    const extraproductdata = async () => {
        var a: number[] = []
        var city = getCookie('selectedCity') || "Jeddah";
        await comapareData?.user?.compares.forEach((item: any) => {
            a.push(item.product_id)
        });
        if (a?.length >= 1) {
            getExtraProductDataFunc(a, city).then((extraProductDataFunc: any) => {
                setProExtraData(extraProductDataFunc?.extraProductDataFunc?.data)
            })
        }
    }


    const DeleteAllCompare = async () => {
        var data = {
            user_id: localStorage.getItem("userid"),
        }
        const resData = await deleteUserAllCompareData(data);
        if(resData?.compareResData?.success){
            localStorage.setItem('compareCount', '0');
            setCompareData(false)
        }
    }

    useEffect(() => {
        getCompareData()
    }, [])

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }


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

    function CheckIconInActive(props: any) {
        return (
            <svg viewBox="0 0 24 24" fill="none" {...props}>
                <circle cx={12} cy={12} r={12} fill="#00243c80" opacity="0.2" />
            </svg>
        )
    }

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

    const addToCart = (id: any, i: any, giftcheck = false) => {
        if (ProExtraData[id]?.freegiftData && giftcheck) {
            setExtraData(ProExtraData[id])
            setallowed_gifts(ProExtraData[id]?.freegiftData?.allowed_gifts)
            openModal()
            setselectedGifts({})
            setcartid(id)
            setcartkey(i)
            return false
            //router.push(`/${props.lang}/product/${ProData[i].slug}`);
        }
        var data = comapareData?.user?.compares.filter((e: any) => e.product_id == id)[0]
        var item: any = {
            id: data.product.id,
            sku: data?.product?.sku,
            name: data?.product?.name,
            name_arabic: data?.product?.name_arabic,
            image: data?.product?.featured_image ? NewMedia + data?.product?.featured_image?.image : 'https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
            price: data?.product?.sale_price ? data?.product?.sale_price : data?.product?.price,
            regular_price: data?.product?.price,
            quantity: 1,
            total_quantity: 1,
            brand: data?.product?.brand,
            slug: data?.product?.slug,
            pre_order: 0,
            pre_order_day: false

        }
        var gifts: any = false
        if (ProExtraData[id]?.freegiftData) {
            if (Object.keys(selectedGifts).length > 0) {
                gifts = []
                for (let index = 0; index < extraData?.freegiftData?.freegiftlist?.length; index++) {
                    const element = extraData?.freegiftData?.freegiftlist[index];
                    if (selectedGifts[element.id]) {
                        var amount = 0
                        if (extraData?.freegiftData?.discount_type == 2) {
                            var fgprice = element?.productdetail?.sale_price ? element?.productdetail?.sale_price : element?.productdetail?.price;
                            fgprice -= (element?.discount * fgprice) / 100;
                        }
                        else if (extraData?.freegiftData?.discount_type == 3)
                            amount = element.discount
                        var giftitem: any = {
                            id: element.productdetail.id,
                            sku: element.productdetail.sku,
                            name: element.productdetail.name,
                            name_arabic: element.productdetail.name_arabic,
                            image: element.productdetail?.featured_image ? NewMedia + element.productdetail?.featured_image?.image : 'https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png',
                            price: element.productdetail.sale_price ? element.productdetail.sale_price : element.productdetail.price,
                            regular_price: element.productdetail.price,
                            quantity: 1,
                            gift_id: extraData?.freegiftData?.id,
                            discounted_amount: amount,
                            slug: element.productdetail?.slug,
                            pre_order: 0,
                            pre_order_day: false
                        }
                        gifts.push(giftitem)
                    }
                }
            }
        }
        var fbt_false: any = false
        setCartItems(item, gifts, fbt_false)
        // topMessageAlartSuccess(params?.dict?.productCart)
        removecompareProduct(data.product.id, true)
        router.push(`/${lang}/cart`);
    }

    const removecompareProduct = async (id: any, type: boolean) => {
        var data = {
            user_id: localStorage.getItem("userid"),
            product_id: id,
        }
        if (type) {
            const resData: any = await removeUserCompareData(data);
            if (resData?.userResData?.success) {
                var comparelength: any = localStorage.getItem('compareCount');
                comparelength = parseInt(comparelength) - 1;
                localStorage.setItem('compareCount', comparelength);
                getCompareData()
                localStorage.removeItem('userCompare')
                setUpdateCompare(updateCompare == 0 ? 1 : 0)
            }
        }
    }
    return (
        <>
            {comapareData?.user?.compares ?
                <div className="container py-4">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <h1 className=" font-semibold text-lg 2xl:text-xl">{lang == 'ar' ? 'قائمة مقارنة المنتجات' : 'Product Comperission'} ({comapareData?.user?.compares?.length}/4)</h1>
                            <button className="text-xs focus-visible:outline-none font-semibold underline text-[#EA4335]" onClick={(e: any) => { DeleteAllCompare() }}>{lang == 'ar' ? 'حـذـف كــل الــمنتــجات' : 'Delete all products'}</button>
                        </div>

                        <div className="my-10">
                            <div className="grid grid-cols-5">
                                <div className="p-3"></div>
                                {comapareData?.user?.compares?.map((data: any, i: React.Key | null | undefined) => {
                                    return (
                                        <div className="border border-[#5D686F30] p-3 bg-white" key={data?.id}>
                                            <Image
                                                src={data?.product?.featured_image ? NewMedia + data?.product?.featured_image.image : "https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png"}
                                                alt={lang == "ar" ? data?.product?.name_arabic : data?.product?.name}
                                                title={lang == "ar" ? data?.product?.name_arabic : data?.product?.name}
                                                quality={100}
                                                height={260}
                                                width={260}
                                                loading='lazy'
                                                className="m-auto"
                                                sizes="(max-width: 960px) 50vw, (max-width: 1024px) 50vw, (max-width: 1650px) 50vw, (max-width: 1920px) 60vw, 100vw"
                                            />
                                        </div>
                                    )
                                })
                                }
                                {comapareData?.user?.compares?.length < 4 ?
                                    [...Array(4 - comapareData?.user?.compares?.length)].map((data: any, y: React.Key | null | undefined) => {
                                        return (
                                            <div className="p-3" key={y}></div>
                                        )
                                    })
                                    : null
                                }
                            </div>
                            <div className="grid grid-cols-5 text-sm text-center  font-semibold">
                                <div className="bg-[#B1553340] border border-[#5D686F30] p-4 flex items-center justify-center text-[#B15533]">{lang == "ar" ? 'خصـائص ومـميزات المنتج' : 'Product Specifications'}</div>
                                {comapareData?.user?.compares?.map((data: any, i: React.Key | null | undefined) => {
                                    return (
                                        <div key={data?.product_id} className="bg-[#219EBC10] border border-[#5D686F30] p-4 flex items-center justify-center text-[#004B7A] line-clamp-2">{lang == "ar" ? data?.product?.name_arabic : data?.product?.name}</div>
                                    )
                                })
                                }
                                {comapareData?.user?.compares?.length < 4 ?
                                    [...Array(4 - comapareData?.user?.compares?.length)].map((data: any, i: React.Key | null | undefined) => {
                                        return (
                                            <div key={i} className="bg-[#5D686F20] border border-[#5D686F30] p-4 flex items-center justify-center text-[#00002C] fill-[#00002C] gap-x-3">
                                                <svg height="18" width="18" viewBox="0 0 426.66667 426.66667" xmlns="http://www.w3.org/2000/svg" id="fi_1828925" className="text-center"><path d="m405.332031 192h-170.664062v-170.667969c0-11.773437-9.558594-21.332031-21.335938-21.332031-11.773437 0-21.332031 9.558594-21.332031 21.332031v170.667969h-170.667969c-11.773437 0-21.332031 9.558594-21.332031 21.332031 0 11.777344 9.558594 21.335938 21.332031 21.335938h170.667969v170.664062c0 11.777344 9.558594 21.335938 21.332031 21.335938 11.777344 0 21.335938-9.558594 21.335938-21.335938v-170.664062h170.664062c11.777344 0 21.335938-9.558594 21.335938-21.335938 0-11.773437-9.558594-21.332031-21.335938-21.332031zm0 0"></path></svg>
                                                {lang == "ar" ? 'إضافة مــنــتج اخــر الي الـمقـارنة' : 'Product Specifications'}
                                            </div>
                                        )
                                    })
                                    :
                                    null
                                }
                            </div>

                            
                            <div className="grid grid-cols-5 text-sm text-center  font-semibold bg-white">
                                
                                <div className="border border-[#5D686F30] p-4 flex items-center justify-center text-[#B15533]">{lang == "ar" ? 'الأسعار' : `Gifts`}</div>
                                {comapareData?.user?.compares?.map((data: any, t: any) => {
                                    return (
                                        <div key={t} className="border border-[#5D686F30] p-4 flex items-center justify-center text-[#004B7A] gap-x-2 font-bold text-lg">
                                            {ProExtraData[data?.product_id]?.freegiftData ?
                                                <div className='flex items-end gap-x-2 mt-2'>
                                                    <svg id="fi_3850991" enableBackground="new 0 0 512 512" height="16" viewBox="0 0 512 512" width="16" fill="#219EBC" xmlns="http://www.w3.org/2000/svg"><g><path d="m359.42 20.97c13.36-8.94 29.92-6.83 38.21.38 3.59 3.13 7.1 8.46 3.4 16.1-7.77 16.12-24.32 26.53-42.14 26.53h-51.02c2.4 6.2 3.73 12.93 3.73 19.97 0 6.27-1.06 12.3-2.98 17.93h119.99c8-15.2 8.58-32.65 1.45-48.64l-14.62-32.82c-1.71-3.8-4.33-7.34-7.89-10.44-12.42-10.78-36.42-14.98-56.52-1.54l-55.1 36.89c3.5 3.62 6.52 7.7 8.94 12.15z"></path><path d="m203.4 101.87c-1.92-5.63-2.98-11.66-2.98-17.93 0-7.04 1.33-13.77 3.73-19.97h-50.99c-17.82 0-34.37-10.42-42.18-26.54-3.7-7.63-.19-12.96 3.41-16.08 4.46-3.88 11.31-6.28 18.77-6.28 6.41 0 13.26 1.77 19.43 5.9l54.54 36.51c2.42-4.46 5.45-8.54 8.94-12.15l-55.1-36.89c-20.1-13.44-44.1-9.24-56.49 1.54-3.97 3.45-6.79 7.44-8.45 11.74l-14.07 31.51c-7.14 15.99-6.56 33.44 1.45 48.64z"></path><path d="m219.67 101.87h72.65c2.68-5.41 4.2-11.5 4.2-17.93 0-22.33-18.2-40.53-40.53-40.53s-40.53 18.2-40.53 40.53c.01 6.44 1.53 12.52 4.21 17.93z"></path><path d="m16.2 148.65v49.55c0 14.89 10.32 27.41 24.17 30.8h187.69v-112.07h-180.15c-17.48 0-31.71 14.23-31.71 31.72z"></path><path d="m40.38 469.91c0 23.21 18.88 42.09 42.09 42.09h145.6v-267.95h-187.69z"></path><path d="m464.09 116.93h-180.13v112.06h187.66c13.86-3.39 24.17-15.91 24.17-30.8v-49.55c.01-17.48-14.22-31.71-31.7-31.71z"></path><path d="m283.96 512h145.57c23.21 0 42.09-18.88 42.09-42.09v-225.86h-187.66z"></path></g></svg>
                                                    <div className='text-xs font-regular'>
                                                        {lang == 'ar' ? "يوجد هدية مع الـمنتج" : "With Free Gift"}
                                                    </div>
                                                </div>
                                                :
                                                <div className="h-6"></div>
                                            }
                                        </div>
                                    )
                                })
                                }
                                {comapareData?.user?.compares?.length < 4 ?
                                    [...Array(4 - comapareData?.user?.compares?.length)].map((data: any, i: React.Key | null | undefined) => {
                                        return (
                                            <div key={i} className="p-4 flex items-center justify-center text-[#004B7A]"></div>
                                        )
                                    })
                                    : null
                                }
                            </div>


                            <div className="grid grid-cols-5 text-sm text-center  font-semibold bg-white">
                                <div className="border border-[#5D686F30] p-4 flex items-center justify-center text-[#B15533]">{lang == "ar" ? 'رقم الموديل' : `Model Number`}</div>
                                {comapareData?.user?.compares?.map((data: any, t: React.Key | null | undefined) => {
                                    return (
                                        <div key={t} className="border border-[#5D686F30] p-4 flex items-center justify-center text-[#004B7A] gap-x-2 font-bold text-lg">
                                            {data?.product?.sku} 
                                        </div>
                                    )
                                })
                                }
                                {comapareData?.user?.compares?.length < 4 ?
                                    [...Array(4 - comapareData?.user?.compares?.length)].map((data: any, i: React.Key | null | undefined) => {
                                        return (
                                            <div key={i} className="p-4 flex items-center justify-center text-[#004B7A]"></div>
                                        )
                                    })
                                    : null
                                }
                            </div>

                            <div className="grid grid-cols-5 text-sm text-center  font-semibold bg-white">
                                <div className="border border-[#5D686F30] p-4 flex items-center justify-center text-[#B15533]">{lang == "ar" ? 'الأسعار' : `Price's`}</div>
                                {comapareData?.user?.compares?.map((data: any, t: React.Key | null | undefined) => {
                                    return (
                                        <div key={t} className="border border-[#5D686F30] p-4 flex items-center justify-center text-[#004B7A] gap-x-2 font-bold text-lg">
                                            <div className="flex items-center gap-x-1">
                                            {currencySymbol}{Intl.NumberFormat('en-US').format(data?.product?.sale_price)}
                                            </div>{' '}<span className="text-[#EB5757] decoration-[#DC4E4E] decoration-2 line-through  font-semibold text-sm">{Intl.NumberFormat('en-US').format(data?.product?.price)}{' '}{lang == "ar" ? 'ر.س' : 'SR'}</span>
                                        </div>
                                    )
                                })
                                }
                                {comapareData?.user?.compares?.length < 4 ?
                                    [...Array(4 - comapareData?.user?.compares?.length)].map((data: any, i: React.Key | null | undefined) => {
                                        return (
                                            <div key={i} className="p-4 flex items-center justify-center text-[#004B7A]"></div>
                                        )
                                    })
                                    : null
                                }
                            </div>

                            {comapareData?.parentnames?.map((data: any, p: any) => {
                                return (
                                    <div key={p} className={`grid grid-cols-5 text-sm text-center font-medium ${Boolean(p % 2) ? 'bg-white' : 'bg-[#219EBC5]'} `}>
                                        <div className="border border-[#5D686F30] p-4 flex items-center justify-center text-[#004B7A]">{lang == "ar" ? data?.name_arabic : data?.name}</div>
                                        <div className="col-span-4">
                                            <div className="grid grid-cols-4">
                                                {comapareData?.user?.compares?.map((dataPeta: any, k: any) => {
                                                    var tags = dataPeta?.product?.tags.filter((element: any) => {
                                                        return element?.parent_data?.id == data?.id
                                                    })
                                                    return (
                                                        <div className="text-sm text-center font-medium" key={k}>
                                                            <div className={`border border-[#5D686F30] p-4 ${tags.length > 0 ? 'text-[#004B7A]' : 'text-[#dfdfdf60]'}`}>{tags.length > 0 ? tags.map(function (a: any) { return a.name; }).join(', ') : '--'}</div>
                                                        </div>
                                                    )
                                                })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            }

                            {/* Buttons Area */}
                            <div className="grid grid-cols-5 mt-4">
                                <div className="p-4 flex items-center justify-center text-[#004B7A]"></div>
                                {comapareData?.user?.compares?.map((data: any, b: React.Key | null | undefined) => {
                                    return (
                                        <div className="p-4" key={b}>
                                            <button onClick={(e) => {
                                                addToCart(data.product_id, b, true)
                                            }}
                                                className="focus-visible:outline-none btn text-sm bg-[#004B7A] p-2.5 rounded-md text-white w-full">{lang == "ar" ? 'اضف الي العربة' : 'Add to Cart'}</button>
                                            <button onClick={(e) => {
                                                removecompareProduct(data.product_id,true)
                                            }}
                                            className="underline font-semibold text-sm text-[#DC4E4E] mx-auto w-full mt-2">{lang === 'ar' ? 'إزالة من المقارنة' : 'Remove From Compare'}</button>
                                        </div>
                                    )
                                })
                                }
                            </div>
                        </div>
                    </div>

                    {
                        extraData?.freegiftData ?
                            <Transition appear show={isOpen} as={Fragment}>
                                <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
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
                                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black bg-white">
                                                    <div className="flex bg-white items-center justify-between px-5 pt-4">
                                                        <h5 className='text-base font-[600] flex items-center gap-x-2 text-[#004B7A] fill-[#004B7A]'>
                                                            <svg id="fi_3850991" enableBackground="new 0 0 512 512" height="20" viewBox="0 0 512 512" width="20" fill="#219EBC" xmlns="http://www.w3.org/2000/svg"><g><path d="m359.42 20.97c13.36-8.94 29.92-6.83 38.21.38 3.59 3.13 7.1 8.46 3.4 16.1-7.77 16.12-24.32 26.53-42.14 26.53h-51.02c2.4 6.2 3.73 12.93 3.73 19.97 0 6.27-1.06 12.3-2.98 17.93h119.99c8-15.2 8.58-32.65 1.45-48.64l-14.62-32.82c-1.71-3.8-4.33-7.34-7.89-10.44-12.42-10.78-36.42-14.98-56.52-1.54l-55.1 36.89c3.5 3.62 6.52 7.7 8.94 12.15z"></path><path d="m203.4 101.87c-1.92-5.63-2.98-11.66-2.98-17.93 0-7.04 1.33-13.77 3.73-19.97h-50.99c-17.82 0-34.37-10.42-42.18-26.54-3.7-7.63-.19-12.96 3.41-16.08 4.46-3.88 11.31-6.28 18.77-6.28 6.41 0 13.26 1.77 19.43 5.9l54.54 36.51c2.42-4.46 5.45-8.54 8.94-12.15l-55.1-36.89c-20.1-13.44-44.1-9.24-56.49 1.54-3.97 3.45-6.79 7.44-8.45 11.74l-14.07 31.51c-7.14 15.99-6.56 33.44 1.45 48.64z"></path><path d="m219.67 101.87h72.65c2.68-5.41 4.2-11.5 4.2-17.93 0-22.33-18.2-40.53-40.53-40.53s-40.53 18.2-40.53 40.53c.01 6.44 1.53 12.52 4.21 17.93z"></path><path d="m16.2 148.65v49.55c0 14.89 10.32 27.41 24.17 30.8h187.69v-112.07h-180.15c-17.48 0-31.71 14.23-31.71 31.72z"></path><path d="m40.38 469.91c0 23.21 18.88 42.09 42.09 42.09h145.6v-267.95h-187.69z"></path><path d="m464.09 116.93h-180.13v112.06h187.66c13.86-3.39 24.17-15.91 24.17-30.8v-49.55c.01-17.48-14.22-31.71-31.7-31.71z"></path><path d="m283.96 512h145.57c23.21 0 42.09-18.88 42.09-42.09v-225.86h-187.66z"></path></g></svg>
                                                            {lang == 'ar' ? 'هـدايــا العرض' : 'Select Free Gifts'} {extraData?.freegiftData?.allowed_gifts}
                                                        </h5>
                                                        <button type="button" className="focus-visible:outline-none text-dark hover:text-dark fill-dark" onClick={() => setIsOpen(false)}>
                                                            <svg height="16" viewBox="0 0 329.26933 329" width="16" xmlns="http://www.w3.org/2000/svg" id="fi_1828778"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"></path></svg>
                                                        </button>
                                                    </div>
                                                    <div className="p-5">
                                                        <div className="mx-auto w-full">
                                                            {extraData?.freegiftData?.freegiftlist?.map((freegiftdatapro: any, i: number) => {
                                                                if (extraData?.freegiftData?.discount_type == 2) {
                                                                    var fgprice = freegiftdatapro?.productdetail?.sale_price ? freegiftdatapro?.productdetail?.sale_price : freegiftdatapro?.productdetail?.price;
                                                                    fgprice -= (freegiftdatapro?.discount * fgprice) / 100;
                                                                }
                                                                return (
                                                                    <div
                                                                        key={i + 100}
                                                                        className={
                                                                            `${selectedGifts[freegiftdatapro.id]
                                                                                ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                                                                                : ''
                                                                            } ${selectedGifts[freegiftdatapro.id] ? 'bg-[#00243c] text-white' : 'bg-[#EEF4F7]'} relative flex rounded-lg p-3 focus:outline-none mb-1`}
                                                                    >
                                                                        <div className="relative flex items-center justify-between w-full">
                                                                            <label htmlFor="hs-checkbox-delete" className="cursor-pointer"
                                                                                onClick={() => {

                                                                                    if (extraData?.freegiftData?.allowed_gifts == extraData?.freegiftData?.freegiftlist.length && extraData?.freegiftData?.discount_type == 1) {
                                                                                        return false
                                                                                    }
                                                                                    else {
                                                                                        var gifts = selectedGifts
                                                                                        if (gifts[freegiftdatapro.id])
                                                                                            delete gifts[freegiftdatapro.id]
                                                                                        else if (Object.keys(selectedGifts).length < allowed_gifts)
                                                                                            gifts[freegiftdatapro.id] = true
                                                                                        setselectedGifts({ ...gifts })
                                                                                    }
                                                                                    if (Object.keys(selectedGifts).length == allowed_gifts) {
                                                                                        //topMessageAlartSuccess("Gift have been selected!")
                                                                                        closeModal()
                                                                                        addToCart(cartid, cartkey)

                                                                                    }

                                                                                }}
                                                                            >
                                                                                <div className="flex w-full items-center justify-between">
                                                                                    <div className="flex items-center gap-x-3">
                                                                                        <Image
                                                                                            src={freegiftdatapro?.productdetail?.featured_image ? NewMedia + freegiftdatapro?.productdetail?.featured_image?.image : 'https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png'}
                                                                                            alt={freegiftdatapro?.productdetail?.featured_image ? lang == 'ar' ? freegiftdatapro?.productdetail?.featured_image?.alt_arabic : freegiftdatapro?.productdetail?.featured_image?.alt : ''}
                                                                                            title={freegiftdatapro?.productdetail?.featured_image ? lang == 'ar' ? freegiftdatapro?.productdetail?.featured_image?.alt_arabic : freegiftdatapro?.productdetail?.featured_image?.title : ''}
                                                                                            height={60}
                                                                                            width={60}
                                                                                            loading='lazy'
                                                                                            className="rounded-md"
                                                                                        />
                                                                                        <div className="flex items-center text-xs">
                                                                                            <span>
                                                                                                {extraData?.freegiftData?.discount_type == 1 ?
                                                                                                    <p className={`text-[#004B7A] font-bold ${selectedGifts[freegiftdatapro.id] ? 'text-secondary' : ''}`}>
                                                                                                        {lang == 'ar' ? 'هدية مجانية' : 'Free Gift Item'}
                                                                                                    </p>
                                                                                                    : null}
                                                                                                {extraData?.freegiftData?.discount_type == 2 ?
                                                                                                    <p className={`text-[#004B7A] font-bold ${selectedGifts[freegiftdatapro.id] ? 'text-secondary' : ''}`}>
                                                                                                        {fgprice} ر.س
                                                                                                    </p>
                                                                                                    : null}
                                                                                                {extraData?.freegiftData?.discount_type == 3 ?
                                                                                                    <p className={`text-[#004B7A] font-bold ${selectedGifts[freegiftdatapro.id] ? 'text-secondary' : ''}`}>
                                                                                                        {freegiftdatapro.discount} ر.س
                                                                                                    </p>
                                                                                                    : null}
                                                                                                <h4 className={`text-[#00243c] text-sm md:w-80 max-md:line-clamp-2 ${selectedGifts[freegiftdatapro.id] ? 'text-white' : ''}`}>{lang == 'ar' ? freegiftdatapro?.productdetail?.name_arabic : freegiftdatapro?.productdetail?.name}</h4>
                                                                                                <h6 className={` font-semibold text-[#5D686F] mt-3.5 text-left rtl:text-right ${selectedGifts[freegiftdatapro.id] ? 'text-secondary' : ''}`}>
                                                                                                    {lang == 'ar' ? 'العلامة' : 'Brand'} {lang == 'ar' ? freegiftdatapro?.productdetail?.brand?.name_arabic : freegiftdatapro?.productdetail?.brand?.name}</h6>
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </label>
                                                                            <input
                                                                                id="hs-checkbox-delete"
                                                                                name="hs-checkbox-delete"
                                                                                type="checkbox"
                                                                                className="rounded hidden" aria-describedby="hs-checkbox-delete-description"
                                                                            />
                                                                            {selectedGifts[freegiftdatapro.id] ?
                                                                                <div className="shrink-0 text-white">
                                                                                    <CheckIcon className="h-6 w-6" />
                                                                                </div>
                                                                                :
                                                                                <div className="shrink-0 text-white">
                                                                                    <CheckIconInActive className="h-6 w-6" />
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                            }
                                                        </div>
                                                    </div>
                                                </Dialog.Panel>
                                            </Transition.Child>
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition>
                            : null
                    }
                </div>
                :
                <div className="container py-4">
                    <div className="py-6">
                        <h1 className="text-center  font-semibold text-lg 2xl:text-xl">{lang == 'ar' ? 'لا يوجد منتج!' : 'There is no product!'}</h1>
                    </div>
                </div>
            }
        </>
    );
}

