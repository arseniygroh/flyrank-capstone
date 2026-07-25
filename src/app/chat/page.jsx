"use client";

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const { messages, sendMessage, status, stop } = useChat();
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
          <div className="text-center text-neutral-500 mt-20">Ask me for music recommendations...</div>
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
                    <div key={index} className="text-neutral-500 italic mt-2 text-sm">
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

      <div className="p-4 lg:p-6 bg-neutral-900 border-t border-neutral-800">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Your prompt...'
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