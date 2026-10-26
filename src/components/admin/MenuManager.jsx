import { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { rp } from '../../lib/helpers';
import { useStore } from '../../store/useStore';
import { Button, Card, Input, Modal, ModalActions, Table } from '../ui';

function MenuFormModal({ item, categories, onClose }) {
  const toast = useToast();
  const saveMenuItem = useStore((s) => s.saveMenuItem);
  const [f, setF] = useState({ name: item.name || '', price: item.price ?? '', cat: item.cat || 'Teh/Teko', badge: !!item.badge, active: item.active !== false });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const save = () => {
    if (!f.name.trim() || !(+f.price >= 0) || f.price === '' || !f.cat.trim()) return toast('Lengkapi form');
    saveMenuItem({ ...(item.id ? { id: item.id } : {}), name: f.name.trim(), price: +f.price, cat: f.cat.trim(), badge: f.badge, active: f.active });
    return onClose();
  };
  return (
    <Modal onClose={onClose}>
      <h3>{item.id ? 'Edit' : 'Tambah'} Menu</h3>
      <Input label="Nama" value={f.name} onChange={set('name')} />
      <Input label="Harga (Rp)" type="number" min="0" value={f.price} onChange={set('price')} />
      <Input label="Kategori" list="cat-list" value={f.cat} onChange={set('cat')} />
      <datalist id="cat-list">{categories.map((c) => <option key={c} value={c} />)}</datalist>
      <label className="row" style={{ justifyContent: 'flex-start' }}><input type="checkbox" style={{ width: 'auto' }} checked={f.badge} onChange={set('badge')} /> Badge “1 Teko”</label>
      <label className="row" style={{ justifyContent: 'flex-start', marginTop: 6 }}><input type="checkbox" style={{ width: 'auto' }} checked={f.active} onChange={set('active')} /> Aktif (tersedia)</label>
      <ModalActions onCancel={onClose} onOk={save} okText="Simpan" />
    </Modal>
  );
}

export default function MenuManager() {
  const menu = useStore((s) => s.menu);
  const toggleMenu = useStore((s) => s.toggleMenu);
  const deleteMenu = useStore((s) => s.deleteMenu);
  const [form, setForm] = useState(null);
  const [del, setDel] = useState(null);

  return (
    <Card scroll>
      <div className="row"><b>Manajemen Menu</b><Button onClick={() => setForm({ cat: 'Teh/Teko', active: true })}>+ Menu</Button></div>
      <Table head={['Nama', 'Kategori', { label: 'Harga', right: true }, 'Status', '']}>
        {menu.map((m) => (
          <tr key={m.id}>
            <td>{m.name}</td><td>{m.cat}</td><td className="r">{rp(m.price)}</td>
            <td>
              <button type="button" className="tag" style={m.active !== false ? undefined : { background: '#FEE9E9', color: '#C25454' }} onClick={() => toggleMenu(m.id)}>
                {m.active !== false ? 'Aktif' : 'Habis'}
              </button>
            </td>
            <td>
              <button type="button" aria-label="Edit" onClick={() => setForm(m)}>✏️</button>
              <button type="button" aria-label="Hapus" onClick={() => setDel(m.id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </Table>
      {form && <MenuFormModal item={form} categories={[...new Set(menu.map((x) => x.cat))]} onClose={() => setForm(null)} />}
      {del && (
        <Modal onClose={() => setDel(null)}>
          <h3>Hapus menu?</h3><p className="mu">Menu akan dihapus permanen.</p>
          <ModalActions onCancel={() => setDel(null)} okText="Hapus" onOk={() => { deleteMenu(del); setDel(null); }} />
        </Modal>
      )}
    </Card>
  );
}
