import { renderChartBody } from './chartSvg.js';
import ProvenanceBadge from '../components/ProvenanceBadge.jsx';
import RechartsFigure from './RechartsFigure.jsx';
import { canUseRecharts } from '../../core/charts/payloadToRecharts.js';
import { cn } from '../components/ui/utils.js';

export default function ChartFigure({ doc, showHeader = true, bare = false, forceSvg = false }) {
  if (!doc) return null;
  const useRecharts = !forceSvg && canUseRecharts(doc);
  const html = useRecharts ? null : renderChartBody(doc);

  return (
    <figure className={cn('chart', bare && 'chart-bare')} style={{ margin: 0 }}>
      {showHeader && (
        <>
          <div className="chart-prov">{doc.provenance && <ProvenanceBadge type={doc.provenance} />}</div>
          {doc.title && <div className="chart-title">{doc.title}</div>}
          {doc.subtitle && <div className="chart-sub">{doc.subtitle}</div>}
        </>
      )}
      {useRecharts ? (
        <RechartsFigure doc={doc} />
      ) : html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p className="text-sm text-muted-foreground">Chart could not be rendered.</p>
      )}
    </figure>
  );
}
