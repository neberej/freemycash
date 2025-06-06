import { useEffect, useState } from 'react';
import { useStore } from '@src/store/useStore';
import { getQuery } from '@src/utils/query';

export function useDemoLoader(): { isDemoReady: boolean } {
  const { data, setData, isDemo, setIsDemo } = useStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const demoFromURL = getQuery('demo') === 'true';
    if (demoFromURL) setIsDemo(true);
  }, [setIsDemo]);

  useEffect(() => {
    if (isDemo && !data) {
      fetch('finance-demo.json')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load demo data');
          return res.json();
        })
        .then((json) => setData(json))
        .catch((err) => console.error('Demo load error:', err))
        .finally(() => setIsReady(true));
    } else {
      setIsReady(true);
    }
  }, [isDemo, data, setData]);

  return { isDemoReady: isReady };
}
