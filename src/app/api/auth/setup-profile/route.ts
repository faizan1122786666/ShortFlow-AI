import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = {
      id: user.id,
      email: user.email ?? "",
    };

    const { error: userError } = await supabase
      .from("profiles")
      .upsert(profile, { onConflict: "id" });

    if (!userError) {
      return NextResponse.json({ success: true });
    }

    const admin = createAdminClient();
    const { error: adminError } = await admin
      .from("profiles")
      .upsert(profile, { onConflict: "id" });

    if (adminError) {
      return NextResponse.json({ error: adminError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Profile setup failed" },
      { status: 500 }
    );
  }
}
