// components/FilterIcon.tsx
import React from "react";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function ShareIcon({
  size = 18,
  color = "currentColor",
  className = "",
}: IconProps) {
  return (
    <svg width={size} height={size} fill={color} className={className}>
      <use href="#share-icon" />
    </svg>
  );
}
