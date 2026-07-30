"use client";

export default function ChatErrorBoundary({error, reset}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center p-6">
      <h2 className="text-xl font-bold text-white mb-2">The AI Assistant Crashed</h2>
      <p className="text-neutral-400 mb-6 max-w-md">
        Something went wrong loading the chat. Check your connection or try restarting the module.
      </p>
      <button
        onClick={() => reset()}
        className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-neutral-200 transition-colors"
      >
        Restart Chat
      </button>
    </div>
  );
}