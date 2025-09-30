type OrdersIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function OrdersIcon({
  size = 24,
  color = "#004b7a",
  className = "",
}: OrdersIconProps) {
  return (
    <svg
      width={size}
      height={size}
      fill={color}
      className={className}
      aria-hidden="true"
    >
      <use href="#icon-orders" />
    </svg>
  );
}
