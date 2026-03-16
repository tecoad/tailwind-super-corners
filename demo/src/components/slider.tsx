import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cva, type VariantProps } from "class-variance-authority"
import { animate, motion, useMotionValue, useTransform } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const sliderTrackVariants = cva(
	"relative w-full cursor-pointer select-none overflow-hidden sc-concentric-lg bg-base-3 transition-[outline-width_color_opacity] duration-100 has-focus-visible:outline-2 has-focus-visible:outline-offset-2",
	{
		variants: {
			size: {
				default: "h-8",
				lg: "h-10",
			},
		},
		defaultVariants: {
			size: "default",
		},
	}
)

const CLICK_THRESHOLD = 3
const DEAD_ZONE = 32
const MAX_CURSOR_RANGE = 200
const MAX_STRETCH = 8

const doElementsOverlap = (element1: DOMRect, element2: DOMRect) => {
	return !(
		element1.right < element2.left ||
		element1.left > element2.right ||
		element1.bottom < element2.top ||
		element1.top > element2.bottom
	)
}

function computeRubberStretch(clientX: number, rect: DOMRect, sign: number) {
	const distancePast = sign < 0 ? rect.left - clientX : clientX - rect.right
	const overflow = Math.max(0, distancePast - DEAD_ZONE)
	return sign * MAX_STRETCH * Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1.0))
}

interface SliderProps extends VariantProps<typeof sliderTrackVariants> {
	label: string
	options: string[]
	value: string
	onValueChange: (val: string) => void
	className?: string
	disabled?: boolean
}

function Slider({ label, options, value, className, onValueChange, disabled, size }: SliderProps) {
	const min = 0
	const max = options.length - 1
	const step = 1

	const indexFromValue = (val: string) => {
		const idx = options.indexOf(val)
		return idx >= 0 ? idx : 0
	}

	const [internalIndex, setInternalIndex] = useState(() => indexFromValue(value))
	const displayIndex = indexFromValue(value)
	const displayLabel = options[displayIndex] ?? options[0]

	const steps = options.map((_, i) => i)

	// Motion values for animated fill
	const percentage = (displayIndex / max) * 100
	const fillPercent = useMotionValue(percentage)
	const fillWidth = useTransform(fillPercent, [0, 100], ["0%", "100%"])
	const clipPathOutside = useTransform(fillPercent, pct => `inset(0 0 0 ${pct}%)`)
	const clipPathInside = useTransform(fillPercent, pct => `inset(0 ${100 - pct}% 0 0)`)

	// Rubber band motion values
	const rubberStretchPx = useMotionValue(0)
	const rubberBandWidth = useTransform(rubberStretchPx, s => `calc(100% + ${Math.abs(s)}px)`)
	const rubberBandX = useTransform(rubberStretchPx, s => (s < 0 ? s : 0))

	// Animation ref
	const animRef = useRef<ReturnType<typeof animate> | null>(null)

	// Interaction state
	const [isHovered, setIsHovered] = useState(false)
	const [isPressed, setIsPressed] = useState(false)

	// Pointer tracking for rubber band
	const pointerDownPos = useRef<{ x: number; y: number } | null>(null)
	const isClickRef = useRef(true)
	const isDraggingRef = useRef(false)

	// Refs
	const rootRef = useRef<HTMLDivElement>(null)
	const rootRectRef = useRef<DOMRect | null>(null)
	const thumbRef = useRef<HTMLDivElement>(null)
	const thumbIndicatorRef = useRef<HTMLDivElement>(null)
	const labelRef = useRef<HTMLSpanElement>(null)
	const valueRef = useRef<HTMLSpanElement>(null)
	const stepMarkersRef = useRef<Map<number, HTMLDivElement>>(new Map())

	// Overlap state
	const [overlappingSteps, setOverlappingSteps] = useState<Set<number>>(new Set())
	const [isThumbIndicatorOverlapping, setIsThumbIndicatorOverlapping] = useState(false)

	const checkOverlaps = useCallback(() => {
		if (thumbIndicatorRef.current && labelRef.current && valueRef.current) {
			const thumbIndicatorRect = thumbIndicatorRef.current.getBoundingClientRect()
			const labelRect = labelRef.current.getBoundingClientRect()
			const valueRect = valueRef.current.getBoundingClientRect()

			setIsThumbIndicatorOverlapping(
				doElementsOverlap(thumbIndicatorRect, labelRect) ||
					doElementsOverlap(thumbIndicatorRect, valueRect)
			)
		}

		if (thumbRef.current) {
			const thumbRect = thumbRef.current.getBoundingClientRect()
			const newOverlappingSteps = new Set<number>()

			stepMarkersRef.current.forEach((element, stepValue) => {
				const stepRect = element.getBoundingClientRect()
				if (doElementsOverlap(stepRect, thumbRect)) {
					newOverlappingSteps.add(stepValue)
				}
			})

			setOverlappingSteps(newOverlappingSteps)
		}
	}, [])

	// Sync fill from props when not interacting
	useEffect(() => {
		if (!isDraggingRef.current && !animRef.current) {
			fillPercent.jump(percentage)
		}
	}, [percentage, fillPercent])

	useEffect(() => {
		if (!rootRef.current) return

		const resizeObserver = new ResizeObserver(() => {
			requestAnimationFrame(checkOverlaps)
		})

		resizeObserver.observe(rootRef.current)

		return () => {
			resizeObserver.disconnect()
		}
	}, [checkOverlaps])

	// biome-ignore lint/correctness/useExhaustiveDependencies: displayIndex triggers re-check when thumb moves
	useEffect(() => {
		requestAnimationFrame(checkOverlaps)
	}, [displayIndex, checkOverlaps])

	// Pointer tracking for click/drag detection and rubber band
	const handlePointerDownCapture = useCallback(
		(e: React.PointerEvent) => {
			pointerDownPos.current = { x: e.clientX, y: e.clientY }
			isClickRef.current = true
			isDraggingRef.current = false
			setIsPressed(true)
			if (rootRef.current) {
				rootRectRef.current = rootRef.current.getBoundingClientRect()
			}

			const onMove = (ev: PointerEvent) => {
				if (!pointerDownPos.current) return
				const dx = ev.clientX - pointerDownPos.current.x
				const dy = ev.clientY - pointerDownPos.current.y
				if (isClickRef.current && Math.sqrt(dx * dx + dy * dy) > CLICK_THRESHOLD) {
					isClickRef.current = false
					isDraggingRef.current = true
				}

				if (isDraggingRef.current) {
					const rect = rootRectRef.current
					if (rect) {
						if (ev.clientX < rect.left) {
							rubberStretchPx.jump(computeRubberStretch(ev.clientX, rect, -1))
						} else if (ev.clientX > rect.right) {
							rubberStretchPx.jump(computeRubberStretch(ev.clientX, rect, 1))
						} else {
							rubberStretchPx.jump(0)
						}
					}
				}
			}

			const onUp = () => {
				if (rubberStretchPx.get() !== 0) {
					animate(rubberStretchPx, 0, {
						type: "spring",
						visualDuration: 0.35,
						bounce: 0.15,
					})
				}
				pointerDownPos.current = null
				isDraggingRef.current = false
				setIsPressed(false)
				window.removeEventListener("pointermove", onMove)
				window.removeEventListener("pointerup", onUp)
			}

			window.addEventListener("pointermove", onMove)
			window.addEventListener("pointerup", onUp)
		},
		[rubberStretchPx]
	)

	// Cleanup window listeners on unmount
	useEffect(() => {
		return () => {
			animRef.current?.stop()
		}
	}, [])

	// Value change handler — spring on click/keyboard, jump on drag
	const handleValueChange = useCallback(
		(idx: number, details: SliderPrimitive.Root.ChangeEventDetails) => {
			setInternalIndex(idx)
			const option = options[idx]
			if (option !== undefined) {
				onValueChange(option)
			}

			const newPct = (idx / max) * 100

			if (details.reason === "drag") {
				if (animRef.current) {
					animRef.current.stop()
					animRef.current = null
				}
				fillPercent.jump(newPct)
			} else {
				if (animRef.current) animRef.current.stop()
				animRef.current = animate(fillPercent, newPct, {
					type: "spring",
					stiffness: 300,
					damping: 25,
					mass: 0.8,
					onComplete: () => {
						animRef.current = null
					},
				})
			}
		},
		[max, fillPercent, onValueChange, options]
	)

	const textContent = (
		<>
			<div className="flex h-full items-center justify-center pl-2">
				<span ref={labelRef}>{label}</span>
			</div>
			<div className="flex h-full items-center justify-center pr-2">
				<span ref={valueRef} className="font-mono tabular-nums tracking-tight">
					{displayLabel}
				</span>
			</div>
		</>
	)

	return (
		<motion.div
			style={{ width: rubberBandWidth, x: rubberBandX }}
			className={cn("relative", className)}
		>
			<SliderPrimitive.Root
				ref={rootRef}
				value={displayIndex}
				onValueChange={handleValueChange}
				min={min}
				max={max}
				step={step}
				disabled={disabled}
				thumbAlignment="center"
				className="relative"
				onPointerDownCapture={handlePointerDownCapture}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<SliderPrimitive.Control className="flex w-full touch-none select-none">
					<SliderPrimitive.Track className={sliderTrackVariants({ size })}>
						<SliderPrimitive.Indicator
							render={
								<motion.div
									className="relative select-none  bg-base-a5 sc-concentric"
									style={{ width: fillWidth }}
								>
									<motion.div
										ref={thumbIndicatorRef}
										className="absolute top-1/2 h-1/3 w-0.5 right-1.5 -translate-y-1/2 rounded-full bg-base-3"
										animate={{
											opacity: isThumbIndicatorOverlapping ? 0.3 : isHovered || isPressed ? 1 : 0,
											scaleY: isPressed ? 1.5 : 1,
										}}
										transition={{
											opacity: { duration: 0.15 },
											scaleY: { type: "spring", visualDuration: 0.25, bounce: 0.15 },
										}}
									/>
								</motion.div>
							}
						/>
						<SliderPrimitive.Thumb ref={thumbRef} className="h-full w-4 select-none rounded-lg" />
					</SliderPrimitive.Track>
				</SliderPrimitive.Control>

				{/* Step markers */}
				<div className="pointer-events-none absolute inset-0">
					<div className="relative h-full w-full">
						{steps.map((stepValue, index) => {
							if (index === 0 || index === steps.length - 1) return null
							const position = (stepValue / max) * 100
							const isOverlapping = overlappingSteps.has(stepValue)
							return (
								<div
									key={stepValue}
									ref={el => {
										if (el) stepMarkersRef.current.set(stepValue, el)
										else stepMarkersRef.current.delete(stepValue)
									}}
									className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 aspect-square h-[5px] rounded-full bg-base-a4"
									style={{
										left: `${position}%`,
										opacity: isOverlapping ? 0 : 1,
										transition: "opacity 150ms ease-in-out",
									}}
								/>
							)
						})}
					</div>
				</div>

				{/* Label and value overlay */}
				<motion.div
					className="pointer-events-none absolute inset-0 flex h-full w-full items-center justify-between text-sm text-base-11"
					style={{ clipPath: clipPathOutside }}
				>
					{textContent}
				</motion.div>
				<motion.div
					className="pointer-events-none absolute inset-0 flex h-full w-full items-center justify-between text-sm text-base-11"
					style={{ clipPath: clipPathInside }}
				>
					{textContent}
				</motion.div>
			</SliderPrimitive.Root>
		</motion.div>
	)
}

export { Slider }
