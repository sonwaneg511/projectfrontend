'use client';

import { Slot } from '@radix-ui/react-slot';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const CarouselContext = createContext(null);

export const useCarousel = () => {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used inside Carousel');
  }

  return context;
};

export const Carousel = ({ children, gap = 24 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pages, setPages] = useState(1);

  const [canScrollPrev, setCanScrollPrev] = useState(false);

  const [canScrollNext, setCanScrollNext] = useState(true);

  const containerRef = useRef(null);

  const updateScrollState = () => {
    const container = containerRef.current;

    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    setCanScrollPrev(container.scrollLeft > 0);

    setCanScrollNext(container.scrollLeft < maxScrollLeft - 2);
  };

  const getScrollAmount = () => {
    const container = containerRef.current;

    if (!container) return 0;

    const firstCard = container.children[0];

    if (!firstCard) return 0;

    return firstCard.offsetWidth + gap;
  };

  const handleScroll = () => {
    const container = containerRef.current;

    if (!container) return;

    const scrollAmount = getScrollAmount();

    const index = Math.round(container.scrollLeft / scrollAmount);

    setActiveIndex(index);

    updateScrollState();
  };

  const scroll = (direction) => {
    const container = containerRef.current;

    if (!container) return;

    const scrollAmount = getScrollAmount();

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const contextValue = {
    activeIndex,
    pages,
    canScrollPrev,
    canScrollNext,
    scroll,
    containerRef,
    handleScroll,
    gap,
  };

  useEffect(() => {
    const calculatePages = () => {
      const container = containerRef.current;

      if (!container) return;

      const scrollAmount = getScrollAmount();

      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      const totalPages = Math.round(maxScrollLeft / scrollAmount) + 1;

      setPages(totalPages);

      updateScrollState();
    };

    calculatePages();

    window.addEventListener('resize', calculatePages);

    return () => {
      window.removeEventListener('resize', calculatePages);
    };
  }, [getScrollAmount, updateScrollState]);

  return (
    <CarouselContext.Provider value={contextValue}>
      {children}
    </CarouselContext.Provider>
  );
};

export const CarouselContent = ({ children, asChild = false, className }) => {
  const { containerRef, handleScroll, gap } = useCarousel();
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      style={{
        gap: `${gap}px`,
      }}
      ref={containerRef}
      onScroll={handleScroll}
      className={cn(
        'flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overflow-y-hidden',
        className
      )}
    >
      {children}
    </Comp>
  );
};

export const CarouselIndicator = ({ className }) => {
  const { pages, activeIndex } = useCarousel();

  return (
    <div className={cn('flex items-center gap-1 md:gap-2', className)}>
      {Array.from({ length: pages }).map((_, idx) => {
        const isActive = activeIndex === idx;

        return (
          <div
            key={idx}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              isActive ? 'bg-brand-500 w-4 md:w-8' : 'w-2 bg-gray-500'
            )}
          />
        );
      })}
    </div>
  );
};

export const CarouselNavigation = ({ className }) => {
  const { canScrollPrev, canScrollNext, scroll } = useCarousel();

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <button
        disabled={!canScrollPrev}
        onClick={() => {
          scroll('left');
        }}
        className='cursor-pointer disabled:cursor-not-allowed'
      >
        <ChevronLeftIcon
          className={canScrollPrev ? 'text-brand-500' : 'text-gray-400'}
        />
      </button>

      <button
        disabled={!canScrollNext}
        onClick={() => {
          scroll('right');
        }}
        className='cursor-pointer disabled:cursor-not-allowed'
      >
        <ChevronRightIcon
          className={cn(canScrollNext ? 'text-brand-500' : 'text-gray-400')}
        />
      </button>
    </div>
  );
};
