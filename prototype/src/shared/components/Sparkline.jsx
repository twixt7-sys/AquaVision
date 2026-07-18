import { sparklineSvg } from '../charts/chartSvg.js';

// Tiny trend line for status strips / tiles. Wraps the ported sparkline renderer.
export default function Sparkline({ doc, stroke }) {
  const html = sparklineSvg(doc, stroke);
  if (!html) return null;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
