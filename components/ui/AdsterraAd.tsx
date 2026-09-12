"use client";
import { useEffect, useRef, useState } from 'react';

export default function AdsterraAd({ type }: { type: 'TOP' | 'BOTTOM' }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [screenWidth, setScreenWidth] = useState(728);

  // Tumhare 2 ad keys
  const adConfig = type === 'TOP' 
    ? { key: '4e68ac77881c17fe128a46565d9a4e8c', width: 728, height: 90 }
    : { key: 'a16c0fcd26ca339248720236d7830743', width: 468, height: 60 };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Ad load karna
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const script1 = document.createElement('script');
      script1.type = 'text/javascript';
      script1.innerHTML = `atOptions = { 'key' : '${adConfig.key}', 'format' : 'iframe', 'height' : ${adConfig.height}, 'width' : ${adConfig.width}, 'params' : {} };`;
      
      const script2 = document.createElement('script');
      script2.type = 'text/javascript';
      script2.src = `https://www.highrevenueformat.com/${adConfig.key}/invoke.js`;
      script2.async = true;

      containerRef.current.appendChild(script1);
      containerRef.current.appendChild(script2);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [adConfig.key, adConfig.width, adConfig.height]);

  // Mobile pe ad ko chota karne ka logic
  const isMobile = screenWidth < 768;
  const scale = isMobile ? (screenWidth - 20) / adConfig.width : 1;
  // scale 1 se zyada nahi hoga, aur 0.4 se kam bhi nahi
  const finalScale = Math.min(Math.max(scale, 0.45), 1);

  return (
    <div className="w-full flex justify-center items-center overflow-hidden my-3">
      <div
        style={{
          width: `${adConfig.width}px`,
          height: `${adConfig.height}px`,
          transform: `scale(${finalScale})`,
          transformOrigin: 'center top',
          // Mobile pe extra white space hatane ke liye
          marginBottom: isMobile ? `-${adConfig.height * (1 - finalScale)}px` : '0px',
        }}
      >
        <div ref={containerRef} />
      </div>
    </div>
  );
}
