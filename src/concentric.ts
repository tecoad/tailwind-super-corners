import plugin from "tailwindcss/plugin"

type CssInJs = { [key: string]: string | string[] | CssInJs | CssInJs[] }

const RP = ':is([class*="rounded-"])'
// Padded by any padding class: a side radius (rounded-t-*, …) becomes the
// reference on such an element, as it always has.
const PP =
	':is([class*="p-"],[class*="px-"],[class*="py-"],[class*="pt-"],[class*="pb-"],[class*="ps-"],[class*="pe-"])'
// May carry a p-*, an sc-fit-* or a border width. The match is loose (gap-2
// and border-border match too), and that is harmless: --sc-gap and --sc-border
// are registered as non-inherited in index.css, so an element without its own
// gap or border width takes nothing off.
const STEP = ':is([class*="p-"],[class*="sc-fit"],[class*="border"])'

// What one level takes off the radius: its own padding and border width.
const INSET = "var(--sc-gap) - var(--sc-border)"

// The reference every nested sc-concentric measures from.
const ROOT: CssInJs = {
	"--_sc-parity": "odd",
	"--sc-odd": `calc(var(--sc-radius) - ${INSET})`,
}

function propsToDecls(props: string[], value: string): CssInJs {
	const decls: CssInJs = {}
	for (const p of props) decls[p] = value
	return decls
}

// A rounded-* publisher. A CSS-wide keyword (rounded-[inherit], …) names no
// radius of its own: the element styles its corners and stays transparent to
// the chain instead of restarting it from an inherited --sc-radius.
const CSS_WIDE = new Set(["inherit", "initial", "unset", "revert", "revert-layer"])
const radius =
	(props: string[], root: CssInJs = {}) =>
	(value: string): CssInJs =>
		CSS_WIDE.has(value)
			? propsToDecls(props, value)
			: { "--_sc-active": "1", "--sc-radius": value, ...propsToDecls(props, value), ...root }

// Never below --sc-min, and never rounder than the reference it nests in.
const withFloor = (accumulated: string) =>
	`max(min(var(--sc-min, 0px), var(--sc-radius)), var(${accumulated}))`

// Inside out: the gap that puts a pill's curve on the corner's center. The
// radius left at this level, minus half the pill, minus this element's own
// border; never below --sc-fit-min.
const fitGap = (available: string, pill: string) =>
	`max(var(--sc-fit-min, 0.25rem), calc(${available} - ${pill} / 2 - var(--sc-border)))`

export default plugin(({ addBase, matchUtilities, theme }) => {
	// ─── Publishers (radius) ────────────────────────────────
	// Shadows core rounded-* to also set --sc-radius for propagation. A full
	// rounded-* makes the element the reference for everything inside it.

	matchUtilities(
		{
			rounded: radius(["border-radius"], ROOT),
			"rounded-t": radius(["border-top-left-radius", "border-top-right-radius"]),
			"rounded-r": radius(["border-top-right-radius", "border-bottom-right-radius"]),
			"rounded-b": radius(["border-bottom-right-radius", "border-bottom-left-radius"]),
			"rounded-l": radius(["border-top-left-radius", "border-bottom-left-radius"]),
		},
		{ values: theme("borderRadius") }
	)

	// ─── Publishers (padding/gap) ───────────────────────────
	// Only the `p` shorthand: a concentric curve needs the same gap on both
	// sides of a corner, and per-side overrides (e.g. pb-0) keep --sc-gap.

	matchUtilities(
		{
			p: value => ({
				"--sc-gap": value,
				padding: value,
			}),
		},
		{ values: theme("spacing") }
	)

	// ─── Publishers (border width) ──────────────────────────
	// Only the uniform `border` / `border-{n}`, for the same reason.

	matchUtilities(
		{
			border: value => ({
				"--sc-border": value,
				"border-width": value,
			}),
		},
		{ values: theme("borderWidth"), type: ["length"] }
	)

	// ─── Minimum radius ─────────────────────────────────────

	matchUtilities(
		{
			"sc-min": value => ({
				"--sc-min": value,
			}),
		},
		{ values: theme("borderRadius"), type: ["length"] }
	)

	// ─── Inside out (sc-fit) ────────────────────────────────
	// sc-fit-{h} goes on the element whose padding holds pills of height h.
	// On a rounded-* element the corner is its own radius; deeper in, it is the
	// radius left at the parent's level. The gap also publishes as --sc-gap,
	// so blocks inside still nest concentrically.

	matchUtilities(
		{
			"sc-fit": value => {
				const gap = (available: string) => ({
					padding: fitGap(available, value),
					"--sc-gap": fitGap(available, value),
				})
				return {
					...gap("var(--sc-radius, 0px)"),
					"@container style(--_sc-parity: odd)": gap("var(--sc-odd)"),
					"@container style(--_sc-parity: even)": gap("var(--sc-even)"),
					[`&${RP}`]: gap("var(--sc-radius)"),
				}
			},
		},
		{ values: theme("spacing"), type: ["length"] }
	)

	// ─── Consumer variant map ───────────────────────────────

	const CONCENTRIC_VARIANTS: Record<string, string[]> = {
		"sc-concentric": ["border-radius"],
		"sc-t-concentric": ["border-top-left-radius", "border-top-right-radius"],
		"sc-r-concentric": ["border-top-right-radius", "border-bottom-right-radius"],
		"sc-b-concentric": ["border-bottom-right-radius", "border-bottom-left-radius"],
		"sc-l-concentric": ["border-top-left-radius", "border-bottom-left-radius"],
		"sc-tl-concentric": ["border-top-left-radius"],
		"sc-tr-concentric": ["border-top-right-radius"],
		"sc-bl-concentric": ["border-bottom-left-radius"],
		"sc-br-concentric": ["border-bottom-right-radius"],
	}

	// ─── Accumulation via container style queries ───────────

	addBase({
		[STEP]: {
			"@container style(--_sc-active: 1) and (not style(--_sc-parity))": {
				"--_sc-parity": "odd",
				"--sc-odd": `calc(var(--sc-radius) - ${INSET})`,
			},
			"@container style(--_sc-active: 1) and style(--_sc-parity: even)": {
				"--_sc-parity": "odd",
				"--sc-odd": `calc(var(--sc-even) - ${INSET})`,
			},
			"@container style(--_sc-active: 1) and style(--_sc-parity: odd)": {
				"--_sc-parity": "even",
				"--sc-even": `calc(var(--sc-odd) - ${INSET})`,
			},
		},

		[`${PP}${RP}`]: ROOT,
	})

	// ─── Consumer ───────────────────────────────────────────

	for (const [cls, props] of Object.entries(CONCENTRIC_VARIANTS)) {
		matchUtilities(
			{
				[cls]: value => {
					const decls: CssInJs = {}
					for (const p of props) decls[p] = `var(--sc-radius, ${value})`
					decls["@container style(--_sc-parity: odd)"] = propsToDecls(props, withFloor("--sc-odd"))
					decls["@container style(--_sc-parity: even)"] = propsToDecls(
						props,
						withFloor("--sc-even")
					)
					return decls
				},
			},
			{ values: { DEFAULT: "inherit", ...theme("borderRadius") } }
		)
	}
})
