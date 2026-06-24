import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function mapAuthError(message: string): string {
  if (message.includes("already been registered") ||
    message.includes("already registered") ||
    message.includes("User already registered")) {
    return "This email is already registered. Try signing in instead.";
  }
  if (message.includes("Signups not allowed")) {
    return "Signups are disabled in Supabase. Enable Email under Authentication → Providers.";
  }
  if (message.includes("fetch failed") ||
    message.includes("ENOTFOUND") ||
    message.includes("ECONNREFUSED")) {
    return "Cannot reach Supabase. Verify NEXT_PUBLIC_SUPABASE_URL in .env.local and restart npm run dev.";
  }
  return message;
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Use the regular client so Supabase sends a confirmation email
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Redirect user to login page after clicking the confirmation link
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/login?confirmed=true`,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: mapAuthError(error.message) },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, email });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json(
      { error: mapAuthError(message) },
      { status: 500 }
    );
  }
}
