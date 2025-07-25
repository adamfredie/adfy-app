// src/api/gemini.ts
import axios from 'axios';


// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_AUDIO_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
// const GEMINI_AUDIO_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Store your key in .env

// Debug: Check if API key is loaded
console.log('Gemini API Key loaded:', GEMINI_API_KEY ? 'Yes' : 'No');
if (!GEMINI_API_KEY) {
  console.error('VITE_GEMINI_API_KEY is not set in environment variables');
}
//ORIGINAL
export async function analyzeStoryWithGemini({ 
  story, 
  topic, 
  vocabulary 
}: {
  story: string;
  topic: string;
  vocabulary: string[];
}) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please check your .env file.');
  }

  const prompt = `
You are an AI/LLM analyzing user-written stories for a vocabulary learning activity. Follow these detailed rules to assess and provide feedback:

🧠 Focus Areas:
1. **Creativity**
2. **Grammar & Syntax**
3. **Coherence & Flow**
4. **Topic Match** (especially target vocabulary usage)

🎯 Objective:
Give constructive, encouraging feedback that helps the user improve their vocabulary application and story writing.

📋 Feedback Format (strictly follow this structure):
### Story Analysis: [Story Title/Snippet]

**Overall Impression:** [One-line general feedback]

---

**Scores:**
* Creativity: [%]
* Grammar: [%]
* Coherence: [%]
* Topic Match: [%] (e.g., [X] out of [Y] vocabulary words used)

---

#### 1. Creativity
* **Strengths:** [List 1-2 points]
* **Suggestions for Improvement:** [List 1-2 points]

#### 2. Grammar & Syntax
* **Strengths:** [e.g., sentence variety, good punctuation]
* **Areas for Review:**
  * [Highlight 1–3 specific issues with examples if possible]

#### 3. Coherence & Flow
* **Strengths:** [Logical flow, smooth transitions]
* **Suggestions for Improvement:** [Mention abrupt or confusing parts]

#### 4. Topic Match
* **Strengths:** [How vocabulary was used well]
* **Suggestions for Improvement:** [Better ways to integrate target words]

🏁 End with a brief encouraging sentence.

📊 Scoring Guide (per category):
- High: 85–100%
- Moderate: 70–84%
- Low: below 70%

🎯 Topic Match Scoring (based on vocabulary used effectively):
0/5 → ~0%, 1/5 → ~20%, 2/5 → ~40%, 3/5 → ~60%, 4/5 → ~80%, 5/5 → ~95–100%

Special Rule: If the user's story is gibberish, irrelevant, or nonsensical (e.g., random letters, words that do not form sentences, or content unrelated to the topic), assign a score of 0% for all categories and state in the feedback that the submission was not understandable.

Make sure to consider:
- Originality (for creativity)
- Tense consistency, subject-verb agreement, punctuation, sentence structure (for grammar)
- Logical progression (for coherence)
- Correctness and naturalness of vocabulary use (for topic match)

Now analyze the following story accordingly:

Story Topic: ${topic}
Target Vocabulary: ${vocabulary.join(', ')}
User's Story: ${story}
`;

  try {
    console.log('Making request to Gemini API...');
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    
    console.log('Gemini API response received');
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
}

// export async function generateVoiceResponse({ 
//   audioBlob,
//   conversationHistory,
//   vocabulary,
//   topic
// }: {
//   audioBlob: Blob;
//   conversationHistory: Array<{ type: 'user' | 'ai', content: string }>;
//   vocabulary: string[];
//   topic?: string;
// }) {
//   const prompt = `
// You are an AI language tutor having a conversation with a student. 
// The student is practicing using vocabulary words in a professional context.

// Core Function: Vocabulary Learning Only

// Strict Adherence to Topic: You must only process and respond to content directly related to vocabulary practice. Any input not related to designated words or sentence construction should be flagged or ignored as off-topic.

// Vocabulary Recognition: Actively listen for the user's pronunciation and usage of the designated vocabulary word within their sentence.

// Grammar Validation: Analyze the user's sentence for grammatical correctness. Accept the sentence if the designated word is used correctly and the sentence structure is sound.

// No Conversational Diversions: You are forbidden from engaging in general conversation, answering personal questions, or responding to any input that deviates from the vocabulary task. If a user attempts to converse, redirect them back to the learning objective.

// Maintain Focus: If a user consistently goes off-topic, gently remind them of the purpose of the chat (e.g., "Let's focus on practicing our vocabulary words.")

// Concise Feedback: Responses should be brief and directly address the user's sentence in relation to the vocabulary word and grammar. Avoid verbose explanations.

// Error Handling: If you cannot understand the student's speech or identify an off-topic query, politely state your inability to process and reiterate the chat's purpose.

// ${topic ? `Context: The conversation is about "${topic}"` : ''}
// Target Vocabulary: ${vocabulary.map(w => `"${w}"`).join(', ')}

// Previous conversation:
// ${conversationHistory.map(msg => `${msg.type === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n')}

// The student's latest message is attached as an audio file. Please transcribe it, analyze it according to the above instructions, and respond as a tutor.
// `;

//   const response = await axios.post(
//     `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
//     {
//       contents: [{ parts: [{ text: prompt }] }]
//     }
//   );
  
//   return response.data.candidates[0].content.parts[0].text;
// }
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

Core Function: Vocabulary Learning Only

Strict Adherence to Topic: You must only process and respond to content directly related to vocabulary practice. Any input not related to designated words or sentence construction should be flagged or ignored as off-topic.

Vocabulary Recognition: Actively listen for the user's pronunciation and usage of the designated vocabulary word within their sentence.Also correct their pronunciation if they are wrong.

Grammar Validation: Analyze the user's sentence for grammatical correctness. Accept the sentence if the designated word is used correctly and the sentence structure is sound.

No Conversational Diversions: You are forbidden from engaging in general conversation, answering personal questions, or responding to any input that deviates from the vocabulary task. If a user attempts to converse, redirect them back to the learning objective.

Maintain Focus: If a user consistently goes off-topic, gently remind them of the purpose of the chat (e.g., "Let's focus on practicing our vocabulary words.")

Concise Feedback: Responses should be brief and directly address the user's sentence in relation to the vocabulary word and grammar. Avoid verbose explanations.
Error Handling: If you cannot understand the user's speech or identify an off-topic query, politely state your inability to process and reiterate the chat's purpose.

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

// Utility function to safely convert ArrayBuffer to base64
// V-1 STARTS
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
// V-1 ENDS
// V-1 STARTS
export async function generateVoiceResponseFromAudio({ 
  // V-11 STARTS
  audioBlob, 
  conversationHistory, 
  vocabulary, 
  topic,
  approvedWords = []

}: {
  audioBlob: Blob;
  conversationHistory: Array<{ type: 'user' | 'ai', content: string }>;
  vocabulary: string[];
  topic?: string;
  approvedWords?: string[];
  // V-11 ENDS
  // V-12 STARTS
}) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please check your .env file.');
  }
// V-12 ENDS
  try {
    // V-13 STARTS
    // Convert audio blob to base64
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = arrayBufferToBase64(arrayBuffer);
// V-13 ENDS
// V-14 STARTS
    const prompt = `
IMPORTANT: After analyzing the student's latest message and updating the APPROVED_WORDS list, immediately check if all target vocabulary words are now approved. 

If all target vocabulary words are now approved:
- Respond with:
TRANSCRIPTION: [the transcribed text]  
RESPONSE: Great job! You have used all the vocabulary words. See you next time.  
APPROVED_WORDS: [ ... ]  
Do not continue the conversation after this message, even if the user asks another question.

If NOT all target vocabulary words are approved:
- Respond with:
TRANSCRIPTION: [the transcribed text]  
RESPONSE: [Brief positive feedback if the usage was correct, then ask a follow-up question related to the topic to continue the vocabulary practice]  
APPROVED_WORDS: [ ... ]  
You may continue the conversation if the student wishes to keep practicing
You are an AI language tutor having a conversation with a student. 
The student is practicing using vocabulary words in a professional context.

Core Function: Vocabulary Learning Only

Strict Adherence to Topic: You must only process and respond to content directly related to vocabulary practice. Any input not related to designated words or sentence construction should be flagged or ignored as off-topic.

Vocabulary Recognition: Actively listen for the user's pronunciation and usage of the designated vocabulary word within their sentence.

Grammar Validation: Analyze the user's sentence for grammatical correctness. Accept the sentence if the designated word is used correctly and the sentence structure is sound.
Success Feedback: If the student uses the vocabulary word correctly and passes all the rules in voice chat, then give the student a brief success message, and immediately follow up with the next question. 

If the student uses the vocabulary word correctly and does not pass all the rules in voice chat, then give the student proper feedback that will help them succeed.

No Conversational Diversions: You are forbidden from engaging in general conversation, answering personal questions, or responding to any input that deviates from the vocabulary task. If a user attempts to converse, redirect them back to the learning objective.

Maintain Focus: If a user consistently goes off-topic, gently remind them of the purpose of the chat (e.g., "Let's focus on practicing our vocabulary words.")

Concise Feedback: Responses should be brief and directly address the user's sentence in relation to the vocabulary word and grammar. Avoid verbose explanations.

Error Handling: If you cannot understand the user's speech or identify an off-topic query, politely state your inability to process and reiterate the chat's purpose.
${topic ? `Context: The conversation is about "${topic}"` : ''}
Target Vocabulary: ${vocabulary.map(w => `"${w.toLowerCase()}"`).join(', ')}

Previous conversation:
${conversationHistory.map(msg => `${msg.type === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n')}
When a user has properly used the words then you put them in APPROVED _WORDS.
The student's latest message is attached as an audio file. Please:

1. First, transcribe the audio content
2. Then analyze it according to the above instructions
3. Finally, respond as a tutor.

Please format your response as:
TRANSCRIPTION: [the transcribed text]
RESPONSE: [your tutor response]
APPROVED_WORDS: [${approvedWords.map(w => `"${w.charAt(0).toUpperCase()}${w.slice(1).toLowerCase()}"`).join(', ')}]
Approved Words (already used correctly): ${approvedWords.map(w => `"${w.charAt(0).toUpperCase()}${w.slice(1).toLowerCase()}"`).join(', ')}
After analyzing the student's message, update the approved words list if new words were used correctly.
Keep responses conversational and under 2 sentences. Don't mention the vocabulary words explicitly unless the student asks. 
`;
// V-14 ENDS
// V-15 STARTS
    const response = await axios.post(
      `${GEMINI_AUDIO_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: audioBlob.type || "audio/webm",
                data: base64Audio
              }
            }
          ]
        }]
      }
    );
    // V-15 ENDS
    // V-16 STARTS
    return response.data.candidates[0].content.parts[0].text;
    // V-16 ENDS
    // V-17 STARTS
  } catch (error) {
    console.error('Gemini Audio API error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Audio API Error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
  // V-17 ENDS
}
// V-1 ENDS
// For getting the example for the words
export async function getGeminiExample(word: string, definition: string): Promise<string> {
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const prompt = `Write a professional sentence example using the word "${word}" (definition: ${definition}).`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    const data = response.data;
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      `Try to use "${word}" in a professional sentence.`
    );
  } catch (error) {
    console.error('Gemini example error:', error);
    return `Try to use "${word}" in a professional sentence.`;
  }
}
export async function getRandomWordsFromGemini(count: number = 5,previousWords: string[] = []) {
  // Give me ${count} random,different, professional English words everytime.
  const prompt = `
 You are a professional English dictionary. Give me ${count} random, different, professional English words that you have not given before. 
For each word, provide:
- word
- definition
- part of speech
Return the result as a JSON array, like:
[
  { "word": "...", "definition": "...", "partOfSpeech": "..." },
  ...
]
Do NOT include any of these words: ${previousWords.join(", ")}Make sure the words are truly random and professional.

`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    // generationConfig: { temperature: 1.0 }
  };

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    const data = response.data;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    }
    throw new Error('Could not parse Gemini response as JSON');
  } catch (error) {
    console.error('Gemini random words error:', error);
    return [];
  }
}
// GENERATING RANDOM TOPICS
export async function getRandomStoryTopics(count: number = 4) {
  const prompt = `
Generate ${count} unique, realistic professional scenario topics for a business English learner. 
For each topic, provide:
- id (unique string)
- title (short, catchy)
- scenario (one sentence summary)
- context (one sentence background)
- challenge (one sentence describing the main challenge)

Return the result as a JSON array, like:
[
  { "id": "...", "title": "...", "scenario": "...", "context": "...", "challenge": "..." },
  ...
]
`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    const data = response.data;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    }
    throw new Error('Could not parse Gemini response as JSON');
  } catch (error) {
    console.error('Gemini random topics error:', error);
    return [];
  }
}