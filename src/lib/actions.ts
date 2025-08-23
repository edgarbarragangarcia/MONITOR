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
    return "The webhook is not configured. Please set the WEBHOOK_URL environment variable.";
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
      return `Error from webhook: ${response.status} ${response.statusText}`;
    }
    
    const responseText = await response.text();
    console.log('Raw webhook response text:', responseText);

    if (!responseText) {
        console.log('Webhook returned an empty response body.');
        return null;
    }
    
    try {
      const responseData = JSON.parse(responseText);
      
      // The user webhook returns an array: [{ "output": "..." }]
      if (Array.isArray(responseData) && responseData.length > 0 && typeof responseData[0] === 'object' && responseData[0] !== null && 'output' in responseData[0]) {
        console.log('Successfully extracted output from webhook JSON array response.');
        return responseData[0].output;
      }

      // The user webhook might also return a single object: { "output": "..." }
      if (typeof responseData === 'object' && responseData !== null && 'output' in responseData) {
        console.log('Successfully extracted output from webhook JSON object response.');
        return responseData.output;
      }
      
      console.warn('Webhook response was valid JSON but not in the expected format. Using raw text.', responseData);
      return responseText;

    } catch (e) {
      console.log('Failed to parse webhook JSON response, using raw text instead. Error:', e);
      return responseText;
    }

  } catch (error) {
    console.error('Error in sendToWebhook function:', error);
    if (error instanceof Error) {
        return `Failed to send to webhook: ${error.message}`;
    }
    return "An unknown error occurred while contacting the webhook.";
  }
}
