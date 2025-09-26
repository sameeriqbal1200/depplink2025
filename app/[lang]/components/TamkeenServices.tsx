import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// interface TamkeenServicesProps {
//     lang: any
//     props: any
//     userAgent: any
//     isArabic: boolean
// }

const TamkeenServices = (props: any) => {
     const isArabic = props?.isArabic;
    const NewMedia = props?.NewMedia;
    const origin = props?.origin;
    const deviceType = props?.deviceType;

    return (
        <div className={deviceType}>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                {[
                    {
                        title: isArabic ? 'خدمات الصيانة' : 'Maintainance Service',
                        description:
                            isArabic
                                ? 'استمتع بعمر افتراضي طويل لأجهزتك من خلال خدمات الصيانة المتميزة التي نقدمها. يقوم الفنيون الماهرون لدينا بإجراء عمليات فحص ومعاينه دقيقة لضمان أعلى مستوى من الأداء.'
                                : 'Unlock Longevity for Your Appliances with Our Premium Maintenance Services.',
                        imgSrc:
                            `${NewMedia}5955af8279d5d71989f73fea1e0e1a091713958065.svg`,
                        route: `${origin}/${isArabic ? "ar" : "en"}/maintenance`,
                    },
                    {
                        title: isArabic ? 'خدمة التقسيط' : 'Installment Services',
                        description:
                            isArabic
                                ? 'تقدم تمكين خطط تقسيط سهلة للأجهزة المنزلية. استمتع بشروط مرنة وأسعار تنافسية وموافقات سريعة مع شركاء الدفع لدينا، مما يجعل عملية الشراء مريحة وبأسعار معقولة.'
                                : 'Tamkeen offers hassle-free installment plans for home appliances. Enjoy flexible terms.',
                        imgSrc:
                            `${NewMedia}1503ce4c090a865d2cf08d18198069e91713958042.svg`,
                        route: `${origin}/${isArabic ? "ar" : "en"}/installment-service-methods`,
                    },
                    {
                        title: isArabic ? 'خدمة الاستبدال والاسترجاع' : 'Exchange & Return Service',
                        description:
                            isArabic
                                ? 'تضمن سياسة إرجاع واستبدال الأجهزة المنزلية لدينا رضاك. إذا لم تكن راضيًا، قم بإعادته خلال 30 يومًا واسترداد أموالك بالكامل أو استبدالها، تطبق الشروط والأحكام.'
                                : 'Our home appliance return & exchange policy ensures your satisfaction.',
                        imgSrc:
                            `${NewMedia}35490fbd7c9f30b09bf693ed356203c71713958087.svg`,
                        route: `${origin}/${isArabic ? "ar" : "en"}/returnexchange`,
                    },
                    {
                        title: isArabic ? 'خدمة العملاء' : 'Customer Care',
                        description:
                            isArabic
                                ? 'نحن نعطي الأولوية لرضاك، ونقدم الدعم الشخصي للتأكد من أن أجهزتك المنزلية تلبي احتياجاتك بسلاسة. اتصل بنا اليوم للحصول على مساعدة لا مثيل لها.'
                                : 'We prioritize your satisfaction, offering personalized support to ensure your home appliances meet your needs seamlessly.',
                        imgSrc:
                            `${NewMedia}682759316ea53ed67045f1ec01efb6f71713958008.svg`,
                        route: `${origin}/${isArabic ? "ar" : "en"}/contact-us`,
                    },
                ].map((service, index) => (
                    <div key={index}>
                        <Link href={service?.route} aria-label={service.title} prefetch={false} scroll={false} className='flex'>
                            <div className='flex items-center gap-2'>
                                <Image
                                    src={service.imgSrc}
                                    alt={service.title}
                                    title={service.title}
                                    width={25}
                                    height={25}
                                    sizes='(max-width: 640px) 50px, 60px'
                                    loading='lazy'
                                />
                                <div>
                                    <h4 className="text-xs font-semibold">{service.title}</h4>
                                    <p className="line-clamp-1 text-[0.65rem] text-gray">{service.description}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TamkeenServices;
