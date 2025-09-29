import { getSession } from "@neoai/supabase/cached-queries";
import { updateBankConnection } from "@neoai/supabase/mutations";
import { createClient } from "@neoai/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const {
    data: { session },
  } = await getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const supabase = await createClient();
  const requestUrl = new URL(req.url);
  const id = requestUrl.searchParams.get("id");
  const referenceId = requestUrl.searchParams.get("reference_id") ?? undefined;
  const isDesktop = requestUrl.searchParams.get("desktop");

  if (id) {
    await updateBankConnection(supabase, { id, referenceId });
  }

  if (isDesktop === "true") {
    return NextResponse.redirect(
      `neoai://settings/accounts?id=${id}&step=reconnect`,
    );
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/settings/accounts?id=${id}&step=reconnect`,
  );
}
