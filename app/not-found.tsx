// app/not-found.tsx
"use client";

import LottieAnimation from "@/components/LottieAnimation";
import { getPushMessageData } from "@/lib/not_found/not_found.client";
import Link from "next/link";
import { useEffect } from "react";
import { useApp } from "./_ctx/AppContext";
import { ErrorTracker } from "./[lang]/utils/errorTracker";
import dynamic from "next/dynamic";
const MobileHeaderNew = dynamic(() => import("../app/[lang]/components/MobileHeaderNew"), { ssr: true, });
const MobileFooterNew = dynamic(() => import("../app/[lang]/components/MobileFooterNew"), { ssr: true, });

export default function NotFound() {
    const { origin, lang, deviceType } = useApp();
    useEffect(()=> {
        getData()
    })
    const getData = async () =>{
        ErrorTracker.trackCustomError(
            "Page not found (404)",
            "frontend",
            404,
            deviceType,
            "Not Found Page"
        );
        const PreRoute = sessionStorage.getItem('preLoginRoute');
        const fullUrl = `${origin}${PreRoute}&page_name=not-found&originUrl=${origin}`
        const res = await getPushMessageData(fullUrl)
    }
    return (
        <>
        {deviceType == "mobile" && (
        <div>
            <MobileHeaderNew
              type="Main"
              lang={lang}
              devicetype={deviceType}
            />
        </div>
        )}
        <div className="flex flex-col items-center justify-center text-center p-14">
            <LottieAnimation src="/json/404-error.json" loop width={200} height={200} />
            <h1 className="text-[#404553] text-[22px] font-semibold">
            <p>
                {lang === "en"
                    ? "We couldn't find what you were looking for."
                    : "لم نتمكن من العثور على ما تبحث عنه."}
            </p>
            </h1>
            <p className="text-[#7e859b] text-sm mt-2">
            {lang === "en"
                ? "We are very sorry but something has gone wrong, please try again."
                : "نحن آسفون جدًا، حدث خطأ ما، يرجى المحاولة مرة أخرى."}
            </p>
            {/* 👇 Use plain <a> so it doesn’t resubmit the wrong path */}
            <Link prefetch={true} replace={false} href={`${origin}/${lang}`} className="btn nc__278mainInnerLink mt-6">
                {lang === "en" ? "Back to Home" : "العودة إلى الصفحة الرئيسية"}
            </Link>
        </div>
        {deviceType == "mobile" && (
        <div>
            <MobileFooterNew lang={lang} origin={origin} />
        </div>
        )}
        </>
    );
}
