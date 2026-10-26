export default function Slider({ value, onChange, min = 0, max = 100, ...props }) {
  return <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(+e.target.value)} {...props} />;
}
