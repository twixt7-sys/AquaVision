// Single choke point for the canonical JSON corpus. Imported via the @data alias
// (../data). Vite bundles these into the build, so the prototype stays self-contained.

import brand from '@data/01_company/brand-identity.json';
import company from '@data/01_company/company-profile.json';
import solution from '@data/04_solution/solution-overview.json';
import dashboardSpec from '@data/06_software/dashboard-spec.json';
import digitalTwin from '@data/06_software/digital-twin.json';
import telemetrySchema from '@data/06_software/telemetry-schema.json';
import twinState from '@data/12_datasets/sample-pond-twin-state.json';
import telemetry from '@data/12_datasets/sample-telemetry.json';
import kpis from '@data/12_datasets/kpi-definitions.json';
import pitchOutline from '@data/13_pitch/pitch-deck-outline.json';
import elevator from '@data/13_pitch/elevator-pitches.json';
import faq from '@data/13_pitch/faq-objections.json';

export {
  brand,
  company,
  solution,
  dashboardSpec,
  digitalTwin,
  telemetrySchema,
  twinState,
  telemetry,
  kpis,
  pitchOutline,
  elevator,
  faq,
};

// Convenience accessors used across the app.
export const oneLiner = elevator.the_one_liner.text;
export const bannedWords = elevator.the_words_never_to_use.banned;
export const statusColors = brand.palette.semantic.colors;
export const provenanceBadges = brand.palette.provenance_badges;
