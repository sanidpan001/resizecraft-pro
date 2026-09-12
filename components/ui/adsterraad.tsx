import { useEffect, useRef, useState } from 'react';

interface Props {
  type: 'TOP' | 'BOTTOM';
}

const AdsterraAd = ({ type }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const adConfig = type === 'TOP' 
    ? { key: '4e68ac77881c17fe128a46565d9a4e8c', width: 728, height: 90 }
    : { key: 'a16c0fcd26ca339248720236d7830743', width: 468, height: 60 };

  useEffect(() => {
    // Mobile check
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Ad load
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const script1 = document.createElement('script');
      script1.innerHTML = `atOptions = { 'key' : '${adConfig.key}', 'format' : 'iframe', 'height' : ${adConfig.height}, 'width' : ${adConfig.width}, 'params' : {} };`;
      const script2 = document.createElement('script');
      script2.src = `https://www.highrevenueformat.com/${adConfig.key}/invoke.js`;
      script2.async = true;
      containerRef.current.appendChild(script1);
      containerRef.current.appendChild(script2);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [adConfig.key, adConfig.height, adConfig.width]);

  // Mobile pe kitna chota karna hai uska calculation
  const scale = isMobile 
    ? type === 'TOP' 
      ? Math.min(window.innerWidth / 728, 1) * 0.95 // 728 wala mobile pe ~320px ka ho jayega
      : Math.min(window.innerWidth / 468, 1) * 0.95 // 468 wala ~320px ka ho jayega
    : 1;

  return (
    <div className="w-full flex justify-center my-4 md:my-6 overflow-hidden">
      <div
        style={{
          width: adConfig.width,
          height: adConfig.height,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          marginBottom: isMobile ? `-${adConfig.height * (1 - scale)}px` : '0px',
        }}
      >
        <div ref={containerRef} />
      </div>
    </div>
  );
};

export default AdsterraAd;
