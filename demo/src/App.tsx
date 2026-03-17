import { IconGithub } from "nucleo-social-media"
import {
	IconCheck3Outline18,
	IconDarkModeOutline18,
	IconDuplicate2Outline18,
} from "nucleo-ui-outline-18"
import { useCallback, useRef, useState } from "react"
import { version } from "tailwind-super-corners/package.json"
import { Button } from "./components/button"
import { FitHeadline } from "./components/fit-headline"
import { InsetShadow } from "./components/inset-shadow"
import { ScrollArea } from "./components/scroll-area"
import { Skeleton } from "./components/skeleton"
import { Slider } from "./components/slider"
import { StateTransition } from "./components/transitions/state-transition"
import { cn } from "./lib/utils"

const PADDING_OPTIONS = ["p-0", "p-1", "p-2", "p-3", "p-4", "p-5"]
const PADDING_LAYOUT: Record<string, { px: string; left: string; right: string }> = {
	"p-0": { px: "px-0", left: "left-0", right: "right-0" },
	"p-1": { px: "px-1", left: "left-1", right: "right-1" },
	"p-2": { px: "px-2", left: "left-2", right: "right-2" },
	"p-3": { px: "px-3", left: "left-3", right: "right-3" },
	"p-4": { px: "px-4", left: "left-4", right: "right-4" },
	"p-5": { px: "px-5", left: "left-5", right: "right-5" },
}
const RADIUS_OPTIONS = [
	"rounded-t-lg",
	"rounded-t-xl",
	"rounded-t-2xl",
	"rounded-t-3xl",
	"rounded-t-4xl",
	"rounded-t-5xl",
	"rounded-t-6xl",
	"rounded-t-7xl",
]
const OUT_OPTIONS = [
	"sc-out-sm",
	"sc-out-md",
	"sc-out-lg",
	"sc-out-xl",
	"sc-out-2xl",
	"sc-out-3xl",
	"sc-out-4xl",
	"sc-out-5xl",
	"sc-out-6xl",
	"sc-out-7xl",
]
const SHAPE_OPTIONS = [
	"sc-round",
	"sc-squircle",
	"sc-smooth",
	// "sc-scoop",
	// "sc-notch",
	"sc-bevel",
	"sc-square",
]

const supportsCornerShape = CSS.supports("corner-shape", "round")

const COPY_VALUE = "bun add tailwind-super-corners"

export default function App() {
	const [paddingClass, setPaddingClass] = useState("p-5")
	const [radiusClass, setRadiusClass] = useState("rounded-t-7xl")
	const [outClass, setOutClass] = useState("sc-out-7xl")
	const [shapeClass, setShapeClass] = useState("sc-round")
	const [copied, setCopied] = useState(false)
	const [skeletonKey, setSkeletonKey] = useState(0)
	const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"))
	const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
	const h1Ref = useRef<HTMLHeadingElement>(null)

	const toggleTheme = useCallback(() => {
		const next = !document.documentElement.classList.contains("dark")
		document.documentElement.classList.toggle("dark", next)
		localStorage.setItem("theme", next ? "dark" : "light")
		setDark(next)
	}, [])

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(COPY_VALUE)
		setCopied(true)
		setSkeletonKey(k => k + 1)
		if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
		copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
	}, [])

	return (
		<div className="h-dvh w-dvw bg-base-3 flex flex-col pb-6 overflow-hidden">
			<div
				className={cn(
					"absolute z-20 top-4 right-6 flex gap-2 md:p-0",
					PADDING_LAYOUT[paddingClass].px
				)}
			>
				<Button size="lg" rounded variant="ghost" className="text-base-a9" onClick={toggleTheme}>
					<IconDarkModeOutline18 data-icon="inline-start" />
				</Button>
				<a
					href="https://github.com/tecoad/tailwind-super-corners/blob/main/README.md"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button size="lg" rounded variant="outline">
						Docs
					</Button>
				</a>
				<a
					href="https://github.com/tecoad/tailwind-super-corners"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button size="lg" rounded variant="solid">
						<IconGithub data-icon="inline-start" />
						Github
					</Button>
				</a>
			</div>
			<div className={cn("bg-base-1 flex-1 min-h-0 flex border-b px-6")}>
				<div className="max-w-xl  w-full border-x relative border-base-5 mx-auto flex-1 min-h-0 flex flex-col">
					<div
						className={cn(
							"pointer-events-none h-dvh border-dotted absolute z-2 border-x border-[base-3] -mx-px",
							PADDING_LAYOUT[paddingClass].left,
							PADDING_LAYOUT[paddingClass].right
						)}
					/>

					{/* Headline */}
					<div
						className={cn(
							"z-10 flex flex-col gap-8 mb-10 justify-end items-center flex-1",
							PADDING_LAYOUT[paddingClass].px
						)}
					>
						<FitHeadline headlineClassName="font-medium tracking-tighter leading-[1] mt-15">
							<FitHeadline.Line>
								<InsetShadow blur={1} offset={{ y: 1 }} color="var(--color-white-a5)">
									{filterId => (
										<h1
											className="text-base-12"
											ref={h1Ref}
											style={{ filter: `url(#${filterId})` }}
										>
											tailwind
										</h1>
									)}
								</InsetShadow>
							</FitHeadline.Line>
							<FitHeadline.Line>
								<InsetShadow blur={1} offset={{ y: 1 }} color="var(--color-white-a5)">
									{filterId => (
										<h1
											className="text-base-12"
											ref={h1Ref}
											style={{ filter: `url(#${filterId})` }}
										>
											super-corners&nbsp;
											<span className="text-sm tracking-normal font-semibold text-base-9">
												v.{version}
											</span>
										</h1>
									)}
								</InsetShadow>
							</FitHeadline.Line>
						</FitHeadline>
						<button
							type="button"
							onClick={handleCopy}
							className="text-base-9 relative overflow-hidden text-lg rounded-lg flex items-center justify-between gap-3 cursor-pointer"
						>
							<div className="py-2 pl-4 z-1 select-auto">{COPY_VALUE}</div>
							<div className="pr-3 py-2 z-1 flex items-center justify-center h-full">
								<StateTransition
									state={copied ? "copied" : "idle"}
									preset="swap"
									direction="vertical"
								>
									<StateTransition.State name="idle">
										<IconDuplicate2Outline18 className="text-base-8" />
									</StateTransition.State>
									<StateTransition.State name="copied">
										<IconCheck3Outline18 className="text-accent-8" />
									</StateTransition.State>
								</StateTransition>
							</div>
							<div className="bg-base-3 absolute inset-0 z-0" />
							{copied && (
								<Skeleton
									key={skeletonKey}
									executeOnce
									className="absolute [--skeleton-duration:2s] select-none z-0 inset-0 [--highlight-color:var(--color-accent-3)]"
								/>
							)}
						</button>
					</div>
					{/* Preview */}
					<div
						className={cn(
							"-m-px  pb-0! relative  min-h-0 border border-b-0 bg-base-3   flex flex-col",
							paddingClass,
							radiusClass,
							outClass,
							shapeClass
						)}
					>
						<div
							className={cn(
								"sc-concentric  bg-base-1 flex-1 min-h-0 flex flex-col border border-b-0 rounded-b-none -m-px -mb-6",
								shapeClass
							)}
						>
							<ScrollArea hideScrollbar scrollFade className="flex-1 min-h-0">
								<div className="flex flex-col gap-5 p-2 mb-6">
									<Slider
										label="Padding"
										size="lg"
										options={PADDING_OPTIONS}
										value={paddingClass}
										onValueChange={setPaddingClass}
									/>
									<Slider
										label="Border Radius"
										size="lg"
										options={RADIUS_OPTIONS}
										value={radiusClass}
										onValueChange={setRadiusClass}
									/>
									<Slider
										label="Outer Corners"
										size="lg"
										options={OUT_OPTIONS}
										value={outClass}
										onValueChange={setOutClass}
									/>
									{supportsCornerShape && (
										<Slider
											label="Corner Shape"
											size="lg"
											options={SHAPE_OPTIONS}
											value={shapeClass}
											onValueChange={setShapeClass}
										/>
									)}
								</div>
							</ScrollArea>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
