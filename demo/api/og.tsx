import { ImageResponse } from "@vercel/og"
import { V1} from "../src/components/OgBg"

export const config = { runtime: "edge" }

async function loadGoogleFont(font: string, text: string, weight: number) {
	const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&text=${encodeURIComponent(text)}`
	const css = await (await fetch(url)).text()
	const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

	if (resource) {
		const response = await fetch(resource[1])
		if (response.status === 200) {
			return await response.arrayBuffer()
		}
	}

	throw new Error("failed to load font data")
}

const truncate = (str: string, num: number) => {
	if (!str) return ""
	if (str.length <= num) return str
	return `${str.slice(0, num)}...`
}

const calculateFontSize = ({
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

export default async function handler(req: Request) {
	try {
		const { searchParams } = new URL(req.url)

		const version = searchParams.get("v") ?? "v2"
		const isLight = req.headers.get("Sec-CH-Prefers-Color-Scheme") === "light"
		const title = searchParams.get("title") ?? "Matt Silva"
		const description = searchParams.get("description")

		const allText = `${title} ${description ?? ""} Matt Silva @mattsilx`

		const fonts = [
			{
				name: "inter",
				data: await loadGoogleFont("Inter", allText, 500),
				style: "normal" as const,
				weight: 500 as const,
			},
			{
				name: "inter",
				data: await loadGoogleFont("Inter", allText, 700),
				style: "normal" as const,
				weight: 700 as const,
			},
		]



		// V1 layout (default)
		return new ImageResponse(
			<div
				tw="flex w-full h-full flex flex-col p-8 w-full justify-between items-center"
				style={{ backgroundColor: isLight ? "white" : "black" }}
			>
				<div tw="flex flex-row items-center justify-between w-full">
					<span
						style={{ color: isLight ? "black" : "white" }}
						tw="text-5xl"
					>
						Matt Silva
					</span>
					<span
						style={{ color: isLight ? "black" : "white" }}
						tw="text-3xl"
					>
						@mattsilx
					</span>
				</div>

				<div tw="flex flex-row items-end justify-center w-full">
					{title && (
						<span
							style={{
								color: isLight ? "black" : "white",
								fontSize: `${calculateFontSize({
									text: title,
									maxSizePx: 65,
									minSizePx: 55,
								})}px`,
								letterSpacing: "-0.03em",
								lineHeight: "1.05",
							}}
							tw="text-pretty text-center max-w-2/3 mb-8"
						>
							{truncate(title, 100)}
						</span>
					)}
				</div>

				<V1
					isLight={isLight}
					style={{
						position: "absolute",
						top: 0,
						color: isLight ? "black" : "white",
					}}
				/>
			</div>,
			{ width: 1200, height: 630, fonts, emoji: "blobmoji" },
		)
	} catch (e) {
		if (!(e instanceof Error)) throw e
		console.log(e.message)
		return new Response("Failed to generate the image", { status: 500 })
	}
}
