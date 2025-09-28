"use client";

import React from "react";

type SARIconProps = {
    size?: number;
    color?: string;
    className?: string;
};

export default function SARIcon({
    size = 16,
    color = "currentColor",
    className = "",
}: SARIconProps) {
    return (
        <svg
            className={className}
            width={size}
            height={(size * 11) / 10} // keep aspect ratio
            fill={color}
        >
            <use href="#icon-sar" />
        </svg>
    );
}
