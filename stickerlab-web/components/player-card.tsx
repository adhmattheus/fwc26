import type { PlayerResponse } from "@/services/teams.service";

interface PlayerCardProps {
  player: PlayerResponse;
  showCodigo?: boolean;
  cardClassName?: string;
}

export function PlayerCard({
  player,
  showCodigo = true,
  cardClassName,
}: PlayerCardProps) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md border transition-colors ${cardClassName || "bg-muted/50 hover:bg-muted border-transparent"}`}
    >
      {showCodigo && player.albumCode && (
        <span className="text-[10px] font-mono text-muted-foreground bg-white/80 px-1.5 py-0.5 rounded border">
          {player.albumCode}
        </span>
      )}
      <span className="text-sm text-foreground">{player.name}</span>
    </div>
  );
}
