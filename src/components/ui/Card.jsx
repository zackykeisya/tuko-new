export default function Card({ hover, scroll, className = '', ...props }) {
  return <div className={`card ${hover ? 'hv' : ''} ${scroll ? 'sc' : ''} ${className}`.trim()} {...props} />;
}
