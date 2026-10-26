import { Navigate, Route, Routes } from 'react-router-dom';
import Toast from './components/ui/Toast';
import { useToast } from './hooks/useToast';
import { useEffect } from 'react';
import AdminView from './routes/AdminView';
import CustomerView from './routes/CustomerView';
import KasirView from './routes/KasirView';
import WelcomeFormView from './routes/WelcomeFormView';
import BarcodeView from './routes/admin/BarcodeView';
import ReportView from './routes/admin/ReportView';
import SettingsView from './routes/admin/SettingsView';
import ExpensesView from './routes/kasir/ExpensesView';
import POSView from './routes/kasir/POSView';
import ShiftView from './routes/kasir/ShiftView';
import TabsView from './routes/kasir/TabsView';

export default function App() {
  const toast = useToast();
  useEffect(() => {
    const h = () => toast('Penyimpanan penuh');
    window.addEventListener('tuko:storage-full', h);
    return () => window.removeEventListener('tuko:storage-full', h);
  }, [toast]);

  return (
    <>
      <Routes>
        <Route path="/" element={<CustomerView />} />
        <Route path="/pemesanan/meja/:nomorMeja" element={<WelcomeFormView />} />

        <Route element={<KasirView />}>
          <Route path="/kasir" element={<Navigate to="/kasir/pos" replace />} />
          <Route path="/kasir/pos" element={<POSView />} />
          <Route path="/kasir/tabs" element={<TabsView />} />
          <Route path="/kasir/expenses" element={<ExpensesView />} />
          <Route path="/kasir/shift" element={<ShiftView />} />
          <Route path="/admin" element={<AdminView />}>
            <Route index element={<ReportView />} />
            <Route path="barcode" element={<BarcodeView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  );
}
