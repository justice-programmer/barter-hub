'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type SupabaseUser = {
  id: string;
  email: string;
};

export default function Home() {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/get-user-info');
        const result = await res.json();
        const actualUser = result.user?.user;

        if (actualUser) {
          setUser(actualUser);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col justify-center items-center px-6 sm:px-20 py-12 font-sans">
      {/* Navigation */}
      <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-200 font-sans">
      <nav className="sticky top-0 z-50 bg-zinc-950 border-b border-indigo-600 px-6 py-4 flex items-center justify-center gap-6 font-mono transition-colors">
        {user ? (
          <>
            <Link
              href="/trades"
              className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-lg font-medium transition-all shadow"
            >
              Trades
            </Link>
            <Link
              href={`/userdash?uid=${user.id}`}
              className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-lg font-medium transition-all shadow"
            >
              Dashboard
            </Link>
            <Link
              href="/create"
              className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-lg font-medium transition-all shadow"
            >
              Offer Item
            </Link>
          </>
        ) : (
          <>
            <p className="text-zinc-400">Not Logged in?</p>
            <Link
              href="/login"
              className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-lg font-medium transition-all shadow"
            >
              Login
            </Link>
          </>
        )}
      </nav>
      </div>
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tight">
          Welcome to BarterHub
        </h1>
        <p className="mt-4 text-zinc-400 text-lg sm:text-xl max-w-xl mx-auto">
          Trade your creations. Make offers. Build your collection. All without hassle.
        </p>
      </header>

      {/* Main Actions */}
      {user && (
        <main className="flex flex-col sm:flex-row gap-8 mb-12">
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
      )}

      {/* Footer */}
      <footer className="mt-12 text-xs text-zinc-600">
        <Link
          href="https://github.com/justice-programmer/barter-hub"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded font-mono text-sm text-white shadow-md transition-all duration-300 ease-in-out
            bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
            bg-[length:200%_200%] animate-gradient-x
            hover:scale-105 hover:shadow-[0_0_12px_rgba(139,92,246,0.6)]"
        >
          {/* GitHub Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12 0C5.37 0 0 5.373 0 12a12 12 0 008.207 11.385c.6.111.793-.261.793-.58 0-.287-.01-1.047-.016-2.055-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.809 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.334-5.466-5.933 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.805 5.625-5.476 5.922.43.372.814 1.102.814 2.222 0 1.604-.015 2.896-.015 3.293 0 .322.19.697.8.578A12.005 12.005 0 0024 12c0-6.627-5.373-12-12-12z"
              clipRule="evenodd"
            />
          </svg>
          GITHUB
        </Link>
      </footer>
    </div>
  );
}