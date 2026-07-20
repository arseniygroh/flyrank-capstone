import TrackCard from "@/components/TrackCard";
import Link from "next/link";

async function fetchCategory(term: string) {
  
  const res = await fetch(
    `https://itunes.apple.com/search?term=${term}&entity=song&limit=10`, { 
      cache: "no-store" 
    } 
  );
  
  if (!res.ok) throw new Error(`Failed to fetch ${term}`);
  const data = await res.json();
  return data.results;
}

export default async function HomePage() {
  const [popTracks, rockTracks, electronicTracks] = await Promise.all([
    fetchCategory("pop hit"),
    fetchCategory("classic rock"),
    fetchCategory("electronic dance"),
  ]);

  const feedCategories = [
    { 
      title: "Trending Pop", 
      tracks: popTracks 
    },
    { 
      title: "Classic Rock", 
      tracks: rockTracks 
    },
    { 
      title: "Electronic & Dance", 
      tracks: electronicTracks 
    },
  ];

  return (
    <div className="flex h-full flex-col p-6 xl:p-10 overflow-y-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Discover
        </h1>
        <p className="mt-2 text-neutral-400">
          Find your next favorite track.
        </p>
      </header>

      <div className="space-y-10 pb-8">
        {feedCategories.map((category) => (
          <section key={category.title}>
            <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
            
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
              {category.tracks.map((track: any) => (
                <TrackCard track={track} key={track.trackId} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
