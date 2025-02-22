"use client";

import Script from "next/script";

declare global {
  interface Window {
    _bqwiibm?: () => void;
    _qexrgj?: () => void;
    _jhhlcww?: () => void;
    _gjwbbza?: () => void;
  }
}

export default function MonetagAds() {
  return (
    <>
      {/* Load custom ads.js script */}
      <Script src="/pushnotification.js" strategy="lazyOnload" />
      <Script src="/onclickpopunder.js" strategy="lazyOnload" />

      {/* Load Monetag script */}
      <Script
        src="//upskittyan.com/ntfc.php?p=8989612"
        data-cfasync="false"
        async
        onLoad={() => {
          if (typeof window._bqwiibm === "function") {
            window._bqwiibm();
          }
        }}
        onError={() => {
          if (typeof window._qexrgj === "function") {
            window._qexrgj();
          }
        }}
      />

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
