type HelpCircleIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function HelpIcon({
  size = 24,
  color = "#004B7A",
  className = "",
}: HelpCircleIconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      stroke={color}
      fill="none"
      aria-hidden="true"
    >
      <use href="#icon-help-circle" />
    </svg>
  );
}
