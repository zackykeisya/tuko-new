import { padTable } from '../../lib/helpers';

export const createTableSlice = (set, get) => ({
  tables: [],
  /** @returns {'ok'|'duplicate'|'invalid'} */
  addTable: ({ no, label }) => {
    const n = padTable(no);
    if (!n) return 'invalid';
    if (get().tables.some((t) => t.no === n)) return 'duplicate';
    set((s) => ({ tables: [...s.tables, { id: Date.now(), no: n, label: (label || '').trim() }] }));
    get().addLog('Meja ditambah: ' + n);
    return 'ok';
  },
  removeTable: (id) => {
    const t = get().tables.find((x) => x.id === id);
    set((s) => ({ tables: s.tables.filter((x) => x.id !== id) }));
    if (t) get().addLog('Meja dihapus: ' + t.no);
  },
});
