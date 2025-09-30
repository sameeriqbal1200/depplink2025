type ChatIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function ChatIcon({
  size = 24,
  color = "currentColor",
  className = "",
}: ChatIconProps) {
  return (
    <svg
      width={size}
      height={size}
      fill={color}
      className={className}
    >
      <use href="#icon-chat" />
    </svg>
  );
}
