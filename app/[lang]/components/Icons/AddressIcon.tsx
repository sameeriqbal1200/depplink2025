type AddressIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function AddressIcon({
  size = 20,
  color = "#004b7a",
  className = "",
}: AddressIconProps) {
  return (
    <svg
      width={size}
      height={size}
      fill={color}
      className={className}
      aria-hidden="true"
    >
      <use href="#address-icon" />
    </svg>
  );
}
