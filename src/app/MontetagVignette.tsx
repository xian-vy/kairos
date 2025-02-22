"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    _rpozx?: () => void;
    _rrapc?: () => void;
  }
}

export default function MontetagVignette() {
  useEffect(() => {
    // Define _rpozx before loading vignette2.js
    window._rpozx = () => {
      const initScript = () => {
        const d = 'stoampaliy.net';
        const z = 8990774;
        const s = document.createElement('script');
        s.src = `//${d}/400/${z}`;
        
        const handleLoad = () => {
          if (typeof window._rrapc === 'function') {
            window._rrapc();
          }
        };

        s.onload = handleLoad;
        s.onerror = handleLoad;

        try {
          (document.body || document.documentElement).appendChild(s);
        } catch (e) {
          console.error(e);
          handleLoad();
        }
      };
    initScript();
    };
  }, []);

  return (
    <>
      <Script src="/vignette.js" strategy="lazyOnload" />
      <Script src="/vignette2.js" strategy="lazyOnload" 
        onLoad={() => {
          if (typeof window._rpozx === "function") {
            window._rpozx();
          }
        }}
      />
    </>
  );
}
