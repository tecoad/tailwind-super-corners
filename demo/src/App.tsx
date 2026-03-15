export default function App() {
	return (
		<div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
			<div className="flex flex-col items-center gap-8">
				<h1 className="text-4xl font-bold tracking-tight">
					Tailwind Super Corners
				</h1>
				<p className="text-zinc-400 text-lg">
					Plugin is working if the boxes below have styled corners.
				</p>

				<div className="rounded-3xl sc-squircle size-40 bg-zinc-800 p-1 flex">
					<div className="sc-concentric-4xl sc-squircle bg-zinc-700 p-4 flex-1">
						<p className="text-sm text-zinc-300">Concentric</p>
					</div>
				</div>
			</div>
		</div>
	);
}
