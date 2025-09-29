"use client";

import React from "react";

type IconProps = {
  size?: number;
  color?: string;     // bell color (orange badge stays fixed)
  className?: string;
};

export default function BellBadgeIcon({
  size = 29,
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
      <use href="#bell-badge-icon" />
    </svg>
  );
}
