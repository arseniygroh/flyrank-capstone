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
                <div 
                  key={track.trackId} 
                  className="min-w-[160px] max-w-[160px] p-4 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors snap-start shrink-0 group relative"
                >
                  <img 
                    src={track.artworkUrl100.replace('100x100', '300x300')} 
                    alt={track.trackName}
                    className="w-full aspect-square object-cover rounded-md mb-3 shadow-lg group-hover:opacity-75 transition-opacity"
                  />
                  <p className="font-semibold text-sm truncate">
                    {track.trackName}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">
                    {track.artistName}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
