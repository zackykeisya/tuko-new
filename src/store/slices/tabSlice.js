export const createTabSlice = (set) => ({
  tabs: [],
  addTab: (tab) => set((s) => ({ tabs: [...s.tabs, tab] })),
  removeTab: (id) => set((s) => ({ tabs: s.tabs.filter((t) => t.id !== id) })),
});
