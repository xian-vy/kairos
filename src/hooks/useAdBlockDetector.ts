import { useState, useEffect } from 'react';

export const useAdBlockDetector = () => {
  const [isAdBlockEnabled, setIsAdBlockEnabled] = useState<boolean>(false);

  useEffect(() => {
    const detectAdBlock = async () => {
      try {
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox';
        document.body.appendChild(testAd);

        // Wait for browser to process the ad element
        await new Promise(resolve => setTimeout(resolve, 100));

        const isBlocked = testAd.offsetHeight === 0;
        setIsAdBlockEnabled(isBlocked);
        document.body.removeChild(testAd);
      } catch (e) {
        console.error('Error detecting ad block', e);
        setIsAdBlockEnabled(true);
      }
    };

    detectAdBlock();
  }, []);

  return isAdBlockEnabled;
};