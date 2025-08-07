
import { createClient } from "@/utils/supabase/supabase";

export default async function Trades() {
  const supabase = await createClient();

  const { data: trades, error: tradesError } = await supabase.from("trades").select("*");
  const { data: bids, error: bidsError } = await supabase.from("bids").select("*");

  if (tradesError || bidsError) {
    console.error("Supabase error:", tradesError?.message || bidsError?.message);
  }

  console.log("Trades:", trades);
  console.log("Bids:", bids);

  return (
    <div className="min-h-screen p-8 sm:p-20 grid grid-rows-[20px_1fr_20px] justify-items-center gap-16 font-sans bg-zinc-950 text-zinc-200">
      <main className="row-start-2 flex flex-col gap-8 items-center sm:items-start w-full">
        <h1 className="text-2xl font-bold text-indigo-400">BarterHub</h1>

        {(tradesError || bidsError) ? (
          <p className="text-red-500">
            Something went wrong: {tradesError?.message || bidsError?.message}
          </p>
        ) : trades?.length === 0 ? (
          <p className="text-gray-500">No trades available yet.</p>
        ) : (
          <ul className="w-full max-w-2xl space-y-6">
            {trades?.map((trade) => {
              const matchingBid = bids?.find((bid) => bid.id === trade.id);
              console.log("Trade ID:", trade.id, "Matching Bid:", matchingBid);

              return (
                <li
                  key={trade.id}
                  className="bg-zinc-100 dark:bg-zinc-800 rounded p-6 shadow w-full"
                >
                  <p><strong>ID:</strong> {trade.id}</p>
                  <p><strong>Offer:</strong> {trade.item_name}</p>
                  <p><strong>Wants:</strong> {trade.item_need_name}</p>

                  <div className="mt-4">
                    <strong>Bids:</strong>
                    {matchingBid ? (
                      <ul className="mt-2 space-y-2">
                        <li key={matchingBid.id} className="bg-zinc-900 p-3 rounded">
                          <p><strong>Bid Name:</strong> {matchingBid.bidding_item}</p>
                          <p>
                            <strong>Bid Status:</strong>{" "}
                            {matchingBid.bid_accepted ? "Accepted ✅" : "Pending ⏳"}
                          </p>
                        </li>
                      </ul>
                    ) : (
                      <p className="text-zinc-400 mt-2">No bids found for this trade.</p>
                    )}
                  </div>

                  <p className="mt-4">
                    <strong>Trade Status:</strong>{" "}
                    {trade.trade_accepted ? "Accepted ✅" : "Pending ⏳"}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}