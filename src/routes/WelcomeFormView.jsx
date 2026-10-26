import { useNavigate, useParams } from 'react-router-dom';
import WelcomeForm from '../components/welcome/WelcomeForm';
import { writeSessionTable } from '../hooks/useSessionTable';
import { padTable } from '../lib/helpers';
import '../styles/welcome.css';

export default function WelcomeFormView() {
  const { nomorMeja } = useParams();
  const navigate = useNavigate();
  const tableNo = padTable(decodeURIComponent(nomorMeja || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 6));

  const handleSubmit = (customerName) => {
    writeSessionTable({ tableNo, customerName });
    navigate('/', { replace: true });
  };

  return (
    <div className="welcome">
      <div className="welcome-card">
        <span className="welcome-table">Meja {tableNo || '?'}</span>
        <h1>Selamat datang di TUKO</h1>
        <p className="mu">Tuangin · Puterin · Nikmatin. Tulis nama Anda agar pesanan mudah diantar ke meja.</p>
        <WelcomeForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
