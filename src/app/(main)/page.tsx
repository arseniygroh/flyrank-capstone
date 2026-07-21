import TrackCard from "@/components/TrackCard";
import TrackCarousel from "@/components/TrackCarousel";
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
      tracks: popTracks,
      term: "pop hit"
    },
    { 
      title: "Classic Rock", 
      tracks: rockTracks,
      term: "classic rock",
    },
    { 
      title: "Electronic & Dance", 
      tracks: electronicTracks,
      term: "electronic dance"
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
            <TrackCarousel tracks={category.tracks} term={category.term} />
          </section>
        ))}
      </div>
    </div>
  );
}
