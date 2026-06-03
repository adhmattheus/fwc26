import { ACCURACY_THRESHOLDS } from "./constants";

export type StatusVariant = "success" | "warning" | "error";
export type AccuracyLevel = "perfect" | "good" | "low";

export interface StatusStyles {
  badge: string;
  background: string;
  text: string;
  border: string;
}

const STATUS_STYLES: Record<StatusVariant, StatusStyles> = {
  success: {
    badge: "bg-status-success/20 text-status-success border-status-success/30",
    background: "bg-status-success/10",
    text: "text-status-success",
    border: "border-status-success/20",
  },
  warning: {
    badge: "bg-status-warning/20 text-status-warning border-status-warning/30",
    background: "bg-status-warning/10",
    text: "text-status-warning",
    border: "border-status-warning/20",
  },
  error: {
    badge: "bg-status-error/20 text-status-error border-status-error/30",
    background: "bg-status-error/10",
    text: "text-status-error",
    border: "border-status-error/20",
  },
};

export function getStatusStyles(variant: StatusVariant): StatusStyles {
  return STATUS_STYLES[variant];
}

export function getAccuracyVariant(rate: number): StatusVariant {
  if (rate === ACCURACY_THRESHOLDS.PERFECT) return "success";
  if (rate >= ACCURACY_THRESHOLDS.GOOD) return "warning";
  return "error";
}

export function getAccuracyLabel(rate: number): AccuracyLevel {
  if (rate === ACCURACY_THRESHOLDS.PERFECT) return "perfect";
  if (rate >= ACCURACY_THRESHOLDS.GOOD) return "good";
  return "low";
}

export function getAccuracyBadgeClasses(rate: number): string {
  const variant = getAccuracyVariant(rate);
  return STATUS_STYLES[variant].badge;
}

export function getTeamGradient(
  primaryColor: string,
  secondaryColor: string,
): string {
  return `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor} 60%, ${secondaryColor} 60%, ${secondaryColor} 100%)`;
}
