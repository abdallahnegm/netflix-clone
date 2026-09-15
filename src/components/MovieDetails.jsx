import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Toast from "./Toast";

import {
  FaArrowLeft,
  FaCheck,
  FaClock,
  FaPlay,
  FaPlus,
  FaStar,
  FaTimes,
} from "react-icons/fa";
import { useMyList } from "../context/MyListContext";
import useTranslation from "../hooks/useTranslation";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { toggleMyList, isInMyList } = useMyList();
  const { t } = useTranslation();

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const apiKey = import.meta.env.VITE_TMDB_API_KEY;

        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const data = await response.json();

        setMovie(data);

        const videos = data.videos?.results || [];

        const officialTrailer =
          videos.find(
            (video) =>
              video.site === "YouTube" &&
              video.type === "Trailer" &&
              video.official === true,
          ) ||
          videos.find(
            (video) => video.site === "YouTube" && video.type === "Trailer",
          ) ||
          videos.find(
            (video) => video.site === "YouTube" && video.type === "Teaser",
          );

        setTrailer(officialTrailer || null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handlePlay = () => {
    if (!trailer) {
      setToast({
        message: t("trailerUnavailable"),
        type: "error",
      });

      setTimeout(() => {
        setToast(null);
      }, 3000);

      return;
    }

    setShowTrailer(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black pt-28">
        <div className="max-w-7xl mx-auto px-6 animate-pulse">
          <div className="h-[55vh] bg-[#141414] rounded-2xl"></div>

          <div className="mt-8 h-10 bg-[#222] rounded w-1/2"></div>

          <div className="mt-5 h-5 bg-[#222] rounded w-1/3"></div>

          <div className="mt-6 space-y-3">
            <div className="h-4 bg-[#222] rounded w-full"></div>
            <div className="h-4 bg-[#222] rounded w-5/6"></div>
            <div className="h-4 bg-[#222] rounded w-4/6"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-white text-3xl font-bold mb-4">
            {t("movieNotFound")}
          </h1>

          <p className="text-[#737373] mb-6">{error || t("somethingWrong")}</p>

          <button
            onClick={() => navigate(-1)}
            className="bg-[#e50914] text-white px-6 py-3 rounded-full font-medium hover:bg-[#b20710] transition"
          >
            {t("goBack")}
          </button>
        </div>
      </main>
    );
  }

  const title = movie.title || movie.original_title;

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}${t("hours")} ${
        movie.runtime % 60
      }${t("minutes")}`
    : "";

  const addedToList = isInMyList(movie.id);

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
    <main className="min-h-screen bg-black text-white">
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(0,0,0,0.95)_0%,_rgba(0,0,0,0.65)_45%,_rgba(0,0,0,0.15)_100%)]"></div>

        <div className="absolute inset-0 bg-[linear-gradient(0deg,_#000_0%,_rgba(0,0,0,0.65)_25%,_transparent_65%)]"></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-16 pt-40">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#aaa] hover:text-white transition mb-8"
          >
            <FaArrowLeft />
            {t("backHome")}
          </Link>

          <div className="max-w-3xl">
            <p className="text-[#e50914] uppercase tracking-[4px] text-sm font-bold mb-4">
              {t("movieDetails")}
            </p>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {title}
            </h1>

            {movie.tagline && (
              <p className="text-[#d4d4d4] text-lg md:text-xl italic mt-4">
                "{movie.tagline}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-6 text-sm md:text-base">
              {year && (
                <span className="border border-[#ffffff40] px-3 py-1 rounded-full">
                  {year}
                </span>
              )}

              {movie.adult !== undefined && (
                <span className="border border-[#ffffff40] px-3 py-1 rounded-full">
                  {movie.adult ? "+18" : "13+"}
                </span>
              )}

              {runtime && (
                <span className="flex items-center gap-2 border border-[#ffffff40] px-3 py-1 rounded-full">
                  <FaClock className="text-xs" />
                  {runtime}
                </span>
              )}

              <span className="flex items-center gap-2 text-yellow-400">
                <FaStar />

                <span className="text-white">
                  {movie.vote_average?.toFixed(1)}
                </span>
              </span>
            </div>

            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="text-[#d4d4d4] text-sm border border-[#ffffff30] px-3 py-1 rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-[#d4d4d4] text-base md:text-lg leading-8 mt-7 max-w-3xl">
              {movie.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <button
                onClick={handlePlay}
                className="bg-white text-black flex items-center gap-3 px-7 py-3 rounded-full font-semibold hover:bg-[#e50914] hover:text-white transition duration-300"
              >
                <FaPlay />
                {t("play")}
              </button>

              <button
                onClick={handleToggleMyList}
                className="bg-[#333] text-white flex items-center gap-3 px-7 py-3 rounded-full font-semibold hover:bg-[#e50914] transition duration-300"
              >
                {addedToList ? <FaCheck /> : <FaPlus />}

                {addedToList ? t("addedToMyList") : t("addToMyList")}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-5">{t("movieInfo")}</h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#737373]">{t("originalTitle")}</span>

                <span className="text-right">{movie.original_title}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#737373]">{t("releaseDate")}</span>

                <span>{movie.release_date || t("notAvailable")}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#737373]">{t("language")}</span>

                <span>{movie.original_language?.toUpperCase()}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#737373]">{t("status")}</span>

                <span>{movie.status}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-5">{t("rating")}</h2>

            <div className="flex items-center gap-4">
              <div className="text-yellow-400 text-4xl">
                <FaStar />
              </div>

              <div>
                <p className="text-3xl font-bold">
                  {movie.vote_average?.toFixed(1)}

                  <span className="text-[#737373] text-base">/10</span>
                </p>

                <p className="text-[#737373] text-sm mt-1">
                  {movie.vote_count?.toLocaleString()} {t("votes")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-5">{t("production")}</h2>

            <div className="space-y-3">
              {movie.production_companies?.slice(0, 4).map((company) => (
                <div key={company.id} className="text-[#d4d4d4] text-sm">
                  {company.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showTrailer && trailer && (
        <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-[#e50914] transition"
            >
              <FaTimes />
            </button>

            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
              title={`${title} Trailer`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
};

export default MovieDetails;
