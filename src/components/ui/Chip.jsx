export default function Chip({ active, className = '', type = 'button', ...props }) {
  return <button type={type} className={`chip ${active ? 'on' : ''} ${className}`.trim()} {...props} />;
}
