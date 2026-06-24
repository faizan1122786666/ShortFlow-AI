import { NextResponse } from "next/server";
import { testN8NConnection } from "@/services/n8n";

export async function POST() {
  try {
    const result = await testN8NConnection();
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Test failed" },
      { status: 500 }
    );
  }
}
