import { useCallback, useState } from 'react';
import { SESSION_KEY } from '../lib/constants';
import { padTable } from '../lib/helpers';

export const readSessionTable = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.tableNo) return s;
    }
    // Kompatibilitas link lama: /?meja=3
    const q = new URLSearchParams(window.location.search);
    const legacy = q.get('meja') || q.get('table');
    return legacy ? { tableNo: padTable(legacy), customerName: '' } : null;
  } catch {
    return null;
  }
};

export const writeSessionTable = (s) => {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch { /* abaikan */ }
};

export function useSessionTable() {
  const [session, setState] = useState(readSessionTable);
  const setSession = useCallback((s) => { writeSessionTable(s); setState(s); }, []);
  return { session, setSession };
}
