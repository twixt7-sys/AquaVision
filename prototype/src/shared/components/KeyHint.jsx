// Small kbd-styled hint chips for pitch mode.
export default function KeyHint({ keys, label }) {
  const list = Array.isArray(keys) ? keys : [keys];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-2)', fontSize: 'var(--fs-xs)' }}>
      {list.map((k, i) => (
        <kbd key={i}>{k}</kbd>
      ))}
      {label && <span>{label}</span>}
    </span>
  );
}
