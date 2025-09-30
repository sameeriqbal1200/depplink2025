type NetworkIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function NetworkIcon({
  size = 16,
  color = "currentColor",
  className = "",
}: NetworkIconProps) {
  return (
    <svg
      width={size}
      height={size}
      fill={color}
      className={className}
    >
      <use href="#icon-network" />
    </svg>
  );
}
