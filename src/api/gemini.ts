// src/api/gemini.ts
import axios from 'axios';


// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_AUDIO_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
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
0/5 → ~60%, 1/5 → ~70%, 2/5 → ~75%, 3/5 → ~80%, 4/5 → ~90%, 5/5 → ~95–100%
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
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function generateVoiceResponseFromAudio({ 
  audioBlob, 
  conversationHistory, 
  vocabulary, 
  topic 
}: {
  audioBlob: Blob;
  conversationHistory: Array<{ type: 'user' | 'ai', content: string }>;
  vocabulary: string[];
  topic?: string;
}) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please check your .env file.');
  }

  try {
    // Convert audio blob to base64
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = arrayBufferToBase64(arrayBuffer);

    const prompt = `
You are an AI language tutor having a conversation with a student. 
The student is practicing using vocabulary words in a professional context.

Core Function: Vocabulary Learning Only

Strict Adherence to Topic: You must only process and respond to content directly related to vocabulary practice. Any input not related to designated words or sentence construction should be flagged or ignored as off-topic.

Vocabulary Recognition: Actively listen for the user's pronunciation and usage of the designated vocabulary word within their sentence.

Grammar Validation: Analyze the user's sentence for grammatical correctness. Accept the sentence if the designated word is used correctly and the sentence structure is sound.

No Conversational Diversions: You are forbidden from engaging in general conversation, answering personal questions, or responding to any input that deviates from the vocabulary task. If a user attempts to converse, redirect them back to the learning objective.

Maintain Focus: If a user consistently goes off-topic, gently remind them of the purpose of the chat (e.g., "Let's focus on practicing our vocabulary words.")

Concise Feedback: Responses should be brief and directly address the user's sentence in relation to the vocabulary word and grammar. Avoid verbose explanations.

Error Handling: If you cannot understand the user's speech or identify an off-topic query, politely state your inability to process and reiterate the chat's purpose.

${topic ? `Context: The conversation is about "${topic}"` : ''}
Target Vocabulary: ${vocabulary.map(w => `"${w}"`).join(', ')}

Previous conversation:
${conversationHistory.map(msg => `${msg.type === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n')}

The student's latest message is attached as an audio file. Please:

1. First, transcribe the audio content
2. Then analyze it according to the above instructions
3. Finally, respond as a tutor

Please format your response as:
TRANSCRIPTION: [the transcribed text]
RESPONSE: [your tutor response]

Keep responses conversational and under 2 sentences. Don't mention the vocabulary words explicitly unless the student asks.
`;

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
    
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini Audio API error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Audio API Error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
}

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