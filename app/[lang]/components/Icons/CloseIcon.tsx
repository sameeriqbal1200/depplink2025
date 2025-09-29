"use client";

import React from "react";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function CloseIcon({
  size = 16,
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
      <use href="#close-icon" />
    </svg>
  );
}
