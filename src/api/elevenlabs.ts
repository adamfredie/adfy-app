const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
const voiceId = "69nXRvRvFpjSXhH7IM5l"; // Replace with your chosen voice ID

export async function getElevenLabsAudio(text: string): Promise<Blob> {
  console.log("VITE_ELEVENLABS_API_KEY:", apiKey);
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    })
  });
  if (!response.ok) throw new Error("Failed to fetch audio");
  return await response.blob();
}