import { useState } from 'react';
import ShiftPanel, { OpenShiftModal } from '../../components/kasir/ShiftPanel';
import { Button, EmptyState } from '../../components/ui';
import { useShift } from '../../hooks/useShift';

export default function ShiftView() {
  const { active } = useShift();
  const [opening, setOpening] = useState(false);
  return (
    <>
      {active ? <ShiftPanel /> : (
        <EmptyState icon="🕐" title="Belum ada shift aktif">
          <p style={{ marginBottom: 14 }}>Buka shift untuk mulai transaksi.</p>
          <Button onClick={() => setOpening(true)}>Buka Shift Baru</Button>
        </EmptyState>
      )}
      {opening && <OpenShiftModal onClose={() => setOpening(false)} />}
    </>
  );
}
