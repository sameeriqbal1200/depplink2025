"use client";

import React from "react";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function LogoIcon({
  size = 40,
  color = "currentColor",
  className = "",
}: IconProps) {
  return (
    <svg
      width={size}
      height={(size * 40) / 57} // maintain aspect ratio
      fill={color}
      className={className}
      aria-hidden="true"
    >
      <use href="#logo-icon" />
    </svg>
  );
}
