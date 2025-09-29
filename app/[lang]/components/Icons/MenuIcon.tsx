"use client";

import React from "react";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function MenuIcon({
  size = 32,
  color = "currentColor",
  className = "",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke={color}
      aria-hidden="true"
    >
      <use href="#menu-icon" />
    </svg>
  );
}
