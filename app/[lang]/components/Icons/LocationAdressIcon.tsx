export default function LocationAddressIcon({
    size = 14,
    color = "#004B7A",
    className = "",
}: {
    size?: number;
    color?: string;
    className?: string;
}) {
    return (
        <svg
            width={size}
            height={size}
            className={className}
            style={{ color }}
            aria-hidden="true"
        >
            <use href="#icon-address-location" />
        </svg>
    );
}