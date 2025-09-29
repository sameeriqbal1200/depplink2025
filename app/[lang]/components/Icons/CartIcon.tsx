"use client";

import React from "react";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function CartIcon({
  size = 24,
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
      <use href="#cart-icon" />
    </svg>
  );
}
