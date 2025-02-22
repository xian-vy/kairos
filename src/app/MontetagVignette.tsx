"use client";

import Script from "next/script";

export default function MontetagVignette() {
  return (
    <>
      <Script src="/vignette.js" strategy="lazyOnload" />
      <Script src="/vignette2.js" strategy="lazyOnload" />
    </>
  );
}
