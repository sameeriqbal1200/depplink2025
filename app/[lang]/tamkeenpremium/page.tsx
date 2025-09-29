"use client"; // This is a client component 👈🏽

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useApp } from '@/app/_ctx/AppContext';

const MobileHeader = dynamic(() => import('../components/MobileHeader'), { ssr: true })


export default function TamkeenPremium() {
    const { lang, origin } = useApp();

    return (
        <>
        <MobileHeader type="Third"  lang={lang} pageTitle={lang === 'ar' ? 'الترقيات' : 'Tamkeen Premium'} />
            <div className="container py-16 md:py-4">
                <div className="my-4">
                    <h1 className="text-[#004B7A] font-semibold text-sm md:text-base">
                        {lang === 'ar' ? 'عميلنا العزيز، لخدمة متقدمة ولتسهيل عملية التسوق نقدم لكم' : 'Dear customer, for advanced service and to facilitate the shopping process, we offer you'}:
                    </h1>
                    <Image src="https://partners.tamkeenstores.com.sa/public/assets/new-media/Zamil%20page_%20.webp"
                        alt={lang === 'ar' ? 'تـمكـين بـريـميـوم' : 'tamkeenPremium'} title={lang === 'ar' ? 'تـمكـين بـريـميـوم' : 'Tamkeen Premium'} height={0} width={0} loading='lazy' className="h-auto w-auto rounded-md my-3"
                    />
                    <div>
                        <h2 className="text-[#004B7A] font-semibold text-sm md:text-base">{lang === 'ar' ? 'تجربة اخري افضل واسهل من خلال التسـوق تـمكيــن برميوم' : 'Another better and easier experience through shopping is can Premium'}</h2>
                        <p className="text-xs mt-1 text-[#5D686F] font-normal">
                            {lang === 'ar' ?
                                'احصل على خصومات إضافية حصرية وهدايا خاصة ومميزات بلا حدود عند اشتراكك في جود. استمتع بالخصومات الحصرية والهدايا الخاصة وإمكانية الاطلاع على العروض والخصومات قبل الجميع. اختر باقتين من تمكين برميوم الاشتراك الشهري والاشتراك السنوي واشترك في الباقة التي تناسبك.'
                                :
                                'Get additional exclusive discounts, special gifts, and unlimited benefits when you subscribe to Joud. Enjoy exclusive discounts, special gifts, and the ability to view offers and discounts before everyone else. Choose two packages from Tamkeen Premium, the monthly subscription and the annual subscription, and subscribe to the package that suits you.'
                            }
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                            {[...Array(3)].map((_, i) => (
                                <div className="bg-white p-3 rounded-md shadow-md" key={i}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-[#004B7A] text-sm font-medium">{lang === 'ar' ? 'تـمكين برميوم (السـنوي)' : 'Tamkeen Premium (Silver)'}</h3>
                                            <p className="text-[#B15533] text-lg font-semibold mb-3 md:mb-6">{lang === 'ar' ? '' : 'SR'}{' '}500{' '}{lang === 'ar' ? 'ر.س' : ''}</p>

                                            <Link href={`${origin}/${lang}/tamkeenpremium/buy`} as={`/${lang}/tamkeenpremium/buy`} className="border border-[#004B7A] text-[#004B7A] rounded-full text-xs font-semibold hover:bg-[#004B7A] hover:text-white md:py-2.5 py-1.5 px-3 md:px-4">
                                                {lang === 'ar' ? 'اشترك الان' : 'Subscribe Now'}
                                            </Link>
                                        </div>
                                        <Image src="/images/37817.png"
                                            alt={lang === 'ar' ? 'تـمكـين بـريـميـوم' : 'tamkeenPremium'} title={lang === 'ar' ? 'تـمكـين بـريـميـوم' : 'Tamkeen Premium'} height='150' width='150' loading='lazy' className="rounded-md"
                                        />
                                    </div>
                                    <div className='w-full border border-[#dfdfdf70] my-2'></div>
                                    <h4 className="text-xs">{lang === 'ar' ? 'التفاصيل والموصفات' : 'Details & Specifications'}</h4>
                                    <div className="mt-3">
                                        {[...Array(10)].map((_, l, a) => (
                                            <div className={`${l + 1 == a.length ? '' : 'border-b'} border-[#dfdfdf70] flex items-center text-xs md:text-sm`} key={l}>
                                                <label className="w-1/2 border-r border-[#dfdfdf70] py-6 md:py-8 font-normal md:line-clamp-1">{lang === 'ar' ? 'خصم إضافي على المنتجات' : 'Additional Discount on Products'}</label>
                                                <p className="w-1/2 text-center py-6 md:py-8 font-semibold text-sm">35%</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <h4 className="text-[#004B7A] font-semibold text-sm md:text-base">{lang === 'ar' ? 'تجربة اخري افضل واسهل من خلال التسـوق تـمكيــن برميوم' : 'Another better and easier experience through shopping is can Premium'}</h4>
                            <p className="text-xs mt-1 text-[#5D686F] font-normal">
                                {lang === 'ar' ?
                                    'احصل على خصومات إضافية حصرية وهدايا خاصة ومميزات بلا حدود عند اشتراكك في جود. استمتع بالخصومات الحصرية والهدايا الخاصة وإمكانية الاطلاع على العروض والخصومات قبل الجميع. اختر باقتين من تمكين برميوم الاشتراك الشهري والاشتراك السنوي واشترك في الباقة التي تناسبك.'
                                    :
                                    'Get additional exclusive discounts, special gifts, and unlimited benefits when you subscribe to Joud. Enjoy exclusive discounts, special gifts, and the ability to view offers and discounts before everyone else. Choose two packages from Tamkeen Premium, the monthly subscription and the annual subscription, and subscribe to the package that suits you.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
