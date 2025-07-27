import { createClient } from "@/utils/supabase/supabase";

export default async function Trades() {
  const supabase = await createClient();

  const { data: trades, error } = await supabase.from("trades").select("*");

  if (error) {
    console.error("Supabase error:", error.message);
  }

  return (
    <div className="min-h-screen p-8 sm:p-20 grid grid-rows-[20px_1fr_20px] justify-items-center gap-16 font-sans">
      <main className="row-start-2 flex flex-col gap-8 items-center sm:items-start">
        <h1 className="text-2xl font-bold">BarterHub</h1>

        {error ? (
          <p className="text-red-500">Something went wrong: {error.message}</p>
        ) : trades?.length === 0 ? (
          <p className="text-gray-500">No trades available yet.</p>
        ) : (
          <ul className="w-full max-w-xl space-y-4">
            {trades?.map((trade) => (
              <li
                key={trade.id}
                className="bg-zinc-100 dark:bg-zinc-800 rounded p-4 shadow w-3xl"
              >
                <p><strong>Offer:</strong> {trade.item_name}</p>
                <p><strong>Wants:</strong> {trade.item_need_name}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  {trade.trade_accepted ? "Accepted ✅" : "Pending ⏳"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}