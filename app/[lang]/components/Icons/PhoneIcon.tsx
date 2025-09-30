type PhoneIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function PhoneIcon({
  size = 24,
  color = "currentColor",
  className = "",
}: PhoneIconProps) {
  return (
    <svg
      width={size}
      height={size}
      fill={color}
      className={className}
    >
      <use href="#icon-phone" />
    </svg>
  );
}
