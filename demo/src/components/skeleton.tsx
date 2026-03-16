import { cn } from "@/lib/utils"

function Skeleton({
	className,
	executeOnce = false,
	...props
}: React.ComponentProps<"div"> & { executeOnce?: boolean }) {
	return (
		<div
			className={cn(
				"[--skeleton-duration:0.8s]",
				"[--highlight-color:--alpha(var(--color-white)/64%)] [--base-1-color:var(--color-base-3)]",
				"rounded-xl bg-[linear-gradient(120deg,transparent_40%,var(--highlight-color),transparent_60%)]",
				"bg-(--base-1-color) bg-position-[0_0] bg-size-[200%_100%] bg-fixed",
				executeOnce
					? "animate-[skeleton_var(--skeleton-duration)_linear_1]"
					: "animate-[skeleton_var(--skeleton-duration)_linear_infinite]",
				className
			)}
			data-slot="skeleton"
			{...props}
		/>
	)
}

export { Skeleton }
