import { useState } from "react";
import { BiLike } from "react-icons/bi";
import { FaChevronDown, FaPlay, FaPlus, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useMyList } from "../context/MyListContext";
import Toast from "./Toast";
import useTranslation from "../hooks/useTranslation";

const TopTencard = ({ movie = {}, rank }) => {
  const { toggleMyList, isInMyList } = useMyList();
  const { t } = useTranslation();

  const [toast, setToast] = useState(null);

  const title =
    movie.title ||
    movie.name ||
    movie.original_title ||
    movie.original_name ||
    t("unknown");

  const addedToList = isInMyList(movie.id);

  const genres = movie.genres || [];
  const visibleGenres = genres.slice(0, 3);
  const hasMoreGenres = genres.length > 3;

  const handleToggleMyList = () => {
    toggleMyList(movie);

    setToast({
      message: addedToList ? t("removedFromMyList") : t("addedToMyList"),
      type: "success",
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <div className="flex items-end justify-center w-full relative group">
      <div className="flex items-end w-full">
        <div className="flex items-end justify-center w-[85px] shrink-0 h-[148px]">
          <span className="text-[150px] leading-[0.8] font-bold text-transparent [-webkit-text-stroke:2px_#fff] opacity-70">
            {rank}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <Link to={`/movie/${movie.id}`}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={title}
              className="w-full aspect-[2/3] object-cover rounded-lg"
            />
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 bg-[#2a2a2a] rounded-lg opacity-0 group-hover:opacity-100 group-hover:z-[500] transition duration-500 ease-in-out scale-100 group-hover:scale-110 origin-center overflow-hidden">
        <Link to={`/movie/${movie.id}`}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
            alt={title}
            className="rounded-t-lg w-full aspect-video object-cover"
          />
        </Link>

        <div className="p-2">
          <div className="mb-4 flex items-center justify-between min-h-8 mt-2">
            <div className="flex items-center gap-4">
              <Link
                to={`/movie/${movie.id}`}
                className="bg-white inline-flex items-center justify-center py-1 px-2 rounded-full text-black border border-[#ffffff80] hover:bg-[#e50914] hover:text-white transition"
              >
                <FaPlay />
              </Link>

              <button
                onClick={handleToggleMyList}
                className="bg-[#2a2a2a] inline-flex items-center justify-center py-1 px-2 rounded-full text-white border border-[#ffffff80] hover:border-white transition"
              >
                {addedToList ? <FaCheck /> : <FaPlus />}
              </button>

              <span className="bg-[#2a2a2a] inline-flex items-center justify-center py-1 px-2 rounded-full text-white border border-[#ffffff80]">
                <BiLike />
              </span>
            </div>

            <Link
              to={`/movie/${movie.id}`}
              className="bg-[#2a2a2a] inline-flex items-center justify-center py-1 px-2 rounded-full text-white border border-[#ffffff80] hover:border-white transition"
            >
              <FaChevronDown />
            </Link>
          </div>

          <div className="mb-1 flex items-center gap-1">
            <span className="text-white text-[14px] font-medium border border-[#fff6] py-1 px-2 rounded-full">
              {movie.adult ? "+18" : "13+"}
            </span>

            <span className="text-white text-[14px] font-medium py-1 px-2 rounded-full">
              {movie.media_type === "tv" ? t("tvLabel") : t("movieLabel")}
            </span>

            {(movie.release_date || movie.first_air_date) && (
              <span className="text-white text-[14px] font-medium border border-[#fff6] py-1 px-2 rounded-full">
                {new Date(
                  movie.release_date || movie.first_air_date,
                ).getFullYear()}
              </span>
            )}
          </div>

          {visibleGenres.length > 0 && (
            <div className="flex items-center gap-2 text-white text-[16px] font-[500] mt-2 overflow-hidden whitespace-nowrap">
              {visibleGenres.map((genre, index) => (
                <div
                  key={genre.id}
                  className="flex items-center gap-2 shrink-0"
                >
                  <p>{genre.name}</p>

                  {index < visibleGenres.length - 1 && (
                    <p className="text-[#fff6]">•</p>
                  )}
                </div>
              ))}

              {hasMoreGenres && <p className="text-[#fff6] ml-1">...</p>}
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default TopTencard;
