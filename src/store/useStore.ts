
import { create } from 'zustand';
import { FinancialData } from '@src/types';
import { getData, postData } from '@src/utils/api';
import { saveToLocalStorage } from '@src/utils/saveData';
import messages from '@src/static/messages.json';

type State = {
  data: FinancialData | null;
  isModified: boolean;
  isDemo: boolean;
  notification: { message: string; type: 'success' | 'error' } | null;
  setData: (data: FinancialData | null) => void;
  setIsModified: (setIsModified: boolean) => void;
  syncFromApi: () => Promise<void>;
  syncToApi: () => Promise<void>;
  setIsDemo: (setIsModified: boolean) => void;
  setNotification: (notification: { message: string; type: 'success' | 'error' } | null) => void;
};

export const useStore = create<State>((set, get) => ({
  data: null,
  isDemo: false,
  isModified: false,
  notification: null,
  setData: (data) => {
    //console.log("saving data..", data)
    set({ data });
    if (data?.saveInBrowser) saveToLocalStorage(data);
  },
  setIsModified: (isModified: boolean) => set({ isModified }),
  syncFromApi: async () => {
    const readUrl = get().data?.externalApi?.read;
    if (!readUrl) return; 
    const setNotification = get().setNotification;
    try {
      const result = await getData<FinancialData>(readUrl);
      if (result) {
        set({ data: result });
        setNotification({ message: messages.readApi.success, type: 'success' });
      } else {
        setNotification({ message: messages.readApi.failed, type: 'error' });
      }
    } catch (e) {
      setNotification({ message: messages.readApi.failed, type: 'error' });
    }
  },
  syncToApi: async () => {
    const { data, setNotification } = get();
    const writeUrl = data?.externalApi?.write;
    if (!writeUrl) return; 
    try {
      const result = await postData(writeUrl, data);
      if (result) {
        setNotification({ message: messages.writeApi.success, type: 'success' });
      } else {
        setNotification({ message: messages.writeApi.failed, type: 'error' });
      }
    } catch (e) {
      setNotification({ message: messages.writeApi.failed, type: 'error' });
    }
  },
  setIsDemo: (isDemo: boolean) => set({ isDemo }),
  setNotification: (notification) => set({ notification })
}));
