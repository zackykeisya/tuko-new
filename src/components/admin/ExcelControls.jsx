import * as XLSX from 'xlsx';
import { useToast } from '../../hooks/useToast';
import { iso } from '../../lib/helpers';
import { useStore } from '../../store/useStore';
import { Button, Card } from '../ui';

const flat = (arr) => (arr.length ? arr : [{}]).map((o) => {
  const r = {};
  Object.keys(o).forEach((k) => { r[k] = o[k] !== null && typeof o[k] === 'object' ? JSON.stringify(o[k]) : o[k]; });
  return r;
});

const readSheet = (wb, name) => (wb.Sheets[name]
  ? XLSX.utils.sheet_to_json(wb.Sheets[name]).map((o) => {
    Object.keys(o).forEach((k) => {
      if (typeof o[k] === 'string' && /^[[{]/.test(o[k])) { try { o[k] = JSON.parse(o[k]); } catch { /* biarkan string */ } }
    });
    return o;
  }).filter((o) => Object.keys(o).length)
  : []);

/** Ekspor/impor Excel 7 sheet: Menu, Transaksi, Pengeluaran, Shift, Tab, Log, Pengaturan. */
export default function ExcelControls() {
  const toast = useToast();
  const replaceData = useStore((s) => s.replaceData);

  const exportXlsx = () => {
    const s = useStore.getState();
    const wb = XLSX.utils.book_new();
    const add = (n, a) => XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(flat(a)), n);
    add('Menu', s.menu); add('Transaksi', s.trans); add('Pengeluaran', s.expenses); add('Shift', s.shiftHistory);
    add('Tab', s.tabs); add('Log', s.log);
    add('Pengaturan', [{ dividendPct: s.dividendPct, pin: s.pin, kasirPin: s.kasirPin, cashierName: s.cashierName }]);
    XLSX.writeFile(wb, `tuko-backup-${iso().slice(0, 10)}.xlsx`);
  };

  const importXlsx = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(ev.target.result, { type: 'array' });
        if (!window.confirm('Import akan menimpa data saat ini. Lanjut?')) return;
        const menu = readSheet(wb, 'Menu');
        const p = readSheet(wb, 'Pengaturan')[0];
        replaceData({
          ...(menu.length ? { menu } : {}),
          trans: readSheet(wb, 'Transaksi'), expenses: readSheet(wb, 'Pengeluaran'), shiftHistory: readSheet(wb, 'Shift'),
          tabs: readSheet(wb, 'Tab'), log: readSheet(wb, 'Log'),
          ...(p ? { dividendPct: +p.dividendPct || 30, pin: String(p.pin || '1234'), kasirPin: String(p.kasirPin || '8888'), cashierName: p.cashierName || 'Kasir 1' } : {}),
        });
        toast('Import berhasil');
      } catch { toast('File tidak valid'); }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Card className="row wr">
      <b>Excel (7 sheet)</b>
      <span className="row">
        <Button onClick={exportXlsx}>⬇ Export</Button>
        <label className="b2">⬆ Import<input type="file" accept=".xlsx" className="hidden" onChange={importXlsx} /></label>
      </span>
    </Card>
  );
}
