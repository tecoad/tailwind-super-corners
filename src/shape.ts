import plugin from "tailwindcss/plugin"

// using empty values here so the compiler plays nice and generates the styles without values
const EMPTY_VALUES = { values: { DEFAULT: "" } }
const join = (...args: Array<string>) => args.filter(Boolean).join("-")

const sides: Record<string, Array<string>> = {
	"": [""],
	s: ["start-start", "end-start"],
	e: ["start-end", "end-end"],
	t: ["top-left", "top-right"],
	r: ["top-right", "bottom-right"],
	b: ["bottom-right", "bottom-left"],
	l: ["top-left", "bottom-left"],
	ss: ["start-start"],
	se: ["start-end"],
	ee: ["end-end"],
	es: ["end-start"],
	tl: ["top-left"],
	tr: ["top-right"],
	br: ["bottom-right"],
	bl: ["bottom-left"],
}

const cornerShapeStaticKeywords: Record<string, string> = {
	round: "round",
	scoop: "scoop",
	bevel: "bevel",
	notch: "notch",
	square: "square",
	squircle: "squircle",
	smooth: "superellipse(1.6)",
}

const cornerShapeSuperellipse: Record<string, string> = {
	bevel: "0",
	notch: "-infinity",
	round: "1",
	scoop: "-1",
	square: "infinity",
	smooth: "1.6",
	squircle: "2",
}

const cornerShapeFunctionalKeywords: Array<string> = ["superellipse"]

export default plugin(({ addUtilities, matchUtilities }) => {
	for (const [cornerShorthand, corners] of Object.entries(sides)) {
		const utilityPrefix = join("sc", cornerShorthand)
		for (const corner of corners) {
			// static keywords
			for (const [keyword, value] of Object.entries(cornerShapeStaticKeywords)) {
				addUtilities({
					[`.${utilityPrefix}-${keyword}`]: {
						[join("corner", corner, "shape")]: value,
						"--corner-superellipse": cornerShapeSuperellipse[keyword],
					},
				})
			}
			// functional values (accepts percentage argument, e.g. sc-superellipse/1.5)
			for (const keyword of cornerShapeFunctionalKeywords) {
				const allowlistedValues = ["e", "infinity", "pi"].flatMap(v => [v, `-${v}`])
				matchUtilities(
					{
						[`${utilityPrefix}-${keyword}`]: (_, { modifier: value }) => {
							if (!value || (Number.isNaN(Number(value)) && !allowlistedValues.includes(value)))
								return {} as Record<string, string>
							return {
								[join("corner", corner, "shape")]: `${keyword}(${value})`,
								"--corner-superellipse": value,
							}
						},
					},
					{
						...EMPTY_VALUES,
						modifiers: "any",
					}
				)
			}
		}
	}
})
