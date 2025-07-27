"use client"

import { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';


export default async function Create(){
    const [ item, setItem] = useState("")
    const [ itemwant, setItemWant ] = useState("")

    const handleCreateTrade = async () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    alert("🚫 You must be logged in to create a trade.");
    return;
  }

  const { error } = await supabase.from("trades").insert({
    item,
    itemwant,
    user_id: user.id, // Attach user's ID
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Insert error:", error);
    alert(`❌ Failed to create trade: ${error.message}`);
  } else {
    alert("✅ Trade created successfully!");
    setItem("");
    setItemWant("");
  }
};
    return (
         <div className="min-h-screen p-8 sm:p-20 grid grid-rows-[20px_1fr_20px] justify-items-center gap-16 font-sans">
      <main className="row-start-2 flex flex-col gap-8 items-center sm:items-start">
        
      <input
        type="text"
        placeholder="Text"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        className="mb-4 px-4 py-2 rounded bg-zinc-900 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-md"
      />

      <input
        type="text"
        placeholder="Text"
        value={itemwant}
        onChange={(e) => setItemWant(e.target.value)}
        className="mb-4 px-4 py-2 rounded bg-zinc-900 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-md"
      />

      <button
        onClick={handleCreateTrade}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-semibold transition w-full max-w-md"
      >
        Create Trade
      </button>
      </main>
      </div>
    )
}