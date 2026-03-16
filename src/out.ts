import plugin from "tailwindcss/plugin"

// ─── Types ──────────────────────────────────────────

type CssInJs = { [key: string]: string | CssInJs }

type Pseudo = {
	el: "before" | "after"
	offset: Record<string, string>
	maskPos: string
	bgPos: string
	hDir: string
	vDir: string
	radius: string
}

type Variant = {
	cssVar: string
	shared: Record<string, string>
	pseudos: Pseudo[]
}

// ─── Gradient helpers ───────────────────────────────

const ARC =
	"radial-gradient(100% 100% at center, transparent calc(50% - 0.5px), var(--sc-out-border-color, transparent) calc(50%), var(--sc-out-border-color, transparent) calc(50% + var(--sc-out-border-width, 0px)), transparent calc(50% + var(--sc-out-border-width, 0px) + 0.5px))"

function edge(dir: string) {
	return `linear-gradient(${dir}, var(--sc-out-border-color, transparent) var(--sc-out-border-width, 0px), transparent var(--sc-out-border-width, 0px))`
}

// ─── Border helpers ─────────────────────────────────

function borderZeroFromRadius(radius: string): Record<string, string> {
	// The curved corner uses two border sides. Zero the opposite two.
	const map: Record<string, Record<string, string>> = {
		"border-top-left-radius": { "border-right": "0", "border-bottom": "0" },
		"border-top-right-radius": { "border-left": "0", "border-bottom": "0" },
		"border-bottom-left-radius": { "border-right": "0", "border-top": "0" },
		"border-bottom-right-radius": { "border-left": "0", "border-top": "0" },
	}
	return map[radius]
}

// ─── Variant data ───────────────────────────────────

function neg(v: string) {
	return `calc(var(${v}) * -1)`
}

const VARIANTS: Record<string, Variant> = {
	"sc-out": {
		cssVar: "--sc-out-radius",
		shared: { top: "auto", bottom: "0" },
		pseudos: [
			{ el: "before", offset: { left: neg("--sc-out-radius") }, maskPos: "100% 100%", bgPos: "100% 100%", hDir: "to bottom", vDir: "to right", radius: "border-top-left-radius" },
			{ el: "after", offset: { right: neg("--sc-out-radius") }, maskPos: "0% 100%", bgPos: "0% 100%", hDir: "to bottom", vDir: "to left", radius: "border-top-right-radius" },
		],
	},
	"sc-out-b": {
		cssVar: "--sc-out-radius-b",
		shared: { top: "auto", bottom: "0" },
		pseudos: [
			{ el: "before", offset: { left: neg("--sc-out-radius-b") }, maskPos: "100% 100%", bgPos: "100% 100%", hDir: "to bottom", vDir: "to right", radius: "border-top-left-radius" },
			{ el: "after", offset: { right: neg("--sc-out-radius-b") }, maskPos: "0% 100%", bgPos: "0% 100%", hDir: "to bottom", vDir: "to left", radius: "border-top-right-radius" },
		],
	},
	"sc-out-t": {
		cssVar: "--sc-out-radius-t",
		shared: { top: "0", bottom: "auto" },
		pseudos: [
			{ el: "before", offset: { left: neg("--sc-out-radius-t") }, maskPos: "100% 0%", bgPos: "100% 0%", hDir: "to top", vDir: "to right", radius: "border-bottom-left-radius" },
			{ el: "after", offset: { right: neg("--sc-out-radius-t") }, maskPos: "0% 0%", bgPos: "0% 0%", hDir: "to top", vDir: "to left", radius: "border-bottom-right-radius" },
		],
	},
	"sc-out-l": {
		cssVar: "--sc-out-radius-l",
		shared: { left: "0", right: "auto" },
		pseudos: [
			{ el: "before", offset: { top: neg("--sc-out-radius-l"), bottom: "auto" }, maskPos: "0% 100%", bgPos: "0% 100%", hDir: "to bottom", vDir: "to left", radius: "border-top-right-radius" },
			{ el: "after", offset: { bottom: neg("--sc-out-radius-l"), top: "auto" }, maskPos: "0% 0%", bgPos: "0% 0%", hDir: "to top", vDir: "to left", radius: "border-bottom-right-radius" },
		],
	},
	"sc-out-r": {
		cssVar: "--sc-out-radius-r",
		shared: { left: "auto", right: "0" },
		pseudos: [
			{ el: "before", offset: { top: neg("--sc-out-radius-r"), bottom: "auto" }, maskPos: "100% 100%", bgPos: "100% 100%", hDir: "to bottom", vDir: "to right", radius: "border-top-left-radius" },
			{ el: "after", offset: { bottom: neg("--sc-out-radius-r"), top: "auto" }, maskPos: "100% 0%", bgPos: "100% 0%", hDir: "to top", vDir: "to right", radius: "border-bottom-left-radius" },
		],
	},
	"sc-out-bl": {
		cssVar: "--sc-out-radius-bl",
		shared: { top: "auto", bottom: "0" },
		pseudos: [{ el: "before", offset: { left: neg("--sc-out-radius-bl") }, maskPos: "100% 100%", bgPos: "100% 100%", hDir: "to bottom", vDir: "to right", radius: "border-top-left-radius" }],
	},
	"sc-out-br": {
		cssVar: "--sc-out-radius-br",
		shared: { top: "auto", bottom: "0" },
		pseudos: [{ el: "after", offset: { right: neg("--sc-out-radius-br") }, maskPos: "0% 100%", bgPos: "0% 100%", hDir: "to bottom", vDir: "to left", radius: "border-top-right-radius" }],
	},
	"sc-out-tl": {
		cssVar: "--sc-out-radius-tl",
		shared: { top: "0", bottom: "auto" },
		pseudos: [{ el: "before", offset: { left: neg("--sc-out-radius-tl") }, maskPos: "100% 0%", bgPos: "100% 0%", hDir: "to top", vDir: "to right", radius: "border-bottom-left-radius" }],
	},
	"sc-out-tr": {
		cssVar: "--sc-out-radius-tr",
		shared: { top: "0", bottom: "auto" },
		pseudos: [{ el: "after", offset: { right: neg("--sc-out-radius-tr") }, maskPos: "0% 0%", bgPos: "0% 0%", hDir: "to top", vDir: "to left", radius: "border-bottom-right-radius" }],
	},
	"sc-out-lt": {
		cssVar: "--sc-out-radius-lt",
		shared: { left: "0", right: "auto" },
		pseudos: [{ el: "before", offset: { top: neg("--sc-out-radius-lt") }, maskPos: "0% 100%", bgPos: "0% 100%", hDir: "to bottom", vDir: "to left", radius: "border-top-right-radius" }],
	},
	"sc-out-lb": {
		cssVar: "--sc-out-radius-lb",
		shared: { left: "0", right: "auto" },
		pseudos: [{ el: "after", offset: { bottom: neg("--sc-out-radius-lb") }, maskPos: "0% 0%", bgPos: "0% 0%", hDir: "to top", vDir: "to left", radius: "border-bottom-right-radius" }],
	},
	"sc-out-rt": {
		cssVar: "--sc-out-radius-rt",
		shared: { left: "auto", right: "0" },
		pseudos: [{ el: "before", offset: { top: neg("--sc-out-radius-rt") }, maskPos: "100% 100%", bgPos: "100% 100%", hDir: "to bottom", vDir: "to right", radius: "border-top-left-radius" }],
	},
	"sc-out-rb": {
		cssVar: "--sc-out-radius-rb",
		shared: { left: "auto", right: "0" },
		pseudos: [{ el: "after", offset: { bottom: neg("--sc-out-radius-rb") }, maskPos: "100% 0%", bgPos: "100% 0%", hDir: "to top", vDir: "to right", radius: "border-bottom-left-radius" }],
	},
}

// ─── CSS generator ──────────────────────────────────

function generateCSS(config: Variant): CssInJs {
	const v = `var(${config.cssVar})`
	const result: CssInJs = {}

	const pseudoSel =
		config.pseudos.length === 2 ? "&::before, &::after" : `&::${config.pseudos[0].el}`

	// Shared pseudo styles
	result[pseudoSel] = {
		content: '""',
		position: "absolute",
		display: "block",
		width: v,
		"aspect-ratio": "1 / 1",
		overflow: "hidden",
		"pointer-events": "none",
		"background-color": "inherit",
		"background-size": "200% 200%, 100% 100%, 100% 100%",
		"mask-image": "var(--sc-out-mask)",
		"mask-size": "var(--sc-out-mask-size)",
		...config.shared,
	}

	// Per-pseudo styles (offset, mask position, border gradients)
	for (const p of config.pseudos) {
		result[`&::${p.el}`] = {
			...p.offset,
			"mask-position": p.maskPos,
			"background-image": `${ARC}, ${edge(p.hDir)}, ${edge(p.vDir)}`,
			"background-position": `${p.bgPos}, 0 0, 0 0`,
		}
	}

	// @supports corner-shape: native border follows the concave shape
	// Uses border: inherit so pseudo-elements get the parent's border automatically
	// Each pseudo zeros the border side that faces the parent to avoid overlap
	const supports: CssInJs = {}
	supports[pseudoSel] = {
		"mask-image": "none",
		"background-image": "none",
		"background-color": "inherit",
		"corner-shape": "superellipse(calc(var(--corner-superellipse, 1) * -1))",
		"border": "inherit",
	}
	for (const p of config.pseudos) {
		// Zero the two border sides opposite to the curved corner
		// The curve spans 100% of the two sides that form the corner
		const zeroSides = borderZeroFromRadius(p.radius)
		supports[`&::${p.el}`] = {
			[p.radius]: "100%",
			...zeroSides,
		}
	}
	result["@supports (corner-shape: superellipse(1))"] = supports

	return result
}

// ─── Plugin ─────────────────────────────────────────

export default plugin(({ matchUtilities, addBase, theme }) => {
	// Theme variables (replaces @theme in out.css)
	addBase({
		":root": {
			"--sc-out-radius-base": "1rem",
			"--sc-out-mask":
				"radial-gradient(100% 100% at center, transparent calc(50% - 0.25px), black calc(50% + 0.25px))",
			"--sc-out-mask-size": "200% 200%",
		},
	})

	// ─── Shadow utilities (border) ──────────────────
	// Only shadows the `border` shorthand (not per-side variants like border-t, border-b)
	// so per-side overrides (e.g. border-b-0) don't clobber the variable.
	// Each call uses explicit `type` to avoid ambiguity between width and color.

	matchUtilities(
		{
			border: value => ({ "--sc-out-border-width": value, "border-width": value }),
		},
		{ values: theme("borderWidth"), type: ["length"] },
	)

	matchUtilities(
		{
			border: value => ({ "--sc-out-border-color": value, "border-color": value }),
		},
		{ values: theme("colors"), type: ["color"] },
	)

	// ─── Outer corner utilities ─────────────────────

	for (const [name, config] of Object.entries(VARIANTS)) {
		matchUtilities(
			{
				[name]: value => ({
					[config.cssVar]: value,
					...generateCSS(config),
				}),
			},
			{ values: { DEFAULT: "var(--sc-out-radius-base)", ...theme("borderRadius") } },
		)
	}
})
