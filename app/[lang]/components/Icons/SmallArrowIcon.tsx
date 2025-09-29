"use client";

import React from "react";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function SmallArrowIcon({
  size = 20,
  color = "currentColor",
  className = "",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      fill={color}
      className={className}
      aria-hidden="true"
    >
      <use href="#smallArrow-icon" />
    </svg>
  );
}
