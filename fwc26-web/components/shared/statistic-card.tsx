import {
  getAccuracyLabel,
  getAccuracyVariant,
  getStatusStyles,
} from "@/lib/styles";
import { formatPercentage } from "@/lib/utils";

interface StatisticCardProps {
  value: number;
  label: string;
  description: string;
  showBadge?: boolean;
}

export function StatisticCard({
  value,
  label,
  description,
  showBadge = false,
}: StatisticCardProps) {
  const accuracyLevel = getAccuracyLabel(value);
  const variant = getAccuracyVariant(value);
  const styles = getStatusStyles(variant);

  const badgeLabels = {
    perfect: "Perfect",
    good: "Good",
    low: "Low",
  } as const;

  return (
    <div className="p-4 rounded-lg bg-muted/50">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold text-foreground">
          {formatPercentage(value)}
        </span>
        {showBadge && (
          <span className={`text-xs px-2 py-0.5 rounded ${styles.badge}`}>
            {badgeLabels[accuracyLevel]}
          </span>
        )}
      </div>
      <p className="text-xs font-medium text-foreground mb-1">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
