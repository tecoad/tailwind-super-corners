import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import type { RefObject } from "react"

import { cn } from "@/utils"

function ScrollArea({
	className,
	children,
	scrollFade = false,
	scrollbarGutter = false,
	hideScrollbar = false,
	viewportClassName,
	viewportRef,
	focusable = true,
	scrollbarClassName,
	...props
}: ScrollAreaPrimitive.Root.Props & {
	scrollFade?: boolean
	scrollbarGutter?: boolean
	hideScrollbar?: boolean
	viewportClassName?: string
	viewportRef?: RefObject<HTMLDivElement | null>
	focusable?: boolean
	scrollbarClassName?: string
}) {
	return (
		<ScrollAreaPrimitive.Root className={cn("size-full min-h-0", className)} {...props}>
			<ScrollAreaPrimitive.Viewport
				ref={viewportRef}
				tabIndex={focusable ? 0 : -1}
				className={cn(
					"h-full rounded-[inherit] outline-none transition-[outline-width]  data-has-overflow-x:overscroll-x-contain",
					scrollFade &&
						"mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))] mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))] [--fade-size:1.5rem]",
					scrollbarGutter && "data-has-overflow-y:pe-2.5 data-has-overflow-x:pb-2.5",
					hideScrollbar && "no-scrollbar",
					focusable && "focus-visible:outline-2  focus-visible:outline-offset-1",
					viewportClassName
				)}
				data-slot="scroll-area-viewport"
			>
				{children}
			</ScrollAreaPrimitive.Viewport>
			{!hideScrollbar && (
				<>
					<ScrollBar orientation="vertical" className={scrollbarClassName} />
					<ScrollBar orientation="horizontal" className={scrollbarClassName} />
					<ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
				</>
			)}
		</ScrollAreaPrimitive.Root>
	)
}

function ScrollBar({
	className,
	orientation = "vertical",
	thumbClassName,
	...props
}: ScrollAreaPrimitive.Scrollbar.Props & { thumbClassName?: string }) {
	return (
		<ScrollAreaPrimitive.Scrollbar
			className={cn(
				"bg-base-3 rounded-full flex opacity-0 transition-opacity delay-300 data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:flex-col data-hovering:opacity-100 data-scrolling:opacity-100 data-hovering:delay-0 data-scrolling:delay-0 data-hovering:duration-100 data-scrolling:duration-100",
				className
			)}
			data-slot="scroll-area-scrollbar"
			orientation={orientation}
			{...props}
		>
			<ScrollAreaPrimitive.Thumb
				className={cn("relative flex-1 rounded-full bg-base-a4", thumbClassName)}
				data-slot="scroll-area-thumb"
			/>
		</ScrollAreaPrimitive.Scrollbar>
	)
}

export { ScrollArea, ScrollBar }
