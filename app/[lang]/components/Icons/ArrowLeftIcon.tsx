"use client";

import React from "react";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function ArrowLeftIcon({
  size = 26,
  color = "currentColor",
  className = "",
}: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill={color}
      aria-hidden="true"
    >
      <use href="#arrowRight-icon" />
    </svg>
  );
}
