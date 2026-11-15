import plugin from "tailwindcss/plugin"

type CssInJs = { [key: string]: string | string[] | CssInJs | CssInJs[] }

const RP = ':is([class*="rounded-"])'
// Padded by any padding class: a side radius (rounded-t-*, …) becomes the
// reference on such an element, as it always has.
const PP =
	':is([class*="p-"],[class*="px-"],[class*="py-"],[class*="pt-"],[class*="pb-"],[class*="ps-"],[class*="pe-"])'
// May carry a p-* or a border width. The match is loose (gap-2 and
// border-border match too), and that is harmless: --sc-gap and --sc-border are
// registered as non-inherited in index.css, so an element without its own
// p-* or border width takes nothing off.
const STEP = ':is([class*="p-"],[class*="border"])'

// What one level takes off the radius: its own padding and border width.
const INSET = "var(--sc-gap) - var(--sc-border)"

// The reference every nested sc-concentric measures from.
const ROOT: CssInJs = {
	"--_sc-parity": "odd",
	"--sc-odd": `calc(var(--sc-radius) - ${INSET})`,
}

// Never below --sc-min, and never rounder than the reference it nests in.
const withFloor = (accumulated: string) =>
	`max(min(var(--sc-min, 0px), var(--sc-radius)), var(${accumulated}))`

export default plugin(({ addBase, matchUtilities, theme }) => {
	// ─── Publishers (radius) ────────────────────────────────
	// Shadows core rounded-* to also set --sc-radius for propagation. A full
	// rounded-* makes the element the reference for everything inside it.

	matchUtilities(
		{
			rounded: value => ({
				"--_sc-active": "1",
				"--sc-radius": value,
				"border-radius": value,
				...ROOT,
			}),
			"rounded-t": value => ({
				"--_sc-active": "1",
				"--sc-radius": value,
				"border-top-left-radius": value,
				"border-top-right-radius": value,
			}),
			"rounded-r": value => ({
				"--_sc-active": "1",
				"--sc-radius": value,
				"border-top-right-radius": value,
				"border-bottom-right-radius": value,
			}),
			"rounded-b": value => ({
				"--_sc-active": "1",
				"--sc-radius": value,
				"border-bottom-right-radius": value,
				"border-bottom-left-radius": value,
			}),
			"rounded-l": value => ({
				"--_sc-active": "1",
				"--sc-radius": value,
				"border-top-left-radius": value,
				"border-bottom-left-radius": value,
			}),
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

	function propsToDecls(props: string[], value: string): CssInJs {
		const decls: CssInJs = {}
		for (const p of props) decls[p] = value
		return decls
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
