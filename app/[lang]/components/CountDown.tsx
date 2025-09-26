"use client"

import React, { useEffect, useState } from 'react'


export default function CountDown(props: any) {
    const [timerData, setTimerData] = useState<any>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [timer1, setTimer1] = useState<any>(0);
    const [timerDisbale, setTimerDisbale] = useState<any>(true);
    const lang = props?.lang;

    useEffect(() => {
        setTimerDemo1(props?.timer)
    }, [props])

    const setTimerDemo1 = (timer: any) => {
        var EDate = timer
        var finalDate = new Date(Date.parse(EDate));
        const date = finalDate;
        date.setDate(date.getDate());
        const countDownDate = date.getTime();
        let updatedValue: any = {};
        setTimer1(
            setInterval(() => {
                const now = new Date().getTime();
                const distance = countDownDate - now;
                if (distance < 0) {
                    // setTimerDisbale(false)
                }

                updatedValue.days = Math.floor(distance / (1000 * 60 * 60 * 24));
                updatedValue.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                updatedValue.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                updatedValue.seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimerData((demo1: any) => ({
                    ...demo1,
                    ...updatedValue,
                }));
                if (distance < 0) {
                    clearInterval(timer1);
                }
            })
        );
    };
    return (
        <>
            {timerDisbale ?
                <>
                    {/* <div className={`flex items-center absolute top-0 left-0 gap-1 bg-[#00000060] py-2 px-2 rounded-tl-lg rounded-br-lg ${props?.timerNeed}`}> */}
                    <div className={`${lang == 'ar' ? 'left-0' : 'right-0'} flex items-center absolute top-0 gap-2 bg-[#00000060] py-2 px-2 rounded-tl-lg rounded-br-lg`}>
                        <div className="text-xs font-bold">
                            <div className="flex justify-center flex-col rounded-md text-base">
                                <p className="text-white text-center text-[0.75rem] leading-3">{timerData?.days}</p>
                                <h4 className="text-white text-center text-[0.65rem] leading-3">{lang == 'ar' ? 'يوم' : 'Days'}</h4>
                            </div>
                        </div>
                        <div className="text-white text-center text-[0.65rem]">:</div>
                        <div className="text-xs font-bold">
                            <div className="flex justify-center flex-col rounded-md text-base">
                                <p className="text-white text-center text-[0.75rem] leading-3">{timerData?.hours}</p>
                                <h4 className="text-white text-center text-[0.65rem] leading-3">{lang == 'ar' ? 'ساعة' : 'Hours'}</h4>
                            </div>
                        </div>
                        <div className="text-white text-center text-[0.65rem]">:</div>
                        <div className="text-xs font-bold">
                            <div className="flex justify-center flex-col rounded-md text-base">
                                <p className="text-white text-center text-[0.75rem] leading-3">{timerData?.minutes}</p>
                                <h4 className="text-white text-center text-[0.65rem] leading-3">{lang == 'ar' ? 'دقيقة' : 'Mins'}</h4>
                            </div>
                        </div>
                        <div className="text-white text-center text-[0.65rem]">:</div>
                        <div className="text-xs font-bold">
                            <div className="flex justify-center flex-col rounded-md text-base">
                                <p className="text-white text-center text-[0.75rem] leading-3">{timerData?.seconds}</p>
                                <h4 className="text-white text-center text-[0.65rem] leading-3">{lang == 'ar' ? 'ثوانى' : 'Secs'}</h4>
                            </div>
                        </div>
                    </div>
                </>
                : null
            }
        </>
    );
}