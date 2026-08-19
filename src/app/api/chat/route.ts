import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';
import { chatModel, SYSTEM_PROMPT } from '@/lib/ai/config';
import type { UIMessage } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  let messages: UIMessage[];
  try {
    ({ messages } = await req.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  if (!Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "messages must be an array" }), { status: 400 });
  }

  const cappedMessages = messages.slice(-10).map((m: any) => ({
    ...m,
    content: typeof m.content === 'string' 
      ? m.content.substring(0, 1000) 
      : m.content
  })) as UIMessage[];

  const result = streamText({
    model: chatModel,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(cappedMessages),
    tools: {
      searchItunes: tool({
        description: 'Search the iTunes API for music tracks.',
        inputSchema: z.object({
          query: z.string().describe('The search term, e.g., "The Beatles" or "Lo-fi beats"'),
        }),
        execute: async ({ query }) => {
          try {
            const res = await fetch(
              `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=3`
            );

            if (!res.ok) {
              return { error: `iTunes search failed with status ${res.status}` };
            }

            const data = await res.json();

            return data.results.map((track: any) => ({
              trackId: track.trackId,
              title: track.trackName,
              artist: track.artistName,
              coverArt: track.artworkUrl100,
            }));
          } catch (error) {
            console.error("iTunes search error:", error);
            return { error: "Failed to search iTunes. Please try again." };
          }
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}