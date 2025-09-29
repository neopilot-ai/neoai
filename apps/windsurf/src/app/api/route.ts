import { rules } from "@mcpdata/data/rules";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({ data: rules });
}
