import { google } from '@ai-sdk/google';
export const chatModel = google(process.env.GEMINI_MODEL || 'gemini-3-flash-preview');

export const SYSTEM_PROMPT = `You are an expert virtual DJ and music assistant. 
Help the user discover music and build playlists. Always format your text using markdown. 
If the user asks for song recommendations, use your searchItunes tool to find real tracks.`;

