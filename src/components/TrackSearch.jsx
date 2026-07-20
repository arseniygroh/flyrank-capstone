"use client";
import { useState } from "react";

export default function TrackSearch({onAdd}) {
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState([]);
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");

    function handleInputChange(e) {
        setQuery(e.target.value);
    } 

    async function handleSearch(e) {
        e.preventDefault(); 
    
        if (!query.trim()) return; 

        setIsFetching(true);
        setError("");
        
        try {
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=10`;
            const res = await fetch(url);
            
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            
            const result = await res.json();
            setData(result.results); 
        } catch (err) {
            setError(err.message);
        } finally {
            setIsFetching(false); 
            setQuery("");
        }
    }

    return (
        <div className="mt-8">
            <form onSubmit={handleSearch} className="flex gap-4 items-end mb-6">
                <div className="flex-1 flex flex-col gap-2">
                    <label htmlFor="query" className="text-sm font-bold tracking-widest uppercase text-neutral-400">
                        Add Tracks
                    </label>
                    <input 
                        id="query"
                        type="text" 
                        value={query} 
                        onChange={handleInputChange} 
                        placeholder="Search for a song or artist..."
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-white transition-colors"
                        required 
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isFetching}
                    className="bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
                >
                    {isFetching ? "Searching..." : "Search"}
                </button>
            </form>

            {error && <p className="text-red-500 mb-4">{error}</p>}
        
            <div className="flex flex-col gap-2">
                {data.map(track => (
                    <div key={track.trackId} className="p-3 bg-neutral-800 rounded flex justify-between items-center">
                        <div>
                            <p className="font-bold text-white">{track.trackName}</p>
                            <p className="text-sm text-neutral-400">{track.artistName}</p>
                        </div>
                        <button onClick={e => onAdd(track)} type="button" className="text-sm font-bold text-neutral-300 hover:text-white">
                            + Add
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}