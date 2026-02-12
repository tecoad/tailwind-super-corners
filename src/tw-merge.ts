/**
 * tailwind-merge plugin for @plez/tailwind-super-corners
 *
 * Usage:
 *   import { withSuperCorners } from "@plez/tailwind-super-corners"
 *   const twMerge = extendTailwindMerge(withSuperCorners)
 */

import { type Config, type DefaultClassGroupIds, mergeConfigs } from "tailwind-merge"

const isAny = () => true
const shape = (prefix: string) => [
	`${prefix}-round`,
	`${prefix}-scoop`,
	`${prefix}-bevel`,
	`${prefix}-notch`,
	`${prefix}-square`,
	`${prefix}-squircle`,
	`${prefix}-smooth`,
	{ [`${prefix}-superellipse`]: [isAny] },
]
const out = (name: string) => [name, { [name]: [isAny] }]

export function withSuperCorners(config: Config<string, string>): Config<string, string> {
	return mergeConfigs<DefaultClassGroupIds | string>(config, {
		extend: {
			classGroups: {
				// ── Concentric → extends existing rounded groups ──
				rounded: ["sc-concentric", { "sc-concentric": [isAny] }],
				"rounded-t": ["sc-t-concentric", { "sc-t-concentric": [isAny] }],
				"rounded-r": ["sc-r-concentric", { "sc-r-concentric": [isAny] }],
				"rounded-b": ["sc-b-concentric", { "sc-b-concentric": [isAny] }],
				"rounded-l": ["sc-l-concentric", { "sc-l-concentric": [isAny] }],
				"rounded-tl": ["sc-tl-concentric", { "sc-tl-concentric": [isAny] }],
				"rounded-tr": ["sc-tr-concentric", { "sc-tr-concentric": [isAny] }],
				"rounded-bl": ["sc-bl-concentric", { "sc-bl-concentric": [isAny] }],
				"rounded-br": ["sc-br-concentric", { "sc-br-concentric": [isAny] }],

				// ── Corner shape ──
				"sc-shape": shape("sc"),
				"sc-t-shape": shape("sc-t"),
				"sc-r-shape": shape("sc-r"),
				"sc-b-shape": shape("sc-b"),
				"sc-l-shape": shape("sc-l"),
				"sc-s-shape": shape("sc-s"),
				"sc-e-shape": shape("sc-e"),
				"sc-tl-shape": shape("sc-tl"),
				"sc-tr-shape": shape("sc-tr"),
				"sc-bl-shape": shape("sc-bl"),
				"sc-br-shape": shape("sc-br"),
				"sc-ss-shape": shape("sc-ss"),
				"sc-se-shape": shape("sc-se"),
				"sc-ee-shape": shape("sc-ee"),
				"sc-es-shape": shape("sc-es"),

				// ── Outer corners ──
				"sc-out": out("sc-out"),
				"sc-out-t": out("sc-out-t"),
				"sc-out-b": out("sc-out-b"),
				"sc-out-l": out("sc-out-l"),
				"sc-out-r": out("sc-out-r"),
				"sc-out-tl": out("sc-out-tl"),
				"sc-out-tr": out("sc-out-tr"),
				"sc-out-bl": out("sc-out-bl"),
				"sc-out-br": out("sc-out-br"),
				"sc-out-lt": out("sc-out-lt"),
				"sc-out-lb": out("sc-out-lb"),
				"sc-out-rt": out("sc-out-rt"),
				"sc-out-rb": out("sc-out-rb"),
			},
			conflictingClassGroups: {
				// Shape: all corners overrides per-side
				"sc-shape": [
					"sc-t-shape", "sc-r-shape", "sc-b-shape", "sc-l-shape",
					"sc-s-shape", "sc-e-shape",
					"sc-tl-shape", "sc-tr-shape", "sc-bl-shape", "sc-br-shape",
					"sc-ss-shape", "sc-se-shape", "sc-ee-shape", "sc-es-shape",
				],
				// Shape: side overrides individual corners
				"sc-t-shape": ["sc-tl-shape", "sc-tr-shape"],
				"sc-r-shape": ["sc-tr-shape", "sc-br-shape"],
				"sc-b-shape": ["sc-bl-shape", "sc-br-shape"],
				"sc-l-shape": ["sc-tl-shape", "sc-bl-shape"],
				"sc-s-shape": ["sc-ss-shape", "sc-es-shape"],
				"sc-e-shape": ["sc-se-shape", "sc-ee-shape"],
			},
		},
	})
}
