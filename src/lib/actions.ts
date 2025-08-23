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
      console.error('Webhook response was not OK. Status:', response.status, 'Body:', responseBody);
      throw new Error(`Webhook failed with status: ${response.status}`);
    }
    
    const responseText = await response.text();
    console.log('Raw webhook response text:', responseText);

    if (!responseText) {
        console.log('Webhook returned an empty response body.');
        return null;
    }
    
    try {
      const responseData = JSON.parse(responseText);
      console.log('Parsed webhook response data:', responseData);

      if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].output) {
        console.log('Successfully extracted output from webhook response.');
        return responseData[0].output;
      } else {
        console.warn('Webhook response format was not as expected. Data:', responseData);
      }
    } catch (e) {
      console.error('Failed to parse webhook JSON response. Error:', e, 'Raw Response:', responseText);
      // If parsing fails, but we got text, maybe the text itself is the response.
      // Let's return it directly.
      return responseText;
    }

    return null;

  } catch (error) {
    console.error('Error in sendToWebhook function:', error);
    // We don't rethrow the error to not fail the client-side operation, 
    // but we return null so the app doesn't hang.
    return null;
  }
}
