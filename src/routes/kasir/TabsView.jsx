import { useNavigate } from 'react-router-dom';
import TabList from '../../components/kasir/TabList';
import { useToast } from '../../hooks/useToast';
import { useStore } from '../../store/useStore';

export default function TabsView() {
  const navigate = useNavigate();
  const toast = useToast();
  const tabs = useStore((s) => s.tabs);
  const resumeTab = useStore((s) => s.resumeTab);

  const resume = (id) => {
    if (!resumeTab(id)) return toast('Buka shift dulu');
    toast('Tab dilanjutkan');
    return navigate('/kasir/pos');
  };
  return <TabList tabs={tabs} onResume={resume} />;
}
