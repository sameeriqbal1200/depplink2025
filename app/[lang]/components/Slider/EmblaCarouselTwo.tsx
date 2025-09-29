import React, { useCallback, useEffect, useState } from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
    NextButton,
    PrevButton,
    usePrevNextButtons
} from './EmblaCarouselArrowButtons';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ClassNames from 'embla-carousel-class-names';
import { DotButton, useDotButton } from './EmblaCarouselDotButton';

const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA

const CountDown = dynamic(() => import('../CountDown'), { ssr: false });

type SlideType = {
    featured_image_app?: { image: string };
    featured_image_web?: { image: string };
    redirection_type?: number;
    brand?: { slug: string };
    pro?: { slug: string };
    cat?: { slug: string };
    custom_link?: string;
    timer?: any;
    alt?: string;
    alt_ar?: string;
    name?: string;
    name_ar?: string;
};

type PropType = {
    slides: SlideType[];
    lang: string;
    devicetype: 'mobile' | 'desktop';
    options?: EmblaOptionsType;
};

type AutoplayPlugin = {
    play: () => void;
    stop: () => void;
    reset: () => void;
    isPlaying: () => boolean;
};


const EmblaCarouselTwo: React.FC<PropType> = ({ slides, options, lang, devicetype }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
        Autoplay({ playOnInit: true, delay: 3000 }),
        ClassNames(),
    ]);
    const [isPlaying, setIsPlaying] = useState(false);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

    const handleAutoplayAction = useCallback((action: 'play' | 'stop' | 'reset') => {
        const autoplay = emblaApi?.plugins()?.autoplay as unknown as AutoplayPlugin;
        if (!autoplay) return;

        const actions = {
            play: autoplay.play,
            stop: autoplay.stop,
            reset: autoplay.reset,
        };

        actions[action]?.(); // Safely call the action
    }, [emblaApi]);

    const toggleAutoplay = useCallback(() => {
        const autoplay = emblaApi?.plugins()?.autoplay as unknown as AutoplayPlugin;
        if (!autoplay) return;

        if (autoplay.isPlaying()) {
            autoplay.stop();
        } else {
            autoplay.play();
        }
    }, [emblaApi]);

    useEffect(() => {
        const autoplay = emblaApi?.plugins()?.autoplay as unknown as AutoplayPlugin;
        if (autoplay) {
            setIsPlaying(autoplay.isPlaying());
        }
    }, [emblaApi]);

    const getRedirectionLink = (item: SlideType): string => {
        const baseUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
        switch (item.redirection_type) {
            case 0: return `${baseUrl}/${lang}/brand/${item.brand?.slug}`;
            case 2: return `${baseUrl}/${lang}/product/${item.pro?.slug}`;
            case 3: return `${baseUrl}/${lang}/category/${item.cat?.slug}`;
            case 4: return `${baseUrl}/${lang}/${item.custom_link}`;
            default: return baseUrl;
        }
    };

    const getImageSrc = (item: SlideType, isMobile: boolean): string => (
        isMobile ? NewMedia + item.featured_image_web?.image : NewMedia + item.featured_image_web?.image
    ) || 'https://partners.tamkeenstores.com.sa/public/assets/new-media/3f4a05b645bdf91af2a0d9598e9526181714129744.png';

    return (
        <div className={devicetype === 'mobile' ? 'embla relative' : 'embla__two relative'}>
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides?.map((item, i) => (
                        <div className="embla__slide relative" key={i}>
                            <Link href={getRedirectionLink(item)}>
                                <Image
                                    src={getImageSrc(item, devicetype === 'mobile')}
                                    alt={lang === 'ar' ? item.name_ar || 'Default alt text' : item.name || 'Default alt text'}
                                    title={lang === 'ar' ? item.name_ar : item.name}
                                    width={0}
                                    height={0}
                                    sizes="(min-width: 808px) 50vw, 100vw"
                                    className="w-full h-auto rounded-lg"
                                    quality={100}
                                    priority
                                />
                            </Link>
                            {item.timer && (
                                <CountDown lang={lang} timer={item.timer} devicetype={devicetype} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {devicetype !== 'mobile' && (
                <div className="embla__controls">
                    <div className="embla__buttons">
                        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                    </div>
                </div>
            )}
            <div className="embla__dots hidden">
                {slides?.map((item, index) => (
                    <DotButton
                        key={index}
                        onClick={() => onDotButtonClick(index)}
                        aria-label={lang === 'ar' ? item.name_ar : item.name}
                        aria-selected={index === selectedIndex}
                        className={`embla__dot${index === selectedIndex ? ' embla__dot--selected' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default EmblaCarouselTwo;