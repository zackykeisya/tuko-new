import { useState } from 'react';

export default function Table({ head, children }) {
  return (
    <div className="sc">
      <table>
        <thead><tr>{head.map((h, i) => (
          <th key={i} className={h.right ? 'r' : ''}>{h.label ?? h}</th>
        ))}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function usePager(items, initialSize = 10) {
  const [size, setSize] = useState(initialSize);
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(items.length / size));
  const p = Math.min(page, pages - 1);
  return {
    rows: items.slice(p * size, (p + 1) * size),
    pagerProps: { page: p, pages, size, onPage: setPage, onSize: (n) => { setSize(n); setPage(0); } },
  };
}

export function Pager({ page, pages, size, onPage, onSize }) {
  return (
    <div className="row" style={{ marginTop: 10 }}>
      <select style={{ width: 80 }} value={size} onChange={(e) => onSize(+e.target.value)}>
        {[5, 10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <span className="row">
        <button type="button" className="b2" disabled={page <= 0} onClick={() => onPage(page - 1)}>‹</button>
        <span>{page + 1}/{pages}</span>
        <button type="button" className="b2" disabled={page >= pages - 1} onClick={() => onPage(page + 1)}>›</button>
      </span>
    </div>
  );
}
