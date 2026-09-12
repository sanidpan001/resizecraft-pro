"use client";

import { useEffect, useRef, useState } from 'react';

const adsterraad = ({ type }: { type: 'TOP' | 'BOTTOM' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const adConfig = type === 'TOP' 
    ? { key: '4e68ac77881c17fe128a46565d9a4e8c', width: 728, height: 90 }
    : { key: 'a16c0fcd26ca339248720236d7830743', width: 468, height: 60 };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const s1 = document.createElement('script');
      s1.innerHTML = `atOptions = { 'key' : '${adConfig.key}', 'format' : 'iframe', 'height' : ${adConfig.height}, 'width' : ${adConfig.width}, 'params' : {} };`;
      const s2 = document.createElement('script');
      s2.src = `https://www.highrevenueformat.com/${adConfig.key}/invoke.js`;
      s2.async = true;
      containerRef.current.appendChild(s1);
      containerRef.current.appendChild(s2);
    }
    return () => window.removeEventListener('resize', checkMobile);
  }, [adConfig.key, adConfig.height, adConfig.width]);

  const scale = isMobile ? Math.min(window.innerWidth / adConfig.width, 1) * 0.95 : 1;

  return (
    <div className="w-full flex justify-center my-4 overflow-hidden">
      <div style={{ width: adConfig.width, height: adConfig.height, transform: `scale(${scale})`, transformOrigin: 'top center', marginBottom: isMobile ? `-${adConfig.height * (1 - scale)}px` : '0px' }}>
        <div ref={containerRef} />
      </div>
    </div>
  );
};

export default adsterraad;
