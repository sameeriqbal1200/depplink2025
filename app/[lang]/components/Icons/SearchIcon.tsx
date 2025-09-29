"use client";

import React from "react";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function SearchIcon({
  size = 20,
  color = "currentColor",
  className = "",
}: IconProps) {
  return (
    <svg
      width={size}
      height={(size * 16) / 20} // maintain aspect ratio
      fill={color}
      className={className}
      aria-hidden="true"
    >
      <use href="#search-icon" />
    </svg>
  );
}
