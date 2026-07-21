"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import TrackCard from "./TrackCard";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";


export default function TrackCarousel({tracks: initialTracks, term}: {tracks: any[], term: string}) {
  const [tracks, setTracks] = useState(initialTracks);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleReachEnd = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
  
    try {
      const nextLimit = tracks.length + 10;
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=${nextLimit}`
      );
      if (!res.ok) throw new Error("Failed to fetch more tracks");
  
      const data = await res.json();
      const newTracks = data.results.slice(tracks.length); 
  
      if (newTracks.length === 0) {
        setHasMore(false);
        return;
      }
  
      setTracks(prev => {
        const existingIds = new Set(prev.map((t: any) => t.trackId));
        const deduped = newTracks.filter((t: any) => !existingIds.has(t.trackId));
        return [...prev, ...deduped];
      });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <Swiper
      modules={[Navigation, FreeMode]}
      spaceBetween={20}
      slidesPerView="auto"
      freeMode={true}
      navigation
      onReachEnd={handleReachEnd}
      className="w-full pb-4 !px-1"
    >
      {tracks.map((track) => (
        <SwiperSlide key={track.trackId} style={{ width: "auto" }}>
          <TrackCard track={track} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}