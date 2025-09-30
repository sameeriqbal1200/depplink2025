type LocationPinIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function LocationPinIcon({
  size = 24,
  color = "#004B7A",
  className = "",
}: LocationPinIconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      stroke={color}
      fill="none"
      aria-hidden="true"
    >
      <use href="#icon-location-pin" />
    </svg>
  );
}
