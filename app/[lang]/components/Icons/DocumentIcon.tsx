type DocumentIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function DocumentIcon({
  size = 24,
  color = "#004B7A",
  className = "",
}: DocumentIconProps) {
  return (
    <svg
      width={size}
      height={size}
      fill={color}
      className={className}
      aria-hidden="true"
    >
      <use href="#icon-document" />
    </svg>
  );
}
