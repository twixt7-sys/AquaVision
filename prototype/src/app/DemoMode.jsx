import { navigate } from '../router.js';
import { TierContext, TIERS, tierOf, goToTier } from './TierContext.jsx';
import TierSwitcher from './TierSwitcher.jsx';
import PhoneFrame from '../shared/components/PhoneFrame.jsx';
import EnterpriseShell from '../enterprise/EnterpriseShell.jsx';

// Free screens
import Home from './screens/Home.jsx';
import AssistantChat from './screens/AssistantChat.jsx';
import SetupWizard from './screens/SetupWizard.jsx';
import WaterLog from './screens/WaterLog.jsx';
import Feeding from './screens/Feeding.jsx';
import DiseaseId from './screens/DiseaseId.jsx';
import Forum from './screens/Forum.jsx';
import Learning from './screens/Learning.jsx';
import Records from './screens/Records.jsx';
// Premium screens
import Analytics from './screens/Analytics.jsx';
import PredictiveHealth from './screens/PredictiveHealth.jsx';
import Recommendations from './screens/Recommendations.jsx';
import Marketplace from './screens/Marketplace.jsx';
import Consultation from './screens/Consultation.jsx';
import UpgradeTeaser from '../shared/components/UpgradeTeaser.jsx';
import { Pad } from './screens/_kit.jsx';

const SCREENS = {
  free: { home: Home, assistant: AssistantChat, setup: SetupWizard, water: WaterLog, feeding: Feeding, disease: DiseaseId, forum: Forum, learning: Learning, records: Records },
  premium: { analytics: Analytics, predictive: PredictiveHealth, recommendations: Recommendations, marketplace: Marketplace, consultation: Consultation },
};

export default function DemoMode({ parts }) {
  const tier = TIERS[parts[1]] ? parts[1] : 'free';
  const t = tierOf(tier);
  const screen = parts[2] || t.screens[0].id;

  const ctx = { tier, screen, setTier: goToTier };

  // Enterprise is a full-width dashboard
  if (tier === 'enterprise') {
    return (
      <TierContext.Provider value={ctx}>
        <EnterpriseShell screen={screen} />
      </TierContext.Provider>
    );
  }

  // If a Premium screen id is requested under the Free tier, demonstrate the
  // funnel with the UpgradeTeaser instead of dead-ending.
  const isPremiumScreen = Object.keys(SCREENS.premium).includes(screen);
  const Screen =
    tier === 'free' && isPremiumScreen
      ? () => (
          <Pad>
            <UpgradeTeaser tier="Premium">
              This is a Premium feature. It becomes available when a farm outgrows manual logging — the upgrade is
              need-triggered, not pushed.
            </UpgradeTeaser>
          </Pad>
        )
      : SCREENS[tier]?.[screen] || SCREENS[tier]?.[t.screens[0].id];

  return (
    <TierContext.Provider value={ctx}>
      <div className="screen-root">
        {/* header */}
        <div className="row" style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)', gap: 14 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>← Exit</button>
          <TierSwitcher />
          <div className="grow" />
          <span className="tag-mono">Demo mode · touch the product</span>
        </div>

        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* screen nav */}
          <nav
            className="hide-scroll"
            style={{ width: 190, flexShrink: 0, borderRight: '1px solid var(--border)', padding: 12, overflowY: 'auto' }}
          >
            <div className="section-title">{t.label} tier</div>
            {t.screens.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(`/demo/${tier}/${s.id}`)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                  borderRadius: 'var(--r-sm)', padding: '8px 10px', margin: '2px 0', fontSize: 'var(--fs-sm)',
                  background: s.id === screen ? 'var(--surface-2)' : 'transparent',
                  color: s.id === screen ? 'var(--av-current)' : 'var(--text-2)',
                  borderLeft: s.id === screen ? '2px solid var(--av-current)' : '2px solid transparent',
                }}
              >
                {s.label}
              </button>
            ))}
          </nav>

          {/* phone-framed screen */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', display: 'flex', justifyContent: 'center' }}>
            <PhoneFrame title={`${t.label} · ${t.screens.find((s) => s.id === screen)?.label || ''}`}>
              <Screen />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </TierContext.Provider>
  );
}
