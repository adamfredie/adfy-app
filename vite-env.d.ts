/// <reference types="vite/client" />
interface ImportMetaEnv {
    // add more env variables here if needed
    readonly VITE_GEMINI_API_KEY: string;
    readonly VITE_ELEVENLABS_API_KEY: string;
}

// interface ImportMeta {
//   readonly env: ImportMetaEnv;
// }