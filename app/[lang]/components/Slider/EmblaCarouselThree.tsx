import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ClassNames from 'embla-carousel-class-names';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { NextButton, PrevButton, usePrevNextButtons } from './EmblaCarouselArrowButtons';
import { DotButton, useDotButton } from './EmblaCarouselDotButton';

const NewMedia = process.env.NEXT_PUBLIC_NEW_MEDIA

const CountDown = dynamic(() => import('../CountDown'), { ssr: false });

type Slide = {
    featured_image_app?: { image: string };
    featured_image_web?: { image: string };
    alt?: string;
    alt_ar?: string;
    name?: string;
    name_ar?: string;
    timer?: any;
    redirection_type: number;
    brand?: { slug: string };
    pro?: { slug: string };
    cat?: { slug: string };
    custom_link?: string;
};

type PropType = {
    slides: Slide[];
    lang: 'ar' | 'en';
    devicetype: 'mobile' | 'desktop';
    options?: EmblaOptionsType;
};

const getLinkHref = (item: Slide, origin: string, lang: string): string => {
    switch (item.redirection_type) {
        case 0:
            return `${origin}/${lang}/brand/${item.brand?.slug}`;
        case 2:
            return `${origin}/${lang}/product/${item.pro?.slug}`;
        case 3:
            return `${origin}/${lang}/category/${item.cat?.slug}`;
        case 4:
            return `${origin}/${lang}/${item.custom_link}`;
        default:
            return `${origin}/${lang}`;
    }
};

const Slide: React.FC<{ item: Slide; lang: 'ar' | 'en'; devicetype: 'mobile' | 'desktop'; origin: string }> = ({ item, lang, devicetype, origin }) => {
    const imageSrc = devicetype === 'mobile'
        ? item?.featured_image_app?.image
        : item?.featured_image_web?.image;

    return (
        <div className="embla__slide relative">
            <Link href={getLinkHref(item, origin, lang)}>
                <Image
                    src={imageSrc ? NewMedia + imageSrc : '/fallback-image.png'}
                    alt={lang === 'ar' ? item.name_ar || 'Default Arabic Alt Text' : item.name || 'Default Alt Text'}
                    title={lang === 'ar' ? item.name_ar : item.name}
                    width={800}
                    height={450}
                    className="w-full h-auto rounded-lg"
                    quality={100}
                    priority
                />
            </Link>
            {item.timer && <CountDown lang={lang} timer={item.timer} devicetype={devicetype} />}
        </div>
    );
};

const Controls: React.FC<{
    emblaApi: EmblaCarouselType | undefined;
    prevDisabled: boolean;
    nextDisabled: boolean;
}> = ({ emblaApi, prevDisabled, nextDisabled }) => {
    const onPrevButtonClick = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const onNextButtonClick = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    return (
        <div className="embla__buttons">
            <PrevButton onClick={onPrevButtonClick} disabled={prevDisabled} aria-label="Previous slide"  />
            <NextButton onClick={onNextButtonClick} disabled={nextDisabled} aria-label="Next slide" />
        </div>
    );
};

const EmblaCarouselThree: React.FC<PropType> = ({ slides, lang, devicetype, options }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay({ playOnInit: true, delay: 3000 }), ClassNames()]);
    const [isPlaying, setIsPlaying] = useState(false);

    const origin = useMemo(() => {
        return typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : '';
    }, []);

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
    const { prevBtnDisabled, nextBtnDisabled } = usePrevNextButtons(emblaApi);

    const autoplayPlugin = Autoplay({ playOnInit: true, delay: 3000 });
    // const [emblaRef, emblaApi] = useEmblaCarousel(options, [autoplayPlugin, ClassNames()]);

    useEffect(() => {
        if (!emblaApi) return;

        const isPlaying = autoplayPlugin.isPlaying();
        setIsPlaying(isPlaying);
    }, [emblaApi, autoplayPlugin]);
    if (!slides || slides.length === 0) return <div>No slides available</div>;

    return (
        <div className={`embla__three${devicetype === 'mobile' ? '_mobile' : ''} relative`}>
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((item, i) => (
                        <Slide key={i} item={item} lang={lang} devicetype={devicetype} origin={origin} />
                    ))}
                </div>
            </div>
            {devicetype !== 'mobile' && (
                <div className="embla__controls">
                    <Controls emblaApi={emblaApi} prevDisabled={prevBtnDisabled} nextDisabled={nextBtnDisabled} />
                </div>
            )}
        </div>
    );
};

export default EmblaCarouselThree;