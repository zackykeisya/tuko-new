import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { dayOf, sum } from '../../lib/helpers';
import { Card } from '../ui';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/** Chart harian untuk bulan terpilih (omzet vs pengeluaran). */
export default function ChartPanel({ month, trans, expenses }) {
  const days = [...new Set([...trans.map(dayOf), ...expenses.map(dayOf)])].filter((d) => d.startsWith(month)).sort();
  const data = {
    labels: days.map((d) => d.slice(8)),
    datasets: [
      { label: 'Omzet', data: days.map((d) => sum(trans.filter((t) => dayOf(t) === d), (t) => t.total)), backgroundColor: '#4A6B5D', borderRadius: 6 },
      { label: 'Pengeluaran', data: days.map((d) => sum(expenses.filter((e) => dayOf(e) === d), (e) => e.amount)), backgroundColor: '#C25454', borderRadius: 6 },
    ],
  };
  return (
    <Card>
      <b>Grafik Bulan {month || '-'}</b>
      {days.length ? <Bar data={data} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} /> : <p className="mu" style={{ marginTop: 8 }}>Belum ada data bulan ini.</p>}
    </Card>
  );
}
