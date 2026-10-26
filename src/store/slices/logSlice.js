import { now } from '../../lib/helpers';

export const createLogSlice = (set) => ({
  log: [],
  addLog: (a) => set((s) => ({ log: [{ a, ts: now() }, ...s.log].slice(0, 200) })),
});
