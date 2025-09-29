import { api } from "@/lib/polar";
import { getSession } from "@neoai/trans-supabase/session";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const {
    data: { session },
  } = await getSession();

  if (!session?.user?.id) {
    throw new Error("You must be logged in");
  }

  const customerId = req.nextUrl.searchParams.get("id");

  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  const result = await api.customerSessions.create({
    customerId,
  });

  return NextResponse.redirect(result.customerPortalUrl);
}
