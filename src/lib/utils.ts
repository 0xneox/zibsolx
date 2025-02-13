import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num === undefined || num === null) return '0';
  
  const absNum = Math.abs(num);
  if (absNum >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  } else if (absNum >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  } else if (absNum >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  } else {
    return num.toFixed(2);
  }
}

export function formatPrice(price: number): string {
  if (price === undefined || price === null) return '0.00';
  
  if (price < 0.01) {
    return price.toFixed(8);
  } else if (price < 1) {
    return price.toFixed(4);
  } else {
    return price.toFixed(2);
  }
}

export function formatPercent(num: number): string {
  if (num === undefined || num === null) return '0.00';
  return num.toFixed(2);
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
