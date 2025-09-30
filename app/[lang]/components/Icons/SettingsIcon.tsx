type SettingsIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function SettingsIcon({
  size = 24,
  color = "#004B7A",
  className = "",
}: SettingsIconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={{ color }}
      fill="none"
      aria-hidden="true"
    >
      <use href="#icon-settings" />
    </svg>
  );
}
