import { useToast } from '../../hooks/useToast';
import { iso } from '../../lib/helpers';
import { pickData } from '../../lib/storage';
import { useStore } from '../../store/useStore';
import { Button, Card } from '../ui';

export default function BackupControls() {
  const toast = useToast();
  const replaceData = useStore((s) => s.replaceData);

  const backup = () => {
    const blob = new Blob([JSON.stringify(pickData(useStore.getState()), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `tuko-backup-${iso().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const restore = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data || !Array.isArray(data.menu)) throw new Error('format');
        if (!window.confirm('Restore akan menimpa data saat ini. Lanjut?')) return;
        replaceData(data);
        toast('Restore berhasil');
      } catch { toast('File JSON tidak valid'); }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="row wr">
      <b>Backup JSON</b>
      <span className="row">
        <Button onClick={backup}>⬇ Backup</Button>
        <label className="b2">⬆ Restore<input type="file" accept="application/json,.json" className="hidden" onChange={restore} /></label>
      </span>
    </Card>
  );
}
