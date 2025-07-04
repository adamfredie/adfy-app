// src/api/gemini.ts
import axios from 'axios';

// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Store your key in .env

export async function analyzeStoryWithGemini({ story, topic, vocabulary }: {
  story: string;
  topic: string;
  vocabulary: string[];
}) {
  const prompt = `
You are an expert language tutor. Analyze the following story according to these rules:
[...PASTE YOUR RULES HERE, or reference them concisely...]
Story: """${story}"""
Topic: "${topic}"
Target Vocabulary: ${vocabulary.map(w => `"${w}"`).join(', ')}

Return your response in this JSON format:
{
  "creativity": <number, 0-100>,
  "grammar": <number, 0-100>,
  "coherence": <number, 0-100>,
  "topicAdherence": <number, 0-100>,
  "feedback": "<overall impression and feedback>",
  "suggestions": ["<suggestion 1>", "<suggestion 2>", ...]
}
`;

  const response = await axios.post(
    `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );
  // Parse Gemini's response to extract the JSON object
  const text = response.data.candidates[0].content.parts[0].text;
  // Try to extract JSON from the response
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    return JSON.parse(match[0]);
  }
  throw new Error('Failed to parse Gemini response');
}

export async function generateVoiceResponse({ 
  userMessage, 
  conversationHistory, 
  vocabulary, 
  topic 
}: {
  userMessage: string;
  conversationHistory: Array<{ type: 'user' | 'ai', content: string }>;
  vocabulary: string[];
  topic?: string;
}) {
  const prompt = `
You are an AI language tutor having a conversation with a student. 
The student is practicing using vocabulary words in a professional context.

${topic ? `Context: The conversation is about "${topic}"` : ''}
Target Vocabulary: ${vocabulary.map(w => `"${w}"`).join(', ')}

Previous conversation:
${conversationHistory.map(msg => `${msg.type === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n')}

Student's latest message: "${userMessage}"

Respond naturally as a tutor, encouraging the student to use the vocabulary words. 
Keep responses conversational and under 2 sentences. Don't mention the vocabulary words explicitly unless the student asks.
`;

  const response = await axios.post(
    `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );
  
  return response.data.candidates[0].content.parts[0].text;
}