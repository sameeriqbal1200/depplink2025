// app/not-found.tsx
"use client";

import LottieAnimation from "@/components/LottieAnimation";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center text-center p-14">
            <LottieAnimation src="/json/404-error.json" loop width={200} height={200} />
            <h1 className="text-[#404553] text-[22px] font-semibold">
                We couldn't find what you were looking for
            </h1>
            <p className="text-[#7e859b] text-sm mt-2">
                We are very sorry but something has gone wrong, please try again
            </p>
            {/* 👇 Use plain <a> so it doesn’t resubmit the wrong path */}
            <a href="/" className="btn nc__278mainInnerLink !mt-6">
                Back to Home
            </a>
        </div>
    );
}
