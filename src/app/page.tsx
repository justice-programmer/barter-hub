// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col justify-center items-center px-6 sm:px-20 py-12 font-sans">
      <header className="text-center mb-12">
        <h1 className=" font-mono text-4xl sm:text-5xl font-extrabold tracking-tight">
          Welcome to BarterHub
        </h1>
        <p className="mt-4 text-zinc-400 text-lg sm:text-xl max-w-xl mx-auto">
          Trade your creations. Make offers. Build your collection. All without hassle.
        </p>
      </header>

      <main className="flex flex-col sm:flex-row gap-8">
        <Link
          href="/trades"
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded text-lg font-medium transition-all shadow"
        >
          View Trades
        </Link>
        <Link
          href="/create"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded text-lg font-medium transition-all shadow"
        >
          Offer an Item
        </Link>
      </main>

      <footer className="mt-20 text-xs text-zinc-600">
        Powered by Supabase & SuperCLI✨
      </footer>
    </div>
  );
}