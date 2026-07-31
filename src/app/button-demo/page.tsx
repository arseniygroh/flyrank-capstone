"use client";
import StatefulButton from "@/components/StatefulButton";

export default function ButtonDemoPage() {

  const mockSuccessCall = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 1500);
    });
  };

  const mockErrorCall = async () => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Simulated network failure"));
      }, 1500);
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 font-sans">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl justify-center">
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl flex-1 flex flex-col items-center text-center gap-5">
            <h2 className="text-white font-bold text-lg mb-1">Guaranteed Success</h2>
            <StatefulButton onClick={mockSuccessCall} />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl flex-1 flex flex-col items-center text-center gap-5">
            <h2 className="text-white font-bold text-lg mb-1">Guaranteed Error</h2>
            <StatefulButton onClick={mockErrorCall} />
        </div>
      </div>
    </div>
  );
}