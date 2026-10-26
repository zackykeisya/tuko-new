export default function StatCard({ label, value, tone = '', style }) {
  return (
    <div className="st" style={style}>
      {label}<b className={tone}>{value}</b>
    </div>
  );
}
