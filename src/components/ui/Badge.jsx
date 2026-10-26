/** variant: 'tag' (label kecil) | 'self' (self-order) | 'accent' (badge menu). */
export default function Badge({ variant = 'tag', className = '', ...props }) {
  const c = variant === 'accent' ? 'bdg' : variant === 'self' ? 'tag self' : 'tag';
  return <span className={`${c} ${className}`.trim()} {...props} />;
}
