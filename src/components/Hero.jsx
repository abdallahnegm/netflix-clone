import { useEffect, useState } from "react";
import { FaPlay, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import useTranslation from "../hooks/useTranslation";
import Toast from "./Toast";

const Hero = ({ movie }) => {
  const { t } = useTranslation();

  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [toast, setToast] = useState(null);

  const title =
    movie?.title ||
    movie?.name ||
    movie?.original_title ||
    movie?.original_name ||
    "";

  const releaseDate = movie?.release_date || movie?.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";

  useEffect(() => {
    if (!movie?.id) return;

    const fetchTrailer = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;

        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=videos`,
        );

        if (!response.ok) return;

        const data = await response.json();

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
      } catch {
        setTrailer(null);
      }
    };

    fetchTrailer();
  }, [movie?.id]);

  const handleWatchNow = () => {
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

  return (
    <>
      <section
        id="hero"
        className="bg-cover bg-center h-screen relative"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie?.backdrop_path})`,
        }}
      >
        <div
          className="absolute bg-[image:linear-gradient(90deg,_rgba(0,_0,_0,_0.6)_0%,_rgba(0,_0,_0,_0)_60%),_linear-gradient(0deg,_rgba(0,_0,_0,_0.5)_0%,_rgba(0,_0,_0,_0.1)_35%,_rgba(0,_0,_0,_0)_70%)]
          top-0 left-0 right-0 bottom-0 z-[100]"
        ></div>

        <div className="container z-[101] relative flex flex-col items-start justify-center h-full max-w-8xl w-full m-auto md:p-6 p-6">
          <h1 className="text-[#e50914] uppercase md:text-6xl text-4xl font-bold italic">
            {title}
          </h1>

          <div className="detalis flex items-center gap-4 text-white text-[16px] font-[500] mt-6">
            {year && <p>{year}</p>}

            {year && movie?.vote_average && <p className="text-[#fff6]">•</p>}

            {movie?.vote_average && <p>⭐ {movie.vote_average.toFixed(1)}</p>}

            {(year || movie?.vote_average) && movie?.adult !== undefined && (
              <p className="text-[#fff6]">•</p>
            )}

            {movie?.adult !== undefined && <p>{movie.adult ? "+18" : "13+"}</p>}
          </div>

          <p className="text-white text-[16px] font-[500] mt-6 md:max-w-xl">
            {movie?.overview}
          </p>

          <div className="buttons flex items-center gap-4 mt-6">
            <button
              onClick={handleWatchNow}
              className="bg-[#e50914] flex items-center gap-2 text-white text-[16px] font-[500] py-2 px-4 rounded-full hover:bg-[#fff6] hover:text-[#e50914] transition duration-300 ease-in-out"
            >
              {t("watchNow")} <FaPlay />
            </button>

            <Link
              to={`/movie/${movie?.id}`}
              className="bg-[#333] text-white text-[16px] font-[500] py-2 px-4 rounded-full hover:bg-[#fff6] hover:text-[#333] transition duration-300 ease-in-out"
            >
              {t("moreInfo")}
            </Link>
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
    </>
  );
};

export default Hero;
