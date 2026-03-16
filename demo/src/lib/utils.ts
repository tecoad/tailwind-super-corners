import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const truncate = (str: string, num: number) => {
	if (!str) return ""
	if (str.length <= num) {
		return str
	}
	return `${str.slice(0, num)}...`
}

export const calculateFontSize = ({
	text,
	maxSizePx,
	minSizePx,
}: {
	text: string | null
	maxSizePx: number
	minSizePx: number
}): number => {
	if (!text) return maxSizePx

	const textLength = text.length
	const fontSize = maxSizePx - (textLength * (maxSizePx - minSizePx)) / 50

	return Math.max(fontSize, minSizePx)
}
