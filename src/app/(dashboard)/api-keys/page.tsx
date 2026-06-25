"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApiKeys, ApiKeyProviders } from "@/hooks/use-api-keys";
import { toast } from "sonner";
import { Key, Save, Eye, EyeOff, ExternalLink } from "lucide-react";

const PROVIDER_LINKS: Record<ApiKeyProviders, string> = {
  gemini: "https://aistudio.google.com/app/apikey",
  openai: "https://platform.openai.com/api-keys",
  anthropic: "https://console.anthropic.com/settings/keys",
  groq: "https://console.groq.com/keys",
  openrouter: "https://openrouter.ai/keys",
};

export default function ApiKeysPage() {
  const { keys, saveKeys, isLoaded } = useApiKeys();
  const [localKeys, setLocalKeys] = useState(keys);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  // Sync state once loaded
  useEffect(() => {
    if (isLoaded) {
      setLocalKeys(keys);
    }
  }, [keys, isLoaded]);

  const handleChange = (provider: ApiKeyProviders, value: string) => {
    setLocalKeys((prev) => ({ ...prev, [provider]: value }));
  };

  const toggleShow = (provider: string) => {
    setShowKey((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveKeys(localKeys);
    toast.success("API Keys saved successfully to your browser");
  };

  if (!isLoaded) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Key className="h-8 w-8 text-primary" />
          API Keys
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your AI provider keys. These are securely stored in your local browser and never sent to our database.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>AI Providers</CardTitle>
            <CardDescription>Enter the keys for the services you want to use.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {(Object.keys(localKeys) as ApiKeyProviders[]).map((provider) => (
              <div key={provider} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={provider} className="capitalize flex items-center gap-2">
                    {provider} API Key
                  </Label>
                  <a
                    href={PROVIDER_LINKS[provider]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    Get {provider} key <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id={provider}
                    type={showKey[provider] ? "text" : "password"}
                    value={localKeys[provider]}
                    onChange={(e) => handleChange(provider, e.target.value)}
                    placeholder={`sk-...`}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow(provider)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKey[provider] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Save Keys
          </Button>
        </div>
      </form>
    </div>
  );
}
