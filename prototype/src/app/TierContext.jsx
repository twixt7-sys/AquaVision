import { createContext, useContext } from 'react';
import { navigate } from '../router.js';

// Screen registry per tier, mirroring dashboard-spec.json#/one_shell_three_tiers.
// Enterprise inherits nothing visually (full-width dashboard); Free/Premium render
// inside a phone frame.
export const TIERS = {
  free: {
    label: 'Free',
    kind: 'phone',
    screens: [
      { id: 'home', label: 'Home' },
      { id: 'assistant', label: 'AI assistant' },
      { id: 'setup', label: 'Farm setup' },
      { id: 'water', label: 'Water log' },
      { id: 'feeding', label: 'Feeding' },
      { id: 'disease', label: 'Disease ID' },
      { id: 'forum', label: 'Community' },
      { id: 'learning', label: 'Learning' },
      { id: 'records', label: 'Records' },
    ],
  },
  premium: {
    label: 'Premium',
    kind: 'phone',
    screens: [
      { id: 'analytics', label: 'Analytics' },
      { id: 'predictive', label: 'Predictive health' },
      { id: 'recommendations', label: 'Recommendations' },
      { id: 'marketplace', label: 'Marketplace' },
      { id: 'consultation', label: 'Consultation' },
    ],
  },
  enterprise: {
    label: 'Enterprise',
    kind: 'dashboard',
    screens: [
      { id: 'overview', label: 'Site overview' },
      { id: 'profile', label: 'Profile view' },
      { id: 'pondtwin', label: 'PondTwin' },
      { id: 'map', label: 'Map' },
      { id: 'history', label: 'History' },
      { id: 'reports', label: 'Reports' },
      { id: 'fleet', label: 'Fleet health' },
    ],
  },
};

export const TierContext = createContext({ tier: 'free', screen: 'home' });
export const useTier = () => useContext(TierContext);

export function tierOf(tier) {
  return TIERS[tier] || TIERS.free;
}

export function goToTier(tier) {
  const t = tierOf(tier);
  navigate(`/demo/${tier}/${t.screens[0].id}`);
}
