export default function StarIcon({
    size = 13,
    color = "currentColor",
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
            <use href="#icon-star" />
        </svg>
    );
}
