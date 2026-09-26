import { useLayoutEffect, useRef, useState } from 'react';
import BrandStar from './BrandStar';

const PIXELS_PER_SECOND = 20;

export default function BrandTicker() {
  const containerRef = useRef(null);
  const copyRef = useRef(null);
  const [layout, setLayout] = useState({ copies: 2, distance: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const width = containerRef.current.clientWidth;
      const distance = copyRef.current.getBoundingClientRect().width;
      if (!distance) return;
      // Cover the viewport plus the entire distance traveled during a loop.
      const copies = Math.ceil(width / distance) + 2;
      setLayout(previous => previous.copies === copies && previous.distance === distance
        ? previous : { copies, distance });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    observer.observe(copyRef.current);
    measure();
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ticker" ref={containerRef} role="img" aria-label="Estilo propio, sin permiso, hecho en Chile">
      <div className="ticker-track" aria-hidden="true" style={{
        '--ticker-distance': `${-layout.distance}px`,
        '--ticker-duration': `${layout.distance / PIXELS_PER_SECOND}s`,
      }}>
        {Array.from({ length: layout.copies }, (_, i) => (
          <div className="ticker-copy" key={i} ref={i === 0 ? copyRef : undefined}>
            <span>ESTILO PROPIO</span><span className="ticker-star"><BrandStar /></span>
            <span>SIN PERMISO</span><span className="ticker-star"><BrandStar /></span>
            <span>HECHO EN CHILE</span><span className="ticker-star"><BrandStar /></span>
          </div>
        ))}
      </div>
    </div>
  );
}
