'use server';

import { analyzeMessageSentiment } from "@/ai/flows/analyze-message-sentiment";
import { summarizeConversation } from "@/ai/flows/summarize-conversation";
import type { Sentiment } from "./types";

export async function getSentiment(message: string): Promise<Sentiment> {
  try {
    const result = await analyzeMessageSentiment({ message });
    return result;
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return null;
  }
}

export async function getSummary(conversationHistory: string): Promise<{ summary: string }> {
  if (!conversationHistory.trim()) {
    return { summary: "The conversation is just getting started. Nothing to summarize yet!" };
  }
  try {
    const result = await summarizeConversation({ conversationHistory });
    return result;
  } catch (error) {
    console.error("Error summarizing conversation:", error);
    throw new Error("Failed to summarize conversation.");
  }
}
