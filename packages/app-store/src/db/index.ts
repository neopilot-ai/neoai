import { createClient } from "@neoai/supabase/server";

export async function createApp(params: any) {
  const client = await createClient({ admin: true });

  const { data, error } = await client
    .from("apps")
    .upsert(params)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
