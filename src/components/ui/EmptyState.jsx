export default function EmptyState({ icon, title, children }) {
  return (
    <div className="empty">
      {icon && <div style={{ fontSize: 40 }}>{icon}</div>}
      <b>{title}</b>
      {children && <div className="mu" style={{ marginTop: 4 }}>{children}</div>}
    </div>
  );
}
