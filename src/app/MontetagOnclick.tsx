"use client";

import Script from "next/script";

declare global {
  interface Window {
    _jhhlcww?: () => void;
    _gjwbbza?: () => void;
  }
}

export default function MonetagOnclick() {
  return (
    <>
      <Script src="/onclickpopunder.js" strategy="lazyOnload" />
      <Script
        src="//soostewiphy.net/tag.min.js"
        data-cfasync="false"
        data-zone="8989616"
        async
        onLoad={() => {
          if (typeof window._gjwbbza === "function") {
            window._gjwbbza();
          }
        }}
        onError={() => {
          if (typeof window._jhhlcww === "function") {
            window._jhhlcww();
          }
        }}
      />
    </>
  );
}
