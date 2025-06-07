import { useEffect, useState } from 'react';
import { useStore } from '@src/store/useStore';
import { getFromLocalStorage } from '@src/utils/saveData';

export const useDataInitializer = (): boolean => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { data, setData, syncFromApi } = useStore();
  
  const externalApiRead = data?.externalApi?.read;
  const saveInBrowser = data?.saveInBrowser;

  useEffect(() => {
    const init = async () => {
      if (externalApiRead) {
        await syncFromApi();
        setIsLoaded(true);
        return;
      }
      if (saveInBrowser) {
        const savedData = getFromLocalStorage();
        if (savedData) setData(savedData);
        setIsLoaded(true);
        return;
      }
      setIsLoaded(true);
    };

    init();
  }, [externalApiRead, saveInBrowser, setData, syncFromApi]);


  return isLoaded;

};
