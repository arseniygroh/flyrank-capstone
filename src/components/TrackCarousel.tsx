"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import TrackCard from "./TrackCard";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

export default function TrackCarousel({tracks}: {tracks: any[]}) {
    return (
        <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={20}
        slidesPerView="auto"
        freeMode={true}
        navigation
        className="w-full pb-4 !px-1"
      >
        {tracks.map((track) => (
          <SwiperSlide key={track.trackId} style={{width: "auto"}}>
            <TrackCard track={track} />
          </SwiperSlide>
        ))}
      </Swiper>
    )
}