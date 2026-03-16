import { FitHeadline } from "./components/fit-headline"
import { ScrollArea } from "./components/scroll-area"

export default function App() {
	return (
		<div className="h-dvh w-dvw  bg-[#F0ECEB] flex flex-col pb-6">
			<div className="absolute top-4 right-4 flex gap-2">
				<div className="h-12 rounded-full bg-white text-black border border-[#ABABAB] flex items-center justify-center px-6">
					Docs
				</div>
				<div className="h-12 rounded-full bg-black text-white flex items-center justify-center px-6">
					Github
				</div>
			</div>
			<div className="bg-[#FBFBFB] px-4 flex-1 min-h-0 flex border-[#ABABAB] border-b">
				<div className="max-w-xl w-full border mx-auto flex-1 min-h-0 flex flex-col gap-8 pt-30">
					<FitHeadline
						lines={["Tailwind", "Super Corners"]}
						headlineClassName="font-medium tracking-tighter leading-[1]"
					/>
					<p className="text-zinc-400 text-lg">npm i tailwind-super-corners</p>

					<div className="-m-px -mb-[2px] pb-0 relative rounded-t-[30px] sc-out-[30px] flex-1 min-h-0 border-b-0 bg-[#F0ECEB] border border-[#ABABAB]  p-5 flex">
						<div className="sc-concentric-4xl  bg-white p-4 flex-1 min-h-0 flex flex-col">
							<ScrollArea
								scrollFade
								className="flex-1 min-h-0"
								viewportClassName="snap-y snap-mandatory"
							>
								<div className="h-[200px] bg-red-500 snap-start">section 1</div>
								<div className="h-[200px] bg-blue-500 snap-start">section 2</div>
								<div className="h-[200px] bg-green-500 snap-start">section 3</div>
								<div className="h-[200px] bg-yellow-500 snap-start">section 4</div>
								<div className="h-[200px] bg-purple-500 snap-start">section 5</div>
								<div className="h-[200px] bg-orange-500 snap-start">section 6</div>
								<div className="h-[200px] bg-pink-500 snap-start">section 7</div>
								<div className="h-[200px] bg-gray-500 snap-start">section 8</div>
							</ScrollArea>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
