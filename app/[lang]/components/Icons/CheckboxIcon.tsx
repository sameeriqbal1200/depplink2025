// components/CheckboxIcon.tsx
import React from 'react';

type CheckboxIconProps = {
  checked: boolean;
  className?: string;
  size?: number;
};

export default function CheckboxIcon({
  checked,
  className = 'h-6 w-6',
  size = 24,
}: CheckboxIconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
    >
      <use href={checked ? '#checkbox-checked' : '#checkbox-unchecked'} />
    </svg>
  );
}
