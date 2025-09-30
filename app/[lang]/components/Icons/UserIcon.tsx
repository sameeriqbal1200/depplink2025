type UserIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function UserIcon({
  size = 26,
  color = "#004B7A",
  className = "",
}: UserIconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={{ color }}
      aria-hidden="true"
    >
      <use href="#icon-user" />
    </svg>
  );
}
