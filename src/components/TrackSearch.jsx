"use client";
import { useState } from "react";
import StatefulButton from "@/components/StatefulButton";

export default function TrackSearch({onAdd}) {

    const [data, setData] = useState([]);
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");

    function handleInputChange(e) {
        setQuery(e.target.value);
    } 

    async function handleSearch() {
        if (!query.trim()) return; 
        setError("");
        
        try {
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=10`;
            const res = await fetch(url);
            
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            
            const result = await res.json();
            setData(result.results); 
            setQuery("");
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    return (
        <div className="mt-6 sm:mt-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end mb-6">
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <label htmlFor="query" className="text-sm font-bold tracking-widest uppercase text-neutral-400">
                        Add Tracks
                    </label>
                    <input
                        id="query"
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search for a song or artist..."
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white text-base focus:outline-none focus:border-white transition-colors"
                    />
                </div>
                <div className="shrink-0 w-full sm:w-auto [&_button]:w-full sm:[&_button]:w-auto">
                    <StatefulButton onClick={handleSearch} idleText="Search" />
                </div>
            </div>

            {error && <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>}

            <div className="flex flex-col gap-2">
                {data.map(track => (
                    <div
                        key={track.trackId}
                        className="p-3 bg-neutral-800 rounded flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 min-w-0"
                    >
                        <div className="min-w-0">
                            <p className="font-bold text-white text-sm sm:text-base truncate">{track.trackName}</p>
                            <p className="text-xs sm:text-sm text-neutral-400 truncate">{track.artistName}</p>
                        </div>
                        <div className="shrink-0 self-end sm:self-auto w-full sm:w-auto [&_button]:w-full sm:[&_button]:w-auto">
                            <StatefulButton
                                onClick={async () => await onAdd(track)}
                                idleText="Add"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}