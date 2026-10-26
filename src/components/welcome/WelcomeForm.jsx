import { useState } from 'react';
import { Button } from '../ui';

export const MIN_NAME = 2;

export default function WelcomeForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const v = name.trim();
    if (v.length < MIN_NAME) return setError(`Nama minimal ${MIN_NAME} karakter`);
    return onSubmit(v);
  };

  return (
    <form className="welcome-form" onSubmit={submit} noValidate>
      <div className="fg" style={{ marginBottom: 0 }}>
        <label htmlFor="atas-nama">Atas Nama</label>
        <input id="atas-nama" autoFocus autoComplete="given-name" maxLength={24} placeholder="Nama Anda" value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }} />
        {error && <div className="welcome-err" role="alert">{error}</div>}
      </div>
      <Button type="submit" style={{ padding: 14 }}>Mulai Pesan</Button>
    </form>
  );
}
