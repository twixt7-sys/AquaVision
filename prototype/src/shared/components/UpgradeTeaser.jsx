import { Lock } from 'lucide-react';
import { useTier } from '../../app/TierContext.jsx';
import { Button } from './ui/button.jsx';
import { Card, CardContent } from './ui/card.jsx';

export default function UpgradeTeaser({ tier = 'Premium', title, children }) {
  const { setTier } = useTier();
  return (
    <Card className="border-[var(--prov-target)]">
      <CardContent className="px-5 py-7 text-center">
        <Lock className="mx-auto mb-2 size-6 text-[var(--prov-target)]" aria-hidden />
        <h4 className="mb-1.5">{title || `${tier} feature`}</h4>
        <p className="mx-auto mb-3.5 max-w-sm text-sm text-muted-foreground">
          {children ||
            `This becomes available when a farm outgrows manual logging and upgrades to ${tier}. Upgrade is need-triggered, not pushed.`}
        </p>
        <Button size="sm" onClick={() => setTier(tier.toLowerCase())}>
          Preview {tier} in the demo →
        </Button>
      </CardContent>
    </Card>
  );
}
