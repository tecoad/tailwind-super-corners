export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Tailwind Super Cornerss
        </h1>
        <p className="text-zinc-400 text-lg">
          Plugin is working if the boxes below have styled corners.
        </p>

        <div className="grid grid-cols-3 gap-6">
          <div className="sc-concentric rounded-2xl bg-zinc-800 p-6">
            <div className="sc-concentric rounded-2xl bg-zinc-700 p-4">
              <p className="text-sm text-zinc-300">Concentric</p>
            </div>
          </div>

          <div className="relative bg-zinc-800 rounded-2xl p-6">
            <p className="text-sm text-zinc-300">Outer Corners</p>
          </div>

          <div className="sc-squircle rounded-2xl bg-zinc-800 p-6">
            <p className="text-sm text-zinc-300">Squircle</p>
          </div>
        </div>
      </div>
    </div>
  );
}
