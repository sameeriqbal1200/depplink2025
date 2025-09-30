type AboutIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function AboutIcon({
  size = 24,
  color = "#004B7A",
  className = "",
}: AboutIconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={{ color }}
      fill="none"
      aria-hidden="true"
    >
      <use href="#icon-about" />
    </svg>
  );
}
