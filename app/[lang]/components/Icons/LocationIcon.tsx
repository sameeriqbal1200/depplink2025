"use client";

import React from "react";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function LocationIcon({
  size = 20,
  color = "currentColor",
  className = "",
}: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={(size * 21) / 20} // preserve aspect ratio (20x21 viewBox)
      fill={color}
      aria-hidden="true"
    >
      <use href="#location-icon" />
    </svg>
  );
}
