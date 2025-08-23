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

export async function sendToWebhook(message: Omit<Message, 'isAnalyzing' | 'sentiment' | 'author'>): Promise<string | null> {
  const webhookUrl = process.env.WEBHOOK_URL;

  if (!webhookUrl) {
    console.log('Skipping webhook call. Set a valid WEBHOOK_URL in your .env file.');
    return null;
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
      const responseBody = await response.text();
      console.error('Webhook response body for failed request:', responseBody);
      throw new Error(`Webhook failed with status: ${response.status}`);
    }
    
    const responseText = await response.text();

    if (!responseText) {
        console.log('Webhook returned an empty response.');
        return null;
    }

    console.log('Message successfully sent to webhook and received response.');

    const responseData = JSON.parse(responseText);

    if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].output) {
      return responseData[0].output;
    }

    return null;

  } catch (error) {
    console.error('Error sending message to webhook or processing response:', error);
    // We don't rethrow the error to not fail the client-side operation, 
    // but we return null so the app doesn't hang.
    return null;
  }
}
