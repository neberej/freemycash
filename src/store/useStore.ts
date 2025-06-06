
import { create } from 'zustand';
import { FinancialData } from '@src/types';
import { readFromApi, writeToApi } from '@src/utils/externalApi';
import { saveToLocalStorage, getFromLocalStorage } from '@src/utils/saveData';

type State = {
  data: FinancialData | null;
  isModified: boolean;
  setData: (data: FinancialData | null) => void;
  setIsModified: (setIsModified: boolean) => void;
  syncFromApi: () => Promise<void>;
  syncToApi: () => Promise<void>;
};

export const useStore = create<State>((set, get) => ({
  data: null,
  isModified: false,
  setData: (data) => {
    //console.log("saving data..", data)
    set({ data });
    if (data?.saveInBrowser) saveToLocalStorage(data);
  },
  setIsModified: (isModified: boolean) => set({ isModified }),
  syncFromApi: async () => {
    const url = get().data?.externalApi?.read;
    if (url) {
      const result = await readFromApi(url);
      set({ data: result });
    }
  },
  syncToApi: async () => {
    const { data } = get();
    const url = data?.externalApi?.write;
    if (data && url) {
      await writeToApi(url, data);
    }
  },
}));
