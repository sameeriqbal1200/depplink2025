import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { DotButton, useDotButton } from './EmblaCarouselDotButton';

const NewMedia2 = process.env.NEXT_PUBLIC_NEW_MEDIA2 

const CountDown = dynamic(() => import('../CountDown'), { ssr: false });

type SlideType = {
  featured_image_app?: { image: string };
  featured_image_web?: { image: string };
  alt_ar?: string;
  alt?: string;
  name_ar?: string;
  name?: string;
  timer?: number;
  redirection_type?: number;
  brand?: { slug: string };
  pro?: { slug: string };
  cat?: { slug: string };
  custom_link?: string;
  groupImages?: boolean;
  additionalClass?: boolean;
};

type PropType = {
  slides: SlideType[];
  lang: string;
  devicetype: any;
  options?: EmblaOptionsType;
  roundedClassName?: string;
  categoryClassName?: string;
  groupImages?: boolean;
  additionalClass?: boolean;
  delayTimer: number;
};

const EmblaCarousel: React.FC<PropType> = ({
  slides,
  lang,
  devicetype,
  options = {},
  roundedClassName = '',
  categoryClassName = '',
  groupImages = false,
  additionalClass = false,
  delayTimer = 6000,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay({ playOnInit: true, delay: delayTimer })]);
  const [isPlaying, setIsPlaying] = useState(false);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const heightCenterSlides = "min-h-32 h-32"
  // min-h-[6.3rem] h-[6.3rem]

  const getLink = (item: SlideType): string => {
    const baseUrl = `${origin}/${lang}`;
    switch (item.redirection_type) {
      case 0:
        return `${baseUrl}/brand/${item.brand?.slug}`;
      case 2:
        return `${baseUrl}/product/${item.pro?.slug}`;
      case 3:
        return `${baseUrl}/category/${item.cat?.slug}`;
      case 4:
        return `${baseUrl}/${item.custom_link}`;
      default:
        return baseUrl;
    }
  };

  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay as { isPlaying: () => boolean; stop: () => void; play: () => void } | undefined;
    if (!autoplay) return;

    if (autoplay.isPlaying()) autoplay.stop();
    else autoplay.play();
  }, [emblaApi]);

  useEffect(() => {
    const autoplay = emblaApi?.plugins()?.autoplay as { isPlaying: () => boolean } | undefined;
    if (autoplay) setIsPlaying(autoplay.isPlaying());
  }, [emblaApi]);

  return (
    <>
      {!groupImages ?
        <div className={`relative ${additionalClass ? `emblafull` : `embla`}  ${categoryClassName}`}>
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {slides?.map((item: any, index: any) => (
                <div className="embla__slide relative" key={index}>
                  <Link href={getLink(item)} className="relative">
                    <Image
                      src={
                        devicetype === 'mobile'
                          ? item.featured_image_app?.image
                            ? NewMedia2 + item.featured_image_app.image
                            : 'https://via.placeholder.com/800x600'
                          : item.featured_image_web?.image
                            ? NewMedia2 + item.featured_image_web.image
                            : 'https://via.placeholder.com/800x600'
                      }
                      alt={lang === 'ar' ? item.name_ar || '' : item.name || ''}
                      title={lang === 'ar' ? item.name_ar || '' : item.name || ''}
                      height={0}
                      width={0}
                      sizes="(min-width: 808px) 50vw, 100vw"
                      className={`w-full ${roundedClassName}`}
                      priority
                    />
                  </Link>
                  {item.timer && <CountDown lang={lang} timer={item.timer} devicetype={devicetype} />}
                </div>
              ))}
            </div>
          </div>

          {/* {slides.length > 1 && (
        <>
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </>
      )} */}

          <div className="embla__dots">
            {slides?.map((item: any, index: any) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                aria-label={lang === 'ar' ? item.name_ar || '' : item.name || ''}
                aria-selected={index === selectedIndex}
                className={`embla__dot${index === selectedIndex ? ' embla__dot--selected' : ''}`}
              />
            ))}
          </div>
        </div>
        :
        <div className={`relative ${additionalClass ? `emblafull` : `embla`}  ${categoryClassName}`}>
          <div className="" ref={emblaRef}>
            <div className="embla__container">
              {slides?.reduce<any>((acc, _, index) => {
                if (index % 2 === 0) {
                  acc.push(
                    <div className="embla__slide relative" key={index}>
                      {/* First Image */}
                      {slides[index] && (
                        <Link href={getLink(slides[index])} className="">
                          <div
                            style={{
                              backgroundImage: `url(${`${NewMedia2}${slides[index]?.featured_image_app?.image}`})`,
                            }}
                            className={`bg-contain bg-no-repeat bg-center w-auto rounded-md ${heightCenterSlides}`}
                          ></div>
                        </Link>
                      )}

                      {/* Second Image */}
                      {/* {slides[index + 1] && (
                        <Link href={getLink(slides[index + 1])} className="">
                          <div
                            style={{
                              backgroundImage: `url(${NewMedia2 + slides[index + 1]?.featured_image_app?.image})`,
                            }}
                            className={`bg-contain bg-no-repeat bg-center w-auto rounded-md ${heightCenterSlides}`}
                          ></div>
                        </Link>
                      )} */}
                    </div>
                  );
                }
                return acc;
              }, [])}
            </div>
          </div>

          <div className="embla__dots">
            {Array.from({ length: Math.ceil(slides.length / 2) }).map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                aria-label={`Slide ${index + 1}`}
                aria-selected={index === selectedIndex}
                className={`embla__dot${index === selectedIndex ? ' embla__dot--selected' : ''}`}
              />
            ))}
          </div>

        </div>

      }
    </>
  );
};

export default EmblaCarousel;