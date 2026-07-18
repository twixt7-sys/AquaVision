// All chart payloads by id: 9 canonical from @data/12_datasets/charts + 2 derived.
import doDiel from '@data/12_datasets/charts/chart-do-diel-cycle.json';
import doDepth from '@data/12_datasets/charts/chart-do-depth-profile.json';
import globalProd from '@data/12_datasets/charts/chart-global-production.json';
import speciesMix from '@data/12_datasets/charts/chart-species-production-mix.json';
import marketSizing from '@data/12_datasets/charts/chart-market-sizing.json';
import problemCost from '@data/12_datasets/charts/chart-problem-cost-breakdown.json';
import manualVsDrone from '@data/12_datasets/charts/chart-manual-vs-omnidrone.json';
import financial from '@data/12_datasets/charts/chart-financial-projection.json';
import techReadiness from '@data/12_datasets/charts/chart-tech-readiness.json';
import threePhaseFunnel from './derived/chart-three-phase-funnel.json';
import phaseRevenueMix from './derived/chart-phase-revenue-mix.json';

export const chartsById = {
  'chart-do-diel-cycle': doDiel,
  'chart-do-depth-profile': doDepth,
  'chart-global-production': globalProd,
  'chart-species-production-mix': speciesMix,
  'chart-market-sizing': marketSizing,
  'chart-problem-cost-breakdown': problemCost,
  'chart-manual-vs-omnidrone': manualVsDrone,
  'chart-financial-projection': financial,
  'chart-tech-readiness': techReadiness,
  'chart-three-phase-funnel': threePhaseFunnel,
  'chart-phase-revenue-mix': phaseRevenueMix,
};

export const allChartIds = Object.keys(chartsById);
export const getChart = (id) => chartsById[id];
