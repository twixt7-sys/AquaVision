/** Fixed light backdrop with subtle bubbles floating upward. */
const BUBBLES = [
  { left: '8%', size: 10, delay: '0s', duration: '18s' },
  { left: '18%', size: 6, delay: '3s', duration: '22s' },
  { left: '28%', size: 14, delay: '1.5s', duration: '16s' },
  { left: '42%', size: 8, delay: '5s', duration: '20s' },
  { left: '55%', size: 12, delay: '2s', duration: '24s' },
  { left: '67%', size: 7, delay: '7s', duration: '17s' },
  { left: '78%', size: 16, delay: '4s', duration: '21s' },
  { left: '88%', size: 9, delay: '6s', duration: '19s' },
  { left: '12%', size: 5, delay: '9s', duration: '15s' },
  { left: '48%', size: 11, delay: '8s', duration: '23s' },
  { left: '72%', size: 6, delay: '10s', duration: '18s' },
  { left: '93%', size: 8, delay: '1s', duration: '25s' },
];

export function AppPageBackground() {
  return (
    <div aria-hidden className="app-page-background pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bubble-field">
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className="bubble"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDelay: b.delay,
              animationDuration: b.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default AppPageBackground;
