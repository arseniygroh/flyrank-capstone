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
        spaceBetween={30}
        slidesPerView={1}
        navigation
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
      >
        {tracks.map((track) => (
          <SwiperSlide key={track.trackId}>
            <TrackCard track={track} />
          </SwiperSlide>
        ))}
      </Swiper>
    )
}