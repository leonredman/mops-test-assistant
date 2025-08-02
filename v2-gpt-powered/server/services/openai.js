// GPT function that does the actual parsing

import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Sends pasted Word doc text to GPT and returns structured JSON fixture
 * @param {string} text - Raw pasted Word doc content
 * @returns {Promise<Object>} - Parsed JSON fixture
 */
export async function parseWithGPT(text) {
  const prompt = `
You are a QA assistant. Given the following content from a marketing copy doc, extract the following fields in JSON format:
- headline
- eyebrow
- description
- ctaText
- ctaUrl
- imageUrl (if mentioned)

Only return a JSON object. Here's the content:
"""
${text}
"""`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that outputs clean JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const raw = response.choices[0].message.content;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse GPT response as JSON:", raw);
    throw new Error("Invalid JSON format returned from GPT.");
  }
}
