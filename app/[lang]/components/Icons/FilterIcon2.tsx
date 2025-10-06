export default function FilterIconTwo({
    size = 15,
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
            <use href="#icon-filter2" />
        </svg>
    );
}