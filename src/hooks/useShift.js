import { useMemo } from 'react';
import { calcShift } from '../lib/helpers';
import { useStore } from '../store/useStore';

/** Ringkasan shift aktif (kas, QRIS, pengeluaran, kas diharapkan). */
export function useShift() {
  const shift = useStore((s) => s.shift);
  const trans = useStore((s) => s.trans);
  const expenses = useStore((s) => s.expenses);
  const calc = useMemo(() => calcShift({ shift, trans, expenses }), [shift, trans, expenses]);
  return { shift, ...calc };
}
