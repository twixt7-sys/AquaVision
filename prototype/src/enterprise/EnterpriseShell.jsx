import { navigate } from '../router.js';
import { TIERS } from '../app/TierContext.jsx';
import TierSwitcher from '../app/TierSwitcher.jsx';
import SampleDataBanner from '../shared/components/SampleDataBanner.jsx';

import SiteOverview from './SiteOverview.jsx';
import ProfileView from './ProfileView.jsx';
import MapView from './MapView.jsx';
import HistoryView from './HistoryView.jsx';
import ReportsView from './ReportsView.jsx';
import FleetHealth from './FleetHealth.jsx';
import PondTwin from './pondtwin/PondTwin.jsx';

const VIEWS = {
  overview: SiteOverview,
  profile: ProfileView,
  pondtwin: PondTwin,
  map: MapView,
  history: HistoryView,
  reports: ReportsView,
  fleet: FleetHealth,
};

// Phase 3 enterprise dashboard — full-width, sidebar nav, permanent SAMPLE DATA
// banner (the whole view is fed by synthetic files).
export default function EnterpriseShell({ screen }) {
  const View = VIEWS[screen] || SiteOverview;
  const screens = TIERS.enterprise.screens;
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* sidebar */}
      <aside style={{ width: 220, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '.16em', fontSize: 'var(--fs-sm)', color: 'var(--av-current)' }}>AQUAVISION</div>
          <div className="tag-mono" style={{ fontSize: 11 }}>Enterprise · SYNTH-LAKE-01</div>
        </div>
        <nav className="hide-scroll" style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
          {screens.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/demo/enterprise/${s.id}`)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                borderRadius: 'var(--r-sm)', padding: '9px 12px', margin: '2px 0', fontSize: 'var(--fs-sm)',
                background: s.id === screen ? 'var(--surface-2)' : 'transparent',
                color: s.id === screen ? 'var(--av-current)' : 'var(--text-2)',
                borderLeft: s.id === screen ? '2px solid var(--av-current)' : '2px solid transparent',
              }}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: 10, borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={() => navigate('/')}>← Exit demo</button>
        </div>
      </aside>

      {/* main */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="row" style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)', gap: 14 }}>
          <TierSwitcher />
          <div className="grow" />
          <span className="tag-mono">Phase 3 · Smart Aquaculture</span>
        </div>
        <div style={{ padding: '16px 24px 40px', overflowY: 'auto' }}>
          <div style={{ marginBottom: 14 }}><SampleDataBanner /></div>
          <View />
        </div>
      </div>
    </div>
  );
}
