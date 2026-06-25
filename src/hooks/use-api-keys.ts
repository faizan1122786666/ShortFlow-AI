"use client";

import { useState, useEffect } from "react";

export type ApiKeyProviders = "gemini" | "openai" | "anthropic" | "groq" | "openrouter";

export type ApiKeys = Record<ApiKeyProviders, string>;

const DEFAULT_KEYS: ApiKeys = {
  gemini: "",
  openai: "",
  anthropic: "",
  groq: "",
  openrouter: "",
};

export function useApiKeys() {
  const [keys, setKeys] = useState<ApiKeys>(DEFAULT_KEYS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("shortflow_api_keys");
      if (stored) {
        setKeys({ ...DEFAULT_KEYS, ...JSON.parse(stored) });
      }
    } catch (e) {
      console.error("Failed to load API keys", e);
    }
    setIsLoaded(true);
  }, []);

  const saveKeys = (newKeys: ApiKeys) => {
    setKeys(newKeys);
    try {
      localStorage.setItem("shortflow_api_keys", JSON.stringify(newKeys));
    } catch (e) {
      console.error("Failed to save API keys", e);
    }
  };

  return { keys, saveKeys, isLoaded };
}
