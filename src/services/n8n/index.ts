import type { Platform } from "@/types";

export interface N8nPublishPayload {
  videoId: string;
  userId: string;
  videoUrl: string;
  title: string;
  description: string;
  hashtags: string[];
  platforms: Platform[];
  scheduledAt?: string;
}

export interface N8nResponse {
  success: boolean;
  workflowId?: string;
  error?: string;
}

export async function triggerPublishWorkflow(
  payload: N8nPublishPayload
): Promise<N8nResponse> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("N8N_WEBHOOK_URL not configured, skipping n8n trigger");
    return { success: true, workflowId: "local-fallback" };
  }

  try {
    const { scheduledAt: _ignoredScheduledAt, ...immediatePayload } = payload;

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "publish",
        timestamp: new Date().toISOString(),
        ...immediatePayload,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `n8n webhook error: ${error}` };
    }

    const data = await response.json();
    return { success: true, workflowId: data.executionId ?? "triggered" };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "n8n trigger failed",
    };
  }
}

export async function triggerScheduledCheck(): Promise<N8nResponse> {
  const baseUrl = process.env.N8N_WEBHOOK_URL?.replace(
    "/webhook/video-publish",
    "/webhook/scheduled-check"
  );

  if (!baseUrl) {
    return { success: true, workflowId: "local-fallback" };
  }

  try {
    const response = await fetch(baseUrl, { method: "POST" });
    if (!response.ok) {
      return { success: false, error: "Scheduled check failed" };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Scheduled check failed",
    };
  }
}

export async function reportError(
  videoId: string,
  platform: Platform,
  error: string
): Promise<void> {
  const errorUrl = process.env.N8N_WEBHOOK_URL?.replace(
    "/webhook/video-publish",
    "/webhook/error-handler"
  );

  if (!errorUrl) return;

  await fetch(errorUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      videoId,
      platform,
      error,
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {
    // Best-effort error reporting
  });
}
export async function testN8NConnection(): Promise<{ success: boolean; message?: string }> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return { success: false, message: 'N8N_WEBHOOK_URL not configured' };
  }
  try {
    const response = await fetch(webhookUrl, { method: 'GET' });
    if (!response.ok) {
      return { success: false, message: 'N8N returned ' + response.status };
    }
    return { success: true, message: 'Connected successfully' };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Unknown error' };
  }
}
