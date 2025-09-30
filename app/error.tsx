// app/error.tsx
"use client";

import { useEffect } from "react";
import Image from "next/image";
import NotFoundIcon from "@/public/icons/error-404.png";

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

    return (
        <html>
            <body>
                <div className="nc__278mainDiv">
                    <div className="flex flex-col items-center justify-center text-center p-14">
                        <Image
                            src={NotFoundIcon}
                            alt="Not Found"
                            title="Not Found"
                            width={0}
                            height={0}
                            className="w-xs h-[230px]"
                        />
                        <h3 className="text-[#404553] text-[22px] font-semibold">We couldn't find what you were looking for</h3>
                        <p className="text-[#7e859b] text-sm mt-2">We are very sorry but something has gone wrong, please try again</p>
                        <button onClick={() => reset()} className="btn nc__278mainInnerLink !mt-6">Back to Home</button>
                    </div>
                </div>
            </body>
        </html>
    );
}