import { useEffect, useRef, useState } from 'react';

export const useInView = (options = {}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (options?.once) {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      } else {
        setInView(entry.isIntersecting);
      }
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return {
    inView,
    ref,
  };
};
