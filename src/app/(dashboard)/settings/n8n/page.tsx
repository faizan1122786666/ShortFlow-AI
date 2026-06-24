"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function N8nSettingsPage() {
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<"idle" | "connected" | "error">("idle");
  const [lastResponse, setLastResponse] = useState<string>("");

  async function handleTestConnection() {
    setTesting(true);
    setLastResponse("");
    try {
      const res = await fetch("/api/n8n/test", { method: "POST" });
      const data = await res.json();
      
      setLastResponse(JSON.stringify(data, null, 2));
      
      if (res.ok && data.success) {
        setStatus("connected");
        toast.success("Connected to n8n successfully!");
      } else {
        setStatus("error");
        toast.error(data.message || "Failed to connect to n8n");
      }
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Unknown error";
      setLastResponse(`Error: ${msg}`);
      toast.error("Network error while connecting");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">n8n Integration</h1>
        <p className="text-muted-foreground">Manage your local n8n docker integration.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Connection Settings</CardTitle>
          <CardDescription>Configure and test your local n8n instance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Webhook URL (From .env)</Label>
            <Input 
              readOnly 
              value={process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "http://localhost:5678/webhook/shortflow"} 
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">This is configured via N8N_WEBHOOK_URL in your environment.</p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <div className="text-sm font-medium">Status:</div>
            {status === "idle" && <span className="text-sm text-muted-foreground">Not tested</span>}
            {status === "connected" && (
              <span className="flex items-center text-sm text-green-500">
                <CheckCircle2 className="mr-1 h-4 w-4" /> Connected
              </span>
            )}
            {status === "error" && (
              <span className="flex items-center text-sm text-red-500">
                <XCircle className="mr-1 h-4 w-4" /> Error
              </span>
            )}
          </div>

          {lastResponse && (
            <div className="space-y-2 pt-2">
              <Label>Last Response</Label>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs font-mono">
                {lastResponse}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleTestConnection} disabled={testing}>
            {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Connection
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
