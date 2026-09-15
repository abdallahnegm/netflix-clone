import { Swiper, SwiperSlide } from "swiper/react";
import TopTencard from "./TopTencard";
import useTranslation from "../hooks/useTranslation";
import "swiper/css";

const TopTenRow = ({ movies = [] }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-black">
      <div className="max-w-8xl mx-auto px-4 py-10 w-full">
        <h2 className="text-white text-2xl font-bold mb-4">{t("topTen")}</h2>

        <Swiper
          spaceBetween={10}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="!overflow-visible"
        >
          {movies.map((movie, index) => (
            <SwiperSlide key={movie.id} className="!overflow-visible">
              <TopTencard movie={movie} rank={index + 1} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TopTenRow;
