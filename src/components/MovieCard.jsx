import { useState } from "react";
import { BiLike } from "react-icons/bi";
import { FaCheck, FaChevronDown, FaPlay, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useMyList } from "../context/MyListContext";
import Toast from "./Toast";
import useTranslation from "../hooks/useTranslation";

const MovieCard = ({ movie = {}, origin = "center" }) => {
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

  const detailsPath =
    movie.media_type === "tv" ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  const handleToggleMyList = () => {
    toggleMyList(movie);

    setToast({
      message: addedToList ? t("removedFromMyList") : t("addedToMyList"),
      type: "success",
    });

    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex flex-col max-w-[300px] relative group hover:z-[500] text-white">
      <div className="w-full">
        <Link to={detailsPath} className="text-white">
          <img
            src={`https://image.tmdb.org/t/p/w500${
              movie.backdrop_path || movie.poster_path
            }`}
            alt={title}
            className="rounded-lg w-full aspect-video object-cover"
          />
        </Link>
      </div>

      <div
        style={{ transformOrigin: `${origin} center` }}
        className="w-full bg-[#2a2a2a] text-white rounded-b-lg absolute top-0 left-0 right-0 opacity-0 group-hover:opacity-100 group-hover:z-[500] transition duration-500 ease-in-out scale-100 group-hover:scale-125"
      >
        <Link to={detailsPath} className="text-white">
          <img
            src={`https://image.tmdb.org/t/p/w500${
              movie.backdrop_path || movie.poster_path
            }`}
            alt={title}
            className="rounded-lg w-full aspect-video object-cover"
          />
        </Link>

        <div className="p-2 text-white">
          <div className="mb-4 flex items-center justify-between min-h-8 mt-2">
            <div className="flex items-center gap-4">
              <Link
                to={detailsPath}
                className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center"
              >
                <FaPlay size={12} />
              </Link>

              <button
                onClick={handleToggleMyList}
                className="border border-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center"
              >
                {addedToList ? <FaCheck size={12} /> : <FaPlus size={12} />}
              </button>

              <span className="border border-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center">
                <BiLike size={16} />
              </span>
            </div>

            <Link
              to={detailsPath}
              className="border border-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              <FaChevronDown size={14} />
            </Link>
          </div>

          <div className="mb-1 flex items-center gap-1 text-white">
            <span>{movie.adult ? "+18" : "13+"}</span>
            <span>•</span>

            <span>
              {movie.media_type === "tv" ? t("tvLabel") : t("movieLabel")}
            </span>
            <span>•</span>

            {(movie.release_date || movie.first_air_date) && (
              <span>
                {new Date(
                  movie.release_date || movie.first_air_date,
                ).getFullYear()}
              </span>
            )}
          </div>

          {movie.genres?.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-white">
              {movie.genres.slice(0, 3).map((genre, index) => (
                <span key={genre.id}>
                  {genre.name}
                  {index < Math.min(movie.genres.length, 3) - 1 && " •"}
                </span>
              ))}
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

export default MovieCard;
