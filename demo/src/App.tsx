export default function App() {
	return (
		<div className="h-dvh w-dvw  bg-[#F0ECEB] flex flex-col pb-6">
			<div className="h-12 rounded-full absolute top-4 right-4 bg-black text-white flex items-center justify-center px-6">
				Github
			</div>
			<div className="bg-[#FBFBFB] px-4 flex-1 flex border-[#ABABAB] border-b">
				<div className="max-w-xl w-full border mx-auto flex-1 flex flex-col gap-8 pt-30">
					<h1 className="text-[90px] leading-[90px] font-medium tracking-tighter">
						Tailwind
						<br /> Super Corners
					</h1>
					<p className="text-zinc-400 text-lg">npm i tailwind-super-corners</p>

					<div className="-m-px -mb-[2px] pb-0 relative rounded-t-[30px] sc-out-[30px] h-full border-b-0 bg-[#F0ECEB] border border-[#ABABAB]  p-5 flex">
						<div className="sc-concentric-4xl  bg-white p-4 flex-1">
							<p className="text-sm text-zinc-300">Concentric</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
