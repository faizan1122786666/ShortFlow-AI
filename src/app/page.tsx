"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  Zap,
  Upload,
  Calendar,
  Sparkles,
  ArrowRight,
  Youtube,
  Music2,
  Loader2,
} from "lucide-react";

export default function LandingPage() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    checkAuth();
  }, [supabase]);

  const handleNavigate = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/register");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">ShortFlow AI</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button asChild>
                <Link href="/dashboard">Get Started</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
              Schedule Short-Form Videos{" "}
              <span className="text-primary">with AI</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Upload once, publish everywhere. ShortFlow AI automates your
              YouTube Shorts and TikTok publishing with AI-generated titles,
              descriptions, and hashtags.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {user ? (
                <Button size="lg" onClick={handleNavigate}>
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link href="/register">
                      Start Free <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/30 py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Everything you need to grow
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Upload,
                  title: "Upload Once",
                  desc: "Upload vertical videos and store securely in the cloud.",
                },
                {
                  icon: Sparkles,
                  title: "AI Metadata",
                  desc: "Generate titles, descriptions, and hashtags with Gemini AI.",
                },
                {
                  icon: Calendar,
                  title: "Smart Scheduling",
                  desc: "Pick date and time — we handle the rest automatically.",
                },
                {
                  icon: Zap,
                  title: "Auto Publish",
                  desc: "n8n workflows publish to YouTube Shorts and TikTok.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-xl border bg-card p-6 text-center"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-8 text-3xl font-bold">Supported Platforms</h2>
            <div className="flex justify-center gap-8">
              <div className="flex items-center gap-3 rounded-xl border px-8 py-4">
                <Youtube className="h-8 w-8 text-red-500" />
                <span className="text-lg font-medium">YouTube Shorts</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border px-8 py-4">
                <Music2 className="h-8 w-8" />
                <span className="text-lg font-medium">TikTok</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> ShortFlow AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
