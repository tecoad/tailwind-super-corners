import { IconGithub } from "nucleo-social-media"
import { IconCheck3Outline18, IconDuplicate2Outline18 } from "nucleo-ui-outline-18"
import { useCallback, useRef, useState } from "react"
import { Button } from "./components/button"
import { FitHeadline } from "./components/fit-headline"
import { InsetShadow } from "./components/inset-shadow"
import { ScrollArea } from "./components/scroll-area"
import { Skeleton } from "./components/skeleton"
import { Slider } from "./components/slider"
import { StateTransition } from "./components/transitions/state-transition"
import { cn } from "./lib/utils"

const PADDING_OPTIONS = ["p-0", "p-1", "p-2", "p-3", "p-4", "p-5"]
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
	"sc-scoop",
	"sc-bevel",
	"sc-notch",
	"sc-square",
]

const COPY_VALUE = "bun add tailwind-super-corners"

export default function App() {
	const [paddingClass, setPaddingClass] = useState("p-5")
	const [radiusClass, setRadiusClass] = useState("rounded-t-7xl")
	const [outClass, setOutClass] = useState("sc-out-7xl")
	const [shapeClass, setShapeClass] = useState("sc-round")
	const [copied, setCopied] = useState(false)
	const [skeletonKey, setSkeletonKey] = useState(0)
	const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
	const h1Ref = useRef<HTMLHeadingElement>(null)

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(COPY_VALUE)
		setCopied(true)
		setSkeletonKey(k => k + 1)
		if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
		copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
	}, [])

	return (
		<div className="h-dvh w-dvw bg-base-3 flex flex-col pb-6">
			<div className="absolute top-4 right-4 flex gap-2">
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
			<div className="bg-base-1 px-4 flex-1 min-h-0 flex  border-b">
				<div className="max-w-xl w-full border border-base-5 mx-auto flex-1 min-h-0 flex flex-col">
					<div className="flex flex-col gap-8 mb-10 justify-end items-center flex-1">
						<FitHeadline headlineClassName="font-medium tracking-tighter leading-[1] mt-15">
							<FitHeadline.Line>
								<InsetShadow blur={1} offset={{ y: 1 }} color="var(--color-white-a5)">
									{filterId => (
										<h1
											className="text-base-12"
											ref={h1Ref}
											style={{ filter: `url(#${filterId})` }}
										>
											Tailwind
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
											Super Corners&nbsp;
											<span className="text-sm tracking-normal text-base-9">v.1.1</span>
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
					<div
						className={cn(
							"-m-px  -mb-[2px] pb-0! relative  min-h-0 border border-b-0 bg-base-3   flex flex-col",
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
									<Slider
										label="Corner Shape"
										size="lg"
										options={SHAPE_OPTIONS}
										value={shapeClass}
										onValueChange={setShapeClass}
									/>
								</div>
							</ScrollArea>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
