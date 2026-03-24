import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as a dollar amount. Handles NaN and Infinity gracefully. */
export function fmt(n: number): string {
  if (!isFinite(n)) return "$0";
  const abs = Math.abs(n);
  const str = abs >= 1000 ? abs.toLocaleString("en-US", { maximumFractionDigits: 0 }) : abs.toFixed(0);
  return n < 0 ? `-$${str}` : `$${str}`;
}
