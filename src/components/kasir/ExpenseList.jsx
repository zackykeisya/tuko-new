import { useState } from 'react';
import { EXPENSE_CATS } from '../../lib/constants';
import { rp, sum } from '../../lib/helpers';
import { useToast } from '../../hooks/useToast';
import { useStore } from '../../store/useStore';
import { Badge, Button, Card, Input, Modal, ModalActions, Pager, Table, usePager } from '../ui';

export function ExpenseFormModal({ expense, onClose }) {
  const toast = useToast();
  const addExpense = useStore((s) => s.addExpense);
  const updateExpense = useStore((s) => s.updateExpense);
  const [desc, setDesc] = useState(expense?.desc || '');
  const [amount, setAmount] = useState(expense?.amount || '');
  const [cat, setCat] = useState(expense?.cat || 'bahan');

  const save = () => {
    const n = +amount;
    if (!desc.trim() || !(n > 0)) return toast('Isi deskripsi & nominal');
    if (expense?.id) updateExpense(expense.id, { desc: desc.trim(), amount: n, cat });
    else if (!addExpense({ desc: desc.trim(), amount: n, cat })) return toast('Buka shift dulu');
    return onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h3>{expense?.id ? 'Edit' : 'Catat'} Pengeluaran</h3>
      <Input label="Deskripsi" value={desc} onChange={(e) => setDesc(e.target.value)} />
      <Input label="Nominal (Rp)" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <Input label="Kategori" as="select" value={cat} onChange={(e) => setCat(e.target.value)}>
        {Object.entries(EXPENSE_CATS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </Input>
      <ModalActions onCancel={onClose} onOk={save} okText="Simpan" />
    </Modal>
  );
}

export default function ExpenseList() {
  const expenses = useStore((s) => s.expenses);
  const deleteExpense = useStore((s) => s.deleteExpense);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const { rows, pagerProps } = usePager([...expenses].reverse());

  return (
    <Card scroll style={{ marginTop: 14 }}>
      <Table head={['Deskripsi', 'Kategori', 'Waktu', 'Shift', { label: 'Nominal', right: true }, '']}>
        {rows.map((e) => (
          <tr key={e.id}>
            <td>{e.desc}</td><td><Badge>{EXPENSE_CATS[e.cat] || '-'}</Badge></td><td>{e.ts}</td><td>{e.shiftName || '-'}</td>
            <td className="r rd"><b>{rp(e.amount)}</b></td>
            <td>
              <button type="button" aria-label="Edit" onClick={() => setEditing(e)}>✏️</button>
              <button type="button" aria-label="Hapus" onClick={() => setDeleting(e.id)}>🗑️</button>
            </td>
          </tr>
        ))}
        {!rows.length && <tr><td colSpan={6} className="mu">Belum ada pengeluaran</td></tr>}
      </Table>
      <div className="row" style={{ marginTop: 10 }}><b>Total Pengeluaran</b><b className="rd">{rp(sum(expenses, (e) => e.amount))}</b></div>
      <Pager {...pagerProps} />
      {editing && <ExpenseFormModal expense={editing} onClose={() => setEditing(null)} />}
      {deleting && (
        <Modal onClose={() => setDeleting(null)}>
          <h3>Hapus pengeluaran?</h3><p className="mu">Catatan pengeluaran akan dihapus permanen.</p>
          <ModalActions onCancel={() => setDeleting(null)} okText="Hapus" onOk={() => { deleteExpense(deleting); setDeleting(null); }} />
        </Modal>
      )}
    </Card>
  );
}
