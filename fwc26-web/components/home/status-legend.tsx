import { STATUS_LABELS } from "@/lib/constants";

const LEGEND_ITEMS = [
  { color: "bg-status-success", label: STATUS_LABELS.IN_ALBUM_AND_CALLED_UP },
  { color: "bg-status-warning", label: STATUS_LABELS.ONLY_IN_ALBUM },
  { color: "bg-status-error", label: STATUS_LABELS.CALLED_UP_WITHOUT_STICKER },
] as const;

export function StatusLegend() {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
      {LEGEND_ITEMS.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${color}`} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
