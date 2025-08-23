'use server';

import { analyzeMessageSentiment } from "@/ai/flows/analyze-message-sentiment";
import { summarizeConversation } from "@/ai/flows/summarize-conversation";
import type { Sentiment, Message } from "./types";

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

export async function sendToWebhook(message: Omit<Message, 'isAnalyzing' | 'sentiment'>) {
  const webhookUrl = process.env.WEBHOOK_URL;

  if (!webhookUrl || !webhookUrl.startsWith('https://webhook.site/')) {
    console.log('Skipping webhook call. Set a valid WEBHOOK_URL in your .env file.');
    console.log('You can get a test URL from https://webhook.site/');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status: ${response.status}`);
    }

    console.log('Message successfully sent to webhook.');
  } catch (error) {
    console.error('Error sending message to webhook:', error);
    // We don't rethrow the error to not fail the client-side operation
  }
}
