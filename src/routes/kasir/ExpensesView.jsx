import { useState } from 'react';
import ExpenseList, { ExpenseFormModal } from '../../components/kasir/ExpenseList';
import { OpenShiftModal } from '../../components/kasir/ShiftPanel';
import { Button, StatCard } from '../../components/ui';
import { useShift } from '../../hooks/useShift';
import { rp, sum } from '../../lib/helpers';
import { useStore } from '../../store/useStore';

export default function ExpensesView() {
  const expenses = useStore((s) => s.expenses);
  const { active } = useShift();
  const [adding, setAdding] = useState(false);
  const [opening, setOpening] = useState(false);
  const total = (k) => sum(expenses.filter((e) => e.cat === k), (e) => e.amount);

  return (
    <>
      {!active && (
        <div className="warn"><span>⚠️ Shift belum aktif. Buka shift untuk mencatat pengeluaran.</span><Button onClick={() => setOpening(true)}>Buka Shift</Button></div>
      )}
      <div className="stats">
        <StatCard label="🛒 Bahan Baku" value={rp(total('bahan'))} tone="o" />
        <StatCard label="⚡ Operasional" value={rp(total('ops'))} tone="bl" />
        <StatCard label="📦 Lainnya" value={rp(total('lainnya'))} tone="pu" />
      </div>
      <Button onClick={() => setAdding(true)} disabled={!active}>+ Catat Pengeluaran Baru</Button>
      <ExpenseList />
      {adding && <ExpenseFormModal onClose={() => setAdding(false)} />}
      {opening && <OpenShiftModal onClose={() => setOpening(false)} />}
    </>
  );
}
