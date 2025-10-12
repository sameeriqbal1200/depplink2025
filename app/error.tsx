// app/error.tsx
"use client";

import { useEffect } from "react";
import LottieAnimation from "@/components/LottieAnimation";
import Link from "next/link";
import { useApp } from "./_ctx/AppContext";
import { getPushMessageData } from "@/lib/not_found/not_found.client";
import { ErrorTracker } from "./[lang]/utils/errorTracker";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);
    const { origin, deviceType, lang } = useApp();
    useEffect(() => {
        getData()
    })
    const getData = async () => {
        const trackResult = ErrorTracker.trackCustomError(
            error.message,
            'frontend',
            500,
            deviceType,
            'Error Boundary Page',
        );
        const PreRoute = sessionStorage.getItem('preLoginRoute');
        const fullUrl = `${origin}${PreRoute}`
        const res = await getPushMessageData(fullUrl)
    }

    return (
        <div className="flex flex-col items-center justify-center text-center p-14">
            <LottieAnimation src="/json/error.json" loop width={200} height={200} />
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
            <Link href="/" className="btn nc__278mainInnerLink mt-6">
                {lang === "en" ? "Back to Home" : "العودة إلى الصفحة الرئيسية"}
            </Link>
        </div>
    );
}