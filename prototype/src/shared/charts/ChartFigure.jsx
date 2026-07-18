import { renderChartBody } from './chartSvg.js';
import ProvenanceBadge from '../components/ProvenanceBadge.jsx';

// Renders a chart_payload: provenance badge (React) + SVG body (from the ported
// string renderer via dangerouslySetInnerHTML). The renderer never throws — a
// bad payload degrades to a message, never a blank page.
export default function ChartFigure({ doc, showHeader = true, bare = false }) {
  if (!doc) return null;
  const html = renderChartBody(doc);
  return (
    <figure className={`chart ${bare ? 'chart-bare' : ''}`} style={{ margin: 0 }}>
      {showHeader && (
        <>
          <div className="chart-prov">
            {doc.provenance && <ProvenanceBadge type={doc.provenance} />}
          </div>
          {doc.title && <div className="chart-title">{doc.title}</div>}
          {doc.subtitle && <div className="chart-sub">{doc.subtitle}</div>}
        </>
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
