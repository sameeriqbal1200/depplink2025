// app/error.tsx
"use client";

import { useEffect } from "react";
import LottieAnimation from "@/components/LottieAnimation";
import Link from "next/link";
import { useApp } from "./_ctx/AppContext";
import { getPushMessageData } from "@/lib/not_found/not_found.client";

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
    const { origin } = useApp();
    useEffect(()=> {
        getData()
    })
    const getData = async () =>{
        const PreRoute = sessionStorage.getItem('preLoginRoute');
        const fullUrl = `${origin}${PreRoute}`
        const res = await getPushMessageData(fullUrl)
    }

    return (
        <div className="flex flex-col items-center justify-center text-center p-14">
            <LottieAnimation src="/json/error.json" loop width={200} height={200} />
            <h1 className="text-[#404553] text-[22px] font-semibold">We couldn't find what you were looking for</h1>
            <p className="text-[#7e859b] text-sm mt-2">We are very sorry but something has gone wrong, please try again</p>
            {/* 👇 Use plain <a> so it doesn’t resubmit the wrong path */}
            <Link href="/" className="btn nc__278mainInnerLink mt-6">
                Back to Home
            </Link>
        </div>
    );
}