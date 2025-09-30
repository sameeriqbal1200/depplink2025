'use client';

import React, { useEffect, useRef, useMemo } from 'react';

type LottieSource = string | Record<string, any>;

export type LottieAnimationProps = {
    /** JSON object or a URL to a .json animation */
    src: LottieSource;
    /** Play in a loop */
    loop?: boolean;
    /** Autoplay on mount */
    autoplay?: boolean;
    /** Playback speed (1 = normal) */
    speed?: number;
    /** Pause when scrolled out of view (saves battery/CPU) */
    playWhenVisible?: boolean;
    /** Optional width/height if you’re not styling via className */
    width?: number | string;
    height?: number | string;
    /** Extra styling / classes */
    className?: string;
    style?: React.CSSProperties;
    /** A11y */
    ariaLabel?: string;
    /** Fires when the animation finishes (for non-looping) */
    onComplete?: () => void;
};

const LottieAnimation: React.FC<LottieAnimationProps> = ({
    src,
    loop = true,
    autoplay = true,
    speed = 1,
    playWhenVisible = true,
    width,
    height,
    className,
    style,
    ariaLabel = 'Animated illustration',
    onComplete,
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const animationRef = useRef<any>(null);
    const prefersReducedMotion = useMemo(
        () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
        []
    );

    // Derived flags
    const shouldAutoplay = autoplay && !prefersReducedMotion;
    const shouldObserve = playWhenVisible && !prefersReducedMotion;

    useEffect(() => {
        let isCancelled = false;
        let io: IntersectionObserver | null = null;

        async function init() {
            const lottie = (await import('lottie-web')).default; // lazy-load on client only
            if (!containerRef.current || isCancelled) return;

            // Build options
            const isUrl = typeof src === 'string';
            const animation = lottie.loadAnimation({
                container: containerRef.current,
                renderer: 'svg',
                loop,
                autoplay: shouldAutoplay,
                animationData: isUrl ? undefined : (src as Record<string, any>),
                path: isUrl ? (src as string) : undefined,
                rendererSettings: {
                    preserveAspectRatio: 'xMidYMid meet',
                    progressiveLoad: true,
                    hideOnTransparent: true,
                    className: 'lottie-svg',
                },
            });

            animationRef.current = animation;
            animation.setSpeed(speed);

            const handleComplete = () => onComplete?.();
            animation.addEventListener('complete', handleComplete);

            // Pause/play when visible
            if (shouldObserve && 'IntersectionObserver' in window) {
                io = new IntersectionObserver(
                    entries => {
                        const [entry] = entries;
                        if (!animationRef.current) return;
                        if (entry.isIntersecting) {
                            // Only resume if not already playing (avoid replays in non-looping)
                            if (loop || animationRef.current.isPaused) animationRef.current.play();
                        } else {
                            animationRef.current.pause();
                        }
                    },
                    { root: null, rootMargin: '0px', threshold: 0.01 }
                );
                io.observe(containerRef.current);
            } else if (prefersReducedMotion) {
                animation.pause();
            }

            // Cleanup
            return () => {
                animation.removeEventListener('complete', handleComplete);
                animation.destroy();
            };
        }

        init();

        return () => {
            isCancelled = true;
            if (io) {
                io.disconnect();
                io = null;
            }
            if (animationRef.current) {
                animationRef.current.destroy();
                animationRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src, loop, shouldAutoplay, shouldObserve, prefersReducedMotion]);

    // Keep speed in sync if prop changes
    useEffect(() => {
        if (animationRef.current) {
            animationRef.current.setSpeed(speed);
        }
    }, [speed]);

    return (
        <div
            ref={containerRef}
            role="img"
            aria-label={ariaLabel}
            className={className}
            style={{
                width: width ?? '100%',
                height: height ?? '100%',
                outline: 'none',
                ...style,
            }}
        />
    );
};

export default LottieAnimation;