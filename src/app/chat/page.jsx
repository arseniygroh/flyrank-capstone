"use client";

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import ReactMarkdown from "react-markdown";

const suggestions = [
  "Suggest some music for a party",
  "Give me a 90s hip-hop classics mix",
  "I need an workout playlist"
];

export default function ChatPage() {
  const {messages, sendMessage, status, stop, error, reload} = useChat();
  const [input, setInput] = useState("");

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950 m-6">
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 mt-10 lg:mt-20">
            <h2 className="text-xl font-bold text-white mb-2">Your Personal AI DJ</h2>
            <p className="text-neutral-400 mb-8 max-w-sm">
              Describe your mood or activity, and I'll find the perfect tracks from iTunes.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage({text: suggestion})}
                  className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-sm text-neutral-300 px-4 py-2 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            {m.parts.map((part, index) => {
              if (part.type === 'text') {
                return (
                  <div
                    key={index}
                    className={`max-w-[85%] lg:max-w-[70%] rounded-2xl px-5 py-3 prose prose-invert ${
                      m.role === 'user'
                        ? 'bg-white text-black rounded-br-sm'
                        : 'bg-neutral-800 text-white rounded-bl-sm border border-neutral-700'
                    }`}
                  >
                    <ReactMarkdown>{part.text}</ReactMarkdown>
                  </div>
                );
              }

              if (part.type === 'tool-searchItunes') {
                if (part.state === 'input-available') {
                  return (
                    <div key={index} className="flex gap-2 items-center text-neutral-500 italic mt-2 text-sm bg-neutral-900 px-4 py-2 rounded-full">
                      <div className="w-3 h-3 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
                      Searching iTunes for "{part.input?.query}"...
                    </div>
                  );
                }

                if (part.state === 'output-available') {
                  const results = part.output;

                  if (results?.error) {
                    return (
                      <div key={index} className="text-red-400 italic mt-2 text-sm">
                        {results.error}
                      </div>
                    );
                  }

                  return (
                    <div key={index} className="flex flex-col gap-2 mt-3 w-full max-w-[85%] lg:max-w-[70%]">
                      {results.map((track) => (
                        <div key={track.trackId} className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 p-2 rounded-lg">
                          <img src={track.coverArt} alt={track.title} className="w-10 h-10 rounded-md" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{track.title}</p>
                            <p className="text-xs text-neutral-400 truncate">{track.artist}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                if (part.state === 'output-error') {
                  return (
                    <div key={index} className="text-red-400 italic mt-2 text-sm">
                      Search failed: {part.errorText}
                    </div>
                  );
                }
              }
              return null;
            })}
          </div>
        ))}

      </div>

      <div className="p-4 lg:p-6 bg-neutral-900 border-t border-neutral-800 shrink-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 relative">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Your prompt...'
            disabled={isLoading}
            className="w-full bg-neutral-800 text-white rounded-full px-6 py-4 outline-none focus:ring-1 focus:ring-white transition-colors"
          />
          <button
            type={isLoading ? "button" : "submit"}
            onClick={isLoading ? stop : undefined}
            disabled={!isLoading && !input.trim()}
            className="w-full bg-white text-black py-3 rounded-full font-bold hover:bg-neutral-200 disabled:opacity-50 disabled:hover:bg-white transition-colors"
          >
            {isLoading ? "Stop" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}