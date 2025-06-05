import { useEffect } from 'react';
import { useStore } from '@src/store/useStore';

export const useLocalStorageSync = (setIsLoaded: (val: boolean) => void) => {
  const { data, setData } = useStore();

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('financialData');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse saved data:', e);
      }
    }
    setIsLoaded(true);
  }, [setData, setIsLoaded]);

  // Save to localStorage on data change
  useEffect(() => {
    if (data?.saveInBrowser) {
      localStorage.setItem('financialData', JSON.stringify(data));
    }
  }, [data]);
};
