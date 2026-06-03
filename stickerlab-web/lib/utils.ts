import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercentage(value: number, decimals: number = 1): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "0.0%";
  }
  return `${value.toFixed(decimals)}%`;
}
