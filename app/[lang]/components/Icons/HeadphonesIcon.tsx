type HeadphonesIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function HeadphonesIcon({
  size = 24,
  color = "#004B7A",
  className = "",
}: HeadphonesIconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      stroke={color}
      fill="none"
      aria-hidden="true"
    >
      <use href="#icon-headphones" />
    </svg>
  );
}
