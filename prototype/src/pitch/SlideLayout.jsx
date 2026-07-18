// Shared slide chrome: kicker number, title, body, and a source-file footnote
// (each slide names the data file it draws from — the deck's credibility spine).
export default function SlideLayout({ slide, children }) {
  return (
    <section style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
      <div className="section-title">Slide {slide.n}</div>
      <h1 style={{ fontSize: 'var(--fs-3xl)', marginBottom: 18 }}>{slide.title}</h1>
      <div style={{ flex: 1 }}>{children}</div>
      {slide.source && (
        <div className="tag-mono" style={{ marginTop: 20, opacity: 0.7 }}>
          source: {Array.isArray(slide.source) ? slide.source.join(', ') : slide.source}
        </div>
      )}
    </section>
  );
}
