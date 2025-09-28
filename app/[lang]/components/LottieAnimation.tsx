"use client";

import { useEffect, useRef } from "react";
import lottie from "lottie-web";

type Props = {
    src: string; // JSON file path
    loop?: boolean;
    autoplay?: boolean;
    width?: number | string;
    height?: number | string;
};

export default function LottieAnimation({
    src,
    loop = true,
    autoplay = true,
    width = 200,
    height = 200,
}: Props) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        let anim: any;

        fetch(src)
            .then((res) => res.json())
            .then((data) => {
                anim = lottie.loadAnimation({
                    container: container.current!,
                    renderer: "svg", // can also be "canvas" for better perf
                    loop,
                    autoplay,
                    animationData: data,
                });
            });

        return () => {
            anim?.destroy(); // cleanup on unmount
        };
    }, [src, loop, autoplay]);

    return <div ref={container} style={{ width, height }} />;
}