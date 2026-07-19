import { navigate } from './router.js';
import { allChartIds, getChart } from './data/charts.js';
import ChartFigure from './shared/charts/ChartFigure.jsx';

// Hidden gallery  -  renders every chart payload. This is the regression net for the
// ported chart engine (compare against the generated site/). Not linked from the
// main flows except the landing footer.
export default function ChartsGallery() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px 60px' }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Chart gallery</h1>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>← Home</button>
      </div>
      <p className="muted">
        All {allChartIds.length} chart payloads (9 canonical + 2 derived), rendered through the ported engine.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginTop: 20 }}>
        {allChartIds.map((id) => (
          <div key={id}>
            <div className="tag-mono" style={{ marginBottom: 6 }}>{id}</div>
            <ChartFigure doc={getChart(id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
