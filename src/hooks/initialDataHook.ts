import { useEffect, useState } from 'react';
import { useStore } from '@src/store/useStore';
import { getFromLocalStorage } from '@src/utils/saveData';

export const useDataInitializer = (): boolean => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { setData, syncFromApi } = useStore();

  useEffect(() => {
    const init = async () => {
      const savedData = getFromLocalStorage();

      if (savedData?.externalApi?.read) {
        await syncFromApi();
        setIsLoaded(true);
        return;
      }

      if (savedData?.saveInBrowser) {
        setData(savedData);
        setIsLoaded(true);
        return;
      }

      setIsLoaded(true);
    };

    init();
  }, []);

  return isLoaded;
};
