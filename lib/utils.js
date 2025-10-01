import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function truncateAddress(address, chars = 6) {
    // Basic check for valid input length
    if (!address || address.length < chars * 2 + 3) {
        return address;
    }

    const cleanAddress = String(address).trim();

    // Default formatting: '0x123456...ABCD' (first 6 after 0x, last 4)
    return `${cleanAddress.substring(0, chars + 2)}...${cleanAddress.substring(cleanAddress.length - 4)}`;
}
