type HeartIconProps = {
    size?: number;
    color?: string;
};

export default function HeartIcon({ size = 20, color = "red" }: HeartIconProps) {
    return (
        <svg width={size} height={size} fill={color}>
            <use href="#icon-heart" />
        </svg>
    );
}