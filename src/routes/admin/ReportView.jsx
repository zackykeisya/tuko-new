import { useMemo, useState } from 'react';
import ActivityLog from '../../components/admin/ActivityLog';
import BackupControls from '../../components/admin/BackupControls';
import ChartPanel from '../../components/admin/ChartPanel';
import DailyBreakdownTable from '../../components/admin/DailyBreakdownTable';
import ExcelControls from '../../components/admin/ExcelControls';
import MenuManager from '../../components/admin/MenuManager';
import MonthlySummary from '../../components/admin/MonthlySummary';
import ShiftHistory from '../../components/admin/ShiftHistory';
import SoldItemsTable from '../../components/admin/SoldItemsTable';
import { StatCard } from '../../components/ui';
import { dayOf, rp, sum } from '../../lib/helpers';
import { useStore } from '../../store/useStore';

export default function ReportView() {
  const trans = useStore((s) => s.trans);
  const expenses = useStore((s) => s.expenses);
  const dividendPct = useStore((s) => s.dividendPct);
  const [picked, setPicked] = useState('');

  const days = useMemo(() => [...new Set([...trans.map(dayOf), ...expenses.map(dayOf)])].filter(Boolean).sort().reverse(), [trans, expenses]);
  const months = useMemo(() => [...new Set(days.map((d) => d.slice(0, 7)))], [days]);
  const month = months.includes(picked) ? picked : months[0] || '';

  const mTrans = trans.filter((t) => dayOf(t).slice(0, 7) === month);
  const mExp = expenses.filter((e) => dayOf(e).slice(0, 7) === month);
  const gross = sum(trans, (t) => t.total);
  const totEx = sum(expenses, (e) => e.amount);
  const net = gross - totEx;

  return (
    <>
      <div className="stats">
        <StatCard label="Omzet Kotor" value={rp(gross)} />
        <StatCard label="Total Pengeluaran" value={rp(totEx)} tone="rd" />
        <StatCard label="Laba Bersih" value={rp(net)} tone={net >= 0 ? 'gr' : 'rd'} />
        <StatCard label="Alokasi Dividen" value={rp(Math.max(0, net) * dividendPct / 100)} style={{ background: 'var(--primary)', color: '#fff' }} />
      </div>
      <ChartPanel month={month} trans={mTrans} expenses={mExp} />
      <ExcelControls />
      <BackupControls />
      <MonthlySummary months={months} month={month} onMonth={setPicked} trans={mTrans} expenses={mExp} />
      <DailyBreakdownTable days={days.filter((d) => d.startsWith(month)).slice(0, 31)} trans={trans} expenses={expenses} />
      <ShiftHistory />
      <SoldItemsTable trans={trans} />
      <MenuManager />
      <ActivityLog />
    </>
  );
}
