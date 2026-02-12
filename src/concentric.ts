import plugin from "tailwindcss/plugin"

const RP = ':is([class*="rounded-"])'
const PP =
	':is([class*="p-"],[class*="px-"],[class*="py-"],[class*="pt-"],[class*="pb-"],[class*="ps-"],[class*="pe-"])'

type CssInJs = { [key: string]: string | string[] | CssInJs | CssInJs[] }

export default plugin(({ addBase, matchUtilities, theme }) => {
	// ─── Publishers (radius) ────────────────────────────────
	// Shadows core rounded-* to also set --sc-radius for propagation.

	matchUtilities(
		{
			rounded: value => ({
				"--_sc-active": "1",
				"--sc-radius": value,
				"border-radius": value,
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
	// Shadows core p-* to also set --sc-gap for propagation.

	matchUtilities(
		{
			p: value => ({
				"--sc-gap": value,
				padding: value,
			}),
			px: value => ({
				"--sc-gap": value,
				"padding-inline": value,
			}),
			py: value => ({
				"--sc-gap": value,
				"padding-block": value,
			}),
			pt: value => ({
				"--sc-gap": value,
				"padding-top": value,
			}),
			pb: value => ({
				"--sc-gap": value,
				"padding-bottom": value,
			}),
			ps: value => ({
				"--sc-gap": value,
				"padding-inline-start": value,
			}),
			pe: value => ({
				"--sc-gap": value,
				"padding-inline-end": value,
			}),
		},
		{ values: theme("spacing") }
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
		[PP]: {
			"@container style(--_sc-active: 1) and not style(--_sc-parity)": {
				"--_sc-parity": "odd",
				"--sc-odd": "calc(var(--sc-radius) - var(--sc-gap))",
			},
			"@container style(--_sc-active: 1) and style(--_sc-parity: even)": {
				"--_sc-parity": "odd",
				"--sc-odd": "calc(var(--sc-even) - var(--sc-gap))",
			},
			"@container style(--_sc-active: 1) and style(--_sc-parity: odd)": {
				"--_sc-parity": "even",
				"--sc-even": "calc(var(--sc-odd) - var(--sc-gap))",
			},
		},

		[`${PP}${RP}`]: {
			"--_sc-parity": "odd",
			"--sc-odd": "calc(var(--sc-radius) - var(--sc-gap))",
		},
	})

	// ─── Consumer ───────────────────────────────────────────

	for (const [cls, props] of Object.entries(CONCENTRIC_VARIANTS)) {
		matchUtilities(
			{
				[cls]: value => {
					const decls: CssInJs = {}
					for (const p of props) decls[p] = `var(--sc-radius, ${value})`
					decls["@container style(--_sc-parity: odd)"] = propsToDecls(
						props,
						"max(0px, var(--sc-odd))"
					)
					decls["@container style(--_sc-parity: even)"] = propsToDecls(
						props,
						"max(0px, var(--sc-even))"
					)
					return decls
				},
			},
			{ values: { DEFAULT: "inherit", ...theme("borderRadius") } }
		)
	}
})
