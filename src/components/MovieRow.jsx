import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import "swiper/css";

const MovieRow = ({ title, movies, loading }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(2);

  const isRTL = document.documentElement.dir === "rtl";

  const getOrigin = (index) => {
    const lastVisibleIndex = Math.min(
      activeIndex + slidesPerView - 1,
      movies.length - 1,
    );

    if (index === activeIndex) {
      return isRTL ? "right" : "left";
    }

    if (index === lastVisibleIndex) {
      return isRTL ? "left" : "right";
    }

    return "center";
  };

  return (
    <div className="bg-black">
      <div className="max-w-8xl mx-auto px-4 py-10 w-full">
        <h2 className="text-white text-2xl font-bold mb-4">{title}</h2>

        <div className="overflow-x-clip overflow-y-visible">
          <Swiper
            spaceBetween={10}
            slidesPerView={2}
            watchSlidesProgress={true}
            breakpoints={{
              640: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
              1280: {
                slidesPerView: 5,
              },
            }}
            onSwiper={(swiper) => {
              setActiveIndex(swiper.activeIndex);
              setSlidesPerView(swiper.params.slidesPerView);
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.activeIndex);
            }}
            onBreakpoint={(swiper) => {
              setSlidesPerView(swiper.params.slidesPerView);
              setActiveIndex(swiper.activeIndex);
            }}
            className="!overflow-visible"
          >
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <SwiperSlide key={index} className="!overflow-visible">
                    <MovieCardSkeleton />
                  </SwiperSlide>
                ))
              : movies.map((movie, index) => (
                  <SwiperSlide key={movie.id} className="!overflow-visible">
                    <MovieCard movie={movie} origin={getOrigin(index)} />
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default MovieRow;
