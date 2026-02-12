import { defineConfig } from "tsup"

export default defineConfig([
	// Plugin files (loaded via @plugin in CSS — no .d.ts needed)
	{
		entry: ["src/concentric.ts", "src/shape.ts"],
		format: ["esm"],
		dts: false,
		outDir: "dist",
		clean: true,
		external: ["tailwindcss"],
	},
	// Consumer-facing exports (need .d.ts)
	{
		entry: ["src/index.ts", "src/tw-merge.ts"],
		format: ["esm"],
		dts: true,
		outDir: "dist",
		clean: false,
		external: ["tailwind-merge"],
	},
])
