/** Field dengan label. `as` = 'input' | 'textarea' | 'select'. */
export default function Input({ label, as: Tag = 'input', children, ...props }) {
  const field = <Tag {...props}>{children}</Tag>;
  return label ? (
    <div className="fg"><label>{label}{field}</label></div>
  ) : field;
}
