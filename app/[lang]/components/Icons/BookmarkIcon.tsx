type BookmarkIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function BookmarkIcon({
  size = 24,
  color = "#004B7A",
  className = "",
}: BookmarkIconProps) {
  return (
    <svg
      width={size}
      height={size}
      fill={color}
      className={className}
      aria-hidden="true"
    >
      <use href="#icon-bookmark" />
    </svg>
  );
}
