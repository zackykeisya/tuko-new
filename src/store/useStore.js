import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DATA_KEYS, STORAGE_KEY } from '../lib/constants';
import { normalize, tukoStorage } from '../lib/storage';
import { createExpenseSlice } from './slices/expenseSlice';
import { createLogSlice } from './slices/logSlice';
import { createMenuSlice } from './slices/menuSlice';
import { createSettingsSlice } from './slices/settingsSlice';
import { createShiftSlice } from './slices/shiftSlice';
import { createTabSlice } from './slices/tabSlice';
import { createTableSlice } from './slices/tableSlice';
import { createTransSlice } from './slices/transSlice';

export const useStore = create(
  persist(
    (...a) => ({
      ...createMenuSlice(...a),
      ...createShiftSlice(...a),
      ...createTransSlice(...a),
      ...createTabSlice(...a),
      ...createExpenseSlice(...a),
      ...createTableSlice(...a),
      ...createSettingsSlice(...a),
      ...createLogSlice(...a),
    }),
    {
      name: STORAGE_KEY,
      version: 0,
      storage: createJSONStorage(() => tukoStorage),
      partialize: (s) => Object.fromEntries(DATA_KEYS.map((k) => [k, s[k]])),
      merge: (persisted, current) => ({ ...current, ...normalize(persisted) }),
    },
  ),
);
