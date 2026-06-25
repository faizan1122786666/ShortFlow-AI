import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GenerateMetadataResponse } from "@/types";

export async function generateTitle(context: string, apiKey: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(
    `Generate a catchy, SEO-friendly title for a short-form vertical video. Context: ${context}. Return only the title, no quotes.`
  );
  return result.response.text().trim();
}

export async function generateDescription(context: string, apiKey: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(
    `Generate an engaging description for a short-form vertical video. Context: ${context}. Keep it under 500 characters. Return only the description.`
  );
  return result.response.text().trim();
}

export async function generateHashtags(context: string, apiKey: string): Promise<string[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(
    `Generate 10 relevant hashtags for a short-form vertical video. Context: ${context}. Return only hashtags separated by spaces, each starting with #.`
  );
  const text = result.response.text().trim();
  return text.split(/\s+/).filter((tag) => tag.startsWith("#"));
}

export async function generateAllMetadata(
  context: string,
  apiKey: string
): Promise<GenerateMetadataResponse> {
  const [title, description, hashtags] = await Promise.all([
    generateTitle(context, apiKey),
    generateDescription(context, apiKey),
    generateHashtags(context, apiKey),
  ]);
  return { title, description, hashtags };
}

export async function generateMetadata(
  type: "title" | "description" | "hashtags" | "all",
  context: string,
  apiKey: string
): Promise<GenerateMetadataResponse> {
  switch (type) {
    case "title":
      return { title: await generateTitle(context, apiKey) };
    case "description":
      return { description: await generateDescription(context, apiKey) };
    case "hashtags":
      return { hashtags: await generateHashtags(context, apiKey) };
    case "all":
      return generateAllMetadata(context, apiKey);
    default:
      return {};
  }
}
