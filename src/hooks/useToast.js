import { create } from 'zustand';

let timer;
const useToastStore = create((set) => ({
  msg: '',
  show: (msg) => {
    set({ msg });
    clearTimeout(timer);
    timer = setTimeout(() => set({ msg: '' }), 2000);
  },
}));

export const useToast = () => useToastStore((s) => s.show);
export const useToastMessage = () => useToastStore((s) => s.msg);
