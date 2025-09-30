type HeartIconProps = {
    size?: number;
    color?: string;
     className?: string;
};

export default function HeartIcon({ size = 20, color = "red",className = "", }: HeartIconProps) {
    return (
        <svg width={size} height={size} fill={color} className={className}>
            <use href="#icon-heart" />
        </svg>
    );
}