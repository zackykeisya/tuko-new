const VARIANTS = { primary: 'b', secondary: 'b2', danger: 'bd' };

export default function Button({ variant = 'primary', className = '', type = 'button', ...props }) {
  return <button type={type} className={`${VARIANTS[variant]} ${className}`.trim()} {...props} />;
}
