import BarcodeManager from '../../components/admin/BarcodeManager';

export default function BarcodeView() {
  return (
    <>
      <p className="mu" style={{ marginBottom: 12 }}>Cetak QR dan tempel di meja. Pelanggan yang scan akan diarahkan ke form “Atas Nama”, lalu langsung ke menu.</p>
      <BarcodeManager />
    </>
  );
}
