"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import TrackCard from "./TrackCard";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

export default function TrackCarousel({tracks: initialTracks}: {tracks: any[]}) {
  const [tracks, setTracks] = useState(initialTracks);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleReachEnd = async () => {
    if (isLoadingMore) return; 
    setIsLoadingMore(true);

    try {
    
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