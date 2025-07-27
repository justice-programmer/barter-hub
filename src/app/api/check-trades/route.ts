import { createClient } from "@/utils/supabase/supabase";
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("trades").select("*");
  return Response.json({ data, error });
}

