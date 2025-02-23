import { useState, useEffect } from 'react';

export const useAdBlockDetector = () => {
  const [isAdBlockEnabled, setIsAdBlockEnabled] = useState<boolean>(false);

  useEffect(() => {
    const detectAdBlock = async () => {
      try {
        // Method 1: Check for common ad element
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox ad-placement ad-unit';
        document.body.appendChild(testAd);

        // Method 2: Create bait element
        const bait = document.createElement('div');
        bait.setAttribute('style', 'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;');
        bait.setAttribute('class', 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links');
        document.body.appendChild(bait);

        // Wait for browser to process the elements
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if either element is hidden or removed
        const isBlocked = 
          testAd.offsetHeight === 0 || 
          testAd.offsetParent === null ||
          bait.offsetHeight === 0 || 
          bait.offsetParent === null ||
          window.getComputedStyle(testAd).display === 'none' ||
          window.getComputedStyle(bait).display === 'none';

        setIsAdBlockEnabled(isBlocked);
        
        // Clean up
        document.body.removeChild(testAd);
        document.body.removeChild(bait);
      } catch (e) {
        console.error('Error detecting ad block', e);
        setIsAdBlockEnabled(true);
      }
    };

    detectAdBlock();
  }, []);

  return isAdBlockEnabled;
};