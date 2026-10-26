import { seedMenu } from '../../lib/seed';

export const createMenuSlice = (set, get) => ({
  menu: seedMenu(),
  saveMenuItem: (m) => {
    if (m.id) set((s) => ({ menu: s.menu.map((x) => (x.id === m.id ? { ...x, ...m } : x)) }));
    else set((s) => ({ menu: [...s.menu, { hpp: 0, ...m, id: Date.now() }] }));
    get().addLog('Menu: ' + m.name);
  },
  toggleMenu: (id) => set((s) => ({ menu: s.menu.map((x) => (x.id === id ? { ...x, active: x.active === false } : x)) })),
  deleteMenu: (id) => set((s) => ({ menu: s.menu.filter((x) => x.id !== id) })),
});
