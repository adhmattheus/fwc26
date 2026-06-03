import { PlayerCard } from "@/components/player-card";
import { Badge } from "@/components/ui/badge";
import type { PlayerResponse } from "@/services/teams.service";

interface PlayerSectionProps {
  title: string;
  count: number;
  players: PlayerResponse[];
  variant: "green" | "amber" | "red";
  showCodigo?: boolean;
}

const variantStyles = {
  green: {
    badge: "bg-status-success-bg text-status-success border-status-success/30",
    header: "bg-status-success-bg",
    border: "border-status-success/20",
    card: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
  },
  amber: {
    badge: "bg-status-warning-bg text-status-warning border-status-warning/30",
    header: "bg-status-warning-bg",
    border: "border-status-warning/20",
    card: "bg-amber-50 hover:bg-amber-100 border-amber-200",
  },
  red: {
    badge: "bg-status-error-bg text-status-error border-status-error/30",
    header: "bg-status-error-bg",
    border: "border-status-error/20",
    card: "bg-red-50 hover:bg-red-100 border-red-200",
  },
};

export function PlayerSection({
  title,
  count,
  players,
  variant,
  showCodigo = true,
}: PlayerSectionProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`rounded-lg border bg-card overflow-hidden ${styles.border}`}
    >
      <div
        className={`flex items-center justify-between gap-2 px-4 py-3 ${styles.header}`}
      >
        <h3 className="font-medium text-sm text-foreground">{title}</h3>
        <Badge variant="outline" className={`${styles.badge} font-semibold`}>
          {count}
        </Badge>
      </div>
      <div className="p-3 grid gap-2">
        {players.length > 0 ? (
          players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              showCodigo={showCodigo}
              cardClassName={styles.card}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No players
          </p>
        )}
      </div>
    </div>
  );
}
