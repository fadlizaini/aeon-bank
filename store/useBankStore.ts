import { create } from 'zustand';
import { MOCK_RESPONSE } from '../constants/mocks';
import { APP_CONFIG } from '../constants/config';

export interface Transaction {
  refId: string;
  transferDate: string;
  recipientName: string;
  transferName: string;
  amount: number;
}

interface BankState {
  isAuthenticated: boolean;
  transactions: Transaction[];
  isLoading: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  fetchTransactions: () => Promise<void>;
}

export const useBankStore = create<BankState>((set) => ({
  isAuthenticated: false,
  transactions: [],
  isLoading: false,

  login: async (pin: string) => {
    set({ isLoading: true });
    return new Promise((resolve) => {
      setTimeout(() => {
        if (pin === APP_CONFIG.MOCK_PIN) {
          set({ isAuthenticated: true, isLoading: false });
          resolve(true);
        } else {
          set({ isLoading: false });
          resolve(false);
        }
      }, APP_CONFIG.API_DELAY_LOGIN);
    });
  },

  logout: () => set({ isAuthenticated: false, transactions: [] }),

  fetchTransactions: async () => {
    set({ isLoading: true });
    return new Promise((resolve) => {
      setTimeout(() => {
        const sortedData = [...MOCK_RESPONSE.data].sort(
          (a, b) => new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime()
        );
        set({ transactions: sortedData, isLoading: false });
        resolve();
      }, APP_CONFIG.API_DELAY_FETCH);
    });
  }
}));