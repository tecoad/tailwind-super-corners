import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils"

const toggleVariants = cva(
	"hover:text-base-12 aria-pressed:bg-base-3 focus-visible:border-base-a8 focus-visible:ring-base-a5 aria-invalid:ring-danger-a4 data-[state=on]:bg-base-3 gap-1 rounded-lg text-sm font-medium transition-all [&_svg:not([class*='size-'])]:size-4 group/toggle hover:bg-base-3 inline-flex items-center justify-center whitespace-nowrap outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-transparent",
				outline: "border-base-a7 hover:bg-base-3 border bg-transparent",
				tabs: "bg-transparent hover:bg-transparent border border-transparent rounded-md text-base-11 hover:text-base-12 aria-pressed:bg-base-1 aria-pressed:text-base-12 aria-pressed:shadow-sm data-[state=on]:bg-base-1 data-[state=on]:text-base-12 data-[state=on]:shadow-sm dark:aria-pressed:border-base-a7 dark:aria-pressed:bg-base-a3 dark:data-[state=on]:border-base-a7 dark:data-[state=on]:bg-base-a3",
			},
			size: {
				default: "h-8 min-w-8 px-2",
				sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-1.5 text-[0.8rem]",
				lg: "h-9 min-w-9 px-2.5",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
)

function Toggle({
	className,
	variant = "default",
	size = "default",
	...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
	return (
		<TogglePrimitive
			data-slot="toggle"
			className={cn(toggleVariants({ variant, size, className }))}
			{...props}
		/>
	)
}

export { Toggle, toggleVariants }
