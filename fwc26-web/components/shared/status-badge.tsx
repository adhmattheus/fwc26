import { Badge } from "@/components/ui/badge";
import { type StatusVariant, getStatusStyles } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  variant: StatusVariant;
  count: number;
  size?: "sm" | "md";
}

const SIZE_CLASSES = {
  sm: "text-[10px] px-1.5 py-0 h-5",
  md: "text-xs px-2 py-1",
} as const;

export function StatusBadge({ variant, count, size = "sm" }: StatusBadgeProps) {
  const styles = getStatusStyles(variant);

  return (
    <Badge
      variant="outline"
      className={cn(
        SIZE_CLASSES[size],
        styles.background,
        styles.text,
        `border-${variant === "success" ? "status-success" : variant === "warning" ? "status-warning" : "status-error"}/30`,
        "font-medium",
      )}
    >
      {count}
    </Badge>
  );
}
